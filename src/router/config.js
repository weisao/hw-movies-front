const Layout = () => import('@/layout/index')
const ContentContainer = () => import('@/layout/components/ContentContainer')
// const Home = () => import('@/views/home/index.vue')
/**
 * 测试路由
 */
export const demoMap = [
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/demo/index.vue'),
  },
]
/**
 * 基本路由
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    name: 'Refresh',
    path: '/refresh',
    component: () => import('./refresh.vue'),
  },
]
/**
 * 本地权限路由
 */
export const asyncRouterMap = [
  {
    path: '/admin',
    name: 'Admin',
    component: Layout,
    redirect: '/admin/business',
    meta: { title: '主页', icon: 'admin' },
    children: [
      {
        path: 'business',
        name: 'Business',
        component: ContentContainer,
        meta: { title: '业务管理', icon: 'business', defaultExpand: true },
        redirect: '/admin/business/type-mg',
        children: [
          {
            path: 'type-mg',
            name: 'TypeMg',
            component: () => import('@/views/business/type-mg/index.vue'),
            meta: { title: '类型管理' },
          },
          {
            path: 'url-mg',
            name: 'UrlMg',
            component: () => import('@/views/business/url-mg/index.vue'),
            meta: { title: '地址管理' },
          },
          {
            path: 'movies-mg',
            name: 'MoviesMg',
            component: () => import('@/views/business/movies-mg/index.vue'),
            meta: { title: '电影管理' },
          },
        ],
      },
    ],
  },
]
/**
 * 非法路由
 */
export const errorRouterMap = [
  {
    path: '/404',

    component: () => import('@/views/exception/404'),
  },
  { path: '*', redirect: '/404' },
]
