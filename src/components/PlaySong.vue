<template>
        <div class="bodyr"
        :class="{whole1:!boole,whole2:boole}"
        @mouseleave="wearOut(2000)"
        @mouseenter="penetrate">
            <div style="background-color:transparent;height:20px"> </div>
            <div class="thead">
                <img @click="lyricClick" @error="require('@/assets/logo.png')" :src="url" alt="#" />
                <audio 
                @error="error"
                @play="suspendBoolean=true"
                @pause="suspendBoolean=false"
                @ended="ended"
                ref="audio"
                >
                    对不起，你的浏览器不支持audio标签，请升级或更换浏览器进行播放
                </audio>
                <button>
                    <like-icon :id="id" />
                </button>
                <button @click="$store.dispatch('song/lastMe')">上一首</button>
                <button @click="changePlayStatus">{{!suspendBoolean?'播放':'暂停'}}</button>
                <button @click="$store.dispatch('song/nextMe')">下一首</button>
                <button @click="$store.dispatch('song/orderNumMe')">{{order}}</button>
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
            boole:true,
            setTime:null,
            suspendBoolean:false,
            audioEl:null,
            int:null,
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
        /* 暂停、播放 */
        changePlayStatus(){
            this.audioEl.paused?this.audioEl.src&&this.audioEl.play():this.audioEl.pause()
        },
        /* 播放结束 */
        ended(){
            this.order=='正在单曲循环'
            ?this.$store.dispatch('song/play',this.id)
            :this.$store.dispatch('song/nextMe')
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
            this.boole=true
            clearTimeout(this.setTime)
        },
        /* 鼠标穿出元素 */
        wearOut(time){
            this.setTime = setTimeout(()=>this.boole=false,time)
        },
        /* 绑定元素 */
        elementMe(){
            this.audioEl = this.$refs.audio;
        },
        /* 监听控制回调 */
        keyupEnter(event){
            if(event.code=='Space'){
                this.changePlayStatus()
            }
        }
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
                        this.changePlayStatus()
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
        this.wearOut(4000)
        window.addEventListener('keyup',this.keyupEnter)
    },
    beforeDestroy(){
        window.removeEventListener('keyup',this.keyupEnter)
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
        bottom: -50px;
    }
    .whole2{
        bottom: 0px;
    }
    @media screen and (max-aspect-ratio:1/1) {
        .whole1{
            bottom: 0px;
        }
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