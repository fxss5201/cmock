<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" v-loading="loading">
    <el-form-item prop="name" label="接口名称">
      <el-input v-model="form.name" placeholder="请输入接口名称" clearable>
        <template v-if="isEditor" #append>
          <el-button class="copyBtn" :icon="CopyDocument" :data-clipboard-text="form.name" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="url" label="接口 url">
      <el-input v-model="form.url" placeholder="请输入接口 url" clearable>
        <template v-if="isEditor" #append>
          <el-button class="copyBtn" :icon="CopyDocument" :data-clipboard-text="form.url" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="method" label="接口方法">
      <el-select v-model="form.method" placeholder="请选择接口方法" clearable @change="methodChangeEvent">
        <el-option v-for="item in methodList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-if="isEditor" class="copyBtn mgl15" :icon="CopyDocument" :data-clipboard-text="form.method" />
    </el-form-item>
    <el-form-item prop="type" label="接口 type">
      <el-input v-model="form.type" placeholder="请输入接口 type" clearable>
        <template v-if="isEditor" #append>
          <el-button class="copyBtn" :icon="CopyDocument" :data-clipboard-text="form.type" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="timeout" label="接口 timeout">
      <el-input-number v-model="form.timeout" :step="10" placeholder="请输入接口 timeout" clearable />
      <el-button v-if="isEditor" class="copyBtn mgl15" :icon="CopyDocument" :data-clipboard-text="form.timeout" />
    </el-form-item>
    <el-form-item prop="isUseMockjs" label="是否使用mockjs">
      <el-switch v-model="form.isUseMockjs" @change="isUseMockjsChangeEvent" />
      <el-button v-if="isEditor" class="copyBtn mgl15" :icon="CopyDocument" :data-clipboard-text="form.isUseMockjs" />
    </el-form-item>
    <el-form-item prop="body" label="body">
      <el-alert title="表格中的 key 和 body 需要使用 JSON.parse ，所以请使用严格 JSON 格式" show-icon :closable="false" type="warning" />
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="操作" align="center" width="80">
          <template #default="scope">
            <el-button :icon="Delete" @click="deleteBodyEvent(scope)" />
          </template>
        </el-table-column>
        <el-table-column prop="key" label="参数" width="240">
          <template #default="scope">
            <el-input v-model="scope.row.key" :rows="2" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :disabled="scope.row.disabled" :placeholder="`请输入参数，例如${keyPlaceholder}`" />
            <el-button v-if="isEditor" class="copyBtn mgt12" :icon="CopyDocument" :data-clipboard-text="scope.row.key" />
          </template>
        </el-table-column>
        <el-table-column prop="body" label="返回数据">
          <template #default="scope">
            <el-input v-model="scope.row.body" :rows="2" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="请输入返回数据" />
            <el-button v-if="isEditor" class="copyBtn mgt12" :icon="CopyDocument" :data-clipboard-text="scope.row.body" />
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <el-button :icon="Plus" @click="addBodyEvent">添加 body</el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button @click="saveMockFormEvent(ruleFormRef)">{{ isEditor ? '更新接口' : '保存接口' }}</el-button>
      <el-button v-if="isEditor" @click="deleteMockFormEvent">删除接口</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, PropType, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Delete, Plus, CopyDocument } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { mockFormModel, mockBodyModel } from './../types'
import socket from './../plugins/socket'
import { useStore } from './../store'
import { propKey } from 'element-plus/es/utils'
import Clipboard from 'clipboard'

const props = defineProps({
  isEditor: {
    type: Boolean,
    default: false
  },
  mockContent: {
    type: Object as PropType<mockFormModel>,
    default: () => {}
  }
})

onMounted(() => {
  const clipboard = new Clipboard('.copyBtn')
  clipboard.on('success', function(e) {
    ElMessage.success('复制成功')
  })
})

const router = useRouter()
const route = useRoute()
const store = useStore()

