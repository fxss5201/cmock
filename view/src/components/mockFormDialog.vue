<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增 mock"
    width="80%"
    destroy-on-close
    @close="closeEvent"
  >
    <mock-form :isEditor="false"></mock-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close'])
const dialogVisible = ref(false)
watch(
  () => props.show,
  (show) => {
    dialogVisible.value = show
  }
)
function closeEvent() {
  emit('close')
}
</script>

<style lang="scss" scoped>

</style>