<template>
    <div>
        <ul @click.once="$idListMe(idList)" v-if="likeList.length">
            <li @click="$play(item.id)" v-for="item in likeList" :key="item.id">
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
        idJoin(){
            this.idList = this.likeList.map(val=>val.id)
        }
    },
    computed:{
        ...mapState({
            likeList:state=>state.likeDataList
        })
    },
    created() {
        this.idJoin()
    },
}
</script>
<style scoped>
</style>