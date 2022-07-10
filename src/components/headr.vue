<template>
    <div>
        <div v-cloak>
            <h3>
                最后修改：{{lastTime[2]}}-{{lastTime[0]}}-{{lastTime[1]}}
            </h3>
        </div>
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
        background-color: rgb(78, 106, 131);
        padding: 13px 9px;
    }
</style>