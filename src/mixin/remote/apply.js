// import choiceAddRecord from '@/components/business/choiceAddRecord/choiceAddRecord.vue'
import choiceOrAdd from '@/components/business/choiceAddRecord/choiceOrAdd.vue'
import { getPatientOrderSinglet } from '@/utils/hisApi'
import { getBasePatient } from '@/api/index'
import Upload from '@/components/upload/index'
import PatientDialog from '@/components/Dialogs/patient'
import HisPatientDialog from '@/components/Dialogs/hisPatient'
// import Bus from './bus.js'
import Addpatient from '@/views/patient/essentialInfo'
import defultOrgId from '@/mixin/defultOrgId'
import addCheckReport from '@/views/patient/checkReport.vue'
import AddNewPatient from '@/components/business/AddNewPatient/dialog.vue'

import { mapState } from 'vuex'

const inHosp = [
  '5cb4ff0c-69bb-4235-b582-1d1222ea4ed0',
  '1361e288-3620-41bc-885e-60828d86b0e0'
] // 院内
const outHosp = [
  'df9c0957-d7f3-4e57-912a-f38f41e70408',
  '3f32de35-bf63-479d-92a8-b0402df4663c'
] // 院外
const IsEmergencyArr = [
  '1361e288-3620-41bc-885e-60828d86b0e0',
  'df9c0957-d7f3-4e57-912a-f38f41e70408'
] // 平诊
const emergencyArr = [
  '3f32de35-bf63-479d-92a8-b0402df4663c',
  '5cb4ff0c-69bb-4235-b582-1d1222ea4ed0'
] // 急诊

