<template>
  <el-dialog
    :title="!dataForm.ID ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="100px">

      <el-form-item label="科室" style="width:60%;" prop="deptName" >
        <el-input v-model="dataForm.DeptName"></el-input>
      </el-form-item>

      <el-form-item label="医生名称" style="width:60%;" prop="UserName">
        <el-input v-model="dataForm.DoctorName"></el-input>
      </el-form-item>

      <el-form-item label="账号分配" style="width:60%;" prop="DESCRIPTION">
        <el-input v-model="dataForm.AccountName" readonly placeholder="请选择您要分配的账户">
          <el-button type="primary" slot="append" @click="chooseRole" :disabled="userInfo.accountID?true:false">选择</el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>


    <!--弹窗-->
    <Model
      ref="model"
      v-model="showModel"
      @close="onModelClose"
      @search="onModelSearch"
      @select="onModelSelect"
      @page-change="onPageChange"
      :totalPage="totalPage"
      :dataList="modelData"
      :placeholder="deptTable.placeholder"
      :column="deptTable.column">
    </Model>

  </el-dialog>
</template>

<script>
  import Model from '@/components/model/model'
  import {sysUersRole_GetAccountlist,sysUersRole_GetViewModel,sysUersRole_Save} from '@/utils/api.js'

  export default {
    components: {Model},
    data() {
      return {
        visible: false,
        dataForm: {},
        userInfo:{},
        dataRule: {
          /*roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]*/
        },

        showModel: false,
        modelData: [],
        totalPage: 0,
        deptTable: {
          title: "选择账户",
          placeholder: '搜索您想查询的账户',
          column: [
            {
              prop: "accountName",
              label: "账号"
            },
            {
              prop: "roleName",
              label: "角色名称"
            }
          ]
        },

        isAuth:''
      }
    },

    methods: {
      init(row) {
        this.userInfo=row
        console.log(row);
        sysUersRole_GetViewModel(row.id).then(res=>{
          this.dataForm=res.data
          this.dataForm.DeptName=row.deptName
          this.dataForm.DoctorName=row.userName
          this.dataForm.DoctorId=row.userID
          if(row&&row.accountID!=""){
            this.dataForm.AccountName=row.accountName
          }
          this.visible=true
        })
      },

      // 表单提交
      dataFormSubmit() {
        if(this.userInfo.accountID){
          this.visible = false
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            sysUersRole_Save(this.dataForm).then(res=>{
              console.log(res);
                if (res.data && res.data.status === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$refs.dataForm.resetFields();
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
            })
          }
        })
      },

      chooseRole() {
        let params={
          pageIndex:1,
          pageSize:15,
          keyword:''
        }
        sysUersRole_GetAccountlist(params).then(res=>{
          console.log(res);
          this.modelData=res.data.pageList
          this.showModel = true
        })
      },
      onModelClose() {

      },
      onModelSearch() {

      },
      onModelSelect(row) {
        this.dataForm.AccountId=row.accountID
        this.dataForm.AccountName=row.accountName
        this.showModel = false
      },
      onPageChange() {

      },
      getPermissionList() {

      }


    },

  }
</script>
