var manifestModule = require('../data/java-course-manifest');
var manifest = manifestModule.manifest;
function getChapterModule(chapterId) {
  switch (chapterId) {
    case 'java-ch07': return require('../data/chapters/java-ch07.js');
    case 'java-ch08': return require('../data/chapters/java-ch08.js');
    case 'java-ch09': return require('../data/chapters/java-ch09.js');
    case 'java-ch10': return require('../data/chapters/java-ch10.js');
    case 'java-ch11': return require('../data/chapters/java-ch11.js');
    case 'java-ch12': return require('../data/chapters/java-ch12.js');
    case 'java-ch13': return require('../data/chapters/java-ch13.js');
    default: return null;
  }
}
function getManifest() { return manifest; }
function getChapterWithLessons(chapterId) { var mod = getChapterModule(chapterId); if (!mod || !mod.chapter || !mod.lessons) return null; return { chapter: mod.chapter, lessons: mod.lessons }; }
function getLessonById(chapterId, sectionId) { var mod = getChapterModule(chapterId); if (!mod || !mod.lessons) return null; for (var i = 0; i < mod.lessons.length; i++) { if (mod.lessons[i].lessonId === sectionId) return mod.lessons[i]; } return null; }
module.exports = { getManifest: getManifest, getChapterWithLessons: getChapterWithLessons, getLessonById: getLessonById };
