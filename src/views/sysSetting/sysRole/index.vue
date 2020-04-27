<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <el-form-item label="所属医院：">
        <el-select @change="getDataList" placeholder="所属医院" clearable v-model="orgid">
          <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in orgs"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称:">
        <el-input clearable placeholder="请输入" v-model="roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" type="info">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            @click="$router.push({name:'sysRoleEdit',query:{org,orgid}})"
            icon="el-icon-plus"
            type="primary"
            v-permission="['add']"
            size="small"
          >新增</el-button>
          <el-button
            :disabled="dataListSelections.length <= 0"
            @click="deleteHandle()"
            icon="el-icon-delete"
            type="danger"
            v-permission="['del']"
            size="small"
          >批量删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      :data="tableList"
      @selection-change="handleSelectionChange"
      border=""
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark"
      v-loading="isLoading"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="角色名称" prop="NAME"></el-table-column>
      <!-- <el-table-column
        prop="orgName"
        align="center"
        width="240"
        label="医院">
      </el-table-column>-->
      <el-table-column align="center" label="医院" prop="ORG_NAME"></el-table-column>
      <el-table-column align="center" label="操作" prop="address" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            @click="$router.push({name:'sysRoleEdit',query:{id:scope.row.ID}})"
            size="small"
            type="text"
            v-permission="['edit']"
          >修改</el-button>
          <!--v-if="userInfo.Is_admin" -->

          <!--角色权限暂时不需要-->
          <el-button
            @click="$router.push({name:'sysRolePermission',query:{id:scope.row.ID,roleName:scope.row.NAME}})"
            size="small"
            type="text"
            v-permission="['edit']"
          >菜单权限</el-button>
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
  </div>
</template>

<script>
import { getSysRolelist } from "@/utils/api.js";
import defultOrgId from "@/mixin/defultOrgId";

export default {
  mixins: [defultOrgId],
  created() {
    this.getOrgId().then(id => {
      this.orgid = id;
    });
    this.getOrgList();
    this.getDataList();
  },
  data() {
    return {
      dataForm: {},
      tableList: [],
      dataListSelections: [],
      isLoading: false,
      roleName: "",
      deptName: "",
      //  分页
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: "",
      orgid: "",
      orgs: [],
      org: ""
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  activated() {
    this.getOrgList();
  },

  methods: {
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
          //默认首次选中的医院和医院ID
          this.org = this.orgs[0].label;
          this.orgid = this.orgs[0].value;
        } else {
          this.orgs = [];
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 分页
    handleSelectionChange(val) {
      this.dataListSelections = val;
    },
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    getDataList(res) {
      this.orgid = res;
      this.orgs.forEach(element => {
        if (element.value == res) {
          this.org = element.label;
        }
      });
      console.log(this.org);

      this.isLoading = true;
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword,
        orgid: this.orgid,
        roleName: this.roleName
      };
      getSysRolelist(params)
        .then(res => {
          if (res.data) {
            this.tableList = res.data.pageList;
            this.totalPage = res.data.totalCount;
          } else {
            this.tableList = [];
            this.totalPage = 0;
          }
          this.isLoading = false;
        })
        .catch(_ => {
          this.isLoading = false;
        });
    },
    // 搜索
    onSearch() {
      this.pageIndex = 1;
      this.getDataList();
    },
    // 删除
    deleteHandle(row) {
      var ids = row
        ? [row.ID]
        : this.dataListSelections.map(item => {
            return item.ID;
          });
      let names = row
        ? [row.NAME]
        : this.dataListSelections.map(item => {
            return item.NAME;
          });
      this.$confirm(`将删除角色[${names.join(",")}]?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              "/api/SysRole/Delete?ids=" + ids.join(",")
            ),
            method: "post"
          }).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1000,
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
  mounted() {
    this.getDataList();
  }
};
</script>
