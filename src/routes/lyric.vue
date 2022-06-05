<script>
import { mapState } from "vuex";
export default {
    name:'lyrics',
    data() {
        return {
            lyric:[]
        }
    },
    methods: {
        /* 获取歌曲数据 */
        getAudioTab(val){
            console.log(val);
            console.log(this.valu)
        },
    },
    computed:{
        ...mapState({
            currentTimeList:state=>state.song.currentTimeList,
            currentContentList:state=>state.song.currentContentList,
            map:state=>state.song.map,
            orderStr:state=>state.song.orderArr[state.song.orderNum]
        })
    },
    created() {
        // 接收歌曲数据
        // this.$bus.$on('getAudioTab',this.getAudioTab)
        // 请求歌曲数据
        // this.$bus.$emit('sendAudioTab')
    },
    render(h) {
        this.lyric = h('div',this.currentContentList.map(val => h('p',val)))
        const lastButton = h('button',{
            on:{
                click: () => this.$store.dispatch('song/lastMe')
            }
        },'上一首')
        return h('div',{},[this.lyric,lastButton])
    },
}
</script>
<style scoped>

</style>