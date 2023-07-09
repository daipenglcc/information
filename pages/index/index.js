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

	getUserInfo() {
		if (this.data.nickName) {
			return
		}
		wx.getUserProfile({
			desc: '用于保存用户的昵称', // 声明获取用户个人信息后的用途
			success: async res => {
				// 获取unionId
				try {
					let unionId = await this.getUnionId()
					let obj = {
						avatarUrl: res.userInfo.avatarUrl,
						nickName: res.userInfo.nickName,
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
								nickName: res.userInfo.nickName,
								avatarUrl: res.userInfo.avatarUrl
							})

							http.httpPost({
								url: '/api/system/user/wechat',
								params: {
									avar: res.userInfo.avatarUrl,
									name: res.userInfo.nickName,
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
			fail: f => {
				wx.showToast({
					title: '授权失败',
					icon: 'none'
				})
				return
			}
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
		if (!wx.getStorageSync('userInfo')) {
			return wx.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
		wx.navigateTo({
			url: '../../pages/setMyInfo/setMyInfo'
		})
	},

	bingCode() {
		// 判断是否登录
		if (!wx.getStorageSync('userInfo')) {
			return wx.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
		wx.navigateTo({
			url: '../../pages/bingCode/bingCode'
		})
	},

	goAddr() {
		// 判断是否登录
		if (!wx.getStorageSync('userInfo')) {
			return wx.showToast({
				title: '请先登录',
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
		wx.getStorage({
			key: 'userInfo',
			success: res => {
				this.setData({
					unionId: res.data.unionId,
					nickName: res.data.nickName,
					avatarUrl: res.data.avatarUrl
				})
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
			path: '/pages/splash/splash'
		}
	}
})
