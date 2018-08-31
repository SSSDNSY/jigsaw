//jigsaw.js
const utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
      startTime:null,//总共游戏时间
      counter:0,//总共游戏步数
      des:9,//
      gameController: 'bindtap = "gameCotrol"',
      numArr: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],//初始化显示值数组
      visArr: ['visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'hidden'],//初始化显示样式visibility的初始化值
      banReplay:false,
      banAuto:false
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh	:function(){
    this.initGame();
  },
    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initGame();
  },
  /**
   * 游戏初始化
   */
  initGame:function(){
    var arr = new Array(1, 2, 3, 4, 5, 6, 7, 8);
    do{
      for (var i = 0; i < 8; i++) {
        var rand = Math.floor(Math.random() * 7) + 1;
        var a = arr[i];
        arr[i] = arr[rand];
        arr[rand] = a;
      }
      // console.log('this.unSolve(arr)=' + this.unSolve(arr))
    } while (!utils.unSolve1(arr))//直到生成有解数组为止
    arr[8] = 0;//填充第9个块的值
    // console.log('游戏初始化完成' + this.data);
    this.setData({
      startTime: Date.parse(new Date()),
      counter: 1,
      des: 9,
      gameController: 'bindtap = "gameCotrol"',
      numArr: arr,
      visArr: this.data.visArr,
      visArr: ['visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'hidden']
    });
  },
  //游戏主流程控制
  gameCotrol: function (e) {
    var cel = parseInt(e.currentTarget.id.substring(4, 5));//获取方块顺序值
    var celVal = parseInt(e.currentTarget.id.substring(5));//获取某个方块显示值
    var des = this.data.des;
    // console.log(e);
    //console.log('>>> 获取方块顺序值=' + cel + '  显示值=' + celVal + '  des的值=' + this.data.des + '显示样式visibility=' + this.data.visArr[cel - 1] + '\n开始时间=' + this.data.startTime + '总次数=' + this.data.counter + '     耗时=' + ((Date.parse(new Date()) - this.data.startTime) / (1000)) + '秒');
    if (cel === 3 && des === 4 || cel === 4 && des === 3 ||
        cel === 6 && des === 7 || cel === 7 && des === 6){//屏蔽bug，该bug在cel=3，4,6,7位置时能移动到des=6，4，7，6位置
      return;
    }else if ((Math.abs(cel - des) === 1)|| Math.abs(cel - des) === 3) {
      var numTempArr=this.data.numArr;//临时数值数组
      var visTempArr=this.data.visArr;//临时显示值数组
      var temp;//交换中间变量，也可以^和 +操作，一共3种交换值操作
      temp=numTempArr[cel-1];
      numTempArr[cel - 1] = numTempArr[des-1];
      numTempArr[des - 1]=temp;
      temp = visTempArr[cel-1] ;
      visTempArr[cel - 1] = visTempArr[des - 1];
      visTempArr[des - 1] = temp;
      this.setData({//这里其实官方api不推荐 频繁的setData. 后续另寻他法， 现在只考虑实现
        numArr: numTempArr,
        visArr:visTempArr,
        des:cel,
        counter:this.data.counter+1
      });
  //游戏完成判断，计时器结束
    for (var i=1;i<9; i++) {
      if (i != numTempArr[i-1]){//胜负判断：显示值对应了每个顺序值就是完成游戏
        return ;
      }
      if(i===8){//循环到8没有return 说明游戏完成
        visTempArr[8]='visible';
          this.setData({
            gameController: '',
            visArr: visTempArr
          });
          var that=this;
        wx.showModal({
          title: '完成游戏',
          content: '次数=' + (this.data.counter-1) + '，耗时='+ ((Date.parse(new Date()) - this.data.startTime) / (1000)) + '秒',
          confirmText: '重玩',
          confirmColor:'#FE0',
          complete: function(res) {
            if (res.confirm) {
              that.initGame();
            } else if (res.cancel) {
              wx.navigateBack();
            }
          }
        });  
      }
    }
    }
  },
  //重玩
  replay:function(){
    this.initGame();
    wx.showToast({
      title: '重新开始',
      icon: 'success',
      duration: 800
    })
  },
// console.log('sysWidth: '+app.globalData.sysWidth);
// console.log("defaultTarget= " + utils.solver().getSourceArr());
// console.log("hasSolution " + utils.solver().hasSolution());
// console.log("getSourceArr " + utils.solver().getSourceArr());
// console.log("getTargetArr " + utils.solver().getTargetArr());
// console.log("setSource " + utils.solver().setSource());
// console.log( utils.solver().getPath()); setDefaultSource
//  utils.setSource([1,2,3,3,3,4,5,8,0])
// console.log( utils.solver().getSourceArr());
  //自动完成AI
  autoPlay:function(){
    this.setDisabled(this.data.banReplay);
    var that = this;
    wx.showToast({
      title: '计算完成！自动运行中请勿点击！',
      icon: 'success',
      duration: 800
    })
    var numTempArr = this.data.numArr;//临时数值数组
    var visTempArr = this.data.visArr;//临时显示值数组
    // console.log('临时数值数组' + numTempArr); 
    // console.log('临时显示值数组' + visTempArr); 
    // console.log("getSourceArr " + utils.solver().getSourceArr());
    utils.setSource(this.data.numArr);
    // console.log("getSourceArr " + utils.solver().getSourceArr());
    var obj=utils.solver().getPath();//求解路径
    if(obj.solve){
    console.log(obj);
    for (var i = 0; i < obj.path.length;i++){
      for(var j=0;j<9;j++){
        (obj.path[i])[j] == 0?visTempArr[j] = 'hidden' : visTempArr[j] = 'visible';
      }
    utils.sleep(1000);
    this.setData({//
      numArr: obj.path[i],
      visArr: visTempArr,
      counter: i+2
    });
    }
  }
  this.setDisabled(this.data.banReplay);
  },
  setDisabled: function (e) {
    this.setData({
      disabled: !e
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
