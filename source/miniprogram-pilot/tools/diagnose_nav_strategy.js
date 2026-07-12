#!/usr/bin/env node
/**
 * tools/diagnose_nav_strategy.js
 * Focused diagnostic: test 3 navigation strategies from flashcard-deck-select → flashcard-quiz.
 * 
 * Strategy 1: callWxMethod('navigateTo', ...)
 * Strategy 2: callWxMethod('loadSubPackage') + navigateTo
 * Strategy 3: callWxMethod('redirectTo', ...)
 * 
 * Also tests: callWxMethod('getCurrentPages') to verify basic API works.
 * 
 * Usage: node tools/diagnose_nav_strategy.js
 */

'use strict';

const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACTS = path.join(ROOT, 'tools', 'test-artifacts', 'nav-strategy');
if (!fs.existsSync(ARTIFACTS)) fs.mkdirSync(ARTIFACTS, { recursive: true });

let automator;
try { automator = require('miniprogram-automator'); } catch (e) {
  console.error('[FATAL] miniprogram-automator not found'); process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('='.repeat(60));
  console.log('Navigation Strategy Diagnostic');
  console.log('='.repeat(60));

  // 1. Connect
  console.log('\n[1] Connecting to DevTools...');
  let mp;
  for (let i = 0; i < 5; i++) {
    try {
      mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9421', timeout: 15000 });
      console.log('  Connected.');
      break;
    } catch (e) {
      if (i === 4) { console.error('  Cannot connect:', e.message); process.exit(1); }
      await sleep(3000);
    }
  }

  const results = [];

  try {
    // 2. Verify basic callWxMethod works
    console.log('\n[2] Verifying callWxMethod API...');
    try {
      const info = await mp.callWxMethod('getSystemInfoSync');
      console.log('  getSystemInfoSync OK:', info ? 'returned data' : 'null');
    } catch (e) {
      console.log('  getSystemInfoSync FAILED:', e.message);
    }

    // getCurrentPages is a global, not on wx object
    try {
      const pages = await mp.evaluate(() => {
        try { return getCurrentPages().map(p => p.route); } catch(e) { return 'ERROR: ' + e.message; }
      });
      console.log('  getCurrentPages:', Array.isArray(pages) ? pages.length + ' pages: ' + JSON.stringify(pages) : pages);
    } catch (e) {
      console.log('  getCurrentPages FAILED:', String(e));
    }

    // 3. Navigate to flashcard-deck-select page
    console.log('\n[3] Navigating to deck-select page...');
    await mp.callWxMethod('switchTab', { url: '/pages/flashcards/flashcards' });
    await sleep(2000);

    // Tap SG course card to reach deck-select
    let page = await mp.currentPage();
    console.log('  Current:', page ? page.path : 'unknown');

    let sgCards = await page.$$('[data-exam="sg"]');
    if (sgCards && sgCards.length > 0) {
      await sgCards[0].tap();
      await sleep(2000);
    } else {
      // Try text match
      const cards = await page.$$('.course-card');
      for (const c of cards) {
        const t = await c.text();
        if (t && t.indexOf('SG') >= 0) { await c.tap(); break; }
      }
      await sleep(2000);
    }

    page = await mp.currentPage();
    const deckSelectPath = page ? page.path : 'unknown';
    console.log('  On page:', deckSelectPath);

    if (!deckSelectPath || deckSelectPath.indexOf('flashcard-deck-select') < 0) {
      console.log('  Not on deck-select. Trying direct navigateTo...');
      await mp.callWxMethod('navigateTo', {
        url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=sg'
      });
      await sleep(2000);
      page = await mp.currentPage();
      console.log('  After direct nav:', page ? page.path : 'unknown');
    }

    // Get first deck data for the test URL
    let testDeckData = null;
    try {
      const pd = await page.data();
      if (pd && pd.decks && pd.decks.length > 0) {
        testDeckData = pd.decks[0];
        console.log('  First deck:', JSON.stringify(testDeckData));
      }
    } catch (e) {
      console.log('  Could not read page data:', e.message);
    }

    const testUrl = '/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course=sg' +
      (testDeckData ? '&yearId=' + testDeckData.yearId : '') +
      (testDeckData ? '&deckLabel=' + encodeURIComponent(testDeckData.label || 'test') : '');

    console.log('  Test URL:', testUrl);

    // Check page stack before tests
    let stackBefore = [];
    try {
      stackBefore = await mp.evaluate(() => {
        try { return getCurrentPages(); } catch(e) { return []; }
      });
    } catch (e) {}
    console.log('  Page stack before:', Array.isArray(stackBefore) ? stackBefore.length + ' pages' : 'unknown');

    // ===== STRATEGY 1: callWxMethod navigateTo =====
    console.log('\n' + '='.repeat(40));
    console.log('STRATEGY 1: callWxMethod("navigateTo")');
    console.log('='.repeat(40));

    const s1Result = { strategy: 'callWxMethod_navigateTo', success: false, error: '', pageAfter: '' };
    try {
      const start = Date.now();
      await Promise.race([
        mp.callWxMethod('navigateTo', { url: testUrl }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT_10s')), 10000))
      ]);
      const elapsed = Date.now() - start;
      await sleep(2000);
      page = await mp.currentPage();
      s1Result.pageAfter = page ? page.path : 'unknown';
      s1Result.elapsed = elapsed;
      s1Result.success = s1Result.pageAfter.indexOf('flashcard-quiz') >= 0;
      console.log('  Result:', s1Result.success ? 'SUCCESS' : 'FAILED');
      console.log('  Page after:', s1Result.pageAfter);
      console.log('  Elapsed:', elapsed + 'ms');
    } catch (e) {
      s1Result.error = String(e && e.message || e);
      console.log('  Result: FAILED');
      console.log('  Error:', s1Result.error);
    }
    results.push(s1Result);

    // Navigate back for next test
    if (s1Result.success) {
      try { await mp.callWxMethod('navigateBack', { delta: 1 }); await sleep(1000); } catch (_) {}
    }

    // ===== STRATEGY 2: loadSubPackage + navigateTo =====
    console.log('\n' + '='.repeat(40));
    console.log('STRATEGY 2: loadSubPackage + navigateTo');
    console.log('='.repeat(40));

    const s2Result = { strategy: 'loadSubPackage_then_navigateTo', success: false, error: '', pageAfter: '' };
    try {
      // First load the subpackage
      console.log('  Loading quiz subpackage...');
      try {
        await mp.callWxMethod('loadSubPackage', { name: 'quiz' });
        console.log('  loadSubPackage OK');
      } catch (e) {
        console.log('  loadSubPackage failed (may already be loaded):', String(e && e.message || e));
      }

      await sleep(1000);

      // Now navigate
      const start = Date.now();
      await Promise.race([
        mp.callWxMethod('navigateTo', { url: testUrl }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT_10s')), 10000))
      ]);
      const elapsed = Date.now() - start;
      await sleep(2000);
      page = await mp.currentPage();
      s2Result.pageAfter = page ? page.path : 'unknown';
      s2Result.elapsed = elapsed;
      s2Result.success = s2Result.pageAfter.indexOf('flashcard-quiz') >= 0;
      console.log('  Result:', s2Result.success ? 'SUCCESS' : 'FAILED');
      console.log('  Page after:', s2Result.pageAfter);
      console.log('  Elapsed:', elapsed + 'ms');
    } catch (e) {
      s2Result.error = String(e && e.message || e);
      console.log('  Result: FAILED');
      console.log('  Error:', s2Result.error);
    }
    results.push(s2Result);

    // Navigate back for next test
    if (s2Result.success) {
      try { await mp.callWxMethod('navigateBack', { delta: 1 }); await sleep(1000); } catch (_) {}
    }

    // ===== STRATEGY 3: redirectTo =====
    console.log('\n' + '='.repeat(40));
    console.log('STRATEGY 3: callWxMethod("redirectTo")');
    console.log('='.repeat(40));

    const s3Result = { strategy: 'callWxMethod_redirectTo', success: false, error: '', pageAfter: '' };
    try {
      const start = Date.now();
      await Promise.race([
        mp.callWxMethod('redirectTo', { url: testUrl }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT_10s')), 10000))
      ]);
      const elapsed = Date.now() - start;
      await sleep(2000);
      page = await mp.currentPage();
      s3Result.pageAfter = page ? page.path : 'unknown';
      s3Result.elapsed = elapsed;
      s3Result.success = s3Result.pageAfter.indexOf('flashcard-quiz') >= 0;
      console.log('  Result:', s3Result.success ? 'SUCCESS' : 'FAILED');
      console.log('  Page after:', s3Result.pageAfter);
      console.log('  Elapsed:', elapsed + 'ms');
    } catch (e) {
      s3Result.error = String(e && e.message || e);
      console.log('  Result: FAILED');
      console.log('  Error:', s3Result.error);
    }
    results.push(s3Result);

    // ===== BONUS: evaluate wx.navigateTo =====
    console.log('\n' + '='.repeat(40));
    console.log('BONUS: evaluate wx.navigateTo');
    console.log('='.repeat(40));

    // Go back to deck-select first
    if (s3Result.success) {
      try { await mp.callWxMethod('navigateBack', { delta: 1 }); await sleep(1000); } catch (_) {}
    }

    const s4Result = { strategy: 'evaluate_wx_navigateTo', success: false, error: '', pageAfter: '' };
    try {
      const start = Date.now();
      const navResult = await Promise.race([
        mp.evaluate((url) => {
          return new Promise((resolve) => {
            wx.navigateTo({
              url: url,
              success: function(res) { resolve({ success: true, pageId: res.pageId }); },
              fail: function(err) { resolve({ success: false, error: JSON.stringify(err) }); }
            });
          });
        }, testUrl),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT_10s')), 10000))
      ]);
      const elapsed = Date.now() - start;
      console.log('  evaluate result:', JSON.stringify(navResult));
      await sleep(2000);
      page = await mp.currentPage();
      s4Result.pageAfter = page ? page.path : 'unknown';
      s4Result.elapsed = elapsed;
      s4Result.success = navResult.success && s4Result.pageAfter.indexOf('flashcard-quiz') >= 0;
      if (!navResult.success) s4Result.error = navResult.error || 'wx.navigateTo fail';
      console.log('  Result:', s4Result.success ? 'SUCCESS' : 'FAILED');
      console.log('  Page after:', s4Result.pageAfter);
    } catch (e) {
      s4Result.error = String(e && e.message || e);
      console.log('  Result: FAILED');
      console.log('  Error:', s4Result.error);
    }
    results.push(s4Result);

    // ===== SUMMARY =====
    console.log('\n' + '='.repeat(60));
    console.log('FINAL SUMMARY');
    console.log('='.repeat(60));

    for (const r of results) {
      console.log(`\n  ${r.strategy}:`);
      console.log(`    success: ${r.success}`);
      console.log(`    page: ${r.pageAfter || 'N/A'}`);
      if (r.elapsed) console.log(`    elapsed: ${r.elapsed}ms`);
      if (r.error) console.log(`    error: ${r.error}`);
    }

    const anySuccess = results.some(r => r.success);
    console.log('\n' + '='.repeat(60));
    console.log('DIAGNOSIS:');
    console.log('='.repeat(60));
    if (results[0].success) {
      console.log('  callWxMethod navigateTo works → issue is automator .tap() compatibility');
      console.log('  FIX: Use callWxMethod in e2e tests instead of .tap()');
    } else if (results[1].success) {
      console.log('  loadSubPackage + navigateTo works → subpackage not preloaded');
      console.log('  FIX: Load subpackage before navigateTo in e2e tests');
    } else if (results[2].success) {
      console.log('  redirectTo works → navigateTo has a constraint issue');
      console.log('  FIX: Use redirectTo in e2e tests');
    } else if (results[3].success) {
      console.log('  evaluate wx.navigateTo works → callWxMethod has API issue');
      console.log('  FIX: Use evaluate for navigation in e2e tests');
    } else {
      console.log('  ALL STRATEGIES FAILED → deep navigation issue');
      console.log('  Check page stack, subpackage registration, or WeChat DevTools version');
    }
    console.log('='.repeat(60));

    // Save report
    const reportFile = path.join(ARTIFACTS, 'nav-strategy-report.json');
    fs.writeFileSync(reportFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      testUrl,
      results,
      diagnosis: anySuccess ? results.find(r => r.success)?.strategy : 'ALL_FAILED'
    }, null, 2));
    console.log('\nReport:', reportFile);

  } finally {
    try { mp.close(); } catch (_) {}
  }
}

run().catch(e => { console.error('[FATAL]', e); process.exit(1); });
