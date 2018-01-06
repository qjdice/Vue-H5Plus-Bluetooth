// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Bluetooth from './common/Bluetooth/Search'
// 通过插件的形式挂载
Vue.use(Bluetooth)

Vue.config.productionTip = false;

//初始化本地数据库

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
