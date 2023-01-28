<!-- page name -->
<template>
  <div class="full-screen-page">
    <div class="full-header">

    </div>
    <div class="full-content">
      <div>登录</div>
      <div>还没有账户，立即注册</div>

      <a>验证码登录</a>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values);
    },
  }
}
</script>
<style lang="scss" scoped>
.full-screen-page{
  background-color: #ffffff;
}
</style>
