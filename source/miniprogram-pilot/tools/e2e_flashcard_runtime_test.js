#!/usr/bin/env node
'use strict';

/*
 * Real WeChat DevTools E2E for the V2 flashcard formal path.
 * It deliberately uses the visible course/deck controls rather than the legacy
 * flashcard-quiz route. Artifacts are ignored by Git.
 */

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ARTIFACTS = path.join(ROOT, 'tools', 'test-artifacts', 'flashcard-v2-runtime');
const REPORT_FILE = path.join(ARTIFACTS, 'e2e-report.json');
const SENTINELS = [
  { course: 'sg', title: 'SG', packageRoot: 'packages/quiz-sg-1', expectedMin: 1 },
  { course: 'itpass', title: 'IT Passport', packageRoot: 'packages/quiz-itpass-1', expectedMin: 1 }
];

if (!fs.existsSync(ARTIFACTS)) fs.mkdirSync(ARTIFACTS, { recursive: true });

let automator;
try {
  automator = require('miniprogram-automator');
} catch (error) {
  console.error('[FATAL] miniprogram-automator not found: ' + error.message);
  process.exit(1);
}

const report = {
  timestamp: new Date().toISOString(),
  status: 'RUNNING',
  gateStatus: 'BLOCKED_ON_FLASHCARD_RUNTIME',
  passed: 0,
  failed: 0,
  skipped: 0,
  steps: [],
  screenshots: [],
  consoleErrors: []
};

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
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
  report.steps.push({ status, step, detail: String(detail || '') });
  console.log('[' + status + '] ' + step + (detail ? ': ' + detail : ''));
}
function pass(step, detail) { record('PASSED', step, detail); }
function fail(step, detail) { record('FAILED', step, detail); }
function skip(step, detail) { record('SKIPPED', step, detail); }

async function currentPath(mp) {
  const page = await mp.currentPage();
  return page && page.path ? page.path : '';
}

async function waitForPath(mp, fragment, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let page = null;
  while (Date.now() < deadline) {
    page = await mp.currentPage();
    if (page && String(page.path || '').indexOf(fragment) >= 0) return page;
    await sleep(500);
  }
  return page || await mp.currentPage();
}

async function waitForData(page, key, predicate, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let value;
  while (Date.now() < deadline) {
    try { value = await page.data(key); } catch (_) { value = undefined; }
    if (predicate(value)) return { ok: true, value };
    await sleep(400);
  }
  return { ok: false, value };
}

async function takeScreenshot(mp, name) {
  if (process.env.FLASHCARD_E2E_CAPTURE !== '1') {
    skip('screenshot-' + name, 'disabled for runtime stability; Minium runner captures evidence');
    return;
  }
  try {
    const blob = await withTimeout(mp.screenshot(), 8000, 'screenshot');
    const file = path.join(ARTIFACTS, Date.now() + '_' + name.replace(/[^a-zA-Z0-9_-]/g, '_') + '.png');
    fs.writeFileSync(file, blob, 'base64');
    report.screenshots.push(file);
    console.log('[SHOT] ' + file);
  } catch (error) {
    skip('screenshot-' + name, error.message || error);
  }
}

async function switchToFlashcardCenter(mp) {
  await mp.evaluate(() => new Promise(resolve => wx.reLaunch({ url: '/pages/home/home', complete: resolve })));
  let page = await waitForPath(mp, 'pages/home/home', 8000);
  if (String(page && page.path || '').indexOf('pages/home/home') < 0) {
    await mp.callWxMethod('reLaunch', { url: '/pages/home/home' });
    page = await waitForPath(mp, 'pages/home/home', 8000);
  }
  if (String(page && page.path || '').indexOf('pages/home/home') < 0) {
    throw new Error('did not reach home before flashcard center: ' + (page && page.path || 'none'));
  }
  await mp.evaluate(() => new Promise(resolve => wx.switchTab({ url: '/pages/flashcards/flashcards', complete: resolve })));
  page = await waitForPath(mp, 'pages/flashcards/flashcards', 8000);
  if (String(page && page.path || '').indexOf('pages/flashcards/flashcards') < 0) {
    await mp.callWxMethod('switchTab', { url: '/pages/flashcards/flashcards' });
    page = await waitForPath(mp, 'pages/flashcards/flashcards', 8000);
  }
  if (String(page && page.path || '').indexOf('pages/flashcards/flashcards') < 0) {
    throw new Error('did not reach flashcard center: ' + (page && page.path || 'none'));
  }
  return page;
}

