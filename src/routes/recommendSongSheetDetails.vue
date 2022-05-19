<template>
    <div>
        <h3>歌单详情(默认20首)</h3>
        <div class="head-div">
            <img ref="img" alt="加载出错" />
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
            // 获取歌单的所有歌曲
            this.$api.songListDetails(this.$route.query.id)
            .then(
                ({data}) => {
                    this.songArr = data.playlist.tracks
                    this.$refs.img.src = data.playlist.coverImgUrl
                }
            )
            .catch(error => alert(`获取歌曲失败: ${error}`))
        }
    },
    created() {
        this.getSongIdList()
        document.documentElement.scrollTop=0
    }
}
</script>
<style scoped>
h3{
    text-align: center;
    margin: 15px 0;
}
img{
    width: 100px;
    height: 100px;
}
ul{
    margin: 30px 15px 0px;
}
li{
    padding: 5px;
}
li span:first-of-type{
    display: block;
}
li span:last-of-type{
    font-size: 10px;
}
.head-div{
    display: flex;
    height: 100px;
    margin: 15px;
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
.body-div{
    margin-top: 20px;
}
</style>