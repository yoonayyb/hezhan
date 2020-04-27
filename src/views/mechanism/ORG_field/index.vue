<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="会议室名称:">
        <el-input clearable placeholder="请输入" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" type="info" v-permission="['list']">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button @click="addOrUpdateHandle()" icon="el-icon-plus" type="primary" v-permission="['add']">添加会议室</el-button>
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

      <el-table-column align="center" header-align="center" label="会议室名称" prop="FIELD_NAME"></el-table-column>

      <el-table-column align="center" header-align="center" label="是否闲置" prop="IS_FREE"></el-table-column>

      <el-table-column align="center" header-align="center" label="地址" prop="POSITION"></el-table-column>

      <el-table-column align="center" header-align="center" label="备注" prop="REMARKES"></el-table-column>

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

    <add-or-update @refreshDataList="getDataList" ref="addOrUpdate" @close="addOrUpdateVisible=false" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
import { getOrgFieldlist, deleteOrgField } from '@/utils/api.js'
import AddOrUpdate from './edit'

export default {
  data () {
    return {
      dataForm: {
        ID: '',
        ORG_NAME: '',
        ORG_CODE: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: '',
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 获取数据列表
    getDataList () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword
      }
      this.dataListLoading = true
      getOrgFieldlist(params).then(({ data }) => {
        if (data) {
          this.dataList = data.pageList
          for (let i = 0; i < data.pageList.length; i++) {
            data.pageList[i].IS_FREE =
              data.pageList[i].IS_FREE === 0 ? '闲置中' : '无闲置'
          }
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
    // 新增 ，修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除   ？
    deleteHandle (row) {
      var ids = row
        ? [row.ID]
        : this.dataListSelections.map(item => {
          return item.ID
        })
      let names = row
        ? [row.FIELD_NAME]
        : this.dataListSelections.map(item => {
          return item.FIELD_NAME
        })
      this.$confirm(`将删除设备[${names.join(',')}]`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOrgField(ids.join(',')).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
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
  },
  created () {
    this.getDataList()
  }
}
</script>
