<template>
  <div class="page-mock">
    <h2 class="mock-title">{{ mockFileContent.filePath }}</h2>
    <mock-form :isEditor="true" :mockContent="mockFileContent"></mock-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from './../store'
import { ElMessage } from 'element-plus'
import { mockFormModel } from './../types'

const router = useRouter()
const route = useRoute()
const store = useStore()

const mockFileContent = computed((): mockFormModel | undefined => {
  let res = {}
  if (store.state.mocksFiles.length) {
    store.state.mocksFiles.forEach(item => {
      if (item.fileName === route.query.mock) {
        res = item
      }
    })
  }
  return res
})

watch(
  () => route.query,
  (query) => {
    if (route.path === '/mock' && !query.mock) {
      ElMessage.error('链接错误，自动跳转首页')
      router.replace('/home')
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
</style>
