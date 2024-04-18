function isObject(val) {
  return Object.prototype.toString.call(val).slice(8, -1) === 'Object'
}

function isArray(val) {
  return Object.prototype.toString.call(val).slice(8, -1) === 'Array'
}

/**
 * 对象深拷贝
 * @param {Object} obj 初始对象
 * @return {Object} 拷贝后对象
 */
export function deepClone(obj) {
  const result = isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === undefined || obj[key] === null) continue
      if (isObject(obj[key]) || isArray(obj[key])) {
        result[key] = deepClone(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}
