<template>
    <div>
        <div>
            <!-- 搜索框 -->
            <div class="search">
                <div>
                    <input ref="inpu" type="text" @blur="blur" @click.stop @focus="focus" @keyup.stop="throttle(searchContent)" @keyup.enter="clickSearch(searchContent)" v-model.trim="searchContent" />
                    <button @click="clickSearch(searchContent)">搜索</button>
                </div>
                <ul v-show="proposalBoole" @mouseleave="mouseLeave" @mouseenter="mouseEnter" class="proposal">
                    <!-- 搜索建议 -->
                    <li @click.prevent="clickSearch(item.name)" v-for="item in proposalArr" :key="item.id">
                        {{item.name}}
                    </li>
                </ul>
            </div>
            <!-- 历史记录 -->
            <div class="history" v-if="!searchContent || proposalArr==[]">
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
        <SongLi :songArr="songArr" />
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
            i:null,
            historyList:[],
            songArr:[],
            hideBoolean:true,
            hideNum:false
        }
    },
    methods: {
        blur(){
            this.proposalBoole=!this.hideNum
        },
        focus(){
            this.proposalBoole = true
            this.hideNum = true
        },
        mouseEnter(){
            this.hideNum = false
        },
        mouseLeave(){
            this.hideNum = true
        },
        /* 获取搜索结果*/
        clickSearch(content){
            console.log(1)
            // 清空搜索结果
            this.songArr = []
            // 点击历史记录触发的搜索事件，搜索框需要添加text
            this.searchContent = content
            // 进行历史存储
            content && this.historyListLRU(content)
            // 发送获取请求
            this.$api.search(content)
            .then(({data}) => {
                this.songArr=data.result.songs
                this.throttle(content,true)
            })
            .catch(error => alert('搜索出错了,'+error))
            // 隐藏搜索建议
            this.proposalBoole = false
        },
        /* 使用防抖获取搜索建议 */
        throttle(content,boo=false){
            console.log(2)
            this.proposalBoole = boo?false:true
            if(this.i)clearTimeout(this.i)
            this.i = setTimeout(
                ()=>{
                    if(!content){
                        this.proposalList=[];
                        this.proposalBoole=false;
                        return
                    }
                    // 获取搜索建议
                    this.$api.searchSuggest(content)
                    .then(({data}) => this.proposalList = data.result.songs)
                    .catch(error=>this.proposalList=[])
                },100)
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
    computed:{
        proposalArr(){
            return this.searchContent?this.proposalList:[]
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
    margin: 5% 13px 2%;
    position: relative;
}
.search > div{
    display: flex;
    height: 40px;
    border-radius: 3px;
    overflow: hidden;
}
.search input{
    width: 78%;
    padding: 0 10px;
    background-color: rgb(152, 169, 184);
}
.search button{
    flex: auto;
    padding: 0;
    border: none;
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
    z-index: 1;
}
.proposal li{
    border-bottom: 1px solid #c2c0c0;
    padding: 10px;
}
.proposal > li:hover{
    background-color: aliceblue;
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
</style>