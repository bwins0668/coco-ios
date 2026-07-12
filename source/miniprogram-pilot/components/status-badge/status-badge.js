// components/status-badge/status-badge.js
// 状态 / 数据徽标：纯展示组件，无逻辑、无事件、不引用页面。
// tone 仅决定低干扰配色；value 走等宽数据字体（题号、耗时、正确率、年份等短数据）。
Component({
  options: {
    addGlobalClass: false
  },
  properties: {
    // neutral | primary | success | danger
    tone: { type: String, value: 'neutral' },
    label: { type: String, value: '' },
    value: { type: String, value: '' }
  }
});
