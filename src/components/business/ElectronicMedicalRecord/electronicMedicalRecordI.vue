<template>
  <div>
    <el-tabs style="height: 70vh;"
             type="border-card"
             v-if="all_record.length !== 0"
             tab-position="top"
             v-model="activeName">
      <el-tab-pane :label="item.pn_type"
                   :name="item.pn_type"
                   v-for="(item,index) in all_record"
                   :key="index"
                   :lazy="true">
        <EmrCourseRecord v-if="item.pn_type === '入院记录'"
                         :items="item"
                         :applyID="applyId" />
        <FirstRecord v-if="item.pn_type === '首次病程记录'"
                     :items="item"
                     :applyID="applyId" />
        <EmrWard v-if="item.pn_type === '上级医师查房记录'"
                 :items="item"
                 :applyID="applyId" />
        <EmrDaily v-if="item.pn_type === '日常病程记录'"
                  :items="item"
                  :applyID="applyId" />
        <EmrPatient v-if="item.pn_type === '病历基础信息'"
                    :items="item"
                    :applyID="applyId" />
        <RecordShfit v-if="item.pn_type === '交班记录'"
                     :items="item"
                     :applyID="applyId" />
        <RecordSuccession v-if="item.pn_type === '接班记录'"
                          :items="item"
                          :applyID="applyId" />
        <RecordDischarge v-if="item.pn_type === '出院记录'"
                         :items="item"
                         :applyID="applyId" />
        <reocrdIn v-if="item.pn_type === '转入病程记录'"
                  :items="item"
                  :applyID="applyId"></reocrdIn>
        <recordOut v-if="item.pn_type === '转出病程记录'"
                   :items="item"
                   :applyID="applyId"></recordOut>
        <emrRescue v-if="item.pn_type === '抢救记录'"
                   :items="item"
                   :applyID="applyId"></emrRescue>
        <emrOp v-if="item.pn_type === '有创操作记录'"
               :items="item"
               :applyID="applyId"></emrOp>
        <emrPostOperative v-if="item.pn_type === '术后首次病程记录'"
                          :items="item"
                          :applyID="applyId"></emrPostOperative>
        <recordSummary v-if="item.pn_type === '阶段小结'"
                       :items="item"
                       :applyID="applyId"></recordSummary>
        <recordOdituary v-if="item.pn_type === '死亡记录'"
                        :items="item"
                        :applyID="applyId"></recordOdituary>
        <recordDiscussion v-if="item.pn_type === '疑难病例讨论记录'"
                          :items="item"
                          :applyID="applyId"></recordDiscussion>
        <recordPs v-if="item.pn_type === '术前小结'"
                  :items="item"
                  :applyID="applyId"></recordPs>
        <recordRopd v-if="item.pn_type === '术前讨论记录'"
                    :items="item"
                    :applyID="applyId"></recordRopd>
        <recordOperation v-if="item.pn_type === '手术记录'"
                         :items="item"
                         :applyID="applyId"></recordOperation>
        <recordNursing v-if="item.pn_type === '一般患者护理记录'"
                       :items="item"
                       :applyID="applyId"></recordNursing>
        <reocrdOd v-if="item.pn_type === '门诊病历'"
                  :items="item"
                  :applyID="applyId"></reocrdOd>
        <recordDisDie v-if="item.pn_type === '死亡病例讨论记录'"
                      :items="item"
                      :applyID="applyId"></recordDisDie>
        <emrCon v-if="item.pn_type === '会诊记录'"
                :items="item"
                :applyID="applyId"></emrCon>
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
      activeName: '入院记录',
      checkList: [],
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
    tabs: Number,
    applyId: String
  },
  watch: {
    id (newval) {
      // console.log(newval)
      this.patientId = newval
      this.getMedicalRecordData()
      this.activeName = '入院记录'
      // if (this.$route.params.ID !== '0' && typeof this.$route.params.ID !== 'undefined') {
      //   this.applyID = this.$route.params.ID
      //   this.getMedicalRecordDataByapplyID()
      //   this.activeName = this.recordDict[1]
      // } else {
      //   this.getMedicalRecordData()
      //   this.activeName = this.recordDict[1]
      // }
    }
  },
  created () {
    // if (typeof this.$route.params.PatiendId === 'undefined') {
    //   this.patientId = this.id
    //   this.getMedicalRecordData()
    // } else {
    //   this.patientId = this.$route.params.PatiendId
    //   this.getMedicalRecordData()
    // }
    this.patientId = this.id
    this.getMedicalRecordData()
    if (this.tabs) {
      this.activeName = this.recordDict[this.tabs]
    }
    Bus.$on('getMdicalRecordData', target => {
      // console.log(12321321)
      console.log(target)
      this.getMedicalRecordData().then(() => {
        this.activeName = this.recordDict[target]
      })
    })
  },
  beforeDestroy () {
    Bus.$off('getMdicalRecordData')
  },
  methods: {
    getMedicalRecordData () {
      // console.log(123213)
      return this.$http({
        url: this.$http.adornUrl('/api/emrpatient/GetEmrPatientLast'),
        methods: 'GET',
        params: this.$http.adornParams({
          pid: this.patientId
        })
      }).then(({ data }) => {
        if (data) {
          // this.getRecordList(data.p_sn)
          // if (
          //   this.$route.params.ID !== '0' &&
          //   typeof this.$route.params.ID !== 'undefined'
          // ) {
          //   this.applyID = this.$route.params.ID
          //   this.getMedicalRecordDataByapplyID()
          // } else {
          //   this.getRecordList(data.p_sn)
          // }
          this.getRecordList(data.p_sn)
          this.$emit('listenToMedical', data.p_sn)
        }
      })
    },
    getRecordList (pSn) {
      return this.$http({
        url: '/api/patientProgress/GetTypelist',
        methods: 'GET',
        params: {
          PatientID: this.patientId,
          visitsn: pSn,
          applyID: this.applyId
        }
      }).then(({ data }) => {
        if (data) {
          console.log(data)
          this.all_record = data.pageList
          // debugger
          // const list = data.pageList
          // this.all_record = list
          // console.log(this.all_record)
        }
      })
    }
  }
}
</script>
<style scoped>
/* .el-tabs__item {
  height: 45px;
  line-height: 20px;
} */
</style>
