import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入treetable
import TreeTable from 'vue-table-with-tree-grid'

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 挂载请求拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config 否则会报错
  return config
})
// 挂载到vue 的原型对象上， 每个vue组件都可以通过this直接访问到$http 从而发起ajax请求
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 挂载Vue.component(ZkTable.name, ZkTable) 为全局注册组件
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
