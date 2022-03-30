import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
    profile:null,
    likeDataList:[]
}
const getters = {}
const actions = {
    userData({commit,dispatch},profile){
        /* 用户信息及喜欢列表 */
        commit('userData',profile)
        dispatch('obtainLikeList',profile.userId)
    },
    async obtainLikeList({commit},userId){
        /* 获用户喜欢歌曲 */
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
    clearDate({commit},arr){
        /* 清空state[...arr] */
        console.log(arr)
        commit('clearDate',arr)
    }
}
const mutations = {
    userData(state,obj){
        /* 对象：用户信息，id，name，img等赋值 */
        state.profile = obj
    },
    likeDataList(state,arrObj){
        /* 数组对象：喜欢歌曲name、picUrl赋值 */
        state.likeDataList = arrObj
    },
    clearDate(state,arr){
        arr.forEach(val => state[val] = null)
    }
}
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})