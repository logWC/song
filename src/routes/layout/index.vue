<template>
    <div class="rootDiv">
        <Nav />
        <keep-alive>
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
    min-height: calc(88vh);
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    overflow: hidden;
    background-color: rgb(222, 232, 240);
    box-shadow: 1px 3px 3px rgba(0, 0, 0, 0.212);
}
</style>