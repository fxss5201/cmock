<template>
  <el-config-provider :locale="locale">
    <el-container>
      <el-header class="border-bottom">
        <page-header></page-header>
      </el-header>
      <el-container>
        <el-aside width="200px" class="page-aside-style">
          <page-aside></page-aside>
        </el-aside>
        <el-main class="page-main-style">
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-footer class="border-top">
        <page-footer></page-footer>
      </el-footer>
    </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
import { reactive  } from 'vue'
import { useStore } from './store'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import socket from './plugins/socket'

const locale = reactive(zhCn)
const store = useStore()
socket.on("updateMocks", (mocksFiles) => {
  console.log(mocksFiles)
  store.commit('setMocksFiles', mocksFiles)
})
</script>

<style lang="scss">
html, body {
  margin: 0;
  min-width: 1000px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--el-text-color-primary);
}
.page-aside-style .el-menu {
  border-right: 0;
  height: calc(100vh - 161px);
}
.page-main-style {
  border-left: 1px solid var(--el-border-color);
}
</style>
