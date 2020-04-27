<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <!-- <el-form-item label="类型：">
        <el-select default-first-option placeholder="字典类型" v-model="dictType" @change="getDataList">
          <el-option label="全部" value></el-option>
          <el-option :key="item.ID" :label="item.NAME" :value="item.ID" v-for="item in dictTypeList"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="关键字：">
        <el-input clearable placeholder="请输入" v-model="keyword"></el-input>
      </el-form-item>
      <!-- <el-form-item label="ID：">
        <el-input clearable placeholder="请输入" v-model="code"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" type="info" v-permission="['list']">查询</el-button>
        <el-button @click="onSearchLastRecord()" icon="el-icon-search" type="text" v-permission="['list']">查找全部有效记录最后一条</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            @click="addOrUpdateHandle()"
            icon="el-icon-plus"
            type="primary"
            v-permission="['add']"
          >新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table
      :data="dataList"
      border
      style="width: 100%;"
      v-loading="dataListLoading"
    >
      <el-table-column align="center" header-align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.create_date|formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="版本号" prop="version_no"></el-table-column>
      <el-table-column align="center" header-align="center" label="版本名称" prop="version_name"></el-table-column>
      <el-table-column align="center" header-align="center" label="排序" prop="sort_id" width="120"></el-table-column>
      <el-table-column align="center" header-align="center" label="备注" prop="explain" width="150"></el-table-column>

      <el-table-column align="center" header-align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="addOrUpdateHandle(scope.row.id)"
            size="small"
            type="text"
            v-permission="['edit']"
          >修改</el-button>
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
      keyword: '',
      dictType: '',
      code: '',
      totalPage: 0,
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
    // this.getBaseDictType()
  },
  methods: {
    // 获取数据列表
    getDataList (params) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/MobileClientVersion/Getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyWord: this.keyword
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
      // console.log(this.addOrUpdateVisible)
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 启用 || 禁用
    changeStatus (row, statusCode) {
      row.status = statusCode
      this.$http({
        url: this.$http.adornUrl('/api/Progress/Save'),
        method: 'POST',
        data: this.$http.adornData(row)
      }).then(({ data }) => {
        this.$message(data.msg)
        this.getDataList()
      })
    },
    onSearchLastRecord () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/MobileClientVersion/GetViewModelLast'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyWord: this.keyword
        })
      }).then(({ data }) => {
        if (data) {
          this.dataList = []
          this.dataList.push(data)
          this.totalPage = 1
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    }
    // 获取全部类型
    // getBaseDictType () {
    //   this.$http({
    //     url: this.$http.adornUrl('/api/baseDictType/GetlistAll'),
    //     method: 'GET'
    //   }).then(({ data }) => {
    //     console.log(data)
    //     if (data) {
    //       this.dictTypeList = data.pageList
    //     } else {
    //       this.dictTypeList = []
    //     }
    //   })
    // }
  }
}
</script>
