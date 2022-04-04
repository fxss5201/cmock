<template>
  <div class="page-mock">
    <h2 class="mock-title">{{ mockFileContent.name === '$name' ? mockFileContent.filePath : mockFileContent.name }}</h2>
    <div style="margin-bottom: 15px;">更新时间：{{ mockFileContent.updateTime }}</div>
    <mock-form :isEditor="true" :mockContent="mockFileContent"></mock-form>
    <el-divider border-style="dashed" />
    <h2 class="mock-title">尝试接口请求</h2>
    <div style="margin-bottom: 15px;">调整完接口需要先更新接口再尝试接口请求。</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="120px"
    >
      <el-form-item prop="bodyKey" label="请输入请求参数">
        <el-input v-model="ruleForm.bodyKey" :rows="2" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="请输入请求参数" />
      </el-form-item>
      <el-form-item prop="responseType" label="请输入 axios responseType">
        <el-input v-model="ruleForm.responseType" placeholder="请输入 axios responseType" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="axiosIsLoading" @click="doHttpEvent(ruleFormRef)">发送请求</el-button>
      </el-form-item>
      <el-form-item prop="response" label="展示请求结果">
        <el-input v-model="ruleForm.response" :rows="2" type="textarea" readonly :autosize="{ minRows: 2, maxRows: 6 }" placeholder="展示请求结果" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from './../store'
import { ElMessage } from 'element-plus'
import { mockFormModel } from './../types'
import axiosInstance from './../plugins/http'
import { AxiosRequestConfig } from 'axios'
import qs from 'qs'

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
  return res as mockFormModel | undefined
})

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  bodyKey: '',
  responseType: 'json',
  response: ''
})

watch(
  () => route.query,
  (query) => {
    Object.assign(ruleForm, {
      bodyKey: '',
      responseType: 'json',
      response: ''
    })
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

let axiosIsLoading = ref(false)
const doHttpEvent = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (!mockFileContent.value?.isUseMockjs && !ruleForm.bodyKey) {
    ElMessage.error('请输入请求参数')
    return
  }
  if (!ruleForm.responseType) {
    ElMessage.error('请输入 axios responseType')
    return
  }
  let axiosConfig: AxiosRequestConfig = {
    url: mockFileContent.value?.url,
    method: mockFileContent.value?.method,
    responseType: ruleForm.responseType
  }
  if (axiosConfig.method?.toLowerCase() === 'get') {
    axiosConfig.params = qs.parse(ruleForm.bodyKey)
  } else {
    axiosConfig.data = JSON.parse(ruleForm.bodyKey)
  }
  doHttpFn(axiosConfig)
}
async function doHttpFn(axiosConfig: AxiosRequestConfig) {
  axiosIsLoading.value = true
  const res = await axiosInstance(axiosConfig)
  axiosIsLoading.value = false
  if (res.status === 200) {
    ruleForm.response = JSON.stringify(res.data)
  }
}
</script>

<style lang="scss" scoped>
</style>
