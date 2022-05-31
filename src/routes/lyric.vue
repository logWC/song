<script>
export default {
    name:'lyrics',
    data() {
        return {
            valu:'wclog'
        }
    },
    methods: {
        /* 获取歌曲数据 */
        getSongData(val){
            console.log(val)
        }
    },
    created() {
        // 接收歌曲数据
        this.$bus.$on('getSongData',this.getSongData)
        // 请求歌曲数据
        this.$bus.$emit('sendSongData')
    },
    render(h) {
        return h('h1',{},['this.$route.query.audioEl.currentTime'])
    },
}
</script>
<style scoped>

</style>