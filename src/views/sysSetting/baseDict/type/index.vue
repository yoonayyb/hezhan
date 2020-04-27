<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <el-form-item label="名称：">
        <el-input clearable placeholder="请输入" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" type="info" v-permission="['list']">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button @click="addOrUpdateHandle()" icon="el-icon-plus" type="primary" v-permission="['add']">新增</el-button>
          <el-button
            :disabled="dataListSelections.length <= 0"
            @click="deleteHandle()"
            icon="el-icon-delete"
            type="danger"
            v-permission="['del']"
          >批量删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table :data="dataList" @selection-change="selectionChangeHandle" border style="width: 100%;" v-loading="dataListLoading">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column align="center" header-align="center" label="编号" prop="CODE"></el-table-column>

      <el-table-column align="center" header-align="center" label="名称" prop="NAME"></el-table-column>

      <el-table-column align="center" header-align="center" label="父级" prop="PARENT_ID">
        <template slot-scope="scope">{{scope.row.PARENT_NAME}}</template>
      </el-table-column>

      <el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="addOrUpdateHandle(scope.row.ID)" size="small" type="text" v-permission="['edit']">修改</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update @refreshDataList="getDataList" ref="addOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './edit'
export default {
  data () {
    return {
      dataForm: {
        ORG_NAME: '',
        ORG_CODE: ''
      },
      dataList: [],
      dictTypeList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: '',
      dictType: null,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
    this.getBaseDictType()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/baseDictType/getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword
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
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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
      this.$confirm(`将删除字典类型[${names.join(',')}]`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              '/api/baseDictType/delete?ids=' + ids.join(',')
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
    },
    // 获取全部类型  /api/baseDictType/GetlistAll
    getBaseDictType () {
      this.$http({
        url: this.$http.adornUrl('/api/baseDictType/GetlistAll'),
        method: 'GET'
      }).then(({ data }) => {
        if (data) {
          this.dictTypeList = data.pageList
        } else {
          this.dictTypeList = []
        }
      })
    }
  }
}
</script>
