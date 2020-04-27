<template>
  <header class="example-header">
    <span>
      <slot></slot>
    </span>
  </header>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style>
.example-header {
  font-weight: 500;
  margin: 0px 0 10px;
  position: relative;
}
.example-header:before {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: #eee;
    position: absolute;
    top: 10px;
    left: 0;
}
.example-header span {
    display: inline-block;
    background: #fff;
    padding: 0 5px 10px;
    position: relative;
    margin-left: 30px;
    font-size: 14px;
}
</style>
