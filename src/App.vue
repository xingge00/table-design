
<script setup>
import { ref, watch } from 'vue'

import { useDictStore } from '@/store/dict.js'
import { useMessage } from '@/utils/useMessage.js'

const isChild = ref(!!window.location.href.includes('isChild=true'))

const dictStore = useDictStore()
const { initDicts } = dictStore
const iframeRef = ref(null)

let send
if (isChild.value) {
  const { sendMessage } = useMessage()
  send = sendMessage
} else {
  watch(() => iframeRef.value, () => {
    const { sendMessage } = useMessage(iframeRef.value)
    send = sendMessage
  })
}

setTimeout(() => {
  initDicts()
}, 1000)
</script>

<template>
  <div v-if="isChild" id="app">
    <div class="nav-wrapper">
      <RouterLink
        v-for="menu in [
          ...$router.getRoutes().slice(0, -2),
          // ...Array(30).fill({ name: '404' }),
        ]" :key="menu.name" :to="menu.name"
      >
        {{ menu.name }}
      </RouterLink>
    </div>
    <div class="main-wrapper">
      <RouterView />
    </div>
  </div>
  <div v-else>
    <el-button @click="send('openChild')">
      发消息
    </el-button>
    <iframe ref="iframeRef" src="http://127.0.0.1:7878/#/Home?isChild=true"></iframe>
  </div>
</template>

<style lang="scss" scoped>
$primary: var(--el-color-primary);
$nav-width: 150px;
#app {
  display: flex;
  height: 100vh;
  .nav-wrapper {
    display: flex;
    flex: none;
    flex-direction: column;
    width: $nav-width;
    height: 100%;
    overflow-y: auto;
    background-color: #fafafa;
    padding: 5px;
    box-sizing: border-box;
    & > a {
      padding: 8px;
      font-weight: 500;
      color: #000;
      text-decoration: none;
      border-radius: 5px;
      &.router-link-exact-active {
        color: #fff;
        background-color: $primary
      }
    }
  }
  .main-wrapper {
    padding: 8px;
    // box-sizing: border-box;
    width: calc(100% - #{$nav-width});
    overflow: auto
  }
}
</style>
