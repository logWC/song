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
    justify-content: space-between;
    border-radius: 10px;
    overflow: hidden;
}
a{
    flex-grow: 1;
    text-align: center;
    line-height: 30px;
    color: black;
    background-color: rgb(78, 106, 131);
    transition: all 0.1s;
}
.active{
    background-color: rgb(152, 169, 184);
}
</style>