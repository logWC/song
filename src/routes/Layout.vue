<template>
    <div class="loyoutClass">
        <Nav />
        <keep-alive include="Home">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
import Nav from '../components/Nav.vue'
export default {
    name:'Layout',
    components:{
        Nav
    }
}
</script>
<style scoped>
.loyoutClass{
    max-width: 900px;
    min-height: 900px;
    margin: 0 auto;
    background-color: rgb(222, 232, 240);
}
</style>