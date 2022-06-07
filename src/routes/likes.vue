<template>
    <div>
        <h3>我喜欢的歌</h3>
        <SongLi :songArr="likeDataList" />
    </div>
</template>
<script>
import SongLi from '@/components/SongLi.vue'
import { mapState } from 'vuex'
export default {
    name:'likes',
    components:{SongLi},
    data() {
        return {
            songArr:[]
        }
    },
    computed:{
        ...mapState({
            likeDataList:state=>state.profiles.likeDataList
        })
    }
}
</script>
<style scoped>
h3{
    text-align: center;
    padding: 15px 0;
    margin: 0 15px;
}
</style>