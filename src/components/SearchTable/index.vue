<template>
  <div>
    <a-tabs v-if="searchConfig.useTabs" v-model="query[searchConfig.useTabs.key]" type="card" @change="handleTabChange">
      <a-tab-pane v-for="(v, k) in tabs" :key="k" :tab="v"></a-tab-pane>
    </a-tabs>
    <!-- 查询表格 -->
    <a-form-model v-if="Object.keys(searchConfig).length > 0" ref="query" layout="inline">
      <a-form-model-item
        v-for="(item, sub) in searchConfig.list"
        v-show="item.show || item.show === undefined"
        :key="sub"
        :label="item.title"
        :prop="item.type === 'DateRange' || item.type === 'Cascader' ? item.key.join('And') : item.key"
      >
        <a-input
          v-if="item.type === 'input'"
          v-model="query[item.key]"
          placeholder="请输入"
          :style="{ width: '180px' }"
        ></a-input>
        <a-select
          v-else-if="item.type === 'select'"
          v-model="query[item.key]"
          placeholder="--请选择--"
          :show-search="item.showSearch"
          :option-filter-prop="item.showSearch ? 'children' : null"
          :filter-option="item.showSearch ? filterOption : null"
          :style="{ width: '140px' }"
          :allow-clear="true"
          :dropdown-match-select-width="false"
          @change="item.change"
        >
          <a-select-option v-for="(obj, index) of item.dictionary" :key="index" :value="index">{{
            obj
          }}</a-select-option>
        </a-select>
        <a-range-picker
          v-else-if="item.type === 'DateRange'"
          v-model="query[item.key.join('&')]"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :style="{ width: '260px' }"
        ></a-range-picker>
        <a-cascader
          v-else-if="item.type === 'Cascader'"
          v-model="query[item.key.join('&')]"
          :options="item.options"
          :field-names="item.fieldNames"
          change-on-select
          :show-search="
            item.showSearch ? { filter: (inputValue, path) => filter(inputValue, path, item.fieldNames.label) } : false
          "
          :style="{ width: '180px' }"
          placeholder="请选择"
        >
        </a-cascader>
        <slot v-else-if="item.type === 'customize'" :name="item.key" v-bind="query"></slot>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="handleResetSearch">重置</a-button>
      </a-form-model-item>
    </a-form-model>
    <slot name="btnBar"></slot>

    <a-table
      style="margin-top: 10px"
      :row-key="tableObj.rowKey"
      :columns="columns"
      :row-selection="rowSelection"
      size="middle"
      :scroll="{
        y: 400,
      }"
      :bordered="true"
      :pagination="tableObj.pagination"
      :data-source="tableObj.tableData"
      :loading="tableObj.tableLoading"
      @change="handleChange"
    >
      <template v-for="(slotName, index) in slotNames" #[slotName]="record">
        <span :key="index">
          <!-- 点击事件类 -->
          <span v-if="slotObj(slotName).type === 'action'">
            <a
              v-for="(action, k) in slotObj(slotName).list"
              :key="k"
              :class="[action.color]"
              @click="actionEven(record, action.emit)"
            >
              <span v-if="action.show !== undefined">
                <span v-if="getActionShow(action, record)">
                  <a-divider v-if="k !== 0" type="vertical"></a-divider>
                  <a-icon v-if="action.icon" :type="action.icon"></a-icon>
                  {{ action.title }}
                </span>
              </span>
              <span v-else-if="action.show === false"></span>

              <span v-else>
                <a-divider v-if="k !== 0" type="vertical"></a-divider>
                <a-icon v-if="action.icon" :type="action.icon"></a-icon>
                {{ action.title }}
              </span>
            </a>
          </span>
          <!-- 状态类 -->
          <span v-else-if="slotObj(slotName).type === 'state'">
            <a-badge
              :status="slotObj(slotName).badges[record[slotObj(slotName).key]]"
              :text="slotObj(slotName).options[record[slotObj(slotName).key]]"
            ></a-badge>
          </span>
          <!-- 其他自定义 -->
          <span v-else-if="slotObj(slotName).type === 'other'">
            <slot :name="slotName" v-bind="record"></slot>
          </span>
        </span>
      </template>
    </a-table>
  </div>
