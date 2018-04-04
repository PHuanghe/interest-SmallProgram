// pages/fishingGroundDetails/payFishTicket/coupon/coupon.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.money
    })
    this.getCouponId();
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
  getCouponId: function () {
    var that = this
    app.http({
      url: '/app/pond/coupon',
      type: 'GET',
      success(data) {
        // if (data.data.length <= 0) {
        //   that.setData({
        //     isInfo: false
        //   })
        //   return
        // }
        // var couponList = that.data.couponList.concat(data.data)
        var couponList = data.data
        for (var i = 0; i < couponList.length;i++){
          couponList[i].isCoupon = Number(that.data.money) >= Number(couponList[i].spendMoney);
        }
        that.setData({
          couponList: couponList,
        })
      }
    })
  },
  toPay:function(e){
    var couponUserId = e.currentTarget.id;
    var pages = getCurrentPages();
    var lastpage = pages[pages.length - 2];
    console.log(e)
    lastpage.setData({
      couponUserId: couponUserId,
      couponMoney: e.currentTarget.dataset.id
    })
    wx.navigateBack({
      delta: 1
    })  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareInfo
  }
})