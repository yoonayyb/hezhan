<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <!-- <span>这是一段信息</span> -->
      <div style="text-align: left;min-height: 50vh;" v-loading="loadStatus">
        <el-button v-if="showAddBtn" type="success" style="float:right;margin-right: 35px" @click="submitdataForm">保存</el-button>
        <!-- <h2 style="margin-top: 10px">
            就诊医院：<span v-text="patient_recordinfo.hname"></span>
        </h2> -->
        <!-- <h2 style="margin-top: 20px">
          当前就诊次数为第
          <span v-text="p_sn"></span> 次
        </h2> -->
        <h2 v-if="showAddBtn" style="margin-top: 10px">
            <span v-text="patient_recordinfo.pname"></span> 在 <span v-text="patient_recordinfo.hname"></span> 第 <span style="color:red" v-text="org_sn"></span> 次就诊
        </h2>
        <div style="margin-top: 20px">
          <h3>
            如果就诊次数不正确请重新创建病历基本信息：
            <el-button type="primary" size="small" style="margin-left: 10px" @click="addbasicele">病历基本信息</el-button>
          </h3>
          <h3 v-if="showAddBtn" style="margin-top: 10px">上传文件：
            <el-button 
            type="primary"
              size="small"
              style="margin-left: 6px"
              @click="showEmrFile"
              >病历文件</el-button>
              <el-button 
            type="primary"
              size="small"
              style="margin-left: 6px"
              @click="addPacsDialogVisible = true"
              >检查报告</el-button>
              <el-button 
            type="primary"
              size="small"
              style="margin-left: 6px"
              @click="addLisDialogVisible = true"
              >检验报告</el-button>
          </h3>
          <div v-if="showAddBtn">
            <h3 style="margin-top: 10px">手录病历：
              <el-button 
            type="primary"
              size="small"
              style="margin-left: 6px"
              @click="centerDialogButtom = true"
              >手录病历</el-button>
            </h3>
            <!-- <el-button
              v-for="(item,index) in recordType"
              @click="toAddRecord(item.id)"
              type="primary"
              size="small"
              :key="index"
              style="margin: 10px"
            >{{ item.name }}</el-button> -->
          </div>
        </div>
        <div>
          <medicalRecord v-if="showAddBtn" :id="patientId" :tabs="tabs" :applyId='applyID' ref="medicalRecord"></medicalRecord>
        </div>
        <!-- <el-button type="info">不是(需要从新创建病历基本信息)</el-button>
        <el-button type="success" @click="openShowRecord">是(直接查看患者病历)</el-button>-->
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- <checkRecord :id="patientId" ref="checkRecord"></checkRecord> -->
    <el-dialog
    style="padding: 10px"
      :visible.sync="centerDialogButtom"
      left
      title="手录病历"
      width="50%"
    >
      <el-row>
            <el-col :span="6" v-for="(item,index) in recordType" :key="index" style="text-align: left">
              <div>
                <el-button
                  type="primary"
                  @click="toAddRecord(item.id)"
                  style="margin: 10px;width:150px"
                >{{ item.name }}</el-button>
              </div>
            </el-col>
          </el-row>
      <span class="dialog-footer" slot="footer">
        <el-button @click="centerDialogButtom=false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible1"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible1"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrCourseRecord
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addEmrCourseRecord>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible4"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible4"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrPatient :patientID="this.patientId" @listentochild="showmsgfromchild"></addEmrPatient>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible5"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible5"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addFristRecord
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addFristRecord>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible6"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible6"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrDaily
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addEmrDaily>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible7"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible7"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrWard
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addEmrWard>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible8"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible8"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordShfit
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordShfit>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible9"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible9"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordSuccession
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordSuccession>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible10"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible10"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordDischarge
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordDischarge>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible11"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible11"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordOut
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordOut>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible12"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible12"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordIn
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordIn>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible13"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible13"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrRescue
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addEmrRescue>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible14"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible14"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrOp
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addEmrOp>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible15"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible15"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrPostOperative
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addEmrPostOperative>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible16"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible16"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordSummary
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordSummary>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible17"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible17"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordOdituary
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordOdituary>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible18"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible18"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordDiscussion
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordDiscussion>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible19"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible19"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordPs
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordPs>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible20"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible20"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordRopd
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordRopd>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible21"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible21"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordOperation
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordOperation>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible22"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible22"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordNursing
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordNursing>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible23"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible23"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordOd
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordOd>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible24"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible24"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addRecordDisDie
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addRecordDisDie>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="centerDialogVisible25"
      :before-close="Reflash_page"
      :visible.sync="centerDialogVisible25"
      left
      title="新增"
      width="1200px"
    >
      <div>
        <addEmrCon
          :doctorTitle="doctorTitle"
          :name="this.patient_recordinfo.pname"
          :patient_recordinfo="patient_recordinfo"
          :patientID="this.patientId"
          @listentochild="showmsgfromchild"
        ></addEmrCon>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="Reflash_page">关 闭</el-button>
      </span>
    </el-dialog>
    <edit ref='edit' :p_sn='p_sn' :patientID='patientId'></edit>
    <addPacsReport
      :patientMsg="patient_recordinfo"
      :reportType="0"
      @close="addPacsDialogVisible=false"
      @getReportID="getPacsReportID"
      v-if="addPacsDialogVisible"
    ></addPacsReport>
    <addLisReport
      :patientMsg="patient_recordinfo"
      :reportType="1"
      @close="addLisDialogVisible=false"
      @getReportID="getLisReportID"
      v-if="addLisDialogVisible"
    ></addLisReport>
  </div>
