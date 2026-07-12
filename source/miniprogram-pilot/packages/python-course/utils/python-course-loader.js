var manifestModule = require('../data/python-course-manifest');
var manifest = manifestModule.manifest;

function getChapterModule(chapterId) {
  switch (chapterId) {
    case 'python-gs-ch01':
      return require('../data/chapters/python-gs-ch01.js');
    default:
      return null;
  }
}

function getManifest() {
  return manifest;
}

function getChapterWithLessons(chapterId) {
  var mod = getChapterModule(chapterId);
  if (!mod || !mod.chapter || !mod.lessons) return null;
  return { chapter: mod.chapter, lessons: mod.lessons };
}

function getLessonById(chapterId, sectionId) {
  var mod = getChapterModule(chapterId);
  if (!mod || !mod.lessons) return null;
  for (var i = 0; i < mod.lessons.length; i += 1) {
    if (mod.lessons[i].lessonId === sectionId) return mod.lessons[i];
  }
  return null;
}

function getFirstLessonRoute() {
  var chapters = manifest.chapters || [];
  if (!chapters.length || !chapters[0].sections || !chapters[0].sections.length) return '';
  return chapters[0].sections[0].lessonRoute || '';
}

module.exports = {
  getManifest: getManifest,
  getChapterWithLessons: getChapterWithLessons,
  getLessonById: getLessonById,
  getFirstLessonRoute: getFirstLessonRoute
};
