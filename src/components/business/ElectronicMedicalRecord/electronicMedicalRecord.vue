<template>
  <div>
    <el-tabs v-loading='loadStatus'
             v-if="all_record.length !== 0"
             tab-position="left"
             v-model="activeName">
      <el-tab-pane :label="item.pn_type"
                   :name="item.pn_type"
                   v-for="(item,index) in all_record"
                   :key="index"
                   :lazy="true">
        <EmrCourseRecord v-if="item.pn_type === '入院记录'"
                         :items="item"
                         :applyID="applyID" />
        <FirstRecord v-if="item.pn_type === '首次病程记录'"
                     :items="item"
                     :applyID="applyID" />
        <EmrWard v-if="item.pn_type === '上级医师查房记录'"
                 :items="item"
                 :applyID="applyID" />
        <EmrDaily v-if="item.pn_type === '日常病程记录'"
                  :items="item"
                  :applyID="applyID" />
        <EmrPatient v-if="item.pn_type === '病历基础信息'"
                    :items="item"
                    :applyID="applyID" />
        <RecordShfit v-if="item.pn_type === '交班记录'"
                     :items="item"
                     :applyID="applyID" />
        <RecordSuccession v-if="item.pn_type === '接班记录'"
                          :items="item"
                          :applyID="applyID" />
        <RecordDischarge v-if="item.pn_type === '出院记录'"
                         :items="item"
                         :applyID="applyID" />
        <reocrdIn v-if="item.pn_type === '转入病程记录'"
                  :items="item"
                  :applyID="applyID"></reocrdIn>
        <recordOut v-if="item.pn_type === '转出病程记录'"
                   :items="item"
                   :applyID="applyID"></recordOut>
        <emrRescue v-if="item.pn_type === '抢救记录'"
                   :items="item"
                   :applyID="applyID"></emrRescue>
        <emrOp v-if="item.pn_type === '有创操作记录'"
               :items="item"
               :applyID="applyID"></emrOp>
        <emrPostOperative v-if="item.pn_type === '术后首次病程记录'"
                          :items="item"
                          :applyID="applyID"></emrPostOperative>
        <recordSummary v-if="item.pn_type === '阶段小结'"
                       :items="item"
                       :applyID="applyID"></recordSummary>
        <recordOdituary v-if="item.pn_type === '死亡记录'"
                        :items="item"
                        :applyID="applyID"></recordOdituary>
        <recordDiscussion v-if="item.pn_type === '疑难病例讨论记录'"
                          :items="item"
                          :applyID="applyID"></recordDiscussion>
        <recordPs v-if="item.pn_type === '术前小结'"
                  :items="item"
                  :applyID="applyID"></recordPs>
        <recordRopd v-if="item.pn_type === '术前讨论记录'"
                    :items="item"
                    :applyID="applyID"></recordRopd>
        <recordOperation v-if="item.pn_type === '手术记录'"
                         :items="item"
                         :applyID="applyID"></recordOperation>
        <recordNursing v-if="item.pn_type === '一般患者护理记录'"
                       :items="item"
                       :applyID="applyID"></recordNursing>
        <reocrdOd v-if="item.pn_type === '门诊病历'"
                  :items="item"
                  :applyID="applyID"></reocrdOd>
        <recordDisDie v-if="item.pn_type === '死亡病例讨论记录'"
                      :items="item"
                      :applyID="applyID"></recordDisDie>
        <emrCon v-if="item.pn_type === '会诊记录'"
                :items="item"
                :applyID="applyID"></emrCon>
      </el-tab-pane>
    </el-tabs>
    <h3 v-if="all_record.length === 0"
        style="text-align: center">暂无数据</h3>
  </div>
</template>


<script>
import Bus from './emrFile/bus.js'
import EmrCourseRecord from './emrCorseRecord/index.vue'
import FirstRecord from './firstRecord/index.vue'
import EmrWard from './emrWard/index.vue'
import EmrDaily from './emrDaily/index.vue'
import EmrPatient from './emrPatient/index.vue'
import RecordDischarge from './recordDischarge/index.vue'
import RecordShfit from './recordShfit/index.vue'
import RecordSuccession from './recordSuccession/index.vue'
import reocrdIn from './recordIn/index.vue'
import recordOut from './recordOut/index.vue'
import emrRescue from './emrRescue/index.vue'
import emrOp from './emrOp/index.vue'
import emrPostOperative from './emrPostOperative/index.vue'
import recordSummary from './recordSummary/index.vue'
import recordOdituary from './recordOdituary/index.vue'
import recordDiscussion from './recordDiscussion/index.vue'
import recordPs from './recordPs/index.vue'
import recordRopd from './recordRopd/index.vue'
import recordOperation from './recordOperation/index.vue'
import recordNursing from './recordNursing/index.vue'
import reocrdOd from './reocrdOd/index.vue'
import recordDisDie from './recordDisDie/index.vue'
import emrCon from './emrCon/index.vue'