</template>
<script>
import { saveListByApply } from '@/api/index'
import addLisReport from '@/views/patient/checkReport'
import addPacsReport from '@/views/patient/checkReport'
import Bus from '@/components/business/ElectronicMedicalRecord/emrFile/bus.js'
import medicalRecord from '@/components/business/ElectronicMedicalRecord/index.vue'
import edit from '@/components/business/ElectronicMedicalRecord/emrFile/edit.vue'
// import checkRecord from "./checkRecord.vue";
import addEmrCourseRecord from '@/views/patient/component/medicalRecord/EmrCourseRecord/addEmrCourseRecord.vue'
import addRecordDischarge from '@/views/patient/component/medicalRecord/RecordDisCharge/addRecordDischarge.vue'
import addRecordShfit from '@/views/patient/component/medicalRecord/RecordShift/addRecordShfit.vue'
import addRecordSuccession from '@/views/patient/component/medicalRecord/RecordSuccess/addRecordSuccession.vue'
import addEmrDaily from '@/views/patient/component/medicalRecord/EmrDaily/addEmrDaily.vue'
import addEmrWard from '@/views/patient/component/medicalRecord/EmrWard/addEmrWard.vue'
import addFristRecord from '@/views/patient/component/medicalRecord/FristRecord/addFristRecord.vue'
import addEmrPatient from '@/views/patient/component/medicalRecord/EmrPatient/addEmrPatientFromChoice.vue'
import addEmrCon from '@/views/patient/component/medicalRecord/EmrCon/addEmrCon.vue'
import addEmrOp from '@/views/patient/component/medicalRecord/EmrOp/addEmrOp.vue'
import addEmrPostOperative from '@/views/patient/component/medicalRecord/EmrPostOperative/addEmrPostOperative.vue'
import addEmrRescue from '@/views/patient/component/medicalRecord/EmrRescue/addEmrRescue.vue'
import addRecordDiscussion from '@/views/patient/component/medicalRecord/RecordDiscussion/addRecordDiscussion.vue'
import addRecordDisDie from '@/views/patient/component/medicalRecord/RecordDisDie/addRecordDisDie.vue'
import addRecordIn from '@/views/patient/component/medicalRecord/RecordIn/addRecordIn.vue'
import addRecordNursing from '@/views/patient/component/medicalRecord/RecordNursing/addRecordNursing.vue'
import addRecordOd from '@/views/patient/component/medicalRecord/RecordOd/addRecordOd.vue'
import addRecordOdituary from '@/views/patient/component/medicalRecord/RecordOdituary/addRecordOdituary.vue'
import addRecordOperation from '@/views/patient/component/medicalRecord/RecordOperation/addRecordOperation.vue'
import addRecordOut from '@/views/patient/component/medicalRecord/RecordOut/addRecordOut.vue'
import addRecordPs from '@/views/patient/component/medicalRecord/RecordPs/addRecordPs.vue'
import addRecordRopd from '@/views/patient/component/medicalRecord/RecordRopd/addRecordRopd.vue'
import addRecordSummary from '@/views/patient/component/medicalRecord/RecordSummary/addRecordSummary.vue'
export default {
  data () {
    return {
      loadStatus: true,
      FromFlag: 0,  // 0为来自新增，1为来自修改
      applyID: '', // 申请单ID，只有补充才会有
      addLisDialogVisible: false,
      addPacsDialogVisible: false,
      centerDialogButtom: false,
      tabs: 0,
      centerDialogVisible1: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      centerDialogVisible5: false,
      centerDialogVisible6: false,
      centerDialogVisible7: false,
      centerDialogVisible8: false,
      centerDialogVisible9: false,
      centerDialogVisible10: false,
      centerDialogVisible11: false,
      centerDialogVisible12: false,
      centerDialogVisible13: false,
      centerDialogVisible14: false,
      centerDialogVisible15: false,
      centerDialogVisible16: false,
      centerDialogVisible17: false,
      centerDialogVisible18: false,
      centerDialogVisible19: false,
      centerDialogVisible20: false,
      centerDialogVisible21: false,
      centerDialogVisible22: false,
      centerDialogVisible23: false,
      centerDialogVisible24: false,
      centerDialogVisible25: false,
      patient_recordinfo: '',
      patientId: '',
      dialogVisible: false,
      p_sn: 0,
      org_sn: 0,
      doctorTitle: '',
      recordType: {},
      showAddBtn: false,
      dataForm: {},
      rowsave: ''
    }
  },
  components: {
    addLisReport,
    addPacsReport,
    // checkRecord,
    edit,
    medicalRecord,
    addEmrCourseRecord,
    addRecordDischarge,
    addRecordShfit,
    addRecordSuccession,
    addEmrDaily,
    addEmrWard,
    addFristRecord,
    addEmrCon,
    addEmrOp,
    addEmrPostOperative,
    addEmrRescue,
    addRecordDiscussion,
    addRecordDisDie,
    addRecordIn,
    addRecordNursing,
    addRecordOd,
    addRecordOdituary,
    addRecordOperation,
    addRecordOut,
    addRecordPs,
    addRecordRopd,
    addRecordSummary,
    addEmrPatient
  },
  created () {
    // 拿到所有的病历文件的ID
    Bus.$on('getabdata', target => {
      this.dataForm.EMRFileViewModel = target
      console.log(this.dataForm)
    })
    // 拿所有检查报告文件的ID
    Bus.$on('getPacsList', target => {
      this.dataForm.pacsReportViewModel = target
      // console.log(this.dataForm)
    })
    // 拿所有检验报告文件的ID
    Bus.$on('getLisList', target => {
      this.dataForm.lisReportViewModel = target
      // console.log(this.dataForm)
    })
    // 刷新就诊次数
    // Bus.$on('getMdicalRecordData', target => {
    //   this.getMedicalRecordData()
    // })
  },
  methods: {
    openDialog (patientId) {
      this.loadStatus = true
      this.FromFlag = 0
      this.dialogVisible = true
      document.body.style['overflow-y'] = 'hidden'
      this.patientId = patientId
      this.getMedicalRecordData()
      this.getTypeinfo()

      // console.log(patientId)
    },
    //  从修改来打开对话框
    // openDialogFromChange (row) {
    //   this.FromFlag = 1
    //   // console.log(row)
    //   this.rowsave = row
    //   this.dialogVisible = true
    //   document.body.style['overflow-y'] = 'hidden'
    //   if (row.PATIENT_ID) {
    //     this.patientId = row.PATIENT_ID
    //     this.applyID = row.ID
    //   } else {
    //     this.patientId = row.PatiendId
    //     this.applyID = row.Id
    //   }
    //   this.getMedicalRecordData()
    //   this.getTypeinfo()
    // },
    submitdataForm () {
      this.dialogVisible = false
      if (this.FromFlag === 0) {
        this.$parent.listenFromChoice(this.dataForm)
      } else {
        let params = {
          PatientID: this.patientId,
          ApplyID: this.applyID,
          SN: this.p_sn
        }
        params = Object.assign(this.dataForm, params)
        // console.log(this.dataForm)
        saveListByApply(params).then((data) => {
          console.log(data)
        })
        // console.log(this.applyID)
      }
      document.body.style['overflow-y'] = 'auto'
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
    getMedicalRecordData () {
      // console.log(123)
      this.$http({
        url: this.$http.adornUrl('/api/emrpatient/GetEmrPatientLast'),
        methods: 'GET',
        params: this.$http.adornParams({
          pid: this.patientId
        })
      }).then(({ data }) => {
        if (data) {
          this.patient_recordinfo = data
          // console.log(data.p_sn)
          this.p_sn = data.p_sn
          this.org_sn = data.org_sn
          this.showAddBtn = true
          this.getTypeOfRecord()
        } else {
          this.addbasicele()
          this.showAddBtn = false
          this.p_sn = 0
        }
        this.loadStatus = false
      })
    },
    // 获取所有可以添加的病历类型
    getTypeOfRecord () {
      this.$http({
        url: '/api/Progress/GetlistUse',
        methods: 'GET',
        params: {
          patientID: this.patientId,
          vistSn: this.p_sn
        }
      }).then(({ data }) => {
        // console.log(data)
        this.recordType = data.pageList
      })
    },
    // 获取医生的所有职称
    getTypeinfo () {
      this.$http({
        url: this.$http.adornUrl('/api/BaseDict/GetlistByType'),
        method: 'GET',
        params: this.$http.adornParams({
          typeid: '043db869-3ac1-4dea-993d-97074246b421'
        })
      }).then(({ data }) => {
        if (data) {
          // this.hosp_doc = data.pageList
          // console.log(data)
          this.doctorTitle = data.pageList
        }
      })
    },
    addadmin () {
      this.centerDialogVisible1 = true
      document.body.style['overflow-y'] = 'hidden'
      // this.$router.push({ name: 'admissionRecord' })
    },
    // addtype () {
    //   this.addpatientrecordtDialogVisible = false
    //   this.centerDialogVisible3 = true
    // },
    addbasicele () {
      this.centerDialogVisible4 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addfirstre () {
      this.centerDialogVisible5 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addemr () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible6 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addemrWard () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible7 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addrecordshift () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible8 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addrecordsuccess () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible9 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    adddrecorddischarge () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible10 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    adddRecordOut () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible11 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    adddRecordIn () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible12 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    adddEmrRescue () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible13 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    adddEmrOp () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible14 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    adddEmrPostOperative () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible15 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    adddRecordSummary () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible16 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addRecordOdituary () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible17 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addRecordDiscussion () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible18 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addRecordPs () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible19 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addRecordRopd () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible20 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addRecordOperation () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible21 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addRecordNursing () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible22 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addRecordOd () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible23 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addRecordDisDie () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible24 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    addEmrCon () {
      this.addpatientrecordtDialogVisible = false
      this.centerDialogVisible25 = true
      document.body.style['overflow-y'] = 'hidden'
    },
    // 新增病例分流
    toAddRecord (id) {
      switch (id) {
        case 'cdf6a745-61ff-403c-a3fa-ebf8e2cbc16f':
          this.addadmin()
          break
        case '3d128c08-01fe-4a9a-8996-498b57cf20c8':
          this.addfirstre()
          break
        case '92743ae1-5c37-4692-984c-645119b00efc':
          this.addemr()
          break
        case '9d376312-45a5-4230-a488-678e681cfeb5':
          this.addemrWard()
          break
        case '92a63d18-f4d6-42f2-ada8-2c202320cc84':
          // 门（急）诊初诊病历
          this.addRecordOd()
          break
        case '0f2e1675-e16e-48e4-9da2-d4f4b04c2e82':
          // 病重（病危）患者护理记录
          break
        case 'b1c4ac74-306d-4478-9040-74d1b5256c9c':
          // 死亡记录
          this.addRecordOdituary()
          break
        case '2eefac80-da90-45bd-97b7-4e3ec857602a':
          // 死亡病例讨论记录
          this.addRecordDisDie()
          break
        case '1511171b-4b5a-4611-9a0f-d8aab12e5172':
          // 手术安全核查记录
          this.addRecordRopd()
          break
        case 'b432429d-165b-451f-82bf-a25ccb051c47':
          break
        case '79521f63-5d2e-40ea-8d79-98e963c7ea59':
          // 术前小结
          this.addRecordPs()
          break
        case '53939bf9-b282-4b0d-b0b6-052f249e5400':
          // 手术记录
          this.addRecordOperation()
          break
        case 'd476b4d3-c0c0-4653-8807-9c4208e4f0ab':
          // 术后首次病程记录
          this.adddEmrPostOperative()
          break
        case 'eca40c6c-1427-4d55-9a22-c512b291277b':
          // 交班记录
          this.addrecordshift()
          break
        case '428ab41b-c79a-4e42-85e5-0afeb7a574ca':
          // 接班记录
          this.addrecordsuccess()
          break
        case '6bc27bc0-ac4e-4d84-8729-1ea492d560bd':
          // 手术同意书
          break
        case '0d130089-cf08-4aad-9fba-7524e972efd8':
          // 会诊记录
          this.addEmrCon()
          break
        case '0e190782-cc52-4caf-8118-446febdfeb12':
          // 有创诊疗操作记录
          this.adddEmrOp()
          break
        case '01f6a38d-9ce9-4df5-b477-7179df240c6c':
          // 抢救记录
          this.adddEmrRescue()
          break
        case '81a15958-1589-4cbc-a12c-36dbd47fac94':
          // 阶段小结
          this.adddRecordSummary()
          break
        case '60332ab9-f597-4244-afa1-83e789337f01':
          // 疑难病例讨论记录
          this.addRecordDiscussion()
          break
        case 'b84ab9ef-34b6-4589-aa51-1ad2e119768a':
          // 出院记录
          this.adddrecorddischarge()
          break
        case '01685a17-78b1-4299-bb31-7f90f1a63622':
          // 转出记录
          this.adddRecordOut()
          break
        case '2d362e3f-4440-4e13-bb8e-ba66e58c7ff8':
          // 转入记录
          this.adddRecordIn()
          break
        case '33d51949-8492-466e-8cfb-36f9931ca454':
          // 一般患者护理记录
          this.addRecordNursing()
          break
      }
    },
    Reflash_page () {
      this.centerDialogVisible1 = false
      this.centerDialogVisible4 = false
      this.centerDialogVisible5 = false
      this.centerDialogVisible6 = false
      this.centerDialogVisible7 = false
      this.centerDialogVisible8 = false
      this.centerDialogVisible9 = false
      this.centerDialogVisible10 = false
      this.centerDialogVisible11 = false
      this.centerDialogVisible12 = false
      this.centerDialogVisible13 = false
      this.centerDialogVisible14 = false
      this.centerDialogVisible15 = false
      this.centerDialogVisible16 = false
      this.centerDialogVisible17 = false
      this.centerDialogVisible18 = false
      this.centerDialogVisible19 = false
      this.centerDialogVisible20 = false
      this.centerDialogVisible21 = false
      this.centerDialogVisible22 = false
      this.centerDialogVisible23 = false
      this.centerDialogVisible24 = false
      this.centerDialogVisible25 = false
      // document.body.style["overflow-y"] = "auto";
    },
    Reflash_Mainpage () {
      this.showAddBtn = false
      this.dialogVisible = false
      document.body.style['overflow-y'] = 'auto'
    },
    handleClose (done) {
      this.$confirm('您上传的病历文件，检验检查报告还未保存，关闭则会销毁，是否确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            this.Reflash_Mainpage()
            done()
          })
          .catch(_ => {
          })
    },
    showmsgfromchild (data) {
      // console.log(data)
      // if (data) {\
      this.tabs = data
      if (data === 1) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible1 = false
        // document.body.style["overflow-y"] = "auto";
      }
      //   if (data === 3) {
      //     this.centerDialogVisible3 = false
      //     this.text_num = data
      //   }
      if (data === 4) {
        // Bus.$emit('getMdicalRecordData', event)
        this.centerDialogVisible4 = false
        // this.getMedicalRecordData()
        // this.getMedicalRecordData()
        this.Reflash_Mainpage()
        this.$nextTick(function () {
          this.openDialog(this.patientId)
        })
        // this.getTypeinfo()
        // this.getTypeOfRecord()
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 5) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible5 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 6) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible6 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 7) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible7 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 8) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible8 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 9) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible9 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 10) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible10 = false
        document.body.style['overflow-y'] = 'auto'
      }
      if (data === 11) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible11 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 12) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible12 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 13) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible13 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 14) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible14 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 15) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible15 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 16) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible16 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 17) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible17 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 18) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible18 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 19) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible19 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 20) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible20 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 21) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible21 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 22) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible22 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 23) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible23 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 24) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible24 = false
        // document.body.style["overflow-y"] = "auto";
      }
      if (data === 25) {
        Bus.$emit('getMdicalRecordData', this.tabs)
        this.centerDialogVisible25 = false
        // document.body.style["overflow-y"] = "auto";
      }
    },
    showEmrFile () {
      this.$refs.edit.showDialog()
    }
  },
  beforeDestroy () {
    Bus.$off('getabdata')
    Bus.$off('getPacsList')
    Bus.$off('getLisList')
    Bus.$off('getHandleReocrdList')
  }
}
</script>

