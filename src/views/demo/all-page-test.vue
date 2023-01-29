<!-- page name -->
<template>
  <div class="full-screen-page">

  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  computed: {
  },
  mounted() {
  },
  activated() {
    // 需要缓存的页面手动加入滚动条处理 不缓存可删除 activated
    if (this.$route.meta.keepAlive === true) {
      this.gotoScrollPosition()
    }
  },
  /* beforeRouteLeave(to, from, next) {
    // 非缓存页面可直接删除beforeRouteLeave
     if (from.meta.keepAlive === true) { // 由于部分html结构问题导致需要单独处理滚动条位置
       this.setScrollPosition(null, this.$refs.page - scroll - container.scrollTop)
    }
    next()
  },*/
  methods: {
  }
}
</script>
<style lang="scss" scoped>

</style>
