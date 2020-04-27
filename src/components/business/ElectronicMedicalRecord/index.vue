<template>
  <div class="Mainbody" v-loading="loadStatus">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="手录病历" name="first"><ElectronicMedicalRecord @listenToMedical="listenFromPatient" :id='id' :applyID='applyId'></ElectronicMedicalRecord></el-tab-pane>
    <el-tab-pane label="病历文件" name="second" v-if="showStatus"><EmrFile :patient_Id='id' :p_sn='p_sn' :datainfo='datainfo_emrFile'></EmrFile></el-tab-pane>
    <el-tab-pane label="检查报告" name="third" v-if="showStatus"><Pacs :patient_Id='id' :pSn='p_sn' :datainfo='datainfo_Pacs'></Pacs></el-tab-pane>
    <el-tab-pane label="检验报告" name="four" v-if="showStatus"><Lis :patient_Id='id' :pSn='p_sn' :datainfo='datainfo_Lis'></Lis></el-tab-pane>
  </el-tabs>
  </div>
</template>
<script>
import Bus from './emrFile/bus.js'
import ElectronicMedicalRecord from '@/components/business/ElectronicMedicalRecord/electronicMedicalRecord.vue'
import EmrFile from '@/components/business/ElectronicMedicalRecord/emrFile/emrFileToBlank.vue'
import Pacs from '@/components/business/ElectronicMedicalRecord/PacsRecord/index.vue'
import Lis from '@/components/business/ElectronicMedicalRecord/LisRecord/index.vue'
import { getListByApply } from '@/api/index'
export default {
  props: {
    id: String,
    patient: Object,
    tabs: Number,
    applyId: String
  },
  data () {
    return {
      loadStatus: false,
      activeName: 'first',
      showStatus: false,
      p_sn: '',
      datainfo_emrFile: '',
      datainfo_Lis: '',
      datainfo_Pacs: ''

    }
  },
  components: {
    ElectronicMedicalRecord, EmrFile, Pacs, Lis
  },
  created () {
    this.loadStatus = true
    if (this.p_sn === '') {
      this.showStatus = false
    }
    Bus.$on('getTar', target => {
      this.changeTabs()
    })
    // console.log(this.showStatus)
  },
  beforeDestroy () {
    Bus.$off('getTar')
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    listenFromPatient (val) {
      console.log(val)
      if (val !== 0) {
        this.p_sn = val
        if (this.applyId) {
          this.getListByApply().then(() => {
            this.$nextTick(function () {
              this.showStatus = true
              this.loadStatus = false
            })
          })
        } else {
          this.$nextTick(function () {
            this.showStatus = true
            this.loadStatus = false
          })
        }
      } else {
        this.showStatus = false
      }
    },
    changeTabs () {
      this.activeName = 'second'
    },
    getListByApply () {
      let params = {
        applyID: this.applyId,
        patientID: this.id,
        visitSn: this.p_sn
      }
      return getListByApply(params).then(({ data }) => {
        // console.log(data.data)
        this.datainfo_emrFile = data.data.emrFileViewModel
        this.datainfo_Lis = data.data.lisReportViewModel
        this.datainfo_Pacs = data.data.pacsReportViewModel

        // this.pacsPicReportList = data.pageList
        // Bus.$emit('getPacsList', this.pacsPicReportList)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Mainbody {
  margin-left: 0px;
  margin-top: 20px;
  width: 100%;
  min-height: 100vh;
}
</style>
