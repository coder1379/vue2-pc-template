import wx from 'weixin-js-sdk'
import { getWxShareConfigApi } from '../api/base'
import { isWeiXin } from './common'

/**
 * 获取微信参数
 * @param href_url
 */
export function getWxConfig(href_url) {
  console.log('get weixin config')
  return getWxShareConfigApi({
    'url': href_url
  })
}

/**
 * 隐藏微信所有按钮
 */
export function clearWxBarButton() {
  console.log('clear wx button')
  if (!isWeiXin()) {
    return false
  }
  let appid, timeStamp, nonce_str, signature
  const href_url = window.location.href

  getWxConfig(href_url).then((res) => {
    console.log('同步获取完成')
    console.log(res)
    if (res.data.signature) {
      console.log('start wx config')
      timeStamp = res.data.timestamp
      nonce_str = res.data.nonce_str
      signature = res.data.signature
      appid = res.data.appid
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appid, // 必填，企业号的唯一标识，此处填写企业号corpid
        timestamp: timeStamp, // 必填，生成签名的时间戳
        nonceStr: nonce_str, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
        jsApiList: [
          'checkJsApi', 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'hideAllNonBaseMenuItem', 'showMenuItems'
        ]
      })

      wx.ready(function() {
        console.log('wx ready ok')
        wx.hideAllNonBaseMenuItem()
        console.log('隐藏所有按钮成功')
      })
    } else {
      console.log('签名错误')
    }
  })
}

// 默认微信开放的几个按钮
export const defalutWxShareBar = ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:favorite'] // 默认的分享按钮 不满足自定义详见微信公众号文档
/**
 * 统一处理微信右上角按钮
 * @param title 分享标题
 * @param desc 分享描述
 * @param link 分享链接
 * @param imgUrl 分享图片
 * @param barList 按钮列表 隐藏全部为默认 分享给朋友,
 * @param callback 回调
 * @returns {Promise<boolean>}
 */
export function setWxBarButton(title, desc, link, imgUrl, barList = [], callback) {
  if (!isWeiXin()) {
    return false
  }

  const href_url_share = window.location.href
  let appid, timeStamp, nonce_str, signature

  getWxConfig(href_url_share).then((res) => {
    timeStamp = res.data.timestamp
    nonce_str = res.data.nonce_str
    signature = res.data.signature
    appid = res.data.appid

    wx.config({
      debug: false,
      appId: appid, // 必填，企业号的唯一标识，此处填写企业号corpid
      timestamp: timeStamp, // 必填，生成签名的时间戳
      nonceStr: nonce_str, // 必填，生成签名的随机串
      signature: signature, // 必填，签名，见附录1
      jsApiList: [
        'checkJsApi', 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'hideAllNonBaseMenuItem', 'showMenuItems' // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63 需要添加没有的先在这里写入后才能有效否则验证不通过 // old
      ]

    })

    const config = {
      title: title,
      desc: desc,
      link: link,
      imgUrl: imgUrl,
      success: function(res) {
        console.log('设置微信分享成功')
      },
      cancel: function(res) {
        console.log('设置微信分享取消')
      },
      fail: function(res) {
        console.log('设置微信分享失败')
        console.log(res)
      }
    }

    wx.ready(function() {
      console.log('设置微信 wx ready ok')
      wx.hideAllNonBaseMenuItem()
      wx.showMenuItems({
        menuList: barList
      })

      if (barList.includes('menuItem:share:appMessage')) {
        try {
          wx.updateAppMessageShareData(config) // old
          // wx.onMenuShareAppMessage(config)
        } catch (e) {
          console.log('分享异常')
          console.log(e)
        }

        console.log('设置分享app')
      }

      if (barList.includes('menuItem:share:timeline')) {
        try {
          wx.updateTimelineShareData(config) // old
          // wx.onMenuShareTimeline(configPyq)
        } catch (e) {
          console.log('分享异常')
          console.log(e)
        }
        console.log('设置分享到朋友圈')
      }
      // wx.updateAppMessageShareData(config); // 显示分享给朋友按钮
      // wx.updateTimelineShareData(config); // 显示分享到朋友圈
    })

    wx.error(function(res) {
      console.log('wx 验证失败')
      console.log(res)
    })
  })
}
