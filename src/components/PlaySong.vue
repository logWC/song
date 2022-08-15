<template>
        <div class="bodyr"
        :class="{whole1:boole,whole2:!boole}"
        @[mouseleave]="wearOut(2000)"
        @[mouseenter]="penetrate">
            <div style="background-color:transparent;height:20px"> </div>
            <div class="thead">
                <img @click="lyricClick" @error="require('@/assets/logo.png')" :src="url" alt="#" />
                <audio 
                @error="error"
                @play="suspendBoolean=true"
                @pause="suspendBoolean=false"
                @ended="ended"
                ref="audio"
                controls="controls">
                    对不起，你的浏览器不支持audio标签，请升级或更换浏览器进行播放
                </audio>
                <button>
                    <like-icon :id="id" />
                </button>
                <button @click="$store.dispatch('song/orderNumMe')">{{order}}</button>
                <button @click="$store.dispatch('song/lastMe')">上一首</button>
                <button v-if="suspendBoolean" @click="suspend">暂停</button>
                <button v-else @click="play">播放</button>
                <button @click="$store.dispatch('song/nextMe')">下一首</button>
            </div>
        </div>
</template>
<script>
import likeIcon from "@/components/likeIcon.vue";
import { mapState } from 'vuex'
export default {
    name:"PlaySong",
    components:{likeIcon},
    data() {
        return {
            boole:false,
            setTime:null,
            suspendBoolean:false,
            audioEl:null,
            int:null,
            mouseenter:'mouseenter',
            mouseleave:'mouseleave',
        }
    },
    methods: {
        // src失效
        error(){
            if(this.src==null)return
            this.$api.checkMusic(this.id)
            .then(
                ({data})=>{
                    !data.success && this.$store.commit('song/clearAudio')
                    data.success && this.$store.dispatch('song/play',this.id)
                })
            .catch((error)=>{
                this.$store.commit('song/clearAudio');
                alert('网络出错了呀')
            })

        },
        /* 暂停 */
        suspend(){
            !this.audioEl.paused && this.audioEl.pause()
        },
        /* 播放 */
        play(){
            this.audioEl.paused && this.src && this.audioEl.play()
        },
        /* 播放结束 */
        ended(){
            this.order=='正在单曲循环'
            ?this.$store.dispatch('song/play',this.id)
            :this.$store.dispatch('song/nextMe')
            // this.suspendBoolean = true
        },
        /* 跳转至歌词路由 */
        lyricClick(){
            this.$router.history.current.path!='/lyrics'
            ?this.$router.push('/lyrics')
            :console.log('现在就在歌词页')
        },
        /* 传递audio到歌词路由 */
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
        /* 绑定元素 */
        elementMe(){
            this.audioEl = this.$refs.audio;
        },
    },
    computed:{
        ...mapState({
            id:state=>state.song.id,
            src:state=>state.song.src,
            url:state=>state.song.url,
            order:state=>state.song.orderArr[state.song.orderNum]
        })
    },
    watch:{
        src(val){
            // 加载状态
            this.suspendBoolean = false;
            this.audioEl.src = val
            if(val){
                this.int = setInterval(()=>{
                    if(this.audioEl.readyState==4){
                        clearInterval(this.int);
                        this.play()
                    }
                },500)
            }else{
                this.audioEl.load()
            }
        }
    },
    created(){
        // 设置发送歌曲数据方法
        this.$bus.$on('sendAudioTab',this.sendAudioTab)
    },
    mounted() {
        // 设置绑定元素
        this.elementMe()
        if(screen.width<screen.height){
            this.mouseenter = null
            this.mouseleave = null
            this.boole = false
        }else{
            // 隐藏下标播放
            this.wearOut(4000)
        }
    }
}
</script>
<style scoped>
.bodyr{
    position: fixed;
    width: 100%;
    transition: all 0.3s;
}
.whole1{
    /* top:calc(100vh - 20px); */
    bottom: -50px;
}
.whole2{
    /* top:calc(100vh - 70px); */
    bottom: 0px;
}
.thead{
    display: flex;
    height: 50px;
    box-shadow: 0px -1px 5px #333;
    background-color: white;
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
    height: 50px;
}

</style>