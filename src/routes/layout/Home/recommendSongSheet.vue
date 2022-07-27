<template>
    <div style="padding:20px 5% 0;" v-if="recommendList.length">
        <div>
            <h4 style="
            font-weight:bold;
            font-size:16px;
            letter-spacing:3px;
            border-bottom:1px solid red;
            padding-bottom:3px;">定制推荐</h4>
        </div>
        <div class="tbody">
            <div class="tshow" v-for="item in recommendNumList" :key="item.id">
                <div class="show" @click="clickMe(item.id,item.name,item.creator.nickname,item.picUrl)">
                    <img v-lazy="item.picUrl" alt="加载出错">
                </div>
                <div class="title"> {{item.name}} </div>
            </div>
        </div>
        <div v-if="recommendList.length>8" style="text-align:right;font-weight:blod;">
            <span @click="num=!num">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="num?'#icon-xiangshang':'#icon-xiangzuo'"></use>
                </svg>
                {{num?'收起':'展开'}}
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name:'recommendSongSheet',
    data() {
        return {
            recommendList:[],
            num:false
        }
    },
    methods: {
        clickMe(id,title,name,src){
            this.$router.push({
                path:'/tjgdxq',
                query:{
                    id,
                    title,
                    name,
                    src
                }
            })
        },
        obtainRecommendNewMusicList(){
            // 获取推荐歌单
            this.$api.recommend()
            .then(({data}) => {
                this.recommendList = data.recommend.filter(val=>val.name!='网易云热歌集合，一键收听')
            })
            .catch(error => console.log('推荐歌单需要登录获取'))
        }
    },
    computed:{
        recommendNumList(){
            return this.recommendList.slice(0,this.num?-1:8)
        }
    },
    created() {
        this.obtainRecommendNewMusicList()
    }
}
</script>
<style scoped>
img{
    display: block;
    width: 100%;
    height: 100%;
}
.tbody{
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
}
.tshow{
    flex-basis:25%;
    margin: 10px 0;
}
.tshow > div{
    width: 140px;
    margin: 0 auto;
}
.show{
    position: relative;
}
.show::before{
    content: '';
    position: absolute;
    left: 0;top: 0;bottom: 0;right: 0;
    background: linear-gradient(45deg,transparent,rgba(255, 0, 0, 0.5));
    mask: linear-gradient(0deg,transparent,rgba(0, 0, 0, 0.5)) no-repeat;
    mask-size: 100% 50px;
    backdrop-filter: brightness(106%);
}
.title{
    padding-top: 5px;
    font-size: 15px;
    overflow: hidden;
    display: -webkit-box;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>