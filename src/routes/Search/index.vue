<template>
    <div>
        <div>
            <div class="search">
                <!-- 搜索框 -->
                <input ref="inpu" type="text" @blur="proposalList=[]" @keyup="throttle(searchContent)" @keyup.enter="clickSearch(searchContent)" v-model.trim="searchContent" />
                <button @click="clickSearch(searchContent)">搜索</button>
                <ul class="proposal">
                    <!-- 搜索建议 -->
                    <li @click="clickSearch(item.name)" v-for="item in proposalList" :key="item.id">
                        {{item.name}}
                    </li>
                </ul>
            </div>
            <div class="history" v-if="!searchContent || proposalList==[]">
                <!-- 历史记录 -->
                <span>历史</span>
                <div>
                    <div>
                        <span @click="clickSearch(name)" v-for="name in historyList" :key="name">
                            {{name}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <SongLi v-if="getSearchSuccess" :songArr="songArr" />
        <h2 v-else>对不起，没搜索到你需要的内容。</h2>
    </div>
</template>
<script>
import SongLi from '@/components/SongLi.vue'
export default {
    name:'Search',
    components:{SongLi},
    data() {
        return {
            searchContent:"",
            proposalList:[],
            proposalBoole:true,
            historyList:[],
            i:null,
            songArr:[],
            getSearchSuccess:true
        }
    },
    methods: {
        /* 获取搜索结果*/
        clickSearch(content){
            // 点击历史记录触发的搜索事件，搜索框需要添加text
            this.searchContent = content 

            if(!content)return
            this.getSearchSuccess = true
            // 重置获取数组为空数组、停止获取建议、获取歌曲列表
            this.proposalList = []
            // this.proposalBoole = false
            clearInterval(this.i)
            // 进行历史存储
            this.historyListLRU(content)
            // 发送获取请求
            this.$api.search(content)
            .then(({data}) => this.songArr = data.result.songs)
            .catch(error => this.getSearchSuccess=false)
        },
        /* 使用防抖获取搜索建议 */
        throttle(content){
            this.getSearchSuccess = true
            if(this.i)clearTimeout(this.i)
            this.i = setTimeout(
                ()=>{
                    console.log('我在setTimeout里面')
                    // 获取搜索建议
                    if(!content){this.proposalList = [];return}
                    this.$api.searchSuggest(content)
                    .then(({data}) => {
                        this.proposalList = data.result.songs
                        // if(this.proposalBoole){
                        // }else{
                        //     this.proposalBoole = true
                        // }
                    })
                    .catch(error=>this.proposalList=[])
                },5000)
        },
        /* 使用LRU算法对搜索历史进行存储 */
        historyListLRU(content){
            this.historyList.forEach(
                (val,ind,arr)=>{
                    if(val == content)arr.splice(ind,1)[0]
                }
            )
            this.historyList.unshift(content)
            if(this.historyList.length == 11)this.historyList.pop()
            this.$setCookie("songHistoryList",this.historyList,7)
        },
        /* 获取历史记录 */
        getHistoryList(){
            var data = this.$getCookie('songHistoryList')
            if(data){
                this.historyList = JSON.parse(data)
            }
        }
    },
    watch:{

    },
    created() {
        this.getHistoryList()
    }
}
</script>
<style scoped>
.search{
    box-sizing: border-box;
    height: 40px;
    margin: 5% auto 2%;
    position: relative;
}
.search input{
    box-sizing: border-box;
    width: 80%;
    height: inherit;
    padding: 0 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background-color: rgb(152, 169, 184);
    /* background-color: aliceblue; */
}
.search button{
    width: 20%;
    height: inherit;
    padding: 0;
    border: none;
    vertical-align: middle;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: rgb(78, 106, 131);
}
.search button:hover{
    background-color: rgb(207, 123, 12);
}
.proposal{
    width: 100%;
    background-color: #c2c0c0;
    position: absolute;
    top: 40px;
}
.history{
    box-sizing: border-box;
    height: 30px;
    overflow: hidden;
    margin: 2% auto;
    background-color: #5d85a8;
}
.history > span{
    display: inline-block;
    width: 15%;
    height: 100px;
    vertical-align: text-top;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    padding-top: 8px;
    background-color: aliceblue;
}
.history > div{
    display: inline-block;
    width: 85%;
    vertical-align: top;
}
.history > div > div{
    white-space: nowrap;
    overflow-x: auto;
    padding-bottom: 20px;
}
.history > div > div > span{
    vertical-align: top;
    display: inline-block;
    font-size: 12px;
    border-radius: 5px;
    padding: 8px 2px 0 8px;
    margin: 0 5px;
}
.bodys{
    background-color: antiquewhite;
}
.bodys > p{
    font-weight: bold;
    outline: none;
}
bodys ul,.bodys > p{
    margin: 0 10px;
}
body li,.bodys > p{
    border-bottom: 1px solid #c2c0c0;
    padding: 10px;
}
p~span{
    font-size: 10px;
}
</style>