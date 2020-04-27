<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <!--<el-form-item label="所属医院：">-->
      <!--<el-select v-model="orgid" placeholder="所属医院">-->
      <!--<el-option label="全部" value=""></el-option>-->
      <!--<el-option-->
      <!--v-for="item in orgs"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-input clearable placeholder="请输入关键词查询" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" type="info" v-permission="['list']">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableList"
      @selection-change="handleSelectionChange"
      border
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark"
    >
      <!--<el-table-column-->
      <!--type="selection"-->
      <!--align="center"-->
      <!--width="55">-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="科室" prop="deptName" width="240"></el-table-column>

      <el-table-column align="center" label="医生姓名" prop="userName"></el-table-column>

      <el-table-column align="center" label="账户名称" prop="accountName"></el-table-column>

      <el-table-column align="center" label="角色名称" prop="roleName"></el-table-column>

      <el-table-column align="center" label="操作" prop="address" show-overflow-tooltip width="200">
        <template slot-scope="scope">
          <el-button @click="addOrUpdateHandle(scope.row)" size="small" type="text">账号分配</el-button>
          <el-button @click="roleAddOrUpdateHandle(scope.row)" size="small" type="text">角色分配</el-button>
          <!--<el-button type="text" size="small"  @click="deleteRole(scope)">删除</el-button>-->
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
    <RoleAddOrUpdate @refreshDataList="getDataList" ref="roleAddOrUpdate" v-if="roleAddOrUpdateVisible"></RoleAddOrUpdate>
  </div>
</template>

<script>
import { get_sysUersRolelist } from '@/utils/api.js'
import AddOrUpdate from './edit'
import RoleAddOrUpdate from './roleEdit'

export default {
  data () {
    return {
      dataForm: {},
      tableList: [],
      multipleSelection: [],

      //  分页
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: '',

      addOrUpdateVisible: false,
      roleAddOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    RoleAddOrUpdate
  },
  methods: {
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 分页
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    getDataList () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword
      }
      get_sysUersRolelist(params)
        .then(res => {
          if (res.data) {
            this.tableList = res.data.pageList
            this.totalPage = res.data.totalCount
          } else {
            this.tableList = []
            this.totalPage = 0
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    deleteRole (scope) {
      console.log(scope)
    },
    addOrUpdateHandle (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    },
    roleAddOrUpdateHandle (row) {
      this.roleAddOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.roleAddOrUpdate.init(row)
      })
    },
    onSearch () {
      this.pageIndex = 1
      this.getDataList()
    }
  },
  created () {
    this.getDataList()
  }
}
</script>
