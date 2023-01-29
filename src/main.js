// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

// 设置 js中可以访问 $cdn
import { $cdn, title } from '@/config'
Vue.prototype.$cdn = $cdn
// 设置js中直接使用配置的项目title 目前用于路由守卫动态设置title
Vue.prototype.$title = title

// 缓存页面及页面滚动条 封装 start
Vue.prototype.scrollPositionList = {} // 全局路由滚动条位置保存

// 缓存页面是否刷新全局变量 封装 start
Vue.prototype.refreshPositionList = {}

/**
 * @param path 指定路径 如果为null 则自动获取
 * @param positionY 指定位置 如果为null 则自动获取
 */
Vue.prototype.setScrollPosition = function(path = null, positionY = null) {
  // 统一设置滚动条位置
  let routePath = path
  if (path == null) {
    routePath = this.$route.path // 不传参数默认为vue当前路由地址
  }
  let currentPosition = positionY
  if (positionY == null) {
    currentPosition = (document.documentElement.scrollTop || document.body.scrollTop)
  }
  console.log('current scroll:' + currentPosition)
  this.scrollPositionList[routePath] = currentPosition
}

/**
 * @param positonY 指定位置 如果为null 则获取scrollPositionList中保存值
 */
Vue.prototype.gotoScrollPosition = function(positionY = null) {
  // 跳转到滚动条指定位置
  let scrollY = positionY
  const routePath = this.$route.path
  if (positionY == null) {
    scrollY = this.scrollPositionList[routePath] ?? 0
  }
  console.log('goto scroll:' + scrollY)
  document.documentElement.scrollTop = scrollY // 滚动条位置设置
  document.body.scrollTop = scrollY // document.body.scrollTop 兼容苹果滚动
}
// 缓存页面及页面滚动条 封装 end

// 设置缓存页面进入后刷新 默认是设置为不刷新，false
Vue.prototype.setRefreshStaticPage = function(path = null, refresh = false) {
  // 设置指定页面下次进入是否刷新
  let routePath = path
  if (path == null) {
    routePath = this.$route.path // 不传参数默认为vue当前路由地址
  }
  this.refreshPositionList[routePath] = refresh
}

// 获取页面进入后是否刷新的值
Vue.prototype.getRefreshStaticPage = function(path = null) {
  let routePath = path
  if (path == null) {
    routePath = this.$route.path // 不传参数默认为vue当前路由地址
  }
  return this.refreshPositionList[routePath]
}

// 返回上一页 方便调用
Vue.prototype.gotoBack = function() {
  window.history.go(-1)
}

