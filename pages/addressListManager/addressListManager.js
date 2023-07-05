// pages/addressListManager/addressListManager.js
const app = getApp();
const http = require('../../utils/http.js');
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

    this.getList();
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
  },
  delAddress(e) {
    console.log(e.currentTarget.dataset.item);
    const that = this;
    const customerId = e.currentTarget.dataset.item.customerId;
    http.httpDelete({
      loading: '加载中...',
      url: 'api/wxllCustomer/' + customerId,
      params: {
        id: customerId,
      },
      complete: function (msg) {

      },
      success: function (result) {
        console.log(result);
        that.getList();
      },
      fail: function (e) {

      }
    });
  },
  preview(e) {
    const url = e.currentTarget.dataset.url;
    var list = [];
    list.push(url);
    wx.previewImage({
      urls: list,
    })
  },
  getList() {
    const that = this;

    http.httpGet({
      loading: '加载中...',
      url: 'api/wxllCustomer',
      params: {
      },
      complete: function (msg) {

      },
      success: function (result) {
        console.log(result);
        that.setData({
          mList: result
        })
        // for (const index in result) {
        //   if (Object.hasOwnProperty.call(result, index)) {
        //     const element = result[index];
        //     var id = 'testCanvas' + index;
        //     console.log(index);
        //     console.log(element.addressShow);
        // that.drawQr();

        //   }
        // }
      },
      fail: function (e) {

      }
    });
  },
  drawQr() {
    wx.createSelectorQuery()
      .select("testCanvas0") // 在 WXML 中填入的 id
      .node(({ node: canvas }) => {
        // var canvas = res[0].node
        const context = canvas.getContext('2d')
        // 调用方法drawQrcode生成二维码
        drawQrcode({
          canvas: canvas,
          canvasId: context,
          width: 100,
          padding: 0,
          background: '#ffffff',
          foreground: '#000000',
          text: element.addressShow,
        })
      })
      .exec()



  },
  towlsq(e) {
    console.log(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/logistics/logistics?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }, edit(e) {
    wx.navigateTo({
      url: '/pages/addAddress/addAddress?edit=true&item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  preview(e) {
    console.log(e.currentTarget.dataset.img)
    wx.previewImage({
      urls: [e.currentTarget.dataset.img],
    })
  }, copyText(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.txt,
    })
  }
})