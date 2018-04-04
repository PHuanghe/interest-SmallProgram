var app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fishMessage:[],
    page:1,
    isInfo:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getfishMessage();
  },
  getfishMessage:function(){
    var that = this
    app.http({
      url: "/app/pond/putFishLists",
      method: "GET",
      data:{
        page:that.data.page
      },
      success: res => {
        var fishMessage = that.data.fishMessage.concat(res.data)
        if (res.data.length<10){
          that.setData({
            isInfo:false,
            fishMessage: fishMessage
          })
          return ;
        }
        that.setData({
          fishMessage: fishMessage,
          page: that.data.page+1
        })
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
    var that = this
    if (that.data.isInfo){
      that.getfishMessage()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '钓鱼人的钓鱼神器，关注领红包',
      imageUrl: '/images/yuxun.jpg'
    }
  },
  //点赞鱼汛
  zan:function(e){
     var that = this
     var index = e.currentTarget.id
     var fishMessage = that.data.fishMessage
     app.http({
       url: "/app/Applet/likePutFish",
       method: "POST",
       data: {
         fishId: fishMessage[index].fishId
       },
       success: res => {
         if (res.status==1){
            wx.showToast({
              title: '点赞成功',
            })
            fishMessage[index].likes = parseInt(fishMessage[index].likes)+1;
            fishMessage[index].isLike = 1
            that.setData({
              fishMessage: fishMessage
            })
         }else{
           wx.showToast({
             title: res.msg,
           })
         }
       }
     })
  },
  //点击图片进行预览
  previewImg: function (e) {
    var fishMessage = this.data.fishMessage;
    var dadIndex = e.currentTarget.dataset.index
    var imgIndex = e.currentTarget.id
    wx.previewImage({
      current: fishMessage[dadIndex].images[imgIndex], // 当前显示图片的http链接
      urls: fishMessage[dadIndex].images // 需要预览的图片http链接列表
    })
  },
})