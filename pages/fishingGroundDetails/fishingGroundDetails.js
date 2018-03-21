// pages/FishingGroundDetails/FishingGroundDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      nav:[
        { id: 1, text:'购票'},
        { id: 2, text: '放鱼' },
        { id: 3, text: '详情' },
        { id: 4, text: '互动' },
      ],
      navOn: 1,
      anglingSite:'',
      interaction:[],
      fishMessage:[],
      isInfo:true,
      fishTicket:'',
      couponList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pondId: options.id
    })
    this.getFishTicket();
    this.getFishingGroundDetails();
    this.getInteractionInfo();
    this.getCouponId()
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
    var that = this
    if (that.data.isInfo){
      if (that.data.navOn==2){
        that.getputTheFishInfo()
      } else if (that.data.navOn == 4){
        that.getInteractionInfo()
      }
    }
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
  //顶部切换
  switchNav:function(e){
    var that = this
    var navId = e.currentTarget.dataset.id
    that.setData({
      navOn: navId,
      page: 1,
      isInfo: true,
      interaction: [],
      fishMessage: []
    })
    if(navId==2){
      that.getputTheFishInfo()
    } else if (navId == 4){
      that.getInteractionInfo()
    }
  },
  //获取鱼票信息
  getFishTicket:function(){
    var that = this 
      app.http({
        url: '/app/pond/miniTicket',
        type:'GET',
        data:{
          pondId: that.data.pondId
        },
        success(data){
           that.setData({
             fishTicket:data.data
           })
        }
      })
  },
  //获取放鱼信息
  getputTheFishInfo:function(){
    var that = this
    app.http({
      url: "/app/pond/putFishLists",
      method: "GET",
      data: {
        page: that.data.page,
        pondId: that.data.pondId
      },
      success: res => {
        var fishMessage = that.data.fishMessage.concat(res.data)
        if (res.data.length < 10) {
          that.setData({
            fishMessage: fishMessage,
            isInfo: false
          })
          return;
        }
        that.setData({
          fishMessage: fishMessage,
          page: that.data.page + 1
        })
      }
    })
  },
  //获取钓场详情
  getFishingGroundDetails:function(){
    var that = this
    app.http({
      url: '/app/pond/detail',
      type: 'GET',
      data: {
        pondId: that.data.pondId,
      },
      success(data) {
        var anglingSite = data.data
        anglingSite.species = anglingSite.speciesId.join("，")
        that.setData({
          anglingSite: anglingSite
        })
      }
    })
  },
  //获取互动信息
  getInteractionInfo:function(){
    var that = this
    app.http({
      url: '/app/find/threadLists',
      type: 'GET',
      data: {
        pondId: that.data.pondId
      },
      success(data) {
        var interaction = that.data.interaction.concat(data.data)
        if(data.data.length < 10){
          that.setData({
            interaction: interaction,
            isInfo:false
          })
          return
        }
        that.setData({
          interaction: interaction,
          page: that.data.page+1
        })
      }
    })
  },
  fishTicket:function(){
    wx.navigateTo({
      url: '../fishTicket/fishTicket'
    })
  },
  //点赞帖子
  fabulou:function(e){
    var that = this
    var threadId = e.currentTarget.dataset.id
    app.http({
      url: '/app/find/threadLists',
      type: 'POST',
      data: {
        threadId: threadId
      },
      success(data) {
           
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //关注用户
  follow:function (e) {
    var that = this
    var userId = e.currentTarget.dataset.id
    app.http({
      url: '/app/qudiaoyu/addFocus',
      type: 'POST',
      data: {
        focus_userId: userId
      },
      success(data) {

      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //拨打电话
  tel:function(){
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.anglingSite.mobile
    })
  },
  //
  // buyFishTicket: function (e) {
  //   var that = this
  //   var ticketId = e.currentTarget.dataset.id
  //   app.http({
  //     url: '/app/qudiaoyu/addFocus',
  //     type: 'POST',
  //     data: {
  //       tickets: [{
  //         ticketId: ticketId,
  //         amount:1
  //       }],
  //       pondId:54
  //     },
  //     success(data) {
  //     }
  //   })
  // },
  getCouponId:function(){
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
        that.setData({
          couponList: data.data,
        })
      }
    })
  },
  //购买鱼票
  pay:function(e){
    var that = this
    var ticketId = e.currentTarget.dataset.id
    var tickets = [{ ticketId: ticketId, amount: 1 }];
    tickets = JSON.stringify(tickets)
    app.http({
      url: '/app/pond/order',
      type: 'POST',
      data: {
        tickets: tickets,
        pondId: that.data.pondId,
        paymentMethod:3
      },
      success(data) {
        var data = data.data.url
        wx.requestPayment(
          {
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            success: function (res) {
              wx.showToast({
                title: '购买成功',
              })
             }  
          })
      }
    })
  },
  //点击图片进行预览
  previewImg: function (e) {
    var data = this.data;
    var images = [];
    var dadIndex = e.currentTarget.dataset.index
    var imgIndex = e.currentTarget.id
    if (data.navOn==2){
      images = data.fishMessage[dadIndex].images
    } else if (data.navOn == 3){ 
      data.anglingSite.images.forEach(function (item, index, array) {
        images.push(item.imageUrl)
    　});
    } else if (data.navOn == 4){
        data.interaction[dadIndex].images.forEach(function (item, index, array) {
          images.push(item.content)
      });
    }
    wx.previewImage({
      current: images[imgIndex], // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  },
  openMap:function(){
    var that = this
    wx.openLocation({
      latitude: Number(that.data.anglingSite.lat),
      longitude: Number(that.data.anglingSite.lon),
      scale: 28,
      fail: function (res) {
        console.log(res)
      },
      success:function(res){
        console.log(res)
      }
    })
  }
})