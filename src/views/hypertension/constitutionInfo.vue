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
        <el-table-column fixed prop="screen_time" label="日期" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.screen_time | formatTimeII}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="patient_name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="height" label="身高" align="center"></el-table-column>
        <el-table-column prop="weight" label="体重" align="center"></el-table-column>
        <el-table-column prop="bmi" label="体质指数值" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
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
    <constitutionInfoDialog
      :visible="editModalVisible"
      ref="editwrapper"
      @upload="constitutionInfo"
      @close="editModalVisible = false"
    ></constitutionInfoDialog>
  </el-container>
</template>

<script>
import * as hypertension from "@/api/index";
import constitutionInfoDialog from "./dialog/constitutionInfoDialog";
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
    constitutionInfoDialog
  },

  computed: {},
  created() {
    this.constitutionInfo();
  },
  methods: {
    handleClick(row) {
      this.editModalVisible = true;
      console.log(row);
      row.screen_time = moment(row.screen_time).format("YYYY-MM-DD HH:mm:ss");
      let params = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params);
      });
    },

    constitutionInfo() {
      this.loading = true;
      this.disabled = true;
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        patientName: this.patientName
      };
      hypertension
        .constitutionInfo(params)
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
      this.constitutionInfo();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      window.scrollTo(0, 0);
      this.constitutionInfo();
    },
    onSubmit() {
      this.patientName = this.formInline.patientName || "";
      this.constitutionInfo();
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
