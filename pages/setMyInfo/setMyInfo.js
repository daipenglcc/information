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
		formData: {
			userName: '',
			name: '',
			sfz: '',
			phonenumber: ''
		},
		isCheck: false,
		countdown: '60'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			['formData.userName']: wx.getStorageSync('userInfo').username,
			['formData.name']: wx.getStorageSync('userInfo').nickName,
			['formData.sfz']: wx.getStorageSync('userInfo').identity,
			['formData.phonenumber']: wx.getStorageSync('userInfo').phone
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
			path: '/pages/index/index'
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
	// getFormData() {
	// 	const that = this
	// 	http.httpGet({
	// 		loading: '加载中...',
	// 		url: '/api/user/getUser',
	// 		params: {
	// 			token: wx.getStorageSync('token')
	// 		},
	// 		complete: function (msg) {},
	// 		success: function (result) {
	// 			console.log(result)

	// 			that.setData({
	// 				formData: result,
	// 				genderIndex: result.sex
	// 			})
	// 		},
	// 		fail: function (e) {}
	// 	})
	// },
	submit(e) {
		var formData = e.detail.value
		if (!formData.userName) {
			wx.showToast({
				title: '请输入用户名',
				icon: 'none'
			})
			return
		}

		if (!formData.name) {
			wx.showToast({
				title: '请输入姓名',
				icon: 'none'
			})
			return
		}

		if (!formData.sfz) {
			wx.showToast({
				title: '请输入身份证号',
				icon: 'none'
			})
			return
		}

		if (!formData.phonenumber) {
			wx.showToast({
				title: '请输入手机号码',
				icon: 'none'
			})
			return
		}

		if (!formData.phonecode) {
			wx.showToast({
				title: '请输入验证码',
				icon: 'none'
			})
			return
		}

		if (!this.data.isCheck) {
			wx.showToast({
				title: '请先同意《信息安全平台用户协议》',
				icon: 'none'
			})
			return
		}

		// 第一步验证手机号验证码
		http.httpGet({
			url: '/api/user/check/code/' + this.data.formData.phonenumber + '/' + formData.phonecode,
			complete: result => {
				console.log('result', result)
				if (result.data.data) {
					http.httpPost({
						loading: '提交中...',
						url: '/api/system/update',
						params: {
							unionId: wx.getStorageSync('userInfo').unionId,
							identity: formData.sfz,
							nickname: formData.name,
							phone: formData.phonenumber,
							username: formData.userName
						},
						complete: result => {
							console.log('result', result)
							http.httpGet({
								url: '/api/system/user/detail',
								params: {
									unionId: wx.getStorageSync('userInfo').unionId
								},
								complete: result => {
									let userInfo = result.data.data
									if (userInfo.nickname) {
										// 存在绑定信息，执行回显
										let obj = {
											avatarUrl: userInfo.avar,
											nickName: userInfo.nickname,
											unionId: wx.getStorageSync('userInfo').unionId,
											bind: userInfo.bind,
											username: userInfo.username,
											smallId: userInfo.id,
											identity: userInfo.identity,
											phone: userInfo.phone
										}
										wx.setStorage({
											key: 'userInfo',
											data: obj,
											success: () => {
												wx.navigateBack({
													delta: 1,
													success: () => {
														// 提交成功
														wx.showToast({
															title: '提交成功',
															icon: 'none'
														})
													}
												})
											},
											fail: error => {
												// console.log('存储缓存失败', error)
											}
										})
									}
								},
								fail: function (error) {}
							})
						},
						fail: resule => {}
					})
				} else {
					wx.showToast({
						title: '验证码错误',
						icon: 'none'
					})
				}
			},
			fail: function (error) {}
		})

		console.log('formData', formData)
	},
	bindGenderChange(e) {
		this.setData({
			genderIndex: e.detail.value
		})
	},
	handleSendCode() {
		// if (!this.data.formData.phonenumber) {
		// 	wx.showToast({
		// 		title: '请输入手机号码',
		// 		icon: 'none'
		// 	})
		// 	return
		// }
		if (this.data.countdown != 60) {
			return
		}
		http.httpGet({
			url: '/api/user/send/code/' + this.data.formData.phonenumber,
			complete: result => {
				console.log('result', result)
				if (result.data.code == 200) {
					wx.showToast({
						title: '验证码已发送',
						icon: 'none'
					})

					const timer = setInterval(() => {
						if (this.data.countdown > 0) {
							this.setData({
								countdown: this.data.countdown - 1
							})
						} else {
							// 倒计时结束，清除定时器
							clearInterval(timer)
							this.setData({
								countdown: 60
							})
						}
					}, 1000)
				}
			},
			fail: function (error) {}
		})
	}
})
