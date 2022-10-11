import router from '@/router'
import store from '@/store'
import { getAccessToken } from '@/utils/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// 加载进度条
NProgress.configure({ showSpinner: false })

// 每次路由跳转前钩子
router.beforeEach((to, from, next) => {
  console.log(from.path, to.path)

  // 加载条启动
  NProgress.start()
  // 注：存在token说明已经登录过Vue x中已经存在权限路由信息
  if (getAccessToken()) { // 持有token
    if (handleWhitelist(to.path)) {
      // 免登录
      next()
      NProgress.done()
    } else {
      const routes = store.getters.routes.length > 0
      if (routes) {
        next()
        NProgress.done()
      } else {
        // 设置路由
        store.dispatch('SetRoutes', {})
          .then(data => {
            router.addRoutes(store.getters.routes)
            next({ ...to, replace: true })
            NProgress.done()
          })
      }
    }
  } else { // 未持有token
    console.log('无token')
    if (handleWhitelist(to.path)) {
      // 设置路由
      next()
      NProgress.done()
    } else {
      next({
        path: '/',
        replace: true,
      })
      NProgress.done()
    }
  }
})
// 白名单 直接进入路由不需要进行重定向
const whitelist = [
  '/',
  '/refresh',
  // '/admin',
]
function handleWhitelist (path) {
  const exist = whitelist.find((n, i) => {
    return n === path
  })
  if (exist) {
    return true
  }
  return false
}

// 每次路由跳转后钩子
router.afterEach(() => {})
