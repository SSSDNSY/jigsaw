/**
*author：imi
*所有页面工具类
*/
var app = getApp();
const okayapi = require('./okayapi.js')
// const innerAudioContext = wx.createInnerAudioContext()
/**
 * 调用小白程序接口 -查询用户成绩
 */
function getScore(inData){
  if (inData.mustLogin && !app.globalData.userInfo){
    wx.showToast({
      title: '请登录后查看！',
      image: '../img/warn.png',
      duration: 567
    })
    return 
  }
  let params = {
    s: inData.s ? inData.s: "App.Table.FreeFindOne",         // 必须，待请求的接口服务名称
    model_name: 'score_history',        
    fields: ['id', 'user_step', 'user_time', 'user_infos', 'add_time', 'update_time','ext_data'],
    field:inData.field?inData.field:'',
    where: inData.where ? inData.where : inData.userInfo ? '[["user_infos", "=",' + inData.userInfo+']]': '[["id", "=", "1"]]',//查询条件
    app_key: app.globalData.okayApiAppKey,//appkey 
    order: '["user_step ASC", "user_time ASC"]'
  };
  return new Promise(function (resolve, reject) {
  wx.request({
    url: app.globalData.okayapiHost,    // 使用小白接口的域名，或者PHP代理域名
    data: okayapi.enryptData(params),   // 如果直接调用小白接口，需要在小程序里生成签名
    method: "POST",                     // 通常情况下都可使用POST方式请求小白接口
    header: { "Content-Type": "application/x-www-form-urlencoded" }, // 大坑：如果使用的是POST请求，一定要设置这个header，不然参数无法POST
    success: (wxRes) =>  {
      let res = wxRes.data
      if (res.data && res.data.err_code == 0) {
        console.log('FreeFindOne ok: ', res.data)
        resolve(res.data)
      } else {
        console.log('FreeFindOne fail: ', res)
      }
    },
    fail: () => {
      reject("系统异常，请重试！")
    }
  }) 
  })
 
}

/**
 * 调用小白程序接口-更新用户成绩
 */
function updateScore(inData){
  if(!inData) return;
  let params = {
    s: "App.Table.Create",         // 必须，待请求的接口服务名称
    model_name: 'score_history',
    data: JSON.stringify(inData),
    app_key: app.globalData.okayApiAppKey//appkey 
  };
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.okayapiHost,    // 使用小白接口的域名，或者PHP代理域名
      data: okayapi.enryptData(params),   // 如果直接调用小白接口，需要在小程序里生成签名
      method: "POST",                     // 通常情况下都可使用POST方式请求小白接口
      header: { "Content-Type": "application/x-www-form-urlencoded" }, // 大坑：如果使用的是POST请求，一定要设置这个header，不然参数无法POST
      success: (wxRes) => {
        let res = wxRes.data
        if (res.data && res.data.err_code == 0) {
          console.log('Create ok: ', res.data)
          resolve(res.data)
        } else {
          console.log('Create fail: ', res)
        }
      },
      fail: () => {
        reject("系统异常，请重试！")
      }
    })
  })
}

/**
 * 产生一个hash值，只有数字，规则和java的hashcode规则相同
 */
function hashCode(str) {
  var h = 0;
  var len = str.length;
  var t = 2147483648;
  for (var i = 0; i < len; i++) {
    h = 31 * h + str.charCodeAt(i);
    if (h > 2147483647) h %= t; //java int溢出则取模
  }
  return h;
}

/**
 * 延时函数
 */
function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime){
      now = null; exitTime=null;
      return;
    }
  }
}
/**
 * 判空函数
 */
function isEmpty(e) {
  for (var i in e){
    return false
  }
  return true;
}
//播放声音
function music(i){
  let innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.autoplay = false
  innerAudioContext.src = i.src;
  innerAudioContext.play()
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
    innerAudioContext.destroy()
  })
  innerAudioContext.onEnded(() => {
     innerAudioContext.destroy()
  })
}

module.exports = {
  sleep: sleep,
  isEmpty: isEmpty,
  updateScore: updateScore,
  getScore:getScore,
  hashCode: hashCode,
  music: music
}

