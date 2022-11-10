<template>
    <div class="signIn" v-if="signIn">
        <div class="user">
            <h3>网易云登录</h3>
                <div class="switch-login">
                    <img v-if="loginBoolean==3" :src="src" alt="加载出错" />
                    <div v-else>
                        <input type="text" @focus="error=''" v-model.number="phone" placeholder="手机号" />
                        <input v-if="loginBoolean==1" type="password" @keyup.enter="logon" @focus="error=''" v-model.number="password" placeholder="密码" />
                        <div v-else style="width:80%;display:flex;align-items:center;background-color:white">
                            <input type="text" style="flex-grow:1;flex-shrink:2" @focus="error=''" v-model.number="captcha" placeholder="验证码" />
                            <button style="flex-basis:100px;height:25px;margin-right:10px;font-size:10px;border: 1px solid rgba(0, 0, 0, 0.1);background-color:inherit" @click="vcMe">获取验证码</button>
                        </div>
                    </div>
                    <span class="error"> {{error}} </span>
                    <button v-if="loginBoolean!=3" @click="verify">登录</button>
                </div>
                <div class="switch-button">
                    <login-qr v-if="loginBoolean!=3" @click.native='qr' />
                    <login-pa v-if="loginBoolean!=1" @click.native='pa(1)' str="密码登录" />
                    <login-pa v-if="loginBoolean!=2" @click.native='pa(2)' str="验证码登录" />
                </div>
            <span class="tourist" @click="$router.replace('/layout/home')">游客</span>
        </div>
        <p> 网站仅供学习使用</p>
    </div>
</template>
<script>
import loginQr from '@/components/loginQr.vue'
import LoginPa from '@/components/loginPa.vue'
export default {
  components: { loginQr, LoginPa },
    name:"Login",
    data() {
        return {
            phone:null,
            password:null,
            captcha:null,
            signIn:false,
            error:'',
            loginBoolean:3,
            loginKey:'',
            timeout:null,
            src:null,
        }
    },
    methods: {
        /* 登录 */
        logon(){
            this.$api.logon(this.phone,this.password,this.captcha)
            .then(({data}) => {
                this.$store.dispatch('profiles/userData',data.profile)
                this.$router.replace('/layout/home')
            })
            .catch(error => this.error = '密码或手机号出错')
        },
        /* 二维码登录 */
        async qr(){
            if(!this.loginKey){
                this.loginKey = await this.$api.qrKey()
                .then(content=>content.data.data.unikey)
                this.src = await this.$api.qrCreate(this.loginKey)
                .then(content=>content.data.data.qrimg)
            }
            this.loginBoolean = 3
            this.error = ''
            const loginCheck = ()=>{
                if (!this.signIn) return
                this.$api.qrCheck(this.loginKey)
                .then(({data})=>{
                    if(data.code==803){
                        this.loginStatus()
                    }
                    else if(data.code==802 || data.code==801){
                        if(this.loginBoolean == 3){
                            this.timeout = setTimeout(loginCheck,2000)
                        }
                    }
                    else if(data.code==800){
                        this.loginKey = null
                        this.loginBoolean==3&&this.qr()
                    }
                })
            }
            loginCheck()
        },
        pa(num){
            clearTimeout(this.timeout)
            this.loginBoolean = num;
            this.error = ''
        },
        loginStatus(){
            if(!this.$store.state.profiles.profile){
                this.$api.loginStatus()
                .then(({data})=>{
                    if(data.data.profile.userId !== 7943082392){
                        this.$store.dispatch('profiles/userData', data.data.profile)
                        this.$router.replace('/layout/home')
                    }else{
                        this.signIn=true
                        this.qr()
                    }
                })
                .catch(error=>{
                    this.signIn=true
                    this.qr()
                })
            }else{
                this.$router.replace('/layout/home')
            }
        },
        /* 验证手机号 */
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
                this.error = '请输入正确的手机号';
            }
        },
        /* 验证验证码 */
        verify(){
            if(this.loginBoolean==2){
                this.$api.captchaVerify(this.phone,this.captcha)
                .then(({data})=>data.code==200&&this.logon())
                .catch(error=>this.error = '验证码出错')
            }else{
                this.logon()
            }
        }
    },
    created() {
        this.loginStatus()
    },
    beforeDestroy(){
        clearTimeout(this.timeout)
        this.signIn = false;
    }
}
</script>
<style scoped>
.signIn{
    height: calc(80vh);
    margin: 2% auto;
    backdrop-filter: blur(20px);
}
.user{
    width: 50%;
    height: 340px;
    margin: 0 auto;
    border: 1px solid rgba(0, 0, 0, 0.219);
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    overflow: hidden;
}
h3{
    height: 100px;
    line-height: 100px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    background-color: #5d85a8;
}
input{
    box-sizing: border-box;
    width: 80%;
    padding: 10px;
}
.error{
    width: 100%;
    font-size: 9px;
    position: absolute;
    bottom: 31%;
    left: 10%;
    color: rgb(201, 15, 15);
}
.switch-login{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 200px;
}
.switch-login > div{
    height:40%;
    width:100%;
    display:flex;
    flex-wrap:wrap;
    align-content:space-between;
    justify-content:center;
}
.switch-login > button{
    margin-top: 6%;
    padding: 5px 30px;
    border: 1px solid rgba(0, 0, 0, 0.644);
    background-color: inherit;
}
.switch-button{
    height: 40px;
    display:flex;
    justify-content:space-between;
    align-items: center;
}
.tourist{
    position:absolute;
    top:0;
    right:0;
    font-size:13px;
    font-weight:bold;
    width:50px;
    height:50px;
    line-height: 40px;
    text-align:right;
    border-bottom-left-radius:50px;
    background:yellow
}
p{
    position: absolute;
    bottom: 1%;
    right: 2%;
    font-size: 10px;
    text-align: right;
}
</style>