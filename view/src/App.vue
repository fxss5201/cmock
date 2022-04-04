<template>
  <el-config-provider :locale="locale">
    <el-container>
      <el-header class="border-bottom">
        <page-header ref="pageHeaderComponent"></page-header>
      </el-header>
      <el-container>
        <el-aside width="200px" class="page-aside-style">
          <page-aside></page-aside>
        </el-aside>
        <el-main id="pageMain" class="page-main-style">
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
import { reactive, ref, watch  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from './store'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import socket from './plugins/socket'

const locale = reactive(zhCn)

const router = useRouter()
const route = useRoute()
const store = useStore()

const pageHeaderComponent = ref(null)
socket.on("updateMocks", (mocksFiles) => {
  console.log(mocksFiles)
  mocksFiles.forEach((item: { body: { [x: string]: any } }) => {
    Object.keys(item.body).forEach(key => {
      item.body[key] = JSON.stringify(item.body[key])
    })
  })
  store.commit('setMocksFiles', mocksFiles)
  pageHeaderComponent.value && pageHeaderComponent.value.closeEvent()
})

watch(
  () => route.query,
  (query) => {
    const pageMain = document.querySelector('#pageMain')
    if (pageMain) pageMain.scrollTop = 0
  },
  {
    deep: true,
    immediate: true
  }
)
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
  max-height: calc(100vh - 141px);
  border-left: 1px solid var(--el-border-color);
}
</style>
