<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Pane',
  props: {
    className: String
  },
  data () {
    const classes = [this.$parent.split, this.className]
    return {
      classes: classes.join(' '),
      percent: 50
    }
  }
}
</script>

<style scoped>
.splitter-pane.vertical.splitter-paneL {
  float: left;
  padding-right: 3px;
}
.splitter-pane.vertical.splitter-paneR {
  float: left;
  padding-left: 3px;
}
.splitter-pane.horizontal.splitter-paneL {
  float: left;
  top: 0px;
  width: 100%;
}
.splitter-pane.horizontal.splitter-paneR {
  float: left;
  bottom: 0px;
  width: 100%;
  padding-top: 3px;
}
</style>