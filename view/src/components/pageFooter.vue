<template>
  <div class="footer">
    <div class="link-box">
      <span>友情链接：</span>
      <a
        v-for="item in friendLink"
        :key="item.text"
        class="link-item"
        :href="item.link"
        target="_blank"
      >
        {{ item.text }}
      </a>
    </div>
    <div class="website-information">
      <span>
        Powered by
        <a
          class="link-item"
          href="https://github.com/fxss5201"
          target="_blank"
          style="margin: 0 5px"
        >
          fxss5201
        </a>
        © 2022-{{ curYear }}
      </span>
      <a class="link-item" :href="record_link" target="_blank" style="margin-left: 10px">{{ record }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from './../store'
import { friendLinkItemModel } from './../types'
const store = useStore()

const friendLink: friendLinkItemModel[] = JSON.parse(import.meta.env.VITE_friendLink)
const author = import.meta.env.VITE_author
const record = import.meta.env.VITE_record
const record_link = import.meta.env.VITE_record_link
const curYear = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.footer {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
}
.link-item {
  color: var(--el-text-color-primary);
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
.link-item + .link-item {
  margin-left: 10px;
}
</style>
