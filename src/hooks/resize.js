/**
 * IE 下进行表格大小计算严重损耗性能，暂时禁用高宽计算
 */
import { detectIE } from '@/utils/browser-detect'
import _ from 'lodash'

import {
  // ref,
  //  watch,
  // getCurrentInstance,
  computed,
  // reactive,
  nextTick,
} from '@vue/composition-api'

export default function resize (context) {
  const MIN_WIDTH = '1000'
  const OFFSET_WIDTH = 50
  const MIN_HEIGHT = '100'
  const OFFSET_HEIGHT = 180
  const IE_VERSION = detectIE()
  const DEFAULT_COLUMN_WIDTH = 200

  const layoutContentRectContainer = computed(() => {
    return context.root.$store.getters.layout.content.container
  })
  /**
   * 动态计算table所需宽度
   * @param minSize
   * @param offset
   * @param refs ref或selector
   * @returns {number}
   */
  function calculateWidth (minSize, offset, ...refs) {
    minSize = minSize || MIN_WIDTH
    offset = offset || OFFSET_WIDTH

    let refsTotalWidth = 0
    refsTotalWidth = refs.reduce((accumulator, current) => {
      const currentElem = getElementByRefOrSelector(current)

      const _total = _.reduce(
        currentElem,
        (t, curr) => {
          return t + calculateElementOuterWidth(curr)
        },
        0,
      )

      return accumulator + _total
    }, 0)
    const offsetTotal = offset + refsTotalWidth
    const t =
      layoutContentRectContainer.width - offsetTotal > minSize
        ? layoutContentRectContainer.width - offsetTotal
        : minSize
    // console.log('width', t)

    // todo ie11以下缩放有严重性能问题，需延时返回
    if (IE_VERSION && IE_VERSION < 11) {
      setTimeout(() => {
        const tbodySet = document.getElementsByClassName('ant-table-fixed')
        if (tbodySet.length) {
          for (let i = 0; i < tbodySet.length; i++) {
            const tbody = tbodySet[i]
            // const innerTbody = tbody.getElementsByTagName('ant-table-fixed')
            if (tbody.style.width === `${MIN_WIDTH}px`) tbody.style.width = `${t}px`
          }
        }
        return t
      }, 300)
      return MIN_WIDTH
    } else {
      return t
    }
  }
  /**
   * 动态计算table所需高度
   * @param minSize
   * @param offset
   * @param refs ref或selector
   * @returns {number}
   */
  function calculateHeight (minSize, offset, ...refs) {
    if (IE_VERSION) return undefined
    minSize = minSize || MIN_HEIGHT
    offset = offset || OFFSET_HEIGHT
    const refsTotalHeight = refs.reduce((accumulator, current) => {
      const currentElem = getElementByRefOrSelector(current)

      const _total = _.reduce(
        currentElem,
        (t, curr) => {
          return t + calculateElementOuterHeight(curr)
        },
        0,
      )

      return accumulator + _total
    }, 0)
    const offsetTotal = offset + refsTotalHeight
    // console.log(layoutContentRect.container.height,refs, offset, refsTotalHeight)
    const t =
      layoutContentRectContainer.height - offsetTotal > minSize
        ? layoutContentRectContainer.height - offsetTotal
        : minSize

    // todo 设置tbody最小高度与最大高度同步 dirty
    nextTick(() => {
      const tbodySet = document.getElementsByClassName('ant-table-body')
      if (tbodySet.length) {
        for (let i = 0; i < tbodySet.length; i++) {
          const tbody = tbodySet[i]
          const innerTbody = tbody.getElementsByTagName('tbody')

          if (tbody) tbody.style.minHeight = tbody.style.maxHeight
          if (innerTbody[0] && innerTbody[0].children.length === 0) {
            tbody.style.removeProperty('min-height')
          }
        }
      }
    })

    // todo ie11以下缩放有严重性能问题，需延时返回
    if (IE_VERSION && IE_VERSION < 11) {
      setTimeout(() => {
        const tbodySet = document.getElementsByClassName('ant-table-body')
        if (tbodySet.length) {
          for (let i = 0; i < tbodySet.length; i++) {
            const tbody = tbodySet[i]
            const innerTbody = tbody.getElementsByTagName('tbody')

            if (innerTbody[0] && innerTbody[0].children.length === 0) {
              tbody.style.removeProperty('min-height')
            } else {
              tbody.style.maxHeight = `${t}px`
              tbody.style.minHeight = `${t}px`
            }
          }
        }

        const innerTbodySet = document.getElementsByClassName('ant-table-body-inner')
        if (innerTbodySet.length) {
          for (let i = 0; i < innerTbodySet.length; i++) {
            const tbody = innerTbodySet[i]
            // if (tbody.style.maxHeight === MIN_HEIGHT + 'px') {
            if (tbody.style.maxHeight) {
              tbody.style.maxHeight = `${t}px`
            }
            // }
          }
        }
        return t
      }, 300)
      return MIN_HEIGHT
    } else {
      return t
    }
  }
  function calculateElementOuterWidth (element) {
    if (!element) return 0
    const width = element.offsetWidth
    const style = window.getComputedStyle(element)

    const _width = ['left', 'right']
      .map(side => {
        return parseInt(style[`margin-${side}`], 10)
      })
      .reduce((total, side) => {
        return total + side
      }, width)
    return _width
  }
  function calculateElementOuterHeight (element) {
    // console.log(element)
    if (!element) return 0
    const height = element.offsetHeight
    const style = window.getComputedStyle(element)

    const _height = ['top', 'bottom']
      .map(side => {
        return parseInt(style[`margin-${side}`], 10)
      })
      .reduce((total, side) => {
        return total + side
      }, height)
    return _height
  }
  /**
   * 根据ref或selector获取元素
   * @param target
   * @returns {Vue | Element | Vue[] | Element[] | *}
   */
  function getElementByRefOrSelector (target) {
    let targetElem
    // 获取当前实例所有ref节点
    const refs = context.refs
    if (refs[target]) {
      targetElem = refs[target].$el
    }

    if (isNaN(Number(target))) {
      targetElem = targetElem || document.querySelectorAll(target)
    }

    return targetElem
  }

  /**
   * 根据表头动态计算宽度
   * @param columns
   * @returns {*}
   */
  function calcWidthByColumns (columns) {
    return columns.reduce((a, c) => a + (c.width || DEFAULT_COLUMN_WIDTH), 0)
  }
  return {
    MIN_WIDTH,
    OFFSET_WIDTH,
    MIN_HEIGHT,
    OFFSET_HEIGHT,
    IE_VERSION,
    DEFAULT_COLUMN_WIDTH,
    calculateWidth,
    calculateHeight,
    calculateElementOuterHeight,
    getElementByRefOrSelector,
    calcWidthByColumns,
  }
}
