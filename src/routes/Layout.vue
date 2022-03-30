<template>
    <div>
        <div class="loyoutClass">
            <Nav />
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
    </div>
</template>
<script>
import Nav from '../components/Nav.vue'
export default {
    name:'Layou',
    components:{
        Nav
    }
}
</script>
<style scoped>
.loyoutClass{
    max-width: 900px;
    margin: 0 auto;
    background-color: antiquewhite;
}
</style>