

<template>
  <el-dialog :before-close="handleClose" :visible.sync="dialogVisible" title="选择本院病人" width="800px">
    <div style="width:100%" class="clearfix">
      <el-select placeholder="请选择" style="width:160px;margin-right:10px;fl" v-model="type">
        <el-option label="姓名" value="1"></el-option>
        <el-option label="身份证" value="2"></el-option>
        <el-option label="住院号" value="3"></el-option>
      </el-select>
      <el-input class="input-with-select;fl"  placeholder="请输入病人名字" style="margin-bottom:20px;width:77%" v-model="keyword">
        <el-button @click="getDataList" icon="el-icon-search" slot="append"></el-button>
      </el-input>
    </div>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <template slot="empty">
            {{emptyText}}
        </template>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form class="demo-table-expand" inline label-position="left">
            <el-form-item label="住址">
              <span>{{ props.row.AddrDetails }}</span>
            </el-form-item>
            <el-form-item label="出生地">
              <span>{{ props.row.BirthPlace }}</span>
            </el-form-item>
            <el-form-item label="手机号码">
              <span>{{ props.row.Mobile }}</span>
            </el-form-item>
            <el-form-item label="民族">
              <span>{{ props.row.NationName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="PatientName" width="100"></el-table-column>
      <el-table-column label="身份证" prop="IdCardNo"></el-table-column>
      <el-table-column label="生日" prop="BirthDate">
        <template slot-scope="scope">
          <span>{{scope.row.BirthDate?scope.row.BirthDate.split(' ')[0]:''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" prop="SexName" width="50px"></el-table-column>
      <el-table-column align="right" label="操作" prop="desc">
        <template slot-scope="scope">
          <el-button @click="select(scope.row)" type="text">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination :total="total" @current-change="currentChange" background layout="prev, pager, next"></el-pagination> -->
    <span class="dialog-footer" slot="footer">
      <el-button @click="dialogVisible = false" size="small">取消</el-button>
      <el-button @click="dialogVisible = false" size="small" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>


<script>
import { getHisPatient } from '@/api/index'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: function (val) {
      this.dialogVisible = val
    },
    dialogVisible: function (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  mounted () {
    if (this.value) {
      this.dialogVisible = true
    }
  },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      keyword: '',
      pageSize: 10,
      pageIndex: 1,
      type: '1',
      total: null,
      loading: false,
      emptyText: '请搜索病人'
    }
  },
  created () {
    // this.getDataList()
  },
  methods: {
    handleClose (done) {
      done()
    },
    onSearch () {
      this.pageIndex = 1
      this.getDataList()
    },
    currentChange (val) {
      this.pageIndex = val
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      let params = {
        orgCode: this.userInfo.OrgCode,
        keyword: this.keyword,
        type: this.type // 1姓名 2身份证 3住院号
      }
      getHisPatient(params).then(({ data }) => {
        this.tableData = data.data
        this.total = data.totalCount
        this.loading = false
        this.emptyText = '没有此病人数据'
      })
    },
    init () {
      this.dialogVisible = true
    },
    select (row) {
      this.dialogVisible = false
      this.$emit('select', row)
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>