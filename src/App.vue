<template>
  <div>
    <!-- <div style="height:50px"></div> -->
    <router-view></router-view>
    <!-- 为PlaySong组件留空间 -->
    <Tail />
    <PlaySong />
  </div>
</template>
<script>
// 导入下标播放组件
import PlaySong from './components/PlaySong.vue'
import Tail from './components/tail/index.vue'
export default {
  components: { PlaySong, Tail },
  name: 'App',
  created() {
    // 判断是否还在登录状态
    this.$api.loginStatus()
    .then(content => this.$store.dispatch('userData',content.data.profile))
    .catch(error => console.log(error))
  },
  mounted(){
    console.log("app")
  }
}
</script>

<style scoped>
</style>