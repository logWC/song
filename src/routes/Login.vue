<template>
    <div class="signIn" v-if="signIn">
        <div class="user">
            <h3>网易云登录</h3>
            <div v-if="loginBoolean==0">
                <div>
                    <input @keyup.enter="removeFocus" @focus="error=false" type="text" v-model.number="phone" placeholder="手机号" />
                    <input ref="password" @keyup.enter="logon" @focus="error=false" type="password" v-model.number="password" placeholder="密码" />
                    <span class="error" v-if="error">手机号或密码错误，请重新输入</span>

                    <button @click="logon">登录</button>
                </div>
                <div style="display:flex;justify-content:space-between;center;font-size:10px;padding:5px">
                    <span @click="qr">二维码登录</span>
                    <span @click="pa(2)">验证码登录</span>
                </div>
            </div>
            <div v-else-if="loginBoolean==1">
                <div>
                    <img :src="loginImg" alt="加载出错" />
                </div>
                <div style="display:flex;justify-content:space-between;center;font-size:10px;padding:5px">
                    <span @click="pa(0)">密码登录</span>
                    <span @click="pa(2)">验证码登录</span>
                </div>
            </div>
            <div v-else>
                <div>
                    <input type="text" v-model.number="phone" placeholder="手机号码" />
                    <input type="text" v-model.number="captcha" placeholder="验证码" />
                    <button @click="vcMe">获取验证码</button>
                    <button @click="verify">登录</button>
                </div>
                <div style="display:flex;justify-content:space-between;center;font-size:10px;padding:5px">
                    <span @click="qr">二维码登录</span>
                    <span @click="pa(0)">密码登录</span>
                </div>
            </div>
        </div>
        <p>网站仅供学习使用</p>
    </div>
</template>
<script>
export default {
    name:"Login",
    data() {
        return {
            phone:null,
            password:null,
            captcha:null,
            signIn:false,
            error:false,
            loginBoolean:0,
            loginKey:'',
            loginImg:null,
            timeout:null
        }
    },
    methods: {
        removeFocus(){
            this.$refs.password.focus()
        },
        logon(){
            /* 登录 */
            this.$api.logon(this.phone,this.password,this.captcha)
            .then(({data}) => {
                this.$store.dispatch('profiles/userData',data.profile)
                this.$router.replace('/layout/home')
            })
            .catch(error => {this.error = true;console.log(error)})
        },
        async qr(){
            if(!this.loginKey){
                this.loginKey = await this.$api.qrKey()
                .then(content=>content.data.data.unikey)
                this.loginImg = await this.$api.qrCreate(this.loginKey)
                .then(content=>content.data.data.qrimg)
                console.log('获取二维码')
            }
            this.loginBoolean = 1
            const loginCheck = ()=>{
                console.log('检测二维码')
                this.$api.qrCheck(this.loginKey)
                .then(({data})=>{
                    if(data.code==803){
                        this.loginStatus()
                    }
                    else if(data.code==802 || data.code==801){
                        console.log('等待跳转 || 等待扫码')
                        if(this.loginBoolean == 1){
                            clearTimeout(this.timeout)
                            this.timeout = setTimeout(loginCheck,2000)
                        }
                    }
                    else if(data.code==800){
                        console.log('二维码过期了')
                        this.loginKey = null
                        this.loginBoolean==1&&this.qr()
                    }
                })
                // .catch(error=>loginCheck())
            }
            loginCheck()
        },
        async pa(a){
            clearTimeout(this.timeout)
            this.loginBoolean = a;
        },
        loginStatus(){
            if(!this.$store.state.profiles.profile){
                this.$api.loginStatus()
                .then(({data})=>{
                    this.$store.dispatch('profiles/userData', data.data.profile)
                    this.$router.replace('/layout/home')
                })
                .catch(error=>{
                    if(error.toString().includes('400')){
                        console.log('未登录')
                    }
                    this.signIn=true
                })
            }else{
                this.$router.replace('/layout/home')
            }
        },
        vcMe(){
            //定义正则表达式
            var reg='^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-9])|(18[0-9])|166|198|199|191|(147))\\d{8}$';
            //创建正则表达式对象
            var regExp=new RegExp(reg);
            //使用test()函数验证数据是否匹配正则表达式，匹配返回true,否则返回false
            if(regExp.test(this.phone)){
                this.$api.getCaptcha(this.phone)
                .then(({data})=>{console.log(data)})
            }else{
                console.log('请输入正确的手机号')
            }
        },
        verify(){
            this.$api.captchaVerify(this.phone,this.captcha)
            .then(({data})=>data.code==200&&this.logon())
        }
    },
    created() {
        this.loginStatus()
    },
    beforeDestroy(){
        console.log('登录组件销毁了')
        clearTimeout(this.timeout)
    },
}
</script>
<style scoped>
.signIn{
    height: calc(85vh);
    margin: 2% auto;
    background-color: transparent;
    backdrop-filter: blur(20px);
    overflow: auto;
    position: relative;
}
.user{
    width: 50%;
    height: 320px;
    margin: 0 auto;
    border: 1px solid rgba(0, 0, 0, 0.219);
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    overflow: hidden;
}
.user h3{
    height: 100px;
    line-height: 100px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    background-color: #5d85a8;
}
.user > div > div:first-of-type{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 200px;
}
input{
    flex-basis: 80%;
    padding: 10px;
    background-color: rgb(205, 235, 225);
}
input:first-of-type{
    margin: 3% 0 2%;
}
input:last-of-type{
    margin-bottom: 7%;
}
.error{
    font-size: 9px;
    color: rgb(201, 15, 15);
}
button{
    /* display: block; */
    padding: 5px 30px;
    border: 1px solid rgba(0, 0, 0, 0.644);
    background-color: inherit;
}
p{
    position: absolute;
    bottom: 1%;
    right: 2%;
    font-size: 10px;
    text-align: right;
}
</style>