<template>
    <div>
        <div class="thead" v-if="profile">
            <img :src="profile.avatarUrl" alt="正在加载">
            <p> {{profile.nickname}} </p>
        </div>
        <div class="likeList" @click="likeListm" v-if="likeDataList.length!=0">
            <img :src="likeDataList[0].al.picUrl">
            <div>
                <p>我喜欢的音乐</p>
                <span> {{likeDataList.length}}首 </span>
            </div>
        </div>
        <div class="signIn">
            <button @click="logout">退出登录</button>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    name:'Mine',
    methods: {
        logout(){
            /* 清空播放器、清除vuex的个人信息、转换路由、退出登录、清空路由缓存 */
            this.$api.logout()
            .then(content=>{
                this.$store.commit('song/clearAudio','clearAll')
                this.$store.dispatch('profiles/clearDate',['profile','likeDataList','likeIdList'])
                // 通过第三方路由转向登录页可清除路由缓存
                this.$router.push('/layout/skiproute')
            })
            .catch(error=>console.log('网络出错了好像'))
        },
        likeListm(){
            /* 切换到like列表 */
            this.$router.push('/likes')
        }
    },
    computed:{
        ...mapState({
            // 个人信息
            profile:state => state.profiles.profile,
            // 喜欢的音乐
            likeDataList:state => state.profiles.likeDataList
        })
    }
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
    padding: 10px;
}
.likeList img{
    width: 60px;
    height: 60px;
}
.likeList div{
    box-sizing: border-box;
    height: 60px;
    flex-grow: 1;
    background-color: rgb(78, 106, 131);
    line-height: 20px;
    padding: 10px;
}
.likeList span{
    display: block;
    font-size: 9px;
}
.signIn{
    display: flow-root;
    border-radius: 5px;
}
.signIn button{
    box-sizing: border-box;
    float: right;
    padding: 5px 10px;
    margin: 10px;
    border-radius: 5%;
    border: 1px solid black;
    background-color: rgb(167, 194, 218);
}
</style>