<template>
  <div class="Mainbody">
    <el-tabs v-model="activeName"
             @tab-click="handleClick"
             v-loading='loadStatus'>
      <el-tab-pane label="手录病历"
                   name="first">
        <ElectronicMedicalRecord @listenToMedical="listenFromPatient"
                                 :id='id'></ElectronicMedicalRecord>
      </el-tab-pane>
      <el-tab-pane label="采集病历"
                   v-if="showStatus"
                   name="three">
        <EmrFileI :patient_Id='id'
                  :p_sn='$route.params.P_sn'></EmrFileI>
      </el-tab-pane>
      <el-tab-pane label="病历文件"
                   name="second"
                   v-if="showStatus"
                   :lazy='true'>
        <EmrFile :patient_Id='id'
                 :p_sn='p_sn'></EmrFile>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ElectronicMedicalRecord from '@/components/business/ElectronicMedicalRecord/electronicMedicalRecord.vue'
import EmrFile from '@/components/business/ElectronicMedicalRecord/emrFile/index.vue'
import EmrFileI from '@/components/business/ElectronicMedicalRecord/emrFile/indexI.vue'

export default {
  props: {
    id: String,
    patient: Object,
    tabs: Number
  },
  data () {
    return {
      activeName: 'first',
      p_sn: '',
      showStatus: false,
      loadStatus: false
    }
  },
  components: {
    ElectronicMedicalRecord, EmrFile, EmrFileI
  },
  created () {
    this.loadStatus = true
    if (this.p_sn === '') {
      this.showStatus = false
    }
    // console.log(this.showStatus)
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    listenFromPatient (val) {
      this.loadStatus = false
      console.log(val)
      if (val !== 0) {
        this.p_sn = val
        this.showStatus = true
      } else {
        this.showStatus = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.Mainbody {
  margin-left: 0px;
  margin-top: 20px;
  width: 100%;
  min-height: 50vh;
}
</style>
