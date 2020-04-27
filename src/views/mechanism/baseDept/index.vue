<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="所属医院：">
        <el-select
          style="width: 225px"
          v-model="orgid"
          placeholder="归属医院"
          @change="getDataList"
          clearable
        >
          <el-option v-for="item in orgs" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室：">
        <el-input v-model="keyword" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" type="info" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="addOrUpdateHandle()"
            v-permission="['add']"
          >新增</el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            :disabled="dataListSelections.length <= 0"
            @click="deleteHandle()"
            v-permission="['del']"
          >批量删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>

      <el-table-column prop="ORG_NAME" header-align="center" align="center" label="归属医院"></el-table-column>

      <el-table-column prop="NAME" header-align="center" align="center" label="科室名称"></el-table-column>

      <el-table-column prop="CODE" header-align="center" align="center" label="科室编号"></el-table-column>

      <el-table-column prop="PARENT_NAME" header-align="center" align="center" label="上级科室"></el-table-column>

      <el-table-column prop="DEPT_TYPE_NAME" header-align="center" align="center" label="科室类型"></el-table-column>

      <el-table-column prop="WORK_PHONE" header-align="center" align="center" label="电话"></el-table-column>

      <el-table-column prop="MANAGER_NAME" header-align="center" align="center" label="科室主任"></el-table-column>

      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.ID)"
            v-permission="['edit']"
          >修改</el-button>

          <el-button @click="jumpToPermission(scope)" size="small" type="text">权限设置</el-button>

          <el-button
            type="text"
            size="small"
            @click="deleteHandle(scope.row)"
            v-permission="['del']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './edit';
import defultOrgId from '@/mixin/defultOrgId';
export default {
  mixins: [defultOrgId],
  created () {
    this.getOrgId().then(id => {
      this.orgid = id
    })
    this.getOrgList()
    this.getDataList()
  },
  data () {
    return {
      dataForm: {
        ORG_NAME: '',
        ORG_CODE: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      keyword: '',
      orgid: '',
      orgs: []
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    getOrgList () {
      this.$http({
        url: this.$http.adornUrl('/api/baseorg/getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999
        })
      }).then(({ data }) => {
        if (data) {
          this.orgs = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            this.orgs[i].value = data.pageList[i].ID
            this.orgs[i].label = data.pageList[i].ORG_NAME
          }
        } else {
          this.orgs = []
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/baseDept/getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword,
          orgid: this.orgid
        })
      }).then(({ data }) => {
        if (data) {
          this.dataList = data.pageList
          this.totalPage = data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    onSearch () {
      this.pageIndex = 1
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      window.scrollTo(0, 0)
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      window.scrollTo(0, 0)
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      document.body.style['overflow-y'] = 'hidden';
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 跳转到权限页面
    jumpToPermission (scope) {
      this.$router.push({
        name: 'deptAuthPermission',
        query: {
          deptID: scope.row.ID,
          deptName: scope.row.NAME
        }
      })
    },
    // 删除
    deleteHandle (row) {
      var ids = row
        ? [row.ID]
        : this.dataListSelections.map(item => {
          return item.ID
          })
      let names = row
        ? [row.NAME]
        : this.dataListSelections.map(item => {
          return item.NAME
          })
      this.$confirm(`将删除科室[${names.join(',')}]`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              '/api/baseDept/delete?ids=' + ids.join(',')
            ),
            method: 'post'
          }).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
