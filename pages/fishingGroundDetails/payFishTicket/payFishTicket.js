var app = getApp();
Page({
  data: {
    isOrder:true,
    couponUserId:0,
    couponMoney:0
  },
  onLoad: function (options){
    var that = this 
    that.setData({
      ticketId: options.ticketId,
      pondId: options.pondId,
      money: options.money
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareInfo
  },
  discount:function(){
    var that = this 
     wx.showModal({
       title: '提示',
       content: '是否取消使用优惠卷',
       success: function (res) {
         if (res.confirm) {
           that.setData({
             couponUserId:0
           })
         } else if (res.cancel) {
           
         }
       }
     }) 
  },
  //购买鱼票
  pay: function (e) {
    var that = this 
    var tickets = [{ ticketId: that.data.ticketId, amount: 1 }];
    tickets = JSON.stringify(tickets);
    if (!that.data.isOrder) {
      return false;
    } else {
      that.setData({
        isOrder: false
      })
    }
    app.http({
      url: '/app/pond/order',
      type: 'POST',
      data: {
        tickets: tickets,
        pondId: that.data.pondId,
        paymentMethod: 3,
        couponUserId: that.data.couponUserId
      },
      success: function (data) {
        if (!data.data.url){
          that.buySuccess();
          return false;
        }
        var data = data.data.url
        wx.requestPayment(
          {
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            success: function (res) {
              that.buySuccess();
            },
            fail: function (res) {
              // wx.showModal({
              //   title: '错误提示',
              //   content: JSON.stringify(res),
              // })
            }
          })
      },
      complete: function () {
        that.setData({
          isOrder: true
        })
      }
    })
  },
  buySuccess:function(){
    wx.showModal({
      title: "购买成功",
      content: '您可以在我的鱼票中查看',
      showCancel: false,
      confirmText: '我知道了',
      success: () => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})