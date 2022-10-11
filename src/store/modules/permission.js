/**
 * 布局配置文件
 */
import {
  errorRouterMap,
  constantRouterMap,
  asyncRouterMap,
} from '../../router/config.js'
export default {
  state: {
    addRoutes: [],
    routes: [],
  },
  getters: {
    addRoutes: state => state.addRoutes, // 权限路由
    routes: state => state.routes, // 完整路由
  },
  mutations: {
    SET_ROUTES: (state, info) => {
      state.addRoutes = info
      state.routes = constantRouterMap.concat(info).concat(errorRouterMap)
    },
  },
  actions: {
    /**
     * 设置权限异步路由
     * @param {*} param
    */
    // 注：在actions的方法前用async修饰 返回值会被默认转为promise对象，调用时需要then
    async SetRoutes ({ commit }) {
      console.log('设置路由')
      commit('SET_ROUTES', asyncRouterMap)
      return asyncRouterMap
    },
  },
}
