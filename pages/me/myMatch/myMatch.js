// pages/me/myMatch/myMatch.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      { id: 0, text: '待参赛' },
      { id: 1, text: '赛事中' },
      { id: 2, text: '历史赛事' },
    ],
    navOn: 0,
    array: ['第一场', '第二场'],
    index:0,
    match:[],
    page:1,
    isLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      that.setData({
        navOn: options.id
      })
      that.getMacthList()
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
  switchNav: function (e) {
    this.setData({
      page: 1,
      match: [],
      navOn: e.currentTarget.dataset.id
    })
    this.getMacthList()
  },
  bindPickerChange:function(e){
    console.log('picker发送选择改变，携带值为', e)
    var url = this.data.url
    app.match = this.data.match[e.currentTarget.id]
    app.match.value = parseInt(e.detail.value)+1
    wx.navigateTo({
      url: url + '/' + url,
    })
  },
  matchCode:function(e){
    app.match = this.data.match[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: 'matchCode/matchCode?code=' + e.target.id
    })
  },
  getMacthList:function(){
    var that = this;
    if(!that.data.isLoading){
        return false;
    }else{
      that.setData({
        isLoading: false
      })
    }
    wx.showLoading({
      title: '正在加载中',
    })

    app.http({
      url: "/app/Applet/myMatches",
      method: "get",
      data:{
        page: that.data.page,
        type: that.data.navOn
      },
      success: res => {
        console.log(res.data)
        that.setData({
          match: that.data.match.concat(res.data)
        })
      },
      complete:res => {
        that.setData({
          isLoading: true
        })
        wx.hideLoading()
      }
    })
  },
  picker:function(e){
    var that = this
    var idx = e.currentTarget.id
    var match = that.data.match
    var array = []
    for (var i = 1; i <= match[idx].session;i++){
        array.push('第'+i+'场')
    }
    that.setData({
      array: array,
      url: e.currentTarget.dataset.url
    })
  }
})