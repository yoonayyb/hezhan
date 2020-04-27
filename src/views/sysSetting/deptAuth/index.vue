<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <el-form-item label="所属医院：">
        <el-select @change="getDataList" placeholder="所属医院" v-model="orgid">
          <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in orgs"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室：">
        <el-input clearable placeholder="请输入" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" type="info" v-permission="['list']">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" @selection-change="selectionChangeHandle" border style="width: 100%;" v-loading="dataListLoading">
      <el-table-column align="center" header-align="center" label="归属医院" prop="ORG_NAME"></el-table-column>

      <el-table-column align="center" header-align="center" label="科室名称" prop="NAME"></el-table-column>

      <el-table-column align="center" header-align="center" label="科室编号" prop="CODE"></el-table-column>

      <el-table-column align="center" header-align="center" label="上级科室" prop="PARENT_NAME"></el-table-column>

      <el-table-column align="center" header-align="center" label="科室类型" prop="DEPT_TYPE_NAME"></el-table-column>

      <el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="addOrUpdateHandle(scope)" size="small" type="text" v-permission="['edit']">权限设置</el-button>
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
    <add-or-update @refreshDataList="getDataList" ref="addOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './edit'
import defultOrgId from '@/mixin/defultOrgId'

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
          // 搜索
    onSearch () {
      this.pageIndex = 1
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (scope) {
      this.$router.push({
        name: 'deptAuthPermission',
        query: {
          deptID: scope.row.ID,
          deptName: scope.row.NAME
        }
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.ID
        })
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
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
                duration: 1200,
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
