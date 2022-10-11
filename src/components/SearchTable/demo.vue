<template>
  <div>
    <!-- 查询表格 -->
    <search-table
      :config="config"
      @edit="record => handleOpen(record, 'edit')"
      @view="record => handleOpen(record, 'view')"
      @delete="record => handleDelete(record, 'delete')"
      @select="handleSelect"
    >
      <span slot="btnBar">
        <action-bar
          :option="ACTION_OPTION"
          @add="handleOpen({}, 'add')"
          @delete="handleOpen({}, 'delete')"
          @import="handleImport"
          @output="handleOutput"
        ></action-bar>
      </span>
      <template #customize="record">
        {{ record.id }}
      </template>
    </search-table>
  </div>
</template>

<script>
  import SearchTable from '@/components/SearchTable'
  import ActionBar from '@/components/ActionBar'
  export default {
    name: '',
    components: {
      SearchTable,
      ActionBar,
    },
    data () {
      const config = {
        search: {
          useTabs: {
            // 使用tabs
            key: 'status', // 需要做成tabs的searchKey
            default: 0, // 默认启动tabs值
          },
          list: [
            {
              title: '关键字',
              key: 'keyword',
              type: 'input',
            },
            {
              title: '状态',
              key: 'status',
              type: 'select',
              showSearch: true, // 下拉菜单查询
              show: false, // 是否展示
              change: value => {
                console.log(value)
              },
              dictionary: {
                a: '全部',
                b: '正在',
                c: '暂停',
                d: '结束',
              },
            },
            {
              title: '仓库/库位',
              key: ['warehouse', 'location'],
              type: 'Cascader',
              showSearch: true,
              options: [
                {
                  value: 'zhejiang',
                  label: 'Zhejiang',
                  children: [
                    {
                      value: 'hangzhou',
                      label: 'Hangzhou',
                      children: [
                        {
                          value: 'xihu',
                          label: 'West Lake',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: '起止时间',
              key: ['start', 'end'],
              type: 'DateRange',
            },
          ],
        },
        table: {
          api: this.getTestData, // 表格查询接口
          rowKey: 'rowIndex', // 表格主键
          select: true, // 启用多选
          // radio:true, // 启用单选
          dataKey: 'records', // 接口数据数组key值
          pagination: {
            current: 'current', // 当前页
            pageSize: 'pageSize', // 页面大小
            // name:'',
          },
          extraParams: {
            // 表格所需非展示字段
            // areaId: '1',
          },
          coverParams: {},
          columns: [
            // 表格字段
            {
              title: '序号',
              dataIndex: 'rowIndex',
              key: 'rowIndex',
              width: 80,
              useTooltip: true,
            },
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              useTooltip: true,
            },
            {
              title: '自定义',
              key: 'customize',
              width: 160,
              useTooltip: false,
              scopedSlots: { customRender: 'customize' },
            },
            {
              title: '状态',
              key: 'state',
              width: 160,
              useTooltip: false,
              scopedSlots: { customRender: 'state' },
            },
            {
              title: '操作',
              key: 'action',
              width: 160,
              useTooltip: false,
              scopedSlots: { customRender: 'action' },
            },
          ],
          slots: {
            // 插槽配置
            // 键名为操作列key值
            action: {
              type: 'action', // 点击类
              list: [
                {
                  title: '查看',
                  emit: 'view',
                },
                {
                  title: '修改',
                  emit: 'edit',
                  show: {
                    key: 'state', // 依据字段
                    value: [0, 1], // 符合条件
                  },
                },
                {
                  title: '删除',
                  emit: 'delete',
                  color: 'danger',
                },
              ],
            },
            state: {
              type: 'state', // 状态类
              key: 'state', // 对应字段名
              badges: {
                0: 'success',
                1: 'error',
                2: 'default',
              },
              options: {
                0: '通过',
                1: '不通过',
                2: '未开始',
              },
            },
            customize: {
              type: 'other',
            },
          },
        },
      }
      const ACTION_OPTION = {
        align: 'end',
        list: [
          {
            title: '添加',
            emit: 'add',
            type: 'primary',
          },
          {
            title: '批量删除',
            emit: 'delete',
            type: 'danger',
          },
          {
            title: '导入',
            emit: 'import',
            type: 'primary',
          },
          {
            title: '导出',
            emit: 'output',
            type: 'primary',
          },
        ],
      }
      return {
        config,
        ACTION_OPTION,
      }
    },
    methods: {
      // 弹窗开关
      handleOpen (record, action) {
        console.log(record, action)
      },
      // 表格选择事件
      handleSelect (selectKeys) {
        console.log(selectKeys)
      },
      // 删除事件
      handleDelete (record) {
        console.log(record)
      },
      // 导入
      handleImport () {},
      // 导出
      handleOutput () {},
      // 测试api
      getTestData ({ current, pageSize }) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // 构造数据
            const total = 105 // 总数
            const allData = [] // 数据
            for (let i = 0; i < total; i++) {
              allData.push({
                id: i + 1,
                name: `yhw${i + 1}`,
                age: 25,
                state: i % 3,
              })
            }
            const records = allData.slice((current - 1) * pageSize, current * pageSize)
            resolve({ records, total })
          }, 2000)
        })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
