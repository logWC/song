<template>
    <div @[hide]="hideMe" v-show="songArr.length!=0" class="body-div">
        <p style="font-weight:bold;font-size:18px">歌曲{{songArr.length}}</p>
        <ul @click.once="$store.commit('song/idListMe',songArr.map(val=>val.id))">
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
            <li v-for="(item,index) in songArr" :key="item.id">
                <div @click="$store.dispatch('song/clickPlayMe',item.id)">
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
                <div @click.stop>
                    <svg :class="{display:index==detailsIndex}" class="icon none" aria-hidden="true">
                        <use xlink:href="#icon-aixinD"></use>
                    </svg>
                    <svg @click="details(index)" class="icon" aria-hidden="true">
                        <use xlink:href="#icon-androidgengduo"></use>
                    </svg>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import {songName} from '@/mixins/index.js'
export default {
    name:'SongLi',
    mixins:[songName],
    props:{songArr:Array},
    data() {
        return {
            detailsIndex:-1,
            hide:null
        }
    },
    methods: {
        details(index){
            this.detailsIndex = index
            this.hide = 'click'
        },
        hideMe(){
            console.log('触发了rootDiv的点击')
            this.detailsIndex = -1
            this.hide = null
        }
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
    z-index: 0;
}
.display{
    display: inline-block;
    z-index: 2;
}
</style>