
<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item :disabled="true" title="病历特点：" name="3">
      <div>
        内容：
        <span v-text="data.rec_fea"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="诊断依据：" name="4">
      <div>
        内容：
        <span v-text="data.dia_basis"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="鉴别诊断：" name="5">
      <div>
        内容：
        <span v-text="data.antidia"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="诊疗计划：" name="6">
      <div>
        内容：
        <span v-text="data.tre_plan"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="医生信息" name="7">
      <div>
        职称名称：
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
import mixTempla from '../mixTempla.js';
import { getFirstRecordModel } from '@/api/modules/medicalRecord.js';
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3', '4', '5', '6', '7']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      // console.log(this.id)
      const { data } = await getFirstRecordModel(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>


