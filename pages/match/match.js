const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: true,
    pontList: [],
    noMore: true,
    page: 1,
    pondType: 0,
    name: '',
    sortType: 2,
    sortId: 0,
    specialSwitch: false,
    pond: [],
    context: "下拉加载更多",
    isLoading: true,
    typeId:0,
    typeList:[
      { id: 1, text: '报名中' },
      { id: 2, text: "待开赛" },
      { id: 3, text: '进行中' },
      { id: 4, text: "已结束" }, 
      { id: 0, text: "全部" }, 
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getParams();
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  init: function () {
    var that = this;
    var timer = setInterval(function () {
      if (app.globalData.tokenId) {
        clearInterval(timer);
        that.resetCondition();
        that.getNearbyPond(); 
      }
    }, 300)
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
    this.resetCondition()
    this.getNearbyPond()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.noMore) {
      that.getNearbyPond()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '钓鱼人的钓鱼神器，关注领红包',
      imageUrl: '/images/saishi.jpg'
    }
  },
  //获取筛选条件
  getParams: function () {
    var that = this
    app.http({
      url: "/app/match/type",
      method: "get",
      success: res => {
        that.setData({
          pond: res.data,
        })
      }
    })
  },
  chooseArea: function (e) {
    this.setData({
      selectArea: e.target.id
    })
  },
  choosePondType: function (e) {
    this.setData({
      selectPondType: e.target.id
    })
  },
  choosePrice: function (e) {
    this.setData({
      pondType: e.target.id
    })
  },
  clickType:function(e){
    this.setData({
      typeId: e.target.id
    })
  },
  //输入框输入
  ipt: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //重置筛选条件
  reset: function () {
    this.setData({
      pondType: 0,
      typeId:0
    })
  },
  //点击搜索按钮或者确定按钮
  sure: function () {
    var that = this
    that.closeFiltering()
    that.resetCondition()
    that.getNearbyPond()
  },
  filtering: function () {
    var _this = this
    _this.setData({
      filter: !_this.data.filter
    })
  },
  closeFiltering: function () {
    this.setData({
      filter: true
    })
  },
  //获取列表信息
  getNearbyPond: function (first) {
    var that = this
    // if (first) {
    //   that.setData({
    //     pontList: [],
    //     noMore: false,
    //     page: 1
    //   })
    // }
    // that.setData({
    //   context:"正在加载中..."
    // })
    if (!that.data.isLoading) {
      return false;
    } else {
      that.setData({
        isLoading: false
      })
    }
    var info = that.data
    var json = {
      lat: app.globalData.latitude,
      lon: app.globalData.longitude,
      sortType: info.sortType,
      name: info.name,
      isFree: info.specialSwitch ? 1 : 0,
      page: info.page,
      typeId: info.pondType,
      type: info.typeId
    }
    app.http({
      url: "/app/Applet/searchMatches",
      method: "POST",
      data: json,
      success: res => {
        if (res.data.length < 10) {
          that.setData({
            noMore: false,
            context: "没有更多了",
            pontList: that.data.pontList.concat(res.data)
          })
          return
        }
        that.setData({
          pontList: that.data.pontList.concat(res.data),
          page: that.data.page + 1,
          context: "下拉加载更多"
        })
      },
      complete: res => {
        that.setData({
          isLoading: true
        })
        // wx.hideNavigationBarLoading();
        // wx.stopPullDownRefresh();
        wx.hideLoading()
      }
    })
  },
  //去钓场详情页面
  goToDetail: function (e) {
    wx.navigateTo({
      url: '../fishingGroundDetails/fishingGroundDetails?id=' + e.currentTarget.id
    })
  },
  //开关特价
  specialSwitch: function () {
    var that = this
    that.resetCondition()
    that.setData({
      specialSwitch: !that.data.specialSwitch,
    })
    that.getNearbyPond()
  },
  //排序切换
  TabTime: function (e) {
    var sortType = e.currentTarget.dataset.type
    var that = this
    if (sortType == 1) {
      if (e.target.id > 2) {
        that.setData({
          sortType: 1
        })
      } else if (e.target.id == 1) {
        that.setData({
          sortType: 2
        })
      } else {
        that.setData({
          sortType: 1
        })
      }
    } else {
      if (e.target.id == 3) {
        that.setData({
          sortType: 4
        })
      } else if (e.target.id == 4) {
        that.setData({
          sortType: 3
        })
      } else {
        that.setData({
          sortType: 3
        })
      }
    }
    that.resetCondition()
    that.getNearbyPond()
  },
  //重置搜索条件
  resetCondition: function () {
    this.setData({
      pontList: [],
      noMore: true,
      page: 1
    })
  },
  macthDetails: function () {
    wx.navigateTo({
      url: 'macthDetails/macthDetails',
    })
  }
})

