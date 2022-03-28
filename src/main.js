import Vue from 'vue'
import App from './App.vue'
import router from './routes/index'
// 导入api
import api from '../src/api/index'
// 导入vuex
import store from './vuex/index'
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