</template>

<script>
  import { onMounted, ref, reactive, computed, set } from '@vue/composition-api'

  import _ from 'lodash'
  import resize from '@/hooks/resize'
  import table from '@/hooks/table'

  export default {
    name: '',
    props: {
      config: {
        type: Object,
        default: () => {},
      },
    },
    setup (props, context) {
      const { table: tableConfig } = props.config
      const searchConfig = props.config.search || {}

      // 查询参数
      const query = reactive({})
      // 初始化query
      if (Object.keys(searchConfig).length > 0) {
        const { list } = searchConfig
        list.forEach(n => {
          if (_.isArray(n.key)) {
            set(query, n.key.join('&'), [])
          } else {
            set(query, n.key, '')
          }
        })
      }

      // 改版mixin
      const { customRenderWithTitle, defaultPaginationOptions } = table(context)
      const { calcWidthByColumns, calculateHeight } = resize(context)
      // 表格配置
      const tableObj = reactive({
        rowKey: tableConfig.rowKey,
        tableData: [],
        tableLoading: false,
        pagination: defaultPaginationOptions,
        height: tableConfig.height || 400,
      })
      // 表头
      const columns = ref(
        tableConfig.columns.map(n => {
          if (n.useTooltip) {
            n.customRender = customRenderWithTitle
          }
          n.ellipsis = true
          n.align = 'center'
          return n
        }),
      )
      // 选中的项
      const selectedRowKeys = ref([])
      const selectedRow = ref([])
      const rowSelection = computed(() => {
        if (tableConfig.select) {
          return {
            selectedRowKeys: selectedRowKeys.value,
            onChange: (selectedKeys, selected) => {
              selectedRowKeys.value = selectedKeys
              selectedRow.value = selected
              context.emit('select', {
                selectedKeys,
                selectedRow: selected,
              })
            },
          }
        } else if (tableConfig.radio) {
          return {
            type: 'radio',
            selectedRowKeys: selectedRowKeys.value,
            onChange: (selectedKeys, selected) => {
              selectedRowKeys.value = selectedKeys
              selectedRow.value = selected
              context.emit('select', {
                selectedKeys,
                selectedRow: selected,
              })
            },
          }
        }
        return null
      })
      // 获得查询所需参数
      const otherParams = parameter => {
        // 重组查询参数
        const tempObj = {}
        Object.keys(query).forEach(key => {
          if (key.includes('&')) {
            const keyStrArr = key.split('&')
            keyStrArr.forEach((n, i) => {
              tempObj[n] = query[key][i]
            })
          } else {
            tempObj[key] = query[key]
          }
        })
        const { extraParams } = tableConfig
        return {
          ...tempObj,
          ...parameter,
          ...extraParams,
        }
      }
      // 加载表格数据
      const loadTableData = params => {
        const { current, pageSize } = params
        console.log(params)
        const _params = {}
        // 处理不同分页参数
        if (tableConfig.pagination.name !== undefined) {
          const tempObj = {}
          Object.keys(params).forEach(key => {
            if (key === 'current') {
              tempObj[tableConfig.pagination.current] = params[key]
            } else if (key === 'pageSize') {
              tempObj[tableConfig.pagination.pageSize] = params[key]
            }
          })
          _params[tableConfig.pagination.name] = tempObj
        } else {
          Object.keys(params).forEach(key => {
            if (key === 'current') {
              _params[tableConfig.pagination.current] = params[key]
            } else if (key === 'pageSize') {
              _params[tableConfig.pagination.pageSize] = params[key]
            }
          })
        }
        // 处理查询参数
        if (tableConfig.coverParams.name !== undefined) {
          const tempObj = {}
          Object.keys(params).forEach(key => {
            if (!(key === 'current' || key === 'pageSize')) {
              tempObj[key] = params[key]
            }
          })
          _params[tableConfig.coverParams.name] = tempObj
        } else {
          Object.keys(params).forEach(key => {
            if (!(key === 'current' || key === 'pageSize')) {
              _params[key] = params[key]
            }
          })
        }
        tableObj.tableLoading = true
        context.emit('search', _params)
        console.log('当前查询参数', _params)
        tableConfig
          .api(_params)
          .then(({ data: res }) => {
            if (res) {
              tableObj.tableData = res[tableConfig.dataKey].map((n, i) => {
                n.rowIndex = (current - 1) * pageSize + i + 1
                return n
              })
              // const total = res.total || res[tableConfig.pagination.total]
              // console.log(total)
              tableObj.pagination = _.merge(tableObj.pagination, {
                current,
                total: res.total || res[tableConfig.pagination.total] || 0,
                pageSize,
              })
            } else {
              // 空返回处理
              tableObj.tableData = []
              tableObj.pagination = _.merge(tableObj.pagination, {
                current,
                total: 0,
                pageSize,
              })
            }
          })
          .finally(() => {
            tableObj.tableLoading = false
          })
      }
      // 查询
      const handleSearch = () => {
        selectedRowKeys.value = []
        selectedRow.value = []
        const pageSize = tableObj.pagination.pageSize
        loadTableData(otherParams({ current: 1, pageSize }))
      }
      // 获取tabs
      const tabs = computed(() => {
        const tempObj = searchConfig.list.find(n => {
          return n.key === searchConfig.useTabs.key
        })
        return tempObj.dictionary
      })
      // // tab切换事件
      const handleTabChange = e => {
        query[searchConfig.useTabs.key] = e
        handleSearch()
      }
      // 重置查询
      const handleResetSearch = () => {
        if (searchConfig.useTabs && searchConfig.useTabs.default !== undefined) {
          handleTabChange(searchConfig.useTabs.default)
        }
        Object.keys(query).forEach(key => {
          query[key] = _.isArray(query[key]) ? ['', ''] : undefined
        })
        context.emit('reset', {})
        if (!searchConfig.noNeedResetImmediatelySearch) {
          handleSearch()
        }
      }

      // 分页
      const handleChange = e => {
        const { current, pageSize } = e
        loadTableData(otherParams({ current, pageSize }))
      }

      // 计算表格插槽
      const slotNames = computed(() => {
        const tempNames = []
        tableConfig.columns.forEach(n => {
          if (n.scopedSlots) {
            tempNames.push(n.key)
          }
        })
        return tempNames
      })
      // 获取对应插槽配置
      const slotObj = actionName => {
        return tableConfig.slots[actionName]
      }
      // 统一触发事件
      const actionEven = (record, emit) => {
        context.emit(emit, record)
      }

      const filterOption = (input, option) => {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      const filter = (inputValue, path, key) => {
        return path.some(option => option[key].toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
      }
      const getActionShow = (action, record) => {
        if (_.isArray(action.show)) {
          let pass = true
          action.show.forEach(n => {
            if (!n.value.includes(record[n.key])) {
              pass = false
            }
          })
          return pass
        }
        return action.show.value.includes(record[action.show.key])
      }

      // 钩子
      onMounted(() => {
        if (searchConfig.useTabs && searchConfig.useTabs.default !== undefined) {
          query[searchConfig.useTabs.key] = `${searchConfig.useTabs.default}`
        }
        if (!searchConfig.noNeedImmediatelySearch) {
          handleSearch()
        }
      })

      return {
        calcWidthByColumns,
        calculateHeight,
        columns,
        tableObj,
        query,
        searchConfig,
        handleSearch,
        handleResetSearch,
        handleChange,
        slotNames,
        slotObj,
        actionEven,

        rowSelection,
        selectedRowKeys,
        selectedRow,

        filterOption,
        filter,
        handleTabChange,
        tabs,
        getActionShow,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .space {
    margin-right: 5px;
  }

  .danger {
    color: #f5222d;
  }
</style>
