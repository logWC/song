<template>
    <div>
        <div v-if="recommendNewMusicList.length">
            <h2>新音乐</h2>
            <ul @click.once="$store.commit('song/idListMe',idList)">
                <li :style="{backgroundImage:'url('+item.picUrl+')'}" v-for="item in recommendNewMusicList" :key="item.id">
                    <img v-lazy="item.picUrl" :alt="item.name">
                    <div>
                        <div class="singers" @click="$store.dispatch('song/clickPlayMe',item.id)">
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
            errorText:'出错了，无语死了'
        }
    },
    methods: {
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
    }
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
    box-sizing: border-box;
    padding: 5px 5%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
li{
    display: flex;
    flex-basis: 48%;
    overflow: hidden;
    margin: 5px 0;
}

li img{
    /* width: 60px; */
    height: 60px;
}
li > div{
    box-sizing: border-box;
    flex-grow: 1;
    line-height: 20px;
    padding: 10px 15px;
    overflow: hidden;
    text-shadow: 0 0 0 black;
    color: transparent;
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
    transition: all 1s 1s;
    background-color: #6160603f;
    color: white;
}
li:hover > div > div{
    left: 0%;
    transition: all 0.5s 0.2s;
}
</style>