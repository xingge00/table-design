<script lang="jsx" setup>
import { onMounted, ref } from 'vue'
import MyTable from '@/components/Table'
import { useMockServe } from '@/store/mockServe.js'
const props = defineProps({
  pageId: String,
})

const mockServe = useMockServe()

const tableData = ref([])

const tableColumns = ref([])

const toEdit = (row) => {
  console.log('编辑', row)
}

const toDelete = (row) => {
  console.log('删除', row)
}
const initColumns = () => {
  let curPageId = props.pageId
  if (!curPageId) {
    // 没有传pageId，则默认渲染第一个页面
    const pageList = mockServe.pageListAPI('get')
    curPageId = pageList[0]?.id
  }

  const configList = mockServe.configListAPI('getListByBC', i => i.pageId === curPageId) || []
  const temp = configList.filter(cof => cof.listShow).map(cof => ({
    label: cof.fieldName,
    prop: cof.fieldCode,
  }))

  tableColumns.value = temp.concat([
    {
      label: '操作',
      width: 150,
      fixed: 'right',
      render: ({ row }) => {
        return (
          <div>
            <el-button text onClick={() => toEdit(row)}>编辑</el-button>
            <el-button text onClick={() => toDelete(row)}>删除</el-button>
          </div>
        )
      },
    },
  ])
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
  <el-button type="primary">
    新增
  </el-button>
  <MyTable :columns="tableColumns" :table-data="tableData" />
</template>

<style lang="scss" scoped>

</style>
