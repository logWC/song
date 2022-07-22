<template>
    <span @click="qr">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-erweima"></use>
        </svg>
    </span>
</template>
<script>
export default {
    name:'loginQr',
    props:{
        qr:Function
    }
}
</script>
<style scoped>
    span{
        font-size: 40px;
        margin-left: -2px;
        clip-path: polygon(0 0,100% 100%,0 100%);
    }

</style>