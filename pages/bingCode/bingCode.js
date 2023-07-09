/*
 * @Descripttion:
 * @version: 1.0.1
 * @Author: daipeng
 * @Date: 2023-07-08 17:08:25
 * @LastEditors: daipeng
 * @LastEditTime: 2023-07-09 18:12:33
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
		isCheck: false,
		bind: false,
		username: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			bind: wx.getStorageSync('userInfo').bind,
			username: wx.getStorageSync('userInfo').username
		})
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
	submit(e) {
		if (this.data.bind) {
			wx.navigateBack({
				delta: 1,
				success: () => {}
			})
			return
		}
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

		const that = this
		http.httpPost({
			loading: '绑定中...',
			url: '/api/system/bind',
			params: {
				unionId: wx.getStorageSync('userInfo').unionId,
				username: formData.userName,
				password: formData.pwd
			},
			complete: result => {
				let data = result.data
				console.log('data', data)
				if (data.code == 200) {
					wx.showToast({
						title: '账号绑定成功',
						icon: 'none'
					})
					let obj = {
						avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
						nickName: wx.getStorageSync('userInfo').nickName,
						unionId: wx.getStorageSync('userInfo').unionId,
						bind: data.data.bind,
						username: data.data.username,
						smallId: data.data.id,
						identity: data.data.identity,
						phone: data.data.phone
					}
					// 缓存绑定信息
					wx.setStorage({
						key: 'userInfo',
						data: obj,
						success: () => {
							wx.navigateBack({
								delta: 1,
								success: () => {}
							})
						}
					})
				} else {
					wx.showToast({
						title: data.message,
						icon: 'none'
					})
				}
			},
			fail: error => {}
		})
	},
	bindGenderChange(e) {
		this.setData({
			genderIndex: e.detail.value
		})
	}
})
