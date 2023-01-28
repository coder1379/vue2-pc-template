<!-- demo -->
<template>
  <div class="page-container">
    <div class="warpper">
      <h1><span> VUE H5 VANT 部分DEMO</span></h1>
      <div class="demo1 demo-line">
        <img style="width: 20px;height: 20px;" src="~@/assets/logo.png" /><span>demo1 html属性中通过别名引用资源</span>
      </div>
      <div class="demo2 demo-line"><span style="margin-left: 30px;">.demo2 css通过别名引用资源</span></div>

      <div class="demo3 demo-line"><span>css demo3 使用variabless.scss变量</span></div>



      <div class="demo5 demo-line"><span>css demo5 使用minin.scss 混入css </span></div>

      <div class="demo6 demo-line"><span>css demo6 使用$cdn资源 </span></div>

      <div class="demo7 demo-line">
        <img :src="this.$cdn+'/images/logo.png'" alt="" />
        demo7 html 直接使用$cdn资源,scss 嵌套写css
      </div>

      <div class="demo-line">
        userName:{{$store.state.app.userName}}
      </div>

      <div class="demo-line">
        demo10 html直接使用全局filter过滤器 {{mobile|hidePhone}}
      </div>
      <div class="demo-line">
        demo11 html直接使用全局filter过滤器 {{mobile2}}
      </div>
      <div @click="gotoPath('/dev-demo/copy-base-list?id=2')" class="demo-line">
        demo12 点击测试下拉刷新及列表加载
      </div>
      <div>
        demo13 动态创建组件
        <div id="demo13div">



        </div>
      </div>
    </div>

  </div>
</template>

<script>
// import { mapGetters } from 'vuex' // 可直接结构vuex
export default {
  data() {
    return {
      mobile: '13331121121',
      mobile2: '13111000011',
      list: [
      ],
      typeList: [{ id: 1, type: 1, name: '1', list: [{ a: '1', b: '1' }, { a: '2', b: '2' }], value: 'v1' }, { id: 2, type: 2, name: '2', value: 'v2' }, { id: 3, type: 1, name: '3', list: [{ a: '3', b: '3' }, { a: '32', b: '32' }], value: 'v3' }]
    }
  },
  activated() {
    if (this.$route.meta.keepAlive === true) {
      this.gotoScrollPosition() // 如果为需要缓存调整滚动条位置
    }
  },
  mounted() {
    // demo11
    this.mobile2 = this.$hidePhone(this.mobile2)
  },
  computed: {
    // ...mapGetters(['userName']) // 可直接结构vuex
  },
  methods: {
    changeVuexUserName() {
      // 同步修改vuex状态 demo8
      this.$store.commit('SET_USER_NAME', 'newUserName同步' + (new Date().getTime()))
    },
    asynChangeVuexUserName() {
      // 异步修改vuex状态 demo9
      this.$store.dispatch('setUserName', 'newUserName异步' + (new Date().getTime()))
    },
    createSelect(value, item) {
      // demo13 动态创建组件
      item.value = value.b
      console.log(value)
      console.log(item)
      item.showType = false
    },
    showTest(){
      console.log(this.typeList)
    }
  }
}
</script>
<style lang="scss" scoped>
.page-container{
  .demo-line{
    font-size: 20px;
    padding: 5px;
    border: 1px dashed gray ;
    margin: 5px;
  }
}

.demo2{
  background-image: url(~@assets/logo.png);
  background-size: 20px 20px;
  background-repeat: no-repeat;
}

.demo3{
  background-color: $test-background-color;
  color: #ffffff;
}

.demo4{
  margin-top: 10px;
}

.demo5{
  @include flexbox(center);
  height:100px;
  background-color: aliceblue;
  margin-top: 20px;
}

.demo6 {
  @include flexbox(center);
  height: 60px;
  background: url($cdn+'/images/logo.png') left / contain no-repeat;
  background-size: 20px 20px;
}
.demo7{
  img{
    width: 20px;
    height: 20px;
  }
}
</style>
