import lodash from 'lodash'
import Vue from 'vue'

const lodashPlugin = {
  install: function (Vue, name = '_') {
    Object.defineProperty(Vue.prototype, name, { value: lodash })
  },
}

Vue.use(lodashPlugin)
