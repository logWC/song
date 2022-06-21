<template>
    <div class="rootDiv">
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
.rootDiv{
    margin: 10px auto;
    min-height: calc(88vh);
}
</style>