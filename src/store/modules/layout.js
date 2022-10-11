/**
 * 布局配置文件
 */
export default {
  state: {
    config: {
      width: '',
      height: '',
    },
  },
  getters: {
    config: state => state.config,
  },
  mutations: {
    SET_CONFIG: (state, config) => {
      state.config = config
    },
  },
  actions: {},
}
