// R6.6A.1.6 — custom tabbar with SVG icon assets
// R6.6C1P3.1: root pages own selection; TabBar exposes syncSelectedFromRoute(route)
var ASSETS = '/custom-tab-bar/assets/';

var TAB_INDEX = {
  'pages/home/home': 0,
  'pages/practice/practice': 1,
  'pages/review/review': 2,
  'pages/glossary/glossary': 3,
  'pages/profile/profile': 4
};

Component({
  data: {
    selected: -1,
    list: [
      { pagePath: '/pages/home/home', text: '课程',
        icon: ASSETS + 'home.svg', activeIcon: ASSETS + 'home_active.svg' },
      { pagePath: '/pages/practice/practice', text: '刷题',
        icon: ASSETS + 'drill.svg', activeIcon: ASSETS + 'drill_active.svg' },
      { pagePath: '/pages/review/review', text: '复习',
        icon: ASSETS + 'review.svg', activeIcon: ASSETS + 'review_active.svg' },
      { pagePath: '/pages/glossary/glossary', text: '术语',
        icon: ASSETS + 'glossary.svg', activeIcon: ASSETS + 'glossary_active.svg' },
      { pagePath: '/pages/profile/profile', text: '我的',
        icon: ASSETS + 'profile.svg', activeIcon: ASSETS + 'profile_active.svg' }
    ]
  },

  methods: {
    switchTab: function (e) {
      var data = e.currentTarget.dataset;
      var url = data.path;
      if (url) { wx.switchTab({ url: url }); }
    },

    syncSelectedFromRoute: function (route) {
      if (typeof route !== 'string') return;
      var normalized = route.replace(/^\/|\/$/g, '');
      var idx = TAB_INDEX[normalized];
      if (idx === undefined) {
        idx = -1;
      }
      if (idx !== this.data.selected) {
        this.setData({ selected: idx });
      }
    }
  }
});
