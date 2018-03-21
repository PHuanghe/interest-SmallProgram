// pages/me/myMatch/ranking/ranking.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranking:[],
    isData:true,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var match = app.match
    this.getMyResult(match)
    this.getRanking(match)
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
      if(this.data.isData){
        this.getRanking(app.match);
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareInfo
  },
  getRanking: function (match) {
    var that = this
    app.http({
      url: "/app/Applet/matchResult",
      method: "GET",
      data: {
        session: match.value,
        matchId: match.matchId,
        page:that.data.page
      },
      success: res => {
        if (res.data.length<10){
          that.setData({
            ranking: that.data.ranking.concat(res.data),
            isData:false
          })
          return false;
        }
        that.setData({
          ranking: that.data.ranking.concat(res.data),
          page: that.data.page+1
        })
      }
    })
  },
  getMyResult: function (match){
    var that = this
    app.http({
      url: "/app/Applet/myResult",
      method: "GET",
      data: {
        session: match.value,
        matchId: match.matchId
      },
      success: res => {
        match.res = res.data;
        that.setData({
          match: match
        })
      }
    })
  }
})