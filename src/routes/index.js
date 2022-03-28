import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
export default new VueRouter({
    mode:'hash',
    linkActiveClass:'active',
    routes: [
        {
            // 登录页
            path:'/',
            name:'Logon',
            component:()=>import('./Logon.vue')
        },
        {
            path:'/layout',
            name:'Layout',
            component:()=>import('./Layout.vue'),
            children:[
                {
                    path:'home',
                    name:'Home',
                    component:()=>import('./Home/index.vue')
                },
                {
                    path:'topic',
                    name:'Topic',
                    component:()=>import('./Topic/index.vue')
                },
                {
                    path:'mine',
                    name:'Mine',
                    component:()=>import('./Mine/index.vue'),
                },
                {
                    path:'search',
                    name:'Search',
                    component:()=>import('./Search/index.vue')
                }
            ]
        },
        {
            // 歌单的歌曲列表
            path:'/tjgdxq',
            name:'recommendSongSheetDetails',
            component:()=>import('./Home/recommendSongSheetDetails.vue')
        },
        {
            // like列表
            path:'/likes',
            name:'likes',
            component:()=>import('./Mine/likes.vue')
        }
    ]
})