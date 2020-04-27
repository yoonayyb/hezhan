<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.patientName" placeholder="搜索姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="tableData" border="" v-loading="loading" style="width: 100%">
        <!-- <el-table-column
      fixed
      prop="sugar_time"
      label="日期"
      align="center"
      >
      <template slot-scope="scope">
          <div>{{ scope.row.sugar_time | formatTimeII}}</div>
      </template>
        </el-table-column>-->
        <el-table-column prop="patient_name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="type_name" label="血压类型" align="center"></el-table-column>
        <el-table-column prop="min_systolic_pressure" label="收缩压最低值" align="center"></el-table-column>
        <el-table-column prop="max_systolic_pressure" label="收缩压最高值" align="center"></el-table-column>
        <el-table-column prop="min_diastolic_pressure" label="舒张压最低值" align="center"></el-table-column>
        <el-table-column prop="max_diastolic_pressure" label="舒张压最高值" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
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
    <hypertensionBaseDialog
      :visible="editModalVisible"
      @upload="hypertensionBase"
      ref="editwrapper"
      @close="editModalVisible = false"
    ></hypertensionBaseDialog>
  </el-container>
</template>

<script>
import * as hypertension from "@/api/index";
import hypertensionBaseDialog from "./dialog/hypertensionBaseDialog";
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      formInline: {},
      detailForm: {},
      patientName: "",
      editModalVisible: false,
      loading: false,
      disabled: false
    };
  },

  components: {
    hypertensionBaseDialog
  },

  computed: {},
  created() {
    this.hypertensionBase();
  },
  methods: {
    handleClick(row) {
      this.editModalVisible = true;
      console.log(row);
      let params = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params);
      });
    },
    hypertensionBase() {
      this.loading = true;
      this.disabled = true;
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        patientName: this.patientName
      };
      hypertension
        .hypertensionBase(params)
        .then(res => {
          this.loading = false;
          this.disabled = false;
          if (res.data.status == 0) {
            console.log(res);
            this.tableData = res.data.pageList;
            this.tableData.totalCount = res.data.totalCount;
          } else {
            this.$message.error(res.msg);
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
      this.hypertensionBase();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      window.scrollTo(0, 0);
      this.hypertensionBase();
    },
    onSubmit() {
      this.patientName = this.formInline.patientName || "";
      this.hypertensionBase();
    }
  }
};
</script>
<style lang='scss' scoped>
.page {
  width: 100%;
  height: 100%;
}
/deep/.el-dialog__body {
  padding: 30px 85px !important;
}
</style>
