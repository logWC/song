<template>
    <div>
        <div class="thead" :class="{whole1:boole,whole2:!boole}" @mouseleave="out(2000)" @mouseenter="penetrate">
            <img :src="picUrl" alt="加载出错啦" />
            <audio ref="audio" controls="controls" autoplay="autoplay" :src="audioSrc">
                对不起，你的浏览器不支持audio标签，请升级或更换浏览器进行播放
            </audio>
            <button @click="$bus.$emit('lastSong')">上一首</button>
            <button v-if="!suspendBoolean" @click="suspend">暂停</button>
            <button v-else @click="play">播放</button>
            <button @click="$bus.$emit('nextSong')">下一首</button>
        </div>
        <PlaySongDetails @suspend="suspend" @play="play" :suspendBoolean="suspendBoolean" v-show="true" />
    </div>
</template>
<script>
import PlaySongDetails from './PlaySongDetails.vue'
export default {
  components: { PlaySongDetails },
    name:"PlaySong",
    data() {
        return {
            audioSrc:null,
            picUrl:require('@/assets/logo.png'),
            musicObj:null,
            boole:false,
            playsongdetailsBoole:false,
            setTime:null,
            suspendBoolean:false,
        }
    },
    methods: {
        /* 播放音乐 */
        music(id){
            // 获取图片
            this.$api.songDetail(id)
            .then(content => this.picUrl = content.data.songs[0].al.picUrl)
            this.$api.song(id)
            // 获取歌曲url
            .then(val => {
                let url = val.data.data[0].url
                if(url){
                    this.audioSrc =  url + '?time=' + Math.random();
                    this.$bus.$emit('obtainLyric',id)
                    // 兼容autoplay失效的浏览器
                    this.$nextTick(()=>{this.play()})
                }else{
                    // 当url为null时，播放下一首
                    this.$bus.$emit('nextSong')
                }
            })
            .catch(error => this.$bus.$emit('nextSong'))
        },
        /* 暂停 */
        suspend(){
            if(this.$refs.audio.paused==false){
                this.$refs.audio.pause()
                this.suspendBoolean=true
            }
        },
        /* 播放 */
        play(){
            this.$refs.audio.play()
            this.suspendBoolean=false
        },
        // clickSongImg(){
        //     /* 点击进入歌词页 */
        //     this.playsongdetailsBoole = !this.playsongdetailsBoole
        //     history.pushState(null,null,document.URL)
        //     addEventListener('popstate',this.open)
        // },
        // open(){
        //     console.log(1)
        //     this.playsongdetailsBoole = !this.playsongdetailsBoole
        //     removeEventListener('popstate',this.open)
        // },
        /* 鼠标穿入元素 */
        penetrate(){
            this.boole=false
            clearTimeout(this.setTime)
        },
        /* 鼠标穿出元素 */
        out(time){
            this.setTime = setTimeout(()=>this.boole=true,time)
        }
    },
    created(){
        // 隐藏下标播放
        this.out(4000)
        // 设置全局总线事件
        this.$bus.$on('music',this.music)
    },
}
</script>
<style scoped>
.thead{
    display: flex;
    position: fixed;
    width: 100%;
    height: 50px;
    transition: all 0.3s;
}
.thead audio{
    flex-grow: 1;
    height: inherit;
}
.thead img{
    width: 50px;
}
.none{
    display: none;
}
.block{
    display: block;
}
.whole1{
    top:calc(100vh - 10px);
    border-top: 10px solid rgba(61, 45, 45, 0.13);
}
.whole2{
    top:calc(100vh - 50px);
    border-top: none;
    background-color: rgb(180, 167, 149);
}
</style>