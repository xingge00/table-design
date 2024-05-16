<script>
import { ElTable } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'
import Column from './Column'
/** v-for遍历的table组件，可以使用render编写h函数 */
export default defineComponent({
  components: {
    Column,
  },

  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:tableData'],
  setup(props, { expose, emit }) {
    const newTableData = computed({
      get: () => props.tableData,
      set: val => emit('update:tableData', val),
    })

    const tableRef = ref(null)
    const key = computed(() => Symbol(props.columns))

    expose({
      getSelectionRows: () => tableRef.value.getSelectionRows(),
      clearSelection: () => tableRef.value.clearSelection(),
      getRef: () => tableRef.value,
    })
    return {
      key,
      tableRef,
      newTableData,
    }
  },
})
</script>

<template>
  <ElTable
    :key="key"
    ref="tableRef"
    border
    :data="newTableData"
    highlight-current-row
    class="global-table render-table"
    v-bind="$attrs"
  >
    <template #empty>
      <div class="no-data"></div>
    </template>
    <Column :columns="columns"></Column>
  </ElTable>
</template>

<style lang="scss" scoped></style>
