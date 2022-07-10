<template>
  <div>
    <head-r />
    <keep-alive include="Layout,lyrics">
      <router-view></router-view>
    </keep-alive>
    <PlaySong v-if="$router.history.current.path!='/'" />
    <Tail />
  </div>
</template>
<script>
// 导入头部组件
import headR from "@/components/headr.vue";
// 导入尾部组件
import Tail from './components/Tail.vue'
// 导入下标播放组件
import PlaySong from './components/PlaySong.vue'
export default {
  components: {headR, PlaySong, Tail },
  name: 'App',
  methods: {
    loginStatus(){
      this.$api.loginStatus()
      .then(({data})=>this.$store.dispatch('profiles/userData', data.data.profile))
      .catch(error=>{
        if(error.toString().includes('400')){
          console.log('未登录')
        }
      })
    }
  },
  created() {
    // 判断是否还在登录状态
    this.loginStatus()
  }
}
</script>

<style scoped>
</style>