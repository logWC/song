<template>
    <div>
        <button @click="delVnode">榜单</button>
    </div>
</template>
<script>
export default {
    name:'Topic',
    methods: {
        delVnode(){
            let instance = this.$vnode.parent.componentInstance
            instance.keys = []
            instance.cache = {}
        }
    },
    created() {
        console.log(this.$vnode.parent.componentInstance.keys)
    },
}
</script>
<style scoped>

</style>