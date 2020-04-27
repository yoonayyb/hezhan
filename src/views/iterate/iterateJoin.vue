
<template>
  <el-container>
    <el-header style="height:auto">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.patientName" placeholder="关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-button type="primary" @click="addUser">添加</el-button> -->
    </el-header>
    <el-main>
      <el-table :data="tableData" border="" v-loading="loading" style="width: 100%" :highlight-current-row="highlight">
        <el-table-column prop="Name" label="迭代版本" align="center"></el-table-column>
        <el-table-column prop="ProjectName" label="项目名称" align="center"></el-table-column>
        <el-table-column prop="ExecutorName" label="执行者" align="center"></el-table-column>
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
        <el-table-column prop="StatusName" label="状态" align="center"></el-table-column>
        <el-table-column prop="PriorityName" label="优先级" align="center"></el-table-column>
        <el-table-column prop="WorkHour" label="工时" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,'see')" type="text" size="small">查看</el-button>
            <el-button @click="handleClick(scope.row,'edit')" type="text" size="small">修改</el-button>
            <el-button @click="handleClick(scope.row,'add')" type="text" size="small">添加子级</el-button>
            <el-button @click="delect(scope.row)" type="text" size="small">删除</el-button>
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
    <InformationDialong
      :visible="editModalVisible"
      ref="editwrapper"
      @upload="recordInformation"
      @close="editModalVisible = false"
    ></InformationDialong>
  </el-container>
</template>

<script>
import { recordInformation } from "@/api/modules/manbing.js";
import InformationDialong from "../iterate/dialog/informationDialog";
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      formInline: {},
      patientName: "",
      editModalVisible: false,
      loading: false,
      disabled: false,
      highlight: ""
    };
  },

  components: {
    InformationDialong
  },

  computed: {},
  created() {
    this.recordInformation();
  },
  methods: {
    addUser() {
      this.editModalVisible = true;
      this.$nextTick(res => {
        this.$refs.editwrapper.getItemList({});
      });
    },
    handleClick(row, type) {
      if (type == "see") {
        this.$router.push({ name: "iterateSee", params: { Id: row.Id } });
        return false;
      }
      this.editModalVisible = true;
      console.log(row);
      let params = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params, type);
      });
    },
    func(row) {
      console.log(row);
      return row.Id;
    },
    delect(row) {},
    recordInformation() {
      this.loading = true;
      this.disabled = true;
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        patientName: this.patientName,
        ListType: 3
      };
      recordInformation(params)
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
      this.recordInformation();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      window.scrollTo(0, 0);
      this.recordInformation();
    },
    onSubmit() {
      this.patientName = this.formInline.patientName || "";
      this.recordInformation();
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
