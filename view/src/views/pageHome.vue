<template>
  <div class="page-home">
    <h2 class="home-item-title">cmock 简介</h2>
    <div class="home-item-content">cmock 用于根据接口自动生成 mock 文件，并根据 mock 文件起 mock 服务。</div>
    <h2 class="home-item-title">前言</h2>
    <div class="home-item-content">搭建 cmock 的缘由是因为项目前后端分离之后，在联调接口前，前后端协商接口数据结构，前端即可根据数据结构来进行数据 mock ，但后端接口一变更，前端又需要维护新的 mock 数据结构，无疑会增加维护成本，所以如果能根据接口自动生成 mock 文件，一是可以降低 mock 的维护成本，二是可以快速生成以前老的接口的数据结构。</div>
    <h2 class="home-item-title">原理分析</h2>
    <div class="home-item-content">
      <img class="image-style" src="https://img.fxss.work/article-164303624400033-production.png" alt="cmock原理图">
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.page-home {
  .image-style {
    width: 100%;
  }
}
</style>