export default {
  data () {
    return {
      loadStatus: false,
      activeName: '入院记录',
      all_record: {},
      psn: '',
      patientId: '',
      applyID: '',
      recordDict: {
        1: '入院记录',
        5: '首次病程记录',
        6: '日常病程记录',
        7: '上级医师查房记录',
        8: '交班记录',
        9: '接班记录',
        10: '出院记录',
        11: '转出病程记录',
        12: '转入病程记录',
        13: '抢救记录',
        14: '有创操作记录',
        15: '术后首次病程记录',
        16: '阶段小结',
        17: '死亡记录',
        18: '疑难病例讨论记录',
        19: '术前小结',
        20: '术前讨论记录',
        21: '手术记录',
        22: '一般患者护理记录',
        23: '门诊病历',
        24: '死亡病例讨论记录',
        25: '会诊记录'
      }
    }
  },
  components: {
    EmrCourseRecord,
    FirstRecord,
    EmrWard,
    EmrDaily,
    EmrPatient,
    RecordDischarge,
    RecordShfit,
    RecordSuccession,
    reocrdIn,
    recordOut,
    emrRescue,
    emrOp,
    emrPostOperative,
    recordSummary,
    recordOdituary,
    recordDiscussion,
    recordPs,
    recordRopd,
    recordOperation,
    recordNursing,
    reocrdOd,
    recordDisDie,
    emrCon
  },
  props: {
    id: String,
    patient: Object,
    tabs: Number
  },
  watch: {
    id (newval) {
      // console.log(newval)
      this.patientId = newval
      this.activeName = '入院记录'
      if (this.$route.params.ID !== '0' && typeof this.$route.params.ID !== 'undefined') {
        this.applyID = this.$route.params.ID
        this.getMedicalRecordDataByapplyID()
        this.activeName = this.recordDict[1]
      } else {
        this.getMedicalRecordData()
        this.activeName = this.recordDict[1]
      }
    }
  },
  created () {
    if (typeof this.$route.params.PatiendId === 'undefined') {
      this.patientId = this.id
      this.getMedicalRecordData()
    } else {
      this.patientId = this.$route.params.PatiendId
      this.getMedicalRecordData()
    }
    if (this.tabs) {
      this.activeName = this.recordDict[this.tabs]
    }
    Bus.$on('getMdicalRecordData', target => {
      // console.log(12321321)
      console.log(target)
      this.getMedicalRecordData()
      this.activeName = this.recordDict[target]
    })
  },
  beforeDestroy () {
    Bus.$off('getMdicalRecordData')
  },
  methods: {
    getMedicalRecordData () {
      // console.log(123213)
      this.$http({
        url: this.$http.adornUrl('/api/emrpatient/GetEmrPatientLast'),
        methods: 'GET',
        params: this.$http.adornParams({
          pid: this.patientId
        })
      }).then(({ data }) => {
        if (data) {
          // this.getRecordList(data.p_sn)
          if (
            this.$route.params.ID !== '0' &&
            typeof this.$route.params.ID !== 'undefined'
          ) {
            this.applyID = this.$route.params.ID
            this.getMedicalRecordDataByapplyID()
          } else {
            this.getRecordList(data.p_sn)
          }
          this.$emit('listenToMedical', data.p_sn)
        }
      })
    },
    getRecordList (pSn) {
      this.loadStatus = true
      this.$http({
        url: '/api/patientProgress/GetTypelist',
        methods: 'GET',
        params: {
          applyIDPatientID: this.patientId,
          visitsn: pSn
        }
      }).then(({ data }) => {
        this.loadStatus = false
        if (data) {
          const list = data.pageList
          this.all_record = list
          console.log(this.all_record)
        }
      })
    },
    getMedicalRecordDataByapplyID () {
      this.loadStatus = true
      this.$http({
        url: '/api/patientProgress/GetTypelistApply',
        methods: 'GET',
        params: {
          PatientID: this.patientId,
          applyID: this.applyID,
          typeID: 0
        }
      }).then(({ data }) => {
        this.loadStatus = false
        if (data) {
          const list = data.pageList
          this.all_record = list
          console.log(this.all_record)
        }
      })
    }
  }
}
</script>
<style>
/* .el-tabs__item {
  height: 45px;
  line-height: 20px;
} */
</style>


