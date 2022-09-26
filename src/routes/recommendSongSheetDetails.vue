<template>
    <el-skeleton animated :loading='loading'>
        <template slot="template">
            <div style="text-align:center;padding:15px 0px">
                <el-skeleton-item style="width:100px;height:25px" />
            </div>
            <div style="display:flex;">
                <el-skeleton-item class="image" variant='image' />
                <div style="flex-grow:1;margin:5px 25px;">
                    <el-skeleton-item />
                    <el-skeleton-item />
                    <!-- <button @click="loading = false">修改</button> -->
                </div>
            </div>
            <!-- <div>
            </div> -->
            <div>
                <div style="padding:20px 0px">
                    <el-skeleton-item style="width:100px;height:20px" />
                </div>
                <el-skeleton-item style="height:35px" v-for="item in 20" :key="item" variant='h1' />
            </div>
        </template>
        <template>
            <div>
                <h3>歌单详情</h3>
                <div class="head-div">
                    <img class="image" :src="$route.query.src" alt="加载出错" />
                    <div>
                        <h4>{{$route.query.title}}</h4>
                        <p>歌单创作者: {{$route.query.name}}</p>
                    </div>
                </div>
                <SongLi :songArr='songArr' />
            </div>
        </template>
    </el-skeleton>
</template>
<script>
import SongLi from '@/components/SongLi.vue'
export default {
    name:"recommendSongSheetDetails",
    components:{SongLi},
    data() {
        return {
            songArr:[],
            loading:true
        }
    },
    methods: {
        getSongIdList(){
            // get playlist of all song
            this.$api.playlistTrackAll(this.$route.query.id)
            .then(({data})=>{
                if(data.songs){
                    this.songArr = data.songs
                    this.loading = false
                }else{
                    console.log('歌曲太多了吧',data)
                }
            })
            .catch(error=>console.log(error))
        },
    },
    created() {
        this.getSongIdList()
    },
    mounted(){
        setTimeout(() => {
            document.documentElement.scrollTop=0
        }, 0);
    }
}
</script>
<style scoped>
h3{
    text-align: center;
    padding: 15px 0;
}
.image{
    width: 100px;
    height: 100px;
}
.head-div{
    display: flex;
    height: 100px;
    background-color: green;
}
.head-div > div{
    flex-grow: 1;
}
.head-div > div h4{
    color: white;
    line-height: 1.5em;
    max-height: 3em;
    -webkit-line-clamp: 2;
}
.head-div > div *{
    margin: 10px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
}
.head-div > div p{
    -webkit-line-clamp: 1;
}
</style>