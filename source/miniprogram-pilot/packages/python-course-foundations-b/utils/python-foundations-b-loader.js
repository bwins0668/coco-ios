var manifestModule = require('../data/python-foundations-b-manifest');
var manifest = manifestModule.manifest;

function getChapterModule(chapterId) {
  switch (chapterId) {
    case 'python-foundations-b-ch01':
      return require('../data/chapters/python-foundations-b-ch01.js');
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

module.exports = {
  getManifest: getManifest,
  getChapterWithLessons: getChapterWithLessons,
  getLessonById: getLessonById
};
