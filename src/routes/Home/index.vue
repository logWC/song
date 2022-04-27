<template>
    <div>
        <!-- 推荐歌单 -->
        <recommendSongSheet />
        <!-- 新音乐 -->
        <newMusic />
    </div>
</template>
<script>
import recommendSongSheet from './recommendSongSheet.vue'
import newMusic from './newMusic.vue'
export default {
    name:'Home',
    components: { recommendSongSheet, newMusic },
    activated() {
        console.log('路由组件激活了')
    },
    deactivated() {
        console.log('路由组件失活了')
    },
    created() {
        console.log('创建了')
    },
}
</script>
<style scoped>

</style>