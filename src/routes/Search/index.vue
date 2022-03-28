<template>
    <div>
        <div class="heads">
            <!-- 搜索框及搜索建议 -->
            <div>
                <input ref="inpu" type="text" @keyup="throttle(searchContent)" @keyup.enter="clickSearch(searchContent)" v-model="searchContent" />
                <button @click="clickSearch(searchContent)">搜索</button>
            </div>
            <div class="history" v-if="!searchContent || proposalList==[]">
                <!-- 历史记录 -->
                <span>历史</span>
                <div>
                    <div>
                        <span @click="clickHistory(name)" v-for="name in historyList" :key="name">
                            {{name}}
                        </span>
                    </div>
                </div>
            </div>
            <ul>
                <!-- 搜索建议 -->
                <li @click="clickSearch(item.name)" v-for="item in proposalList" :key="item.id">
                    {{item.name}}
                </li>
            </ul>
        </div>
        <!-- 单曲 -->
        <div class="bodys">
            <p>单曲</p>
            <ul v-if="searchList.length && searchContent" @click.once="idListMe">
                <li v-for="(item,index) in searchList" @click="play(item.id,index)" :key="item.id">
                    <p> {{item.name}} </p>
                    <span> {{item.artists | songName}} - {{item.album.name}} </span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name:'Search',
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
            /* 获取搜索结果*/
            this.searchList = []
            content = content.trim()
            if(!content)return
            this.historyListLRU(content)
            // 停止获取建议
            this.proposalBoole = false
            this.$api.search(content)
            .then(({data}) => {
                this.searchList = data.result.songs
                this.idJoin()
                this.proposalList = []
                })
            .catch(error => alert("出错啦",error))
        },
        idJoin(){
            this.idList = []
            this.searchList.forEach(
                val => this.idList.push(val.id)
            )
        },
        idListMe(){
            this.$bus.$emit('musicIdList',this.idList)
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
                }
            })
            .catch(error=>console.log("出错了",error))
        },
        play(id,index){
            this.$bus.$emit('currentSong',id,index)
        },

        clickHistory(name){
            this.searchContent = name
            this.clickSearch(name)
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
            this.setCookie("songHistoryList",this.historyList,7)
        },
        setCookie(name,data,time){
            /* 存储进cookie*/
            let h = `${name}=${JSON.stringify(data)}`
            let expires = new Date()
            expires.setTime(expires.getTime()+time*7*24*60*60*1000)
            expires = "expires=" + expires.toGMTString()
            document.cookie=`${h};${expires}`
        },
        getCookie(name){
            /* 获取cookie数据 */
            name = name + "="
            let coo = document.cookie
            let c = coo.split(";")
            for(let i=0;i<c.length;i++){
                let val = c[i].trim()
                if(val.indexOf(name) == 0){
                    return val.replace(name,"")
                }
            }
            return ""
        }
    },
    filters:{
        songName(val){
            // 对单曲的各作者间使用 / 分割
            return val.reduce(
                (total,value) => {
                    return total == "" ?  value.name : total + "/" + value.name
                },"")
        }
    },
    created() {
        if(this.getCookie('songHistoryList')){
            this.historyList = JSON.parse(this.getCookie('songHistoryList'))
        }
    },
}
</script>
<style scoped>
.heads{
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;
    background: rgb(30, 255, 0);
}
input{
    box-sizing: border-box;
    width: 80%;
    height: 30px;
    margin: 1.5%;
    padding: 0 3px;
    outline: none;
    border: 1px solid #0000005d;
}
button{
    width: 15%;
    height: 30px;
    padding: 0;
    border: none;
    vertical-align: middle;
    border: 1px solid #00000080;
}
.history{
    box-sizing: border-box;
    background-color: #c2c0c0;
    height: 30px;
    overflow: hidden;
}
.history > span{
    vertical-align: text-top;
    display: inline-block;
    width: 15%;
    height: 100px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    padding-top: 8px;
    background-color: aqua;
}
.history > div{
    vertical-align: top;
    display: inline-block;
    width: 85%;
    background-color: cadetblue;
}
.history > div > div{
    white-space: nowrap;
    overflow-x: scroll;
    padding-bottom: 20px;
    background-color: burlywood;
}
.history > div > div > span{
    vertical-align: top;
    display: inline-block;
    font-size: 12px;
    border-radius: 5px;
    padding: 8px 2px 0 8px;
    margin: 0 5px;
    cursor: default;
}
.bodys{
    background-color: antiquewhite;
}
ul{
    margin: 10px;
}
li{
    border-bottom: 1px solid #c2c0c0;
    padding: 10px;
}
p~span{
    font-size: 10px;
}
</style>