
<script setup>
import { onMounted, ref, toRefs } from 'vue'
import { useMockServe } from '@/store/mockServe.js'
const mockServe = useMockServe()

const tableList = ref([])
const getList = () => {
  tableList.value = mockServe.pageListAPI('get')
}
onMounted(() => {
  getList()
})

const add = () => {
  mockServe.pageListAPI('addOrUpdate', {})
  getList()
}
const edit = (page) => {
  mockServe.pageListAPI('addOrUpdate', {
    ...page,
    haha: '111',
  })
  getList()
}

const remove = (item) => {
  mockServe.pageListAPI('remove', item)
  getList()
}

const clear = () => {
  mockServe.pageListAPI('clear')
  getList()
}
</script>

<template>
  <div>
    <div v-for="page in tableList" :key="page.id">
      {{ page.id }} {{ page.haha }}
      <el-button @click="remove(page)">
        -
      </el-button>
      <el-button @click="edit(page)">
        edit
      </el-button>
    </div>
    <div>
      <el-button @click="add">
        add
      </el-button>

      <el-button @click="clear">
        clear
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
