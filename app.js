//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    sysWidth: wx.getSystemInfoSync().windowWidth,
    okayapiHost: "", // TODO: 配置成你所在的接口域名
    okayApiAppKey: "", // TODO：改为你的APP_KEY
    okayApiAppSecrect: "" // TODO：改为你的APP_SECRECT
  },
  setting:{
    music:true
  }

})
