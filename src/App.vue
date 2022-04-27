<template>
  <div>
    <keep-alive include="Layout">
      <router-view></router-view>
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
  created() {
    // 判断是否还在登录状态
    this.$api.loginStatus()
    .then(content => this.$store.dispatch('userData',content.data.profile))
    .catch(error => console.log('未登录'))
  }
}
</script>

<style scoped>
</style>