// pages/fishTicket/fishTicket.js
var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      { id: 0, text: '全部' },
      { id: 1, text: '未使用' },
      { id: 2, text: '进行中' },
      { id: 3, text: '已使用' },
    ],
    navOn: 1,
    page:1,
    ticket:[],  
    isInfo:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyTicket(options.id)
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
    if (this.data.isInfo){
      this.getMyTicket(this.data.navOn)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   // return app.shareInfo
  // },
  switchNav: function (e) { 
    this.setData({
      page: 1,
      ticket:[],
      isInfo:true
    })
    this.getMyTicket(e.currentTarget.dataset.id)
  },
  //获取鱼票信息
  getMyTicket: function (status) {
    var that = this
    that.setData({
      navOn: status
    })
    app.http({
      url: "/app/pond/miniMyTicket",
      method: "GET",
      data: {
        page: that.data.page,
        status: status
      },
      success: res => {
        if (res.data.length <= 0) {
          that.setData({
            isInfo: false
          })
          return;
        }
        var ticket = that.data.ticket.concat(res.data)
        that.setData({
          ticket: ticket,
          page: that.data.page + 1,
        })
      }
    })
  },
  detail:function(e){
    wx.navigateTo({
      url: 'fishDetails/fishDetails?id=' + e.currentTarget.id,
    })
  },
})