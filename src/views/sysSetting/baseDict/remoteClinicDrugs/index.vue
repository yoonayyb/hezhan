<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="onSearch()">
      <el-form-item label="药品名称：">
        <el-input clearable placeholder="请输入" v-model="keyword"></el-input>
      </el-form-item>
      <!-- <el-form-item label="ID：">
        <el-input clearable placeholder="请输入" v-model="code"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="onSearch()" icon="el-icon-search" type="info" v-permission="['list']">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            @click="addOrUpdateHandle()"
            icon="el-icon-plus"
            type="primary"
            v-permission="['add']"
          >新增</el-button>
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
      border
      style="width: 100%;"
      v-loading="dataListLoading"
    >
      <el-table-column type="selection" width="54" align="center"></el-table-column>

      <!-- <el-table-column align="center" header-align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.e_create_start|formatTime}}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" header-align="center" label="药品编号" prop="Drugs_code"></el-table-column>
      <el-table-column align="center" header-align="center" label="药品名称" prop="Drugs_name"></el-table-column>
      <el-table-column align="center" header-align="center" label="药品规格" prop="Spec"></el-table-column>
      <el-table-column align="center" header-align="center" label="药品属性" prop="Property"></el-table-column>
      <el-table-column align="center" header-align="center" label="药品单位" prop="Unit"></el-table-column>
      <el-table-column align="center" header-align="center" label="单价" prop="Price"></el-table-column>
      <el-table-column align="center" header-align="center" label="药品剂量" prop="Dose"></el-table-column>
      <el-table-column align="center" header-align="center" label="剂量单位" prop="Dose_unit"></el-table-column>
      <el-table-column align="center" header-align="center" label="拼音码" prop="Py_code"></el-table-column>
      <el-table-column align="center" header-align="center" label="五笔码" prop="Wb_code"></el-table-column>
      <el-table-column align="center" header-align="center" label="药品说明" prop="Explain"></el-table-column>
      <el-table-column align="center" header-align="center" label="给药方式" prop="Route_name"></el-table-column>
      <el-table-column align="center" header-align="center" label="药品类别" prop="Category"></el-table-column>
      <el-table-column align="center" header-align="center" label="取整策略" prop="Strategy"></el-table-column>
      <el-table-column align="center" header-align="center" label="TPN" prop="Tpn"></el-table-column>
      <el-table-column align="center" header-align="center" label="抗生素标志" prop="Is_antibiptic">
        <template slot-scope="scope">
          <span>
            <div v-if="scope.row.Is_antibiptic == 0">是</div>
            <div v-if="scope.row.Is_antibiptic == 1">否</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="基本药物标志" prop="Is_essential">
        <template slot-scope="scope">
          <span>
            <div v-if="scope.row.Is_essential == 0">是</div>
            <div v-if="scope.row.Is_essential == 1">否</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="皮试判别" prop="Is_shin">
        <template slot-scope="scope">
          <span>
            <div v-if="scope.row.Is_shin == 0">是</div>
            <div v-if="scope.row.Is_shin == 1">否</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="作废判别" prop="Is_delete">
        <template slot-scope="scope">
          <span>
            <div v-if="scope.row.Is_delete == 1">是</div>
            <div v-if="scope.row.Is_delete == 0">否</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="处方用药备注" prop="Remarks"></el-table-column>

      <!-- <el-table-column align="center" header-align="center" label="父级类型" prop="TYPE_NAME"></el-table-column> -->
      <el-table-column align="center" fixed="right" header-align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="addOrUpdateHandle(scope.row.Id)"
            size="small"
            type="text"
            v-permission="['edit']"
          >修改</el-button>
          <!-- <el-button
            @click="deleteHandle(scope.row)"
            size="small"
            type="text"
            v-permission="['del']"
          >删除</el-button>-->
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
    this.getBaseDictType()
  },
  methods: {
    // 获取数据列表
    getDataList (params) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/RemoteClinicDrugsBase/GetManageList'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          drugs_name: this.keyword
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
    // 获取全部类型
    getBaseDictType () {
      this.$http({
        url: this.$http.adornUrl('/api/baseDictType/GetlistAll'),
        method: 'GET'
      }).then(({ data }) => {
        console.log(data)
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
