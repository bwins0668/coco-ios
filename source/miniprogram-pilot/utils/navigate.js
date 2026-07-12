// utils/navigate.js
// 安全导航工具 - R3.36 新增
// 包装 wx.navigateTo / wx.switchTab，添加失败回调和日志

function navigateToSafe(url, failCallback) {
  wx.navigateTo({
    url: url,
    fail: function (err) {
      console.error('[navigateToSafe] failed to navigate to: ' + url, err);
      if (typeof failCallback === 'function') {
        failCallback(err);
      } else {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none',
          duration: 2000
        });
      }
    }
  });
}

function switchTabSafe(url, failCallback) {
  wx.switchTab({
    url: url,
    fail: function (err) {
      console.error('[switchTabSafe] failed to switch to: ' + url, err);
      if (typeof failCallback === 'function') {
        failCallback(err);
      } else {
        wx.showToast({
          title: '页面切换失败',
          icon: 'none',
          duration: 2000
        });
      }
    }
  });
}

module.exports = {
  navigateToSafe: navigateToSafe,
  switchTabSafe: switchTabSafe
};
