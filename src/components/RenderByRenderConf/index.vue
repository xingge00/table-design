<script lang="jsx" setup>
/**
 * 此组件用于根据renderConf来渲染不同的组件
 * 暂时应用于formDialog渲染动态表单、配置renderConf的默认值
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDictStore } from '@/store/dict.js'
const props = defineProps({
  renderConf: { type: Object, default: () => ({ renderType: 'input' }) },
  modelValue: {},
  listShow: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const dictStore = useDictStore()
const { allDict } = storeToRefs(dictStore)

const bindValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const dataLoading = ref(false)
const cacheApiData = {}
const optionList = ref([])
const getData = async (url, params) => {
  if (!url) return
  let paramsStr = ''
  try {
    paramsStr = JSON.stringify(params)
  } catch (error) {
    console.error(`请求地址：${url}参数有误${params}`)
    console.error(error)
  }
  const key = url + paramsStr
  if (cacheApiData[key]) {
    optionList.value = cacheApiData[key]
    return
  }
  // 模拟请求数据
  dataLoading.value = true
  const res = await mockAPI().finally(() => {
    dataLoading.value = false
  })
  cacheApiData[key] = res

  // 如果请求接口结束后没有切换数据来源类型，使用接口数据
  if (props.renderConf.linkType === 1) {
    optionList.value = res
  }
}
const mockAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('请求结束')
      resolve([
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ])
    }, 1000)
  })
}
// 防抖
let timer
const Render = () => {
  console.log('render')
  const { renderType, placeholder, linkType, dictType, apiUrl, customData = [], dateType, dateRange } = props.renderConf

  const attrs = {
    placeholder: placeholder || ['select', 'date'].includes(renderType) ? '请选择' : '请输入',
    loading: dataLoading.value,
    clearable: true,
  }

  if (renderType === 'date') {
    const defaultDateFormat = 'YYYY-MM-DD'
    let type = 'date'

    if (dateType.includes('HH:mm:ss')) type += 'time'
    if (dateRange) type += 'range'
    Object.assign(attrs, {
      valueFormat: dateType || defaultDateFormat,
      format: dateType || defaultDateFormat,
      type,
      teleported: false,
    })
  }

  // 选项数据
  const getOptionList = () => {
    if (linkType === 0) {
      optionList.value = allDict.value[dictType] || []
    }
    if (linkType === 1) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        getData(apiUrl, { a: 1, b: 2 })
      }, 1000)
    }
    if (linkType === 2) {
      optionList.value = customData || []
    }
    return optionList.value
  }

  if (props.listShow) {
    return getOptionList()?.find(i => i.value === bindValue.value)?.label || '-'
  }

  if (renderType === 'number') return <ElInputNumber vModel={bindValue.value} {...attrs} ></ElInputNumber>
  if (renderType === 'date') return <ElDatePicker vModel={bindValue.value} {...attrs}></ElDatePicker>
  if (renderType === 'select') {
    return <ElSelect vModel={bindValue.value} {...attrs} vLoading={dataLoading.value}>
            {
              getOptionList().map(op =>
              <ElOption label={op.label} value={op.value}></ElOption>,
              )
            }
          </ElSelect>
  }
  return <ElInput vModel={bindValue.value} {...attrs}></ElInput>
}
</script>

<template>
  <Render></Render>
</template>

<style lang="scss" scoped>

</style>
