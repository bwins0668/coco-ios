var manifestModule = require('../data/java-course-manifest');
var manifest = manifestModule.manifest;
function getManifest() { return manifest; }
function getFirstLessonRoute() { var firstChapter = manifest.chapters[0]; if (!firstChapter || !firstChapter.sections || !firstChapter.sections[0]) return ''; return firstChapter.sections[0].lessonRoute || ''; }
function getChapterWithLessons() { return null; }
function getLessonById() { return null; }
module.exports = { getManifest: getManifest, getFirstLessonRoute: getFirstLessonRoute, getChapterWithLessons: getChapterWithLessons, getLessonById: getLessonById };
