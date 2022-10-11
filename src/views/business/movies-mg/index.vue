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
    postMoviesSearch,
    postMoviesAdd,
    postMoviesModify,
    postMoviesDelete,
    postTypeSearch,
    postUrlSearch,
  } from '@/api/api.js'
  import table from '@/mixins/table'
  export default {
    name: '',
    components: {
      SearchTable,
      ActionBar,
      FormModal,
    },
    mixins: [table],
    data () {
      const config = {
        search: {
          list: [
            {
              title: '电影名',
              key: 'moviesname',
              type: 'input',
            },
          ],
        },
        table: {
          api: postMoviesSearch, // 表格查询接口
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
              title: '电影名',
              dataIndex: 'moviesname',
              key: 'moviesname',
              useTooltip: true,
            },
            {
              title: '类型',
              dataIndex: 'typeid',
              key: 'typeid',
              useTooltip: false,
              customRender: val => this.customRenderWithDic(val, this.typeDic),
            },
            {
              title: '地址1',
              dataIndex: 'urlid_1',
              key: 'urlid_1',
              useTooltip: false,
              customRender: val => this.customRenderWithDic(val, this.urlDic),
            },
            {
              title: '地址2',
              dataIndex: 'urlid_2',
              key: 'urlid_2',
              useTooltip: false,
              customRender: val => this.customRenderWithDic(val, this.urlDic),
            },
            {
              title: '地址3',
              dataIndex: 'urlid_3',
              key: 'urlid_3',
              useTooltip: false,
              customRender: val => this.customRenderWithDic(val, this.urlDic),
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
      return {
        config,
        ACTION_OPTION,
        nowUse: '',
        urlDic: {},
        typeDic: {},
      }
    },
    computed: {
      formConfig () {
        return {
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
            title: '电影',
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
              moviesname: [{ required: true, message: '必填' }],
              typeid: [{ required: true, message: '必填' }],
            },
            list: [
              {
                label: '电影名',
                type: 'input',
                key: 'moviesname',
                columns: 1, // small 1 middle 1,2 large 1,2,3
              },
              {
                label: '类型',
                type: 'select',
                key: 'typeid',
                columns: 1,
                select: {
                  showSearch: false, // 是否静态开启搜索
                  dictionary: this.typeDic,
                },
              },
              {
                label: '地址1',
                type: 'select',
                key: 'urlid_1',
                columns: 1,
                select: {
                  showSearch: false, // 是否静态开启搜索
                  dictionary: this.urlDic,
                },
              },
              {
                label: '地址2',
                type: 'select',
                key: 'urlid_2',
                columns: 1,
                select: {
                  showSearch: false, // 是否静态开启搜索
                  dictionary: this.urlDic,
                },
              },
              {
                label: '地址3',
                type: 'select',
                key: 'urlid_3',
                columns: 1,
                select: {
                  showSearch: false, // 是否静态开启搜索
                  dictionary: this.urlDic,
                },
              },
            ],
          },
        }
      },
    },
    mounted () {
      this.loadDicData()
    },
    methods: {
      async loadDicData () {
        const params = { current: 1, pageSize: 999 }
        const { data: resUrlData } = await postUrlSearch(params)
        const { data: resTypeData } = await postTypeSearch(params)
        this.urlDic = this.arrayChangeToObject(resUrlData.list, { dicValue: 'urlname' })
        this.typeDic = this.arrayChangeToObject(resTypeData.list, { dicValue: 'typename' })
      },
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
              Object.keys(res).forEach(key => {
                if (res[key] === undefined) {
                  res[key] = ''
                }
              })
              postMoviesModify({ ...res }).then(res => {
                this.handleResearch()
                closeModal()
              })
            } else if (this.nowUse === 'add') {
              postMoviesAdd({ ...res }).then(res => {
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
          title: '是否删除当前电影',
          content: ``,
          okText: '是',
          cancelText: '否',
          okType: 'danger',
          onOk: () => {
            postMoviesDelete({ id: record.id })
              .then(res => {
                this.handleResearch()
              })
          },
          onCancel: () => {
            console.log('Cancel')
          },
        })
      },
      // 数组转对象
      arrayChangeToObject (array, { key = 'id', dicValue = 'name' }) {
        console.log(array, key, dicValue)
        const tempObj = {}
        array.forEach(n => {
          tempObj[n[key]] = n[dicValue]
        })
        return tempObj
      },
    },
  }
</script>

<style lang="scss" scoped></style>
