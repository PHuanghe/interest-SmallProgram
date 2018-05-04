// pages/match/macthDetails/macthDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://res.wumingtangol.com/15204215772030.jpg',
      'http://res.wumingtangol.com/15204194486615.jpeg',
      'http://res.wumingtangol.com/15204215772030.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    match:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getMatchInfo(options.id);
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
    var that = this
    return {
      title: that.data.match.name,
      //imageUrl: '/images/saishi.jpg'
    }
  },
  getMatchInfo:function(id){
    var that = this
    app.http({
      url: '/app/match/detail',
      type: 'GET',
      data: {
        matchId: id
      },
      success(data) {
        var match = data.data
        match.enroll.forEach(function (item, index, array){
          var time = match.enroll[index].createTime
          match.enroll[index].createTime = time.substring(time.indexOf('-') + 1, time.lastIndexOf(':'))
        })
        // match.matchDesc = match.matchDesc.split(/↵+/);
        // match.awardDesc = match.awardDesc.split(/↵+/);
        // match.ruleDesc = match.ruleDesc.split(/↵+/)
        that.setData({
          match: match        
        })
      }
    }) 
  },
  signUp: function (e) {
    wx.navigateTo({
      url: 'signUp/signUp?id=' + e.target.id,
    })
  },
  tel:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id //仅为示例，并非真实的电话号码
    })
    // wx.showModal({
    //   title: '联系客服',
    //   content: e.currentTarget.id ? e.currentTarget.id:'暂无联系方式',
    //   showCancel: false,
    //   confirmText: "我知道了"
    // })
  },
  openMap: function () {
    var that = this
    wx.openLocation({
      latitude: Number(that.data.match.lat),
      longitude: Number(that.data.match.lon),
      scale: 28
    })
  },
  openImage:function(){
    var that = this
    var url = [];
    url.push(that.data.match.coverImg);
    wx.previewImage({
      urls: url
    })
  }
})