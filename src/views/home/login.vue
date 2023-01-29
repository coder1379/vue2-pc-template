<!-- 登录 -->
<template>
  <div class="body-container">
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
