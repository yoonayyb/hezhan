<template>
  <div class="mod-role">
    <el-form :inline="true">
      <el-form-item label="操作人：">
        <el-input v-model="OperatorName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作人账号：">
        <el-input v-model="OperatorUsername" placeholder="请输入" clearable></el-input>
      </el-form-item>
        <el-form-item label="模块名">
        <el-input v-model="MouuleName" placeholder="请输入" clearable></el-input>
      </el-form-item>
        <el-form-item label="操作时间">
            <el-date-picker
      v-model="OperatorTime"
      type="datetimerange"
      range-separator="至"
      value-format="yyyy-MM-dd"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch()" type="info" icon="el-icon-search" v-permission="['list']">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">

      <el-table-column
        prop="ORG_NAME"
        header-align="center"
        align="center"
        label="所属医院">
      </el-table-column>

      <!-- <el-table-column
        prop="DEPT_NAME"
        header-align="center"
        align="center"
        label="所属科室">
      </el-table-column> -->

      <el-table-column
        prop="OPERATORNAME"
        header-align="center"
        align="center"
        label="操作人">
      </el-table-column>   

      <el-table-column
        prop="ACCOUNTNAME"
        header-align="center"
        align="center"
        label="操作账号">
      </el-table-column>  

        <el-table-column
        prop="MOUULENAME"
        header-align="center"
        align="center"
        label="操作模块">
      </el-table-column>

       <el-table-column
        prop="OPTION"
        header-align="center"
        align="center"
        label="操作动作">
      </el-table-column>

        <el-table-column
        prop="IP"
        header-align="center"
        align="center"
        label="IP地址">
      </el-table-column>

   <el-table-column
        prop="OPERATORTIME"
        header-align="center"
        align="center"
        label="操作时间">
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import { GetSysOptLogsList } from '@/utils/api'

export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: '',
      OperatorName: '',
      OperatorUsername: '',
      OperatorTime: '',
      MouuleName: '',
      dataListLoading: false,
      dataListSelections: []
    }
  },
  components: {},
  activated () {
    this.getDataList()
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      var me = this
      var t = ''
      if (me.OperatorTime) {
        t = me.OperatorTime.toString()
      }
      this.dataListLoading = true
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        OperatorName: this.OperatorName,
        OperatorUsername: this.OperatorUsername,
        MouuleName: this.MouuleName,
        OperatorTime: t
      }
      GetSysOptLogsList(params).then(({ data }) => {
        if (data) {
          this.dataList = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            var curData = data.pageList[i]
            if (curData.OPERATORTIME != null) {
              var dateArr = curData.OPERATORTIME.split('T')
              this.dataList[i].OPERATORTIME = dateArr[0]
            }
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
    }
  }
}
</script>
