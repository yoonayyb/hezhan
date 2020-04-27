<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="!dataForm.Id ? '新增' : '修改'"
      :visible.sync="visible"
    >
      <el-form :model="dataForm" label-width="150px" ref="dataForm">
        <el-form-item :rules="{ required: true, message: '请选择医院'}" label="医院" prop="OrgName">
          <el-input :readonly="true" style="width: 300px" v-model="dataForm.OrgName"></el-input>
          <el-button @click="orgDialogVisible=true" type="text">选择</el-button>
        </el-form-item>

        <el-form-item :rules="{ required: true, message: '请选择部门'}" label="部门" prop="DeptName">
          <el-input :readonly="true" style="width: 300px" v-model="dataForm.DeptName"></el-input>
          <el-button type="text" @click="deptDialogVisible=true">选择</el-button>
        </el-form-item>

        <el-form-item
          :rules="{ required: true, message: '请填写设备名称'}"
          label="设备名称"
          prop="DeviceName"
          style="width:60%;"
        >
          <el-input style="width: 300px" v-model="dataForm.DeviceName"></el-input>
        </el-form-item>

        <el-form-item
          :rules="{ required: true, message: '请选择购买时间'}"
          label="购买时间"
          prop="ButTime"
          style="width:60%;"
        >
          <el-date-picker
            placeholder="选择日期"
            style="width: 300px"
            type="date"
            v-model="dataForm.ButTime"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="是否闲置" style="width:60%;">
          <el-select placeholder="请选择设备状态" style="width: 300px" v-model="dataForm.IsFree">
            <el-option :value="0" label="闲置中"></el-option>
            <el-option :value="1" label="使用中"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备厂商" style="width:60%;">
          <el-select placeholder="请选择设备厂商" style="width: 300px" v-model="dataForm.SupplierId">
            <el-option
              :key="item.ID"
              :label="item.NAME"
              :value="item.ID"
              v-for="item in supplierSelectList"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备类型" style="width:60%;">
          <el-select placeholder="请选择设备类型" style="width: 300px" v-model="dataForm.DeviceTypeId">
            <el-option
              :key="item.ID"
              :label="item.NAME"
              :value="item.ID"
              v-for="item in deviceTypeSelectList"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备ip地址" prop="DeviceIp" style="width:60%;">
          <el-input style="width: 300px" v-model="dataForm.DeviceIp"></el-input>
        </el-form-item>

        <el-form-item label="设备端口1" prop="DevicePort1" style="width:60%;">
          <el-input style="width: 300px" v-model="dataForm.DevicePort1"></el-input>
        </el-form-item>

        <el-form-item label="设备端口2" prop="DevicePort2" style="width:60%;">
          <el-input style="width: 300px" v-model="dataForm.DevicePort2"></el-input>
        </el-form-item>

        <el-form-item label="拨号账号" prop="UserName" style="width:60%;">
          <el-input style="width: 300px" v-model="dataForm.UserName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="设备密码" prop="UserPwd" style="width:60%;">
          <el-input style="width: 300px" type="password" v-model="dataForm.UserPwd"></el-input>
        </el-form-item>-->

        <el-form-item label="码率" prop="Bitrate" style="width:60%;">
          <el-input
            style="width: 300px"
            v-model="dataForm.Bitrate"
            placeholder="MCU用到，取值1024、2048..."
          ></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="Remarkes">
          <el-input
            :autosize="{ minRows: 5, maxRows: 10}"
            style="width: 300px"
            type="textarea"
            v-model="dataForm.Remarkes"
          ></el-input>
        </el-form-item>
      </el-form>

      <span class="dialog-footer" slot="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="submitButtonLoading" @click="dataFormSubmit()" type="primary">确定</el-button>
      </span>

      <OrgDialog
        :column="[{label:'医院名称',prop:'ORG_NAME'},{label:'医院类型',prop:'INSTITUTION_TYPE'},{label:'医院等级',prop:'ORG_TYPE'}]"
        :request="orgRequest"
        @select="yymcSelect"
        title="选择医院"
        v-model="orgDialogVisible"
      />
      <DeptDialog
        :column="[{label:'科室名称',prop:'NAME'},{label:'科室类型',prop:'DEPT_TYPE_NAME'},{label:'电话',prop:'WORK_PHONE'}]"
        :isRequest="deptisRequest"
        :params="{orgid:this.dataForm.OrgId}"
        :request="deptRequest"
        @select="deptSelect"
        title="选择科室"
        v-model="deptDialogVisible"
      />

      <!--弹窗-->
      <!-- <Model
        :column="table.column"
        :dataList="modelData"
        :placeholder="table.placeholder"
        :totalPage="totalPage"
        @close="onModelClose"
        @page-change="onPageChange"
        @search="onModelSearch"
        @select="onModelSelect"
        v-model="showModel"
      ></Model>-->
    </el-dialog>
  </div>
</template>

<script>
import { getOrgDeviceViewModel, saveOrgDevice } from '@/utils/api.js'
import { getBaseDict } from '@/api/index'
import Dialog from '@/components/Dialogs/index'

export default {
  created () {
    getBaseDict('aa56dc00-8be5-4992-abcd-c8d99e3cf597').then(res => {
      this.deviceTypeSelectList = res.data.pageList
    })
    getBaseDict('d54610c2-2e73-42f6-8be2-9379b4fc9865').then(res => {
      this.supplierSelectList = res.data.pageList
    })
  },
  data () {
    return {
      visible: false,
      dataForm: {},
      dataFormElse: {},
      deviceTypeSelectList: [],
      supplierSelectList: [],
      orgRequest: function (params) {
        return this.$http({
          url: this.$http.adornUrl('/api/BaseOrg/GetAllianceListBase'),
          method: 'GET',
          params: params
        })
      },
      deptRequest: function (params) {
        return this.$http({
          url: this.$http.adornUrl('/api/BaseDept/Getlist'),
          method: 'GET',
          params: params
        })
      },
      orgDialogVisible: false,
      deptDialogVisible: false,
      deptisRequest: false,

      /*
       * 选择弹框
       * */
      submitButtonLoading: false
    }
  },

  components: {
    OrgDialog: Dialog,
    DeptDialog: Dialog
  },
  methods: {
    // 初始化
    init (id) {
      // console.log(id)
      if (id) {
        getOrgDeviceViewModel(id).then(({ data }) => {
          this.dataForm = data.data
        })
      } else {
        getOrgDeviceViewModel('0').then(({ data }) => {
          let i = {}
          this.dataForm = Object.assign(data.data, i)
          this.$refs.dataForm.resetFields()
          this.deptisRequest = false
        })
      }
      this.visible = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true
          let Viewdata = JSON.parse(JSON.stringify(this.dataForm))
          saveOrgDevice(Viewdata)
            .then(({ data }) => {
              if (data && data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 100,
                  onClose: () => {
                    this.visible = false
                    this.submitButtonLoading = false

                    this.$refs['dataForm'].resetFields()
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.submitButtonLoading = false
              }
            })
            .catch(() => {
              this.submitButtonLoading = false
            })
        }
      })
    },
    yymcSelect (row) {
      if (row) {
        this.dataForm.OrgName = row.ORG_NAME
        this.dataForm.OrgId = row.ID
        this.deptisRequest = true
      } else {
        this.$set(this.dataForm, 'OrgName', '')
        this.$set(this.dataForm, 'OrgId', '')
        this.deptisRequest = false
      }
    },

    deptSelect (row) {
      this.dataForm.DeptName = row.NAME
      this.dataForm.DeptId = row.ID
    }
  }
}
</script>
