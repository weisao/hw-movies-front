// import Qs from 'qs';
import axios from 'axios'
import { message } from 'ant-design-vue'
// 服务器地址
const BASE_URL = '/font'

// 请求响应后格式
const RESPONSE_STRUCTURE = {
  code: '', // 代码
  data: '', // 数据
  msg: '', // 信息
}

// 新实例
const service = axios.create({
  baseURL: BASE_URL, // 服务器地址
  timeout: 10000, // 请求超时时间
  withCredentials: true, 	// 是否允许跨域携带cookie信息
})
// 请求拦截器
service.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
// https://stackoverflow.com/questions/56490410/axio-interceptors-how-to-throw-errors-in-the-onfulfill
service.interceptors.response.use_ = function (onFulfilled, onRejected) {
  service.interceptors.response.use(
    function (response) {
      try {
        return onFulfilled(response)
      } catch (e) {
        return onRejected(e)
      }
    },
    onRejected,
  )
}
service.interceptors.response.use_(
  response => {
    const { code, message: msg, result, data } = response.data
    RESPONSE_STRUCTURE.code = code
    RESPONSE_STRUCTURE.data = data || result
    RESPONSE_STRUCTURE.msg = msg
    message.destroy()
    msg ? message.success(msg) : ''
    return RESPONSE_STRUCTURE
  },
  error => {
    const { code, message: msg, result, data } = error.response.data
    RESPONSE_STRUCTURE.code = code
    RESPONSE_STRUCTURE.data = data || result
    RESPONSE_STRUCTURE.msg = msg
    message.destroy()
    message.error(msg)
    console.log('Error', code, result, msg)
    return Promise.reject(error)
  },
)
/**
 * 统一的请求方法
 * @param data 请求数据
 * @param params url数据
 */
function handlerRequest (interfaceData, params) {
  const url = interfaceData.path
  const method = interfaceData.method
  const option = {
    url,
    method,
    data: method === 'post' ? params : '',
    params: method === 'get' ? params : '',
  }
  return service(option)
}

export default service
export { handlerRequest }
