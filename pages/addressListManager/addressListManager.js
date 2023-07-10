// pages/addressListManager/addressListManager.js
const app = getApp()
const http = require('../../utils/http.js')
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		mList: []
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
	onShow() {
		this.getList()
	},

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
	delAddress(e) {
		console.log(e.currentTarget.dataset.item)
		const that = this
		const customerId = e.currentTarget.dataset.item.customerId
		http.httpDelete({
			loading: '加载中...',
			url: 'api/wxllCustomer/' + customerId,
			params: {
				id: customerId
			},
			complete: function (msg) {},
			success: function (result) {
				console.log(result)
				that.getList()
			},
			fail: function (e) {}
		})
	},
	preview(e) {
		const url = e.currentTarget.dataset.url
		var list = []
		list.push(url)
		wx.previewImage({
			urls: list
		})
	},
	getList() {
		http.httpGet({
			loading: '加载中...',
			url: '/api/address/page',
			params: {
				unionId: wx.getStorageSync('userInfo').unionId
			},
			complete: result => {
				this.setData({
					mList: result.data.data.records
				})

				let arr = result.data.data.records

				for (const index in arr) {
					this.drawQr2(index)

					// 	if (Object.hasOwnProperty.call(arr, index)) {
					// 		const element = arr[index]
					// 		var id = 'testCanvas' + index
					// 		console.log(index)
					// 		// console.log(element.addressShow)
					// 		this.2(element)
					// 	}
				}
			},
			fail: function (e) {}
		})
	},
	drawQr2(index) {
		// wx.createSelectorQuery()
		// 	.select('testCanvas0') // 在 WXML 中填入的 id
		// 	.node(({ node: canvas }) => {
		// 		var canvas = element.node
		// 		const context = canvas.getContext('2d')

		// 		console.log(999999)
		// 		// 调用方法2code生成二维码
		// 		2code({
		// 			canvas: canvas,
		// 			canvasId: context,
		// 			width: 100,
		// 			padding: 0,
		// 			background: '#ffffff',
		// 			foreground: '#000000',
		// 			text: 'element.addressShow'
		// 		})
		// 	})
		// 	.exec()
		const query = wx.createSelectorQuery()
		query
			.select('#testCanvas0')
			.fields({
				node: true,
				size: true
			})
			.exec(res => {
				var canvas = res[0].node

				// 调用方法2code生成二维码
				drawQrcode({
					canvas: canvas,
					canvasId: 'myQrcode',
					width: 260,
					padding: 30,
					background: '#ffffff',
					foreground: '#000000',
					text: this.data.mList[index].addressEncode
				})

				// 获取临时路径（得到之后，想干嘛就干嘛了）
				wx.canvasToTempFilePath({
					canvasId: 'myQrcode',
					canvas: canvas,
					x: 0,
					y: 0,
					width: 260,
					height: 260,
					destWidth: 260,
					destHeight: 260,
					success(res) {
						console.log('二维码临时路径：', res.tempFilePath)
					},
					fail(res) {
						console.error(res)
					}
				})
			})
	},
	edit(e) {
		wx.navigateTo({
			url: '/pages/addAddress/addAddress?edit=true&item=' + JSON.stringify(e.currentTarget.dataset.item)
		})
	},
	preview(e) {
		console.log(e.currentTarget.dataset.img)
		wx.previewImage({
			urls: [e.currentTarget.dataset.img]
		})
	},
	copyText(e) {
		wx.setClipboardData({
			data: e.currentTarget.dataset.txt
		})
	}
})
