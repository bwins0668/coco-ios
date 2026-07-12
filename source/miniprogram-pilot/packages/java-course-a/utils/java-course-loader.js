var manifestModule = require('../data/java-course-manifest');
var manifest = manifestModule.manifest;
function getChapterModule(chapterId) {
  switch (chapterId) {
    case 'java-ch01': return require('../data/chapters/java-ch01.js');
    case 'java-ch02': return require('../data/chapters/java-ch02.js');
    case 'java-ch03': return require('../data/chapters/java-ch03.js');
    case 'java-ch04': return require('../data/chapters/java-ch04.js');
    case 'java-ch05': return require('../data/chapters/java-ch05.js');
    case 'java-ch06': return require('../data/chapters/java-ch06.js');
    default: return null;
  }
}
function getManifest() { return manifest; }
function getChapterWithLessons(chapterId) { var mod = getChapterModule(chapterId); if (!mod || !mod.chapter || !mod.lessons) return null; return { chapter: mod.chapter, lessons: mod.lessons }; }
function getLessonById(chapterId, sectionId) { var mod = getChapterModule(chapterId); if (!mod || !mod.lessons) return null; for (var i = 0; i < mod.lessons.length; i++) { if (mod.lessons[i].lessonId === sectionId) return mod.lessons[i]; } return null; }
module.exports = { getManifest: getManifest, getChapterWithLessons: getChapterWithLessons, getLessonById: getLessonById };
