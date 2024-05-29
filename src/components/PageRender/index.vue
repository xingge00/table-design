<script lang="jsx" setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { deepClone } from '@/utils/index'
import MyTable from '@/components/Table'
import SearchBar from '@/components/SearchBar'
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

const searchBarRef = ref(null)
const searchOption = ref([])
const initSearchBar = () => {
  searchOption.value = configList.value.filter(cof => cof.filterShow).map((cof) => {
    const col = {
      label: cof.fieldName,
      prop: cof.fieldCode,
      render: searhFromData =>
        <RenderByRenderConf
          style="width:150px;"
          vModel={searhFromData[cof.fieldCode]}
          renderConf={cof.renderConf}
          onChange={getTableData}
        ></RenderByRenderConf>,
    }

    return col
  })
}

const filterList = ref([])
const showTableData = computed(() => tableData.value.filter((row) => {
  return filterList.value.every(([key, value]) => {
    if (!value && value !== 0) return true
    return `${row[key]}`.includes(`${value}`)
  })
}))
const getTableData = () => {
  const searchData = searchBarRef.value.formData || {}

  filterList.value = Object.entries(searchData)
}

onMounted(async () => {
  await getConfigList()
  initColumns()
  initSearchBar()
  initFormDialog()

  getTableData()
})
</script>

<template>
  <div class="page-wrapper">
    <SearchBar
      ref="searchBarRef"
      title="搜索项"
      :search-option="searchOption"
      @toSearch="getTableData"
    ></SearchBar>
    <el-button type="primary" @click="toAdd">
      新增
    </el-button>
    <MyTable style="flex:1;" :columns="tableColumns" :table-data="showTableData" />

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
