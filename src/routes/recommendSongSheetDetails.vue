<template>
    <div>
        <h3>歌单详情</h3>
        <div class="head-div">
            <img :src="$route.query.src" alt="加载出错" />
            <div>
                <h4>{{$route.query.title}}</h4>
                <p>歌单创作者: {{$route.query.name}}</p>
            </div>
        </div>
        <SongLi :songArr='songArr' />
    </div>
</template>
<script>
import SongLi from '@/components/SongLi.vue'
export default {
    name:"recommendSongSheetDetails",
    components:{SongLi},
    data() {
        return {
            songArr:[]
        }
    },
    methods: {
        getSongIdList(){
            // get playlist of all song
            this.$api.playlistTrackAll(this.$route.query.id)
            .then(({data})=>this.songArr = data.songs)
            .catch(error=>console.log(error))
        },
        
    },
    created() {
        this.getSongIdList()
    }
}
</script>
<style scoped>
h3{
    text-align: center;
    padding: 15px 0;
}
img{
    width: 100px;
    height: 100px;
}
.head-div{
    display: flex;
    height: 100px;
    margin: 0 35px;
}
.head-div > div{
    flex-grow: 1;
    box-sizing: border-box;
    background-color: rgb(6, 95, 32);
}
.head-div > div h4{
    color: white;
    line-height: 1.5em;
    max-height: 3em;
    -webkit-line-clamp: 2;
}
.head-div > div p,.head-div > div h4{
    margin: 10px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
}
.head-div > div p{
    -webkit-line-clamp: 1;
}
</style>