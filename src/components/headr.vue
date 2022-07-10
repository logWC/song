<template>
    <div>
        {{lastModified}}
    </div>
</template>
<script>
export default {
    data() {
        return {
            lastTime:document.lastModified
        }
    },
}
</script>
<style>
    div{
        text-align: center;
    }
</style>