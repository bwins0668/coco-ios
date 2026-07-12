var manifestModule = require('../data/java-course-manifest');
var manifest = manifestModule.manifest;
function getChapterModule(chapterId) {
  switch (chapterId) {
    case 'java-ch14': return require('../data/chapters/java-ch14.js');
    case 'java-ch15': return require('../data/chapters/java-ch15.js');
    case 'java-ch16': return require('../data/chapters/java-ch16.js');
    case 'java-ch17': return require('../data/chapters/java-ch17.js');
    case 'java-ch18': return require('../data/chapters/java-ch18.js');
    case 'java-ch19': return require('../data/chapters/java-ch19.js');
    default: return null;
  }
}
function getManifest() { return manifest; }
function getChapterWithLessons(chapterId) { var mod = getChapterModule(chapterId); if (!mod || !mod.chapter || !mod.lessons) return null; return { chapter: mod.chapter, lessons: mod.lessons }; }
function getLessonById(chapterId, sectionId) { var mod = getChapterModule(chapterId); if (!mod || !mod.lessons) return null; for (var i = 0; i < mod.lessons.length; i++) { if (mod.lessons[i].lessonId === sectionId) return mod.lessons[i]; } return null; }
module.exports = { getManifest: getManifest, getChapterWithLessons: getChapterWithLessons, getLessonById: getLessonById };
