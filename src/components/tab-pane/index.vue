<template>
  <div>
    <slot></slot>
  </div>

</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      name: ''
    }
  },
  watch: {
    value (val) {
      this.name = val
    },
    name (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    if (this.value) {
      this.name = this.value
    }
  }

}
</script>

