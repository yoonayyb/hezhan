<template>
  <el-dialog
    :title="!dataForm.ID ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="100px">

      <el-form-item label="科室" style="width:60%;" prop="deptName">
        <el-input v-model="dataForm.DeptName" readonly></el-input>
      </el-form-item>

      <el-form-item label="医生名称" style="width:60%;" prop="UserName">
        <el-input v-model="dataForm.DoctorName" readonly></el-input>
      </el-form-item>

      <el-form-item label="角色分配" style="width:60%;" prop="RoleName">
        <el-input v-model="dataForm.RoleName" readonly placeholder="请选择您要分配的角色">
          <el-button slot="append" type="primary"   @click="chooseRole">选择</el-button>
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
  import {sysUersRole_GetRolelist,sysUersRole_GetViewModel,sysUersRole_Save} from '@/utils/api.js'

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

        /*弹框
        * */
        showModel: false,
        modelData: [],
        totalPage: 0,
        deptTable: {
          title: "选择角色",
          placeholder: '搜索您想查询的角色',
          column: [
            {
              prop: "roleName",
              label: "角色名称"
            }
          ]
        },
      }
    },

    methods: {
      init(row) {
        this.userInfo=row
        sysUersRole_GetViewModel(row.id).then(res=>{
          console.log('dadad',res);
          this.dataForm=res.data
          console.log('ssbc',this.dataForm);
          this.dataForm.DeptName=row.deptName
          this.dataForm.DoctorName=row.userName
          this.dataForm.DoctorId=row.userID
          if(row&&row.roleID!=""){
            this.dataForm.RoleName=row.roleName
          }
          this.visible=true
        })
      },

      // 表单提交
      dataFormSubmit() {
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


      getDataList(){
        let params={
          pageIndex:1,
          pageSize:15,
          deptid:this.userInfo.deptID
        }
        sysUersRole_GetRolelist(params).then(res=>{
          console.log(res);
          this.modelData=res.data.pageList
          this.showModel = true
        })
      },
      chooseRole() {
        this.getDataList()
      },
      onModelClose() {

      },
      onModelSearch(val) {
        this.getDataList()
      },
      onModelSelect(row) {
        console.log(row);
        this.dataForm.RoleId=row.roleID
        this.dataForm.RoleName=row.roleName
        this.showModel = false
      },
      onPageChange() {

      },
      getPermissionList() {

      }


    },

  }
</script>
