//index.js
//获取应用实例
const app = getApp()
// const query = wx.createSelectorQuery();
Page({
  data: {
    userInfo: {},
    sysWidth: app.globalData.sysWidth,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hidden1:'none',
    hidden2:''
  },
  //事件处理函数
  bindViewTap: function(e) {
    wx.navigateTo({
      url: '../jigsaw/jigsaw'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        sysWidth: app.globalData.sysWidth
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          sysWidth: app.globalData.sysWidth
        }) 
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          this.setData({
            sysWidth: app.globalData.sysWidth
          })
        }
      })
    }
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      this.setData({
        hidden2: 'none',
        hidden1: ''
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    this.setData({
      sysWidth: app.globalData.sysWidth
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
      title: '益智拼图游戏',
      path: '/pages/index/index',
      success: function (res) {
        console.log('成功');
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onGotUserInfo: function (e) {
    console.log(e)
    if (e) {
      app.globalData.userInfo = e.detail;
      this.setData({
        hidden2:'none',
        hidden1:''
      })
    }
  }
})
