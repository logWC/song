export const songName = {
    filters: {
        songName(val){
            // 对单曲的各作者间使用 / 分割
            return val.reduce(
                (total,value) => {
                    return total == "" ?  value.name : total + "/" + value.name
                },"")
        }
    },
}