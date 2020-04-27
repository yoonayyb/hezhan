<template>
  <div :style="{'width':width,'transform':isShow?'':'translateX(100%)',height:height+'px'}" class="drawer">
    <div @click="hide" class="return">
      <icon-svg :name="isShow?'shouqi':'zhankai'"></icon-svg>
    </div>
    <!-- <div class="content"> -->
    <slot></slot>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: '40%',
      isShow: false,
      height: ''
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    clientH () {}
  },
  watch: {
    value: function (val) {
      this.isShow = val
    },
    isShow: function (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    // window.onresize = () => {
    // this.height = document.body.clientHeight
    // }
    if (this.value) {
      this.isShow = true
    }
  },
  methods: {
    hide () {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style lang="scss">
.drawer {
  width: 30%;
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  background-color: #fff;
  // border-left: 2px solid rgba(252, 248, 22, 0.3);
  transition: all 0.3s cubic-bezier(0, 1, 0.5, 1);
  z-index: 1050;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .content {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }
  .return {
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translate(-100%, -50%);
    svg {
      float: left;
      cursor: pointer;
      width: 25px;
      height: 138px;
      fill: yellow;
      background-color: #409eff;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }
    .info {
      text-align: center;
      float: left;
      padding: 5px;
      width: 40px;
      height: 40px;
      background-color: #999;
      color: #fff;
      font-size: 13px;
    }
  }
}
.drawer-head {
  // height: 35px;
  border-bottom: 1px solid #e5e5e5;
  padding: 5px;
  background-color: #cad0d7;
}
.drawer-body {
  width: 100%;
  // position: absolute;
  left: 0;
  top: 40px;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
  padding: 10px;
  padding-bottom: 150px;
  h5,
  h4 {
    margin: 12px 0;
    margin-top: 18px;
  }
}
.drawer-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #e5e5e5;
  background-color: #fff;
  z-index: 100;
  padding: 10px;
}
</style>
