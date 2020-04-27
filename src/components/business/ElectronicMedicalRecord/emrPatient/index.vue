<template>
  <div>
    <el-tabs
      v-model="activeName"
      tab-position="left"
      :lazy="true"
    >
      <el-tab-pane
        v-for="item in list"
        :key="item.id"
      >
        <span slot="label">{{item.e_create_start|formatTime}}</span>
        <viewTemplate :id='item.pnid' />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import viewTemplate from './template.vue'
import mixin from '../mixin.js'
export default {
  mixins: [mixin],
  data () {
    return {
      list: [],
      activeName: ''
    }
  },
  components: { viewTemplate }
}
</script>
