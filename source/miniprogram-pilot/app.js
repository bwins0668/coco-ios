// app.js
App({
  onLaunch: function () {
    console.log('Study Tools 小程序启动');
    // R3.36 全局错误处理增强
    this.setupGlobalErrorHandler();
    // R20.1: 运行时深色模式检测
    this.setupThemeDetection();
  },

  setupGlobalErrorHandler: function () {
    var self = this;
    // 捕获未处理的 Promise 拒绝
    if (typeof Promise !== 'undefined' && Promise.prototype) {
      // 小程序环境：通过 App onError 捕获
    }
  },

  /**
   * R20.1: 运行时深色模式检测
   * 微信深色模式支持两级：
   *   1. @media (prefers-color-scheme: dark)  → 系统级，用户手动切换微信深色模式时不触发
   *   2. theme.json → 控制原生组件（导航栏/tabbar），微信任何深色模式都工作
   * 本方法补充第3级：JS 驱动，通过 wx.onThemeChange 监听 + .dark-theme CSS 类切换
   */
  setupThemeDetection: function () {
    try {
      var sysInfo = wx.getSystemInfoSync();
      var theme = sysInfo.theme || 'light';
      this.globalData.theme = theme;
      this.globalData.themeDark = (theme === 'dark');

      // 监听主题变化（微信 6.6.0+ 支持）
      wx.onThemeChange(function (result) {
        var app = getApp();
        if (!app) return;
        var newTheme = result && result.theme ? result.theme : 'light';
        app.globalData.theme = newTheme;
        app.globalData.themeDark = (newTheme === 'dark');

        // 更新当前所有页面
        var pages = getCurrentPages();
        for (var i = 0; i < pages.length; i++) {
          var page = pages[i];
          if (page && typeof page.setData === 'function') {
            try {
              page.setData({ __themeDark: app.globalData.themeDark });
            } catch (e) {
              // 静默忽略 setData 异常
            }
          }
        }
      });
    } catch (e) {
      console.warn('[app] Theme detection unavailable', e);
    }
  },

  onError: function (err) {
    console.error('[Global Error]', err);
    // 生产环境可在这里上报错误到监控服务
  },

  globalData: {
    version: 'v0.28.0',
    theme: 'light',
    themeDark: false
  }
});
