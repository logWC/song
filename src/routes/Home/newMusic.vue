<template>
    <div>
        <div v-if="recommendNewMusicList.length">
            <h3>新音乐</h3>
            <ul class="recommendNewMusic" @click.once="idListMe">
                <li @click="play(item.id,index)" v-for="(item,index) in recommendNewMusicList" :key="item.id">
                    <img :src="item.picUrl" alt="item.name">
                    <span>{{item.name}}</span>
                    <span> {{item.song.artists[0].name}} </span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name:'newMusic',
    data() {
        return {
            recommendNewMusicList:[],
            idList:[],
        }
    },
    methods: {
        play(id,index){
            this.$bus.$emit('currentSong',id,index)
        },
        obtainRecommendNewMusicList(){
            this.$api.recommendNewMusic()
            .then(
                ({data}) => {
                    this.recommendNewMusicList = data.result
                    this.idJoin()
            }
            )
            .catch(error => console.log(error))
        },
        idJoin(){
            this.idList = []
            this.recommendNewMusicList.forEach(
                val => this.idList.push(val.id)
            )
        },
        idListMe(){
            this.$bus.$emit('musicIdList',this.idList)
        }
    },
    created() {
        this.obtainRecommendNewMusicList()
    },
}
</script>
<style scoped>
h3{margin: 20px 15px;}
.recommendNewMusic{
    margin-left: 7px;
}
.recommendNewMusic img{
    width: 50px;
    height: 50px;
    /* 清除上下图片的缝隙 */
    vertical-align: bottom;
}
.recommendNewMusic li span{
    margin-left: 5px;
    line-height: 45px;
}
.recommendNewMusic li span:last-of-type{
    font-size: 9px;
}
</style>