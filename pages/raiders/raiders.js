const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    value: "",
    page: 1,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(true)
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
    //this.getList(true)
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
  onReachBottom: function (res) {
    if (!this.data.noMore) {
      this.getList(false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareInfo
  },
  inputValue: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  getList: function (first) {
    var that = this,json
    if (first) {
      that.setData({
        list: [],
        noMore: false,
        page: 1
      })
    }
    if (first.target && first.target.dataset.seach){
      that.setData({
        list: [],
        noMore: false,
        page: 1
      })
      json = { isCatch: 1,pondSearch: that.data.value, page: that.data.page}
    }else{
      json = { isCatch: 1,page: that.data.page}
    }
    app.http({
      url: "/app/find/threadLists",
      method: "POST",
      data: json,
      success: res => {
        var list = that.data.list.concat(res.data)
        if (res.data.length < 10){
          that.setData({
            noMore: true,
            list:list
          })
          return ;
        }
        that.setData({
          list: list,
          page: that.data.page + 1
        })
        // if (res.data.length <= 0) {
        //   that.setData({
        //     noMore: true
        //   })
        // }
      }
    })
  },
  linkTo: function (event) {
    wx.navigateTo({
      url: '../raiders-detail/raiders-detail?id=' + event.currentTarget.id
    })
  },
  toAnglingSite: function (event) {
    wx.navigateTo({
      url: '/pages/fishingGroundDetails/fishingGroundDetails?id=' + event.currentTarget.id
    })
  }
})