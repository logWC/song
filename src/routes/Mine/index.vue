<template>
    <div>
        <div class="thead" v-if="profile">
            <img :src="profile.avatarUrl" alt="正在加载">
            <p> {{profile.nickname}} </p>
        </div>
        <div @click="likeListm" class="likeList" v-if="likeList.length">
            <img :src="likeList[0].al.picUrl">
            <div>
                <p>我喜欢的音乐</p>
                <span> {{likeList.length}}首 </span>
            </div>
        </div>
        <button @click="logout">退出登录</button>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    name:'Mine',
    methods: {
        logout(){
            /* 退出登录 */
            this.$api.logout()
            .then(
                content=>{
                    this.$router.replace({path:'/'})
                    console.log('我退出登录了')
                }
            )
        },
        likeListm(){
            this.$router.push({
                path:'/likes'
            })
        }
    },
    computed:{
        ...mapState({
            // 个人信息
            profile:state => state.profile,
            // 喜欢的音乐
            likeList:state => state.likeDataList
        })
    },
}
</script>
<style scoped>
.thead{
    margin: 10px;
}
.thead img{
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    margin: 0 auto;
}
.thead p{
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
}
.likeList{
    display: flex;
    background: rebeccapurple;
    padding: 10px;
    border-radius: 5px;
}
.likeList img{
    width: 60px;
    height: 60px;
}
.likeList > div{
    box-sizing: border-box;
    height: 60px;
    flex-grow: 1;
    background: yellowgreen;
    line-height: 20px;
    padding: 10px;
}
.likeList > div > span{
    display: block;
    font-size: 12px;
}
</style>