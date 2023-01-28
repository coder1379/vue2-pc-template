<template>
  <div class="app-container">
    <div class="layout-content">
      <div v-if="$route.meta.keepAlive" style="background-color: gray;height: 20px;color:#ffffff;padding:5px;">
        keeplive={{$route.meta.keepAlive}} 需要缓存的页面 layouts/index
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
    </div>
    <div class="layout-footer">
      <TabBar :data="tabbars" @change="handleChange" />
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
export default {
  name: 'AppLayout',
  data() {
    return {
      tabbars: [
        {
          title: '首页',
          to: {
            name: 'Home'
          },
          icon: 'home-o'
        },
        {
          title: 'DevDemo',
          to: {
            name: 'DevDemo'
          },
          icon: 'label-o',
          badge: '9'
        },
        {
          title: '我的',
          to: {
            name: 'My'
          },
          icon: 'user-o'
        }
      ]
    }
  },
  components: {
    TabBar
  },
  methods: {
    handleChange(v) {
      console.log('tab change value:', v)
    }
  }
}
</script>
