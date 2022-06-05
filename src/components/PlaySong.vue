<template>
    <div>
        <!-- transparent -->
        <div class="bodyr" :class="{whole1:boole,whole2:!boole}" @mouseleave="wearOut(2000)" @mouseenter="penetrate">
            <div style="background-color:transparent;height:20px"> </div>
            <div class="thead">
                <img @click="lyricClick" @error="picUrl=$options.data().picUrl" :src="picUrl" alt="加载出错啦" />
                <!-- autoplay="autoplay" -->
                <audio @error="error" ref="audio" controls="controls" :src="audioSrc">
                    对不起，你的浏览器不支持audio标签，请升级或更换浏览器进行播放
                </audio>
                <button @click="test">测试</button>
                <button @click="$bus.$emit('lastSong')">上一首</button>
                <button v-if="suspendBoolean" @click="suspend">暂停</button>
                <button v-else @click="play">播放</button>
                <button @click="$bus.$emit('nextSong')">下一首</button>
            </div>
        </div>
        <PlaySongDetails @suspend="suspend" @play="play" :suspendBoolean="suspendBoolean" />
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
        /* 测试 */
        test(){
        },
        // src失效
        error(){
            this.$api.checkMusic(this.musicId)
            .then(
                ({data})=>{
                    !data.success && this.audioClear()
                    data.success && this.music(this.musicId)
                })
            .catch((error)=>this.audioClear())

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
                    this.int = setInterval(()=>{
                        if(this.audioEl.readyState==4){
                            clearInterval(this.int);
                            this.play()
                        }
                    },1000)
                }else{
                    this.audioClear()
                    alert('歌曲未获得版权，请播放其他歌曲')
                }
            })
            .catch(error => {
                alert('出错了，好像断网了呀！');
                this.audioClear()
            })
        },
        /* 暂停 */
        suspend(){
            !this.audioEl.paused && this.audioEl.pause()
        },
        /* 播放 */
        play(){
            this.audioEl.paused && this.audioSrc && this.audioEl.play()
        },
        /* 跳转至歌词 */
        lyricClick(){
            this.$router.history.current.path!='/lyrics'
            ?this.$router.push('/lyrics')
            :console.log('现在就在歌词页')
        },
        /* 传递歌曲信息 */
        sendAudioTab(){
            this.$bus.$emit('getAudioTab',this.audioEl)
        },
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
        // 设置重置audio事件
        this.$bus.$on('audioClear',this.audioClear)
        // 设置发送歌曲数据方法
        this.$bus.$on('sendAudioTab',this.sendAudioTab)
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
.bodyr{
    position: fixed;
    width: 100%;
    transition: all 0.3s;
}
.thead{
    display: flex;
    height: 50px;
    box-shadow: 0px -1px 5px #333;
    background-color: #333;
}
.thead audio{
    flex-grow: 1;
    height: inherit;
    background-color: inherit;
}
.thead button{
    background-color: inherit;
    border: none;
}
.thead img{
    width: 50px;
}
.whole1{
    top:calc(100vh - 20px);
}
.whole2{
    top:calc(100vh - 70px);
}
</style>