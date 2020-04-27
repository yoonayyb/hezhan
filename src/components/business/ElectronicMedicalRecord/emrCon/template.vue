<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="患者病情及诊疗经过、会诊申请的理由及目的：" name="1" :disabled="true">
      <div>
        内容：
        <span v-text="data.pn_ad"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="会诊信息：" name="2" :disabled="true">
      <div>
        被要求会诊医院1：
        <span v-text="data.pn_hos1"></span>
      </div>
      <div>
        被邀请会诊科别1：
        <span v-text="data.pn_dept1"></span>
      </div>
      <div>
        被邀请医生1：
        <span v-text="data.pn_doc1"></span>
      </div>
      <div>
        被要求会诊医院2：
        <span v-text="data.pn_hos2"></span>
      </div>
      <div>
        被邀请医生2：
        <span v-text="data.pn_doc2"></span>
      </div>
      <div>
        被要求会诊医院3：
        <span v-text="data.pn_hos3"></span>
      </div>
      <div>
        被邀请会诊科别3：
        <span v-text="data.pn_dept3"></span>
      </div>
      <div>
        被邀请医生3：
        <span v-text="data.pn_doc3"></span>
      </div>
      <div>
        被要求会诊医院4：
        <span v-text="data.pn_hos4"></span>
      </div>
      <div>
        被邀请会诊科别4：
        <span v-text="data.pn_dept4"></span>
      </div>
      <div>
        被邀请医生4：
        <span v-text="data.pn_doc4"></span>
      </div>
      <div>
        被要求会诊医院5：
        <span v-text="data.pn_hos5"></span>
      </div>
      <div>
        被邀请会诊科别5：
        <span v-text="data.pn_dept5"></span>
      </div>
      <div>
        被邀请医生5：
        <span v-text="data.pn_doc5"></span>
      </div>
      <div>
        申请会诊科室：
        <span v-text="data.pn_app_dept"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="会诊信息：" name="3" :disabled="true">
      <div>
        会诊意见：
        <span v-text="data.pn_opinion"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="4" :disabled="true">
      <div>
        会诊时间：
        <span>{{data.pn_con_date|formatTime}}</span>
      </div>
      <div>
        会诊科室：
        <span v-text="data.pn_con_dept"></span>
      </div>
      <div>
        会诊医生：
        <span v-text="data.pn_con_doc"></span>
      </div>
      <div>
        外院会诊医生所在的医疗医院名称：
        <span v-text="data.pn_out_hos"></span>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import mixTempla from '../mixTempla.js'
import { getEmrCon } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3', '4']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getEmrCon(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>