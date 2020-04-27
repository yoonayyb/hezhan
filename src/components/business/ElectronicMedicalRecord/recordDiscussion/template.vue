<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="讨论意见：" name="1" :disabled="true">
      <div>
        内容：
        <span v-text="data.dis_op"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="主持人小结意见：" name="2" :disabled="true">
      <div>
        内容：
        <span v-text="data.mod_con"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="3" :disabled="true">
      <div>
        参加人员：
        <span v-text="data.dis_op"></span>
      </div>
      <div>
        主持人职称名称：
        <span v-text="data.jt"></span>
      </div>
      <div>
        主持人医生：
        <span v-text="data.superior_docname"></span>
      </div>
      <div>
        书写医生职称名称：
        <span v-text="data.jt_a"></span>
      </div>
      <div>
        书写医生：
        <span v-text="data.attending_docname"></span>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import mixTempla from '../mixTempla.js'
import { getRecordDiscussion } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: false,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getRecordDiscussion(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>