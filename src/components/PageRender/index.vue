<script lang="jsx" setup>
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { deepClone } from '@/utils/index'
import MyTable from '@/components/Table'
import FromDialog from '@/components/FormDialog'
import { useMockServe } from '@/store/mockServe.js'
import { needLinkTypeList } from '@/utils/constant.js'
import RenderByRenderConf from '@/components/RenderByRenderConf'
const props = defineProps({
  pageId: String,
})

const mockServe = useMockServe()

const tableData = ref([])

const formDialogOption = ref({
  visible: false,
  title: '新增',
  formData: null,
})

const toAdd = () => {
  formDialogOption.value.visible = true
  formDialogOption.value.title = '新增'
  formDialogOption.value.formData = null
}

const toEdit = (row) => {
  formDialogOption.value.visible = true
  formDialogOption.value.title = '编辑'
  formDialogOption.value.formData = deepClone(row)
}

const toConfirm = (formData) => {
  console.log('formData', formData)
  if (!formData.id) {
    formData.id = Date.now()
    tableData.value.push(formData)
  }
  const target = tableData.value.find(i => i.id === formData.id)
  if (target) {
    Object.assign(target, formData)
  }
}

const toDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  tableData.value = tableData.value.filter(i => i !== row)
}

const configList = ref([])
const getConfigList = async () => {
  let curPageId = props.pageId
  if (!curPageId) {
    // 没有传pageId，则默认渲染第一个页面
    const pageList = mockServe.pageListAPI('get')
    curPageId = pageList[0]?.id
  }
  configList.value = mockServe.configListAPI('getListByBC', i => i.pageId === curPageId) || []
}

const tableColumns = ref([])
const initColumns = () => {
  const temp = configList.value.filter(cof => cof.listShow).map((cof) => {
    const col = {
      label: cof.fieldName,
      prop: cof.fieldCode,
    }

    const { renderType } = cof.renderConf
    if (needLinkTypeList.includes(renderType)) {
      col.render = ({ row }) =>
        <RenderByRenderConf
        listShow={true}
        vModel={row[cof.fieldCode]}
        renderConf={cof.renderConf}
        ></RenderByRenderConf>
    }
    if (renderType === 'date') {
      col.render = ({ row }) =>
        <span>{Array.isArray(row[cof.fieldCode]) ? row[cof.fieldCode].join('~') : row[cof.fieldCode]}</span>
    }
    return col
  })

  if (!temp.length) return

  tableColumns.value = temp.concat([
    {
      label: '操作',
      width: 150,
      fixed: 'right',
      render: ({ row }) => {
        return (
          <div>
            <el-button text type="primary" onClick={() => toEdit(row)}>编辑</el-button>
            <el-button text type="danger" onClick={() => toDelete(row)}>删除</el-button>
          </div>
        )
      },
    },
  ])
}

const formConfig = ref([])
const initFormDialog = () => {
  formConfig.value = configList.value
    .filter(cof => cof.formShow)
    .map(({ fieldName, fieldCode, renderConf, ...otherCof }) => ({
      label: fieldName,
      prop: fieldCode,
      defaultValue: renderConf?.defaultValue || undefined,
      renderConf,
      ...otherCof,
    }))
}

const getTableData = () => {
  tableData.value = []
}

onMounted(async () => {
  await getConfigList()
  initColumns()
  getTableData()

  initFormDialog()
})
</script>

<template>
  <div class="page-wrapper">
    <el-button type="primary" @click="toAdd">
      新增
    </el-button>
    <MyTable style="flex:1;" :columns="tableColumns" :table-data="tableData" />
    <div style="width:100%;background-color: blue;">
      123456
    </div>
    <FromDialog
      v-model:option="formDialogOption"
      label-width="80px"
      :form-config="formConfig"
      @confirm="toConfirm"
    ></FromDialog>
  </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  height: 100%;

}
</style>
