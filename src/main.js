import Vue from 'vue'
import App from './App.vue'
import router from './routes/index'
// 导入api
import api from '../src/api/index'
// 导入vuex
import store from './vuex/index'
// 导入插件
import installs from './use/index'
// 导入字体符号
import '@/assets/fonts/iconfont'
Vue.use(installs,{'opt':'我就是opt'})
// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$api = api
    this.$store.$api = api
  },
  render: h => h(App),
}).$mount('#app')


