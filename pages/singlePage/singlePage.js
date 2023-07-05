// pages/singlePage/singlePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.type) {
      switch (options.type - 0) {
        case 0:
          wx.setNavigationBarTitle({
            title: '帮助中心',
          })
          break;
        case 1:
          wx.setNavigationBarTitle({
            title: '隐私协议',
          })
          break;

        default:
          break;
      }
    }
    this.setData({
      type: options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '网络信息安全系统平台',
      path: '/pages/splash/splash'
    }
  }
})