<script lang="jsx" setup>
import { placeholderSign } from 'element-plus/es/components/table-v2/src/private.mjs'
import { computed } from 'vue'
const props = defineProps({
  renderConf: { type: Object, default: () => ({ renderType: 'input' }) },
  modelValue: {},
})
const emit = defineEmits(['update:modelValue'])
const bindValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const Render = () => {
  const attrs = {
    placeholder: '默认值',
  }
  if (props.renderConf.renderType === 'number') return <ElInputNumber vModel={bindValue.value} {...attrs} ></ElInputNumber>
  if (props.renderConf.renderType === 'select') return <ElSelect vModel={bindValue.value} {...attrs}></ElSelect>
  if (props.renderConf.renderType === 'date') return <ElDatePicker vModel={bindValue.value} {...attrs}></ElDatePicker>
  return <ElInput vModel={bindValue.value} {...attrs}></ElInput>
}
</script>

<template>
  <Render></Render>
</template>

<style lang="scss" scoped>

</style>
