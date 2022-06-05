<template>
    <div>
        <h2>我喜欢的歌</h2>
        <SongLi :songArr="songArr" />
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
    methods: {
        getSongIdList(){
            this.songArr = this.likeList
        }
    },
    computed:{
        ...mapState({
            likeList:state=>state.profiles.likeDataList
        })
    },
    created() {
        this.getSongIdList()
    },
}
</script>
<style scoped>
h2{
    text-align: center;
    padding: 30px 0;
    background-color: rgb(0, 255, 76);
}
</style>