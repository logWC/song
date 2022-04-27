<template>
    <div>
        <div v-if="recommendNewMusicList.length">
            <h3>新音乐</h3>
            <ul class="recommendNewMusic" @click.once="$idListMe(idList)">
                <li @click="$play(item.id)" v-for="item in recommendNewMusicList" :key="item.id">
                    <img v-lazy="item.picUrl" :alt="item.name">
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