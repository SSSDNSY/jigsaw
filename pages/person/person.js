// pages/person/person.js
var app = getApp();
const utils = require('../../utils/util.js');
Page({

  /*** 页面的初始数据*/
  data: {
    mode: ['总排行榜', '个人成绩', '好友记录', '关于我们'],//, '意见反馈'
    appId: "wx8abaf00ee8c3202e",
    extraData : {
      id: "35362",
      customData: { 
        clientInfo: 'iPhone OS 10.3.1 / 3.2.0.43 / 0',
        imei: '7280BECE2FC29544172A2B858E9E90D0'
      }
    },
    isLogin: false,
    hidden: true,
    scoreList:[]
  },
  confirm: function () {
    this.setData({
      hidden: !this.data.hidden
    });
  },
   //* 生命周期函数--监听页面加载
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    if (e) this.perosnEven(e);
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  perosnEven: function (e) {
    let _this = this,d = {}; let score ;
    // console.log(this + ' ,e=' + e);
    switch (e.currentTarget.dataset.desc) { 
      case "总排行榜":
        console.log('总排行榜')
        d.mustLogin = false;
        d.s ="App.Table.FreeQuery"
        d.where ='[["user_step",">=","20"],["user_step","<=","100"]]'
        utils.getScore(d).then((res) => {
          _this.confirm(res);
          _this.setData({
            scoreList:res.list
          })
        }).catch((res) => {
           console.log(res) 
        });
        
        break;
      case "个人成绩":
        if (app.globalData.indata){
          wx.showToast({
            title:  app.globalData.indata.user_time + '秒' + app.globalData.indata.user_step+'步',
            icon: 'success_no_circle',
            duration: 1238
          })
        }else{
          wx.showToast({
            title: '个人记录为空',
            icon: 'warn',
            duration: 1238
          })  
        }
      
        break;
      case '好友记录':
        console.log('3好友记录');
        wx.showToast({
          title: '加班开发中，，，',
          icon: 'loading',
          duration: 567
        })
        break;
      case '意见反馈':
        console.log('4意见反馈');
        wx.navigateToMiniProgram({
          appId: 'wx8abaf00ee8c3202e',
          path: '',
          extraData: {
            clientInfo: 'iPhone OS 10.3.1 / 3.2.0.43 / 0',
            imei: '7280BECE2FC29544172A2B858E9E90D0'
          },
          envVersion: 'develop',
          success(res) {
            console.log('4意见反馈 打开成功'); // 打开成功
          }
        })
        break;
      case '关于我们':
        console.log('5关于我们')
        wx.showToast({
          title: '提示:意见反馈>我们的故事',
          icon: 'none',
          duration: 1200
        })
        break;

    }
  },
  onGotUserInfo:function(e){
    console.log(e)
    if(e){
      app.globalData.userInfo = e.detail;
      let rawData = JSON.parse(e.detail.rawData);
      this.setData({
        userRaw: rawData,
        isLogin:true, 
        hidden:"none"
      })
    }
   
  }
})
