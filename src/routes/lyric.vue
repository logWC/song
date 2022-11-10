<script>
import { mapState } from "vuex";
export default {
    name:'lyrics',
    data() {
        return {
            audioEl:null,
            lyricEl:null,
            timeIndex:0,
        }
    },
    methods: {
        /* 获取歌曲数据 */
        getAudioTab(audioEl){
            this.audioEl=audioEl
            this.audioEl.addEventListener('timeupdate',this.timeUpdated)
        },
        timeUpdated({target}){
            let time = target.currentTime
            while(this.currentTimeList[this.timeIndex] < time){
                this.lyricEl.scrollTop = this.map.get(this.timeIndex)
                this.timeIndex++
            }
            while(this.currentTimeList[this.timeIndex-1] > time){
                this.lyricEl.scrollTop = this.map.get(this.timeIndex-2)
                this.timeIndex--
            }
        },
        /* 绑定元素 */
        elementMe(){
            this.lyricEl = this.$refs.lyric
        }
    },
    computed:{
        ...mapState({
            currentTimeList:state=>state.song.currentTimeList,
            currentContentList:state=>state.song.currentContentList,
            map:state=>state.song.map,
            url:state=>state.song.url
        })
    },
    watch:{
        currentTimeList(val){
            this.timeIndex = 0
        }
    },
    created() {
        // 接收歌曲数据
        this.$bus.$on('getAudioTab',this.getAudioTab)
        // 请求歌曲数据
        this.$bus.$emit('sendAudioTab')
    },
    mounted() {
        this.elementMe()
    },
    beforeDestroy() {
        this.audioEl.removeEventListener('timeupdate',this.timeUpdated)
    },
    activated() {
        this.timeIndex=this.timeIndex>0?this.timeIndex-1:0

        setTimeout(() => {
            document.documentElement.scrollTop=0
        }, 0);
    },
    render(h) {
        // 顶部
        const headrDiv = h('div',{
            class:['headr']
        },'未使用')

        /* 歌词模块 */
        // 图片img
        const picDiv = h('div',{
            class:['pic']
        },'这里放照片')

        // p白痴数组
        const ps = function (length){
            return new Array(length).fill(1).map((val)=>h('p',null,''))
        }
        // p歌词数组
        const lyricP = this.currentContentList.map(
            (val,index) => h('p',{class:{red:this.timeIndex==index+1},key:index},val)
        )
        // 歌词div
        const lyricDiv = h('div',{
            class:['lyric'],
            ref:'lyric'
        },[ps(8),lyricP,ps(9)])
        // 歌词模块
        const bodyrDiv = h('div',{
            class:['bodyr']
        },[picDiv,lyricDiv])


        /* template毛玻璃 */
        const glass = h('div',{
            class:['wholeGlass']
        },[headrDiv,bodyrDiv])

        /* template */
        return h('div',{
            class:['whole'],
            style:{backgroundImage:'url('+this.url+')'}
        },[glass])
    },
}
</script>
<style scoped>
.whole{
    width: 800px;
    min-height: 900px;
    background-color: white;
    background-position: center;
    position: relative;
}
.wholeGlass{
    width: inherit;
    height: inherit;
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    background-color: rgba(128, 128, 128, 0.5);
    backdrop-filter: blur(10px);
}
.headr{
    width: inherit;
    height: 60px;
    /* background-color: rgb(221, 182, 7); */
}
.bodyr{
    display: flex;
    flex-wrap: wrap;
    height: 540px;
    margin: 0 auto;
    /* background-color: blueviolet; */
}
.pic{
    flex-basis: 50%;
    height: inherit;
    /* background-color: yellowgreen; */
}
.lyric{
    flex-basis: 50%;
    height: inherit;
    /* background-color: aqua; */
    font-family: Arial;
    font-size: 15px;
    overflow: auto;
    scroll-behavior: smooth;
    transition: all 1s 0.5s ease-in;
    -webkit-transition: all 1s 0.5s ease-in;
}
.lyric::-webkit-scrollbar{
    /* 隐藏滚动条 */
    display: none;
}
p{
    text-align: center;
    min-height: 30px;
    line-height: 30px;
}
.red{
    color: rgb(117, 61, 8);
    font-size: 18px;
}
</style>