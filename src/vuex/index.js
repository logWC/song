import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const profiles = {
    namespaced:true,
    state:()=>({
        profile:null,
        likeDataList:null
    }),
    getters:{},
    actions:{
        /* 用户信息及喜欢列表 */
        userData({commit,dispatch},profile){
            commit('userData',profile)
            dispatch('obtainLikeList',profile.userId)
        },
        /* 获用户喜欢歌曲 */
        async obtainLikeList({commit},userId){
            // 数组：获取所有歌曲id
            let idList = await this.$api.likeList(userId)
            .then(({data}) => data.ids)
            // 数组：异步获取所有歌曲详情
            let likeDataList = await this.$api.songDetail(idList)
            .then(con=>con.data.songs)
            // 数组：同步歌曲详情（排序）
            likeDataList = idList.map(id => likeDataList.find(val => val.id == id))
            commit('likeDataList',likeDataList)
        },
        /* 清空用户数据 */
        clearDate({commit},arr){
            arr.forEach(key=>commit('clearDate',key))
        }
    },
    mutations:{
        /* 对象：用户信息，id，name，img等赋值 */
        userData(state,obj){
            state.profile = obj
        },
        /* 数组对象：喜欢歌曲name、picUrl赋值 */
        likeDataList(state,arrObj){
            state.likeDataList = arrObj
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
        url:null,
        idList:[],
        playList:[],
        idIndex:0,
        currentTimeList:[],
        currentContentList:[],
        timeIndex:0,
        extrasHeight:0,
        map:new Map(),
        orderNum:0,
        orderArr:['正在单曲循环','正在顺序播放','正在随机播放']
    }),
    getters:{},
    actions:{
        /* 点击播放，每一次都会改动playList，每一次都会改动idIndex */
        clickPlayMe({state,dispatch,commit},id){
            dispatch('play',id)
            /* 修改idIndex及playList */
            setTimeout(()=>{
                state.orderNum==2&&dispatch('playListMe',[].concat(state.playList))
                commit('oneState',{key:'idIndex',val:state.playList.findIndex(val=>val==id)})
            },0)
        },
        /* 歌曲信息赋值 */
        play({dispatch,commit},id){
            /* id赋值 */
            commit('oneState',{key:'id',val:id})
            /* 获取歌曲src */
            this.$api.song(id)
            .then(({data})=>{
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
                    /* 清空：id、图片、音源、歌词 */
                    commit('clearAudio')
                    alert('歌曲没找到播放源，可能是没有版权')
                }
            })
        },
        /* 歌词数组赋值 */
        lyricMe({state,commit},id){
            this.$api.lyric(id)
            .then(({data})=>{
                commit('clearAudio',false);
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
                        if(width>=600){
                            i = Math.floor(width/600)
                            commit('oneState',{key:'extrasHeight',val:30*i+state.extrasHeight})
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
        /* 获取id数组 */
        idListMe({commit},idList){
            commit('idListMe',idList)
        },
        /* 修改播放顺序 */
        orderNumMe({state,dispatch,commit}){
            commit('oneState',{key:'orderNum',val:state.orderNum!=2?state.orderNum+1:0})
            if(!state.playList)return
            if(state.orderNum==2){
                dispatch('playListMe',[].concat(state.playList))
            }else{
                commit('oneState',{key:'playList',val:[].concat(state.idList)})
            }
            commit('oneState',{key:'idIndex',val:state.playList.findIndex(val=>val==state.id)})
        },
        /* 上一首 */
        lastMe({state,dispatch,commit}){
            if(state.playList==null)return
            commit('oneState',{
                key:'idIndex',
                val:state.idIndex==0?state.playList.length-1:state.idIndex-1
            })
            dispatch('play',state.playList[state.idIndex])
        },
        /* 下一首 */
        nextMe({state,dispatch,commit}){
            if(state.playList==null)return
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
        idListMe(state,idList){
            state.idList = [].concat(idList)
            state.playList = [].concat(idList)
        },
        lyricMe(state,obj){
            state.currentTimeList.push(obj.currentTime)
            state.currentContentList.push(obj.currentContent)
            state.map.set(obj.timeIndex,(obj.timeIndex*30)+state.extrasHeight)
            /* 获取可能会换行的歌词的额外高度 */
            let width = measureText.measureText(obj.currentContent).width
            if(width>=600){
                state.extrasHeight+=Math.floor(width/600)
            }
        },
        orderNumMe(state){
            state.orderNum=state.orderNum!=2?state.orderNum+1:0
        },
        oneState(state,obj){
            state[obj.key] = obj.val
        },
        clearAudio(state,boolean=true){
            if(boolean){
                state.id=0
                state.src=null
                state.url=null
                state.currentTimeList=[],
                state.currentContentList=[],
                state.map.clear()
            }
            state.timeIndex=0,
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

// window.addEventListener('beforeunload',()=>{
//     sessionStorage.setItem('state',JSON.stringify(profile.state))
// })
// if(sessionStorage.getItem('state')){
//     Object.assign(profile.state,JSON.parse(sessionStorage.getItem('state')))
//     sessionStorage.removeItem('state')
// }