async function tapCourse(page, course) {
  const cards = await page.$$('.course-card');
  if (!cards || !cards.length) throw new Error('course cards not found');
  const matcher = course === 'sg' ? /(^|\s)SG(\s|$)|SG 闪卡/ : /IT Passport|IT\s*闪卡/;
  for (let i = 0; i < cards.length; i++) {
    const text = await cards[i].text();
    if (matcher.test(String(text || ''))) {
      await cards[i].tap();
      return;
    }
  }
  throw new Error('course card not found for ' + course);
}

async function tapFirstDeck(mp) {
  const page = await mp.currentPage();
  const decks = await page[String.fromCharCode(36, 36)]('.fds-deck-card');
  if (!decks || !decks.length) throw new Error('deck cards not found');
  const label = String(await decks[0].text() || '');
  await decks[0].tap();
  await sleep(300);
  return { page: page, label: label };
}

async function tapButtonContaining(page, fragment) {
  const buttons = await page.$$('.fc-btn');
  for (let i = 0; i < (buttons || []).length; i++) {
    const text = String(await buttons[i].text() || '');
    if (text.indexOf(fragment) >= 0) {
      await buttons[i].tap();
      return true;
    }
  }
  return false;
}

async function runSentinel(mp, sentinel) {
  const prefix = sentinel.course;
  let page;
  try {
    page = await switchToFlashcardCenter(mp);
    pass(prefix + '-center', 'flashcard center visible');
    await takeScreenshot(mp, prefix + '_01_center');
  } catch (error) {
    fail(prefix + '-center', error.message || error);
    return;
  }

  try {
    await tapCourse(page, sentinel.course);
    page = await waitForPath(mp, 'flashcard-deck-select', 8000);
    if (String(page && page.path || '').indexOf('flashcard-deck-select') < 0) throw new Error('deck select path=' + (page && page.path || 'none'));
    const decks = await waitForData(page, 'decks', value => Array.isArray(value) && value.length > 0, 6000);
    if (!decks.ok) throw new Error('deck data unavailable');
    pass(prefix + '-deck-select', 'visible decks=' + decks.value.length);
    await takeScreenshot(mp, prefix + '_02_deck_select');
  } catch (error) {
    fail(prefix + '-deck-select', error.message || error);
    return;
  }

  try {
    var loaded = false;
    var loadDetail = '';
    for (var attempt = 1; attempt <= 2 && !loaded; attempt++) {
      if (attempt > 1) {
        // Retry the visible route from a fresh tab state; never direct-jump to player.
        page = await switchToFlashcardCenter(mp);
        await tapCourse(page, sentinel.course);
        page = await waitForPath(mp, 'flashcard-deck-select', 8000);
        var retryDecks = await waitForData(page, 'decks', value => Array.isArray(value) && value.length > 0, 6000);
        if (!retryDecks.ok) throw new Error('retry deck data unavailable');
      }

      await tapFirstDeck(mp);
      var candidate = await waitForPath(mp, sentinel.packageRoot + '/pages/flashcard-player', 12000);
      if (String(candidate && candidate.path || '').indexOf('flashcard-player') < 0) {
        var inFlight = '';
        var navigationDiagnostic = '';
        try {
          inFlight = await candidate.data('isNavigating');
          navigationDiagnostic = await candidate.data('lastNavigationDiagnostic');
        } catch (_) {}
        loadDetail = 'attempt=' + attempt + ' route=' + (candidate && candidate.path || 'none') + ' isNavigating=' + inFlight + ' diagnostic=' + (navigationDiagnostic || 'none');
        continue;
      }

      var state = await waitForData(candidate, 'viewState', value => value === 'content' || value === 'error' || value === 'empty', 12000);
      if (!state.ok) {
        loadDetail = 'attempt=' + attempt + ' player state timeout=' + state.value;
        continue;
      }
      if (state.value !== 'content') {
        var errorDetail = await candidate.data('errorDetail');
        loadDetail = 'attempt=' + attempt + ' player state=' + state.value + ' detail=' + (errorDetail || '');
        continue;
      }

      var total = await candidate.data('totalCards');
      var actual = await candidate.data('playableCountActual');
      var expected = await candidate.data('playableCountExpected');
      if (!(total >= sentinel.expectedMin) || actual !== expected || total !== actual) {
        loadDetail = 'attempt=' + attempt + ' count contract total=' + total + ' actual=' + actual + ' expected=' + expected;
        continue;
      }
      page = candidate;
      loaded = true;
      pass(prefix + '-player-load', 'attempt=' + attempt + ' total=' + total + ' expected=' + expected);
      await takeScreenshot(mp, prefix + '_03_player');
    }
    if (!loaded) throw new Error('player did not load after 2 visible-route attempts: ' + loadDetail);
  } catch (error) {
    fail(prefix + '-player-load', error.message || error);
    return;
  }

  try {
    const options = await page.$$('.fc-option');
    if (!options || !options.length) throw new Error('answer options not visible');
    await options[0].tap();
    const answered = await waitForData(page, 'hasAnswered', value => value === true, 5000);
    if (!answered.ok) throw new Error('answer state did not appear');
    const selected = await page.data('selectedOption');
    const correct = await page.data('correctOption');
    if (!selected || !correct || !selected.textJa || !correct.textJa) throw new Error('selected/correct option text missing');
    pass(prefix + '-answer', 'answer feedback includes selected + correct option');
    await takeScreenshot(mp, prefix + '_04_answer');
  } catch (error) {
    fail(prefix + '-answer', error.message || error);
    return;
  }

  try {
    const clicked = await tapButtonContaining(page, '解析');
    if (!clicked) throw new Error('explanation button not found');
    const shown = await waitForData(page, 'showBack', value => value === true, 5000);
    if (!shown.ok) throw new Error('explanation state did not appear');
    pass(prefix + '-explanation', 'back side displayed');
    await takeScreenshot(mp, prefix + '_05_explanation');
  } catch (error) {
    fail(prefix + '-explanation', error.message || error);
    return;
  }

  try {
    const before = await page.data('currentIndex');
    const clicked = await tapButtonContaining(page, '下一题');
    if (!clicked) throw new Error('next button not found');
    const advanced = await waitForData(page, 'currentIndex', value => value === before + 1, 5000);
    if (!advanced.ok) throw new Error('next card did not advance from ' + before + ' to ' + advanced.value);
    const answeredAfter = await page.data('hasAnswered');
    if (answeredAfter) throw new Error('answer state was not reset on next card');
    pass(prefix + '-next', 'advanced to card ' + (before + 2));
  } catch (error) {
    fail(prefix + '-next', error.message || error);
  }

  try {
    // Use the player's own back handler first. This exercises the same code as
    // the visible return action and is less flaky than a bare automation call.
    await mp.evaluate(() => {
      var pages = getCurrentPages();
      var current = pages[pages.length - 1];
      if (current && typeof current.goBack === 'function') current.goBack();
      else wx.navigateBack({ delta: 1 });
    });
    page = await waitForPath(mp, 'flashcard-deck-select', 6000);
    if (String(page && page.path || '').indexOf('flashcard-deck-select') < 0) {
      await mp.evaluate(() => new Promise(resolve => wx.navigateBack({ delta: 1, complete: resolve })));
      page = await waitForPath(mp, 'flashcard-deck-select', 6000);
    }
    if (String(page && page.path || '').indexOf('flashcard-deck-select') < 0) throw new Error('return path=' + (page && page.path || 'none'));
    pass(prefix + '-return', 'returned to deck select');
  } catch (error) {
    fail(prefix + '-return', error.message || error);
  }
}

