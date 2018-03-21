// pages/match/macthDetails/enrollList/enrollList.js
var app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInfo:true,
    enrollList:[],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var matchId = options.id;
    this.setData({
      matchId: matchId
    })
    this.getEnrollList();
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
    if (this.data.isInfo){
      this.getEnrollList()
    }
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

  },
  getEnrollList: function () {
    var that = this
    app.http({
      url: "/app/Applet/competitors",
      method: "GET",
      data: {
        page: that.data.page,
        matchId: that.data.matchId
      },
      success: res => {
        var enrollList = that.data.enrollList.concat(res.data)
        if (res.data.length < 10) {
          that.setData({
            isInfo: false,
            enrollList: enrollList
          })
          return;
        }
        that.setData({
          enrollList: enrollList,
          page: that.data.page + 1,
        })
      }
    })
  },
})