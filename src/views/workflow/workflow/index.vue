<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <el-row>
        <el-form-item>
          <el-button @click="addOrUpdateHandle()" type="primary" v-permission="['add']">新增</el-button>
          <el-button
            :disabled="dataListSelections.length <= 0"
            @click="deleteHandle()"
            icon="el-icon-delete"
            type="danger"
            v-permission="['del']"
          >批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-select @change="getDataList" clearable placeholder="请选择医院" style="margin-right:5px;width:230px" v-model="orgId">
            <el-option :key="item.ID" :label="item.ORG_NAME" :value="item.ID" v-for="item in orgList"></el-option>
          </el-select>
          <el-select @change="getDataList" clearable placeholder="请选择审批流类型" style="margin-right:5px" v-model="flowTypeId">
            <el-option :key="item.ID" :label="item.NAME" :value="item.ID" v-for="item in flowTypeList"></el-option>
          </el-select>
          <el-button @click="onSearch()" type="primary">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table :data="dataList" @selection-change="selectionChangeHandle" border style="width: 100%;" v-loading="dataListLoading">
      <el-table-column align="center" type="selection" width="48"></el-table-column>
      <el-table-column align="center" header-align="center" label="所属医院名称" prop="ORG_NAME"></el-table-column>
      <el-table-column align="center" header-align="center" label="审批流类型" prop="FLOW_TYPE"></el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            @click="$router.push({name:'workflowDetail',query:{id:scope.row.ID,orgName:scope.row.ORG_NAME,flowType:scope.row.FLOW_TYPE}})"
            size="small"
            type="text"
          >环节配置</el-button>
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
    <add-or-update @close="addOrUpdateVisible=false" @refreshDataList="getDataList" ref="addOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
import { getWorkflowList, getOrgList, getBaseDict } from '@/api/index.js'
import AddOrUpdate from './edit'
export default {
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
      orgId: '',
      flowTypeId: '',
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      flowTypeList: [],
      orgList: []
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    getOrgList().then(({ data }) => {
      if (data.status === 0) {
        this.orgList = data.pageList
      }
    })
    getBaseDict('7d6a9d05-0f14-40fb-b66c-74026fd72dd7').then(({ data }) => {
      this.flowTypeList = data.pageList
    })
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        Org_id: this.orgId,
        flow_type_id: this.flowTypeId
      }
      this.dataListLoading = true
      getWorkflowList(params).then(({ data }) => {
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
        ? [row.FLOW_TYPE]
        : this.dataListSelections.map(item => {
          return item.FLOW_TYPE
        })
      this.$confirm(`将删除审批流类型[${names.join(',')}]的工作流程`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: '/api/Workflow/Delete?ids=' + ids.join(','),
            method: 'post'
          }).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: data.msg,
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
  }
}
</script>
