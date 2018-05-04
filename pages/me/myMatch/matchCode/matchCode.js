// pages/me/myMatch/matchCode/matchCode.js
var QR = require("../../../../utils/qrcode.js");
var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.generateCode(options.code);
    this.setData({
      match:app.match,
      code: options.code
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
  // onShareAppMessage: function () {
  //   return app.shareInfo
  // },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    if (wx.getSystemInfoSync) {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 385;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    //this.getCodeImage(canvasId)
  },
  getCodeImage: function (canvasId){
    var that = this;
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: canvasId,
        success: function (res) {
          console.log(res)
          that.setData({
            match: app.match,
            imgpath: res.tempFilePath
          });
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }, 1000)
  },
  generateCode:function(code){
    //var size = this.setCanvasSize();
    this.createQrCode(code, "mycanvas", 200, 200);
  }
})