import axios from 'axios'
import Qs from 'qs'

/**
 * 请求底层封装层 不区分接口参数等，不满足需求情况下可修改阔复制创建新文件
 */

// create an axios instance
const service = axios.create({
  withCredentials: false, // send cookies when cross-domain requests 这里默认为false，生产需要可改为true 这里在测试时会由于一些设置导致接口调用失败，所有默认为false
  method: 'POST', // 默认post
  timeout: 10000 // request timeout 默认10秒超时
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    if (config.contentType === 'json') {
      // json格式
      config.headers['Content-Type'] = 'application/json; charset=utf-8'
    } else if (config.contentType === 'formData') {
      // 包含文件兼容二进制格式
      const formData = new FormData()
      Object.keys(config.data).forEach((key) => {
        if (key == 'file_data') {
          formData.append(key, config.data[key], config.data[key].name)
        } else {
          formData.append(key, config.data[key])
        }
      })
      config.data = formData
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      // 默认kv模式
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded' // 默认格式
      config.data = Qs.stringify(config.data)
    }

    return config
  },
  error => {
    // do something with request error
    console.log('req err:')
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    return Promise.resolve(response.data)
  },
  error => {
    console.log('err res:') // for debug
    console.log(error)
    return Promise.reject(error)
  }
)

export default service