export default {
  mixins: [defultOrgId],
  components: {
    choiceOrAdd,
    Upload,
    PatientDialog,
    HisPatientDialog,
    Addpatient,
    addCheckReport,
    AddNewPatient
  },
  mounted () {
    this.getOrgId().then(id => {
      this.orgid = id
    })
    this.getTypeList()
    this.ConsId = this.$route.query.id || ''
    this.loadDicts().then(() => {
      this.init(this.$route.query.id)
    })
  },
  data () {
    // const validateSysFileViewModel = (rule, value, callback) => {
    //   if (this.PatientInfoAtt && this.PatientInfoAtt.length > 0) {
    //     const isHasInformet = this.PatientInfoAtt.some(item => {
    //       return (
    //         item.FileTypeId === 'a0fd0dfe-0fe8-40a6-a1c4-dbefa5141642' &&
    //         item.Status !== 1
    //       )
    //     })
    //     if (isHasInformet) {
    //       callback()
    //     } else {
    //       callback(new Error('请上传知情同意书'))
    //     }
    //   } else {
    //     callback(new Error('请上传知情同意书'))
    //   }
    // }
    const validatePatientInfo = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择病人'))
      }
      if (!this.patientMsg.p_sn) {
        callback(new Error('请新增病历基本信息'))
      } else {
        callback()
      }
    }
    return {
      typeList: [],  // 档次类型
      // 数据加载loading
      loading: false,
      showAddRecordStatus: false,
      doctorTitle: '',
      recordType: '',
      // recordButton: false,
      recordButton1: false,
      patient_recordinfo: '',
      record_show_btn: false,
      hosp_dept: '',
      addReportDialogVisible: false, // 新增检查报告
      reportType: 0, // 新增报告类型，0为检查报告，1位检验报告
      patientMsg: {}, // 选择的病人信息
      PacsReportID: '', // 检查报告ID
      lisReportID: '', // 检验报告ID
      addpatientDialogVisible: false,
      dataForm: {
        PatientInfoAtt: [],
        otherAtt: []
      },
      groupCons: {},
      attachmentList: [], // 全部的附件
      PatientInfoAtt: [], // 患者知情同意书
      otherAtt: [], // 其他附件
      // 字典
      hzflTpye: [],
      huzlx: [],
      hzfs: [],
      ConsId: '',
      patientDialogVisible: false,
      hisPatientDialogVisible: false,
      dialogVisible: false,
      img: {},
      dataRules: {
        // PatientInfoAtt: [
        //   {
        //     required: true,
        //     validator: validateSysFileViewModel,
        //     trigger: 'change'
        //   }
        // ],
        PatientName: [
          {
            require: true,
            validator: validatePatientInfo,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  watch: {
    dataForm: function (val) {
      console.log(val)
      this.$emit('getModel', val)
    },
    attachmentList: function (val) {
      this.$emit('getAttachmentList', val)
    }
  },
  methods: {
    init (id) {
      if (id && id !== '0' && id !== '') {
        this.loading = true
        this.$http({
          url: `/api/ConsApply/GetViewModel`,
          method: 'GET',
          params: { id: id }
        })
          .then(({ data }) => {
            if (data && data.status === 0) {
              this.loadFiles()
              this.dataForm = data.data.consApply
              this.groupCons = data.data.groupCons
              this.dataForm.otherAtt = []
              this.getPatientRecord()
              this.loading = false
            } else {
              this.$message.error(data.msg)
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$set(this.dataForm, 'APPLY_ORG_NAME', this.userInfo.OrgName)
        this.$set(this.dataForm, 'APPLY_ORG_ID', this.userInfo.OrgName)
        this.$set(this.dataForm, 'APPLY_DEPT_ID', this.userInfo.DeptID)
        this.$set(this.dataForm, 'APPLY_DEPT_NAME', this.userInfo.DeptName)
        this.$set(this.dataForm, 'APPLY_DOCTOR_ID', this.userInfo.DoctorID)
        this.$set(this.dataForm, 'APPLY_DOCTOR_NAME', this.userInfo.UserName)
        this.$set(
          this.dataForm,
          'ApplyModeId',
          'cc8b0c8e-2003-4f44-89ae-11092a922f21'
        )
      }
    },
    // 接受病历文件，检验检查文件并合并
    // listenFromChoice (RecordDict) {
    //   Bus.$emit('toRemote', RecordDict)
    //   // this.dataForm = Object.assign(this.dataForm, RecordDict)
    //   console.log(RecordDict)
    // },
    addPatientRecord () {
      if (this.patientMsg.ID) {
        this.$refs.choiceOrAdd.openDialog(this.patientMsg.ID)
      } else {
        this.$refs.choiceOrAdd.openDialog(this.patientMsg.patientID)
      }
    },
    // 获取病人病历基本信息
    getPatientRecord () {
      let params = {
        pid: this.dataForm.PatiendId
      }
      getBasePatient(params).then(({ data }) => {
        if (data !== null) {
          this.showAddRecordStatus = false
          this.patientMsg = data
        } else {
          this.showAddRecordStatus = true
        }
        this.$refs.dataForm.validateField('PatientName')
      })
    },
    // 显示新增报告弹出
    showReportDialog (params) {
      this.addReportDialogVisible = true
      this.reportType = params
    },
    // 填写报告后，生成报告ID
    getReportID (val) {
      if (val.hasOwnProperty('pacsID')) {
        this.PacsReportID = val.pacsID
      } else if (val.hasOwnProperty('lisID')) {
        this.lisReportID = val.lisID
      }
    },
    // 加载附件
    loadFiles () {
      this.$http({
        url: `/api/Upload/LoadFileByBizTypeId`,
        method: 'GET',
        params: { Id: this.ConsId }
      }).then(({ data }) => {
        if (data && data.status === 0) {
          if (data.data.length > 0) {
            const files = data.data
            // 患者知情同意书
            const PatientInfoAtt = files.filter(
              a => a.FileTypeId === 'a0fd0dfe-0fe8-40a6-a1c4-dbefa5141642'
            )
            if (PatientInfoAtt) {
              // this.dataForm.PatientInfoAtt = PatientInfoAtt
              this.PatientInfoAtt = PatientInfoAtt
            } else {
              this.PatientInfoAtt = []
            }
            // 其他附件
            const otherAtt = files.filter(
              a => a.FileTypeId === 'c1fb8d23-2227-455d-b6cc-b0be3db84503'
            )
            if (otherAtt) {
              this.otherAtt = [...otherAtt]
            } else {
              this.otherAtt = []
            }
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    addAttachmentList (val, name) {
      if (name === 'PatientInfoAtt') {
        this.PatientInfoAtt.push(val)
        this.$refs.dataForm.validateField('PatientInfoAtt')
      }
      if (name === 'otherAtt') {
        this.otherAtt.push(val)
      }
    },
    deleteFlie (name, index) {
      if (name === 'PatientInfoAtt') {
        this.PatientInfoAtt[index].Status = 1
      }
      if (name === 'otherAtt') {
        // this.otherAtt[index].Status = 1
        this.$set(this.otherAtt[index], 'Status', 1)
      }
    },
    // 附件图片显示
    preview (file) {
      const reg = /^(\s|\S)+(jpg|png|bmp|JPG|PNG)+$/
      if (reg.test(file.Path)) {
        this.dialogVisible = true
        this.img = file
      } else {
        window.open(this.$url + file.Path)
      }
    },
    // 加载字典
    async loadDicts () {
      await this.gethzlex()
      await this.gethzfs()
      await this.gethzfl()
      return Promise.resolve()
    },
    // -----会诊分类-----
    gethzfl () {
      return this.$http({
        url: this.$http.adornUrl('/api/baseDict/GetlistByType'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999,
          TypeId: '3dece27c-8c17-4f62-88e9-b3dbf88eb38a'
        })
      }).then(({ data }) => {
        if (data) {
          this.hzflTpye = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            this.hzflTpye[i].value = data.pageList[i].ID
            this.hzflTpye[i].label = data.pageList[i].NAME
          }
        }
      })
    },
    // -----会诊类型-----
    gethzlex () {
      return this.$http({
        url: this.$http.adornUrl('/api/baseDict/GetlistByType'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999,
          TypeId: '7d6a9d05-0f14-40fb-b66c-74026fd72dd7',
          subtypeid: '0af09240-7174-41bf-9c8b-efb2a3dec19c'
        })
      }).then(({ data }) => {
        if (data) {
          this.huzlx = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            this.huzlx[i].value = data.pageList[i].ID
            this.huzlx[i].label = data.pageList[i].NAME
          }
        }
      })
    },
    // -----会诊方式-----
    gethzfs () {
      return this.$http({
        url: this.$http.adornUrl('/api/baseDict/GetlistByType'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999,
          TypeId: '5370c7e0-7133-4fe2-a0f2-3d51907c4560'
        })
      }).then(({ data }) => {
        if (data) {
          this.hzfs = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            this.hzfs[i].value = data.pageList[i].ID
            this.hzfs[i].label = data.pageList[i].NAME
          }
        }
      })
    },
    // 医联体病人选择
    patientChoose (row) {
      this.patientMsg = row
      this.$refs.choiceOrAdd.openDialog(row.ID)
      let params = {
        pid: row.ID
      }
      getBasePatient(params).then(({ data }) => {
        if (data !== null) {
          this.patientMsg.p_sn = data.p_sn
          this.showAddRecordStatus = false
        } else {
          this.showAddRecordStatus = true
        }
        this.$refs.dataForm.validateField('PatientName')
      })
      // 医院科室 就院门诊 就诊卡号 住院号  出生日期 就诊次数 入院日期
      this.$set(this.dataForm, 'PatientName', row.PATIENT_NAME)
      this.dataForm.PatiendId = row.ID
      this.dataForm.HisPatiendId = null

      // this.get_patient_lastrecord()
    },
       // his病人选择
    hisPatientChoose (row) {
        // console.log(row)
      this.$set(this.dataForm, 'PatiendId', null)
      this.$set(this.dataForm, 'PatientName', row.Pname)
      this.$set(this.dataForm, 'HisPatiendId', row.Pid)
      this.patientMsg.p_sn = 999
        // // this.$refs.choiceAdRe.openDialog(row.PatientId)
        // this.dataForm.HisPatiendId = row.PatientId
        // this.dataForm.PatiendId = null
        // let param = {
        //   orgCode: row.OrgCode,
        //   patientId: row.PatientId
        // }
        // getPatientOrderSinglet(param).then(res => {
        //   this.$set(
        //     this.dataForm,
        //     'PreminaryDiagnosis',
        //     res.data.data.DiagnoseName
        //   )
        // })
    },
    // 下载模版
    download () {
      window.open(window.SITE_CONFIG['informedConsent'])
    },
    modeIdChange (id) {
      // this.dataForm.ApplyModeId = id
    },
    ApplyTypeChange (value) {
      // "5cb4ff0c-69bb-4235-b582-1d1222ea4ed0";//院内急诊
      // 1361e288-3620-41bc-885e-60828d86b0e0//院内平会诊
      // df9c0957-d7f3-4e57-912a-f38f41e70408 //院外平诊
      // 3f32de35-bf63-479d-92a8-b0402df4663c  //院外急会诊

      const isInHosp = inHosp.some(item => {
        return item === value
      })
      const isOutHosp = outHosp.some(item => {
        return item === value
      })
      const IsEmergency = IsEmergencyArr.some(item => {
        return item === value
      })
      const emergency = emergencyArr.some(item => {
        return item === value
      })

      if (isInHosp) {
        this.dataForm.IsInstitutional = '1'
      }
      if (isOutHosp) {
        this.dataForm.IsInstitutional = '0'
      }
      if (IsEmergency) {
        this.dataForm.IsEmergency = '0'
      }
      if (emergency) {
        this.dataForm.IsEmergency = '1'
      }
    },
    getNewPatient (val) {
      this.patientMsg = val.data
      this.$set(this.dataForm, 'PATIENT_NAME', val.data.patientName)
      this.$set(this.dataForm, 'PATIENT_ID', val.data.patientID)
      this.$set(this.dataForm, 'PatientName', val.data.patientName)
      this.dataForm.PatiendId = val.data.patientID
      this.dataForm.HisPatiendId = null
      this.$refs.choiceOrAdd.openDialog(val.data.patientID)
      let params = {
        pid: val.data.patientID
      }
      getBasePatient(params).then(({ data }) => {
        if (data !== null) {
          this.patientMsg.p_sn = data.p_sn
          this.showAddRecordStatus = false
        } else {
          this.showAddRecordStatus = true
        }
        this.$refs.dataForm.validateField('PatientName')

        console.log(this.patientMsg)
      })
    },
    // 获取科室列表
    // getDeptList () {
    //   const target = this.dataForm
    //   this.$refs.deptDialog.param = { orgid: target.TargetOrgId }
    //   this.$refs.deptDialog.pageIndex = 1
    //   this.$refs.deptDialog.getDataList()
    // }
    // 获取档次类型列表
    getTypeList () {
      this.$http({
        url: `/api/BaseDict/getlist`,
        methods: 'GET',
        params: {
          pageIndex: 1,
          pageSize: 999,
          keyword: '',
          typeid: '32fedfd7-abbe-4149-883f-ed94dd642fed',
          code: ''
        }
      }).then(({ data }) => {
        // console.log(data)
        if (data) {
          let i = JSON.stringify(data.pageList)
          this.typeList = JSON.parse(i)
        }
      })
    }
  }
}
