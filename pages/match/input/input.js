// pages/me/myMatch/ranking/ranking.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
    // var that = this
    // if (!that.data.mask){
    //   that.setData({
    //     userList:[]
    //   })
    //   that.getPlayer();
    // }

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
  //获取选手列表
  code:function(e){
    var code = e.detail.value.code
    if (code==''){
      app.errorToast("请输入邀请码");
      return false;  
    }
    wx.navigateTo({
      url: 'inputInfo/inputInfo?id=' + this.data.id + '&code=' + code,
    })   
  }
})