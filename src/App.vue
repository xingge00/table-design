
<script setup>
import { useDictStore } from '@/store/dict.js'

const dictStore = useDictStore()
const { initDicts } = dictStore

setTimeout(() => {
  initDicts()
}, 1000)
</script>

<template>
  <div id="app">
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
