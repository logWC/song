<template>
  <div>
    <router-view></router-view>
    
    <!-- 为PlaySong组件在底下留空间 -->
    <div style="height:50px"></div>
    <PlaySong />
  </div>
</template>
<script>
// 导入下标播放组件
import PlaySong from './components/PlaySong.vue'

export default {
  components: { PlaySong },
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