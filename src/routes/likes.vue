<template>
    <div>
        <ul @click.once="idListMe" v-if="likeList.length">
            <li @click="play(item.id,index)" v-for="(item,index) in likeList" :key="item.id">
                {{item.name}}
            </li>
        </ul>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name:'likes',
    data() {
        return {
            idList:[]
        }
    },
    methods: {
        play(id,index){
            this.$bus.$emit('currentSong',id,index)
        },
        idListMe(){
            this.$bus.$emit('musicIdList',this.idList)
        },
        idJoin(){
            this.idList = []
            this.likeList.forEach(
                val => this.idList.push(val.id)
            )
        }
    },
    computed:{
        ...mapState({
            likeList:state => state.likeDataList
        })
    },
    created() {
        this.idJoin()
    },
}
</script>
<style scoped>
</style>