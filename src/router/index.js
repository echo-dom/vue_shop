import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入Login组件
import Login from '../components/Login.vue'
// 导入Home组件
import Home from '../components/Home.vue'
// 导入Welcome组件
import Welcome from '../components/Welcome.vue'
// 导入Users
import Users from '../components/user/Users.vue'
// 导入Rights
import Rights from '../components/power/Rights.vue'
// 导入Roles
import Roles from '../components/power/Roles'
// 导入Cate
import Cate from '../components/goods/Cate.vue'
// 导入Params
import Params from '../components/goods/Params.vue'
// 导入List
import List from '../components/goods/List.vue'
// 导入Add
import Add from '../components/goods/Add.vue'
// 导入Order
import Order from '../components/order/Order.vue'
// 导入Report
import Report from '../components/report/Report'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{ path: '/welcome',component: Welcome },{ path: '/users',component: Users },{ path: '/rights',component: Rights },{ path: '/roles',component: Roles },{ path: '/categories',component: Cate },{ path: '/params',component: Params },{ path: '/goods',component: List },
      { path: '/goods/add', component: Add },{ path: '/orders', component: Order },{ path: '/reports', component: Report }]
  }

]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // 代表从那个路径跳转而来
  // next是一个函数 表示放行
  // next() 放行 next('/login') 强制跳转到login
  if (to.path === '/login') return next()
  // 先获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
