/*
 * @Descripttion:
 * @version: 1.0.1
 * @Author: daipeng
 * @Date: 2023-07-08 17:08:25
 * @LastEditors: daipeng
 * @LastEditTime: 2023-07-08 17:15:33
 */
// pages/personalData/personalData.js
const app = getApp()
const http = require('../../utils/http.js')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		genderArray: ['男', '女'],
		genderIndex: -1,
		formData: {},
		isCheck: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getFormData()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {
		return {
			title: '网络信息安全系统平台',
			path: '/pages/splash/splash'
		}
	},
	checkLogin(e) {
		var isCheck = !this.data.isCheck
		this.setData({
			isCheck: isCheck
		})
	},
	toSingPage() {
		wx.navigateTo({
			url: '../../pages/singlePage/singlePage'
		})
	},
	getFormData() {
		const that = this
		http.httpGet({
			loading: '加载中...',
			url: '/api/user/getUser',
			params: {
				token: wx.getStorageSync('token')
			},
			complete: function (msg) {},
			success: function (result) {
				console.log(result)

				that.setData({
					formData: result,
					genderIndex: result.sex
				})
			},
			fail: function (e) {}
		})
	},
	submit(e) {
		var formData = e.detail.value
		if (!formData.userName) {
			wx.showToast({
				title: '请输入账号',
				icon: 'none'
			})
			return
		}

		if (!formData.pwd) {
			wx.showToast({
				title: '请输入密码',
				icon: 'none'
			})
			return
		}

		var data = {
			token: wx.getStorageSync('token'),
			// userName: formData.userName,
			email: formData.email,
			// phonenumber: formData.phonenumber,
			sex: this.data.genderIndex
		}
		const that = this
		http.httpPost({
			loading: '提交中...',
			url: '/api/user/resetUser',
			params: data,
			complete: function (msg) {},
			success: function (result) {
				console.log(result)
				that.getFormData()
			},
			fail: function (e) {}
		})
	},
	bindGenderChange(e) {
		this.setData({
			genderIndex: e.detail.value
		})
	}
})
