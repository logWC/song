import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const profiles = {
    namespaced:true,
    state:()=>({
        profile:null,
        likeDataList:null,
        likeIdList:null
    }),
    getters:{},
    actions:{
        /* 用户信息及喜欢列表 */
        userData({commit,dispatch},profile){
            commit('oneState',{key:'profile',val:profile})
            dispatch('obtainLikeList',profile.userId)
        },
        /* 获用户喜欢歌曲 */
        async obtainLikeList({state,commit}){
            // 获取喜欢列表
            let likeIdList = await this.$api.likeList(state.profile.userId)
            .then(({data}) => data.ids)
            // 存idList
            commit('oneState',{key:'likeIdList',val:likeIdList})
            // 获取喜欢歌曲列表详情
            let likeDataList = await this.$api.songDetail(likeIdList)
            .then(con=>con.data.songs)
            commit('oneState',{key:'likeDataList',val:likeDataList})
        },
        /* 清空用户数据 */
        clearDate({commit},arr){
            arr.forEach(key=>commit('clearDate',key))
        }
    },
    mutations:{
        oneState(state,obj){
            state[obj.key] = obj.val
        },
        /* 清空用户数据 */
        clearDate(state,key){
            state[key] = null
        }
    }
}

let canvas = document.createElement("canvas");
let measureText = canvas.getContext('2d');
measureText.font = "15px Arial"

const song = {
    namespaced:true,
    state:()=>({
        id:null,
        src:null,
        url:require('@/assets/logo.png'),
        idList:[],
        playList:[],
        idIndex:0,
        currentTimeList:[],
        currentContentList:[],
        extrasHeight:0,
        map:new Map(),
        orderNum:0,
        orderArr:['正在单曲循环','正在顺序播放','正在随机播放']
    }),
    getters:{},
    actions:{
        /* 点击播放列表，随机下会改动playList、idIndex */
        clickPlayMe({state,dispatch,commit},id){
            dispatch('play',id)
            state.orderNum==2&&dispatch('playListMe',[].concat(state.playList))
            commit('oneState',{key:'idIndex',val:state.playList.findIndex(val=>val==id)})
        },
        /* 歌曲信息赋值 */
        play({dispatch,commit},id){
            commit('clearAudio')
            /* id赋值 */
            commit('oneState',{key:'id',val:id})
            /* 获取歌曲src */
            this.$api.song(id)
            .then(({data})=>{
                if(data.code==200){
                    let src = data.data[0].url
                    if(src){
                        /* 获取图片url */
                        this.$api.songDetail(id)
                        .then(({data})=>{
                            /* 图片赋值 */
                            commit('oneState',{key:'url',val:data.songs[0].al.picUrl})
                            /* 歌词赋值 */
                            dispatch('lyricMe',id)
                            /* 音源赋值 */
                            commit('oneState',{key:'src',val:src})
                        })
                    }else{
                        alert('歌曲没找到播放源，可能是没有版权')
                    }
                }else if(data.code==-462){
                    alert('请登录播放')
                }
            })
            .catch(error => {
                alert('出错了，好像断网了呀！')
            })
        },
        /* 歌词数组赋值 */
        lyricMe({state,commit},id){
            this.$api.lyric(id)
            .then(({data})=>{
                let lyric = data.lrc.lyric.split('\n');
                let reg = /\[\d*:\d*(\.|:)\d*/g;
                let currentTimeList = []
                let currentContentList = []
                let map = new Map()
                let width,i;
                lyric.forEach((val,index)=>{
                    // 转换时间为秒，并以键值对显示 时间：歌词
                    let timeReg = val.match(reg)
                    if (timeReg){
                        let content = val.replace(timeReg[0],"").slice(1)
                        let min = parseFloat(timeReg[0].match(/\[\d*/g)[0].slice(1))
                        let sec = parseFloat(timeReg[0].match(/\d*\.\d/g)[0])
                        let time = min*60 + sec
                        
                        currentTimeList.push(time)
                        currentContentList.push(content)
                        map.set(index,(index*30)+state.extrasHeight)
                        
                        width = measureText.measureText(content).width
                        if(width>=400){
                            i = Math.floor(width/400)
                            commit('oneState',{key:'extrasHeight',val:(30*i)+state.extrasHeight})
                        }
                    }
                })
                /* 优化最后一句台词 */
                currentTimeList.push(999999)
                /* 歌词赋值 */
                commit('oneState',{key:'currentTimeList',val:currentTimeList})
                commit('oneState',{key:'currentContentList',val:currentContentList})
                commit('oneState',{key:'map',val:map})
            })
        },
        /* 修改播放顺序 */
        orderNumMe({state,dispatch,commit}){
            commit('oneState',{key:'orderNum',val:state.orderNum!=2?state.orderNum+1:0})
            if(!state.playList)return
            state.orderNum==2
            ?dispatch('playListMe',[].concat(state.playList))
            :commit('oneState',{key:'playList',val:[].concat(state.idList)})
            commit('oneState',{key:'idIndex',val:state.playList.findIndex(id=>id==state.id)})
        },
        /* 上一首 */
        lastMe({state,dispatch,commit}){
            if(state.playList.length==0)return
            commit('oneState',{
                key:'idIndex',
                val:state.idIndex==0?state.playList.length-1:state.idIndex-1
            })
            dispatch('play',state.playList[state.idIndex])
        },
        /* 下一首 */
        nextMe({state,dispatch,commit}){
            if(state.playList.length==0)return
            commit('oneState',{
                key:'idIndex',
                val:state.idIndex!=state.playList.length-1?state.idIndex+1:0
            })
            dispatch('play',state.playList[state.idIndex])
        },
        /* 使用shuffle算法进行随机排序 */
        playListMe({commit},arr){
            let i = arr.length
            for(i;i>0;i--){
                let ran = Math.floor(Math.random()*i)
                arr.push(arr.splice(ran,1)[0])
            }
            commit('oneState',{key:'playList',val:arr})
        }
    },
    mutations:{
        /* ids赋值 */
        idListMe(state,idList){
            state.idList = [].concat(idList)
            state.playList = [].concat(idList)
        },
        /* 单个赋值 */
        oneState(state,obj){
            state[obj.key] = obj.val
        },
        /* 清空数据 */
        clearAudio(state,boolean=true){
            if(boolean){
                state.id=0
                state.src=null
                state.url=require('@/assets/logo.png')
                if(boolean=='clearAll'){
                    state.idList = []
                    state.playList = []
                    state.orderNum = 0
                }
            }
            state.currentTimeList=[],
            state.currentContentList=[],
            state.map.clear()
            state.extrasHeight=0
        }
    }
}



export default new Vuex.Store({
    modules: {
        profiles,
        song
    },
})
