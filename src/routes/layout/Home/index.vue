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
    created() {
        console.log('home创建并缓存了')
    }
}
</script>
<style scoped>

</style>