<template>
  <div>
    <a-modal
      :title="title"
      :width="layout.width"
      :visible="visible"
      :mask-closable="false"
      :destroy-on-close="true"
      @cancel="handleAction(closeEmit)"
    >
      <template #footer>
        <a-button
          v-for="(btn,k) in footerBtnList"
          :key="k"
          :type="btn.type"
          @click="handleAction(btn.emit)"
        >{{ btn.text }}</a-button>
      </template>
      <a-spin :spinning="spinning">
        <a-form-model
          ref="formObj"
          :model="formObj"
          :rules="rules"
        >
          <a-row>
            <a-col v-for="(v,k) in formList" :key="k" :span="getSpan(v.columns)">
              <a-form-model-item
                :label="v.label"
                :prop="v.key"
                v-bind="getCol(v.columns)"
              >
                <!-- 输入框 -->
                <a-input
                  v-if="v.type==='input'"
                  v-model="formObj[v.key]"
                  :placeholder="placeholder"
                  :disabled="disabled"
                ></a-input>
                <!-- 多行输入框 -->
                <a-textarea
                  v-else-if="v.type==='textarea'"
                  v-model="formObj[v.key]"
                  :placeholder="placeholder"
                  :disabled="disabled"
                  :maxLength="v.textarea.maxLength"
                  :auto-size="v.textarea.autoSize"
                ></a-textarea>
                <!-- 日期选择器 -->
                <a-date-picker
                  v-else-if="v.type === 'date'"
                  v-model="formObj[v.key]"
                  :disabled="disabled"
                  :format="v.date.format"
                  :value-format="v.date.format"
                  :placeholder="placeholder"
                ></a-date-picker>
                <!-- 下拉菜单 -->
                <a-select
                  v-else-if="v.type === 'select'"
                  v-model="formObj[v.key]"
                  :show-search="v.select.showSearch"
                  :option-filter-prop="v.select.showSearch ? 'children' : null"
                  :filter-option="v.select.showSearch ? filterOption : null"
                  :style="{ width: '100%' }"
                  :dropdown-match-select-width="false"
                  :disabled="disabled"
                  :allow-clear="true"
                >
                  <a-select-option v-for="(obj, index) of v.select.dictionary" :key="index" :value="index">{{
                    obj
                  }}</a-select-option>
                </a-select>
                <!-- 日期区间 -->
                <a-range-picker
                  v-else-if="v.type === 'dateRange'"
                  v-model="formObj[v.key]"
                  :placeholder="['','']"
                  :disabled="disabled"
                  :format="v.dateRange.format"
                  :value-format="v.dateRange.format"
                  :style="{ width: '100%' }"
                  @change="val => handleDateRange(val, v.key, formObj)"
                ></a-range-picker>
                <!-- 级联 -->
                <a-cascader
                  v-else-if="v.type === 'cascade'"
                  v-model="formObj[v.key]"
                  :disabled="disabled"
                  :options="v.cascade.options"
                  :field-names="v.cascade.fieldNames"
                  :change-on-select="v.cascade.changeOnSelect"
                  :show-search="
                    v.cascade.showSearch
                      ? { filter: (inputValue, path) => filter(inputValue, path, v.cascade.fieldNames.label) }
                      : false
                  "
                  :style="{ width: '100%' }"
                  placeholder=""
                >
                </a-cascader>
                <!-- 单选 -->
                <a-radio-group
                  v-else-if="v.type === 'radio'"
                  v-model="formObj[v.key]"
                  :disabled="disabled"
                >
                  <a-radio v-for="(val,key) in v.radio.dictionary" :key="key" :value="key">{{ val }}</a-radio>
                </a-radio-group>
                <!-- 单选按钮 -->
                <a-radio-group
                  v-else-if="v.type === 'radioButton'"
                  v-model="formObj[v.key]"
                  :disabled="disabled"
                >
                  <a-radio-button v-for="(val,key) in v.radioButton.dictionary" :key="key" :value="key">
                    {{ val }}
                  </a-radio-button>
                </a-radio-group>
                <!-- 上传 -->

                <div
                  v-else-if="v.type === 'upload'"
                  style="height: 40px;width:100%"
                >
                  <div style="position: relative;">
                    <a-upload
                      name="file"
                      :multiple="true"
                      :file-list="formObj[v.key]"
                      :remove="file=>handleRemove(file,v.key)"
                      :before-upload="file=>beforeUpload(file,v.key)"
                      style="position:absolute;width:100%"
                    >
                      <a-button><a-icon type="upload"></a-icon>选择文件</a-button>
                    </a-upload>
                    <a v-if="v.download.show" style="margin-left: 120px;position:absolute" @click="downLoadTemplate(v.download.emit)">模板下载</a>
                  </div>

                </div>
              </a-form-model-item>
            </a-col>

          </a-row>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            modal: {
              size: 'middle',
              title: '弹窗',
            },
            form: {
              list: {},
            },
          }
        },
      },
    },
    data () {
      const filterOption = (input, option) => {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      return {
        visible: false, // 显示
        spinning: false, // 加载
        formObj: {},
        filterOption,
        tempConfig: {},
        fileList: [],
      }
    },
    computed: {
      // 标题
      title () {
        return this.tempConfig.modal.title
      },
      // 布局参数
      layout () {
        return this.tempConfig.modal.layout
      },
      // 关闭
      closeEmit () {
        return this.tempConfig.modal.close.emit
      },
      // 弹窗底部按钮
      footerBtnList () {
        return this.tempConfig.modal.footer.btnList
      },
      // 表单数组
      formList () {
        const tempList = this._.cloneDeep(this.tempConfig.form.list)
        tempList.map(n => {
          if (this._.isArray(n.key)) {
            n.key = n.key.join('&')
          }
          return n
        })
        console.log(tempList)
        return tempList
      },
      // 规则
      rules () {
        const rules = this._.cloneDeep(this.tempConfig.form.rules)
        if (rules && Object.keys(rules).length > 0) {
          console.log()
          return rules
        }
        return {}
      },
      // 内容提示
      placeholder () {
        return ''
      },
      // 是否禁用
      disabled () {
        return false
      },
    },
    watch: {
      config: {
        immediate: true,
        deep: true,
        handler (val) {
          this.tempConfig = val
        },
      },
    },
    methods: {
      // 获取表单项col比
      getCol (columns) {
        // 默认使用第一项
        const defaultCol = this.layout.grid[1].col
        return this.layout.grid[columns] ? this.layout.grid[columns].col : defaultCol
      },
      // 获取栅格span值
      getSpan (columns) {
        // 默认使用第一项
        const defaultSpan = this.layout.grid[1].span
        return this.layout.grid[columns] ? this.layout.grid[columns].span : defaultSpan
      },
      // 开启弹窗
      handleOpen (formData) {
        this.visible = true
        this.formObj = { ...formData }
      },
      // 统一处理事件
      handleAction (emit) {
        this.$emit(emit, this)
      },
      // 日期区间重新选值回填
      handleDateRange (val, key) {
        this.formObj[key] = val
      },
      // 级联重新选值回填
      handleCascade (val, key) {
        this.formObj[key] = val
      },
      // 移除文件
      handleRemove (file, key) {
        const index = this.formObj[key].indexOf(file)
        const newFileList = this.formObj[key].slice()
        newFileList.splice(index, 1)
        this.formObj[key] = newFileList
      },
      // 手动上传
      beforeUpload (file, key) {
        this.formObj[key] = [file]
        this.formObj = { ... this.formObj }
        return false
      },
      // 下载附件
      downLoadTemplate (emit) {
        this.$emit(emit, {})
      },
      // 关闭弹窗
      closeModal () {
        this.visible = false
        this.formObj = {}
      },
      // 获取值
      getData () {
        return new Promise((resolve, reject) => {
          this.$refs.formObj.validate(valid => {
            if (valid) {
              resolve(this.formObj)
            } else {
              reject('校验不通过')
              return false
            }
          })
        })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
