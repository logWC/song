export default (Vue,options)=>{
  // 点击播放
  Vue.prototype.$play = function(id){
      /* 播放歌曲 */
      // console.log(options)
      this.$bus.$emit('currentSong',id)
  }
  // 传递id列表
  Vue.prototype.$idListMe = function(idList){
      /* 获取正在播放的歌曲列表 */
      this.$bus.$emit('musicIdList',idList)
  }
  // 存cookie
  Vue.prototype.$setCookie = function(name,data,time){
      /* 存储进cookie*/
      let h = `${name}=${JSON.stringify(data)}`
      let expires = new Date()
      expires.setTime(expires.getTime()+time*7*24*60*60*1000)
      expires = "expires=" + expires.toGMTString()
      document.cookie=`${h};${expires}`
  }
  // 取cookie
  Vue.prototype.$getCookie = function(name){
      /* 获取cookie数据 */
      name = name + "="
      let coo = document.cookie
      let c = coo.split(";")
      for(let i=0;i<c.length;i++){
          let val = c[i].trim()
          if(val.indexOf(name) == 0){
              return val.replace(name,"")
          }
      }
      return ""
  }
  // 按钮节流
  Vue.directive('debounce', {
      bind: (el, binding) => {
        let debounceTime = binding.value; // 节流时间
        if (!debounceTime) { // 用户若不设置防抖时间，则默认2s
          debounceTime = 2000;
        }
        let cbFun;
        el.addEventListener('click', event => {
          console.log(2)
          if (!cbFun) { // 第一次执行
            cbFun = setTimeout(() => {
              cbFun = null;
            }, debounceTime);
          } else {
            event && event.stopImmediatePropagation();
          }
        }, true);
      },
  })
  // 图片懒加载
  Vue.directive('lazy',{
      bind(el,binding){
        LazyLoad.init(el,binding.value);
      },
      inserted(el){
        // 兼容处理
        if('IntersectionObserver' in window){
            LazyLoad.observe(el);
        }else{
            LazyLoad.listenerScroll(el);
        }
      },
  })
}

const LazyLoad = {
  // 初始化
  init(el,val){
    // data-src 储存真实src
    el.setAttribute('data-src',val);
    // 设置src为loading图
    el.setAttribute('src',require('@/assets/logo.png'));
  },
  // 利用IntersectionObserver监听el
  observe(el){
    let io = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        let realSrc = el.dataset.src;
        if(realSrc){
          el.src = realSrc;
          el.removeAttribute('data-src');
          io.unobserve(el)
        }
      }
    });
    io.observe(el);
  },
  // 监听scroll事件
  listenerScroll(el){
      let handler = LazyLoad.throttle(LazyLoad.load,300);
      LazyLoad.load(el);
      window.addEventListener('scroll',() => {
          handler(el);
      });
  },
  // 加载真实图片
  load(el){
      let windowHeight = document.documentElement.clientHeight
      let elTop = el.getBoundingClientRect().top;
      let elBtm = el.getBoundingClientRect().bottom;
      let realSrc = el.dataset.src;
      if(elTop - windowHeight<0&&elBtm > 0){
          if(realSrc){
              el.src = realSrc;
              el.removeAttribute('data-src');
          }
      }
  },
  // 节流
  throttle(fn,delay){
      let timer; 
      let prevTime;
      return function(...args){
          let currTime = Date.now();
          let context = this;
          if(!prevTime) prevTime = currTime;
          clearTimeout(timer);
          
          if(currTime - prevTime > delay){
              prevTime = currTime;
              fn.apply(context,args);
              clearTimeout(timer);
              return;
          }

          timer = setTimeout(function(){
              prevTime = Date.now();
              timer = null;
              fn.apply(context,args);
          },delay);
      }
  }
}