/**
 * @auth ike
 * @date 2018/9/6
 * @desc 网络请求工具
 */

var u = {}

//请求返回体模型
u.httpModel = {
	code: 0,
	result: '',
	des: ''
}

//请求方式
u.GET = 'GET' //GET类型的请求
u.POST = 'POST' //POST类型的请求
u.DELETE = 'DELETE' //DELETE类型的请求

//请求状态CODE
u.statusCode_success = 200 //开发者服务器返回的 HTTP 成功状态码
u.CODE_SUCCESS = '0' //接口请求成功的CODE
u.CODE_TOKEN_TIMEOUT = '401' //用户token过期CODE

// 根据环境变量设置请求API路径
var apiUrl = 'http://121.37.110.240:8181'
let accountInfo = wx.getAccountInfoSync()
let nowEnv = accountInfo.miniProgram.envVersion
switch (nowEnv) {
	case 'develop': // 开发版环境
		apiUrl = 'http://121.37.110.240:8181'
		break
	case 'trial': // 体验版环境
		apiUrl = 'http://121.37.110.240:8181'
		break
	case 'release': // 正式版环境
		apiUrl = 'http://121.37.110.240:8181'
		break
}

//服务器地址
u.API_SERVICE = apiUrl

/**
 * 拦截器
 */
u.requestInterceptor = function (reqParams) {
	//做请求前的拦截处理

	return reqParams
}

/**
 * 请求返回统一处理
 *
 */
u.handleResponse = function (result, reqParams) {
	// console.log('请求结果 : ', result)
	if (result.statusCode == u.statusCode_success) {
		u.httpModel = result.data
		if (u.httpModel.code == u.CODE_SUCCESS) {
			//接口成功返回
			if (reqParams.success) reqParams.success(u.httpModel.result)
		} else if (u.httpModel.code == u.CODE_TOKEN_TIMEOUT) {
			// } else if (u.httpModel.code != u.CODE_SUCCESS) {
			//token过期出来
			wx.removeStorageSync('token')
			wx.removeStorageSync('userInfo')
			wx.reLaunch({
				url: '/pages/splash/splash'
			})
			setTimeout(() => {
				wx.showToast({
					icon: 'none',
					title: '登录已过期，请重新登录！',
					duration: 3000
				})
			}, 2000)
		} else {
			//其他的code码返回到页面自行处理
			if (u.httpModel.des == null || u.httpModel.des == '' || u.httpModel.des == undefined) {
				var code
				if (u.httpModel.code == undefined) {
					code = '未知'
				} else {
					code = u.httpModel.code
				}
				result = {
					data: {
						des: u.httpModel.des
					}
				}
			}
			// && u.httpModel.code == "99"
			if (u.httpModel.des) {
				wx.showToast({
					icon: 'none',
					title: u.httpModel.des,
					duration: 3000
				})
			}

			if (reqParams.fail) reqParams.fail(u.httpModel)
		}
	} else {
		console.log('请求错误 : ' + '错误码：' + result.statusCode + ' / ' + '错误信息：' + result.errMsg)
		// wx.showToast({
		//   icon: 'none',
		//   title: '请求失败：' + result.statusCode,
		//   duration: 3000,
		// })
	}
}

/**
 * 发送请求
 *
 * @param reqParams     请求封装的参数
 * @param requestType   什么类型的请求 GET POST DELETE
 */
u.request = function (reqParams, requestType) {
	var method = u.POST
	if (requestType == u.GET) {
		method = u.GET
	} else if (requestType == u.POST) {
		method = u.POST
	} else if (requestType == u.DELETE) {
		method = u.DELETE
	}
	// console.log(u)

	//打印请求地址
	u.logRequestUrl(reqParams)

	//判断是否需要显示loading
	var isLoading = false
	if (reqParams.loading != null && reqParams.loading != '') {
		isLoading = true
		wx.showLoading({
			title: reqParams.loading
		})
	}

	wx.request({
		url: u.API_SERVICE + reqParams.url,
		data: reqParams.params,
		header: {
			'content-type': 'application/json',
			token: wx.getStorageSync('token')
		},
		method: method,
		complete: function (msg) {
			if (reqParams.complete) reqParams.complete(msg)
		},
		success: function (result) {
			//关闭loading
			if (isLoading) wx.hideLoading()

			u.handleResponse(result, reqParams)
		},
		fail: function (e) {
			//关闭loading
			if (isLoading) wx.hideLoading()
			e = {
				des: '请求失败：' + e.errMsg
			}
			if (reqParams.fail) reqParams.fail(e)
		}
	})
}

/**
 * GET请求
 *
 * @param reqParams
 * @desc  一般用于登录等不携带token
 */
u.httpGet = function (reqParams) {
	reqParams = u.requestInterceptor(reqParams)
	u.request(reqParams, u.GET)
}

/**
 * DELETE请求
 *
 * @param reqParams
 * @desc  一般用于携带token
 */
u.httpDelete = function (reqParams) {
	reqParams = u.requestInterceptor(reqParams)
	u.request(reqParams, u.DELETE)
}

/**
 * POST请求
 *
 * @param reqParams
 * @desc  一般用于携带token
 */
u.httpPost = function (reqParams) {
	reqParams = u.requestInterceptor(reqParams)
	u.request(reqParams, u.POST)
}

/**
 * 上传文件
 *
 * @param reqParams
 * @desc
 */
u.uploadFile = function (reqParams) {
	//判断是否需要显示loading
	var isLoading = false
	if (reqParams.loading != null && reqParams.loading != '') {
		isLoading = true
		wx.showLoading({
			title: reqParams.loading
		})
	}

	wx.uploadFile({
		url: u.API_SERVICE + reqParams.url, //仅为示例，非真实的接口地址
		filePath: reqParams.filePath,
		name: reqParams.name,
		formData: req.params,
		complete: function (msg) {
			reqParams.complete(msg)
		},
		success: function (result) {
			//关闭loading
			if (isLoading) wx.hideLoading()
			result.data = JSON.parse(result.data + '')
			handleResponse(req, result)
		},
		fail: function (e) {
			//关闭loading
			if (isLoading) wx.hideLoading()
			e = {
				des: '请求失败：' + e.errMsg
			}
			reqParams.fail(e)
		}
	})
}

/**
 * 打印请求地址
 */
u.logRequestUrl = function (requestParams) {
	//显示请求路径
	var url = '请求路径: ' + u.API_SERVICE + requestParams.url
	var paramCount = u.objCount(requestParams.params)
	if (paramCount > 0) {
		url += '?'
	}
	var i = 0
	for (var item in requestParams.params) {
		//用javascript的for/in循环遍历对象的属性
		if (i != paramCount - 1) {
			//不是最后一个才加上&
			url += item + '=' + requestParams.params[item] + '&'
		} else {
			url += item + '=' + requestParams.params[item]
		}

		i++
	}
	// console.log(url)
}

/**
 * 获取对象、数组的长度、元素个数
 *
 * @param obj 要计算长度的元素，可以为object、array、string
 */
u.objCount = function (obj) {
	var objType = typeof obj
	if (objType == 'string') {
		return obj.length
	} else if (objType == 'object') {
		var objLen = 0
		for (var i in obj) {
			objLen++
		}
		return objLen
	}
	return false
}

//抛出方法
module.exports = u
