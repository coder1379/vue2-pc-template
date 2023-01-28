<template>
  <div class="app-container">
    <div class="layout-content">
      <div v-if="$route.meta.keepAlive" style="background-color: red;height: 20px;color:#ffffff;padding:5px;">
        keepAlive={{$route.meta.keepAlive}} 需要缓存的页面 layouts/footer
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
    </div>
    <div class="layout-footer">
      <div>footer layout:{{$route.meta}}</div>
      <div>footer</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderLayout',
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
