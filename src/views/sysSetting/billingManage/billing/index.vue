<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <el-form-item label="所属医院：">
        <el-select
          style="width: 230px"
          @change="onSearch"
          placeholder="所属医院"
          clearable
          v-model="dataForm.business_orgid"
        >
          <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in orgs"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型：">
        <!-- <el-input clearable placeholder="请输入" v-model="dataForm.name"></el-input> -->
        <el-select
          @change="onSearch()"
          style="width:100%"
          v-model="dataForm.business_id"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in businessList"
            :key="item.ID"
            :label="item.NAME"
            :value="item.ID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" type="info">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            @click="toEdit()"
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
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="isLoading"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="Business_orgname" label="所属医院名称" width="200"></el-table-column>
      <el-table-column prop="Template_name" label="档次类型" width="200"></el-table-column>
      <el-table-column prop="Price" label="定价（元）" width="200"></el-table-column>
      <el-table-column prop="Business_name" label="业务类型名" width="200"></el-table-column>
      <el-table-column prop="Business_code" label="业务类型编号" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            v-permission="['edit']"
            @click="toEdit(scope.row.Id)"
          >修改</el-button>
          <el-button
            size="small"
            type="text"
            v-permission="['del']"
            @click="deleteHandle(scope.row)"
          >删除</el-button>
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
    <edit ref="edit" @refrashList="getDataList"></edit>
  </div>
</template>

<script>
// import { getSysRolelist } from '@/utils/api.js'
import minx from '../mix'
import edit from './edit'

export default {
  mixins: [minx],
  components: {
    edit
  },
  methods: {
    getOrgList () {
      this.isLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/baseorg/getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999
        })
      })
        .then(({ data }) => {
          this.isLoading = false
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
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    getDataList (params) {
      let par = {}
      if (params) {
        par = params
      } else {
        par = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }
      this.isLoading = true
      this.$http({
        url: '/api/SysPricingTemplate/GetBaseList',
        method: 'GET',
        params: par
      })
        .then(({ data }) => {
          this.isLoading = false
          if (data) {
            this.tableList = data.pageList
            this.totalPage = data.totalCount
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    // 删除
    // 批量删除
    deleteHandle (row) {
      var ids = row
        ? [row.Id]
        : this.dataListSelections.map(item => {
          return item.Id
        })
      let names = row
        ? [row.Business_name + '-' + row.Template_name]
        : this.dataListSelections.map(item => {
          return item.Business_name + '-' + item.Template_name
        })
      this.$confirm(
        `将删除价格模板 [ ${names.join(
          ','
        )} ] 该价格模板对应的分成比例也会同时删除，是否确定删除吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: '/api/SysPricingTemplate/Delete?ids=' + ids.join(','),
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
