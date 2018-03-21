// pages/me/myMatch/ranking/ranking.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask:true,
    isIpt:false,
    inviteCode:'',
    page:1,
    userList:[],
    noMore:true,
    condition:null,
    context:'没有人哦'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getMatch(options.id||5);
    if (!that.data.mask) {
      that.getPlayer();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // var that = this
    // if (!that.data.mask){
    //   that.setData({
    //     userList:[]
    //   })
    //   that.getPlayer();
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this 
    if (that.data.noMore){
      that.getPlayer(that.data.condition)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareInfo
  },
  //获取选手列表
  getPlayer: function (condition) {
    var that = this;
    if (that.data.context =='加载中...'){
        return false;
    }else{
      that.setData({
        context: "加载中..."
      })
    }
    app.http({
      url: "/app/match/miniScore",
      method: "POST",
      data: {
        inviteCode: that.data.inviteCode,
        page: that.data.page,
        keyword: condition||''
      },
      success: res => {
        if(res.data.length>10){
          that.setData({
            userList: that.data.concat(res.data),
            noMore: false,
            mask:false
          })
          return;
        }
        that.setData({
          userList: that.data.userList.concat(res.data),
          page: that.data.page+1,
          mask: false
        })      
      },
      complete:function(){
        that.setData({
          context:'没有人哦'
        })  
      }
    })
  },
  //获取赛事信息
  getMatch: function (id){
    var that = this 
    app.http({
      url: "/app/match/info",
      method: "GET",
      data: {
        matchId: id
      },
      success: res => {
        var match = res.data;
        that.setData({
          match: match,
        })
      }
    })
  },
  code:function(e){
    var code = e.detail.value.code
    this.data.inviteCode = code;
    if (code==''){
      wx.showToast({
        title: '请输入邀请码',
      })
      return false;  
    }
    this.getPlayer();
  },
  showIpt:function(){
     this.setData({
       isIpt:true
     }) 
  },
  closeIpt:function(){
    this.setData({
      isIpt: false
    }) 
  },
  score:function(e){
    var that = this;
    var userList = that.data.userList;
    var match = that.data.match;
    match.userList = userList[e.target.id];
    match.index = e.target.id
    match.userList.inviteCode = that.data.inviteCode;
    app.match = match;
    wx.navigateTo({
      url: 'score/score',
    })
  },
  search:function(e){
    var condition = e.detail.value;
    this.setData({
      condition: condition
    })
  },
  searchUser:function(){
    var data = this.data;
    this.setData({
      page:1,
      noMore:true,
      userList:[]
    })
    this.getPlayer(data.condition)
  }
})