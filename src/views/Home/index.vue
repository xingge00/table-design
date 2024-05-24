
<script lang="jsx" setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MyTable from '@/components/Table/index.vue'
import { useMockServe } from '@/store/mockServe.js'

const mockServe = useMockServe()

const tempRow = ref({
  isEdit: true,
})
const tableData = ref([])
const columns = ref([
  {
    prop: 'pageName',
    label: '页面名称',
    render: ({ row }) =>
      row.isEdit
        ? <el-input vModel={row['pageName']} ></el-input>
        : row['pageName'],
  },
  {
    prop: 'pageRoute',
    label: '页面名称',
    render: ({ row }) =>
      row.isEdit
        ? <el-input vModel={row['pageRoute']} ></el-input>
        : row['pageRoute'],
  },
  {
    label: '操作',
    width: '150',
    align: 'center',
    render: ({ row }) =>
      row.isEdit
        ? <el-button text type="primary" onClick={() => toAdd(row)}>保存</el-button>
        : <div>
            <el-button text onClick={() => row.isEdit = true}>编辑</el-button>
            <el-button text type="danger" onClick={() => toDelete(row)}>删除</el-button>
          </div>,
  },
])

const getList = () => {
  tableData.value = (mockServe.pageListAPI('get') || []).concat(tempRow.value)
}

const validate = (row) => {
  if (!row.pageName || !row.pageRoute) {
    ElMessage.error('请输入完整信息')
    return false
  }
  const sameRouteCount = tableData.value.reduce((a, c) => a + Number(c.pageRoute === row.pageRoute), 0)
  if (sameRouteCount > 1) {
    ElMessage.error('路由已存在')
    return false
  }
  return true
}
const toAdd = (row) => {
  const isValid = validate(row)
  if (!isValid) return

  delete row.isEdit
  mockServe.pageListAPI('addOrUpdate', row)
  if (!row.id) {
    tempRow.value = { isEdit: true }
  }
  getList()
}

const toDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  mockServe.pageListAPI('remove', row)
  getList()
}

onMounted(() => {
  getList()
})
</script>

<template>
  <MyTable :table-data="tableData" :columns="columns"></MyTable>
</template>

<style lang="scss" scoped>
.search-bar {
  margin-bottom: 10px;
}
</style>
