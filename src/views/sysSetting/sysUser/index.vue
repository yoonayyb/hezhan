<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <!-- <el-form-item label="所属医院:">
        <el-select @change="getDataList" clearable placeholder="请选择医院" style="margin-right:5px" v-model="orgId">
          <el-option :key="item.ID" :label="item.ORG_NAME" :value="item.ID" v-for="item in orgList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字:">
        <el-input clearable placeholder="请输入关键词" v-model="keyword"></el-input>
      </el-form-item>-->
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="所属医院">
            <el-select
              style="width:230px"
              @change="orgSelectChange"
              filterable
              placeholder="请选择医院"
              size="small"
              v-model="searchCriteria.orgid"
            >
              <el-option :key="item.ID" :label="item.ORG_NAME" :value="item.ID" v-for="item in orgSelectList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="所在科室">
            <el-select
              clearable
              filterable
              placeholder="请选择科室"
              size="small"
              v-model="searchCriteria.deptid"
              @change="deptSelectChange"
            >
              <el-option
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
                v-for="item in deptSelectList"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item label="姓名">
            <el-input clearable placeholder="请输入" size="small" v-model="searchCriteria.keyword"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="onSearch()" icon="el-icon-search" v-permission="['list']">查询</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="addOrUpdateHandle()" icon="el-icon-plus" type="primary" v-permission="['add']">新增</el-button>
          <!-- <el-button
            :disabled="dataListSelections.length <= 0"
            @click="deleteHandle()"
            icon="el-icon-delete"
            type="danger"
            v-permission="['del']"
          >批量删除</el-button>-->
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
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column align="center" header-align="center" label="姓名" prop="NAME"></el-table-column>
      <el-table-column align="center" header-align="center" label="用户角色" prop="ROLE_NAME"></el-table-column>
      <el-table-column align="center" header-align="center" label="登陆帐号" prop="USERNAME"></el-table-column>
      <!--<el-table-column align="center" header-align="center" label="账号状态" prop="LOGINTIMES">
       <template slot-scope="scope">{{ scope.row.LOGINTIMES== '5'?'锁定' : '正常' }}</template>
      </el-table-column>-->
      <el-table-column align="center" header-align="center" label="角色分配状态" prop="ORG_NAME" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.IS_ALLOCATION!=='0'">已分配</el-tag>
          <el-tag type="info" v-else>未分配</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="账号状态" prop="STATUS" width="120">
        <template slot-scope="scope">
          <el-button
            @click="stopUser(scope.row)"
            class="cp"
            plain
            size="mini"
            type="success"
            v-if="scope.row.STATUS==='0'"
          >正常</el-button>
          <el-button @click="startUser(scope.row)" class="cp" plain size="mini" type="danger" v-else>停用</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" header-align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="addOrUpdateHandle(scope.row.ID,scope.row.IS_ALLOCATION)"
            size="small"
            type="text"
            v-permission="['edit']"
          >修改</el-button>
          <el-button
            @click="dataPermissions(scope.row.ID,scope.row.NAME)"
            size="small"
            type="text"
            v-if="(userInfo ? userInfo.Is_admin : '')"
          >数据权限</el-button>
          <!-- userInfo.Is_admin -->
          <el-button
            @click="$router.push({name:'sysUserPermission',query:{userId:scope.row.ID}})"
            size="small"
            type="text"
          >权限</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      @close="addOrUpdateVisible=false"
      @refreshDataList="getDataList"
      ref="addOrUpdate"
      v-if="addOrUpdateVisible"
    ></add-or-update>
    <DataPermissions @close="dataPermissionsVisible=false" ref="dataPermissions" v-if="dataPermissionsVisible"/>
  </div>
</template>

<script>
import AddOrUpdate from "./edit";
import { getDeptList, getOrgList, getUserInfo } from "@/api/index";
import DataPermissions from "./dataPermissions.vue";

