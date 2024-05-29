
<script lang="jsx" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { useRouter } from 'vue-router'
import EditRenderConf from './EditRenderConf.vue'
import { deepClone } from '@/utils/index'
import MyTable from '@/components/Table/index.vue'
import PageRender from '@/components/PageRender/index.vue'
import FromDialog from '@/components/FormDialog/index.vue'
import { useMockServe } from '@/store/mockServe.js'
const mockServe = useMockServe()

const router = useRouter()

const curPageId = ref(undefined)
const pageList = ref([])

const getPageList = () => {
  pageList.value = mockServe.pageListAPI('get')
  curPageId.value = pageList.value?.[0]?.id || null

  if (!curPageId.value) {
    router.push('/')
    ElMessage.warning('请先创建页面')
  }
}

onMounted(() => {
  getPageList()
})

/**
 * @example item
 * {
 *  id,
 *  pageId,
 *  fieldName,
 *  required,
 *  listShow
 * }
 */
const configList = ref([])
const reRenderFlag = ref(false)
const getPageConfig = () => {
  // 获取当前页面的配置
  configList.value = mockServe.configListAPI('getListByBC', i => i.pageId === curPageId.value)
  reRenderFlag.value = !reRenderFlag.value
}

watch(() => curPageId.value, (val) => {
  val && getPageConfig()
}, { immediate: true })

const tableColumns = [
  {
    label: '字段',
    prop: 'fieldName',
  },
  {
    label: '是否必填',
    prop: 'required',
    render: ({ row }) => row.required ? '是' : '否',
  },
  {
    label: '列表显示',
    prop: 'listShow',
    render: ({ row }) => row.listShow ? '是' : '否',
  },
  {
    label: '操作',
    width: 150,
    render: ({ row }) => {
      return (
        <div>
          <el-button type="primary" onClick={() => toEdit(row)}>编辑</el-button>
          <el-button type="danger" onClick={() => toDelete(row)}>删除</el-button>
        </div>
      )
    },
  },
]

const toDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  mockServe.configListAPI('remove', row)
  getPageConfig()
}

const toAdd = () => {
  formDialogOption.value.title = '添加字段'
  formDialogOption.value.visible = true
  formDialogOption.value.formData = null
}

const toEdit = (row) => {
  formDialogOption.value.title = '编辑字段'
  formDialogOption.value.visible = true
  formDialogOption.value.formData = deepClone(row)
}

const toConfirm = async (formData) => {
  const params = {
    ...formData,
    pageId: curPageId.value,
  }
  mockServe.configListAPI('addOrUpdate', params)
  formDialogOption.value.visible = false
  getPageConfig()
}

const repeatValidator = formData =>
  (rule, value, callback) => {
    const { fieldCode } = formData
    const isRepeat = configList.value
      .filter(i => i.id !== formData.id)
      .some(i => i.fieldCode === fieldCode)
    if (isRepeat) {
      callback(new Error('字段编码重复'))
    } else {
      callback()
    }
  }

const formConfig = [
  {
    label: '字段名称',
    prop: 'fieldName',
    required: true,
  },
  {
    label: '字段编码',
    prop: 'fieldCode',
    required: true,
    validatorFn: [repeatValidator],
  },
  {
    label: '控件配置',
    prop: 'renderConf',
    defaultValue: () => ({ renderType: 'input', defaultValue: '' }),
    render: (formData, prop) =>
      <EditRenderConf v-model={formData[prop]}></EditRenderConf>,
  },
  {
    type: 'tabs',
    tabs: [
      {
        type: 'tab',
        tabName: '筛选条件',
        tabCode: 'filter',
        formConfig: [
          {
            label: '显示',
            prop: 'filterShow',
            defaultValue: true,
            render: (formData, prop) =>
              <ElSwitch v-model={formData[prop]}></ElSwitch>,
          },
        ],
      },
      {
        type: 'tab',
        tabName: '列表',
        tabCode: 'list',
        formConfig: [
          {
            label: '显示',
            prop: 'listShow',
            defaultValue: true,
            render: (formData, prop) =>
              <ElSwitch v-model={formData[prop]}></ElSwitch>,
          },
        ],
      },
      {
        type: 'tab',
        tabName: '表单',
        tabCode: 'form',
        formConfig: [
          {
            label: '显示',
            prop: 'formShow',
            defaultValue: true,
            render: (formData, prop) =>
              <ElSwitch v-model={formData[prop]}></ElSwitch>,
          },
          {
            label: '是否必填',
            prop: 'required',
            render: (formData, prop) =>
              <ElSwitch v-model={formData[prop]}></ElSwitch>,
          },
        ],
      },
    ],
  },

]

const formDialogOption = ref({
  visible: false,
  width: 500,
  title: '添加字段',
  formData: null,
})
</script>

<template>
  <div class="config-wrapper">
    <div class="header-wrapper">
      <span>页面:</span>
      <el-select v-model="curPageId" style="width: 250px;">
        <el-option
          v-for="page in pageList"
          :key="page.id"
          :label="page.pageName"
          :value="page.id"
        >
        </el-option>
      </el-select>
    </div>
    <div>
      <el-button type="primary" @click="toAdd">
        添加字段
      </el-button>
    </div>
    <MyTable :columns="tableColumns" :table-data="configList" />

    预览：
    <div class="preview-wrapper">
      <PageRender
        v-if="curPageId"
        :key="curPageId + reRenderFlag"
        :page-id="curPageId"
      />
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
.config-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  .header-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .preview-wrapper {
    height: 350px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius:5px;
    overflow: auto;
  }

}
:deep(.form-tabs) {
  --el-tabs-header-height: 30px;
  .el-tabs__header {
    margin-bottom: 5px;
  }

}
</style>
