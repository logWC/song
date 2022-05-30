<template>
  <div>
    <keep-alive include="Layout">
      <router-view class="loyoutClass" ></router-view>
    </keep-alive>
    <PlaySong />
    <Tail />
  </div>
</template>
<script>
// 导入尾部组件
import Tail from './components/tail/index.vue'
// 导入下标播放组件
import PlaySong from './components/PlaySong.vue'
export default {
  components: { PlaySong, Tail },
  name: 'App',
  methods: {
    loginStatus(){
      this.$api.loginStatus()
      .then(({data})=>this.$store.dispatch('userData', data.data.profile))
      .catch(error=>console.log(error))
    }
  },
  created() {
    // 判断是否还在登录状态
    this.loginStatus()
  }
}
</script>

<style scoped>
.loyoutClass{
  min-width: 400px;
  max-width: 800px;
  min-height: 900px;
  margin: 0 auto;
  background-color: rgb(222, 232, 240);
}
</style>