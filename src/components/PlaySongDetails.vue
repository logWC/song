<template>
    <div class="whole">
        <div class="lyric">
            <div class="zsq" ref="zsqRef">
                <p></p>
                <p></p>
                    <p :class="{red:timeIndex==inde+1}" v-for="(val,inde) in currentContentList" :key="inde">
                        {{val}}
                    </p>
                <p></p>
                <p></p>
            </div>
            <div>
                <button @click="lastSong">上一首</button>
                <button @click="$emit('suspend')" v-if="suspendBoolean">暂停</button>
                <button @click="$emit('play')" v-else>播放</button>
                <button @click="nextSong">下一首</button>
            </div>
            <div>
                <b @click="changeOrder(1)" v-if="orderNum==0">单曲循环</b>
                <b @click="changeOrder(2)" v-if="orderNum==1">顺序播放</b>
                <b @click="changeOrder(0)" v-if="orderNum==2">随机播放</b>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"PlaySongDetails",
    props:['suspendBoolean'],
    data() {
        return {
            currentTimeList:[],
            currentContentList:[],
            orderNum:0,
            idList:[],
            index:'',
            playList:null,
            arrIndex:-1,
            zsqRef:'',
            measureText: null,
            map:new Map(),
            width:0,
            timeIndex:0
        }
    },
    methods: {
        /* 改变播放顺序 */
        changeOrder(num){
            this.orderNum = num
            if(!this.playList) return
            var id = this.playList[this.index]
            var arr = JSON.parse(JSON.stringify(this.idList))
            this.playList = num!=2?arr:this.shuffleMethod(arr)
            this.index = this.playList.findIndex(val=>val==id)
        },

        /* 使用shuffle算法进行随机排序 */
        shuffleMethod(arr){
            // 深克隆数组
            let i = arr.length
            for(i;i>0;i--){
                let ran = Math.floor(Math.random()*i)
                arr.push(arr.splice(ran,1)[0])
            }
            return arr
        },
        /* 发送获取歌词及时间的请求 */
        obtainLyric(id){
            this.$api.lyric(id)
            .then(content => this.filterLRC(content.data.lrc.lyric))
            .catch(error=> console.log(`获取歌词失败${error}`))
        },
        filterLRC(value){
            // 清空时间
            this.currentTimeList = []
            // 清空歌词
            this.currentContentList = []
            // 清空width：控制scroll
            this.width=0
            // 清空map：每个时间段对应的scrollTop
            this.map.clear()
            if (!value) return
            let lyric = value.split("\n")
            let reg = /\[\d*:\d*(\.|:)\d*/g
            var index = 0
            lyric.forEach((val)=>{
                // 转换时间为秒，并以键值对显示 时间：歌词
                let timeReg = val.match(reg)
                if (timeReg){
                    let content = val.replace(timeReg[0],"").slice(1)
                    let min = parseFloat(timeReg[0].match(/\[\d*/g)[0].slice(1))
                    let sec = parseFloat(timeReg[0].match(/\d*\.\d/g)[0])
                    let time = min*60 + sec
                    this.timeList(time,content,index)
                    index++
                }
            })
            // 优化最后一句歌词动画
            this.currentTimeList.push(999999)
            console.log(this.currentContentList)
        },
        /* 获取时间与及对应歌词 */
        timeList(time,content,index){
            this.currentTimeList.push(time)
            this.currentContentList.push(content)

            // 判断歌词长度 >= 400
            var width = this.measureText.measureText(content).width
            if(width>=400){
                var i = Math.floor(width/400)
                this.width+=i
            }
            this.map.set(index,(index*30)+this.width*30)
        },
        /* 实时获取播放时间 */
        timeUpdated({target}){
            let time = target.currentTime
            while(this.currentTimeList[this.timeIndex] < time){
                this.zsqRef.scrollTop = this.map.get(this.timeIndex)
                this.timeIndex++
            }
            while(this.currentTimeList[this.timeIndex-1] > time){
                this.zsqRef.scrollTop = this.map.get(this.timeIndex-2)
                this.timeIndex--
            }

            if(target.ended&&this.playList){this.orderNum==0?this.playSong(this.playList[this.index]):this.nextSong()}
        },

        /* 获取歌曲id列表 */
        musicIdList(idList){
            this.idList = idList
            this.playList = JSON.parse(JSON.stringify(idList))
        },

        /* 点击播放 */
        currentSong(id){
            this.playSong(id)
            setTimeout(()=>{
                // 下标修改为点击播放的歌曲的下标
                if(this.orderNum==2){
                    this.playList = this.shuffleMethod(this.playList)
                }
                this.index = this.playList.findIndex(val=>val==id)
            },0)
        },
        /* 上一首 */
        lastSong(){
            if(this.playList==null)return
            this.index = this.index==0?this.playList.length-1:this.index-1
            this.playSong(this.playList[this.index])
        },
        /* 下一首 */
        nextSong(){
            if(this.playList==null)return
            this.index = this.index==this.playList.length-1?0:this.index+1
            this.playSong(this.playList[this.index])
        },
        // 获取歌曲url和歌词
        playSong(id){
            this.$bus.$emit('music',id)
        },
        elementMe(){
            this.zsqRef = this.$refs.zsqRef;
            let canvas = document.createElement("canvas");
            this.measureText = canvas.getContext('2d');
            this.measureText.font = "15px Arial"
        },
        /* 恢复歌词出厂 */
        lyricClear(){
            this.currentTimeList = []
            this.currentContentList = []
            this.map.clear()
        }
    },
    created(){
        this.$bus.$on('musicIdList',this.musicIdList)
        this.$bus.$on('currentSong',this.currentSong)
        this.$bus.$on('lastSong',this.lastSong)
        this.$bus.$on('nextSong',this.nextSong)
        this.$bus.$on('obtainLyric',this.obtainLyric)
        this.$bus.$on('lyricClear',this.lyricClear)
        this.$parent.$refs.audio.addEventListener('timeupdate',this.timeUpdated)
    },
    mounted() {
        this.elementMe()
    },
    beforeDestroy(){
        removeEventListener('timeupdate',this.timeUpdated)
    }
}
</script>
<style scoped>
.whole{
    max-width: 800px;
    height: calc(100vh);
    min-height: 300px;
    margin: 0 auto;
}
div{
    width: 100%;
    overflow: hidden;
}
.lyric{
    width: 400px;
    margin: 0 auto;
}
.zsq{
    font-family: Arial;
    font-size: 15px;
    /* width: 400px; */
    height: 150px;
    overflow: auto;
    background-color: antiquewhite;
    /* margin: 0 auto; */
    }
.zsq::-webkit-scrollbar{
    /* 隐藏滚动条 */
    display: none;
}
p{
    text-align: center;
    min-height: 30px;
    line-height: 30px;
}
.red{
    color: rgb(224, 16, 16);
}
</style>