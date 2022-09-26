<template>
    <div style="padding:0px 5%">
        <el-skeleton animated :loading='loading'>
            <template slot="template">
                <el-skeleton-item style="width:100px"></el-skeleton-item>
                <el-skeleton-item></el-skeleton-item>
                <ul>
                    <li v-for="item in 10" :key="item">
                        <el-skeleton-item style="height:100%" variant='image'></el-skeleton-item>
                    </li>
                </ul>
            </template>
            <template>
                <div>                    
                    <left-title str='新音乐' />
                    <ul>
                        <li v-for="item in recommendNewMusicList" :key="item.id">
                            <div :style="{background:'url('+item.picUrl+'?param=500y500'+') center'}">
                                <div class="singers" @click="playMe(item.id)">
                                    <p>{{item.name}}</p>
                                    <span> {{item.song.artists | songName}} - {{item.song.album.name}} </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </template>
        </el-skeleton>
    </div>
</template>
<script>
import {songName} from '@/mixins/index.js'
import leftTitle from '@/components/leftTitle.vue'
export default {
  components: { leftTitle },
    name:'newMusic',
    mixins:[songName],
    data() {
        return {
            recommendNewMusicList:[],
            idList:[],
            isText:'正在加载',
            errorText:'出错了，无语死了',
            noPlayState:true,
            loading:true
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
                this.loading = false
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
ul{
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
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
    overflow: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
}
li span{
    display: block;
    overflow: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 9px;
}
.singers{
    box-sizing: border-box;
    position: absolute;
    left: 100%;
    top: 0;
    height: 100%;
    width: 100%;
    padding: 10px 15px;
    overflow: inherit;
    transition: all 0.6s 0.1s;
    background-color: rgba(96, 96, 96, 0.5);
    color: white;
    backdrop-filter: blur(6px);
}
li:hover > div > div{
    left: 0%;
    transition: left 0.3s 0.3s;
}
</style>