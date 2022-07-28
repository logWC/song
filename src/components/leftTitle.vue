<template>
    <div>
        <h4 v-cloak>{{str}}</h4>
    </div>
</template>
<script>
export default {
    name:'leftTitle',
    props:{str:String}
}
</script>
<style scoped>
h4{
    font-weight:bold;
    font-size:16px;
    letter-spacing:3px;
    border-bottom:1px solid red;
    padding-bottom:3px;
}
</style>