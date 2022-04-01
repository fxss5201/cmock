<template>
  <el-menu router>
    <el-menu-item v-for="item in menuList" :key="item.index" :route="item.route" :index="item.index">
      <el-tooltip
        effect="dark"
        placement="top-start"
        :content="item.name"
      >
        <div class="ellipsis" ref="menuItemName" style="min-width: 160px;">{{ item.name }}</div>
      </el-tooltip>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from './../store'

const store = useStore()
const menuList = computed(() => {
  return store.state.mocksFiles.map(item => {
    return {
      route: {
        path: '/mock', query: { mock: item.fileName }
      },
      index: item.fileName,
      name: item.name === '$name' ? item.filePath : item.name
    }
  })
})
</script>
