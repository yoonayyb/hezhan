<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="所属医院:">
        <el-select style="width: 230px" @change="getDataList" clearable placeholder="所属医院" v-model="orgId">
          <el-option :key="item.value" :label="item.label" :value="item.ID" v-for="item in orgs"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称:">
        <el-input clearable placeholder="请输入" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="onSearch()" icon="el-icon-search" type="info" v-permission="['list']">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            size="small"
            @click="addOrUpdateHandle()"
            icon="el-icon-plus"
            type="primary"
            v-permission="['add']"
          >添加设备</el-button>
          <el-button
            size="small"
            :disabled="dataListSelections.length <= 0"
            @click="deleteHandle()"
            icon="el-icon-delete"
            type="danger"
            v-permission="['del']"
          >批量删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      :data="dataList"
      @selection-change="selectionChangeHandle"
      border=""
      style="width: 100%;"
      v-loading="dataListLoading"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" header-align="center" label="科室" prop="DeptName"></el-table-column>
      <el-table-column align="center" header-align="center" label="设备名称" prop="DeviceName"></el-table-column>
      <el-table-column align="center" header-align="center" label="是否闲置" prop="IsFree"></el-table-column>
      <el-table-column align="center" header-align="center" label="设备厂商" prop="SupplierName"></el-table-column>
      <el-table-column align="center" header-align="center" label="设备类型" prop="DeviceTypeName"></el-table-column>
      <el-table-column align="center" header-align="center" label="设备IP" prop="DeviceIp"></el-table-column>
      <el-table-column align="center" header-align="center" label="拨号账号" prop="UserName"></el-table-column>
      <el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="addOrUpdateHandle(scope.row.Id)" size="small" type="text" v-permission="['edit']">修改</el-button>
          <el-button @click="deleteHandle(scope.row)" size="small" type="text" v-permission="['del']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="totalPage"
      @current-change="currentChangeHandle"
      @size-change="sizeChangeHandle"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <add-or-update @refreshDataList="getDataList" ref="addOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
import { getOrgDevicelist, deleteOrgDevice } from "@/utils/api.js";
import { getUserInfo } from "@/api/index";
import AddOrUpdate from "./edit";

function isEmptyObj(v) {
  const arr = Object.keys(v);
  if (arr.length > 0) {
    return false;
  }
  return true;
}

export default {
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  data() {
    return {
      dataForm: {
        ID: "",
        ORG_NAME: "",
        ORG_CODE: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: "",
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      orgId: "",
      orgs: []
    };
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 获取数据列表
    getDataList() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword,
        orgid: this.orgId
      };
      this.dataListLoading = true;
      getOrgDevicelist(params)
        .then(({ data }) => {
          if (data && data.status === 0) {
            this.dataList = data.pageList;
            for (let i = 0; i < data.pageList.length; i++) {
              data.pageList[i].ButTime = data.pageList[i].ButTime.split("T")[0];
              data.pageList[i].IsFree =
                data.pageList[i].IsFree === 0 ? "闲置中" : "使用中";
            }
            this.totalPage = data.totalCount;
          } else {
            this.dataList = [];
            this.totalPage = 0;
          }
          this.dataListLoading = false;
        })
        .catch(() => {
          this.dataListLoading = false;
        });
    },
    getOrgList() {
      this.$http({
        url: this.$http.adornUrl("/api/baseorg/getlist"),
        method: "GET",
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999
        })
      }).then(({ data }) => {
        if (data) {
          this.orgs = data.pageList;
          for (var i = 0; i < data.pageList.length; i++) {
            this.orgs[i].value = data.pageList[i].ID;
            this.orgs[i].label = data.pageList[i].ORG_NAME;
          }
        } else {
          this.orgs = [];
        }
      });
    },
    // 搜索
    onSearch() {
      this.pageIndex = 1;
      this.getDataList();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      window.scrollTo(0, 0);
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      console.log(val);
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      // console.log(id)
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(row) {
      var ids = row
        ? [row.Id]
        : this.dataListSelections.map(item => {
            return item.Id;
          });
      let names = row
        ? [row.DeviceName]
        : this.dataListSelections.map(item => {
            return item.DeviceName;
          });
      this.$confirm(`将删除设备[${names.join(",")}]`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOrgDevice(ids.join(",")).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    }
  },
  created() {
    this.getOrgList();
    if (!isEmptyObj(this.userInfo)) {
      this.orgId = this.userInfo.OrgID;
      this.getDataList();
    } else {
      // getUserInfo().then(({ data }) => {
      //   const userInfo = data.data
      //   this.orgId = userInfo.OrgID
      //   this.getDataList()
      // })
    }
  }
};
</script>
