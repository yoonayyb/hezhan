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
      <el-table
        @select="chooseRow"
        @select-all="chooseRow"
        :data="tableDate"
        border=""
        ref="multipleTable"
        v-loading="isLoading"
        style="width: 100%;margin-bottom: 10px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column header-align="center" align="center" label="头像">
          <template slot-scope="scope">
            <img v-if="scope.row.ImgPath" style="width: 30px; height: 30px" :src="$url+scope.row.ImgPath">
            <img v-else style="width: 30px; height: 30px" src="~@/assets/img/avatar (2).png">
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="姓名">
          <template slot-scope="scope">
            <div v-if="scope.row.Name">{{scope.row.Name}}</div>
            <div v-else>{{scope.row.UserNick}}</div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="UserName" label="账号"></el-table-column>
        <el-table-column header-align="center" align="center" prop="Mobile" label="电话"></el-table-column>
        <!-- <el-table-column v-if="!type" header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="select(scope.row)">选择</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="addAll()">添加所选</el-button>
      </div>
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
      pageIndex: 0,
      type: "", //是否支持多选
      selectAll: []
    };
  },
  computed: {
    Reserve() {
      return this.reserve;
    }
  },
  methods: {
    //打开
    init(userList, type = "", tags = []) {
      this.type = type == "multiple" ? "multiple" : "";
      if (userList) {
        this.visible = true;
        this.tableDate = userList;
      }
    },
    //勾选
    chooseRow(selection, row) {
      console.log(selection);
      console.log(row);
      // let selected = [];
      // this.selectAll = Array.from(new Set(selected.push(row)));
      this.selectAll = selection;
    },
    // 选中
    select(row) {
      this.$emit("select", row);
      this.visible = false;
    },
    //全部添加
    addAll() {
      this.$emit("addAll", this.selectAll);
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
    // dataList: {
    //   type: Array,
    //   default: () => []
    // },
    value: {
      type: Boolean,
      default: false
    },
    totalPage: {
      type: Number,
      default: 0
    },
    reserve: {
      type: Boolean,
      default: true
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
