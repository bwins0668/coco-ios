// components/ui-button/ui-button.js
// Quiet Paper 基础按钮：纯展示组件，仅透传点击事件，不含业务逻辑。
// variant 仅决定视觉态；disabled / loading 时不触发 qptap。
Component({
  options: {
    addGlobalClass: false
  },
  properties: {
    // primary | secondary
    variant: { type: String, value: 'primary' },
    text: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false }
  },
  methods: {
    onTap: function () {
      if (this.data.disabled || this.data.loading) return;
      this.triggerEvent('qptap');
    }
  }
});
