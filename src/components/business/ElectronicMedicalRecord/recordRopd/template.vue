<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="讨论信息：" name="1" :disabled="true">
      <span class="user_items">
        讨论时间 ：
        <span>{{data.dis_time|formatTime}}</span>
      </span>
      <span class="user_items">
        讨论地点 ：
        <span v-text="data.place"></span>
      </span>
      <span class="user_items">
        主持人 ：
        <span v-text="data.mod"></span>
      </span>
      <span class="user_items">
        参加人员 ：
        <span v-text="data.attendee"></span>
      </span>
    </el-collapse-item>
    <el-collapse-item title="讨论内容：" name="2" :disabled="true">
      <div>
        内容：
        <span v-text="data.dis_op"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="主持人小结：" name="3" :disabled="true">
      <div>
        内容：
        <span v-text="data.mod_con"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="4" :disabled="true">
      <div>
        主持人医生职称名称：
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
import { getRecordRopd } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3', '4', '5', '6']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getRecordRopd(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>