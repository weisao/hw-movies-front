import { format } from 'numerable'
// import _ from 'lodash'

// https://github.com/gastonmesseri/numerable
const replaceField = {
  'K': '千',
  'M': '百万',
  'B': '十亿',
}
/**
 * 数字添加中文单位
 * @param numStr
 * @param pattern
 * @returns {string}
 */
export function toCnUnit (numStr, pattern = '0.0') {
  const formatValue = format(numStr, pattern + ' a').split(' ')
  formatValue[1] = replaceField[formatValue[1]]
  return formatValue
}
console.log(toCnUnit('123456789'))
