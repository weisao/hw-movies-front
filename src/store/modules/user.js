/**
 * 用户状态
 */
import { setAccessToken } from '@/utils/auth'
import { loginByUser } from '@/api/api'
export default {

  state: {
    userName: '', // 用户名
    rolesId: '', // 角色信息
    authList: [], // 权限项
    token: '',
  },
  getters: {
    userName: state => state.userName,
    rolesId: state => state.rolesId,
  },
  mutations: {
    SET_USER_INFO: (state, info) => {
      state.userName = info.userName
      state.rolesId = info.rolesId
    },
    SET_ACCESS_TOKEN: (state, token) => {
      state.token = token
    },
  },
  actions: {
    setUserInfo ({ commit }, data) {
      commit('SET_USER_INFO', data)
    },
    /**
     *
     * @param {*} {commit} 解构状态操作对象
     * @param {*} loginInfo 登录信息
     * @returns
     */
    LoginByUsername ({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        const { userName, password } = loginInfo
        loginByUser({
          userName, password,
        }).then(res => {
          commit('SET_ACCESS_TOKEN', 'ASDZXCVBNM')
          setAccessToken('ASDZXCVBNM')
          res.data.length ? resolve(res) : reject()
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
}
