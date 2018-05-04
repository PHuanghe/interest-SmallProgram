const app = getApp()
var bmap = require('../../libs/bmap-wx.min.js'); 
//index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tokenId: "",
    banner: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    latitude: 0,
    longitude: 0,
    address: "",
    pontList: [],
    isLoading:true,
    isData:true,
    page:1,
    isPondLoading:true,
    imagePath:''
  },
  getBanner: function () {
    var that = this
    app.http({
      url: "/app/qudiaoyu/bannerAds",
      method: "POST",
      data: { 'typeId': 9 },
      success: res => {
        that.setData({
          banner: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // wx.showLoading({
    //   title: '加载中',
    //   mask:true
    // })
    var timer = setInterval(function () {
      that.setData({
        address: app.globalData.address,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        tokenId: app.globalData.tokenId
      })
      if (app.globalData.address != "中国" && app.globalData.tokenId) {
        clearInterval(timer);
        that.getNearbyPond();
        that.getHotMatch();
      }
    },300)
    that.getBanner(); 
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
      this.initInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isData) {
      this.getNearbyPond();
    }
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
  getAddress: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.latitude = res.latitude
        that.longitude = res.longitude
        that.map()
      },
      fail: function (res) {
        that.getAddressAgain()
      }
    })
  },
  map: function () {
    var that = this
    var BMap = new bmap.BMapWX({
      ak: "uaHL071TvyX4fzUKAj3WmDAZZCZywU9I"
    });
    var success = function (data) {
      that.setData({
        address: data.originalData.result.formatted_address
      })
    };
    var fail = function (data) {
      console.log(data);
    }
    BMap.regeocoding({
      success: success,
      fail: fail
    });
  },
  fishInfo: function () {
    wx.navigateTo({
      url: '../fish-info/fish-info',
    })
  },
  raiders: function () {
    wx.navigateTo({
      url: '../raiders/raiders',
    })
  },
  fishTicket: function () {
    wx.navigateTo({
      url: '../fishTicket/fishTicket?id=0',
    })
  },
  race: function () {
    wx.switchTab ({
      url: '../match/match',
    })
  },
  collarCenter:function(){
    wx.navigateTo({
      url: '../collarCenter/collarCenter',
    })
  },
  getNearbyPond: function (isTop) {
    var that = this;
    if (!that.data.isLoading) {
      return false;
    } else {
      that.setData({
        isLoading: false
      })
    }
    app.http({
      url: "/app/qudiaoyu/getNearbyPond",
      method: "POST",
      data: {
        lat: that.data.latitude,
        lon: that.data.longitude,
        page:that.data.page,
        isQuality:1
      },
      success: res => {
        var pontList;
        if (isTop){
          pontList = [].concat(res.data);
        }else{
          pontList = that.data.pontList.concat(res.data);
        }
        if (res.data.length<10){
          that.setData({
            isData:false,
            pontList: pontList
          })
          return false;
        }
        that.setData({
          pontList: pontList,
          page:that.data.page+1
        })
      },
      complete: res => {
        that.setData({
          isLoading: true,
          isPondLoading:false
        })
        wx.stopPullDownRefresh();
      }
    })
  },
  goToDetail: function (e) {
    wx.navigateTo({
      url: '../fishingGroundDetails/fishingGroundDetails?id=' + e.currentTarget.id
    })
  },
  //点击banner图片跳转链接
  previewImg: function (e) {
    var img = this.data.banner;
    var index = e.currentTarget.id;
    if (img[index].adType==0){
      wx.navigateTo({
        url: "/pages/advertisement/Advertisement?url=" + img[index].adURL
      })
    } else if (img[index].adType == 4){
      wx.navigateTo({
        url: "../fishingGroundDetails/fishingGroundDetails?id=" + img[index].adURL
      })
    }
  },
  getHotMatch:function(){
    var that = this 
    app.http({
      url: "/app/Applet/hotMatch",
      method: "POST",
      data: {
        lat: that.data.latitude,
        lon: that.data.longitude,
        pageSize:1
      },
      success: res => {
        that.setData({
          hotList: res.data
        })
      }
    }) 
  },
  initInfo:function(){
    this.setData({
      page:1,
      isData:true
    })
    this.getNearbyPond(true);
    this.getHotMatch();
    this.getBanner();
  }
})
