<template>
    <div>
        <Nav />
        <keep-alive>
            <router-view />
        </keep-alive>
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