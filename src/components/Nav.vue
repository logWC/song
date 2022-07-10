<template>
    <div class="root">
        <router-link active-class="active" to="/layout/home">主页</router-link>
        <router-link active-class="active" to="/layout/topic">榜单</router-link>
        <router-link active-class="active" to="/layout/mine">我的</router-link>
        <router-link active-class="active" to="/layout/search">搜索</router-link>
    </div>
</template>
<script>
export default {
    name:"Nav"
}
</script>
<style scoped>
.root{
    display: flex;
}
a{
    flex-grow: 1;
    color: rgb(78, 106, 131);
    text-align: center;
    line-height: 30px;
    background-color: rgb(78, 106, 131);
    transition: all 0.1s;
}
a:active{
    color: rgb(78, 106, 131);;
}
.active{
    background-color: rgb(222, 232, 240);
    color: black;
}
</style>