// index.js
// 获取应用实例
const app = getApp()
const http = require('../../utils/http.js')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		nickName: '',
		avatarUrl: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {},

	async onChooseAvatar(e) {
		const { avatarUrl } = e.detail
		// 信息保存
		try {
			let unionId = await this.getUnionId()
			let obj = {
				avatarUrl: avatarUrl,
				nickName: wx.getStorageSync('userInfo').nickName || '',
				unionId,
				bind: false,
				username: '',
				smallId: '',
				identity: '',
				phone: ''
			}
			wx.setStorage({
				key: 'userInfo',
				data: obj,
				success: () => {
					this.setData({
						unionId,
						nickName: wx.getStorageSync('userInfo').nickName || '',
						avatarUrl: avatarUrl
					})

					http.httpPost({
						url: '/api/system/user/wechat',
						params: {
							avar: avatarUrl,
							name: wx.getStorageSync('userInfo').nickName || '',
							unionId
						},
						complete: result => {},
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

	toLogin() {
		wx.navigateTo({
			url: '../../pages/login/login'
		})
	},

	async getSqlData() {
		wx.showLoading({
			title: '初始化登录'
		})

		try {
			let unionId = await this.getUnionId()
			console.log('unionId', unionId)
			// 获取unionId，判断是否已进行绑定
			// 有绑定信息绑定or无绑定信息
			http.httpGet({
				url: '/api/system/user/detail',
				params: {
					unionId
				},
				complete: result => {
					let userInfo = result.data.data
					if (userInfo.nickname) {
						// 存在绑定信息，执行回显
						let obj = {
							avatarUrl: userInfo.avar,
							nickName: userInfo.nickname,
							unionId,
							bind: userInfo.bind,
							username: userInfo.username,
							smallId: userInfo.id,
							identity: userInfo.identity,
							phone: userInfo.phone
						}
						console.log('obj', obj)
						wx.setStorage({
							key: 'userInfo',
							data: obj,
							success: () => {
								this.setData({
									unionId,
									nickName: userInfo.nickname,
									avatarUrl: userInfo.avar
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
			// 初始化完成
			wx.hideLoading()
		} catch (error) {
			console.log('error', error)
			wx.showToast({
				title: '初始化登录失败',
				icon: 'none'
			})
			return
		}
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
	},

	setMyInfo() {
		// 判断是否登录
		if (!wx.getStorageSync('userInfo').nickName || !wx.getStorageSync('userInfo').avatarUrl) {
			return wx.showToast({
				title: '请先登录/注册',
				icon: 'none'
			})
		}

		// if (!wx.getStorageSync('userInfo').bind) {
		// 	return wx.showToast({
		// 		title: '请先完成安全信息平台账号绑定',
		// 		icon: 'none'
		// 	})
		// }

		wx.navigateTo({
			url: '../../pages/setMyInfo/setMyInfo'
		})
	},

	bingCode() {
		// 判断是否登录
		if (!wx.getStorageSync('userInfo').nickName || !wx.getStorageSync('userInfo').avatarUrl) {
			return wx.showToast({
				title: '请先登录/注册',
				icon: 'none'
			})
		}
		wx.navigateTo({
			url: '../../pages/bingCode/bingCode'
		})
	},

	goAddr() {
		// 判断是否登录
		if (!wx.getStorageSync('userInfo').nickName || !wx.getStorageSync('userInfo').avatarUrl) {
			return wx.showToast({
				title: '请先登录/注册',
				icon: 'none'
			})
		}
		wx.navigateTo({
			url: '../../pages/addressListManager/addressListManager'
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		console.log('获取详情')
		wx.getStorage({
			key: 'userInfo',
			success: res => {
				console.log('res.data', res.data)
				if (res.data.avatarUrl && res.data.nickName) {
					this.setData({
						unionId: res.data.unionId,
						nickName: res.data.nickName,
						avatarUrl: res.data.avatarUrl
					})

					if (!res.data.username) {
						// 本地无存储，执行数据库存储校验
						this.getSqlData()
					}
				} else {
					// 本地无存储，执行数据库存储校验
					this.getSqlData()
				}
			},
			fail: error => {
				// 本地无存储，执行数据库存储校验
				this.getSqlData()
			}
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '网络信息安全系统平台',
			path: '/pages/index/index'
		}
	}
})