const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const methodList = ['get', 'post', 'put', 'delete']
let tableData = reactive<mockBodyModel[]>([])
let form = reactive<mockFormModel>({
  fileName: '',
  filePath: '',
  name: '',
  url: '',
  method: '',
  type: 'application/json, text/plain, */*',
  isUseMockjs: false,
  timeout: 0,
  bodyKey: {},
  body: {},
})
watch(
  () => props.mockContent,
  (mockContent) => {
    Object.assign(form, mockContent)
    bodyKeyToTable()
  },
  {
    immediate: true,
    deep: true
  }
)
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
function bodyKeyToTable() {
  tableData.splice(0, tableData.length)
  Object.keys(form.body).forEach(item => {
    let bodyKey
    if (form.method === 'get') {
      bodyKey = item.replaceAll('___', '&')
      bodyKey = bodyKey.replaceAll('_', '=')
    } else {
      let bodyKeyObj: { [propName: string]: string } = {}
      let list: any = item.split('___')
      list = list.map((x: string) => x.split('_'))
      list.forEach((xList: string[]) => {
        bodyKeyObj[xList[0]] = xList[1]
      })
      bodyKey = JSON.stringify(bodyKeyObj)
    }
    tableData.push({
      key: bodyKey,
      body: form.body[item],
      disabled: item === 'mockTemplate' ? true : false
    })
  })
}
function addBodyEvent() {
  tableData.push({
    key: '',
    body: '',
    disabled: false
  })
}
function deleteBodyEvent(scope: any) {
  tableData.splice(scope.$index, 1)
}
function methodChangeEvent(val: any) {
  tableData.forEach(item => {
    if (!item.disabled) {
      item.key = ''
    }
  })
}
function isUseMockjsChangeEvent(val: any) {
  if (val) {
    let index = tableData.findIndex(x => x.key === 'mockTemplate')
    if (index === -1) {
      tableData.unshift({
        key: 'mockTemplate',
        body: '',
        disabled: true
      })
    }
  } else {
    let index = tableData.findIndex(x => x.key === 'mockTemplate')
    if (index > -1) {
      tableData.splice(index, 1)
    }
  }
}
function keyToBodyKey(key: string) {
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
function tableToObject() {
  let res: {[propName: string]: any} = {}
  tableData.forEach(item => {
    res[keyToBodyKey(item.key)] = JSON.parse(item.body)
  })
  return res
}
function tableDataRequired() {
  let res = true
  for (let i = 0, len = tableData.length; i < len; i++) {
    if (!tableData[i].key || !tableData[i].body) {
      res = false
      break
    }
  }
  return res
}
const saveMockFormEvent = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (tableData.length) {
        if (tableDataRequired()) {
          const fileName = form.url.replaceAll('/', '_')
          const mockFile = {
            ...form,
            body: tableToObject(),
            fileName,
            filePath: `${fileName}.js`
          }
          Object.keys(mockFile.body).forEach(key => {
            mockFile.body[key] = eval(mockFile.body[key])
          })
          socket.emit("updateMockFile", {
            ...mockFile,
            isEditor: props.isEditor
          })
        } else {
          ElMessage.error('请将 body 表格中的内容填写完整')
        }
      } else {
        ElMessage({
          message: '请填写 body 表格内容',
          type: 'warning',
        })
      }
    } else {
      if (form.name && form.url && form.method && form.type) {
        ElMessage.error('请检查 body 表格中的内容是否符合 JSON 格式')
      }
      console.log('error submit!', fields)
    }
  })
}
function deleteMockFormEvent() {
  socket.emit("deleteMockFile", form)
}
socket.on('mockFileExists', (mockFile: mockFormModel) => {
  ElMessage.error(`${mockFile.name === '$name' ? mockFile.filePath : mockFile.name}已存在`)
})
socket.on('addMockFileSuccess', (mockFile: mockFormModel) => {
  ElMessage.success(`${mockFile.name === '$name' ? mockFile.filePath : mockFile.name}创建成功`)
})
socket.on('updateMockFileSuccess', (mockFile: mockFormModel) => {
  ElMessage.success(`${mockFile.name === '$name' ? mockFile.filePath : mockFile.name}更新成功`)
})
socket.on('deleteMockFileSuccess', (mockFile: mockFormModel) => {
  ElMessage.success(`${mockFile.name === '$name' ? mockFile.filePath : mockFile.name}删除成功`)
  socket.emit("getMocks")
  if (route.query.mock === mockFile.fileName) {
    router.replace({
      path: '/mock',
      query: { mock: store.state.mocksFiles[0].fileName }
    })
  }
})
</script>

<style lang="scss" scoped>
.table-footer {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color);
  border-top: 0;
}
</style>
