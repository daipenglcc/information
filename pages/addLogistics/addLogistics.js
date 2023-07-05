// pages/addLogistics/addLogistics.js

const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mList: [],
    isCheckAll: false,
    item: {},
    commitIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.item) {
      var item = JSON.parse(options.item);
      console.log("mList", item)
      this.setData({
        item: item
      })
      this.getList();
    }
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
  }, checkItemAll: function () {

    const that = this;

    let mList = that.data.mList;
    for (const index in mList) {
      if (Object.hasOwnProperty.call(mList, index)) {
        let element = mList[index];
        element.isCheck = !that.data.isCheckAll
      }
    }
    that.setData({
      mList
    })
    that.checkAllFlag();

  },
  checkAllFlag() {
    const that = this;
    let size = 0;
    let mList = that.data.mList;
    for (const index in mList) {
      if (Object.hasOwnProperty.call(mList, index)) {
        const element = mList[index];
        if (element.isCheck) {
          size++
        }
      }
    }
    let isCheckAll = false;
    if (size == mList.length) {
      isCheckAll = true;
    }
    that.setData({
      isCheckAll: isCheckAll,
      commitIndex: size
    })
  },
  getList() {
    const that = this;

    http.httpGet({
      loading: '加载中...',
      url: 'api/wxllCustomer/getWxllCourierList',
      params: {
      },
      complete: function (msg) {

      },
      success: function (result) {
        console.log(result);
        that.setData({
          mList: result
        })
      },
      fail: function (e) {

      }
    });
  }, checkItem(e) {
    console.log(e)
    const indexx = e.currentTarget.dataset.index;
    this.data.mList[indexx].isCheck = !this.data.mList[indexx].isCheck;
    this.setData({
      mList: this.data.mList,
    })
    this.checkAllFlag();
  }, commit() {
    const that = this;
    var list = this.data.mList;
    var tempIndex = that.data.commitIndex;
    for (const index in list) {
      if (Object.hasOwnProperty.call(list, index)) {
        const element = list[index];
        if (element.isCheck) {
          var data = {
            "courierId": element.courierId,
            token: wx.getStorageSync('token'),
            "customerId": that.data.item.customerId,
          };
          tempIndex--;
          that.commitData(data, tempIndex)

        }
      }
    }



  },
  commitData(data, tempIndex) {
    const that = this;

    http.httpPost({
      loading: '加载中...',
      url: 'api/wxllCustomer/grantCourier',
      params: data,
      complete: function (msg) {

      },
      success: function (result) {
        console.log(result);
        console.log(tempIndex)

        if (tempIndex == 0) {
          wx.navigateBack({
            delta: 1,
          })
        }
      },
      fail: function (e) {

      }
    });
  }
})