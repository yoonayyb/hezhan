import Vue from 'vue'
import Main from './main.vue'
import { isVNode } from 'element-ui/src/utils/vdom'
let MessageConstructor = Vue.extend(Main)

let instance
// let instances = []
let seed = 1

const selectModel = function (options) {
  if (Vue.prototype.$isServer) return
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  let userOnClose = options.onClose
  let userOnSearch = options.onSearch
  let userOnSelect = options.onSelect
  let userOnPageChange = options.onPageChange
  let id = 'message_' + seed++

  options.onClose = function () {
    selectModel.close(userOnClose)
  }
  options.onSearch = function (val) {
    selectModel.search(val, userOnSearch)
  }
  options.onSelect = function (val) {
    selectModel.select(val, userOnSelect)
  }
  options.onPageChange = function (val) {
    selectModel.select(val, userOnPageChange)
  }
  instance = new MessageConstructor({
    data: options
  })
  instance.id = id
  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message]
    instance.message = null
  }
  instance.vm = instance.$mount()
  // document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  // instance.dom.style.zIndex = PopupManager.nextZIndex();
  // instances.push(instance);
  return instance.vm
}

selectModel.close = function (userOnClose) {
  if (typeof userOnClose === 'function') {
    userOnClose()
  }
}

selectModel.search = function (val, userOnSearch) {
  if (typeof userOnSearch === 'function') {
    userOnSearch(val)
  }
}

selectModel.select = function (row, userOnSelect) {
  if (typeof userOnSelect === 'function') {
    userOnSelect(row)
  }
}
selectModel.init = function (userOnInit) {
  if (typeof userOnInit === 'function') {
    userOnInit()
  }
}
selectModel.pageChange = function (val, userOnPageChange) {
  if (typeof userOnPageChange === 'function') {
    userOnPageChange(val)
  }
}

export default selectModel
