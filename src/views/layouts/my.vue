<template>
  <div className="app-container">
    <div className="layout-header">
      会有中心顶部
    </div>
    <div className="layout-content">
      <div v-if="$route.meta.keepAlive">
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
    </div>
    <div className="layout-footer">
      会有中心底部
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyLayout',
  data() {
    return {}
  },
  methods: {}
}
</script>
