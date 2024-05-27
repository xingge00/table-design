<script lang="jsx" setup>
import { computed } from 'vue'
import RenderByRenderType from '@/components/RenderByRenderType'
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      renderType: 'input',
    }),
  },
})
const emit = defineEmits(['update:modelValue'])

if (!props.modelValue) {
  emit('update:modelValue', {
    renderType: 'input',
  })
}

const bindValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    console.log('bindValue', val)
    emit('update:modelValue', val)
  },
})
</script>

<template>
  <div class="select-render-type-wrapper">
    <div class="custom-row">
      <el-select v-model="bindValue.renderType" class="select-type">
        <el-option label="文本" value="input"></el-option>
        <el-option label="数字" value="number"></el-option>
        <el-option label="单选" value="select"></el-option>
        <el-option label="日期" value="date"></el-option>
      <!-- <el-option label="级联" value="cascader"></el-option>
          <el-option label="图片" value="image"></el-option>
          <el-option label="文件" value="file"></el-option> -->
      </el-select>
      <RenderByRenderType
        v-model="bindValue.defaultValue"
        style="flex:1"
        :render-conf="bindValue"
      ></RenderByRenderType>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-render-type-wrapper {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  .custom-row {
    display: flex;
    gap: 5px;
    .select-type {
      width: 45%;
      flex: none;
    }
  }
}
</style>
