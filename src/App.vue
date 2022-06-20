<template>
  <div>
    <keep-alive include="Layout,lyrics">
      <router-view class="loyoutClass" ></router-view>
    </keep-alive>
    <PlaySong v-if="$router.history.current.path!='/'" />
    <Tail />
  </div>
</template>
<script>
// 导入尾部组件
import Tail from './components/Tail.vue'
// 导入下标播放组件
import PlaySong from './components/PlaySong.vue'
export default {
  components: { PlaySong, Tail },
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
.loyoutClass{
  min-width: 400px;
  max-width: 800px;
  margin: 20px auto;
  border-radius: 3px;
  overflow: hidden;
  background-color: rgb(222, 232, 240);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

}
</style>