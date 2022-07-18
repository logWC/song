import axios from 'axios'

const myInterceptors = axios.interceptors.request.use(function (config){
    console.log(config.url)
    return config
}, function(error){
    console.log('出错了')
    return Promise.reject(error)
})

function time(){
    return Math.random()
}
export default {
    logon(phone,password,captcha){
        return axios.get(`/api/login/cellphone?phone=${phone}&password=${password}${captcha?'&'+captcha+'&':'&'}time=${time()}`)
    },
    // 获取验证码
    getCaptcha(phone){
        return axios.post(`/api/captcha/sent`,{
            phone
        })
    },
    // 验证验证码
    captchaVerify(phone,captcha){
        return axios.get(`/api/captcha/verify?phone=${phone}&captcha=${captcha}`)
    },
    // 二维码登录：获取key
    qrKey(){
        return axios.post(`/api/login/qr/key`)
    },
    // 二维码登录：获取二维码
    qrCreate(key){
        return axios.post(`/api/login/qr/create`,{
            key:key,
            qrimg:true,
            time:time()
        })
    },
    // 二维码登录，检测扫码状态
    qrCheck(key){
        return axios({url:`/api/login/qr/check?key=${key}&time=${time()}`})
    },
    // 登录状态
    loginStatus(){
        return axios.get(`/api/login/status?time=${time()}`)
    },
    // 刷新登录状态
    loginRefresh(){
        return axios.get(`/api/login/refresh`)
    },
    // 退出登录
    logout(){
        return axios.get(`/api/logout`)
    },
    // 喜欢列表
    likeList(id){
        axios.interceptors.request.eject(myInterceptors)
        return axios.get(`/api/likelist?uid=${id}&time=${time()}`)
    },
    // 喜欢
    like(id,boole){
        return axios.get(`/api/like?id=${id}&like=${boole}&time=${time()}`)
    },
    // 推荐歌单
    recommend(){
        return axios.get(`/api/recommend/resource?time=${time()}`)
    },
    // 歌单详情
    songListDetails(id){
        return axios.get('/api/playlist/detail',{
            params:{
                id
            }
        })
    },
    // 向歌单添加歌曲
    addSongdelSong(change,pid,id){
        return axios.get(`/api/playlist/tracks?op=${change}&pid=${pid}&tracks=${id}`)
    },
    // 推荐音乐（首）
    recommendNewMusic(){
        return axios.get(`/api/personalized/newsong?time=${time()}`)
    },
    // 专辑
    album(id){
        return axios.get('/api/album',{
            params:{
                id
            }
        })
    },
    // 音乐,返回promise类型的url
    song(id){
        return axios.get('/api/song/url',{
            params:{
                id
            }
        })
    },
    // 歌曲详情
    songDetail(id){
        return axios.get(`/api/song/detail?ids=${id}`)
    },
    // 歌词
    lyric(id){
        return axios.get('/api/lyric',{
            params:{
                id
            }
        })
    },
    // 验证歌曲url能否播放
    checkMusic(id){
        return axios.get('/api/check/music',{
            params:{id}
        })
    },
    // 搜索
    search(keywords,type=1){
        return axios.get('/api/search',{
            params:{
                keywords,
                type
            }
        })
    },
    // 搜索建议
    searchSuggest(keywords){
        return axios.get('/api/search/suggest',{
            params:{
                keywords
            }
        })
    },
    // 并发请求
    all(obj1,obj2){
        return axios.all([obj1,obj2])
    },
    // 扩散请求
    spread(){
        return axios.spread()
    }
}