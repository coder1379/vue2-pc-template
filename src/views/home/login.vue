<!-- 登录 -->
<template>
  <div class="page-container">
    <div class="header-container">

    </div>

    <div class="body-container">

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    onSubmit() {
      this.$toast('提交成功')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
