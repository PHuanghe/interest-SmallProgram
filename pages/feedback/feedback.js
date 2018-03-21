const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: "",
    imagesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  chooseImage: function () {
    var that = this;
    if (that.data.imagesList.length>5){
        wx.showToast({
          title: '最多上传六张哦'
        })
        return;
    }
    wx.chooseImage({
      count: 1,
      success: res => {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.configUrl + "/app/qudiaoyu/uploadimg",
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'tokenId': app.globalData.tokenId
          },
          success: res => {
            var data = JSON.parse(res.data)
            that.setData({
              imagesList: that.data.imagesList.concat(data.data)
            })
          }
        })
      }
    })
  },
  titleValue: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  contentValue: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  del:function(e){
    var that = this
    var imagesList = that.data.imagesList;
    imagesList.splice(e.target.id, 1)
    that.setData({
      imagesList: imagesList
    })
  },
  sure: function () {
    var that = this
    var images = that.data.imagesList.join(",")
    var json = {
      content: that.data.content,
      images: images
    }
    if (!that.subSpace(that.data.title, json)){
      return false;
    }
    app.http({
      url: '/app/feedback/index',
      method: "POST",
      data: {
        title: that.data.title,
        content: JSON.stringify(json)
      },
      success: res => {
        if(res.status == 1){
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            confirmText: "好的",
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            confirmText: "好的"
          })
        }
      }
    })
  },
  subSpace:function(title,content){
    if (title == '' || title == undefined || title==null){
        wx.showToast({
          title: '请输入标题',
        })
        return false
    } else if (content == '' || content == undefined || content == null){
      wx.showToast({
        title: '请输入反馈内容',
      })
      return false
    }else{
      return true
    }
  },
  playImage:function(e){
    var that = this;
    wx.previewImage({
      current: that.data.imagesList[e.currentTarget.id], 
      urls: that.data.imagesList
    })
  }
})