<template>
    <div v-cloak>
        <h3>
            文档最后修改于{{lastTime[2]}}年{{lastTime[0]}}月{{lastTime[1]}}日
        </h3>
    </div>
</template>
<script>
export default {
    name:'headR',
    data() {
        return {
            lastTime:document.lastModified.replace(/\ .*/,'').split('/')
        }
    }
}
</script>
<style scoped>
    div{
        background-color: rgba(128, 128, 128, 0.1);
        padding: 13px 9px;
    }
</style>