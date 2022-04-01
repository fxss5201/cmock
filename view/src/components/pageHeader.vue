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
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from './../store'
import { mockItemModel, searchItemModel } from './../types'

const router = useRouter()
const route = useRoute()
const store = useStore()

const goHomeEvent = () => {
  router.push({ path: '/home' })
}

const mockList = computed((): mockItemModel[] => {
  return store.state.mocksFiles.map(item => {
    return {
      fileName: item.fileName,
      name: item.name,
      url: item.url,
      fileAllPath: item.fileAllPath
    }
  })
})

const searchList = computed((): searchItemModel[] => {
  let res: searchItemModel[] = []
  mockList.value.forEach(item => {
    res.push({
      value: item.fileName,
      path: item.fileName,
      fileAllPath: item.fileAllPath
    })
    res.push({
      value: item.name,
      path: item.fileName,
      fileAllPath: item.fileAllPath
    })
    res.push({
      value: item.url,
      path: item.fileName,
      fileAllPath: item.fileAllPath
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
</style>