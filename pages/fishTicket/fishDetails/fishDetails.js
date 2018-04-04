// pages/fishTicket/fishDetails/fishDetails.js
var app = getApp() 
var QR = require("../../../utils/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareInfo
  },
  //获取鱼票详情
  getMyTicket: function (id) {
    var that = this
    app.http({
      url: "/app/pond/miniTicketDetail",
      method: "GET",
      data: {
        userTicketId: id
      },
      success: res => {
        var size = that.setCanvasSize();
        that.createQrCode(res.data.code, "mycanvas", size.w, size.h);
        that.setData({
          info:res.data
        })
        wx.setNavigationBarTitle({
          title: res.data.pondName
        })
      }
    })
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 385;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      //console.log("获取设备信息失败" + e);
    }
    return size;
  },
  getCodeImage: function (canvasId) {
    var that = this;
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: canvasId,
        success: function (res) {
          console.log(res)
          that.setData({
            imagePath: res.tempFilePath
          });
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }, 1000)
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    //this.getCodeImage(canvasId)
  }
})