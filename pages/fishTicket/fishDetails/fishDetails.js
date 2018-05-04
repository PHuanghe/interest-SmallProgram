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
    code:'',
    pondId:'',
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options.id;
    this.getMyTicket(this.options);
  },
  // 扫描钓场二维码
  scanning: function (){
    wx.scanCode({
      success: (resl) => {
        if (resl.result.startsWith('LMLHPONDID')){
          this.successfulreturn(resl.result.replace(/[^0-9]/ig, ""));
        }else{
          wx.showToast({
            title: '抱歉！这不是渔场二维码',
            icon: 'none',
            duration: 2000
          })
        }
        // this.successfulreturn();
      }
    })
  },
  successfulreturn: function (pondId){
    app.http({
      url: "/app/pond/checkIn2",
      method: "POST",
      data: {
        tokenId: app.globalData.tokenId,
        code: this.code,
        pondId: pondId
      },
      success: res => {
        if (res.status==1){
          wx.showToast({
            title: '门票检验成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '验票失败',
            icon: 'none',
            duration: 2000
          })
        }
        this.getMyTicket(this.options);
      }
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
        that.createQrCode(res.data.code, "mycanvas", 200, 200);
        this.code = res.data.code;
        this.pondId = res.data.pondId;
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