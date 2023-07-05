// pages/login/login.js
const http = require('../../utils/http.js')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isCheck: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {},

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
	toSingPage() {
		wx.navigateTo({
			url: '/pages/singlePage/singlePage?type=1'
		})
	},
	submit(e) {
		console.log(e.detail.value)

		var formData = e.detail.value

		if (!formData.mobile) {
			wx.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}
		if (!formData.password) {
			wx.showToast({
				title: '请输入密码',
				icon: 'none'
			})
			return
		}
		if (!this.data.isCheck) {
			wx.showToast({
				title: '请先同意服务协议，隐私全政策',
				icon: 'none'
			})
			return
		}
		http.httpPost(
			{
				loading: '登录中...',
				url: 'api/user/login',
				params: {
					mobile: Number(formData.mobile),
					password: formData.password
				},
				complete: function (msg) {},
				success: function (result) {
					console.log(result)
					wx.setStorageSync('mobile', formData.mobile)
					wx.setStorageSync('company', result.company) //是否是企业用户
					wx.setStorageSync('token', result.token)
					wx.reLaunch({
						url: '/pages/memberCenter/memberCenter'
					})
				},
				fail: function (e) {}
			},
			'POST'
		)
	},
	checkLogin(e) {
		var isCheck = !this.data.isCheck
		this.setData({
			isCheck: isCheck
		})
	}
})
