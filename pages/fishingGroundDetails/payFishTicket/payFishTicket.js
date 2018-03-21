Page({
  data: {

  },
  onLoad: function (options){
    var that = this 
    var couponId = options.couponId;
  },
  onShareAppMessage: function () {
    return app.shareInfo
  }
})