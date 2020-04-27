<!--  -->
<template>
  <el-container>
    <el-header style="height:auto">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.Keyword" placeholder="输入关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addUser">添加</el-button>
    </el-header>
    <el-main>
      <el-table :data="tableData" border="" v-loading="loading" style="width: 100%">
        <el-table-column prop="Name" label="项目名称" align="center"></el-table-column>
        <el-table-column prop="BeginDate" label="开始时间" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.BeginDate | formatTimeI}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="EndDate" label="结束时间" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.EndDate | formatTimeI}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ExecutorName" label="执行人" align="center"></el-table-column>
        <el-table-column prop="PriorityName" label="优先级" align="center"></el-table-column>
        <el-table-column prop="StatusName" label="状态" width="100px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,'edit')" type="text" size="small">修改</el-button>
            <el-button @click="handleClick(scope.row,'see')" type="text" size="small">查看</el-button>
            <el-button @click="delete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        :page-size="pageSize"
        :page-sizes="[10 ,20, 40, 100]"
        layout="total, sizes, prev, pager, next"
        :total="tableData.totalCount"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page.sync="pageIndex"
      ></el-pagination>
    </el-footer>
    <PatientDialog
      :visible="patientVisible"
      :type="type"
      ref="patientwrapper"
      @upload="userInformation"
      @close="patientVisible = false"
    ></PatientDialog>
    <!-- <Edit
      :visible="editModalVisible"
      :type="type"
      ref="editwrapper"
      @upload="userInformation"
      @close="editModalVisible = false"
    ></Edit>-->
  </el-container>
</template>

<script>
import { userInformation } from "@/api/modules/manbing.js";
//导入添加的dialog
import PatientDialog from "./dialog/patientDialog";
// import Edit from "./dialog/edit";

import moment from "moment";
export default {
  data() {
    return {
      type: "修改",
      formInline: { Keyword: "" },
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      patientName: "",
      patientVisible: false,
      editModalVisible: false,
      seeVisible: false,
      loading: false,
      disabled: false
    };
  },

  components: {
    PatientDialog
    // Edit
  },

  computed: {},
  created() {
    this.userInformation();
  },
  methods: {
    handleClick(row, type) {
      if (type == "edit") {
        this.patientVisible = true;
        let params = Object.assign({}, row);
        this.$nextTick(() => {
          this.type = "修改";
          this.$refs.patientwrapper.getItemList(params);
        });
      } else if (type == "see") {
        this.$router.push({ name: "projectSee", params: { Id: row.Id } });
        // this.seeVisible = true;
        // console.log(row);
        // let params = Object.assign({}, row);
        // this.$nextTick(() => {
        //   this.$refs.seewrapper.getItemList(params);
        // });
      }
    },
    delete(row) {
      console.log(row);
    },
    addUser() {
      this.patientVisible = true;
      this.$nextTick(res => {
        this.type = "添加";
        this.$refs.patientwrapper.getItemList({});
      });
    },
    userInformation() {
      this.loading = true;
      this.disabled = true;
      let params = {
        PageSize: this.pageSize,
        PageIndex: this.pageIndex,
        Keyword: this.formInline.Keyword
      };
      userInformation(params)
        .then(res => {
          this.loading = false;
          this.disabled = false;
          if (res.data.Status == 0) {
            this.tableData = res.data.PageList;
            this.tableData.totalCount = res.data.TotalCount;
          } else {
            this.$message.error(res.Message);
          }
        })
        .catch(res => {
          this.loading = false;
          this.disabled = false;
        });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      window.scrollTo(0, 0);
      this.userInformation();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      window.scrollTo(0, 0);
      this.userInformation();
    },
    onSubmit() {
      this.patientName = this.formInline.Keyword;
      this.userInformation();
    }
  }
};
</script>
<style lang='scss' scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
