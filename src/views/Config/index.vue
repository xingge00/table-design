
<script lang="jsx" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { deepClone } from '@/utils/index'
import MyTable from '@/components/Table/index.vue'
import PageRender from '@/components/PageRender/index.vue'
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

const dialogShow = ref(false)
const getDefaultFormData = () => ({
  id: undefined,
  pageId: curPageId.value,
  fieldCode: '',
  fieldName: '',
  required: false,
  listShow: true,
})
const formData = ref({})
const formRef = ref(null)
const rules = {
  fieldName: [
    { required: true, message: '请输入字段名称', trigger: 'blur' },
  ],
  fieldCode: [
    { required: true, message: '请输入字段编码', trigger: 'blur' },
  ],
}

const toAdd = () => {
  formData.value = getDefaultFormData()
  dialogShow.value = true
}

const toEdit = (row) => {
  formData.value = deepClone(row)
  dialogShow.value = true
}

const handleConfirm = async () => {
  await formRef.value.validate()

  const params = {
    ...formData.value,
    pageId: curPageId.value,
  }
  mockServe.configListAPI('addOrUpdate', params)
  dialogShow.value = false
  getPageConfig()
}
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
      <PageRender :key="curPageId + reRenderFlag" :page-id="curPageId" />
    </div>

    <el-dialog
      v-model="dialogShow"
      title="添加字段"
      width="450px"
    >
      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item label="字段名称" prop="fieldName">
          <el-input v-model="formData.fieldName"></el-input>
        </el-form-item>
        <el-form-item label="字段编码" prop="fieldCode">
          <el-input v-model="formData.fieldCode"></el-input>
        </el-form-item>
        <el-form-item label="是否必填" prop="required">
          <el-switch v-model="formData.required"></el-switch>
        </el-form-item>
        <el-form-item label="列表显示" prop="listShow">
          <el-switch v-model="formData.listShow"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogShow = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
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
</style>
