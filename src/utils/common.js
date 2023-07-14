import { baseUrl, WXAPPID, baseApi } from '@/config'

// 项目缓存前缀 防止重名
export const productCachePrefix = 'v2pc-'

export const serviceErrorMessage = '服务器连接异常，请尝试关闭后重新打开'

// 是否开启游客模式
export const visitorMode = true // 游客模式 高于meta里的 是否验证游客字段

// 游客的类型
export const visitorUserType = -1 // 游客的用户类型

// 游客的过期刷新间隔时间
export const visitorExOutTime = 172800 // 游客主动续签阈值

// 设置本地缓存 自动加入项目前缀 写本地缓存只使用此方式
export function setLocalCache(name, val) {
  return localStorage.setItem(productCachePrefix + name, val)
}

// 获取本地缓存 自动加入项目前缀 读本地缓存只使用此方式
export function getLocalCache(name) {
  return localStorage.getItem(productCachePrefix + name)
}

// 删除本地缓存
export function deleteLocalCache(name) {
  return localStorage.removeItem(productCachePrefix + name)
}

// 判断是否为空 包含对象数组 类似php empty
export function empty(parm) {
  if (parm == null || parm == undefined || parm == 0 || parm == '' || parm == 'undefined' || parm == ' ' || parm == 'null' || /^[ ]+$/.test(parm) || JSON.stringify(parm) === '{}' || JSON.stringify(parm) === '[]') {
    return true
  } else {
    return false
  }
}

// 是否为空验证
export function isNull(parm) {
  if (parm == '' || parm == 'undefined' || parm == undefined || parm == null || parm == ' ' || parm == 'null') {
    return true
  } else {
    return false
  }
}

/**
 * base64 字符串url传输安全处理,解密
 * @param base64Str
 * @returns {string|*}
 */
export function urlsafeB64Decode(base64Str) { // base64 需要替换
  if (isNull(base64Str)) {
    return ''
  } else {
    let base64 = base64Str.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4 !== 0) {
      base64 += '='
    }
    return base64
  }
}

/**
 * base64 字符串url传输安全加密
 * @param baseStr
 * @returns {*}
 */
export function urlsafeB64Encode(baseStr) { // base64 需要替换
  return baseStr.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * 获取url中的get参数
 * @param name
 * @returns {string|null}
 */
export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

// url转对象
export function urlToObject(urlStr) {
  // 注意这个函数 url里面的k不能只有1位,例如a,b这样
  let url = ''
  if (urlStr.indexOf('?') > -1) {
    url = urlStr.split('?')[1]
  } else {
    url = urlStr
  }

  const dataObj = {}
  if (!isNull(url)) {
    url = url.split('&') // url中去掉&全部变成“a=b” “c=d” “e=f”的模式
    for (let i = 0; i < url.length; i++) {
      const postion = url[i].indexOf('=')
      if (postion > -1) {
        let key = ''
        if ((postion - 1) > 0) {
          key = url[i].slice(0, postion)
        }
        let val = ''
        if ((postion + 1) < url[i].length) {
          val = url[i].slice(postion + 1)
        }

        if (key != '') {
          dataObj[key] = val
        }
      } else {
        if (url[i] != '') {
          dataObj[url[i]] = ''
        }
      }
    }
  }
  return dataObj
}

// 设置本地token
export function setToken(val) {
  return setLocalCache('token', val)
}

// 获取本地token
export function getToken() {
  return getLocalCache('token')
}

// 设置用户类型
export function setUserType(val) {
  return setLocalCache('userType', val)
}

// 获取用户类型
export function getUserType() {
  const userTypeTemp = getLocalCache('userType')
  if (userTypeTemp) {
    // 转换类型
    return parseInt(userTypeTemp)
  } else {
    return null
  }
}

// 设置项目userId
export function setUserId(val) {
  return setLocalCache('userId', val)
}

// 获取项目userId
export function getUserId() {
  return getLocalCache('userId')
}

/**
 * 清除登录信息 仅用户登录相关，其他非用户状态 另行清理
 * @returns {string | null}
 */
export function clearUserLoginInfo() {
  deleteLocalCache('token') // 清除token
  deleteLocalCache('userId')
  deleteLocalCache('userType')
  deleteLocalCache('tokenOutTime')
  return true
}

/**
 * 设置用户登录信息 包含游客，注意保持与clearUserLoginInfo 清理内容相同 非用户状态信息另行设置
 * @returns {boolean}
 */
export function setUserLoginInfo(dataObj) {
  if (dataObj && dataObj.code === 200) {
    clearUserLoginInfo()
    setToken(dataObj.data.token)
    setUserId(dataObj.data.id)
    setUserType(dataObj.data.user_type)
    setLocalCache('tokenOutTime', getTimeStamp() + parseInt(dataObj.data.ex_sp)) // 本地的token过期时间
  }
  return true
}

/**
 * 跳转登录页面并设置登录成功后的回跳地址
 * @param {string} backPath 回跳地址,不含baseUrl地址
 * @returns {Boolean}
 */
export function gotoLogin(backPath) {
  clearUserLoginInfo()
  if (backPath) {
    if (backPath.indexOf('http') === 0) {
      setLocalCache('fullPath', backPath)
    } else {
      setLocalCache('fullPath', baseUrl + backPath)
    }
  }
  location.href = baseUrl + '/login'
  return true
}


// 是否为微信内
export function isWeiXin() {
  const ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

// 微信登录
export function gotoWeiXinLogin() {

}

// 获取当前时间戳
export function getTimeStamp() {
  let timeVal = Date.parse(new Date()).toString() // 获取到毫秒的时间戳，精确到毫秒
  timeVal = timeVal.substr(0, 10) // 精确到秒
  return parseInt(timeVal)
}

// 检查token是否还在有效期内
export function isValidityTokenTime() {
  const currentToken = getToken()
  if (empty(currentToken)) {
    return false
  }

  if (getUserType() == null || getUserId() == null) {
    // 用户id 或类型缺失 直接清空 返回无token
    clearUserLoginInfo()
    return false
  }

  let currentExTokenTIme = getLocalCache('tokenOutTime')

  if (empty(currentExTokenTIme)) {
    return false
  } else {
    currentExTokenTIme = parseInt(currentExTokenTIme)
    if ((getTimeStamp() + visitorExOutTime) < currentExTokenTIme) {
      console.log('有效token')
      return true
    } else {
      console.log('token过期，需要续签')
      return 402
    }
  }
}

// 检查是否跳转微信登录
export function checkToWxLogin(reBackPath = '') {
  if (isWeiXin() && getUserType() == visitorUserType) {
    // 微信内切当前为游客获取微信登录
    setLocalCache('wx-back-path', reBackPath)

    let serverUrl = baseApi + '/account/wxweblogin'
    if (process.env.VUE_APP_ENV == 'development') {
      serverUrl = 'http://local.abc.com/account/wxweblogin'
    }
    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WXAPPID + '&redirect_uri=' + serverUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
    return
  }
}

export function actionInitEndBack(path) {
  // 默认关闭百度统计
  return false

  // 百度统计
  try {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', path])
    }
  } catch (e) {
    console.log('百度统计异常:')
    console.log(e)
  }
}

/**
 * 获取uuid
 * @returns {string}
 */
export function getUuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

