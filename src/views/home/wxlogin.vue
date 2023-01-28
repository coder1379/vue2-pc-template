<!-- home/about -->
<template>
  <div class="page-container">

  </div>
</template>

<script>
  import {deleteLocalCache, empty, getLocalCache, serviceErrorMessage, setUserLoginInfo} from '../../utils/common'
import { WXAPPID, baseApi } from '@/config'

export default {
  data() {
    return {

    }
  },
  computed: {
  },
  mounted() {
    if (!empty(this.$route.query.wxtk)) {
      const resData = { code: 200, msg: '', data: { token: this.$route.query.wxtk, id: this.$route.query.wxtkid, user_type: this.$route.query.wxtkut, ex_sp: this.$route.query.ex_sp }}
      setUserLoginInfo(resData)
      const backUrl = getLocalCache('wx-back-path')
      if (empty(backUrl)) {
        alert(serviceErrorMessage)
      } else {
        deleteLocalCache('wx-back-path')
        this.gotoPath(backUrl)
      }
    } else {
      let serverUrl = baseApi + '/account/wxofficelogin'
      if (process.env.VUE_APP_ENV == 'development') {
        serverUrl = 'http://localactapi.zm.com/account/wxofficelogin'
      }
      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WXAPPID + '&redirect_uri=' + serverUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      return
    }
  },
  activated() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .error-page {
    @include flexbox(center);
    @include pagecenter;
  }

</style>
