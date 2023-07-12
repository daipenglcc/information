// pages/login/login.js
const http = require('../../utils/http.js')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isCheck: false,
		nickname: '',
		avatarUrl: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			avatarUrl: wx.getStorageSync('userInfo').avatarUrl || '',
			nickname: wx.getStorageSync('userInfo').nickName || ''
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
	// 输入昵称
	handleInput(event) {
		const value = event.detail.value
		this.setData({
			nickname: value
		})
	},
	// 选择头像
	async onChooseAvatar(e) {
		console.log('e', e)
		console.log('e.detail', e.detail)
		const { avatarUrl } = e.detail
		wx.uploadFile({
			url: 'https://server.wuxianliuliang.cn/api/file/img/upload',
			filePath: avatarUrl,
			name: 'avatarImg',
			header: { 'content-type': 'multipart/form-data' },
			success: res => {
				const data = res.data
				//do something
				this.setData({
					avatarUrl
				})
			},
			fail: error => {
				console.log('Error', error)
			}
		})
	},
	// 选择昵称
	async handleInputComplete(event) {
		const nickName = event.detail.value
		this.setData({
			nickname: nickName
		})
	},
	toSingPage() {
		wx.navigateTo({
			url: '/pages/singlePage/singlePage?type=1'
		})
	},
	async submit() {
		if (!this.data.avatarUrl) {
			wx.showToast({
				title: '请选择头像',
				icon: 'none'
			})
			return
		}
		if (!this.data.nickname) {
			wx.showToast({
				title: '请输入昵称',
				icon: 'none'
			})
			return
		}
		// http.httpPost(
		// 	{
		// 		loading: '提交中...',
		// 		url: 'api/user/login',
		// 		params: {
		// 			mobile: Number(formData.mobile),
		// 			password: formData.password
		// 		},
		// 		complete: function (msg) {},
		// 		success: function (result) {
		// 			console.log(result)
		// 			wx.setStorageSync('mobile', formData.mobile)
		// 			wx.setStorageSync('company', result.company) //是否是企业用户
		// 			wx.setStorageSync('token', result.token)
		// 			wx.reLaunch({
		// 				url: '/pages/memberCenter/memberCenter'
		// 			})
		// 		},
		// 		fail: function (e) {}
		// 	},
		// 	'POST'
		// )

		try {
			let unionId = await this.getUnionId()
			let obj = {
				avatarUrl: this.data.avatarUrl,
				nickName: this.data.nickname,
				unionId,
				bind: wx.getStorageSync('userInfo').bind || false,
				username: wx.getStorageSync('userInfo').username || '',
				smallId: wx.getStorageSync('userInfo').smallId || '',
				identity: wx.getStorageSync('userInfo').identity || '',
				phone: wx.getStorageSync('userInfo').phone || ''
			}
			wx.setStorage({
				key: 'userInfo',
				data: obj,
				success: () => {
					http.httpPost({
						url: '/api/system/user/wechat',
						params: {
							avar: this.data.avatarUrl,
							name: this.data.nickname,
							unionId
						},
						complete: result => {
							wx.navigateBack({
								delta: 1,
								success: () => {
									// 登录成功
									wx.showToast({
										title: '登录成功',
										icon: 'none'
									})
								}
							})
						},
						fail: error => {}
					})
				},
				fail: error => {
					// console.log('存储缓存失败', error)
				}
			})
		} catch (error) {
			wx.showToast({
				title: '登录失败',
				icon: 'none'
			})
			return
		}
	},
	checkLogin(e) {
		var isCheck = !this.data.isCheck
		this.setData({
			isCheck: isCheck
		})
	},
	// 用code换取unionId
	getUnionId() {
		return new Promise((resolve, reject) => {
			wx.login({
				success: res => {
					http.httpGet({
						url: '/api/system/login',
						params: {
							code: res.code
						},
						complete: function (result) {
							resolve(result.data.data.unionId)
						},
						fail: function (error) {}
					})
				},
				fail: error => {
					console.log('error', error)
					reject('登录失败')
				}
			})
		})
	}
})
