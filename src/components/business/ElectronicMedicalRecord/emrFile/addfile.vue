<template>
  <el-dialog
    :append-to-body="true"
    :title="'上传'+dataForm.pn_type"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
    v-if="dialogVisible"
    center
  >
    <!-- <span>这是一段信息</span> -->
    <el-form
      ref="dataForm"
      label-width="120px"
      :model="dataForm"
      :rules="rules"
    >
      <el-form-item
        label="标题"
        prop="progress_note_name"
      >
        <el-input
          placeholder="请输入标题"
          v-model="dataForm.progress_note_name"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="上传病历文件"
        prop="path"
      >
        <div>
          <span
            :key="item.Id"
            v-for="item in res_list"
          >
            <el-tag
              @close="deleteDicomFile()"
              class="cursor-pointer"
              closable
              type="info"
              v-if="item"
            >
              <i class="el-icon-document"></i>
              <i>{{item.Name}}</i>
            </el-tag>
          </span>
        </div>
        <Upload
          :formatFile="['jpg','png','jpeg','bmp']"
          :FileTypeInfo="{tableId:$route.params.id?$route.params.id:'0',
          FileType:recordInfo.name,
          FileTypeId:recordInfo.id}"
          @getFileInfo="getFile"
        />
        <div class='transfont'>仅支持png、jpg、jpeg、bmp格式</div>
        <!-- <div v-if="errorShow" style="color: red">请上传文件</div> -->
      </el-form-item>
      <el-form-item
        label="病历文件日期"
        prop="r_time"
        :rules="{ required: true, message: '请选择日期', trigger: 'change' }"
      >
        <el-date-picker
          :editable="false"
          v-model="dataForm.r_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="submitDataForm(dataForm)"
        v-loading="loadStatus"
      >提交</el-button>
      <el-button @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Bus from './bus.js'
import Upload from '@/components/upload/index'
import { uploadEmrFile } from '@/api/index'
import { getPatientRecord } from '@/utils/api'
import { debug } from 'util'

export default {
  data () {
    const validateReportFileViewModel = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请上传病历文件'))
      } else {
        callback()
      }
    }
    return {
      res_list: '',
      loadStatus: false,
      dataForm: {
        progress_note_name: '',
        path: '',
        r_time: ''
      },
      recordInfo: {},
      dialogVisible: false,
      errorShow: false,
      rules: {
        path: [
          {
            validator: validateReportFileViewModel,
            trigger: 'change',
            required: true
          }
        ],
        progress_note_name: [
          {
            max: 50,
            trigger: 'blur',
            message: '标题字数不能超过50字'
          }
        ]
      }
    }
  },
  components: {
    Upload
  },
  methods: {
    deleteDicomFile () {
      this.dataForm.path = ''
      this.dataForm.thu_path = ''
      this.res_list = []
    },
    handleClose (done) {
      this.loadStatus = false
      // this.errorShow = false
      this.dialogVisible = false
      // this.dataForm.path = ''
      // this.dataForm.thu_path = ''
      this.$refs.dataForm.resetFields()
      this.res_list = ''
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
    },
    showAdd (item, p_sn, PatiendId) {
      this.recordInfo = item
      console.log(item)
      this.dialogVisible = true
      this.dataForm.p_sn = p_sn
      this.dataForm.pid = PatiendId
      this.dataForm.pname = this.$route.query.name
      this.dataForm.pn_type_id = item.id
      this.dataForm.pn_type = item.name
      // this.dataForm = Object.assign(item, this.dataForm)
      this.getPatientRecord()
      // console.log(this.dataForm)
    },
    // 上传文件回调
    getFile (val) {
      // console.log(val)
      this.res_list = []
      this.res_list.unshift(val)
      this.dataForm.path = val.Path
      this.dataForm.thu_path = val.ThumbnailPath
      this.$refs.dataForm.validateField('path')
    },
    // 获取患者对应的病历基本信息
    getPatientRecord () {
      getPatientRecord({
        pid: this.dataForm.pid,
        vistSn: this.dataForm.p_sn
      }).then(({ data }) => {
        // console.log(data)
        this.dataForm.hname = data.hname
        this.dataForm.orgid = data.id
        this.dataForm.p_dept = data.p_dept
        this.dataForm.p_ward = data.p_ward
        this.dataForm.p_bed = data.p_bed
      })
    },
    submitDataForm (dataForm) {
      // console.log(dataForm.path)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loadStatus = true
          if (this.dataForm.progress_note_name === '' || !this.dataForm.progress_note_name) {
            this.dataForm.progress_note_name = '无标题'
          }
          uploadEmrFile(this.dataForm).then(({ data }) => {
            // this.loadStatus = false
            if (data.status === 0) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              // this.dialogVisible = false
              this.handleClose()
              // console.log(data)
              Bus.$emit('getTarget', data.data)
              Bus.$emit('getTar', event.target)
              // this.$parent.ChangeInsiteStatus()
              // this.res_list = []
              // this.dataForm = {}
            } else {
              this.loadStatus = false
              this.$message({
                message: data.msg,
                type: 'warning'
              })
            }
            // console.log(data)
            // this.$emit('getReportID', data.data)
            // this.$emit('close', '')
          })
        } else {
          this.loadStatus = false
          console.log('表单填写错误')
          return false
        }
      })

      // console.log(this.dataForm)
    }
  }
}
</script>
