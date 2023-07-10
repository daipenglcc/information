// pages/logistics/logistics.js

const app = getApp()
const http = require('../../utils/http.js')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		mList: [],
		wList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		if (options.item) {
			var mList = []
			var item = JSON.parse(options.item)
			console.log('mList', item)
			mList.push(item)
			this.setData({
				mList: mList
			})
			console.log('mList', mList)
			this.getList(mList[0].customerId)
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		if (this.data.mList[0]) {
			this.getList(this.data.mList[0].customerId)
		}
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
			path: '/pages/index/index'
		}
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
	},
	delLogistics(e) {
		console.log(e.currentTarget.dataset.item)
		const that = this
		const customerId = that.data.mList[0].customerId
		const courierId = e.currentTarget.dataset.item.courierId
		http.httpPost({
			loading: '加载中...',
			url: 'api/wxllCustomer/deleteCourier/' + customerId + '/' + courierId,
			params: {
				customerId,
				courierId
			},
			complete: function (msg) {},
			success: function (result) {
				console.log(result)
				that.getList(that.data.mList[0].customerId)
			},
			fail: function (e) {}
		})
	},
	addLogistics(e) {
		console.log(e.currentTarget.dataset.item)
		wx.navigateTo({
			url: '/pages/addLogistics/addLogistics?item=' + JSON.stringify(e.currentTarget.dataset.item)
		})
	},
	getList(customerId) {
		const that = this

		http.httpGet({
			loading: '加载中...',
			url: 'api/wxllCustomer/getMyWxllCourierList/' + customerId,
			params: {
				customerId
			},
			complete: function (msg) {},
			success: function (result) {
				console.log(result)
				that.setData({
					wList: result
				})
			},
			fail: function (e) {}
		})
	}
})
