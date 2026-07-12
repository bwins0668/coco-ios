'use strict';

var fs = require('fs');
var path = require('path');

function parseRootArg(argv) {
  var root = null;
  for (var i = 0; i < argv.length; i++) {
    if (argv[i] === '--root' && argv[i + 1]) {
      root = argv[i + 1];
      i++;
    }
  }
  return path.resolve(root || path.join(__dirname, '..'));
}

function toPosix(value) {
  return String(value || '').replace(/\\/g, '/');
}

function read(root, rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function readSafe(root, rel) {
  try { return read(root, rel); } catch (e) { return ''; }
}

function exists(root, rel) {
  return fs.existsSync(path.join(root, rel));
}

function readJsonSafe(root, rel) {
  try { return JSON.parse(read(root, rel)); } catch (e) { return null; }
}

function loadRoutes(root) {
  var app = readJsonSafe(root, 'app.json');
  if (!app) throw new Error('Cannot parse app.json');

  var tabRoots = {};
  ((app.tabBar && app.tabBar.list) || []).forEach(function (item) {
    tabRoots[item.pagePath] = true;
  });

  var routes = [];
  (app.pages || []).forEach(function (page) {
    routes.push({
      route: page,
      packageName: 'main',
      packageRoot: '',
      category: tabRoots[page] ? 'TAB_ROOT' : 'SECONDARY'
    });
  });
  (app.subpackages || []).forEach(function (sp) {
    (sp.pages || []).forEach(function (page) {
      routes.push({
        route: sp.root + '/' + page,
        packageName: sp.name || sp.root,
        packageRoot: sp.root,
        category: 'SECONDARY'
      });
    });
  });

  return {
    app: app,
    tabRoots: tabRoots,
    routes: routes,
    secondaryRoutes: routes.filter(function (route) { return route.category !== 'TAB_ROOT'; }),
    tabRoutes: routes.filter(function (route) { return route.category === 'TAB_ROOT'; })
  };
}

function stripQuery(url) {
  return String(url || '').split('?')[0].replace(/^\/+/, '');
}

function registeredRouteSet(routes) {
  var set = {};
  routes.forEach(function (route) {
    set[route.route] = true;
  });
  return set;
}

function extractFallbackMap(jsText) {
  var match = jsText.match(/var\s+SECONDARY_FALLBACKS\s*=\s*({[\s\S]*?\n});/);
  if (!match) return {};
  var map = {};
  var rx = /['"]([^'"]+)['"]\s*:\s*{\s*type\s*:\s*['"]([^'"]+)['"]\s*,\s*url\s*:\s*['"]([^'"]+)['"]/g;
  var hit;
  while ((hit = rx.exec(match[1]))) {
    map[hit[1]] = { type: hit[2], url: hit[3] };
  }
  return map;
}

function hasForbiddenFakeContent(text) {
  return /fakeCard|fakeQuestion|fakeProgress|mockCard|mockCourse|固定 SQL|static SQL/i.test(text);
}

module.exports = {
  parseRootArg: parseRootArg,
  toPosix: toPosix,
  read: read,
  readSafe: readSafe,
  exists: exists,
  readJsonSafe: readJsonSafe,
  loadRoutes: loadRoutes,
  stripQuery: stripQuery,
  registeredRouteSet: registeredRouteSet,
  extractFallbackMap: extractFallbackMap,
  hasForbiddenFakeContent: hasForbiddenFakeContent
};
