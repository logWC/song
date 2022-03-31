<template>
    <div>
        <div v-if="recommendNewMusicList.length">
            <h3>新音乐</h3>
            <ul class="recommendNewMusic" @click.once="idListMe">
                <li @click="play(item.id,index)" v-for="(item,index) in recommendNewMusicList" :key="item.id">
                    <img :src="item.picUrl" alt="item.name">
                    <div>
                        <p>{{item.name}}</p>
                        <span> {{item.song.artists | songName}} </span>
                    </div>
                </li>
            </ul>
        </div>
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
        }
    },
    methods: {
        play(id,index){
            /* 点击播放单曲 */
            this.$bus.$emit('currentSong',id,index)
        },
        obtainRecommendNewMusicList(){
            /* 获取歌曲列表、歌曲id列表 */
            this.$api.recommendNewMusic()
            .then(
                ({data}) => {
                    this.recommendNewMusicList = data.result
                    this.idList = this.recommendNewMusicList.map(val => val.id)
            }
            )
            .catch(error => console.log(error))
        },
        idListMe(){
            this.$bus.$emit('musicIdList',this.idList)
        }
    },
    created() {
        this.obtainRecommendNewMusicList()
    },
}
</script>
<style scoped>
h3{margin: 20px 15px;}
.recommendNewMusic{
    margin: 20px;
}
.recommendNewMusic li{
    display: flex;
    padding: 1px;
}
.recommendNewMusic li img{
    width: 60px;
    height: 60px;
}
.recommendNewMusic li div{
    box-sizing: border-box;
    height: 60px;
    flex-grow: 1;
    line-height: 20px;
    padding: 10px;
}
.recommendNewMusic li span{
    display: block;
    font-size: 9px;
}
</style>