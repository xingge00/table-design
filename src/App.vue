
<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
console.log(router)
console.log(route)
console.log(router.getRoutes())
</script>

<template>
  <div id="app">
    <div class="nav-wrapper">
      <RouterLink v-for="menu in $router.getRoutes().slice(0, -2)" :key="menu.name" :to="menu.name">
        {{ menu.name }}
      </RouterLink>
    </div>
    <div class="main-wrapper">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$nav-height: 40px;
.nav-wrapper {
  display: flex;
  width: 100%;
  gap: 20px;
  height: $nav-height;
}
.main-wrapper {
  height: calc(100vh - #{$nav-height});
  overflow: auto
}
</style>
