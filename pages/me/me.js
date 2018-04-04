//获取应用实例
const app = getApp()
// console.log(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: "",
    name: "",
    num:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.init();
  },
  //初始化方法
  init:function(){
    var _this = this;
    var timer = setInterval(function () {
      if (app.globalData.tokenId) {
        clearInterval(timer);
        _this.getNum();
        _this.getUserInfo();
      }
    }, 300)
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
    wx.showNavigationBarLoading() 
    setTimeout(function(){
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();
    },2000)
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
    return {
      title: '钓鱼人的钓鱼神器，关注领红包',
      imageUrl: '/images/index.jpg'
    }
  },
  customerService: function () {
    wx.makePhoneCall({
      phoneNumber: '0755-27158090' //仅为示例，并非真实的电话号码
    })
  },
  feedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  fishTicket:function(e){
    wx.navigateTo({
      url: '../fishTicket/fishTicket?id=' + e.currentTarget.id,
    })
  },
  getNum:function(){
    var that = this
    app.http({
      url: "/app/Applet/myTicketsNum",
      method: "get",
      success: res => {
        that.setData({
          num: res.data
        })
      }
    })
  },
  getUserInfo:function(){
    var that = this 
    app.http({
      url: "/app/qudiaoyu/getProfile",
      method: "get",
      success: res => {
        that.setData({
          user: res.data
        })
      }
    })
  }
})