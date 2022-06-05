import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
export default new VueRouter({
    mode:'hash',
    routes: [
        {
            // 登录页
            path:'/',
            name:'Login',
            component:()=>import('./Login.vue'),
            children:[]
        },
        {
            // 主页、榜单、我的、搜索
            path:'/layout',
            name:'Layout',
            component:()=>import('./layout/index.vue'),
            redirect:'/layout/home',
            children:[
                {
                    path:'home',
                    name:'Home',
                    component:()=>import('./layout/Home/index.vue')
                },
                {
                    path:'topic',
                    name:'Topic',
                    component:()=>import('./layout/Topic/index.vue')
                },
                {
                    path:'mine',
                    name:'Mine',
                    component:()=>import('./layout/Mine/index.vue'),
                },
                {
                    path:'search',
                    name:'Search',
                    component:()=>import('./layout/Search/index.vue')
                },
                {
                    path:'skiproute',
                    name:'skipRoute',
                    component:()=>import('./layout/skipRoute/index.vue')
                }
            ]
        },
        {
            // 歌单的歌曲列表
            path:'/tjgdxq',
            name:'recommendSongSheetDetails',
            component:()=>import('./recommendSongSheetDetails.vue')
        },
        {
            // like列表
            path:'/likes',
            name:'likes',
            component:()=>import('./likes.vue')
        },
        {
            // 歌词
            path:'/lyrics',
            name:'lyrics',
            component:()=>import('./lyric.vue')
        }
    ]
})