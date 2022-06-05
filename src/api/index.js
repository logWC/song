import axios from 'axios'
function time(){
    return new Date().getTime()
}
export default {
    // 登录http://iwenwiki.com:3000
    logon(phone,password){
        return axios.post(`/api/login/cellphone`,{
            phone,
            password,
            time:time()
        })
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
        return axios.get(`/api/likelist?uid=${id}`)
    },
    // 喜欢
    like(id,boole=true){
        return axios.get(`/api/like?id=${id}&like=${boole}`)
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
        return axios.get(`/api/personalized/newsong`)
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