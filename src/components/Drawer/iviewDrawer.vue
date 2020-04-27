<template>
    <div v-transfer-dom:data-transfer="transfer">
       <transition name="fade"> -->
           <div :class="maskClasses" :style="maskStyle" v-show="visible" v-if="mask" @click="handleMask"></div>
        </transition>

        <!-- <div :class="wrapClasses" @click="handleWrapClick"> -->
            <!-- <transition :name="'move-' + placement"> -->
                <div :class="classes" :style="mainStyles" v-show="visible">
                    <div :class="contentClasses" ref="content">
                        <a class="ivu-drawer-close" v-if="closable" @click="close">
                            <slot name="close">
                              <span>关闭</span>
                                <!-- <Icon type="ios-close"></Icon> -->
                            </slot>
                        </a>
                        <div :class="[prefixCls + '-header']" v-if="showHead"><slot name="header"><div :class="[prefixCls + '-header-inner']">{{ title }}</div></slot></div>
                        <div :class="[prefixCls + '-body']" :style="styles"><slot></slot></div>
                    </div>
                </div>
            <!-- </transition> -->
        <!-- </div> -->

    </div>
</template>
<script>
// import Icon from '../icon'
import TransferDom from '../../directives/transfer-dom'
const prefixCls = 'drawer'
function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}
let cached
function getScrollBarSize (fresh) {
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

function broadcast (componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
            // todo 如果 params 是空数组，接收到的会是 undefined
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}

export default {
  name: 'Drawer',
  directives: { TransferDom },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    width: {
      type: [Number, String],
      default: 256
    },
    closable: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskStyle: {
      type: Object
    },
    styles: {
      type: Object
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    placement: {
      validator (value) {
        return oneOf(value, ['left', 'right'])
      },
      default: 'right'
    },
    zIndex: {
      type: Number,
      default: 1000
    },
    transfer: {
      type: Boolean,
      default: true
    },
    className: {
      type: String
    },
    inner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      visible: this.value,
      wrapShow: false,
      showHead: true
    }
  },
  computed: {
    wrapClasses () {
      return [
        `${prefixCls}-wrap`,
        {
          [`${prefixCls}-hidden`]: !this.wrapShow,
          [`${this.className}`]: !!this.className,
          [`${prefixCls}-no-mask`]: !this.mask,
          [`${prefixCls}-wrap-inner`]: this.inner
        }
      ]
    },
    mainStyles () {
      let style = {}
      const width = parseInt(this.width)
      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`
      }
      Object.assign(style, styleWidth)
      return style
    },
    contentClasses () {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-no-mask`]: !this.mask
        }
      ]
    },
    classes () {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.placement}`,
        {
          [`${prefixCls}-no-header`]: !this.showHead,
          [`${prefixCls}-inner`]: this.inner
        }
      ]
    },
    maskClasses () {
      return [
        `${prefixCls}-mask`,
        {
          [`${prefixCls}-mask-inner`]: this.inner
        }
      ]
    }
  },
  methods: {
    close () {
      this.visible = false
      this.$emit('input', false)
      this.$emit('on-close')
    },
    broadcast (componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    },
    handleMask () {
      if (this.maskClosable && this.mask) {
        this.close()
      }
    },
    handleWrapClick (event) {
                // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
      const className = event.target.getAttribute('class')
      if (className && className.indexOf(`${prefixCls}-wrap`) > -1) this.handleMask()
    },
    checkScrollBar () {
      let fullWindowWidth = window.innerWidth
      if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
        const documentElementRect = document.documentElement.getBoundingClientRect()
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
      }
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
      if (this.bodyIsOverflowing) {
        this.scrollBarWidth = getScrollBarSize()
      }
    },
    checkMaskInVisible () {
      let masks = document.getElementsByClassName('ivu-modal-mask') || []
      return Array.from(masks).every(m => m.style.display === 'none' || m.classList.contains('fade-leave-to'))
    },
    setScrollBar () {
      if (this.bodyIsOverflowing && this.scrollBarWidth !== undefined) {
        document.body.style.paddingRight = `${this.scrollBarWidth}px`
      }
    },
    resetScrollBar () {
      document.body.style.paddingRight = ''
    },
    addScrollEffect () {
      this.checkScrollBar()
      this.setScrollBar()
      document.body.style.overflow = 'hidden'
    },
    removeScrollEffect () {
      if (this.checkMaskInVisible()) {
        document.body.style.overflow = ''
        this.resetScrollBar()
      }
    }
  },
  mounted () {
    if (this.visible) {
      this.wrapShow = true
    }
    let showHead = true
    if (this.$slots.header === undefined && !this.title) {
      showHead = false
    }
    this.showHead = showHead
  },
  beforeDestroy () {
    this.removeScrollEffect()
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      if (val === false) {
        // document.body.removeEventListener('click', this.close)
        this.timer = setTimeout(() => {
          this.wrapShow = false
          this.removeScrollEffect()
        }, 300)
      } else {
        // document.body.addEventListener('click', this.close)
        if (this.timer) clearTimeout(this.timer)
        this.wrapShow = true
        if (!this.scrollable) {
          this.addScrollEffect()
        }
      }
      this.broadcast('Table', 'on-visible-change', val)
      this.broadcast('Slider', 'on-visible-change', val)  // #2852
      this.$emit('on-visible-change', val)
    },
    scrollable (val) {
      if (!val) {
        this.addScrollEffect()
      } else {
        this.removeScrollEffect()
      }
    },
    title (val) {
      if (this.$slots.header === undefined) {
        this.showHead = !!val
      }
    }
  }
}
</script>

<style>
.drawer-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55,55,55,.6);
    height: 100%;
    z-index: 1000;
    transform:translateZ(0px)
}
.ivu-drawer-wrap {
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    -webkit-overflow-scrolling: touch;
    outline: 0;
}
.drawer {
    width: auto;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 11111;
}
.drawer-hidden {
    display: none!important;
}
  .drawer-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #fff;
    border: 0;
    z-index: 111111;
    background-clip: padding-box;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
}
.drawer-right {
    right: 0;
}
.drawer-body {
    width: 100%;
    height: calc(100% - 51px);
    padding: 16px;
    font-size: 12px;
    line-height: 1.5;
    word-wrap: break-word;
    position: absolute;
    overflow: auto;
}
/* .ivu-drawer-inner{ */
   /* position: absolute;  */
   /* display: block!important; */

/* } */
</style>
