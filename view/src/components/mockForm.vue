<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" v-loading="loading">
    <el-form-item prop="name" label="接口名称">
      <el-input v-model="form.name" placeholder="请输入接口名称" clearable />
    </el-form-item>
    <el-form-item prop="url" label="接口 url">
      <el-input v-model="form.url" placeholder="请输入接口 url" clearable />
    </el-form-item>
    <el-form-item prop="method" label="接口方法">
      <el-select v-model="form.method" placeholder="请选择接口方法" clearable>
        <el-option v-for="item in methodList" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item prop="type" label="接口 type">
      <el-input v-model="form.type" placeholder="请输入接口 type" clearable />
    </el-form-item>
    <el-form-item prop="timeout" label="接口 timeout">
      <el-input-number v-model="form.timeout" :step="10" placeholder="请输入接口 timeout" clearable />
    </el-form-item>
    <el-form-item prop="isUseMockjs" label="是否使用mockjs">
      <el-switch v-model="form.isUseMockjs" @change="isUseMockjsChangeEvent" />
    </el-form-item>
    <el-form-item prop="body" label="是否使用mockjs">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="操作" align="center" width="80">
          <template #default="scope">
            <el-button :icon="Delete" @click="deleteBodyEvent(scope)" />
          </template>
        </el-table-column>
        <el-table-column prop="key" label="参数" width="240">
          <template #default="scope">
            <el-input v-model="scope.row.key" :rows="2" type="textarea" autosize :placeholder="`请输入参数，例如${keyPlaceholder}`" />
          </template>
        </el-table-column>
        <el-table-column prop="body" label="返回数据">
          <template #default="scope">
            <el-input v-model="scope.row.body" :rows="2" type="textarea" autosize placeholder="请输入返回数据" />
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <el-button :icon="Plus" @click="addBodyEvent">添加 body</el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button @click="saveMockFormEvent(ruleFormRef)">保存接口</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { mockFormModel, mockBodyModel } from './../types'

const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const methodList = ['get', 'post', 'put', 'delete']
const form = reactive<mockFormModel>({
  name: '',
  url: '',
  method: '',
  type: 'application/json, text/plain, */*',
  isUseMockjs: false,
  timeout: 0,
  bodyKey: {},
  body: {},
})
const keyPlaceholder = computed(() => {
  return form.method === 'get' ? 'limit=10&page=1&justOriginal=false&order=0' : '{"from":"/detail/46#arrayprototypeunshift","to":"/","client":1}'
})
const rules = reactive({
  name: [
    { required: true, message: '请输入接口名称', trigger: 'blur' },
  ],
  url: [
    { required: true, message: '请输入接口 url', trigger: 'blur' },
  ],
  method: [
    { required: true, message: '请选择接口方法', trigger: 'change' },
    { required: true, message: '请选择接口方法', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择接口 type', trigger: 'blur' },
  ]
})
let tableData = reactive<mockBodyModel[]>([])
watch(
  () => form.body,
  (body) => {
    tableData = []
    Object.keys(body).forEach(item => {
      tableData.push({
        key: item,
        body: body[item]
      })
    })
  }
)
const addBodyEvent = () => {
  tableData.push({
    key: '',
    body: ''
  })
}
const deleteBodyEvent = (scope: any) => {
  tableData.splice(scope.$index, 1)
}
const isUseMockjsChangeEvent = (val: any) => {
  if (val) {
    tableData.unshift({
      key: 'mockTemplate',
      body: ''
    })
  } else {
    tableData.shift()
  }
}
const keyToBodyKey = (key: string) => {
  let res = ''
  if (form.method === 'get') {
    res = key.replaceAll('=', '_')
    res = res.replaceAll('&', '___')
  } else {
    let resObj = JSON.parse(key)
    let resList: string[] = []
    Object.keys(resObj).forEach(item => {
      resList.push(`${item}_${resObj[item]}`)
    })
    res = resList.join('___')
  }
  return res
}
const tableToObject = () => {
  let res: {[propName: string]: any} = {}
  tableData.forEach(item => {
    res[keyToBodyKey(item.key)] = JSON.parse(item.body)
  })
  return res
}
const saveMockFormEvent = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', {
        ...form,
        body: tableToObject()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
.table-footer {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color);
  border-top: 0;
}
</style>
