<template>
    <div class="body-div">
        <ul @click.once="$idListMe(songObj.idList)">
            <li @click="$play(item.id)" v-for="item in songObj.tracks" :key="item.id">
                <div>
                    <span>{{item.name}}</span>
                    <span v-if="item.ar" style="color:red"> {{item.ar | songName}} </span>
                    <span v-if="item.artists" style="color:red"> {{item.artists | songName}} - {{item.album.name}} </span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import {songName} from '@/mixins/index.js'
export default {
    name:'SongLi',
    mixins:[songName],
    props:{songObj:Object},
    
}
</script>
<style scoped>
.body-div{
    margin-top: 20px;
}
ul{
    margin: 30px 15px 0px;
}
li{
    padding: 5px;
}
li span:first-of-type{
    display: block;
}
li span:last-of-type{
    font-size: 10px;
}
</style>