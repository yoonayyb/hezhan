<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="医院名称：">
        <el-input clearable placeholder="请输入" size="small" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" size="small" type="info" v-permission="['list']">查询</el-button>
      </el-form-item>
      <el-row v-permission="['add','del']">
        <el-form-item>
          <el-button @click="addOrUpdateHandle()" icon="el-icon-plus" size="small" type="primary" v-permission="['add']">新增</el-button>
          <el-button
            :disabled="dataListSelections.length <= 0"
            size="small"
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
      <el-table-column align="left" header-align="left" label="医院名称" prop="ORG_NAME"></el-table-column>
      <el-table-column align="center" header-align="center" label="医院编号" prop="ORG_CODE"></el-table-column>
      <el-table-column align="center" header-align="center" label="缩写编号" prop="INSTITUTION_CODE"></el-table-column>
      <el-table-column align="center" header-align="center" label="医院类别" prop="INSTITUTION_TYPE"></el-table-column>
      <el-table-column align="center" header-align="center" label="医院等级" prop="ORG_TYPE"></el-table-column>
      <el-table-column align="left" header-align="left" label="地址" prop="ADDR_DETAILS"></el-table-column>

      <el-table-column align="center" header-align="center" label="操作" v-permission="['del','edit']" width="150">
        <template slot-scope="scope">
          <el-button @click="addOrUpdateHandle(scope.row.ID)" size="small" type="text" v-permission="['edit']">修改</el-button>
          <el-button @click="deleteHandle(scope.row.ID,scope.row.ORG_NAME)" size="small" type="text" v-permission="['del']">删除</el-button>
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
      keyword: '',
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/baseorg/getlist'),
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
        console.log(this.$route)
      })
    },
       // 搜索
    onSearch () {
      this.pageIndex = 1
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle (val) {
      window.scrollTo(0, 0)
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      window.scrollTo(0, 0)
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
    deleteHandle (id, name) {
      console.log(name)
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.ID
        })

      let text = ''
      if (name) {
        text = `确定删除【${name}】吗？`
      } else {
        let num = parseInt(this.dataListSelections.length)
        text = '确定删除这' + num + '条数据吗？'
      }
      //          `确定对[医院=${orgs.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              '/api/baseOrg/delete?ids=' + ids.join(',')
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
