<template>
  <div>
    <form-modal ref="formModal" :config="config" @download="handleDownload" @ok="handleOk"></form-modal>
  </div>
</template>

<script>
  import FormModal from '@/components/FormModal'
  export default {
    name: '',
    components: {
      FormModal,
    },
    data () {
      // 小布局
      const SMALL_LAYOUT = {
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
      }
      // 中等布局
      const MIDDLE_LAYOUT = {
        width: '800px',
        grid: {
          1: {
            span: 12,
            col: {
              labelCol: { span: 8 },
              wrapperCol: { span: 12 },
            },
          },
          2: {
            span: 24,
            col: {
              labelCol: { span: 4 },
              wrapperCol: { span: 18 },
            },
          },
        },
      }
      // 大布局
      const LARGE_LAYOUT = {
        width: '1200px',
        grid: {
          1: {
            span: 8,
            col: {
              labelCol: { span: 6 },
              wrapperCol: { span: 12 },
            },
          },
          2: {
            span: 16,
            col: {
              labelCol: { span: 3 },
              wrapperCol: { span: 18 },
            },
          },
          3: {
            span: 24,
            col: {
              labelCol: { span: 2 },
              wrapperCol: { span: 20 },
            },
          },
        },
      }
      return {
        dic: {},
        SMALL_LAYOUT,
        MIDDLE_LAYOUT,
        LARGE_LAYOUT,
        options: [],
        sex: {
          1: '男',
          2: '女',
        },
        result: {
          0: '成功',
          1: '失败',
        },
      }
    },
    computed: {
      config () {
        return {
          // 弹窗配置
          modal: {
            size: 'large', // 布局参数 small middle large
            layout: this.SMALL_LAYOUT,
            title: '弹窗',
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
                  text: '暂存',
                  emit: 'save',
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
              username: [{ required: true, message: '必填' }],
              remark: [{ required: true, message: '必填' }],
              result: [{ required: true, message: '必填' }],
              file: [{ required: true, message: '必填' }],
            },
            list: [
              {
                label: '用户名',
                type: 'input',
                key: 'username',
                columns: 1, // small 1 middle 1,2 large 1,2,3
                disabled: true,
              },
              {
                label: '性别',
                type: 'radio',
                key: 'sex',
                columns: 1,
                disabled: false,
                radio: {
                  dictionary: this.sex,
                },
              },
              {
                label: '学历',
                type: 'select',
                key: 'education',
                columns: 1,
                disabled: false,
                select: {
                  showSearch: true, // 是否静态开启搜索
                  dictionary: this.dic,
                },
              },
              {
                label: '出生日期',
                type: 'date',
                key: 'birthday',
                columns: 1,
                disabled: false,
                date: {
                  format: 'YYYY-MM-DD HH:mm:ss',
                },
              },
              {
                label: '所在行政区划',
                type: 'cascade',
                key: ['city', 'area', 'strict'],
                columns: 1,
                disabled: false,
                cascade: {
                  options: this.options,
                  fieldNames: { label: 'label', value: 'value', children: 'children' },
                  changeOnSelect: true, // 是否支持父级选择
                  showSearch: true,
                },
              },
              {
                label: '在校时间',
                type: 'dateRange',
                key: ['start', 'end'],
                columns: 2,
                disabled: false,
                dateRange: {
                  format: 'YYYY-MM-DD HH:mm:ss',
                },
              },
              {
                label: '审核结果',
                type: 'radioButton',
                key: 'result',
                columns: 1,
                disabled: false,
                radioButton: {
                  dictionary: this.result,
                },
              },
              {
                label: '备注',
                type: 'textarea',
                key: 'remark',
                columns: 3,
                disabled: false,
                textarea: {
                  maxLength: 200,
                  autoSize: { minRows: 4, maxRows: 6 },
                },
              },
              {
                label: '附件',
                type: 'upload',
                key: 'file',
                columns: 2,
                disabled: false,
                upload: {
                  multiple: false,
                  accept: '.xlsx',
                },
                download: {
                  emit: 'download',
                  show: true,
                },
              },
            ],
          },
        }
      },
    },
    mounted () {
      const formData = {
        // username: '1111',
        // birthday: '2021-12-09 00:00:00',
      }
      // 打开弹窗
      this.$refs.formModal.handleOpen(formData)
      // 读取数据
      this.getOptions().then(res => {
        this.options = res
      })
      this.getDictionary().then(res => {
        this.dic = res
      })
    },
    methods: {
      // 异步获取级联数据
      getOptions () {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const options = [
              {
                value: '福建省',
                label: '福建省',
                children: [
                  {
                    value: '福州市',
                    label: '福州市',
                    children: [
                      {
                        value: '闽侯县',
                        label: '闽侯县',
                      },
                    ],
                  },
                ],
              },
            ]
            resolve(options)
          }, 2000)
        })
      },
      // 异步获取下拉菜单数据
      getDictionary () {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const dic = {
              0: '高中',
              1: '本科',
              2: '研究生',
              3: '硕士',
            }
            resolve(dic)
          }, 1000)
        })
      },
      // 下载模板
      handleDownload () {
        console.log(1111)
      },
      // 确认事件
      handleOk ({ getData, closeModal }) {
        getData()
          .then(res => {
            console.log(res)
            closeModal()
          })
          .catch(error => {
            console.log(error)
          })
      },
    },
  }
</script>

<style>

</style>
