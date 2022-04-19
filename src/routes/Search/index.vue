<template>
    <div>
        <div>
            <div class="search">
                <!-- 搜索框 -->
                <input ref="inpu" type="text" @keyup="throttle(searchContent)" @keyup.enter="clickSearch(searchContent)" v-model="searchContent" />
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
        <!-- 歌曲列表 -->
        <div class="bodys" v-if="searchList.length">
            <p>单曲</p>
            <ul @click.once="$idListMe(idList)">
                <li @click="$play(item.id)" v-for="item in searchList" :key="item.id">
                    <p> {{item.name}} </p>
                    <span> {{item.artists | songName}} - {{item.album.name}} </span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {songName} from '@/mixins/index.js'
export default {
    name:'Search',
    mixins:[songName],
    data() {
        return {
            searchContent:"",
            searchList:[],
            proposalList:[],
            proposalBoole:true,
            historyList:[],
            i:null,
            idList:[]
        }
    },
    methods: {
        clickSearch(content){
            this.searchContent = content
            /* 获取搜索结果*/
            this.searchList = []
            content = content.trim()
            if(!content)return
            this.throttle(content)
            this.historyListLRU(content)
            // 停止获取建议、获取歌曲列表
            this.proposalBoole = false
            this.$api.search(content)
            .then(({data}) => {
                this.searchList = data.result.songs
                this.proposalList = []
                this.idList = this.searchList.map(val => val.id)
                })
            .catch(error => console.log("出错啦",error))
        },
        throttle(content){
        // 对搜索建议进行防抖
            if(this.i)clearTimeout(this.i)
            this.i = setTimeout(
                ()=>{
                    this.clickSearchSuggest(content)
                },500)
        },
        clickSearchSuggest(suggest){
            // 获取搜索建议
            suggest = suggest.trim()
            if(!suggest){
                this.proposalList = []
                return
            }
            this.$api.searchSuggest(suggest)
            .then(({data}) => {
                if(this.proposalBoole || this.searchList==[]){
                    this.proposalList = data.result.songs
                }else{
                    this.proposalBoole = true
                    // this.proposalList = data.result.songs
                }
            })
            .catch(error=>console.log("出错了",error))
        },
        historyListLRU(content){
            /* 使用LRU算法对搜索历史进行存储 */
            this.historyList.forEach(
                (val,ind,arr)=>{
                    if(val == content)arr.splice(ind,1)[0]
                }
            )
            this.historyList.unshift(content)
            if(this.historyList.length == 11)this.historyList.pop()
            this.$setCookie("songHistoryList",this.historyList,7)
        },
        getHistoryList(){
            /* 获取历史记录 */
            var data = this.$getCookie('songHistoryList')
            if(data){
                this.historyList = JSON.parse(data)
            }
        }
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