<template>
    <div>
        <router-link to="/layout/home">主页</router-link>
        <router-link to="/layout/topic">榜单</router-link>
        <router-link to="/layout/mine">我的</router-link>
        <router-link to="/layout/search">搜索</router-link>
    </div>
</template>
<script>
export default {
    name:"Nav"
}
</script>
<style scoped>
div{
    display: flex;
    justify-content: space-between;
    background-color: aquamarine;
}
a{
    flex-grow: 1;
    text-align: center;
    line-height: 30px;
}
.red{
    background-color: red;
}
</style>