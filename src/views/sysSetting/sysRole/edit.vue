<template>
  <div>
    <el-form :model="dataForm" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="医院" prop="orgName">
        <el-input v-model="dataForm.OrgName" style="width: 400px" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="Name" :rules="[{ required: true, message: '请填写角色名称'}]">
        <el-input v-model="dataForm.Name" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')" :disabled="isSave">提交保存</el-button>
        <el-button @click="$store.commit('DEL_VISITED_VIEW', $route);$router.go(-1)">返回上一页</el-button>
      </el-form-item>
    </el-form>
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
      :column="deptTable.column"
    ></Model>
  </div>
</template>
<script>
import treeTable from "./TreeTable";
import treeToArray from "./TreeTable/customEval.js";
import Model from "@/components/model/model";
import {
  getDept,
  getMenuTree,
  sysRoleSave,
  getSysRoleViewModel
} from "@/utils/api.js";

export default {
  data() {
    return {
      // 弹窗
      showModel: false,
      modelData: [],
      isSave: false, // 防重复提交
      totalPage: 425,
      pageIndex: 0,
      keyword: "",
      deptTable: {
        title: "选择科室",
        placeholder: "搜索您想查询的科室",
        column: [
          {
            prop: "NAME",
            label: "科室"
          }
        ]
      },
      // 表单
      dataForm: {
        OrgName: "",
        Name: ""
      },
      formElse: {
        orgName: "柳州工人医院"
      },
      treeTableData: [], // 树形数据
      treeTableLoading: false, // 树形loading
      expandAll: false, // 是否展开全部
      checkList: [],
      isCheckedAll: false,
      isIndeterminate: true,
      submitButtonLoading: false,

      args: [null, null, "timeLine"],
      func: treeToArray
    };
  },
  components: {
    treeTable,
    Model
  },
  methods: {
    init(id) {
      if (!id) {
        this.dataForm.OrgName = this.$route.query.org;
        this.dataForm.OrgId = this.$route.query.orgid;
        // getSysRoleViewModel({ id: '0' }).then(({ data }) => {
        //   this.dataForm.Id = data.data.Id
        //   this.dataForm.NAME = data.data.NAME
        //   this.dataForm.OrgName = this.userInfo.OrgName;
        //   this.dataForm.OrgId = this.userInfo.OrgID;
        // });
      } else {
        // this.dataForm.ID = id;
        getSysRoleViewModel({ id: id }).then(({ data }) => {
          this.dataForm.Id = data.data.Id;
          this.dataForm.Name = data.data.Name;
          // this.dataForm = data.data;
          this.dataForm.OrgName = this.userInfo.OrgName;
          this.dataForm.Dept = this.$route.query.deptName;
          console.log(this.dataForm);
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isSave = true;
          sysRoleSave(this.dataForm).then(res => {
            if (res.data && res.data.status === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.$store.commit("DEL_VISITED_VIEW", this.$route);
                  this.$router.push({ name: "sysRole" });
                }
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.isSave = false;
          });
        }
      });
    },
    // 弹框关闭
    onModelClose() {
      this.pageIndex = 0;
      this.totalPage = 0;
      this.keyword = "";
    },
    onModelSearch(val) {
      this.keyword = val;
      this.pageIndex = 0;
      this.getDept();
    },
    // 科室选择
    onModelSelect(row) {
      this.dataForm.Dept = row.NAME;
      this.dataForm.DeptId = row.ID;
      this.showModel = false;
    },
    onPageChange(page) {
      this.pageIndex = page;
      this.getDept();
    },
    getDept() {
      let params = {
        orgid: this.userInfo.OrgID,
        pageSize: 15,
        pageIndex: this.pageIndex,
        keyword: this.keyword
      };
      getDept(params).then(res => {
        console.log(res);
        this.totalPage = res.data.totalCount;
        this.modelData = res.data.pageList;
        this.showModel = true;
      });
    },
    deptChoose() {
      this.getDept();
    },
    getMenuTree() {
      let params = {};
      this.dataListLoading = true;
      getMenuTree(params)
        .then(({ data }) => {
          if (data) {
            this.treeTableData = data;
            this.treeTableLoading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.treeTableLoading = false;
        });
    },
    isSelectAll(scope) {},
    handleCheckedRoleChange(val) {
      this.checkList = val;
    }
  },
  mounted() {
    this.init(this.$route.query.id);
    console.log(this.$route.query.org);
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  }
};
</script>
