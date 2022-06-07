<template>
    <div style="background-color:transparent">
        <div class="signIn" v-if="signIn">
            <div class="user">
                <h3>网易云登录</h3>
                <div>
                    <input @keyup.enter="removeFocus" @focus="error=false" type="text" v-model="phone" placeholder="手机号" />
                    <input ref="password" @keyup.enter="logon" @focus="error=false" type="password" v-model="password" placeholder="密码" />
                    <span class="error" v-if="error">手机号或密码错误，请重新输入</span>
                </div>
                <button @click="logon">登录</button>
                <!-- <sub @click="tourist">游客模式</sub>  禁止了游客播放歌曲 -->
            </div>
            <p>网站仅供学习使用</p>
            <!-- <p>注：游客模式部分功能会受限</p> -->
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    name:"Login",
    data() {
        return {
            phone:null,
            password:null,
            signIn:false,
            error:false
        }
    },
    methods: {
        removeFocus(){
            this.$refs.password.focus()
        },
        logon(){
            /* 登录 */
            this.$api.logon(this.phone,this.password)
            .then(({data}) => {
                this.$store.dispatch('profiles/userData',data.profile)
                this.$router.replace('/layout/home')
            })
            .catch(error => this.error = true)
        },
    },
    created() {
        if(!this.$store.state.profiles.profile){
            this.$api.loginStatus()
            .then(({data})=>{
                this.$store.dispatch('profiles/userData', data.data.profile)
                this.$router.replace('/layout/home')
            })
            .catch(error=>{
                if(error.toString().indexOf('400')!=-1){
                    console.log('未登录')
                }
                this.signIn=true
            })
        }else{
            this.$router.replace('/layout/home')
        }
    },
    destroyed() {
        console.log('登录组件销毁了')
    },
}
</script>
<style scoped>
.signIn{
    max-width: 800px;
    margin: 20% auto;
    border: 1px solid rgb(173, 149, 149);
    border-top-right-radius: 20%;
    background-image: linear-gradient(to right bottom,rgb(247, 247, 90),rgb(153, 207, 153),yellowgreen,#5d85a8);
}
.user{
    position: relative;
    width: 50%;
    height: 300px;
    margin: 15% auto;
    background-color: antiquewhite;
}
.user h3{
    height: 30%;
    line-height: 500%;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    background-color: #5d85a8;
}
.user > div{
    width: 80%;
    margin: 7% auto;
}
.user > div > input{
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 10px;
    background-color: aquamarine;
}
.user > div > input:first-of-type{
    margin-bottom: 2%;
}
.error{
    font-size: 9px;
    color: rgb(201, 15, 15);
}
.user button{
    display: block;
    padding: 5px 30px;
    margin: 0 auto;
    border: 1px solid rgba(0, 0, 0, 0.479);
    background-color: inherit;
}
.user sub{
    position: absolute;
    padding: 5px 10px;
    vertical-align: 0%;
    right: 0;
    bottom: 0;
}
p{
    font-size: 9px;
    text-align: right;
    padding: 10px;
}
</style>