<template>
  <div
    v-if="loaded || active"
    v-show="active"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    name: String
  },
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    active () {
      const active = this.$parent.name === this.name
      if (active) {
        this.loaded = active
      }
      return active
    }
  }
}
</script>

<style>
</style>
