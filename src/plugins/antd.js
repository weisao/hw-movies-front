import Vue from 'vue'
import moment from 'moment' // ant design vue 内部依赖，不必外部引入
import 'ant-design-vue/dist/antd.css'

import {
  // Base,
  Affix,
  // Anchor,
  AutoComplete,
  Alert,
  // Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  // Calendar,
  Card,
  Collapse,
  // Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  FormModel,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  // LocaleProvider,
  Menu,
  // Mentions,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
  Drawer,
  Skeleton,
  // Comment,
  ConfigProvider,
  Empty,
  Result,
  Descriptions,
  // PageHeader,
  message,
  notification,
} from 'ant-design-vue'

Vue.use(Progress)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(Col)
Vue.use(Row)
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Tooltip)
Vue.use(AutoComplete)
Vue.use(Dropdown)
Vue.use(Drawer)
Vue.use(Alert)
Vue.use(Layout)
Vue.use(Collapse)
Vue.use(Select)
Vue.use(Tree)
Vue.use(List)
Vue.use(ConfigProvider)
Vue.use(Modal)
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(Divider)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Switch)
Vue.use(Cascader)
Vue.use(Breadcrumb)
Vue.use(Menu)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(Radio)
Vue.use(Tag)
Vue.use(Spin)
Vue.use(Upload)
Vue.use(Badge)
Vue.use(InputNumber)
Vue.use(TreeSelect)
Vue.use(Empty)
Vue.use(Affix)
Vue.use(Skeleton)
Vue.use(BackTop)
Vue.use(Rate)
Vue.use(Transfer)
Vue.use(Timeline)
Vue.use(Result)
Vue.use(Descriptions)
Vue.use(Steps)
Vue.use(Statistic)
Vue.use(Slider)

// temporary fix
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$destroyAll = Modal.destroyAll

export const momentVue = {
  install: function (Vue, name = 'moment') {
    Object.defineProperty(Vue.prototype, name, { value: moment })
  },
}
Vue.use(momentVue)
