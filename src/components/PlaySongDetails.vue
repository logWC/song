<template>
    <div class="whole">
        <span @click="signOut">a</span>
        <div class="zsq">
            <div ref="lyricDisplay">
                <p :class="{
                    red:currentTimeList[index] < currentTime && currentTime < currentTimeList[index+1]
                }" v-for="(val,index) in currentContentList" :key="index">
                    <span>{{val}}{{playDisplay(index)}} </span>
                </p>
            </div>
        </div>
        <div class="bodys">
            <button @click="lastSong">上一首</button>
            <button>暂停</button>
            <button>播放</button>
            <button @click="nextSong">下一首</button>
        </div>
        <div>
            <b @click="changeOrder(1)" v-if="orderNum==0">单曲循环</b>
            <b @click="changeOrder(2)" v-if="orderNum==1">顺序播放</b>
            <b @click="changeOrder(0)" v-if="orderNum==2">随机播放</b>
        </div>
    </div>
</template>
<script>
export default {
    name:"PlaySongDetails",
    data() {
        return {
            currentTime:"",
            currentTimeList:[],
            currentContentList:[],
            idList:[],
            shuffleIdList:[],
            sign:0,
            orderNum:0
        }
    },
    methods: {
        signOut(){
            // 退出歌词
        },
        playDisplay(index){
            if(this.currentTimeList[index] < this.currentTime && this.currentTime < this.currentTimeList[index+1]){
                // 设置动态歌词
                this.$refs.lyricDisplay.style.top = -(index*30)+ 60 +"px"
            }
        },

        changeOrder(num){
            /* 改变播放顺序 */
            this.orderNum = num
        },

        obtainLyric(id){
            // 清空currentTimeList
            this.currentTimeList = []
            // 清空currentContentList
            this.currentContentList = []
            // 获取歌词
            this.$api.lyric(id)
            .then(content => this.filterLRC(content.data.lrc.lyric))
            .catch(error=> console.log(`获取歌词失败${error}`))
        },
        filterLRC(value){
            if (!value) return
            let lyric = value.split("\n")
            let reg = /\[\d*:\d*(\.|:)\d*/g
            lyric.forEach((val)=>{
                // 转换时间为秒，并以键值对显示 时间：歌词
                let timeReg = val.match(reg)
                if (timeReg){
                    let content = val.replace(timeReg[0],"").slice(1)
                    let min = parseFloat(timeReg[0].match(/\[\d*/g)[0].slice(1))
                    let sec = parseFloat(timeReg[0].match(/\d*\.\d/g)[0])
                    let time = min*60 + sec
                    this.timeList(time,content)
                }
            })
        },
        timeList(time,content){
            /* 获取时间与及对应歌词 */
            this.currentTimeList.push(time)
            this.currentContentList.push(content)
        },
        timeUpdated(event){
            this.currentTime = event.target.currentTime
            if(event.target.ended){
                this.nextSong(this.orderNum)
            }
        },

        musicIdList(idList){
            /* 自动获取歌曲id列表 */
            this.idList = idList
            this.shuffleIdList = []
            this.shuffleMethod()
        },
        shuffleMethod(){
            /* 使用shuffle算法进行随机排序 */
            this.shuffleIdList = JSON.parse(JSON.stringify(this.idList))
            let i = this.idList.length
            for(i;i>0;i--){
                let ran = Math.floor(Math.random()*i)
                this.shuffleIdList.push(this.shuffleIdList.splice(ran,1)[0])
            }
        },

        currentSong(id,index){
            /* 点击歌曲时播放 */
            if(this.orderNum == 2){
                if(this.shuffleIdList.length){
                    let index_1 = this.shuffleIdList.findIndex(val=>val==id)
                    this.shuffleIdList.splice(this.sign,0,this.shuffleIdList.splice(index_1,1)[0])
                }
            }else{
                this.sign = index
            }
            this.playSong(id)
        },
        lastSong(){
            /* 上一首 */
            this.sign = this.sign==0?0:this.sign-1
            if(this.orderNum == 2){
                this.playSong(this.shuffleIdList[this.sign])
            }else{
                this.playSong(this.idList[this.sign])
            }
        },
        nextSong(wc=1){
            /* 下一首 */
            if(wc){
                this.sign = this.sign==this.idList.length-1?0:this.sign+1
                if(this.orderNum == 2){
                    this.playSong(this.shuffleIdList[this.sign])
                }else{
                    this.playSong(this.idList[this.sign])
                }
            }else{
                this.playSong(this.idList[this.sign])
            }
        },
        playSong(id){
            this.$bus.$emit('music',id)
            this.obtainLyric(id)
        }
    },
    created(){
        this.$bus.$on('musicIdList',this.musicIdList)
        this.$bus.$on('currentSong',this.currentSong)
        this.$bus.$on('nextSong',this.nextSong)
        this.$parent.$refs.audio.addEventListener('timeupdate',this.timeUpdated)
    },
    beforeDestroy(){
        removeEventListener('timeupdate',this.timeUpdated)
    }
}
</script>
<style scoped>
.whole{
    width: 100%;
    height: calc(100vh);
}
div{
    width: 100%;
}
.zsq{
    height: 150px;
    overflow: auto;
}
.zsq > div{
    position: relative;
}
p{
    text-align: center;
    min-height: 30px;
    line-height: 30px;
    background-color: antiquewhite;
}
.red{
    color: rgb(199, 170, 170);
}
</style>