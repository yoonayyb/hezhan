<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="手术名称：" name="2" :disabled="true">
      <div>
        内容：
        <span v-text="data.operation_name"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="术前诊断：" name="3" :disabled="true">
      <div>
        内容：
        <span v-text="data.preop_dia"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="术中诊断：" name="4" :disabled="true">
      <div>
        内容：
        <span v-text="data.intraop_dia"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="手术指导者、手术者及助手姓名：" name="5" :disabled="true">
      <div>
        内容：
        <span v-text="data.op_op_names"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="麻醉方式：" name="6" :disabled="true">
      <div>
        内容：
        <span v-text="data.ane_type"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="手术经过、术中发现的情况及处理：" name="7" :disabled="true">
      <div>
        内容：
        <span v-text="data.op_proc"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="8" :disabled="true">
      <div>
        医生职称名称：
        <span v-text="data.jt"></span>
      </div>
      <div>
        医生：
        <span v-text="data.docname"></span>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import mixTempla from '../mixTempla.js'
import { getRecordOperation } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getRecordOperation(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>