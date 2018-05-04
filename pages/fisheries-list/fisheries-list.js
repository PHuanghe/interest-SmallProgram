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
    area: [],
    pondType: [],
    selectArea: 0,  
    selectPondType: 0, 
    priceType:0, 
    pondName:'',
    sortType:0,
    sortId:0,
    specialSwitch:false,
    price:[
      { priceId: 1,name: '40以下'},
      { priceId: 2, name: '40-60'},
      { priceId: 3, name: '60-100'},
      { priceId: 4, name: '100以上'},
      { priceId: 0, name: '不限' },
    ],
    context:"下拉加载更多",
    isLoading:true,
    listLength:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getParams();
    this.init();
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
    this.setData({
      page:1,
      noMore:true
    })
    this.getNearbyPond(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
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
      imageUrl: '/images/share.jpg'
    }
  },
  init:function(){
    var that = this
    var timer = setInterval(function () {
      if (app.globalData.tokenId) {
        clearInterval(timer);
        that.resetCondition();
        that.getNearbyPond();
      }
    }, 300)
  },
  //获取筛选条件
  getParams: function () {
    var that = this
    app.http({
      url: "/app/Applet/getSearchParams",
      method: "POST",
      success: res => {
        that.setData({
          area: res.data.area,
          pondType: res.data.pondType
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
  choosePrice:function(e){
    this.setData({
      priceType: e.target.id
    })
  },
  //输入框输入
  ipt:function(e){
    this.setData({
      pondName: e.detail.value
    })
  },
  //重置筛选条件
  reset:function(){
    this.setData({
      priceType: 0,
      selectArea:0,
      selectPondType:0
    })
  },
  //点击搜索按钮或者确定按钮
  sure:function(){
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
  closeFiltering:function(){
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
    if (!that.data.isLoading){
        return false;
    }else{
      that.setData({
        isLoading:false
      })
    }
    // var str ;
    // if (first){
    //   str = '刷新数据中';
    // }else{
    //   str = '数据加载中';
    // }
    // wx.showLoading({
    //   title: str,
    // })
    var info = that.data
    var json = {
      lat: app.globalData.latitude,
      lon: app.globalData.longitude,
      sortType: info.sortType,
      pondName: info.pondName,
      areaId: info.selectArea,
      typeId: info.selectPondType,
      priceId: info.priceType,
      onlyPromotion: info.specialSwitch?1:0,
      page: info.page
    }
    app.http({
      url: "/app/Applet/searchPonds",
      method: "POST",
      data: json,
      success: res => {
        var pontList ;
        if (first){
          pontList = [].concat(res.data);
        }else{
          pontList = that.data.pontList.concat(res.data);
        }
        if (res.data.length < 10) {
          that.setData({
            noMore: false,
            context:"没有更多了",
            pontList: pontList
          })
          return
        }
        that.setData({
          pontList: pontList,
          page: that.data.page + 1,
          context: "下拉加载更多"
        })
      },
      complete: res =>{
        that.setData({
          isLoading: true,
          listLength: that.data.pontList.length
        })
        // wx.hideLoading();
        wx.stopPullDownRefresh();
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
  specialSwitch:function(){
    var that = this
    that.resetCondition()
    that.setData({
      specialSwitch: !that.data.specialSwitch,
    })
    that.getNearbyPond()
  },
  //排序切换
  TabTime:function(e){
    var sortType = e.currentTarget.dataset.type
    var that = this 
    if (sortType == 1){
      if (e.target.id>2){
        that.setData({
          sortType:1
        })
      } else if (e.target.id==1){
        that.setData({
          sortType: 2
        })
      }else{
        that.setData({
          sortType: 1
        })
      }
    } else{
      if (e.target.id==3){
        that.setData({
          sortType: 4
        })
      } else if (e.target.id == 4){
        that.setData({
          sortType: 3
        })
      }else{
        that.setData({
          sortType: 3
        })
      }
    }
    that.resetCondition()
    that.getNearbyPond()
  },
  //重置搜索条件
  resetCondition:function(){
    this.setData({
      pontList: [],
      noMore: true,
      page: 1
    })
  },
})