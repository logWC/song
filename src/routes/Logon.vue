<template>
    <div class="signIn" v-if="signIn">
        <div class="user">
            <h3>网易云登录</h3>
            <div>
                <input type="text" v-model="phone" placeholder="手机号" />
                <input type="password" v-model="password" placeholder="密码" />
            </div>
            <button @click="logon">登录</button>
            <sub @click="tourist">游客模式</sub>
        </div>
        <p>注：游客模式部分功能会受限</p>
    </div>
</template>
<script>
export default {
    name:"Logon",
    data() {
        return {
            userData:null,
            loginData:null,
            phone:null,
            password:null,
            signIn:false,
            status:null
        }
    },
    methods: {
        statusMethod(){
            /* 验证登录状态，若为登录状态则跳到主页，否则显示登录页面 */
            this.$api.loginStatus()
            .then(content=>{
                this.loginData = content.data
                this.status = content.status
            })
            .catch(error=>{
                this.signIn = true
            })
        },
        logon(){
            /* 登录 */
            this.$api.logon(this.phone,this.password)
            .then(content => {
                this.loginData = content.data
                this.status = content.status
            })
            .catch(error => console.log(error))
        },
        tourist(){
            /* 清空vuex的数据、转换路由 */
            this.$router.replace({path:'/layout/home'})
        }
    },
    watch:{
        status(data1){
            /* 若登录成功则触发 */
            if(data1 == 200){
                this.$store.dispatch('userData',this.loginData.profile)
                this.tourist()
            }
        }
    },
    created() {
        this.statusMethod()
    },
}
</script>
<style scoped>
.signIn{
    display: flow-root;
    max-width: 800px;
    margin: 10% auto;
    border-top-right-radius: 20%;
    background-image: linear-gradient(to right bottom,rgb(247, 247, 90),#5d85a8);
}
.user{
    position: relative;
    width: 50%;
    height: 300px;
    margin: 10% auto;
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
.user div{
    margin: 7% auto;
}
.user input{
    box-sizing: border-box;
    display: block;
    width: 80%;
    margin: 2% auto;
    padding: 10px;
    background-color: aquamarine;
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