<template>
  <div class="flex-between height-all">
    <div class="page-name" @click="goHomeEvent">cmock</div>
    <div class="menu-nav">
      <el-autocomplete
        v-model="searchValue"
        :fetch-suggestions="querySearch"
        :prefix-icon="Search"
        clearable
        placeholder="请输入搜索内容"
        @select="handleSelect"
      />
      <el-button :icon="Plus" @click="addMockEvent" class="mgl12">新增接口</el-button>
    </div>
  </div>
  <mock-form-dialog :show="dialogVisible" @close="closeEvent"></mock-form-dialog>
</template>

<script setup lang="ts">
import { Search, Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from './../store'
import { mockItemModel, searchItemModel } from './../types'

const router = useRouter()
const route = useRoute()
const store = useStore()

const dialogVisible = ref(false)
defineExpose({
  closeEvent
})
function addMockEvent() {
  dialogVisible.value = true
}
function closeEvent() {
  dialogVisible.value = false
}
const goHomeEvent = () => {
  router.push({ path: '/home' })
}

const mockList = computed((): mockItemModel[] => {
  return store.state.mocksFiles.map(item => {
    return {
      fileName: item.fileName,
      name: item.name,
      url: item.url
    }
  })
})

const searchList = computed((): searchItemModel[] => {
  let res: searchItemModel[] = []
  mockList.value.forEach(item => {
    res.push({
      value: item.fileName,
      path: item.fileName
    })
    res.push({
      value: item.name,
      path: item.fileName
    })
    res.push({
      value: item.url,
      path: item.fileName
    })
  })
  return res
})

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? searchList.value.filter(createFilter(queryString))
    : searchList.value
  cb(results)
}
const createFilter = (queryString: string) => {
  return (searchItem: searchItemModel) => {
    return (
      searchItem.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
    )
  }
}

const searchValue = ref('')
const handleSelect = (item: searchItemModel) => {
  console.log(item)
  router.push({ path: '/mock', query: { mock: item.path } })
}
</script>

<style lang="scss" scoped>
.page-name {
  font-size: 26px;
  cursor: pointer;
}
.menu-nav {
  display: flex;
  align-items: center;
}
</style>