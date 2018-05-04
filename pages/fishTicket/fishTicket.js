// pages/fishTicket/fishTicket.js
var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      { id: 0, text: '全部' },
      { id: 1, text: '未使用' },
      { id: 2, text: '进行中' },
      { id: 3, text: '已使用' },
    ],
    navOn: 1,
    page:1,
    ticket:[],  
    isInfo:true,
    isLoading:true,
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options.id;
    
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
    this.getMyTicket(this.options)
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
    this.initInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isInfo){
      this.getMyTicket(this.data.navOn)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   // return app.shareInfo
  // },
  switchNav: function (e) { 
    this.setData({
      page: 1,
      ticket:[],
      isInfo:true,
      id: e.currentTarget.dataset.id
    })
    this.getMyTicket(e.currentTarget.dataset.id)
  },
  //获取鱼票信息
  getMyTicket: function (status,isTop) {
    var that = this;
    if(!that.data.isLoading){
      return 
    }else{
      that.setData({
        isLoading:false,
        navOn: status
      })
    }
    app.http({
      url: "/app/pond/miniMyTicket",
      method: "GET",
      data: {
        page: that.data.page,
        status: status
      },
      success: res => {
        var ticket ;
        if (isTop){
          ticket = [].concat(res.data)
        }else{
          ticket = that.data.ticket.concat(res.data)
        }
        if (res.data.length <= 0) {
          that.setData({
            isInfo: false
          })
          return;
        }       
        that.setData({
          ticket: ticket,
          page: that.data.page + 1,
        })
      },
      complete:function () {
        that.setData({
          isLoading:true
        })
        wx.stopPullDownRefresh();
      }
    })
  },
  detail:function(e){
    wx.navigateTo({
      url: 'fishDetails/fishDetails?id=' + e.currentTarget.id,
    })
  },
  initInfo:function(){
    this.setData({
      page:1,
      isInfo:true
    })
    this.getMyTicket(this.data.navOn,true)
  }
})