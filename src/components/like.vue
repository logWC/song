<template>
    <svg @click="likeMe" class="icon" aria-hidden="true">
        <use :xlink:href="icon"></use>
    </svg>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name:'likeIcon',
    props:{id:Number},
    data() {
        return {
            icon:'#icon-aixinD'
        }
    },
    methods:{
        likeMe(){
            if(!this.likeIdList)return
            this.$api.like(this.id,this.icon=='#icon-aixinD')
            .then(val=>{
                this.$store.dispatch('profiles/obtainLikeList');
                this.getSee()
            })
            .catch(error=>{
                error.toString().includes(500)
                ?alert('没有版权,喜欢失败')
                :alert('未知错误,喜欢失败')
            })
        },
        getSee(){
            if(this.id && this.likeIdList){
                this.icon = this.likeIdList.includes(this.id)
                ?'#icon-aixinshoucang'
                :'#icon-aixinD';
            }
        }
    },
    watch:{
        id:{
            handler(val){
                val && this.getSee();
            },
            immediate:true
        },
        likeIdList:{
            handler(val){
                val && this.getSee();
            },
            immediate:true
        }
    },
    computed:{
        ...mapState({
            likeIdList:state=>state.profiles.likeIdList
        })
    }
}
</script>
