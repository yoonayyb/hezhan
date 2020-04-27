<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="主诉：" name="1" :disabled="true">
      <div>
        内容：
        <span v-text="data.c_complaint"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="现病史：" name="2" :disabled="true">
      <div>
        内容：
        <span v-text="data.pm_his"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="既往史：" name="3" :disabled="true">
      <div>
        内容：
        <span v-text="data.pi_his"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="体格检查：" name="4" :disabled="true">
      <div>
        内容：
        <span v-text="data.spec_ex"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="专科检查：" name="5" :disabled="true">
      <div>
        内容：
        <span v-text="data.spec_ex"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="辅助检查：" name="6" :disabled="true">
      <div>
        内容：
        <span v-text="data.aux_ex"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="诊断：" name="7" :disabled="true">
      <div>
        内容：
        <span v-text="data.pre_dia"></span>
      </div>
      <div>
        诊断编码：
        <span v-text="data.pre_dia_id"></span>
      </div>
      <div>
        中医诊断编码：
        <span v-text="data.tcm_pre_id"></span>
      </div>
      <div>
        中医证候名称：
        <span v-text="data.tcm_sy_pre_name"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="诊疗意见：" name="8" :disabled="true">
      <div>
        内容：
        <span v-text="data.dis_op"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="9" :disabled="true">
      <div>
        医生职称名称：
        <span v-text="data.doc_title"></span>
      </div>
      <div>
        医生：
        <span v-text="data.docname"></span>
      </div>
      <div>
        书写医生职称：
        <span v-text="data.jt"></span>
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
import { getRecordOd } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getRecordOd(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>