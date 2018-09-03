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
      gw:0,
      sw:0,
      bw:0,
      gameController: 'bindtap = "gameCotrol"',
      numArr: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],//初始化显示值数组
      visArr: ['visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'hidden'],//初始化显示样式visibility的初始化值
      disabled:false,
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
      gw: 0,
      sw: 0,
      bw: 0,
      des: 9,
      gameController: 'bindtap = "gameCotrol"',
      numArr: arr,
      visArr: this.data.visArr,
      visArr: ['visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'hidden']
    });
  },
  //计步器
  setCounter: function (counter) {
    if (isNaN(counter)) {
      return
    }
   var gw,sw,bw;
    return {
      gw: Math.floor(counter % 10),
      sw: Math.floor(counter / 10 % 10),
      bw: Math.floor(counter / 100 % 10)
    }
  },
  //游戏完成判定
  iscomplete: function (var1, var2,var3,time) {//var1:numArr,var2:visArr,var:isAuto
    for (var i = 1; i < 9; i++) {
      if (i != var1[i - 1]) {//胜负判断：显示值对应了每个顺序值就是完成游戏
        return;
      }
      if (i === 8) {//循环到8没有return 说明游戏完成
        var2[8] = 'visible';
        this.setData({
          gameController: '',
          visArr: var2
        });
        var that = this;
        var msg='';
      
      if(!var3){
        msg = '您在' + ((Date.parse(new Date()) - this.data.startTime) / (1000)) + '秒内,用了' + (this.data.counter - 1) +'步完成!';
      }else{
        msg = '演示:' + ((Date.parse(new Date())-this.data.startTime )/1000)
          + '秒;计算:' + time +'毫秒;步数:'
          + (this.data.counter - 1)+'步';
      }
      wx.showModal({
        title: '完成游戏',
        content: msg ,
        confirmText: '重玩',
        confirmColor: '#FE0',
        complete: function (res) {
          if (res.confirm) {
            that.initGame();
          } else if (res.cancel) {
            wx.navigateBack();
          }
        }
      });
      }
    }
    this.setDisabled(this.data.disabled);
  },
  //游戏主流程控制
  gameCotrol: function (e) {
    var cel = parseInt(e.currentTarget.id.substring(4, 5));//获取方块顺序值
    var celVal = parseInt(e.currentTarget.id.substring(5));//获取某个方块显示值
    var des = this.data.des;
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
      console.log("this.data.counter ="+this.data.counter);
      var tempCounter=this.setCounter(this.data.counter);//计算积分
      this.setData({//这里其实官方api不推荐 频繁的setData. 后续另寻他法， 现在只考虑实现
        numArr: numTempArr,
        visArr:visTempArr,
        gw: tempCounter.gw,
        sw: tempCounter.sw,
        bw: tempCounter.bw,
        des:cel,
        counter:this.data.counter+1
      });
      this.iscomplete(numTempArr, visTempArr,false,'');
    }
  },
  //重玩 
  replay:function(){
    this.initGame();
    wx.showToast({
      title: '重新开始',
      icon: 'success',
      duration: 456
    })
  }, 
  //设置声音
  setMusicc:function(){
    wx.showToast({
      title: '加班研发中',
      icon: 'loading',
      duration: 765
    });
  } ,
  //自动完成AI
  autoPlay:function(){
    this.data.counter=0;
    this.setData({
      gw:0,
      sw:0,
      bw:0,
      gameController:'',
      startTime: Date.parse(new Date())
    });
    this.setDisabled(this.data.disabled);
    var that = this;
    wx.showToast({
      title: '运行中请勿点击',
      icon: 'success',
      duration: 950
    })
    var numTempArr = this.data.numArr;//临时数值数组
    var visTempArr = this.data.visArr;//临时显示值数组
    utils.setSource(this.data.numArr);//放入当前游戏数据
    var obj=utils.solver().getPath(); //得到求解路径
    if(obj.solve){
    for (var i = 0; i < obj.path.length;i++){
      for(var j=0;j<9;j++){
        (obj.path[i])[j] == 0?visTempArr[j] = 'hidden' : visTempArr[j] = 'visible';
      }
    utils.sleep(999);
    var tempCounter = this.setCounter(this.data.counter);//计算积分
    this.setData({//
      numArr: obj.path[i],
      visArr: visTempArr,
      counter: i+1,
      gw: tempCounter.gw,
      sw: tempCounter.sw,
      bw: tempCounter.bw,
    });
      this.iscomplete(obj.path[i], visTempArr, true,obj.time);
    }
  }
  },
  setDisabled: function (e) {//按钮有效性切换
    this.setData({
      disabled: !e
    })
  },
  
  //  用户点击右上角分享
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
