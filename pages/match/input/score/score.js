// pages/match/input/score/score.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    match:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        match: app.match
      })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareInfo
  },
  submit:function(e){
    var that = this;
    var userList = app.match.userList;
    let json = {};
    json.session = userList.session;
    json.matchId = userList.matchId;
    json.userId = userList.userId;
    json.score = e.detail.value.score;
    json.inviteCode = userList.inviteCode;
    app.http({
      url: "/app/Match/score",
      method: "POST",
      data: json,
      success: res => {
        wx.showToast({
          title: '录入成功',
        })
        var pages = getCurrentPages();
        var lastpage = pages[pages.length -2];
        lastpage.data.userList[app.match.index].score = json.score
        lastpage.setData({
          inviteCode: json.inviteCode,
          mask: false,
          page:1,
          userList: lastpage.data.userList
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },1500)
      }
    })
  }
})