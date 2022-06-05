<template>
    <div style="margin-top:10px">
        <Nav />
        <keep-alive include="Home,Mine">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
import Nav from '@/components/Nav.vue'
export default {
    name:'Layout',
    components:{
        Nav
    }
}
</script>
<style scoped>

</style>