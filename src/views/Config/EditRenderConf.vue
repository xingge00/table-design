<script lang="jsx" setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import RenderByRenderConf from '@/components/RenderByRenderConf'
import LoopCustom from '@/components/LoopCustom'
import { useDictStore } from '@/store/dict.js'
import { needLinkTypeList } from '@/utils/constant.js'
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      renderType: 'input',
    }),
  },
})
const emit = defineEmits(['update:modelValue'])

const dictStore = useDictStore()
const { dictTypeList } = storeToRefs(dictStore)

if (!props.modelValue) {
  emit('update:modelValue', {
    renderType: 'input',
  })
}

const bindValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 需要展示数据来源的组件
watch(() => bindValue.value.renderType, (newVal) => {
  bindValue.value.defaultValue = undefined
  if (needLinkTypeList.includes(newVal)) {
    if (!bindValue.value.linkType) {
      bindValue.value.linkType = 0
    }
    if (!bindValue.value.apiUrl) {
      bindValue.value.apiUrl = ''
    }
    if (!Array.isArray(bindValue.value.customData)) {
      bindValue.value.customData = []
    }
  } else {
    bindValue.value.linkType = undefined
  }
  if (newVal === 'date') {
    bindValue.value.dateType = 'YYYY-MM-DD'
  }
})
watch([
  () => bindValue.value.linkType,
  () => bindValue.value.dictType,
  () => bindValue.value.dateType,
  () => bindValue.value.dateRange,
], () => {
  bindValue.value.defaultValue = undefined
})
</script>

<template>
  <div class="select-render-type-wrapper">
    <div class="custom-row">
      <span class="text-label">控件类型：</span>
      <el-select v-model="bindValue.renderType">
        <el-option label="输入框" value="input"></el-option>
        <el-option label="数字" value="number"></el-option>
        <el-option label="下拉框" value="select"></el-option>
        <el-option label="日期/时间" value="date"></el-option>
      <!-- <el-option label="级联" value="cascader"></el-option>
          <el-option label="图片" value="image"></el-option>
          <el-option label="文件" value="file"></el-option> -->
      </el-select>
    </div>
    <!-- 有数据来源的配置 -->
    <template v-if="needLinkTypeList.includes(bindValue.renderType)">
      <div class="custom-row">
        <span class="text-label">数据来源：</span>
        <el-radio-group v-model="bindValue.linkType">
          <el-radio :value="0">
            字典
          </el-radio>
          <el-radio :value="1">
            接口
          </el-radio>
          <el-radio :value="2">
            自定义
          </el-radio>
        </el-radio-group>
      </div>
      <div v-if="bindValue.linkType === 0" class="custom-row">
        <span class="text-label">字典类型：</span>
        <el-select v-model="bindValue.dictType">
          <el-option
            v-for="item in dictTypeList"
            :key="item.dictType"
            :label="item.dictName"
            :value="item.dictType"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="bindValue.linkType === 1" class="custom-row">
        <span class="text-label">接口地址：</span>
        <el-input v-model="bindValue.apiUrl"></el-input>
      </div>
      <div v-if="bindValue.linkType === 2" class="custom-row">
        <span class="text-label">自定义数据：</span>
        <LoopCustom v-model="bindValue.customData" :default-item="{}">
          <template #default="{ row, index }">
            <div class="custom-row">
              <span class="text-label">label：</span>
              <el-input v-model="row.label"></el-input>
              <span class="text-label">value：</span>
              <el-input v-model="row.value"></el-input>
            </div>
          </template>
        </LoopCustom>
      </div>
    </template>
    <!-- 日期/时间配置 -->
    <template v-else-if="['date'].includes(bindValue.renderType)">
      <div class="custom-row">
        <span class="text-label">日期格式：</span>
        <el-select v-model="bindValue.dateType" style="width: 60%;">
          <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
          <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
          <el-option label="YYYY" value="YYYY"></el-option>
          <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
        </el-select>
        <span class="text-label">范围：</span>
        <el-checkbox v-model="bindValue.dateRange"></el-checkbox>
      </div>
    </template>
    <div class="custom-row">
      <span class="text-label" style="width:60px">默认值：</span>
      <RenderByRenderConf
        v-model="bindValue.defaultValue"
        :render-conf="bindValue"
        style="flex: 1;"
      ></RenderByRenderConf>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-render-type-wrapper {
  box-sizing: border-box;
  width: 100%;
  // border: 1px solid #ccc;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: 5px;
  padding: 10px;
  .custom-row {
    display: flex;
    gap: 5px;
    margin-bottom: 5px;
    .text-label {
      font-size: 12px;
      text-align: right;
      flex: none;
    }

  }
}
</style>