Vue.prototype.gotoPath = function(path) {
  // 快捷跳转路由封装
  this.$router.push({ path: path })
}
// 路由快捷跳转封装 end

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  // 百度统计 统一调用时 非统一调用根据页面写入统计
  /*  try {
      if (to.path) {
        if (window._hmt) {
          window._hmt.push(['_trackPageview', to.fullPath])
        }
      }
    } catch (e) {
      console.log('百度统计异常:')
      console.log(e)
    }*/

  console.log('vue beforeEach')
  /* if (isWeiXin()) {
    // 全局微信内处理可自行扩展，如微信内是否登录业务,单独微信处理建议在指定页面判断并处理
  }*/

  // 设置页面跳转前的缓存参数 仅当已经初始化vue后生效
  if (vue && from.meta.keepAlive === true) {
    console.log('被缓存路由:' + from.path)
    if (from.meta.excludeScroll !== true) {
      vue.setScrollPosition() // 如果为需要缓存页面则设置当前滚动条位置 如果由于html结构问题改为页面中beforeRouteLeave自行处理
    }
  }

  // [-----------------------------------------常用方式1
  /*
  * 菜单权限类全局统一处理 例如 检查是否具有某些菜单权限 可自行扩展 先获取后端权限 在检查是否路由在菜单中, 一般这类检查可以直接屏蔽掉登录和游客区域，直接进行菜单权限判断即可
  */
  // 权限菜单类检查代码自行扩展
  // -------------]

  // [----------------------------------------- 常用方式2 默认使用的方式
  // 复杂权限处理 start 需要全局基本权限验证时使用,例如权限，游客，微信登录等 根据需求调整

  // 直接全局检查token有效期降低业务复杂度
  const currentUserType = getUserType() // 当前用户类型
  const isValidityTokenTimeVal = isValidityTokenTime()
  if (isValidityTokenTimeVal === true) {
    if (to.meta.loginCheck === true && currentUserType === visitorUserType) {
      // 有效 & 需要登录检查 & 身份游客 = 去登录
      gotoLogin(location.href)
      return
    } else {
      if (currentUserType === visitorUserType && visitorMode === false) {
        // 如果当前为游客 且已经关闭了游客模式 则清理游客用户信息 主要发生在模式切换时
        clearUserLoginInfo()
      }
      next()
    }
  } else if (isValidityTokenTimeVal === 402) {
    // 有token且返回token过期需要续签
    if (visitorMode === false && to.meta.loginCheck !== true) {
      if (currentUserType === visitorUserType) {
        clearUserLoginInfo() // 过期的游客token 清理向下，非游客token保留让用户可以续签
      }
      next()
    } else if (to.meta.loginCheck === true && currentUserType === visitorUserType) {
      // 需要登录检查 & 身份游客 = 直接去登录 不进行续签
      gotoLogin(location.href)
      return
    } else {
      // 其他类型进行续签
      getUserRenewal().then((res) => {
        if (res.code === 200) {
          console.log('用户续签成功')
          if (res.data.same == 1) {
            setLocalCache('tokenOutTime', getTimeStamp() + parseInt(res.data.ex_sp))
          } else {
            setUserLoginInfo(res)
          }
          next() // 续签成功继续向下
        } else if (res.code === 401) {
          if (to.meta.visitorCheck === true && visitorMode === true) {
            // 登录用户过期 并访问的是游客校验页面 且开启游客验证 无论身份时什么都获取游客token向下继续执行
            getAccessLoadInfo().then((resGet) => {
              if (resGet.code === 200) {
                console.log('获取游客')
                console.log(resGet)
                setUserLoginInfo(resGet)
                next()
              } else {
                console.log('获取token返回数据错误:')
                console.log(resGet)
                alert(serviceErrorMessage + ' 异常码：' + resGet.code)
                return
              }
            }).catch((errGet) => {
              console.log('获取token异常:')
              console.log(errGet)
              alert(serviceErrorMessage)
              return
            })
          } else if (to.meta.loginCheck === true) {
            // 需要登录校验直接跳转到登录页
            gotoLogin(location.href)
            return
          } else {
            // 不需要验证任何内容 清空401无效数据 并继续向下
            clearUserLoginInfo()
            next()
          }
        } else {
          console.log('用户续签返回数据错误:')
          console.log(res)
          alert(serviceErrorMessage + ' 异常码：' + res.code)
          return
        }
      }).catch((err) => {
        console.log('用户续签异常:')
        console.log(err)
        alert(serviceErrorMessage)
        return
      })
    }
  } else {
    if (to.meta.loginCheck === true) {
      // 页面需要登录 直接去登录
      gotoLogin(location.href)
      return
    } else if (to.meta.visitorCheck === true && visitorMode === true) {
      getAccessLoadInfo().then((res) => {
        if (res.code === 200) {
          console.log('获取游客')
          console.log(res)
          setUserLoginInfo(res)
          next()
        } else if (res.code === 401) {
          gotoLogin(location.href)
          return
        } else {
          console.log('获取token返回数据错误:')
          console.log(res)
          alert(serviceErrorMessage + ' 异常码：' + res.code)
        }
      }).catch((err) => {
        console.log('获取token异常:')
        console.log(err)
        alert(serviceErrorMessage)
      })
    } else {
      next()
    }
  }
  // 复杂权限处理 end
  // -------------]

  // [----------------------------------------- 常用方式3
  /* // 无权限验证时直接简单使用 屏蔽复杂权限处理后打开
  if (from.meta.keepAlive === true) {
    console.log('被缓存路由:' + from.path)
    if (from.meta.excludeScroll !== true) {
      vue.setScrollPosition() // 如果为需要缓存页面则设置当前滚动条位置 如果由于html结构问题改为页面中beforeRouteLeave自行处理
    }
  }
  next()*/
  // -------------]
})

// 路由后置守卫 目前主要用于动态设置标题
router.afterEach((to, from) => {
  if (to.meta.title) {
    // 动态设置标题
    // document.title = to.meta.title + '-' + vue.$title
    document.title = to.meta.title
  }
})

// 按需引入 开始 注意打开 babel.config.js中的plugins
// 全局引入按需引入UI库 element 如果存在兼容问题可以使用全局导入所有zip压缩后在300kb左右，按需导入最小150kb
//import '@/plugins/element'

// 引入全局样式
//import 'element-ui/lib/theme-chalk/index.css';
// 按需引入结束

// 全局引入开始
// 全局引入 ElementUI，注意屏蔽 @/plugins/element和屏蔽babel.config.js中的plugins ，由于使用时间，table等插件导致整体包较大所有通常直接全局引入组件 zip压缩后350kb左右，部分引入也在250kb左右
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 全局引入结束

import '@/assets/css/index.scss'

// 引入 element 全局样式覆盖文件
import '@/assets/css/element-overwrite.scss'

/**
 * @param msg 提示消息
 */
Vue.prototype.$toast = function (msg){
  this.$notify({title:'提示',message:msg})
}

// 全局统一异常处理，个性化自行在指定页面重写
Vue.prototype.showException = function(err) {
  console.log(err)
  if (typeof (err) === 'string') {
    this.$toast(err)
  } else if (err.msg) {
    this.$toast(err.msg)
  } else {
    this.$toast(err.message)
  }
}

// filters
import './filters/index'
import {
  isValidityTokenTime,
  setUserLoginInfo,
  setLocalCache,
  getTimeStamp,
  gotoLogin,
  serviceErrorMessage,
  getUserType,
  visitorUserType,
  visitorMode,
  clearUserLoginInfo
} from './utils/common'
import { getAccessLoadInfo, getUserRenewal } from './api/base'
Vue.config.productionTip = false

// vue 变量在全局路由守卫中会进行使用
const vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
