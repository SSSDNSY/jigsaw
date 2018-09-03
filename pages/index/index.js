//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    sysWidth: app.globalData.sysWidth,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../jigsaw/jigsaw'
    })
  },
  onLoad: function () {
    // console.log('sysWidth: '+app.globalData.sysWidth);
    // console.log("defaultTarget= " + utils.solver().getSourceArr());
    // console.log("hasSolution " + utils.solver().hasSolution());
    // console.log("getSourceArr " + utils.solver().getSourceArr());
    // console.log("getTargetArr " + utils.solver().getTargetArr());
    // console.log("setSource " + utils.solver().setSource());
    // console.log( utils.solver().getPath()); setDefaultSource
    //  utils.setSource([1,2,3,3,3,4,5,8,0])
    // console.log( utils.solver().getSourceArr());
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        sysWidth: app.globalData.sysWidth,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          sysWidth: app.globalData.sysWidth,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            sysWidth: app.globalData.sysWidth,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      sysWidth: app.globalData.sysWidth,
      hasUserInfo: true
    })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    if (!this.data.id) {
      // todo 返回默认分享信息，比如小程序首页
    }

    return {
      title: '九宫拼图游戏',
      path: '/pages/index/index',
      success: function (res) {
        console.log('成功');
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
