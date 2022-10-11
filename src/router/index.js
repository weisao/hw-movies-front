import Vue from 'vue'
import VueRouter from 'vue-router'

import {
  constantRouterMap,
  demoMap,
} from './config'

Vue.use(VueRouter)

// 拼凑异步路由和错误路由
let _constantRouterMap = [
  ...constantRouterMap]

// 开发环境引入demoMap
if (process.env.NODE_ENV !== 'production') {
  _constantRouterMap = [...demoMap, ..._constantRouterMap]
}

// // 按map创建路由
// const router = new VueRouter({
//   routes: _constantRouterMap,
// })
const createRouter = () => {
  return new VueRouter({
    routes: [..._constantRouterMap],
  })
}
// 创建
const router = createRouter()

export default router
