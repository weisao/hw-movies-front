<template>
  <div>
    <!-- 查询表格 -->
    <search-table
      ref="searchTable"
      :config="config"
      @edit="record => handleOpen(record, 'edit')"
      @delete="record => handleDelete(record, 'delete')"
    >
      <span slot="btnBar">
        <action-bar
          :option="ACTION_OPTION"
          @add="handleOpen({}, 'add')"
        ></action-bar>
      </span>
    </search-table>
    <form-modal ref="formModal" :config="formConfig" @ok="handleOk" @cancel="handleCancel"></form-modal>
  </div>
</template>

<script>
  import SearchTable from '@/components/SearchTable'
  import ActionBar from '@/components/ActionBar'
  import FormModal from '@/components/FormModal'
  import {
    postTypeSearch,
    postTypeAdd,
    postTypeModify,
    postTypeDelete,
  } from '@/api/api.js'
  export default {
    name: '',
    components: {
      SearchTable,
      ActionBar,
      FormModal,
    },
    data () {
      const config = {
        search: {
          list: [
            {
              title: '类型名',
              key: 'typename',
              type: 'input',
            },
          ],
        },
        table: {
          api: postTypeSearch, // 表格查询接口
          rowKey: 'id', // 表格主键
          // radio:true, // 启用单选
          dataKey: 'list', // 接口数据数组key值
          pagination: {
            current: 'current', // 当前页
            pageSize: 'pageSize', // 页面大小
          },
          extraParams: {},
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
              title: '类型名',
              dataIndex: 'typename',
              key: 'typename',
              useTooltip: true,
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
                  title: '修改',
                  emit: 'edit',
                },
                {
                  title: '删除',
                  emit: 'delete',
                  color: 'danger',
                },
              ],
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
        ],
      }
      const formConfig = {
        // 弹窗配置
        modal: {
          size: 'small', // 布局参数 small middle large
          layout: {
            width: '600px',
            grid: {
              1: { // 表单项每行放置数columns columns超出设置值则读取第一项
                span: 24, // 占栅格数
                col: { // 表单项内部 label配置
                  labelCol: { span: 4 },
                  wrapperCol: { span: 18 },
                },
              },
            },
          },
          title: '类型',
          close: {
            emit: 'cancel',
          },
          footer: {
            btnList: [
              {
                text: '返回',
                emit: 'cancel',
                type: 'default',
              },
              {
                text: '提交',
                emit: 'ok',
                type: 'primary',
              },
            ],
          },
        },
        // 表单配置
        form: {
          rules: {
            typename: [{ required: true, message: '必填' }],
          },
          list: [
            {
              label: '类型名',
              type: 'input',
              key: 'typename',
              columns: 1, // small 1 middle 1,2 large 1,2,3
              disabled: true,
            },
          ],
        },
      }
      return {
        config,
        ACTION_OPTION,
        formConfig,
        nowUse: '',
      }
    },
    methods: {
      handleResearch () {
        this.$refs.searchTable.handleSearch()
      },
      // 弹窗开关
      handleOpen (record, action) {
        this.$refs.formModal.handleOpen(record)
        this.nowUse = action
        console.log(record, action)
      },
      // 确认事件
      handleOk ({ getData, closeModal }) {
        getData()
          .then(res => {
            if (this.nowUse === 'edit') {
              postTypeModify({ ...res }).then(res => {
                this.handleResearch()
                closeModal()
              })
            } else if (this.nowUse === 'add') {
              postTypeAdd({ ...res }).then(res => {
                this.handleResearch()
                closeModal()
              })
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      handleCancel () {
        this.$refs.formModal.closeModal()
      },
      // 删除事件
      handleDelete (record) {
        this.$confirm({
          title: '是否删除当前类型',
          content: ``,
          okText: '是',
          cancelText: '否',
          okType: 'danger',
          onOk: () => {
            postTypeDelete({ id: record.id })
              .then(res => {
                this.handleResearch()
              })
          },
          onCancel: () => {
            console.log('Cancel')
          },
        })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
