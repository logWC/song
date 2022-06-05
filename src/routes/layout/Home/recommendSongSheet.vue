<template>
    <div>
        <div v-if="recommendList.length">
            <div>
                <h2>定制推荐</h2>
            </div>
            <div class="tbody" :class="{'last-div':(recommendList.length)%3!=0}">
                <router-link tag="div" v-for="item in recommendList" :to="{
                    path:'/tjgdxq',
                    query:{
                        'id':item.id,
                        'title':item.name,
                        'name':item.creator.nickname
                    }
                }" :key="item.id">
                    <img v-lazy="item.picUrl" alt="加载出错">
                    <span> {{item.name}} </span>
                </router-link>
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
        }
    },
    methods: {
        obtainRecommendNewMusicList(){
            // 获取推荐歌单
            this.$api.recommend()
            .then(({data}) => {this.recommendList = data.recommend})
            .catch(error => console.log('推荐歌单需要登录获取'))
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
.tbody > div > img{
    width: 100%;
    vertical-align: buttom;
    border-radius: 10px;
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