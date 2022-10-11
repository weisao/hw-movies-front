import { handlerRequest } from '@/plugins/request'
/**
 * 用户登录
 * @param {*} params {userName password}
 * @returns
 */
export function loginByUser (params) {
  const interfaceData = {
    'path': '/users/login',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}
/**
 * @description: 查询类型
 * @param {*} params
 * @return {*}
 */
export function postTypeSearch (params) {
  const interfaceData = {
    'path': '/types/search',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 增加类型
 * @param {*} params
 * @return {*}
 */
export function postTypeAdd (params) {
  const interfaceData = {
    'path': '/types/add',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 修改类型
 * @param {*} params
 * @return {*}
 */
export function postTypeModify (params) {
  const interfaceData = {
    'path': '/types/modify',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 删除类型
 * @param {*} params
 * @return {*}
 */
export function postTypeDelete (params) {
  const interfaceData = {
    'path': '/types/delete',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 查询地址
 * @param {*} params
 * @return {*}
 */
export function postUrlSearch (params) {
  const interfaceData = {
    'path': '/url/search',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 增加地址
 * @param {*} params
 * @return {*}
 */
export function postUrlAdd (params) {
  const interfaceData = {
    'path': '/url/add',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 修改地址
 * @param {*} params
 * @return {*}
 */
export function postUrlModify (params) {
  const interfaceData = {
    'path': '/url/modify',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 删除地址
 * @param {*} params
 * @return {*}
 */
export function postUrlDelete (params) {
  const interfaceData = {
    'path': '/url/delete',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 查询电影
 * @param {*} params
 * @return {*}
 */
export function postMoviesSearch (params) {
  const interfaceData = {
    'path': '/movies/search',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 增加电影
 * @param {*} params
 * @return {*}
 */
export function postMoviesAdd (params) {
  const interfaceData = {
    'path': '/movies/add',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 修改电影
 * @param {*} params
 * @return {*}
 */
export function postMoviesModify (params) {
  const interfaceData = {
    'path': '/movies/modify',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}

/**
 * @description: 删除电影
 * @param {*} params
 * @return {*}
 */
export function postMoviesDelete (params) {
  const interfaceData = {
    'path': '/movies/delete',
    'method': 'post',
  }
  return handlerRequest(interfaceData, params)
}
