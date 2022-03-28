module.exports = {
  lintOnSave:false,
  devServer:{
    proxy:{
        '/api':{
          target:'http://iwenwiki.com:3000',
          changeOrigin:true,
          pathRewrite:{
            "^/api":""
        }
      }
    }
  }
}