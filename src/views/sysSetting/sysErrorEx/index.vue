<template>
  <div class="mod-role">
    <el-form :inline="true">
      <el-form-item label="操作人：">
        <el-input v-model="OperatorName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="控制器名：">
        <el-input v-model="ControllerName" placeholder="请输入" clearable></el-input>
      </el-form-item>
        <el-form-item label="方法名">
        <el-input v-model="ActionName" placeholder="请输入" clearable></el-input>
      </el-form-item>
        <el-form-item label="操作时间">
            <el-date-picker
      v-model="OperatorTime"
      type="datetimerange"
      range-separator="至"
      value-format="yyyy-MM-dd HH:mm:ss"
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
        prop="OrgName"
        header-align="center"
        align="center"
        label="所属医院">
      </el-table-column>

      <!-- <el-table-column
        prop="DeptName"
        header-align="center"
        align="center"
        label="所属科室">
      </el-table-column> -->

      <el-table-column
        prop="OperatorName"
        header-align="center"
        align="center"
        label="操作人">
      </el-table-column>   

      <el-table-column
        prop="OperatorUsername"
        header-align="center"
        align="center"
        label="操作账号">
      </el-table-column>  

        <el-table-column
        prop="ControllerName"
        header-align="center"
        align="center"
        label="控制器名">
      </el-table-column>

       <el-table-column
        prop="ActionName"
        header-align="center"
        align="center"
        label="方法名">
      </el-table-column>

       <el-table-column
        prop="Msgdetails"
        header-align="center"
        align="center"
        label="错误详情" 
        width="500px"
        >
      </el-table-column>

        <el-table-column
        prop="Ip"
        header-align="center"
        align="center"
        label="IP地址">
      </el-table-column>

   <el-table-column
        prop="OperatorTime"
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
export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      OperatorName: '',
      ControllerName: '',
      OperatorTime: '',
      ActionName: '',
    //   Msgdetails:'',
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
        ControllerName: this.ControllerName,
        ActionName: this.ActionName,
        // Msgdetails:this.Msgdetails,
        OperatorTime: t
      }
      this.$http({
        url: this.$http.adornUrl('/api/SysErrorLogs/Getlist'),
        method: 'GET',
        params: params
      }).then(({ data }) => {
        if (data) {
          this.dataList = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            var curData = data.pageList[i]
            if (curData.OperatorTime != null) {
              var dateArr = curData.OperatorTime.split('T')
              this.dataList[i].OperatorTime = dateArr[0]
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
