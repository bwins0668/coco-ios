const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const pilotRoot = path.join(repoRoot, 'source/miniprogram-pilot');
const outDir = path.join(repoRoot, 'ios/CoCoiOS/Resources/CourseData');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function loadManifest(filePath) {
  const resolved = path.resolve(filePath);
  delete require.cache[resolved];
  return require(resolved);
}

function getData(obj) {
  return obj.manifest || obj;
}

function parseChapters(courseId, manifest) {
  const raw = manifest.chapters || manifest.chapter || [];
  return raw.map((cfg, idx) => {
    const ch = typeof cfg === 'string' ? { id: cfg, title: { zh: cfg } } : cfg;

    // Flatten sections from either direct sections[] or sectionGroups[].units[]
    let sectionList = [];
    if (Array.isArray(ch.sections)) {
      sectionList = ch.sections;
    } else if (Array.isArray(ch.sectionGroups)) {
      sectionList = ch.sectionGroups.flatMap((sg, gi) =>
        (sg.units || []).map((u, ui) => ({
          sectionId: u.id || `${ch.chapterId || idx}-sg${gi}-u${ui}`,
          lessonId: u.id || `${ch.chapterId || idx}-sg${gi}-u${ui}`,
          order: (sg.units.length) * gi + ui + 1,
          title: {
            zh: u.titleZh || u.title?.zh || sg.titleZh || sg.sectionGroupTitleZh || `第${gi+1}-${ui+1}节`,
            ja: u.titleJa || u.title?.ja || sg.titleJa || sg.sectionGroupTitleJa || `第${gi+1}-${ui+1}節`
          },
          lessonKind: u.lessonKind || 'text',
          lessonRoute: u.lessonRoute || sg.lessonRoute || ch.chapterRoute || ''
        }))
      );
    }

    const sections = sectionList.map((s, i) => ({
      sectionId: s.sectionId || `${ch.chapterId || idx}-s${i}`,
      lessonId: s.lessonId || s.sectionId || `${ch.chapterId || idx}-s${i}`,
      order: s.order || i + 1,
      title: {
        zh: (s.title && s.title.zh) || s.titleZh || ch.title?.zh || ch.titleZh || `第${i+1}节`,
        ja: (s.title && s.title.ja) || s.titleJa || ch.title?.ja || ch.titleJa || `第${i+1}節`
      },
      lessonKind: s.lessonKind || 'text',
      lessonRoute: s.lessonRoute || ch.chapterRoute || ''
    }));

    return {
      chapterId: ch.chapterId || ch.id || `${courseId}-ch${idx+1}`,
      chapterOrder: ch.chapterOrder || ch.order || idx + 1,
      title: {
        zh: ch.title?.zh || ch.titleZh || ch.title || `第${idx+1}章`,
        ja: ch.title?.ja || ch.titleJa || ch.title || `第${idx+1}章`
      },
      description: ch.description || ch.title || {},
      pageStart: ch.pageStart || 0,
      pageEnd: ch.pageEnd || 0,
      shard: ch.shard || '',
      sections
    };
  });
}

const courseSpecs = [
  {
    id: 'itpass',
    title: { zh: 'IT Passport', ja: 'ITパスポート' },
    subtitle: { zh: 'IT Passport 真题练习与年度模拟', ja: 'ITパスポート試験対策・按年度模擬練習' },
    color: '#2D64B3',
    files: ['packages/course-itpass/data/manifest.js']
  },
  {
    id: 'sg',
    title: { zh: 'SG 信息安全', ja: 'SG 情報セキュリティ' },
    subtitle: { zh: '情報セキュリティマネジメント专项强化', ja: '情報セキュリティマネジメント・专项強化' },
    color: '#4A7C59',
    files: ['packages/course-sg/data/manifest.js']
  },
  {
    id: 'java',
    title: { zh: 'Java', ja: 'Java' },
    subtitle: { zh: 'Java 基础 / Java 实践', ja: 'Java入門 / Java実践' },
    color: '#E76F00',
    files: [
      'packages/java-course-a/data/java-course-manifest.js',
      'packages/java-course-b/data/java-course-manifest.js',
      'packages/java-course-c/data/java-course-manifest.js',
      'packages/java-course/data/java-course-manifest.js'
    ]
  },
  {
    id: 'python',
    title: { zh: 'Python', ja: 'Python' },
    subtitle: { zh: '从输出到函数与类', ja: '見える出力から始める' },
    color: '#3776AB',
    files: [
      'packages/python-course/data/python-course-manifest.js',
      'packages/python-course-foundations-b/data/python-foundations-b-manifest.js'
    ]
  },
  {
    id: 'sql',
    title: { zh: 'SQL 数据库', ja: 'SQL データベース' },
    subtitle: { zh: 'SQL 数据库核心', ja: 'SQL データベース入門' },
    color: '#336791',
    files: ['packages/sql-course/data/sql-course-manifest.js']
  },
  {
    id: 'mos',
    title: { zh: 'MOS 365', ja: 'MOS 365' },
    subtitle: { zh: 'MOS 365 认证考试（入口待确认）', ja: 'MOS 365 認定試験（入口未確認）' },
    color: '#8E8B86',
    files: []
  },
  {
    id: 'algo',
    title: { zh: '算法基础', ja: 'アルゴリズム基礎' },
    subtitle: { zh: '算法基础准备中', ja: 'アルゴリズム基礎 準備中' },
    color: '#8E8B86',
    files: []
  }
];

const manifest = {
  generatedAt: new Date().toISOString(),
  courses: courseSpecs.map(c => {
    let chapters = [];
    let totalChapters = 0;
    let totalSections = 0;

    for (const rel of c.files) {
      const full = path.join(pilotRoot, rel);
      if (!fs.existsSync(full)) continue;
      try {
        const raw = loadManifest(full);
        const data = getData(raw);
        const parsed = parseChapters(c.id, data);
        if (parsed.length > chapters.length) {
          chapters = parsed;
          totalChapters = parsed.length;
          totalSections = parsed.reduce((sum, ch) => sum + ch.sections.length, 0);
        }
      } catch (e) {
        console.warn('跳过: ' + rel + ' -> ' + e.message);
      }
    }

    return {
      courseId: c.id,
      title: c.title,
      subtitle: c.subtitle,
      color: c.color,
      chapterCount: totalChapters,
      sectionCount: totalSections,
      chapters
    };
  })
};

const outPath = path.join(outDir, 'course-manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log('✅ 已生成: ' + outPath);
manifest.courses.forEach(c => {
  console.log(`   - ${c.courseId}: ${c.chapterCount} 章 / ${c.sectionCount} 节`);
});
