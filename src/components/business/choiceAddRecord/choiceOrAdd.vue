<template>
  <div>
    <el-dialog :visible.sync="choiceOrAddDialogVisible" width="50%">
      <div v-loading='loadStatus'>
      <h3 v-if="patientInfo == null">当前暂无患者就诊记录</h3>
      <!-- <span>这是一段信息</span> -->
      <h3 v-if="patientInfo !== null">当前系统记录为 <span class='InfoText'>{{ patientInfo.pname }}</span> 在 <span class='InfoText'>{{ patientInfo.hname }}</span> 第 <span class='InfoText'>{{ patientInfo.org_sn }}</span> 次就诊</h3>
      <h3><el-button type="text" @click="addbasicele">新增病历基本信息</el-button></h3>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="choiceOrAddDialogVisible = false">确 定</el-button>
      </span>
      </div>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible4"
      :visible.sync="centerDialogVisible4"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrPatient :patientID="this.patientId" @listentochild="showmsgfromchild"></addEmrPatient>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="centerDialogVisible4 = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getBasePatient } from '@/api/index'
import addEmrPatient from '@/views/patient/component/medicalRecord/EmrPatient/addEmrPatientFromChoice.vue'

export default {
  data () {
    return {
      choiceOrAddDialogVisible: false,
      patient_recordinfo: '',
      patientId: '',
      patientInfo: '',
      loadStatus: false,
      centerDialogVisible4: false
    }
  },
  components: {
    addEmrPatient
  },
  methods: {
    openDialog (patientID) {
      this.patientId = patientID
        // console.log(patientId)
      this.choiceOrAddDialogVisible = true
      this.getPatientLast()
    },
    getPatientLast () {
      this.loadStatus = true
      let params = {
        pid: this.patientId
      }
      getBasePatient(params).then(({ data }) => {
        // console.log(data)
        this.patientInfo = data
        this.loadStatus = false
      })
    },
    addbasicele () {
      this.centerDialogVisible4 = true
    },
    showmsgfromchild (data) {
      if (data === 4) {
        this.centerDialogVisible4 = false
        this.$nextTick(function () {
          this.getPatientLast()
          this.$emit('recheckRecord')
        })
      }
    }
  }
}
</script>
<style scoped>
.InfoText {
  color:cornflowerblue
}
</style>
