import { defineStore } from 'pinia'
import { DICT_STORE } from '@/store/index'

export const useDictStore = defineStore({
  id: DICT_STORE,
  state: () => ({
    dictList: [],
    itemDataList: [],
  }),
  getters: {
    allDict: (state) => {
      return state.itemDataList.reduce((acc, cur) => {
        if (!acc[cur.dictType]) {
          if (!state.dictList.some(i => i.open)) return acc
          acc[cur.dictType] = []
        }

        acc[cur.dictType].push(cur)
        return acc
      }, {})
    },
    dictTypeList: state => state.dictList,
  },
  actions: {
    initDicts() {
      this.dictList = [
        { dictType: 'gender', dictName: '性别', open: true },
        { dictType: 'role', dictName: '角色', open: true },
      ]
      this.itemDataList = [
        { dictType: 'gender', label: '男', value: 1 },
        { dictType: 'gender', label: '女', value: 2 },
        { dictType: 'role', label: '管理员', value: 1 },
        { dictType: 'role', label: '普通用户', value: 2 },
      ]
    },

  },
  persist: false,

})
