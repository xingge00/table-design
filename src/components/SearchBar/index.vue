<script lang="jsx" setup>
import { ref, useSlots } from 'vue'
const props = defineProps({
  searchOption: {
    type: Array,
    required: true,
    default: () => [],
  },
  title: { type: String, default: '' },
})

const emit = defineEmits(['toSearch'])
// 表单数据
const formData = ref({})
const slots = useSlots()

const toReset = () => {
  formData.value = {}
}

let timer = null
const toSearch = () => {
  // 防抖
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    emit('toSearch', formData.value)
    timer = null
  }, 200)
}

const exposeHandleReset = () => {
  // 防抖
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    toReset()
    emit('toSearch', formData.value)
    timer = null
  }, 200)
}

const Render = () => {
  const hasTitle = slots.title || props.title

  if (props.searchOption.length === 0) return null

  return (
    <div class="search-bar">
      {hasTitle && (
        <div class="title-bar">
          {slots.title ? slots.title() : <div class="title">{props.title || ''}</div>}
          <div class="custom-btn">{slots.default?.()}</div>
        </div>
      )}
      <div class="search-bar-inner">
        <el-form inline={true} model={formData.value} class="demo-form-inline">
          {props.searchOption.map(item => (
            <el-form-item label={item.label} prop={item.prop}>
              {item.render(formData.value)}
            </el-form-item>
          ))}

          <el-form-item class="form-btn-group">
            <el-button type="primary" onClick={toSearch}>查&nbsp;询</el-button>
          </el-form-item>
          <el-form-item class="form-btn-group">
            <el-button onClick={exposeHandleReset}>重&nbsp;置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  )
}

defineExpose({
  formData,
})
</script>

<template>
  <Render />
</template>

<style lang="scss" scoped>
.search-bar {
  width: 100%;
  padding: 0;
  border-radius: none;
  border-bottom: 1px solid #f5f5f5;
  .title-bar {
    padding: 0 12px;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    // margin-bottom: 8px;
    .title {
      margin-bottom: 0;
    }
  }
  .custom-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }
}
:deep(.demo-form-inline.el-form--inline) {
  padding: 5px 12px;
  .el-form-item {
    margin-bottom: 8px;
    margin-right: 10px;
  }
}
</style>
