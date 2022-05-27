<template>
    <div>
        <div>
            <div v-if="recommendList.length">
                <h3>定制推荐</h3>
            </div>
            <div class="tbody">
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
    created() {
        // 获取推荐歌单
        this.$api.recommend()
        .then(({data}) => {this.recommendList = data.recommend})
        .catch(error => console.log('请登录'))
    }
}
</script>
<style scoped>
h3{
    margin: 15px;
}
.tbody{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    text-align: justify;
}
.tbody > div{
    margin: 3px;
}
.tbody img{
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid black;
    vertical-align: buttom;
}
.tbody span{
    width: 100px;
    line-height: 1.5em;
    max-height: 3em;
    overflow: hidden;
    display: -webkit-box;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>