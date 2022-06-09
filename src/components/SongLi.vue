<template>
    <div @[hide]="hideMe" v-show="songArr.length!=0" class="body-div">
        <p style="font-weight:bold;font-size:18px">歌曲{{songArr.length}}</p>
        <!-- @click.once.capture="$store.commit('song/idListMe',songArr.map(val=>val.id))" -->
        <ul>
            <li>
                <div>
                    <span>歌曲</span>
                </div>
                <div>
                    <span>歌手</span>
                </div>
                <div>
                    <span>专辑</span>
                </div>
                <div>
                    <span>详情</span>
                </div>
            </li>
            <li v-for="item in songArr" :key="item.id">
                <div @click="playMe(item.id)">
                    <span>{{item.name}}</span>
                </div>
                <div>
                    <span v-if="item.ar"> {{item.ar | songName}} </span>
                    <span v-if="item.artists"> {{item.artists | songName}} - {{item.album.name}} </span>
                </div>
                <div>
                    <span v-if="item.al">{{item.al.name}}</span>
                    <span v-if="item.album">{{item.album.name}}</span>
                </div>
                <div>
                    <svg @click.stop="likeIconMe(item.id)" v-if="item.id==detailsIndex" class="icon" aria-hidden="true">
                        <use :xlink:href="likeIcon"></use>
                    </svg>
                    <svg @click="details(item.id)" class="icon" aria-hidden="true">
                        <use xlink:href="#icon-androidgengduo"></use>
                    </svg>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import {songName} from '@/mixins/index.js'
import { mapState } from 'vuex'
export default {
    name:'SongLi',
    mixins:[songName],
    props:{songArr:Array},
    data() {
        return {
            detailsIndex:-1,
            hide:null,
            likeIcon:'#icon-aixinD',
            noPlayState:true
        }
    },
    methods: {
        playMe(id){
            if(this.noPlayState){
                this.$store.commit('song/idListMe',this.songArr.map(val=>val.id))
                this.noPlayState = false
            }
            this.$store.dispatch('song/clickPlayMe',id)
        },
        details(id){
            this.likeIcon = this.likeIdList.includes(id)
            ?'#icon-aixinshoucang'
            :'#icon-aixinD';
            this.detailsIndex = id
            this.hide = 'click'
        },
        hideMe(){
            this.detailsIndex = -1
            this.hide = null
        },
        async likeIconMe(id){
            let boolean = await this.$api.like(id,this.likeIcon=='#icon-aixinD')
            .then(val=>true)
            .catch(error=>{
                error.toString().includes(500)
                ?alert('没有版权，喜欢失败')
                :alert('未知错误，喜欢失败')
                return false
            })
            if(boolean){
                this.$store.dispatch('profiles/obtainLikeList')
                this.likeIcon = this.likeIcon=='#icon-aixinD'
                ?'#icon-aixinshoucang'
                :'#icon-aixinD'
            }
        }
    },
    computed:{
        ...mapState({
            likeIdList:state=>state.profiles.likeIdList
        })
    },
    watch:{
        // songArr:{
        //     handler(val){
        //         console.log(val)
        //     },
        //     immediate:true
        // }
    }
}
</script>
<style scoped>
.body-div{
    margin: 0px 35px;
    padding: 20px 0;
    position: relative;
}
li{
    display: flex;
    margin: 5px 0;
}
li:first-of-type{
    color: rgb(128, 128, 128);
}
li~li:hover{
    background-color: rgb(167, 72, 72);
}
li > div{
    box-sizing: border-box;
    font-size: 10px;
    padding: 15px 15px 15px 5px;
}
li~li > div{
    padding: 15px 15px 15px 4.5px;
    font-size: 15px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
li~li > div~div > span,li > div > svg{
    cursor: pointer;
}
li > div:nth-of-type(1){
    flex-basis: 43%;
    flex-grow: 1;
}
li > div:nth-of-type(2){
    flex-basis: 25%;
}
li~li > div:nth-of-type(2){
    color:red;
}
li > div:nth-of-type(3){
    flex-basis: 25%;
}
li > div:nth-of-type(4){
    flex-basis: 7%;
    text-align: center;
    padding: 15px 15px 15px 10px;
}
.none{
    display: none;
}
.display{
    display: inline-block;
}
</style>