<template>
  <div class="Mainbody"
       v-loading="loadStatus">
    <div style="text-align:right">
      <!-- <div v-for="(item,index) in recordType" :key="index.toFixed(0)">{{ item.name }}</div> -->
      <div v-if="tab === '手录病历'">
        <el-select v-model="value"
                   placeholder="请选择需要新增的病历">
          <el-option v-for="(item,index) in recordType"
                     :key="index.toFixed(0)"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary"
                   style="margin-left: 6px"
                   @click="toAddRecord(value)">新增</el-button>
      </div>
      <div v-if="tab == '病历文件'">
        <el-select v-model="value2"
                   placeholder="请选择需要新增的病历">
          <el-option v-for="(item,index) in recordType"
                     :key="index.toFixed(0)"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary"
                   style="margin-left: 6px"
                   @click="toAddRecordFile(value2)">新增</el-button>
        <!-- <el-button type="primary" style="margin-left: 6px" @click="showEmrFile">新增病历文件</el-button> -->
      </div>
      <div v-if="tab == '检查报告'">
        <el-button type="primary"
                   @click="addPacsDialogVisible = true">新增检查报告</el-button>
      </div>
      <div v-if="tab === '检验报告'">
        <el-button type="primary"
                   @click="addLisDialogVisible = true">新增检验报告</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="手录病历"
                   name="first"
                   :lazy="true">
        <ElectronicMedicalRecord @listenToMedical="listenFromPatient"
                                 :id="id"
                                 :applyId="applyId"></ElectronicMedicalRecord>
      </el-tab-pane>
      <el-tab-pane label="病历文件"
                   name="second"
                   v-if="showStatus"
                   :lazy="true">
        <EmrFile :patient_Id="id"
                 :p_sn="p_sn"
                 :datainfo="datainfo_emrFile"></EmrFile>
      </el-tab-pane>
      <el-tab-pane label="检查报告"
                   name="third"
                   v-if="showStatus"
                   :lazy="true">
        <Pacs :patient_Id="id"
              :pSn="p_sn"
              :datainfo="datainfo_Pacs"></Pacs>
      </el-tab-pane>
      <el-tab-pane label="检验报告"
                   name="four"
                   v-if="showStatus"
                   :lazy="true">
        <Lis :patient_Id="id"
             :pSn="p_sn"
             :datainfo="datainfo_Lis"></Lis>
      </el-tab-pane>
    </el-tabs>
    <addFile ref="Add"
             v-if="insideVisble"></addFile>

    <addPacsReport :patientMsg="patient_recordinfo"
                   :reportType="0"
                   @close="addPacsDialogVisible=false"
                   @getReportID="getPacsReportID"
                   v-if="addPacsDialogVisible"></addPacsReport>
    <addLisReport :patientMsg="patient_recordinfo"
                  :reportType="1"
                  @close="addLisDialogVisible=false"
                  @getReportID="getLisReportID"
                  v-if="addLisDialogVisible"></addLisReport>
  </div>
</template>
<script>
import Bus from './emrFile/bus.js'
import addLisReport from '@/views/patient/checkReport'
import addPacsReport from '@/views/patient/checkReport'
import addFile from '@/components/business/ElectronicMedicalRecord/emrFile/addfile.vue'
import ElectronicMedicalRecord from '@/components/business/ElectronicMedicalRecord/electronicMedicalRecordI.vue'
import EmrFile from '@/components/business/ElectronicMedicalRecord/emrFile/emrFileToBlank.vue'
import Pacs from '@/components/business/ElectronicMedicalRecord/PacsRecord/index.vue'
import Lis from '@/components/business/ElectronicMedicalRecord/LisRecord/index.vue'
import { getListByApply } from '@/api/index'
export default {
  props: {
    id: String,
    patient: Object,
    tabs: Number,
    applyId: String,
    patient_recordinfo: Object
  },
  data () {
    return {
      insideVisble: false,
      loadStatus: false,
      activeName: 'first',
      showStatus: false,
      p_sn: '',
      datainfo_emrFile: '',
      datainfo_Lis: '',
      datainfo_Pacs: '',
      tab: '手录病历',
      recordType: '',
      addLisDialogVisible: false,
      addPacsDialogVisible: false,
      value: '',
      value2: ''
    }
  },
  components: {
    ElectronicMedicalRecord,
    EmrFile,
    Pacs,
    Lis,
    addFile,
    addPacsReport,
    addLisReport
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
    // 获取所有可以添加的病历类型
    getTypeOfRecord () {
      this.$http({
        url: '/api/Progress/GetlistUse',
        methods: 'GET',
        params: {
          patientID: this.id,
          vistSn: this.p_sn
        }
      }).then(({ data }) => {
        this.recordType = data.pageList
        // console.log(this.recordType)
      })
    },
    showEmrFile () {
      this.$refs.edit.showDialog()
    },
    toAddRecord (id) {
      if (id) {
        this.$emit('toaddMRecord', id)
      }
    },
    handleClick (tab, event) {
      this.tab = tab.label
      // console.log(tab, event)
    },
    listenFromPatient (val) {
      // console.log(val)
      if (val !== 0) {
        this.p_sn = val
        this.getTypeOfRecord()
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
        visitSn: this.p_sn,
        pageIndex: 1,
        pageSize: 999
      }
      return getListByApply(params).then(({ data }) => {
        // console.log(data.data)
        this.datainfo_emrFile = data.data.emrFileViewModel
        this.datainfo_Lis = data.data.lisReportViewModel
        this.datainfo_Pacs = data.data.pacsReportViewModel

        // this.pacsPicReportList = data.pageList
        // Bus.$emit('getPacsList', this.pacsPicReportList)
      })
    },
    getPacsReportID (val) {
      console.log(val)
      this.addPacsDialogVisible = false
      // console.log('addPacsDialogVisible:' + this.addPacsDialogVisible)
      Bus.$emit('addPacsReport', val)
    },
    getLisReportID (val) {
      // console.log(val)
      this.addLisDialogVisible = false
      // console.log('addLisDialogVisible:' + this.addLisDialogVisible)
      Bus.$emit('addLisReport', val)
    },
    toAddRecordFile (val) {
      // console.log(val)
      if (val) {
        let item = this.recordType.find(value => value.id === val)
        console.log(item)
        this.insideVisble = true
        setTimeout(() => {
          this.$refs.Add.showAdd(item, this.p_sn, this.id)
        }, 100)
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
  min-height: 55vh;
}
</style>
