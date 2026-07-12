#!/usr/bin/env node
'use strict';

/*
 * Ordinary DevTools simulator verification for today's home + flashcard-center
 * polish. It deliberately stops before any deck/player route.
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var ARTIFACTS = path.join(ROOT, 'tools', 'test-artifacts', 'ui-polish-today');
var REPORT_FILE = path.join(ARTIFACTS, 'ui-polish-report.json');
var automator;
try {
  automator = require('miniprogram-automator');
} catch (error) {
  console.error('miniprogram-automator unavailable: ' + error.message);
  process.exit(1);
}

fs.mkdirSync(ARTIFACTS, { recursive: true });
var report = {
  timestamp: new Date().toISOString(),
  status: 'RUNNING',
  passed: 0,
  failed: 0,
  skipped: 0,
  steps: [],
  screenshots: [],
  consoleErrors: []
};

function sleep(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
function withTimeout(promise, timeoutMs, label) {
  return Promise.race([
    promise,
    new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error((label || 'operation') + ' timeout')); }, timeoutMs);
    })
  ]);
}
function record(status, step, detail) {
  report[status.toLowerCase()]++;
  report.steps.push({ status: status, step: step, detail: String(detail || '') });
  console.log('[' + status + '] ' + step + (detail ? ': ' + detail : ''));
}
function pass(step, detail) { record('PASSED', step, detail); }
function fail(step, detail) { record('FAILED', step, detail); }
function skip(step, detail) { record('SKIPPED', step, detail); }

async function waitForPath(mp, expected, timeoutMs) {
  var deadline = Date.now() + timeoutMs;
  var page = null;
  while (Date.now() < deadline) {
    page = await mp.currentPage();
    if (page && String(page.path || '').indexOf(expected) >= 0) return page;
    await sleep(250);
  }
  return page || mp.currentPage();
}

async function capture(mp, fixedName) {
  var file = path.join(ARTIFACTS, fixedName);
  try {
    var blob = await withTimeout(mp.screenshot(), 8000, 'screenshot ' + fixedName);
    fs.writeFileSync(file, blob, 'base64');
    report.screenshots.push(file);
    pass('screenshot-' + fixedName, file);
  } catch (error) {
    skip('screenshot-' + fixedName, error.message || error);
  }
}

async function goHome(mp) {
  await mp.evaluate(function () {
    return new Promise(function (resolve) { wx.reLaunch({ url: '/pages/home/home', complete: resolve }); });
  });
  var page = await waitForPath(mp, 'pages/home/home', 8000);
  if (!page || String(page.path || '').indexOf('pages/home/home') < 0) throw new Error('home route=' + (page && page.path || 'none'));
  return page;
}

async function goFlashcards(mp) {
  await mp.evaluate(function () {
    return new Promise(function (resolve) { wx.switchTab({ url: '/pages/flashcards/flashcards', complete: resolve }); });
  });
  var page = await waitForPath(mp, 'pages/flashcards/flashcards', 8000);
  if (!page || String(page.path || '').indexOf('pages/flashcards/flashcards') < 0) throw new Error('flashcards route=' + (page && page.path || 'none'));
  return page;
}

async function count(page, selector) {
  var nodes = await page.$$(selector);
  return nodes ? nodes.length : 0;
}

async function main() {
  var mp;
  try {
    mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9421', timeout: 15000 });
    pass('connect', 'ordinary DevTools automation connected');
    mp.on('console', function (message) {
      if (message && (message.type === 'error' || message.type === 'warn')) {
        report.consoleErrors.push({ type: message.type, text: String(message.text || message.message || '').slice(0, 500) });
      }
    });

    var home = await goHome(mp);
    var itpassCards = await count(home, '.entry-card-itpass');
    var mistakesCards = await count(home, '.entry-card-mistakes');
    if (itpassCards !== 1 || mistakesCards !== 1) throw new Error('home entry counts itpass=' + itpassCards + ' mistakes=' + mistakesCards);
    pass('home-visible', 'IT Passport and mistakes entries visible');
    await capture(mp, '02-home-after.png');

    await mp.evaluate(function () {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      page.setData({ isNavigating: true, navigationTarget: 'itpass' });
    });
    await sleep(120);
    var homePressedPage = await mp.currentPage();
    var homeTarget = await homePressedPage.data('navigationTarget');
    if (homeTarget !== 'itpass') throw new Error('home pressed state missing: ' + homeTarget);
    pass('home-pressed-state', 'target IT Passport entered navigation feedback state');
    await capture(mp, '05-home-pressed-state.png');
    await mp.evaluate(function () {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      page.setData({ isNavigating: false, navigationTarget: '' });
    });

    var flashcards = await goFlashcards(mp);
    var modules = await count(flashcards, '.course-card');
    var icons = await count(flashcards, '.course-icon-glyph');
    var documentIcons = await count(flashcards, '.course-icon-glyph-document');
    var shieldIcons = await count(flashcards, '.course-icon-glyph-shield');
    var stackIcons = await count(flashcards, '.course-icon-glyph-stack');
    if (modules !== 3 || icons !== 3 || documentIcons !== 1 || shieldIcons !== 1 || stackIcons !== 1) {
      throw new Error('flashcard modules/icons=' + modules + '/' + icons + ' document=' + documentIcons + ' shield=' + shieldIcons + ' stack=' + stackIcons);
    }
    pass('flashcards-visible', 'three real local module icons visible');
    await capture(mp, '04-flashcards-after.png');

    await mp.evaluate(function () {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      page.setData({ isNavigating: true, navigatingCourse: 'itpass' });
    });
    await sleep(120);
    var flashPressedPage = await mp.currentPage();
    var flashTarget = await flashPressedPage.data('navigatingCourse');
    if (flashTarget !== 'itpass') throw new Error('flashcard pressed state missing: ' + flashTarget);
    pass('flashcard-pressed-state', 'target IT Passport module entered navigation feedback state');
    await capture(mp, '06-flashcard-module-pressed-state.png');
    await mp.evaluate(function () {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      page.setData({ isNavigating: false, navigatingCourse: '' });
    });

    var fatalConsole = report.consoleErrors.filter(function (item) {
      return item.type === 'error' && /home|flashcard|course-icon|navigation/i.test(item.text);
    });
    if (fatalConsole.length) fail('console', 'new home/flashcard errors=' + fatalConsole.length);
    else pass('console', 'no new home/flashcard console errors captured');
  } catch (error) {
    fail('ui-flow', error && error.stack || error);
  }

  report.status = report.failed ? 'FAILED' : 'PASSED';
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log('REPORT: ' + REPORT_FILE);
  console.log('STATUS: ' + report.status + ' passed=' + report.passed + ' failed=' + report.failed + ' skipped=' + report.skipped);
  process.exit(report.failed ? 1 : 0);
}

main().catch(function (error) {
  fail('unhandled', error && error.stack || error);
  report.status = 'FAILED';
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  process.exit(1);
});
