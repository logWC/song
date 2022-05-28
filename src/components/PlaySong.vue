<template>
    <div>
        <div class="thead" :class="{whole1:boole,whole2:!boole}" @mouseleave="wearOut(2000)" @mouseenter="penetrate">
            <img @error="picUrl=$options.data().picUrl" :src="picUrl" alt="加载出错啦" />
            <!-- autoplay="autoplay" -->
            <audio @error="test" ref="audio" controls="controls" :src="audioSrc">
                对不起，你的浏览器不支持audio标签，请升级或更换浏览器进行播放
            </audio>
            <button @click="$bus.$emit('lastSong')">上一首</button>
            <button v-if="suspendBoolean" @click="suspend">暂停</button>
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
            boole:false,
            setTime:null,
            suspendBoolean:false,
            musicId:null,
            musicIdr:null,
            audioEl:null,
            int:null
        }
    },
    methods: {
        // src失效
        async test(){
            let {data} = await this.$api.checkMusic(this.musicId)
            console.log(data)
            if(data.success){
                if(this.musicId==this.musicIdr){
                    this.audioSrc=null
                    return
                }
                this.musicIdr=this.musicId
                this.$api.song(this.musicId)
                .then(({data})=>this.audioSrc=data.data[0].url)
                this.$nextTick(()=>this.audioSrc.play())
            }else{
                this.$bus.$emit('nextSong')
            }

        },
        /* 播放音乐 */
        music(id){
            // 保存id
            this.musicId = id
            // 进行播放及获取歌词
            this.$api.song(id)
            .then(({data}) => {
                let url = data.data[0].url
                if(url){
                    // 获取url
                    this.audioSrc =  url;
                    // 获取歌曲图片
                    this.$api.songDetail(id)
                    .then(({data}) => this.picUrl = data.songs[0].al.picUrl)
                    // 获取歌词
                    this.$bus.$emit('obtainLyric',id)
                    // 兼容autoplay失效的浏览器（点击歌曲但无法自动播放）
                    // this.$nextTick(()=>{this.play()})
                    this.int = setInterval(()=>{
                        if(this.audioEl.readyState==4){
                            clearInterval(this.int);
                            this.play()
                            console.log('开始播放')
                        }
                    },1000)
                }else{
                    this.audioClear()
                    alert('歌曲未获得版权，请播放其他歌曲')
                }
            })
            .catch(error => this.$bus.$emit('nextSong'))
        },
        /* 暂停 */
        suspend(){
            !this.audioEl.paused && this.audioEl.pause()
        },
        /* 播放 */
        play(){
            this.audioEl.paused && this.audioSrc && this.audioEl.play()
        },
        // playsongdetailsBoole:false,
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
        wearOut(time){
            this.setTime = setTimeout(()=>this.boole=true,time)
        },
        /* 改变播放状态按钮 */
        suspendBooleanMe(el){
            if(el.type=='play'){
                this.suspendBoolean = true
            }else{
                this.suspendBoolean = false
            }
        },
        /* 绑定元素并监听播放状态 */
        elementMe(){
            this.audioEl = this.$refs.audio;
            ['play','pause'].forEach(val=>this.audioEl.addEventListener(val,this.suspendBooleanMe))
        },
        /* 恢复audio出厂 */
        audioClear(){
            this.$bus.$emit('lyricClear')
            this.audioSrc = null
            this.audioEl.load()
            this.picUrl = this.$options.data().picUrl
        }
    },
    created(){
        // 隐藏下标播放
        this.wearOut(4000)
        // 设置全局总线事件
        this.$bus.$on('music',this.music)
        this.$bus.$on('audioClear',this.audioClear)
    },
    mounted() {
        // 设置绑定元素
        this.elementMe()
    },
    beforeDestroy(){
        ['play','pause'].forEach(val=>this.audioEl.removeEventListener(val,this.suspendBooleanMe))
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