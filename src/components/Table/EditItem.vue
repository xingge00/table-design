<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {},
  disabled: { type: Boolean, default: false },
  field: { type: [String, Number], default: '' },
  type: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const bindValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <el-input v-if="row.isEdit" v-model="bindValue[field]"></el-input>
  <template v-else>
    {{ bindValue[field] }}
  </template>
</template>
