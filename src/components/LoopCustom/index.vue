<script setup>
import { computed } from 'vue'
import { deepClone } from '@/utils/index.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  defaultItem: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])
const getDefaultValue = () => deepClone(props.defaultItem)
console.log('props.modelValue', props.modelValue)
if (!Array.isArray(props.modelValue)) {
  console.error('LoopCustom 组件绑定的默认值错误，需要绑定一个数组')
}

const bindValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
</script>

<template>
  <div class="loop-custom-item-wrapper">
    <div v-for="(row, index) in bindValue" :key="index" class="loop-custom-item">
      <div>
        <slot :row="row" :index="index"></slot>
      </div>
      <span
        v-if="index === 0 || bindValue.length === 0"
        class="item-add"
        @click="bindValue.push(getDefaultValue())"
      >
        +
      </span>
      <span v-else class="item-remove" @click="bindValue.splice(index, 1)">
        -
      </span>
    </div>
    <span
      v-if="bindValue.length === 0"
      class="item-add"
      @click="bindValue.push(getDefaultValue())"
    >
      +
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .loop-custom-item-wrapper {
    & > .item-add {
      margin-top: 7px;
    }
  }
  .loop-custom-item {
    line-height: inherit;
    display: flex;
    // cursor: move;
  }
  .item-add,
  .item-remove {
    font-size: 19px;
    border-radius: 50%;
    padding: 2px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    margin: auto 0 auto 5px;
    flex:none;
    display: inline-block;
    cursor: pointer;
    &:hover {
      background: #f5f7fa;
    }
    &:active {
      background: #d9d9d9;
    }
  }
  .item-add {
    color: #358f80;
    border: 1px solid #358f80;
  }
  .item-remove {
    color: red;
    border: 1px solid red;
  }
</style>
