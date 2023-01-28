const location = global.location
const u = navigator.userAgent
const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

export default {
  beforeRouteEnter(to, from, next) {
    // ios内微信分享 由于history不变原因到在的 微信分享签名验证错误

    const newPath = to.path
    if (isiOS && newPath !== location.pathname) {
      // 此处不能使用location.replace
      location.assign(to.fullPath)
    } else {
      next()
    }
  }
}
