<template>
    <div>
        <div>
            <div>
                <h3>热门推荐</h3>
            </div>
            <div class="zsq">
                <!-- `/tjgdxq?id=${item.id}&title=${item.name}` -->
                <router-link tag="div" v-for="item in recommendList" :to="{
                    path:'/tjgdxq',
                    query:{
                        'id':item.id,
                        'title':item.name
                    }
                }" :key="item.id">
                    <img :src="item.picUrl" alt="加载出错">
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
        .catch(error => alert(error))
    },
}
</script>
<style scoped>
h3{
    margin: 15px;
}
.zsq{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    text-align: justify;
}
.zsq > div{
    margin: 3px;
}
.zsq img{
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid black;
    vertical-align: buttom;
}
.zsq span{
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