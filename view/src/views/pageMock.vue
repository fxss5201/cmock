<template>
  <div class="page-mock">
    <h2 class="mock-title">{{ mockFileContent.filePath }}</h2>
    <mock-form :isEditor="true" :mockContent="mockFileContent"></mock-form>
    <el-divider border-style="dashed" />
    <h2 class="mock-title">尝试接口请求</h2>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item prop="bodyKey" label="请输入请求参数">
        <el-input v-model="ruleForm.bodyKey" :rows="2" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :placeholder="`请输入请求参数`" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="doHttpEventLoading" @click="doHttpEvent(ruleFormRef)">发送请求</el-button>
      </el-form-item>
      <el-form-item prop="response" label="展示请求结果">
        <el-input v-model="ruleForm.response" :rows="2" type="textarea" readonly :autosize="{ minRows: 2, maxRows: 6 }" :placeholder="`展示请求结果`" />
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

const doHttpEventLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  bodyKey: ''
})
const rules = reactive({
  bodyKey: [
    { required: true, message: '请输入请求参数', trigger: 'blur' },
    { required: true, message: '请输入请求参数', trigger: 'change' }
  ]
})
const doHttpEvent = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
</style>
