<template>
  <div id="app">
    <!--<router-view />-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted() {
    document.getElementById('app').style.display = 'block'
    document.getElementById('appLoading').style.display = 'none'
  }
}
</script>
<style lang="scss"></style>
