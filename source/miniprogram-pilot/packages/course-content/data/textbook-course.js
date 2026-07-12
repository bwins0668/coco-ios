var sources = require('./sources').sources;
var chapters = require('./manifest').chapters;
var chapterModules = [
  require('../../course-itpass/data/chapter-01.js'),
  require('../../course-itpass/data/chapter-02.js'),
  require('../../course-itpass/data/chapter-03.js'),
  require('../../course-itpass/data/chapter-04.js'),
  require('../../course-itpass/data/chapter-05.js'),
  require('../../course-itpass/data/chapter-06.js'),
  require('../../course-itpass/data/chapter-07.js'),
  require('../../course-itpass/data/chapter-08.js'),
  require('../../course-itpass/data/chapter-09.js'),
  require('../../course-itpass/data/chapter-10.js'),
  require('../../course-sg/data/chapter-01.js'),
  require('../../course-sg/data/chapter-02.js'),
  require('../../course-sg/data/chapter-03.js'),
  require('../../course-sg/data/chapter-04.js'),
  require('../../course-sg/data/chapter-05.js'),
  require('../../course-sg/data/chapter-06.js'),
  require('../../course-sg/data/chapter-07.js'),
  require('../../course-sg/data/chapter-08.js'),
  require('../../course-sg/data/chapter-09.js')
];
var units = [];
chapterModules.forEach(function (chapter) {
  units = units.concat(chapter.units || []);
});
module.exports = { sources: sources, chapters: chapters, units: units };