async function main() {
  let mp;
  try {
    mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9421', timeout: 15000 });
    pass('connect', 'DevTools automation connected');
    mp.on('console', msg => {
      if (msg && (msg.type === 'error' || msg.type === 'warn')) {
        report.consoleErrors.push({ type: msg.type, text: String(msg.text || msg.message || '').slice(0, 500) });
      }
    });
  } catch (error) {
    fail('connect', error.message || error);
    finish(1);
    return;
  }

  for (const sentinel of SENTINELS) await runSentinel(mp, sentinel);

  const fatalConsole = report.consoleErrors.filter(item => /cannot find module|module.*not found|past_exam_bank|flashcard.*(error|fail)/i.test(item.text));
  if (fatalConsole.length) fail('console', 'runtime flashcard/cross-package errors=' + fatalConsole.length);
  else pass('console', 'no captured cross-package flashcard errors');

  finish(report.failed ? 1 : 0);
}

function finish(exitCode) {
  report.status = report.failed ? 'FAILED' : 'PASSED';
  report.gateStatus = report.failed ? 'BLOCKED_ON_FLASHCARD_RUNTIME' : 'READY_FOR_USER_PROOF';
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log('REPORT: ' + REPORT_FILE);
  console.log('STATUS: ' + report.gateStatus + ' | passed=' + report.passed + ' failed=' + report.failed + ' skipped=' + report.skipped);
  process.exit(exitCode);
}

main().catch(error => {
  fail('unhandled', error && error.stack || error);
  finish(1);
});
