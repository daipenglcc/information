// pages/employeeManagement/employeeManagement.js

const app = getApp()
const http = require('../../utils/http.js')
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
	onReady() {
		this.getList()
	},

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
	getList() {
		const that = this

		http.httpGet({
			loading: '加载中...',
			url: 'api/user/getCompanyAllUser',
			params: {},
			complete: function (msg) {},
			success: function (result) {
				console.log(result)
				that.setData({
					mList: result
				})
			},
			fail: function (e) {}
		})
	}
})
