<template>
    <div>
        <div class="thead" :class="{whole1:!boole,whole2:boole}" @mouseleave="out" @mouseenter="penetrate">
            <img @click="clickSongImg" :src="picUrl" alt="加载出错啦" />
            <audio ref="audio" controls autoplay="autoplay" :src="audioSrc">
                对不起，你的浏览器不支持audio标签，请升级或更换浏览器进行播放
            </audio>
            <button>上一首</button>
            <button ref="pause" @click="suspend">暂停</button>
            <button class="none" ref="play" @click="play">播放</button>
            <button>下一首</button>
        </div>
        <PlaySongDetails v-show="false" />
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
            picUrl:require('../assets/logo.png'),
            musicObj:null,
            boole:false,
            setTime:null
        }
    },
    methods: {
        music(id){
            /* 播放音乐 */
            this.$refs.play.style.display = "none"
            this.$refs.pause.style.display = "inline-block"
            // 获取歌曲pic
            this.$api.songDetail(id)
            .then(content => this.picUrl = content.data.songs[0].al.picUrl)
            // 获取歌曲url
            this.$api.song(id)
            .then(val => {
                let url = val.data.data[0].url
                if(url){
                    this.audioSrc =  url + '?time=' + Math.random();
                }else{
                    this.$bus.$emit('nextSong')
                }
            })
            .catch(error => this.$bus.$emit('nextSong'))
        },
        suspend(){
            /* 暂停 */
            if(this.$refs.audio.paused==false){
                this.$refs.audio.pause()
                this.$refs.pause.style.display = "none"
                this.$refs.play.style.display = "inline-block"
            }
        },
        play(){
            /* 播放 */
            this.$refs.audio.play()
            this.$refs.play.style.display = "none"
            this.$refs.pause.style.display = "inline-block"
        },
        clickSongImg(){
            /* 点击进入歌词页 */
            this.boole = !this.boole
            history.pushState(null,null,document.URL)
            addEventListener('popstate',this.open)
        },
        open(){
            this.boole = !this.boole
            removeEventListener('popstate',this.open)
        },
        penetrate(){
            /* 鼠标进入元素 */
            this.boole=true
            clearTimeout(this.setTime)
        },
        out(){
            /* 鼠标离开元素 */
            this.setTime = setTimeout(()=>this.boole=false,2000)
        }
    },
    created(){
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
/* .whole{
    width: 100%;
    position: fixed;
} */
.whole1{
    top:calc(100vh - 10px);
    border-top: 10px solid rgba(61, 45, 45);
}
.whole2{
    top:calc(100vh - 50px);
    border-top: none;
    background-color: rgb(180, 167, 149);
}
</style>