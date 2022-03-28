<template>
    <div v-if="signIn">
        <input type="text" v-model="phone" placeholder="用户名" /> <br /><br />
        <input type="password" v-model="password" placeholder="密码" /> <br /><br />
        <button @click="logon">登录</button>
    </div>
</template>
<script>
export default {
    name:"Logon",
    data() {
        return {
            userData:null,
            loginData:null,
            phone:17329790734,
            password:'123qweQWE',
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
    },
    watch:{
        status(data1){
            /* 若登录成功则触发 */
            if(data1 == 200){
                this.$store.dispatch('userData',this.loginData.profile)
                this.$router.replace({
                    path:'/layout/home'
                })
            }
        }
    },
    created() {
        this.statusMethod()
    },
}
</script>