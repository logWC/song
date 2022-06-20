<template>
    <div>
        <div v-if="recommendList.length">
            <div>
                <h2>定制推荐</h2>
            </div>
            <div class="tbody" :class="{'last-div':(recommendNumList.length)%3!=0}">
                <div @click="clickMe(item.id,item.name,item.creator.nickname)" v-for="item in recommendNumList" :key="item.id">
                    <div>
                        <img v-lazy="item.picUrl" alt="加载出错">
                    </div>
                    <span> {{item.name}} </span>
                </div>
                <p style="flex-basis:100%;text-align:right;font-weight:700">
                    <span @click="num=!num">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="num?'#icon-xiangshang':'#icon-xiangzuo'"></use>
                        </svg>
                        {{num?'收起':'展开'}}
                    </span>
                </p>
            </div>
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
        clickMe(id,title,name){
            this.$router.push({
                path:'/tjgdxq',
                query:{
                    id,
                    title,
                    name
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
            return this.recommendList.slice(0,this.num?-1:6)
        }
    },
    created() {
        this.obtainRecommendNewMusicList()
    }
}
</script>
<style scoped>
h2{
    font-size: 1.5em;
    font-weight: bold;
    margin: 20px 0 10px;
    text-align: center;
    letter-spacing: 20px;
}
.tbody{
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 5%;
}
.tbody > div{
    flex-basis: 30%;
    text-align: center;
    margin: 10px 0;
}
img{
    display: block;
    width: 100%;
    border-radius: 10px;
}
.tbody > div > div{
    position: relative;
}
.tbody > div > div::before{
    content: '';
    position: absolute;
    left: 0;top: 0;bottom: 0;right: 0;
    border-radius: 10px;
    background: linear-gradient(45deg,transparent,rgba(255, 0, 0, 0.5));
    mask: linear-gradient(0deg,transparent,rgba(0, 0, 0, 0.5)) top left no-repeat;
    mask-size: 100% 50px;
}
.tbody > div > span{
    text-align: left;
    font-weight: bold;
    width: 100%;
    line-height: 1.5em;
    max-height: 3em;
    margin-top: 10px;
    overflow: hidden;
    display: -webkit-box;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.last-div > div:last-of-type{
    margin-right: 35%;
}
</style>