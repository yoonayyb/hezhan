<template>
  <div>
    <el-select
      clearable
      placeholder="请选择"
      size="small"
      v-model="status"
    >
      <el-option
        label="待提交"
        value="0"
      ></el-option>
      <el-option
        label="审核中"
        value="1,2"
      ></el-option>
      <el-option
        label="审批不通过"
        value="5"
      ></el-option>
      <el-option
        label="审批通过"
        value="4"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      status: null
    }
  },
  watch: {
    status (val) {
      this.$emit('input', val)
      this.$emit('change')
    }
  }
}
</script>