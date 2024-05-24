<script setup>
import { onMounted, ref } from 'vue'
import MyTable from '@/components/Table'
import { useMockServe } from '@/store/mockServe.js'
const props = defineProps({
  pageId: String,
})

const mockServe = useMockServe()

const tableData = ref([])

const tableColumns = ref([])

const initColumns = () => {
  let curPageId = props.pageId
  if (!curPageId) {
    // 没有传pageId，则默认渲染第一个页面
    const pageList = mockServe.pageListAPI('get')
    curPageId = pageList[0]?.id
  }

  const configList = mockServe.configListAPI('getListByBC', i => i.pageId === curPageId) || []
  tableColumns.value = configList.filter(cof => cof.listShow).map(cof => ({
    label: cof.fieldName,
    prop: cof.fieldCode,
  }))
}

const getTableData = () => {
  tableData.value = [
    { name: '张三', age: 1 },
    { name: '李四', age: 2 },
    { name: '王武', age: 3 },
  ]
}

onMounted(() => {
  initColumns()
  getTableData()
})
</script>

<template>
  <MyTable :columns="tableColumns" :table-data="tableData" />
</template>

<style lang="scss" scoped>

</style>
