<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="内容：" name="1" :disabled="true">
      <div>
        内容：
        <span v-text="data.content"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="2" :disabled="true">
      <div>
        职称名称：
        <span v-text="data.jt"></span>
      </div>
      <div>
        医生名称：
        <span v-text="data.docname"></span>
      </div>
      <!-- <div>
              内容：
              <span v-text="item.content"></span>
      </div>-->
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import mixTempla from '../mixTempla.js'
import { getEmPostOperative } from '@/api/modules/medicalRecord.js'
export default {
  props: ['id'],
  mixins: [mixTempla],
  data () {
    return {
      data: {},
      activeName: '',
      emrID: '',
      activeNames: ['1', '2'],
      loadStatus: false
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getEmPostOperative(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>