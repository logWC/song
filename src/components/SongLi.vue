<template>
    <div @[hide]="detailsChange" class="body-div">
        <p style="font-weight:bold;font-size:16px" v-if="songArr&&songArr.length!=0">歌曲{{songArr.length}}</p>
        <ul v-if="songArr&&songArr.length!=0">
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
            <li v-for="item in showcasedPlaylist" :key="item.id">
                <div @click="playMe(item.id)">
                    <span>{{item.name}}</span>
                </div>
                <div>
                    <span v-if="item.ar"> {{item.ar | songName}} </span>
                    <span v-if="item.artists"> {{item.artists | songName}}</span>
                </div>
                <div>
                    <span v-if="item.al">{{item.al.name}}</span>
                    <span v-if="item.album">{{item.album.name}}</span>
                </div>
                <div @click.stop>
                    <like-icon :id="item.id" v-if="item.id==detailsIndex" />
                    <svg @click.stop="detailsChange(item.id)" class="icon" aria-hidden="true">
                        <use xlink:href="#icon-androidgengduo"></use>
                    </svg>
                </div>
            </li>
        </ul>
        <div ref="touchbottom"></div>
    </div>
</template>
<script>
import likeIcon from "@/components/likeIcon.vue";
import {songName} from '@/mixins/index.js'
export default {
    name:'SongLi',
    mixins:[songName],
    components:{likeIcon},
    props:{songArr:Array},
    data() {
        return {
            detailsIndex:-1,
            hide:null,
            noPlayState:true,
            num:null
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
        detailsChange(id=false){
            this.detailsIndex = id || -1;
            this.hide = id?'click':null;
        },
        /* open io */
        openIo(){
            this.io = new IntersectionObserver(entries=>entries[0].isIntersecting&&this.getAllSong());
            this.io.observe(this.$refs.touchbottom);
        },
        /* io observe */
        getAllSong(){
            console.log('触底了')
            let startIndex = this.showcasedPlaylist.length;
            let maxIndex = this.songArr?this.songArr.length:0;
            if(startIndex+49<maxIndex){
                this.num = startIndex+50
            }else if(startIndex<maxIndex){
                this.num = maxIndex
            }else{
                return
            }
        }
    },
    computed:{
        showcasedPlaylist(){
            return this.songArr?this.songArr.slice(0,this.num || 20):[]
        }
    },
    mounted() {
        this.openIo()
    }
}
</script>
<style scoped>
.body-div{
    margin: 0px 5px;
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
    font-size: 14px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
li~li > div~div > span,svg{
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
    padding: 15px 0;
}
.none{
    display: none;
}
.display{
    display: inline-block;
}
</style>