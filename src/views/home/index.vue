<!-- home -->
<template>
  <div class="page-container">
    <div class="body-container">
      <h1><span> VUE H5 VANT 模板</span></h1>
      <h6><span> 开箱即可进行开发</span></h6>
      <h6><span>{{$store.state.app.userName}}</span></h6>
      <div @click="add">点击添加list</div>
    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        'Vue-cli4',
        '配置多环境变量',
        'VantUI 组件按需加载',
        'Sass 全局样式',
        'Webpack 4',
        'Vuex 状态管理',
        'Axios 封装及接口管理',
        'Vue-router',
        'Webpack 4 vue.config.js 基础配置',
        '配置 proxy 跨域',
        '配置 alias 别名',
        '配置 打包分析',
        '配置 externals 引入 cdn 资源',
        '去掉 console.log',
        'splitChunks 单独打包第三方模块',
        '添加 IE 兼容',
        'Eslint+Pettier 统一开发规范'
      ]
    }
  },
  activated() {
    console.log('activeed')
    if (this.$route.meta.keepAlive === true) {
      this.gotoScrollPosition() // 如果为需要缓存调整滚动条位置
    }
  },
  deactivated() {
    console.log('deactivated')
  },
  mounted() { },

  methods: {
    add() {
      setTimeout(() => {
        for (let i = 0; i < 20; i++) {
          this.list.push('item ' + i)
        }
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>
.page-container {
  .warpper {
    padding: 12px;
    background: #fff;
    .demo-home__title {
      margin: 0 0 6px;
      font-size: 32px;
      .demo-home__title img,
      .demo-home__title span {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        width: 32px;
      }
      span {
        margin-left: 16px;
        font-weight: 500;
      }
    }
  }
  .body-container{
    text-align: center;
    padding-top:30px;
    padding-bottom: 30px;
  }
}
</style>
