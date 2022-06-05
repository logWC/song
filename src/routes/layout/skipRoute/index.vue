<template>
    <div>
        正在跳转到登录页
    </div>
</template>
<script>
export default {
    name:'skipRoute',
    beforeRouteEnter (to, from, next) {
        // ...
        if(from.path=='/layout/mine'){
            next(vm => {
                let instance = vm.$vnode.parent.componentInstance
                instance.cache = {}
                instance.keys = []
                vm.$router.replace('/')
            })
        }
    }
}
</script>