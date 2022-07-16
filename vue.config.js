module.exports = {
  lintOnSave:false,
  // 改false时打包的js文件的引用名不会转hash值
  filenameHashing:true,
  pages:{
    index:{
      entry:'src/main.js',
      title:'music'
    }
  },
  devServer:{
    proxy:{
      '/api':{
        target:'http://music.wclili.vip',
        changeOrigin:true,
        pathRewrite:{
          "^/api":""
        }
      }
    }
  }
}