function isEmptyObj(v) {
  const arr = Object.keys(v);
  if (arr.length > 0) {
    return false;
  }
  return true;
}

export default {
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
      orgName: "",
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dataPermissionsVisible: false,
      orgList: [],
      searchCriteria: {
        orgid: "",
        deptid: "",
        pageIndex: 1,
        pageSize: 20,
        keyword: ""
      },
      // 选择下拉
      orgSelectList: [],
      deptSelectList: []
    };
  },
  components: {
    AddOrUpdate,
    DataPermissions
  },
  computed: {
    userInfo: {
      get: function() {
        return this.$store.state.user.userInfo;
      },
      set: function() {
        // not do anything
      }
    }
  },
  mounted() {},
  created() {
    this.getOrgSelectList();
    if (isEmptyObj(this.userInfo)) {
      // getUserInfo().then(res => {
      //   const userInfo = res.data;
      //   this.userInfo = userInfo;
      //   this.searchCriteria.orgid = this.userInfo.OrgID;
      //   this.getDataList();
      //   this.getDeptSelectList(this.searchCriteria.orgid);
      // });
    } else {
      this.searchCriteria.orgid = this.userInfo.OrgID;
      this.getDeptSelectList(this.searchCriteria.orgid);
      this.getDataList();
    }
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/api/SysUser/GetUserlist"),
        method: "GET",
        params: this.searchCriteria
      }).then(({ data }) => {
        if (data) {
          this.dataList = data.pageList;
          for (var i = 0; i < data.pageList.length; i++) {
            this.dataList[i].SEX = data.pageList[i].SEX === "1" ? "男" : "女";
          }
          this.totalPage = data.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    dataPermissions(id, name) {
      this.dataPermissionsVisible = true;
      this.$nextTick(_ => this.$refs.dataPermissions.init(id, name));
    },
    getDeptSelectList(id) {
      let params = {
        pageIndex: 1,
        pageSize: 999,
        keyword: "",
        orgid: id
      };
      getDeptList(params).then(({ data }) => {
        this.deptSelectList = data.pageList;
      });
    },
    getOrgSelectList() {
      getOrgList().then(({ data }) => {
        if (data) {
          this.orgSelectList = data.pageList;
        } else {
          this.orgSelectList = [];
        }
      });
    },
    orgSelectChange(id) {
      this.pageIndex = 1;
      this.searchCriteria.pageIndex = 1;
      this.getDataList();
      this.searchCriteria.deptid = "";
      if (id) {
        this.getDeptSelectList(id);
      }
    },
    deptSelectChange() {
      this.pageIndex = 1;
      this.searchCriteria.pageIndex = 1;
      this.getDataList();
    },
    startUser(row) {
      this.$confirm("确定要启用此账号吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: "/api/SysUser/startStopUser",
          method: "GET",
          params: {
            userName: row.USERNAME,
            status: "0"
          }
        }).then(({ data }) => {
          if (data && data.status === 0) {
            this.$message({
              message: data.msg,
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
      });
    },
    stopUser(row) {
      this.$confirm("确定要停用此账号吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: "/api/SysUser/startStopUser",
          method: "GET",
          params: {
            userName: row.USERNAME,
            status: "1"
          }
        }).then(({ data }) => {
          if (data && data.status === 0) {
            this.$message({
              message: data.msg,
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
      });
    },
    onSearch() {
      this.searchCriteria.pageIndex = 1;
      this.getDataList();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.searchCriteria.pageSize = val;
      window.scrollTo(0, 0);
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.searchCriteria.pageIndex = val;
      window.scrollTo(0, 0);
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id, d) {
      this.addOrUpdateVisible = true;
      console.log(this.orgSelectList);
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, d, this.orgSelectList);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.ID;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              "/api/SysAccount/Delete?ids=" + ids.join(",")
            ),
            method: "post"
          }).then(({ data }) => {
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
  }
};
</script>

<style  scoped>
.cp {
  cursor: pointer;
}
</style>
