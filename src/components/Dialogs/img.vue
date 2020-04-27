<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
  >

    <img
      :src="src"
      alt=""
    >
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    src: String,
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
    }
  },
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    if (this.value) {
      this.visible = true
    }
  }

}
</script>

<style>
</style>
