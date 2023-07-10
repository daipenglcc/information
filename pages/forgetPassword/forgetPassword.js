// pages/register/register.js
const app = getApp()
const http = require('../../utils/http.js')
let timer = null
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		mMobile: '',
		codeSize: 60,
		codeTxt: '短信验证码'
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
			path: '/pages/index/index'
		}
	},
	submit(e) {
		console.log(e.detail.value)
		var formData = e.detail.value
		if (!formData.phone) {
			wx.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}

		if (!formData.code) {
			wx.showToast({
				title: '请输入验证码',
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
		if (!formData.confirmPassword) {
			wx.showToast({
				title: '请输入重复密码',
				icon: 'none'
			})
			return
		}
		if (formData.password != formData.confirmPassword) {
			wx.showToast({
				title: '两次密码不一致',
				icon: 'none'
			})
			return
		}

		http.httpPost({
			loading: '提交中...',
			url: 'api/user/forgetPassword',
			params: formData,
			complete: function (msg) {},
			success: function (result) {
				console.log(result)
				wx.showToast({
					title: '修改成功',
					icon: 'none'
				})
				setTimeout(() => {
					wx.navigateBack({
						delta: 1
					})
				}, 800)
			},
			fail: function (e) {
				wx.showToast({
					title: '修改失败',
					icon: 'none'
				})
			}
		})
	},
	checkPhone: function (e) {
		console.log(e.detail.value)
		this.setData({
			mMobile: e.detail.value
		})
	},
	getCode() {
		if (!this.data.mMobile) {
			wx.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}
		if (this.data.mMobile.length < 11) {
			wx.showToast({
				title: '手机号格式错误',
				icon: 'none'
			})
			return
		}
		if (this.timer != null) {
			return
		}
		let formData = {
			phone: this.data.mMobile,
			type: 1
		}
		const that = this
		http.httpPost({
			loading: '发送中...',
			url: 'api/user/sendSmsCode',
			params: formData,
			complete: function (msg) {},
			success: function (result) {
				console.log(result)
				that.timerTask()
			},
			fail: function (e) {
				wx.showToast({
					icon: 'none',
					title: '发送失败',
					duration: 2000
				})
			}
		})
	},
	timerTask() {
		const that = this
		this.timer = setInterval(() => {
			let code = that.data.codeSize
			code--
			that.setData({
				codeTxt: code + 's',
				codeSize: code
			})
			if (that.data.codeSize <= 1) {
				setTimeout(() => {
					clearInterval(that.timer)
					that.timer = null
					that.setData({
						codeTxt: '获取验证码',
						codeSize: 60
					})
				}, 900)
			}
		}, 1000)
	}
})
