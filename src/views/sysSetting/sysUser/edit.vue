<template>
  <el-dialog :close-on-click-modal="false" :title="!dataForm.ID ? '新增' : '修改'" :visible.sync="visible" @close="close">
    <el-form :model="dataForm" :rules="dataRule" label-width="150px" ref="dataForm" style="width:460px">
      <el-form-item label="所在医院：" prop="Org_name">
        <el-select v-model="dataForm.Org_name" @change="orgChange" style="width:100%" placeholder="请选择医院">
          <el-option :key="item.ID" :label="item.ORG_NAME" :value="item.ORG_NAME" v-for="item in options"></el-option>
        </el-select>
        <!-- <el-input 
          v-model="dataForm.Org_name" 
        ></el-input>-->
      </el-form-item>
      <!-- <el-form-item
        label="所在科室："
        prop="Dept_name"
      > 
     <el-input 
          v-model="dataForm.Dept_name" 
        ></el-input>  
      </el-form-item>-->
      <el-form-item label="真实姓名：" prop="Name">
        <el-input v-model="dataForm.Name"></el-input>
      </el-form-item>
      <el-form-item label="登陆账号：" prop="Username">
        <el-input v-model="dataForm.Username"></el-input>
      </el-form-item>
      <el-form-item v-if="showPwd" label="账号密码" prop="Password">
        <el-input show-password v-model="dataForm.Password"></el-input>
      </el-form-item>
      <el-form-item label="默认角色：" prop="CODE">
        <el-select @change="defaultRoleChange" placeholder="请选择" style="width:100%" v-model="defaultRole">
          <el-option :key="item.ID" :label="item.NAME" :value="item.ID" v-for="item in roleSelectList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其他角色：" prop="CODE">
        <el-select @change="elseRoleChange" multiple placeholder="请选择" style="width:100%" v-model="elseRole">
          <el-option :key="item.ID" :label="item.NAME" :value="item.ID" v-for="item in roleSelectList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话：" prop="Phone">
        <el-input v-model="dataForm.Phone"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="Status">
        <el-radio-group v-model="dataForm.Status">
          <el-radio label="0">启用</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="submitButtonLoading" @click="dataFormSubmit()" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// "ROLE_ID": 0, USER_ID DEFAULT_ROLE  //0 其他 1 默认
import { getSysRolelist } from "@/utils/api";
import { hex_md5 } from "@/utils/md5";
export default {
  data() {
    return {
      visible: false,
      dataForm: { STATUS: "0" },
      dataRule: {
        /* roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ] */
      },
      isDistribution: "", // 账号是否被分配
      roleSelectList: [],
      elseRole: [], // 显示其他角色
      defaultRole: null, // 显示默认角色
      defaultRoleArr: [], // 存默认角色的
      elseRoleArr: [], // 存其他角色的
      submitButtonLoading: false,
      options: [],
      radio: "0",
      showPwd: false
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
    async init(id, row, option, edit) {
      console.log(option);
      if (option) {
        this.options = option; //获取医院数据select选项
      }
      // if(edit){
      //   this.dataForm = row
      //   this.visible = true
      //   console.log(this.dataForm)
      //   return false
      // }
      if (id) {
        let viewModel = await this.$http({
          url: `/api/SysUser/GetUserRoleViewModel`,
          method: "get",
          params: { id }
        });
        this.visible = true;
        this.dataForm = viewModel.data.data;
        console.log(this.dataForm);
        this.getRoleList();
        let UserRoleList = this.dataForm.UserRoleList;
        UserRoleList.forEach(i => {
          if (i.defaultRole === "1") {
            this.defaultRole = i.roleID;
            this.defaultRoleArr = [
              {
                DEFAULT_ROLE: "1",
                USER_ID: this.dataForm.ID,
                ROLE_ID: i.roleID
              }
            ];
          }
          if (i.defaultRole === "0") {
            this.elseRole.push(i.roleID);
            this.elseRoleArr.push({
              DEFAULT_ROLE: "0",
              USER_ID: this.dataForm.ID,
              ROLE_ID: i.roleID
            });
          }
        });
      } else {
        this.showPwd = true;
        // let viewModel = await this.$http({
        //   url: this.$http.adornUrl("/api/SysUser/GetUserRoleViewModel/0"),
        //   method: "get"
        // });

        // this.dataForm = viewModel.data;
        this.dataForm.Org_id = this.userInfo.OrgID;
        this.dataForm.Org_name = this.userInfo.OrgName;
        this.visible = true;
        this.getRoleList();
      }
    },
    orgChange(value) {
      // console.log(value);
      // let obj = {};
      // obj = this.option.find((item)=>{//这里的userList就是上面遍历的数据源
      //     return item.ID === value;//筛选出匹配数据
      // });
      // console.log(obj.ORG_NAME);//我这边的name就是对应label的
    },
    getRoleList() {
      getSysRolelist({
        orgid: this.dataForm.Org_id
      }).then(({ data }) => {
        this.roleSelectList = data.pageList;
      });
    },
    close() {
      this.$emit("close");
    },
    defaultRoleChange(val) {
      this.defaultRoleArr = [
        { DEFAULT_ROLE: "1", USER_ID: this.dataForm.ID, ROLE_ID: val }
      ];
    },
    elseRoleChange(val) {
      if (val) {
        this.elseRoleArr = [];
        val.forEach(item => {
          this.elseRoleArr.push({
            DEFAULT_ROLE: "0",
            USER_ID: this.dataForm.ID,
            ROLE_ID: item
          });
        });
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true;
          this.dataForm.UserRoleList = [
            ...this.defaultRoleArr,
            ...this.elseRoleArr
          ];
          let parmas = Object.assign({}, this.dataForm);
          if (this.showPwd && parmas.Password) {
            parmas.Password = hex_md5(parmas.Password);
          }
          this.$http({
            url: this.$http.adornUrl(`/api/SysUser/SaveUserRole`),
            method: "post",
            data: parmas
          }).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.submitButtonLoading = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.submitButtonLoading = false;
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
