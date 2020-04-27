<template>
  <div>
    <el-dialog
      width="60%"
      :title="title"
      :visible.sync="visible"
      :close-on-click-modal="false"
      append-to-body
      @close="onClose"
      @open="onOpen"
    >
      <el-form style="width:100%" @submit.native.prevent>
        <el-form-item style="width:100%;display:inline-block">
          <el-input v-model="keyword" :placeholder="placeholder">
            <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table :data="tableDate" border="" v-loading="isLoading" style="width: 100%;margin-bottom: 10px">
        <el-table-column header-align="center" align="center" prop="Name" label="名称"></el-table-column>
        <el-table-column header-align="center" align="center" prop="ExecutorName" label="执行人"></el-table-column>
        <el-table-column header-align="center" align="center" prop="PriorityName" label="优先级"></el-table-column>
        <el-table-column header-align="center" align="center" prop="StatusName" label="状态"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="select(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="totalPage>1"
        small
        layout="prev, pager, next"
        :page-size="15"
        @current-change="pageChange"
        :current-page="pageIndex"
        :total="totalPage"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      isLoading: false,
      tableDate: [],
      // 分页
      keyword: "",
      pageIndex: 0
    };
  },
  methods: {
    //打开
    init(projectList) {
      if (projectList) {
        this.visible = true;
        this.tableDate = projectList;
      }
    },
    // 选中
    select(row) {
      this.$emit("select", row);
      this.visible = false;
    },
    //  搜索
    onSearch() {
      this.isLoading = true;
      console.log(this.keyword);
      this.$emit("search", this.keyword);
      this.isLoading = false;
    },
    //  分页
    pageChange(page) {
      this.$emit("page-change", page);
    },
    //  关闭弹框时
    onClose() {
      this.$emit("close");
    },
    stopLoading() {
      this.isLoading = false;
    },
    onOpen() {}
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    column: {
      type: Array,
      default: () => []
    },
    dataList: {
      type: Array,
      default: () => []
    },
    value: {
      type: Boolean,
      default: false
    },
    totalPage: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
    tableDate() {
      // if(this.dataList.length>1){
      this.isLoading = false;
      // }
    }
  },
  mounted() {
    console.log(this.totalPage);
    this.isLoading = true;
    if (this.visible) {
      this.visible = true;
    }
  }
};
</script>
