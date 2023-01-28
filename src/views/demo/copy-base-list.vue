<!-- page name -->
<template>
  <div class="page-container">
    <div class="header-container">

    </div>
    <div class="body-container">

    </div>
  </div>
</template>

<script>
import { callApiByUrl } from '@/api/base.js'
export default {
  data() {
    return {
      list: [],
      pageNumber: 0, // 当前页数
      pageSize: 10, // 每页数量
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  computed: {
  },
  mounted() {
  },
  activated() {
    // 需要缓存的页面手动加入滚动条处理 不缓存可删除 activated
    if (this.$route.meta.keepAlive === true) {
      this.gotoScrollPosition() // 全局
      // this.$refs.pageContainerRef.scrollTop = this.scrollPositionList[this.$route.path] // 自定义情况下和全局二选一 注意 pageContainerRef为滚动容器ref ref='pageContainerRef'
    }
  },
  /* beforeRouteLeave(to, from, next) {
    // 非缓存页面可直接删除beforeRouteLeave
    // 由于部分html结构问题导致需要单独处理滚动条位置需在router.config.js 设置excludeScroll 排除全局设置滚的位置 配合pageContainerRef组合自定义使用
     if (from.meta.keepAlive === true) {
       this.setScrollPosition(null, this.$refs.pageContainerRef.scrollTop)
    }
    next()
  },*/
  methods: {
    onLoad() {
      // 判断是否为刷新情况当前内容
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
      }
      // 每次调用添加获取页数数量，非分页类可以删除
      this.pageNumber++

      // 主要替换接口调用及接口内 数组处理部分，其余相关参数可以不用调整
      callApiByUrl('/test/test-list', { pageNumber: this.pageNumber, pageSize: this.pageSize }).then((res) => {
        // 数据处理 加入到显示数组中
        if (res.data.list && res.data.list.length > 0) {
          this.list.push(...res.data.list)
        }

        if (!res.data.list || res.data.list.length < this.pageSize) {
          // 如果数组不存在或者返回数量小于每页数据则表示没有下一页，尽量不采用通过total计算，可能某些接口无法返回总数
          this.finished = true
        }

        // 设置加载完成
        this.loading = false
      }).catch((err) => {
        this.showException(err)
        this.loading = false
        this.refreshing = false
        this.finished = true
      })
    },
    onRefresh() {
      // 清空列表数据
      this.pageNumber = 0 // 重置分页
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
