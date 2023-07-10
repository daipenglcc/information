// pages/addAddress/addAddress.js
const app = getApp()
const http = require('../../utils/http.js')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		region: ['山东省', '济南市', '历下区', ''],
		customItem: '全部',
		provinceArray: [],
		cityArray: [],
		areaArray: [],
		xiangArray: [],
		multiArray: [],
		multiIndex: [],
		edit: false,
		formData: {
			province: '',
			provinceCode: 0,
			city: '',
			cityCode: 0,
			area: '',
			areaCode: 0,
			street: '',
			streetCode: 0
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		if (options.edit) {
			this.setData({
				edit: true
			})
			wx.setNavigationBarTitle({
				title: '编辑地址'
			})
		}
		if (options.item) {
			let getData = JSON.parse(options.item)

			console.log('getData', getData)

			this.setData({
				['formData.customerName']: getData.name,
				['formData.phone']: getData.phone,
				['formData.area']: getData.area,
				['formData.address']: getData.address,
				['formData.addressShow']: getData.streetNumber,
				multiIndex: JSON.parse(getData.area).join('、'),
				multiArray: JSON.parse(getData.area),
				id: getData.id
			})
		}
		// this.getSheng()
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
	bindMultiPickerChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			multiArray: e.detail.value,
			multiIndex: e.detail.value.join('、')
		})
		// const that = this
		// let formData = that.data.formData
		// formData.province = that.data.multiArray[0][that.data.multiIndex[0]].name
		// formData.provinceCode = that.data.multiArray[0][that.data.multiIndex[0]].id
		// formData.city = that.data.multiArray[1][that.data.multiIndex[1]].name
		// formData.cityCode = that.data.multiArray[1][that.data.multiIndex[1]].id
		// formData.area = that.data.multiArray[2][that.data.multiIndex[2]].name
		// formData.areaCode = that.data.multiArray[2][that.data.multiIndex[2]].id
		// formData.street = that.data.multiArray[3][that.data.multiIndex[3]].name
		// formData.streetCode = that.data.multiArray[3][that.data.multiIndex[3]].id
		// this.setData({
		// 	formData: formData
		// })
	},

	// bindMultiPickerColumnChange: function (e) {
	// 	console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
	// 	const that = this
	// 	var data = {
	// 		multiArray: this.data.multiArray,
	// 		multiIndex: this.data.multiIndex
	// 	}
	// 	data.multiIndex[e.detail.column] = e.detail.value
	// 	switch (e.detail.column) {
	// 		case 0:
	// 			var item = data.multiArray[0][e.detail.value]
	// 			console.log('name', item.id)
	// 			console.log('name', item)
	// 			var formDataId = item.id
	// 			that.getShi(formDataId)
	// 			break
	// 		case 1:
	// 			var item = data.multiArray[1][e.detail.value]
	// 			console.log('name', item.id)
	// 			console.log('name', item)
	// 			var formDataId = item.id
	// 			that.getqu(formDataId)
	// 			break
	// 		case 2:
	// 			var item = data.multiArray[2][e.detail.value]
	// 			console.log('name', item.id)
	// 			console.log('name', item)
	// 			var formDataId = item.id
	// 			that.getxiang(formDataId)
	// 			break
	// 	}
	// 	console.log(data.multiIndex)
	// 	this.setData(data)
	// },
	// bindRegionChange: function (e) {
	// 	console.log('picker发送选择改变，携带值为', e.detail.value)
	// 	this.setData({
	// 		region: e.detail.value
	// 	})
	// },
	// getSheng() {
	// 	const that = this
	// 	http.httpGet({
	// 		loading: '加载中...',
	// 		url: '/api/wxllCustomer/getArea',
	// 		params: {
	// 			token: wx.getStorageSync('token'),
	// 			pid: 0,
	// 			level: 1
	// 		},
	// 		complete: function (msg) {},
	// 		success: function (result) {
	// 			console.log(result)

	// 			that.setData({
	// 				provinceArray: result
	// 			})
	// 			if (result[0]) {
	// 				that.getShi(result[0].id)
	// 			} else {
	// 				const list = [{ id: '0', name: '全部' }]
	// 				that.setData({
	// 					cityArray: list,
	// 					areaArray: list,
	// 					xiangArray: list,
	// 					multiArray: [that.data.provinceArray, list, list, list]
	// 				})
	// 			}
	// 		},
	// 		fail: function (e) {}
	// 	})
	// },
	// getShi(pid) {
	// 	console.log('pid==>', pid)
	// 	const that = this
	// 	http.httpGet({
	// 		loading: '加载中...',
	// 		url: '/api/wxllCustomer/getArea',
	// 		params: {
	// 			pid: pid,
	// 			level: 2
	// 		},
	// 		complete: function (msg) {},
	// 		success: function (result) {
	// 			console.log('getShi', result)

	// 			if (result[0]) {
	// 				that.setData({
	// 					cityArray: result
	// 				})
	// 				that.getqu(result[0].id)
	// 			} else {
	// 				const list = [{ id: '0', name: '全部' }]
	// 				var multiIndex = [that.data.multiIndex[0], 0, 0, 0]
	// 				that.setData({
	// 					cityArray: list,
	// 					areaArray: list,
	// 					xiangArray: list,
	// 					multiArray: [that.data.provinceArray, list, list, list],
	// 					multiIndex: multiIndex
	// 				})
	// 			}
	// 		},
	// 		fail: function (e) {}
	// 	})
	// },
	// getqu(pid) {
	// 	const that = this
	// 	http.httpGet({
	// 		loading: '加载中...',
	// 		url: '/api/wxllCustomer/getArea',
	// 		params: {
	// 			pid: pid,
	// 			level: 3
	// 		},
	// 		complete: function (msg) {},
	// 		success: function (result) {
	// 			console.log(result)

	// 			if (result[0]) {
	// 				that.setData({
	// 					areaArray: result
	// 				})
	// 				that.getxiang(result[0].id)
	// 			} else {
	// 				const list = [{ id: '0', name: '全部' }]
	// 				var multiIndex = [that.data.multiIndex[0], that.data.multiIndex[1], 0, 0]
	// 				that.setData({
	// 					areaArray: list,
	// 					xiangArray: list,
	// 					multiArray: [that.data.provinceArray, that.data.cityArray, list, list],
	// 					multiIndex: multiIndex
	// 				})
	// 			}
	// 		},
	// 		fail: function (e) {}
	// 	})
	// },
	// getxiang(pid) {
	// 	const that = this
	// 	http.httpGet({
	// 		loading: '加载中...',
	// 		url: '/api/wxllCustomer/getArea',
	// 		params: {
	// 			pid: pid,
	// 			level: 4
	// 		},
	// 		complete: function (msg) {},
	// 		success: function (result) {
	// 			console.log(result)

	// 			if (result[0]) {
	// 				that.setData({
	// 					xiangArray: result,
	// 					multiArray: [that.data.provinceArray, that.data.cityArray, that.data.areaArray, result]
	// 				})
	// 			} else {
	// 				const list = [{ id: '0', name: '全部' }]
	// 				var multiIndex = [that.data.multiIndex[0], that.data.multiIndex[1], that.data.multiIndex[2], 0]
	// 				that.setData({
	// 					xiangArray: list,
	// 					multiArray: [that.data.provinceArray, that.data.cityArray, that.data.areaArray, list],
	// 					multiIndex: multiIndex
	// 				})
	// 			}
	// 		},
	// 		fail: function (e) {}
	// 	})
	// },
	submit(e) {
		console.log(e.detail.value)
		const that = this
		let { address, addressbase, idNumber, customerName, phone } = e.detail.value

		if (!customerName) {
			wx.showToast({
				title: '请输入姓名',
				icon: 'none'
			})
			return
		}
		if (!phone) {
			wx.showToast({
				title: '请输入手机号码',
				icon: 'none'
			})
			return
		}
		// if (!idNumber) {
		// 	wx.showToast({
		// 		title: '请输入身份证号码',
		// 		icon: 'none'
		// 	})
		// 	return
		// }

		if (!addressbase) {
			wx.showToast({
				title: '请选择省市区',
				icon: 'none'
			})
			return
		}
		if (!address) {
			wx.showToast({
				title: '请输入详细地址',
				icon: 'none'
			})
			return
		}

		let mainData = e.detail.value
		var data = {
			unionId: wx.getStorageSync('userInfo').unionId,
			address: mainData.address,
			areaList: this.data.multiArray,
			name: mainData.customerName,
			phone: mainData.phone,
			streetNumber: mainData.addressShow
		}
		if (this.data.edit) {
			data = { id: this.data.id, ...data }
		}

		console.log(data)
		http.httpPost({
			loading: '提交中...',
			url: '/api/address/edit',
			params: data,
			complete: result => {
				console.log('result', result)
				wx.showToast({
					title: '提交成功',
					icon: 'none'
				})
				wx.navigateBack({
					delta: 1
				})
			},
			success: result => {},
			fail: function (e) {}
		})
	}
})
