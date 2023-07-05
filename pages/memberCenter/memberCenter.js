// pages/memberCenter/memberCenter.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkLoginStr: "",
    company:false,
    userInfo: {
      moblie: ""
    },
    formData:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false // wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName')如需尝试获取用户信息可改为false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getFormData();
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if (wx.getStorageSync('userInfo')) {
      var userInfo = wx.getStorageSync('userInfo');
      userInfo['moblie'] = wx.getStorageSync('mobile');
      this.setData({
        userInfo,
        hasUserInfo: true,
        checkLoginStr: "checkLogin",
        company:wx.getStorageSync('company')
      })
      console.log(userInfo)
      
    } else {
      this.setData({
        checkLoginStr: "show"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      userInfo['moblie'] = wx.getStorageSync('mobile');
      this.setData({
        userInfo,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      userInfo['moblie'] = wx.getStorageSync('mobile');
      this.setData({
        userInfo
      })
    }
    this.setData({
      company:wx.getStorageSync('company')
    })
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
  outlogin() {
    wx.showModal({
      title: "温馨提示",
      content: "确定退出登录吗？",
      confirmColor: "#1D6BE9",
      cancelColor: '#666666',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo')
          wx.reLaunch({
            url: '/pages/splash/splash',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        wx.setStorageSync('userInfo', res.userInfo);
        res.userInfo['moblie'] = wx.getStorageSync('mobile');
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          checkLoginStr: "hide",
          company:wx.getStorageSync('company')
        })
        this.commitUserInfo(res.userInfo);
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    wx.setStorageSync('userInfo', e.detail.userInfo);
    e.detail.userInfo['moblie'] = wx.getStorageSync('mobile');
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      checkLoginStr: "hide",
      company:wx.getStorageSync('company')
    })
    this.commitUserInfo(e.detail.userInfo);
  },
  getFormData() {
    const that = this;
    http.httpGet({
      loading: '加载中...',
      url: 'api/user/getUser',
      params: {
      },
      complete: function (msg) {

      },
      success: function (result) {
        console.log(result);

        that.setData({
          formData: result
        })
      },
      fail: function (e) {

      }
    });
  },
  commitUserInfo(formData) {
    return
    var data = {
      token: wx.getStorageSync('token'),
      nickName: formData.nickName,
      avatar: formData.avatarUrl,
    };
    const that = this;
    http.httpPost({
      loading: '提交中...',
      url: '/api/user/resetUser',
      params: data,
      complete: function (msg) {

      },
      success: function (result) {
        console.log(result);
      
      },
      fail: function (e) {

      }
    });
  }
})