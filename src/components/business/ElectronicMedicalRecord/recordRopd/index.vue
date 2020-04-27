<template>
  <div v-loading="loadStatus" style="height: 65vh;overflow:scroll" class="elitem">
    <el-checkbox-group   v-model="checkList" class="checkGroup" v-if="showStatus">
    <el-tabs
      v-model="activeName"
      tab-position="left"
      @tab-click="handleClick"
    >
    
      <el-tab-pane
        v-for="item in list"
        :key="item.id"
        :lazy='true'
      >
        <span slot="label"><div class="el-check-box"><el-checkbox :label='item' v-if="item.isRelation===null" @change="handleCheckedCitiesChange(item)">{{item.e_create_start|formatTime}}<br>{{ item.title }}</el-checkbox></div><span v-if="item.isRelation!==null">{{item.e_create_start|formatTime}}<br>{{ item.title }}</span></span>
        <viewTemplate :id='item.pnid'/>
      </el-tab-pane>
    
    </el-tabs>
    </el-checkbox-group>
  </div>
</template>
<script>
import viewTemplate from './template.vue'
import mixin from '../mixin.js'
export default {
  mixins: [mixin],
  data () {
    return {
      loadStatus: true,
      showStatus: true,
      list: [],
      activeName: '',
      checkList: [],
      RecordDict: {}
    }
  },
  components: { viewTemplate }
}
</script>


