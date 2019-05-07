const app = getApp();
Component({
  data: {

  },

  properties: {

  },

  methods: {
    bindGetUserInfo(e) {
      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        this.triggerEvent('getUserInfo', e.detail.userInfo);
      } else {
        //用户按了拒绝授权按钮
      }
    },
  },

  ready: function () {

  }
})
