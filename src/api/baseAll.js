import api from './index'
import request from '@/utils/request'

// 基础接口模块

// 接口  contentType 默认 application/x-www-form-urlencoded,枚举 ：json=json模式,file=包含二进制文件模式 multipart/form-data
// 直接拼接url调用接口 option 为其他参数例如 timeout等
export function callApiByUrl(url, requestJson, method = 'POST', option = {}) {
  const timeout = option.timeout ?? false // 如果有超时时间覆盖超时时间
  const dataObj = {
    url: url,
    method: method,
    data: requestJson,
    hideloading: true
  }

  if (timeout) {
    dataObj.timeout = timeout
  }

  return request(dataObj)
}

// 登录
export function login(data) {
  return request({
    url: api.userLogin,
    data
  })
}

// 用户信息 post 方法
export function getUserDetail(data) {
  return request({
    url: api.userDetail,
    data,
    hideloading: true
  })
}
