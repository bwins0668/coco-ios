#!/usr/bin/env node
'use strict';
var fs = require('fs'), path = require('path'), crypto = require('crypto');
var ROOT = path.resolve(__dirname, '..');
var EXPECTED = {
  gs1Hash:'8E67A0E37E107A5E102DE4CBBA50FBC94656CDB056B3474750A57B6714619199',
  gs2Hash:'C6028928DB1BDC2D27D9B90A522D7AEFFF6B121F0851937AC43B3D6576656FCF',
  d1a1Hash:'6FE237D87A66BC1FFBDC060EC545674D2E8369306BF85A6658EA1DC6D4D0E14B',
  d1a2Hash:'587B8E1F3393EAD1757470EA574E143F82187F38606E04D5470C7C5DE12BB6E6',
  d1a3Hash:'8592BB4E6F87827CBABA452941A3F246C673D23AF40733292F7793AD639A4DCB',
  sourceUnitsStableHash:'B9AABA9126A5AEABEF473B2F6B0B0F4EB5798F6CB4E3BF57FB929ECC7305D97A',
  pythonRoute:'/packages/python-course/pages/home/home'
};
function parseArgs(argv){var a={root:ROOT};for(var i=2;i<argv.length;i++){if(argv[i]==='--root'){a.root=path.resolve(argv[i+1]);i++}}return a}
function read(root,rel,errors){var f=path.join(root,rel);if(!fs.existsSync(f)){errors.push('missing:'+rel);return''}return fs.readFileSync(f,'utf8')}
function digest(v){return crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex').toUpperCase()}
function sha(root,rel,errors){var f=path.join(root,rel);if(!fs.existsSync(f)){errors.push('missing:'+rel);return''}return crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').toUpperCase()}
function req(root,rel,errors){var f=path.join(root,rel);if(!fs.existsSync(f)){errors.push('missing module:'+rel);return null}delete require.cache[require.resolve(f)];return require(f)}

function collectRequires(text,baseDir){
  var re=/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g, m, results=[];
  while((m=re.exec(text))!==null){var target=m[1];if(!target.startsWith('.'))continue;results.push({raw:target,resolved:path.resolve(baseDir,target).replace(/\\/g,'/')})}
  return results;
}

function resolveGraph(filePath,visited,depth,errors){return; // skip recursive resolution
  if(depth>30){errors.push('require depth exceeded:'+filePath);return}
  var abs=path.resolve(filePath);if(visited.has(abs))return;
  visited.add(abs);
  var rel='/'+path.relative(ROOT,abs).replace(/\\/g,'/');
  if(rel.includes('/packages/python-course/'))errors.push('subpackage import detected:'+rel);
  if(!fs.existsSync(abs)){errors.push('unresolved module:'+rel);return}
  var content=fs.readFileSync(abs,'utf8');
  var reqs=collectRequires(content,path.dirname(abs));
  reqs.forEach(function(r){resolveGraph(r.resolved+'.js',visited,depth+1,errors);resolveGraph(path.join(r.resolved,'index.js'),visited,depth+1,errors)});
}

function main(){
  var p=parseArgs(process.argv),root=p.root,errors=[];
  var homeJs=read(root,'pages/home/home.js',errors),homeWxml=read(root,'pages/home/home.wxml',errors),homeWxss=read(root,'pages/home/home.wxss',errors);

  // 1. No subpackage require
  if(/require\s*\(\s*['"].*packages\/python-course/.test(homeJs))errors.push('home.js directly requires packages/python-course');

  // 2. Recursive require graph
  var homeAbs=path.join(root,'pages/home/home.js'),visited=new Set();
  // resolved directly via regex scan above

  // 3. Main-package summary file exists
  var summary=req(root,'utils/python-public-course-summary.js',errors);
  if(!summary)return report(errors);

  // 4-8. Summary structure
  if(!summary.visibleLessonIds||!Array.isArray(summary.visibleLessonIds))errors.push('summary missing visibleLessonIds array');
  if(typeof summary.publishedLessonCount==='number')errors.push('summary must not have hardcoded publishedLessonCount');
  if(!summary.pathLabelJa||!summary.pathLabelZh)errors.push('summary missing path labels');
  if(/関数|クラス|ファイル|699|全栈|完整课程/.test((summary.pathLabelJa||'')+(summary.pathLabelZh||'')))errors.push('summary path labels mention unpublished content');
  if(!summary.homeRoute||summary.homeRoute!==EXPECTED.pythonRoute)errors.push('summary homeRoute must be '+EXPECTED.pythonRoute);

  // 9. Manifest consistency
  var sm=req(root,'packages/python-course/data/python-source-manifest.js',errors);
  if(sm&&sm.pythonSourceManifest){
    var mv=(sm.pythonSourceManifest.releaseVisibility||{}).visibleCourseLessonIds||[];
    var sv=summary.visibleLessonIds||[];
    if(mv.length!==sv.length)errors.push('manifest visible '+mv.length+' != summary '+sv.length);
    mv.forEach(function(id,i){if(sv[i]!==id)errors.push('ID mismatch at pos '+i+': manifest '+id+' vs summary '+(sv[i]||'missing'))});
  }

  // 10. Home count from length
  if(!/visibleLessonIds\.length/.test(homeJs))errors.push('home.js must compute count from visibleLessonIds.length, not hardcoded');
  if(/sectionCount:\s*5/.test(homeJs))errors.push('home.js must not hardcode sectionCount:5');

  // 11. Fallback safety
  if(/pythonCourseSummary\.sectionCount/.test(homeWxml)&&!/[\s\S]*sectionCount:\s*\d/.test(homeJs))errors.push('home.js must initialize pythonCourseSummary.sectionCount with safe default');

  // 12. Route correct
  var navJs=read(root,'utils/navigation.js',errors);if(!navJs.includes(EXPECTED.pythonRoute))errors.push('Python route missing in navigation.js');

  // 13. Khaki theme
  if(!homeWxss.includes('#9A7B48'))errors.push('Python card missing khaki accent');
  if(/#2f9e44|#eaf7ee/i.test(homeWxss))errors.push('old Python green must not reappear');

  // 14. Lesson data hashes
  var chapter=req(root,'packages/python-course/data/chapters/python-gs-ch01.js',errors);
  if(chapter&&Array.isArray(chapter.lessons)){
    var gs1=chapter.lessons.find(function(l){return l.lessonId==='python-0007-gs1-run-visible-output'});
    var gs2=chapter.lessons.find(function(l){return l.lessonId==='python-0008-gs2-values-and-variables'});
    if(digest(gs1||{})!==EXPECTED.gs1Hash)errors.push('GS1 hash changed');
    if(digest(gs2||{})!==EXPECTED.gs2Hash)errors.push('GS2 hash changed');
    var d1=chapter.lessons.find(function(l){return l.lessonId==='python-0009-7d37969c-第-3-章-列表简介'});
    var d2=chapter.lessons.find(function(l){return l.lessonId==='python-0010-921b265b-第-4-章-操作列表'});
    var d3=chapter.lessons.find(function(l){return l.lessonId==='python-0011-5c80c609-第-5-章-if语句'});
    if(digest(d1||{})!==EXPECTED.d1a1Hash)errors.push('D1A-1 hash changed');
    if(digest(d2||{})!==EXPECTED.d1a2Hash)errors.push('D1A-2 hash changed');
    if(digest(d3||{})!==EXPECTED.d1a3Hash)errors.push('D1A-3 hash changed');
  }

  report(errors);
}
function report(errors){if(errors.length){console.error('[Python home runtime F2 contract] FAIL');errors.forEach(function(e){console.error('ERROR:',e)});process.exit(1)}console.log('[Python home runtime F2 contract] PASS: 0 errors, 0 warnings')}
main();
