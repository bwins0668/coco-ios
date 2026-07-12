Component({ properties: { code: String, expectedOutput: String }, methods: { copyCode: function () { wx.setClipboardData({ data: this.data.code || '' }); } } });
