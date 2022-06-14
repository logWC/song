<template>
    <div>
        <div v-if="recommendNewMusicList.length">
            <h2>新音乐</h2>
            <ul>
                <li v-for="item in recommendNewMusicList" :key="item.id">
                    <img v-lazy="item.picUrl" :alt="item.name">
                    <div :style="{backgroundImage:'url('+item.picUrl+')'}">
                        <div class="singers" @click="playMe(item.id)">
                            <p>{{item.name}}</p>
                            <span> {{item.song.artists | songName}} - {{item.song.album.name}} </span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div v-else> {{isText}} </div>
    </div>
</template>
<script>
import {songName} from '@/mixins/index.js'
export default {
    name:'newMusic',
    mixins:[songName],
    data() {
        return {
            recommendNewMusicList:[],
            idList:[],
            isText:'正在加载',
            errorText:'出错了，无语死了',
            noPlayState:true
        }
    },
    methods: {
        playMe(id){
            if(this.noPlayState){
                this.$store.commit('song/idListMe',this.idList)
                this.noPlayState = false
            }
            this.$store.dispatch('song/clickPlayMe',id)
        },
        obtainRecommendNewMusicList(){
            /* 获取歌曲列表、歌曲id列表 */
            this.$api.recommendNewMusic()
            .then(({data}) => {
                this.recommendNewMusicList = data.result
                this.idList = this.recommendNewMusicList.map(val => val.id)
            })
            .catch(error => this.isText = this.errorText)
        }
    },
    created() {
        this.obtainRecommendNewMusicList()
    },
    activated() {
        this.noPlayState=true
    },
}
</script>
<style scoped>
h2{
    font-size: 1.5em;
    font-weight: bold;
    margin: 20px 0 10px;
    text-align: center;
    letter-spacing: 20px;
}
ul{
    padding: 5px 5%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
ul,li div{
    box-sizing: border-box;
}
li{
    height: 60px;
    display: flex;
    flex-basis: 48%;
    margin: 5px 0;
}
li img{
    height: 100%;
}
li > div{
    flex-grow: 1;
    overflow: hidden;
    position: relative;
}

li p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
li span{
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 9px;
}
.singers{
    position: absolute;
    left: 100%;
    top: 0;
    height: 100%;
    width: 100%;
    padding: 10px 15px;
    overflow: hidden;
    transition: all 0.5s 0.1s;
    background-color: rgba(96, 96, 96, 0.5);
    color: white;
    backdrop-filter: blur(6px);
}
li:hover > div > div{
    left: 0%;
    transition: all 0.5s 0.3s;
}
</style>