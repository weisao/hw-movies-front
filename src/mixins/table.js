export default {
  data () {
    const defaultPaginationOptions = {
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal (total) {
        return `共 ${total} 条`
      },
      current: 1,
      pageSize: 10,
      total: 0,
    }

    const defaultPaginationData = {
      current: 1,
      pageSize: 10,
    }

    const tableLoading = false

    return {
      selectedRowKeys: [],
      selectedSubRowKeys: {}, // 对象形式，按行key分组
      defaultPaginationOptions,
      defaultPaginationData,
      tableLoading,
      paginationOptions: {},
    }
  },
  methods: {
    /**
     * 表格渲染带tooltip显示值
     * @param text 字段值
     * @returns {{children: *}}
     */
    customRenderWithTitle (text) {
      const value = text === null || text === undefined || text === '' ? '' : text
      const placement = `${value}`.length > 5 ? 'topLeft' : 'top'
      return {
        // children: text === null ? '暂无' : text,
        children: (
          <a-tooltip placement={placement} title={value} overlayClassName='scrolled-tooltip'>
            {value}
          </a-tooltip>
        ),
      }
    },
    /**
     * 表格渲染带tooltip显示值,并有特殊搜索值
     * @param text 字段值
     * @returns {{children: *}}
     */
    customRenderWithSearchTitle (text, searchValue) {
      const value = text === null || text === undefined || text === '' ? '' : text
      const placement = `${value}`.length > 5 ? 'topLeft' : 'top'
      return {
        children: (
          <a-tooltip placement={placement} title={value} overlayClassName='scrolled-tooltip'>
            {value.indexOf(searchValue) > -1 ? (
              <span>
                {value.substr(0, value.indexOf(searchValue))}
                <span style='color:#f50'>{searchValue}</span>
                {value.substr(value.indexOf(searchValue) + searchValue.length)}
              </span>
            ) : (
              <span>{value}</span>
            )}
          </a-tooltip>
        ),
      }
    },
    /**
     * 表格渲染带删除线显示
     * @param text 当前值
     * @param record 当前行
     * @param newKey 替换值的key
     * @returns {*}
     */
    customRenderUpdateLine (text, record, newKey) {
      // console.log('zzzz', text, record, newKey)
      if (record[newKey] === undefined) {
        return {
          children: (
            <a-tooltip placement='topLeft' title={text} overlayClassName='scrolled-tooltip'>
              <span>{text}</span>
            </a-tooltip>
          ),
        }
      } else {
        return {
          children: (
            <span>
              <a-tooltip placement='topLeft' title={text} overlayClassName='scrolled-tooltip'>
                <span class='truncated deleted-cell-value'>{text}</span>
              </a-tooltip>
              <a-tooltip placement='topLeft' title={record[newKey]} overlayClassName='scrolled-tooltip'>
                <span>{record[newKey]}</span>
              </a-tooltip>
            </span>
          ),
        }
      }
    },
    /**
     * 表格渲染带tooltip根据字典表显示值
     * @param text 字段值
     * @param dic 字典表
     * @returns {{children: *}|*|{children: *}}
     */
    customRenderWithDic (text, dic, multiple) {
      let value = null
      if (this._.isObjectLike(dic)) {
        if (multiple) {
          const multipleArr = text ? text.split(',') : []
          const textArr = []
          multipleArr.forEach(item => {
            const dictText = Array.isArray(dic)
              ? this._.find(dic, { value: item })
                ? this._.find(dic, { value: item }).text
                : item
              : dic[item] === undefined
                ? item
                : dic[item]
            textArr.push(dictText)
          })
          value = textArr.join(',')
        } else {
          value = Array.isArray(dic)
            ? this._.find(dic, { value: text })
              ? this._.find(dic, { value: text }).text
              : text
            : dic[text] === undefined
              ? text
              : dic[text]
        }
        const placement = `${value}`.length > 5 ? 'topLeft' : 'top'
        return {
          children: (
            <a-tooltip placement={placement} title={value} overlayClassName='scrolled-tooltip'>
              {value}
            </a-tooltip>
          ),
        }
      } else {
        return this.customRenderWithTitle(text)
      }
    },
    /**
     * 表格渲染是否删除线显示，字典转化
     * @param argumentsObj Object:{  text(值), record(当前行数据), delKey(判断是否删除的key), dic(字典表), icon(图标), iconClick(图标点击事件) }
     * iconClick 阻止向上冒泡事件()=>{ event.stopPropagation(); }
     * @returns {{children: *}|*|{children: *}}
     */
    customRenderUpdateLineDic ({ text, record, delKey, dic, icon, iconClick }) {
      // const { text, record, delKey, dic, icon, iconClick } = argumentsObj
      // 判断是否有dic 字典值
      let value = text
      if (value === undefined) return
      if (this._.isObjectLike(dic)) {
        value = dic[text] === undefined ? text : dic[text]
      }

      return {
        children: (
          <a-tooltip placement='topLeft' title={value} overlayClassName='scrolled-tooltip'>
            <span class={delKey && record[delKey] && JSON.parse(record[delKey]) ? 'truncated deleted-cell-value' : ''}>
              {value}
            </span>
            {icon ? <a-icon type={icon} onClick={iconClick || function () {}}></a-icon> : ''}
          </a-tooltip>
        ),
      }
    },
    /**
     * 根据多个合并列获取合并后的值
     * @param tableData
     * @param index
     * @param mergeKey
     * @returns {*}
     */
    handleRowTextFromMergeKey (tableData, index, mergeKey) {
      return this._.reduce(
        mergeKey,
        (sum, n) => {
          return sum + this._.get(tableData[index], n)
        },
        '',
      )
    },
    /**
     *
     * @param text
     * @param record
     * @param index
     * @param tableData 表数据
     * @param mergeKey 作为判断合并依据的列名, 数组格式
     * @returns {{children: *, attrs: {}}}
     */
    customRenderMergeRow ({ text, record, index, tableData, mergeKey, delKey, dic, icon, iconClick }) {
      const mergeText = this.handleRowTextFromMergeKey(tableData, index, mergeKey)

      const obj = {
        children: text,
        attrs: {},
      }
      let sameRowCount = 1

      if (index !== 0 && this.handleRowTextFromMergeKey(tableData, index - 1, mergeKey) === mergeText) {
        sameRowCount = 0
      } else {
        for (let i = index + 1; i < tableData.length; i++) {
          if (mergeText === this.handleRowTextFromMergeKey(tableData, i, mergeKey)) {
            sameRowCount++
          } else {
            break
          }
        }
      }

      obj.attrs.rowSpan = sameRowCount
      Object.assign(obj, this.customRenderUpdateLineDic({ text, record, delKey, dic, icon, iconClick }))

      return obj
    },
    getDefaultPaginationData () {
      return this.defaultPaginationData
    },
    /**
     * 嵌套表格父表格每行选中改变
     * @param selectedRowKeys 字符串数组
     * @param selectedRows
     * @param subDataName 子数据集合名称
     */
    onNestedSelectChange (selectedRowKeys, selectedRows, subDataName) {
      // console.log(selectedRowKeys, selectedRows)
      // console.log('onNestedSelectChange')
      this.selectedRowKeys = selectedRowKeys

      // 对勾选的父表格行遍历
      this._.each(selectedRows, n => {
        // console.log(this.selectedSubRowKeys[n.key])
        // 子表格存在勾选又非全选则为半勾选状态，不对子表格重新勾选
        if (!this.selectedSubRowKeys[n.key].length) {
          this.selectedSubRowKeys[n.key] = this._.map(n[subDataName], 'key')
        }
      })

      // 对未勾选的父表格行遍历，清空子表格勾选
      this._.each(this.selectedSubRowKeys, (v, k) => {
        // console.log(v, k)
        if (selectedRowKeys.indexOf(k) < 0) {
          this.selectedSubRowKeys[k] = []
        }
      })
    },
    /**
     * 嵌套表格子表格每行选中改变
     * @param selectedRowKeys 字符串数组
     * @param parentKey
     */
    onNestedSelectSubChange (selectedRowKeys, parentKey) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys)
      // console.log('onNestedSelectSubChange')
      if (selectedRowKeys.length) {
        if (this.selectedRowKeys.indexOf(parentKey) < 0) {
          this.selectedRowKeys.push(parentKey)
        }
      } else {
        this.selectedRowKeys = this._.remove(this.selectedRowKeys, n => {
          return n !== parentKey
        })
      }

      this.selectedSubRowKeys[parentKey] = this._.uniq(selectedRowKeys)
      this.$forceUpdate()
    },
    /**
     * 嵌套表格子表格切换全选
     * @param selected
     * @param selectedRows
     * @param parentKey
     */
    onNestedSelectSubAll (selected, selectedRows, parentKey) {
      // console.log('onNestedSelectSubAll')
      const selectedRowKeys = this._.map(selectedRows, 'key')
      // console.log(selected, selectedRows, selectedRowKeys, parentKey)
      if (selected) {
        if (this.selectedRowKeys.indexOf(parentKey) < 0) {
          this.selectedRowKeys.push(parentKey)
        }
      } else {
        this.selectedRowKeys = this._.remove(this.selectedRowKeys, n => {
          return n !== parentKey
        })
      }
      this.selectedSubRowKeys[parentKey] = [...selectedRowKeys]
      // this.selectedSubRowKeys[parentKey] = selectedRowKeys
    },
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    /**
     * 单选行点击勾选
     * @param record
     * @param index
     * @returns {{on: {click: on.click}}}
     */
    handleRadioCustomRow (record, index) {
      return {
        on: {
          click: event => {
            this.selectedRowKeys = [record.key]
            this.$forceUpdate()
          },
        },
      }
    },
    /**
     * 多选行点击勾选
     * @param record
     * @param index
     * @returns {{on: {click: on.click}}}
     */
    handleCheckboxCustomRow (record, index) {
      return {
        on: {
          click: event => {
            if (this.selectedRowKeys.includes(record.key)) {
              this._.remove(this.selectedRowKeys, n => n === record.key)
            } else {
              this.selectedRowKeys.push(record.key)
            }
            this.$forceUpdate()
          },
        },
      }
    },
    /**
     * dom hack 合并rowSelection列的处理方法，合并后的rowKey为合并行中第一行的rowKey
     * todo 全选和反选存在bug，被合并的行其实还“存在”，对应的rowKey在全选下还是会被勾选，可能会造成困扰
     * todo 可以选择取消全选按钮或者进行后续逻辑过滤
     * @param tableRef table组件的ref
     * @param mergeKey 作为判断合并依据的列名, 数组格式
     */
    handleMergeRowSelection (tableRef, mergeKey) {
      const tableData = tableRef.dataSource
      if (tableData.length) {
        const tbody = tableRef.$el.querySelector('tbody') // .querySelector('tbody.ant-table-body')
        const trSet = tbody.querySelectorAll('tr')
        for (let i = 0; i < trSet.length; i++) {
          const mergeText = this.handleRowTextFromMergeKey(tableData, i, mergeKey)

          let sameRowCount = 1
          if (i !== 0 && this.handleRowTextFromMergeKey(tableData, i - 1, mergeKey) === mergeText) {
            sameRowCount = 0
          } else {
            for (let j = i + 1; j < tableData.length; j++) {
              if (mergeText === this.handleRowTextFromMergeKey(tableData, j, mergeKey)) {
                sameRowCount++
              } else {
                break
              }
            }
          }

          const tr = trSet[i]
          const rowSelectTd = tr.querySelector('.ant-table-selection-column')

          // ie 下 rowSpan 设置 0 会报错
          if (sameRowCount) {
            rowSelectTd.rowSpan = sameRowCount
            if (rowSelectTd.style.display === 'none') {
              rowSelectTd.removeAttribute('style')
            }
          } else {
            // rowSelectTd && rowSelectTd.parentNode && rowSelectTd.parentNode.removeChild(rowSelectTd)
            rowSelectTd && (rowSelectTd.style.display = 'none')
          }
        }
      }
    },
    /**
     * 执行表格数据校验方法，类似form表单校验方法，不同为单步校验，即有异常即停
     * @param {*} tableFieldRules
     * example： // 规则 required 必填， validator 多用于当前的格式校验 ，correlation 校验，会传入整个表格进行校验，多用于重复校验
     * tableFieldRules: {
     *  uid: {  // 需校验的字段名
     *    label: 'ID',  //  字段名称
     *    rules: [{ required: true, message: 'ID为空' }, {validator: this.validator}，{ correlation: this.checkIDUnique }],
     *  }
     * },
     * @param {*} callback 回调函数
     * @return {*}
     */
    // validateTableFields (tableFieldRules, data, callback) {
    //   const tableData = this._.cloneDeep(data)
    //   const fieldRules = tableFieldRules
    //   for (let i = 0; i < tableData.length; i++) {
    //     for (const key in fieldRules) {
    //       for (const rule of fieldRules[key].rules) {
    //         if (rule.required) {
    //           // 判断必填
    //           if (!tableData[i][key] || !tableData[i][key].trim()) { // 校验
    //             this.$message.warning(`第${i + 1}行${rule.message}`)
    //             return callback(false, { index: i, msg: rule.message })
    //           }
    //         }
    //         /* 判断自定义方法 */
    //         if (rule.validator) {
    //           let resMsg = ''
    //           rule.validator(key, tableData[i][key], res => { resMsg = res })
    //           if (resMsg) {
    //             this.$message.warning(`第${i + 1}行${(fieldRules[key].label ? fieldRules[key].label : key) + resMsg}`)
    //             return callback(false, { index: i, msg: resMsg })
    //           }
    //         }
    //         /* 判断相关校验 */
    //         if (rule.correlation) {
    //           let resMsg = ''
    //           rule.correlation(key, i, tableData[i], res => { resMsg = res }) // key index row callback
    //           if (resMsg) {
    //             this.$message.warning(`第${i + 1}行${(fieldRules[key].label ? fieldRules[key].label : key) + resMsg}`)
    //             return callback(false, { index: i, msg: resMsg })
    //           }
    //         }
    //       }
    //     }
    //   }
    //   return callback(true)
    // },
  },
  mounted () {
    this.paginationOptions = this._.cloneDeep(this.defaultPaginationOptions)
  },
}
