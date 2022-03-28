<template>
    <div>
        1
        <!-- 推荐歌单 -->
        <recommendSongSheet />
        <!-- 新音乐 -->
        <newMusic />
    </div>
</template>
<script>
import recommendSongSheet from './recommendSongSheet.vue'
import newMusic from './newMusic'
export default {
    name:'Home',
    components: { recommendSongSheet, newMusic }
}
</script>
<style scoped>

</style>