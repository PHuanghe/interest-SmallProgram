// pages/match/macthDetails/signUp/signUp.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      matchId: options.id
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
  sub:function(e){
    var that = this
    var info = e.detail.value
    if (!that.check(info)){
      return
    }
    info.matchId = that.data.matchId
    app.http({
      url: "/app/match/order",
      method: "POST",
      data: info,
      success:function(data) {
        var data = data.data
        if (!data.success){
          that.pay(data)
          return false
        }
        that.toSuccess()
      }  
    })
  },
  check: function (user) {
    if (user.name == "" || user.name == null) {
      wx.showToast({
        title: '用户名不能为空',
      })
      return false;

    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(user.mobile))) {
      wx.showToast({
        title: '手机号有误',
      })
      return false;
    } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(user.cardNo) && user.cardNo!='') {
      wx.showToast({
        title: '身份证号有误',
      })
      return false;
    }else {
      return true;
    }
  },
  pay: function (data){
    var that = this 
    wx.requestPayment(
      {
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': 'MD5',
        'paySign': data.paySign,
        success: function (res) {  
          that.toSuccess()
        }
      })
  },
  toSuccess:function(){
    wx.showToast({
      title: '报名成功',
    })
    setTimeout(function () {
      wx.redirectTo({
        url: '/pages/success/success'
      })
    }, 1500)   
  }
})