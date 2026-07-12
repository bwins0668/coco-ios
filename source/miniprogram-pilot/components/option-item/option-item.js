// components/option-item/option-item.js
// 答题选项行：纯展示组件。state 仅决定视觉态（default/selected/correct/incorrect），
// 组件不做对错判定、不读写存储；点击仅透传 qpselect 事件，由上层容器决定后续状态迁移。
Component({
  options: {
    addGlobalClass: false
  },
  properties: {
    label: { type: String, value: '' },
    text: { type: String, value: '' },
    // default | selected | correct | incorrect
    state: { type: String, value: 'default' },
    disabled: { type: Boolean, value: false }
  },
  methods: {
    onTap: function () {
      if (this.data.disabled) return;
      this.triggerEvent('qpselect', { label: this.data.label });
    }
  }
});
