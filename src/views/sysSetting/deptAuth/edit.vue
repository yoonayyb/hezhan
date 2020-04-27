<template>
  <div>
    <el-form :model="dataForm" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="医院" prop="orgName">
        <el-input v-model="formElse.orgName" style="width: 200px" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="Dept">
        <el-input v-model="dataForm.Dept" style="width: 200px" :readonly="true"></el-input>
        <el-button type="text" @click="deptChoose">选择</el-button>
      </el-form-item>
      <el-form-item label="角色名称" prop="Name">
        <el-input v-model="dataForm.Name"></el-input>
      </el-form-item>
      <!--<el-form-item label="管理权限">-->
      <!--<tree-table :data="treeTableData" :eval-func="func" :eval-args="args" :expand-all="expandAll" border v-loading="treeTableLoading">-->
      <!--<el-table-column label="权限分配" prop="event">-->
      <!--<template slot-scope="scope">-->
      <!--<el-checkbox-group v-model="checkList" @change="handleCheckedRoleChange">-->
      <!--<el-checkbox label="复选框 A"></el-checkbox>-->
      <!--<el-checkbox label="复选框 B"></el-checkbox>-->
      <!--<el-checkbox label="复选框 C"></el-checkbox>-->
      <!--<el-checkbox label="禁用" disabled></el-checkbox>-->
      <!--<el-checkbox label="选中且禁用" disabled></el-checkbox>-->
      <!--</el-checkbox-group>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="全选" width="60" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-checkbox  @change="isSelectAll(scope)"></el-checkbox>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</tree-table>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交保存</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
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
      totalPage: 0,
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
      dataForm: {},
      formElse: {
        orgName: "柳州工人医院"
      },
      rules: {
        Dept: [{ required: true, message: "请选择科室", trigger: "blur" }],
        Name: [{ required: true, message: "请填写角色", trigger: "blur" }]
      },

      treeTableData: [], // 树形数据
      treeTableLoading: false, // 树形loading
      expandAll: false, // 是否展开全部
      checkList: [],
      isCheckedAll: false,
      isIndeterminate: true,

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
      if (id == 0) {
        getSysRoleViewModel({ id: 0 }).then(({ data }) => {
          this.dataForm = data;
        });
      } else {
        this.dataForm.ID = id;
        getSysRoleViewModel({ id: id }).then(({ data }) => {
          this.dataForm = data;
          this.dataForm.Dept = this.$route.query.deptName;
        });
      }
    },
    submitForm(formName) {
      this.dataForm.OrgId = "19710b16-39b1-41f6-a184-fe0586443775";
      this.$refs[formName].validate(valid => {
        if (valid) {
          sysRoleSave(this.dataForm).then(res => {
            if (res.data && res.data.status == 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.resetForm("form");
                  this.$router.push({ name: "sysRole" });
                }
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dataForm = {};
      this.$refs[formName].resetFields();
    },
    // 弹框关闭
    onModelClose() {
      console.log("close");
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
      console.log(row);
    },
    onPageChange(page) {
      this.pageIndex = page;
      this.getDept();
    },
    getDept() {
      let params = {
        orgid: "19710b16-39b1-41f6-a184-fe0586443775",
        pageSize: 15,
        pageIndex: this.pageIndex,
        keyword: this.keyword
      };
      getDept(params).then(res => {
        this.totalPage = res.data.totalCount;
        this.modelData = res.data.pageList;
      });
    },
    deptChoose() {
      this.showModel = true;
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
      console.log(val);
      this.checkList = val;
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.init(this.$route.query.id);
    }

    // 获取树形，现在不要
    // this.getMenuTree()
  },
  computed: {},
  activated() {
    if (this.$route.query.id) {
      this.init(this.$route.query.id);
    }
  }
};
</script>
