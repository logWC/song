<template>
    <div v-if="idList.length">
        a
        <h3>歌单详情(默认20首)</h3>
        <div class="head-div">
            <img :src="songList.coverImgUrl" alt="加载出错" />
            <div>
                <h4>{{$route.query.title}}</h4>
                <p>歌单创作者id: {{songList.userId}}</p>
            </div>
        </div>
        <div class="body-div">
            <ul @click.once="idListMe">
                <li @click="play(item.id,index)" v-for="(item,index) in songList.tracks" :key="item.id">
                    <div>
                        <span>{{item.name}}</span>
                        <span style="color:red"> {{item.ar | songName}} </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {songName} from '@/mixins/index.js'
export default {
    name:"recommendSongSheetDetails",
    mixins:[songName],
    data() {
        return {
            songList:"",
            idList:[]
        }
    },
    methods: {
        play(id,index){
            this.$bus.$emit('currentSong',id,index)
        },
        getSongIdList(){
            // 获取歌单的所有歌曲
            this.$api.songListDetails(this.$route.query.id)
            .then(
                content => {
                    this.songList = content.data.playlist
                    this.idJoin()
                }
            )
            .catch(error => alert(`获取歌曲失败: ${error}`))
        },
        idJoin(){
            this.idList = this.songList.tracks.map(val => val.id)
        },
        idListMe(){
            this.$bus.$emit('musicIdList',this.idList)
        }
    },
    created() {
        this.getSongIdList()
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
    background-color: aqua;
    margin: 15px;
}
.head-div > div{
    display: inline-block;
    flex-grow: 1;
    height: 100%;
    vertical-align: top;
    background-color: rgb(6, 95, 32);
}
.head-div > div h4{
    color: antiquewhite;
    margin: 10px;
    line-height: 1.5em;
    max-height: 3em;
    overflow: hidden;
    display: -webkit-box;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.head-div > div p{
    margin-left: 10px;
}
.body-div{
    margin-top: 20px;
}
</style>