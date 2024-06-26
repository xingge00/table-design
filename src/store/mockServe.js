import { defineStore } from 'pinia'
import { MOCK_SERVE } from '@/store/index'
import { deepClone } from '@/utils/index'

/**
 *
 * @param {*} store
 * @param {['clear', 'get', 'remove', 'addOrUpdate','getListByBC']} type
 * @param {*} field
 * @param {*} data
 * @returns
 */
const genAPI = (store, type, field, data) => {
  const doMap = {
    clear: () => {
      store[field] = []
    },
    getListByBC: () => {
      return deepClone(store[field].filter(data))
    },
    get: () => {
      if (data?.id) {
        return deepClone(store[field].find(i => i.id === data.id)) || null
      }
      return deepClone(store[field])
    },
    remove: () => {
      const index = store[field].findIndex(i => i.id === data.id)
      if (index !== -1) store[field].splice(index, 1)
    },
    addOrUpdate: () => {
      const index = store[field].findIndex(i => i.id === data.id)
      if (index === -1) {
        store[field].push({ ...data, id: `${Math.random()}` })
      }
      else {
        store[field].splice(index, 1, { ...data })
      }
    },
  }
  if (!doMap[type]) return console.error('api类型错误')
  return doMap[type](data)
}
export const useMockServe = defineStore({
  id: MOCK_SERVE,
  state: () => ({
    pageList: [],
    configList: [],

  }),
  getters: {

  },
  actions: {
    pageListAPI(type, data) {
      return genAPI(this, type, 'pageList', data)
    },
    configListAPI(type, data) {
      return genAPI(this, type, 'configList', data)
    },

  },
  persist: true,

})
