const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    commentList: [],
    value: "",
    commentCount: "",
    focus: false,
    replyCommentId: 0,
    page: 1,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
    this.getCommentList(options.id, true)
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
    if (!this.data.noMore) {
      this.getCommentList(this.data.data.threadId)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return app.shareInfo
  // },
  getData: function (id) {
    var that = this
    app.http({
      url: "/app/qudiaoyu/threadDetail",
      method: "POST",
      data: {threadId: id},
      success: res => {
        that.setData({
          data: res.data
        })
      }
    })
  },
  getCommentList: function (id, first) {
    var that = this
    if (first) {
      that.setData({
        commentList: [],
        noMore: false,
        page: 1
      })
    }
    app.http({
      url: "/app/forum/commentList",
      method: "POST",
      data: { threadId: id, page: that.data.page },
      success: res => {
        if(res.data.length <= 0){
          that.setData({
            noMore: true
          })
        }
        that.setData({
          commentList: that.data.commentList.concat(res.data),
          commentCount: res.commentCount,
          page: that.data.page + 1
        })
      }
    })
  },
  dianZanThread: function () {
    var that = this
    if (that.data.data.is_zan){
      wx.showModal({
        title: '提示',
        content: '您已点赞过该帖子',
        showCancel: false,
        confirmText: "好的"
      })
    }else{
      app.http({
        url: "/app/qudiaoyu/threadLike",
        method: "POST",
        data: { threadId: that.data.data.threadId },
        success: res => {
          that.getData(that.data.data.threadId)
          wx.showToast({
            title: '点赞成功'
          })
        }
      })
    }
  },
  dianZanComment: function (event) {
    var that = this
    if(event.target.dataset.like){
      wx.showModal({
        title: '提示',
        content: '您已点赞过该评论',
        showCancel: false,
        confirmText: "好的"
      })
    }else {
      app.http({
        url: "/app/qudiaoyu/commentLike",
        method: "POST",
        data: { commentId: event.target.dataset.commentid },
        success: res => {
          that.getCommentList(that.data.data.threadId, true)
          wx.showToast({
            title: '点赞成功'
          })
        }
      })
    }
  },
  inputValue: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  commentThread: function () {
    var that = this,json
    if (that.data.replyCommentId == 0){
      json = {
        threadId: that.data.data.threadId,
        content: that.data.value
      }
    }else{
      json = {
        threadId: that.data.data.threadId,
        content: that.data.value,
        commentId: that.data.replyCommentId
      }
    }
    app.http({
      url: "/app/forum/comment",
      method: "POST",
      data: json,
      success: res => {
        that.setData({
          replyCommentId: 0
        })
        if(res.status == 1){
          that.getCommentList(that.data.data.threadId, true)
          wx.showToast({
            title: '评论成功'
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
  replyComment: function (e) {
    var that = this
    that.setData({
      focus: true,
      replyCommentId: e.target.dataset.commentid
    })
  }
})