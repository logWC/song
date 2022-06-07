<template>
    <div>
        <div v-if="recommendNewMusicList.length">
            <h2>新音乐</h2>
            <ul class="recommendNewMusic" @click.once="$store.commit('song/idListMe',idList)">
                <li @click="$store.dispatch('song/clickPlayMe',item.id)" v-for="item in recommendNewMusicList" :key="item.id">
                    <img v-lazy="item.picUrl" :alt="item.name">
                    <div>
                        <p>{{item.name}}</p>
                        <span> {{item.song.artists | songName}} - {{item.song.album.name}} </span>
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
.recommendNewMusic{
    box-sizing: border-box;
    padding: 5px 5%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.recommendNewMusic li{
    display: flex;
    flex-basis: 32%;
    overflow: hidden;
    margin: 5px 0;
}
.recommendNewMusic li img{
    width: 60px;
    height: 60px;
}
.recommendNewMusic > li > div{
    box-sizing: border-box;
    flex-grow: 1;
    line-height: 20px;
    padding: 10px 0px 10px 10px;
    overflow: hidden;
}
.recommendNewMusic > li > div > p{
    overflow: hidden;
    white-space: nowrap;
}
.recommendNewMusic > li > div > span{
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 9px;
}
</style>