<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-row>
        <div>
          <el-form-item label="患者姓名：">
            <el-input v-model="searchName" placeholder="请输入患者姓名"></el-input>
          </el-form-item>
          <el-button type="info" @click="onSearch">查询</el-button>
        </div>
      </el-row>
      <el-form-item>
        <el-button
          @click="$router.push({name:'patientEssentialInfo',params:{ID:'0'}})"
          type="primary"
        >新增</el-button>
        <el-button
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle"
          icon="el-icon-delete"
          type="danger"
          v-permission="['del']"
        >批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      @selection-change="selectionChangeHandle"
      border
      style="width: 100%;"
      v-loading="dataListLoading"
    >
      <el-table-column align="center" type="selection" width="50"></el-table-column>

      <el-table-column align="center" header-align="center" label="姓名" prop="PATIENT_NAME"></el-table-column>

      <el-table-column
        align="center"
        header-align="center"
        label="性别"
        width="80"
        prop="GENDER_NAME"
      ></el-table-column>

      <el-table-column align="center" header-align="center" label="身份证" prop="ID_NUMBER"></el-table-column>

      <el-table-column align="center" header-align="center" label="出生日期" prop="BIRTH_DATE"></el-table-column>

      <el-table-column align="center" header-align="center" label="手机" prop="MOBILE"></el-table-column>

      <el-table-column align="center" fixed="right" header-align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="$router.push({name:'patientEssentialInfo',params:{ID:scope.row.ID},query:{name:scope.row.PATIENT_NAME}})"
            size="small"
            type="text"
          >修改</el-button>

          <el-button
            @click="addOrUpdateHandle(scope.row.ID,scope.row.PATIENT_NAME)"
            size="small"
            type="text"
          >病历</el-button>
          <el-button @click="deleteHandle(scope.row)" size="small" type="text">删除</el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchName: '',
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
      addOrUpdateVisible: false
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/Patient/Getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          keyword: this.searchName,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      }).then(({ data }) => {
        if (data) {
          for (var i = 0; i < data.pageList.length; i++) {
            var _date = data.pageList[i].BIRTH_DATE
            if (_date) {
              data.pageList[i].BIRTH_DATE = _date.split('T')[0]
            }
          }
          this.dataList = data.pageList
          this.totalPage = data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
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
    // 跳转到病历
    addOrUpdateHandle (id, name) {
      this.$router.push({
        name: 'medical-record',
        query: { name: name },
        params: { PatiendId: id }
      })
    },
    onSearch () {
      this.pageIndex = 1
      this.getDataList()
    },
    // 删除
    deleteHandle (row) {
      var ids = row.ID
        ? [row.ID]
        : this.dataListSelections.map(item => {
          return item.ID
        })

      let names = row.PATIENT_NAME
        ? [row.PATIENT_NAME]
        : this.dataListSelections.map(item => {
          return item.PATIENT_NAME
        })
      // 批量删除提示信息处理
      let msg =
        names.length > 3
          ? '是否删除' +
            names.slice(0, 3).join(',') +
            '等' +
            names.length +
            '位病人？'
          : '是否删除病人' + names.join(',') + '？'

      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              '/api/Patient/delete?ids=' + ids.join(',')
            ),
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
