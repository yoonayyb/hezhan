

<template>
  <el-dialog
    :before-close="handleClose"
    :visible.sync="dialogVisible"
    width="1000px"
    class="dialogSt"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="选择病人" name="first">
        <el-input
          class="input-with-select"
          placeholder="请输入病人名字"
          style="margin-bottom:20px"
          v-model="keyword"
        >
          <el-button @click="onSearch" icon="el-icon-search" slot="append"></el-button>
        </el-input>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form class="demo-table-expand" inline label-position="left">
                <el-form-item label="住址">
                  <span>{{ props.row.ADDR_DETAILS }}</span>
                </el-form-item>
                <el-form-item label="手机号码">
                  <span>{{ props.row.MOBILE }}</span>
                </el-form-item>
                <el-form-item label="民族">
                  <span>{{ props.row.NATION_NAME }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="PATIENT_NAME" width="100"></el-table-column>
          <el-table-column label="身份证" prop="ID_NUMBER"></el-table-column>
          <el-table-column label="生日" prop="BIRTH_DATE">
            <template slot-scope="scope">
              <span>{{scope.row.BIRTH_DATE?scope.row.BIRTH_DATE.split('T')[0]:''}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="性别" prop="GENDER_NAME" width="50px"></el-table-column>
          <el-table-column align="right" label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button @click="select(scope.row)" size="small" type="text">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="total"
          @current-change="currentChange"
          :current-page.sync="pageIndex"
          background
          layout="prev, pager, next"
        ></el-pagination>
        <span class="dialog-footer" style="float:right;margin-top: 20px">
          <el-button @click="dialogVisible = false" size="small">取消</el-button>
          <el-button @click="dialogVisible = false" size="small" type="primary">确 定</el-button>
        </span>
      </el-tab-pane>
      <el-tab-pane label="HIS选择" name="second" v-if="flag == 'bs'">
        <div>
          <el-form :inline="true" :model="dataFormHis">
            <!-- <el-form-item label="所属医院：">
              <el-select
                style="width: 225px"
                v-model="dataFormHis.HosID"
                placeholder="所属医院"
                clearable
              >
                <el-option
                  v-for="item in orgs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="搜索词类型：">
              <el-select
                style="width: 150px"
                v-model="dataFormHis.KeywordType"
                placeholder="搜索词类型"
                clearable
              >
                <el-option
                  v-for="item in keyWordTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="患者名称：">
              <el-input
                style="width: 180px"
                clearable
                placeholder="请输入患者名称"
                v-model="dataFormHis.Keyword"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onSearchHis()" type="info" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList" style="width: 100%" v-loading='loadTable'>
            <el-table-column prop="Pname" label="患者姓名" min-width="80"></el-table-column>
            <el-table-column prop="Psexname" label="性别名称" min-width="80"></el-table-column>
            <el-table-column label="出生日期" min-width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.Pbir|formatTimeI }}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column
        label="科室类型">
        <template slot-scope="scope">
          <div v-if="scope.row.DeptType == '0'">门诊</div>
          <div v-if="scope.row.DeptType == '1'">住院</div>
          <div v-if="scope.row.DeptType == '2'">公用</div>
        </template>
            </el-table-column>-->
            <el-table-column prop="Pcard" label="身份证号" min-width="180"></el-table-column>
            <el-table-column label="患者类型" min-width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.PType == 0">门诊</div>
                <div v-if="scope.row.PType == 1">住院</div>
                <div v-else></div>
              </template>
            </el-table-column>
            <el-table-column prop="PinNo" label="住院号" min-width="100"></el-table-column>

            <el-table-column prop="PoutNo" label="门诊号" min-width="100"></el-table-column>            
            <!-- <el-table-column prop="Pmedica" label="就诊卡号" min-width="100"></el-table-column> -->

            <!-- <el-table-column prop="MedicalInsNum" label="医保号" min-width="100"></el-table-column>
            <el-table-column prop="HealthCardNum" label="健康卡号" min-width="100"></el-table-column>
            <el-table-column prop="InsCardNo" label="社保号" min-width="100"></el-table-column> -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="selectFromHis(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          :total="totalHis"
          :current-page.sync="pageIndexHis"
          @current-change="currentChangeHis"
          background
          layout="prev, pager, next"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!-- <span class="dialog-footer" slot="footer">
      <el-button @click="dialogVisible = false" size="small">取消</el-button>
      <el-button @click="dialogVisible = false" size="small" type="primary">确 定</el-button>
    </span>-->
  </el-dialog>
</template>


<script>
// import addHisPatient from '@/components/business/AddNewPatient/addHisPatient'
import { getPatient } from '@/api/index'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  // component: {
  //   addHisPatient
  // },
  watch: {
    value: function (val) {
      this.dialogVisible = val
    },
    dialogVisible: function (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    if (window.SITE_CONFIG['orgflag']) {
      this.flag = window.SITE_CONFIG['orgflag']
    }
    if (this.value) {
      this.dialogVisible = true
    }
  },
  data () {
    return {
      flag: '',
      loadTable: false,
      activeName: 'first',
      dialogVisible: false,
      tableData: [],
      keyword: '',
      pageSize: 10,
      pageIndex: 1,
      pageIndexHis: 1,
      total: null,
      loading: false,
      dataFormHis: {
        KeywordType: '1'
      },
      orgs: [],
      keyWordTypeList: [
        { label: '患者姓名', value: '1' },
        { label: '身份证', value: '2' },
        { label: '住院号', value: '3' }
      ],
      dataList: [],
      totalHis: null

    }
  },
  created () {
    this.getDataList()
    this.getOrgList()
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
    currentChangeHis (val) {
      this.pageIndexHis = val
      this.onSearchHis()
    },
    getDataList () {
      this.loading = true
      let params = {
        keyword: this.keyword,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      getPatient(params).then(({ data }) => {
        this.tableData = data.pageList
        this.total = data.totalCount
        this.loading = false
      })
    },
    init () {
      this.dialogVisible = true
    },
    select (row) {
      this.dialogVisible = false
      this.$emit('select', row)
    },
    selectFromHis (row) {
      this.dialogVisible = false
      this.$emit('selectFromHis', row)
    },
    onSearchHis () {
      // console.log(123)
      // this.dataListLoading = true
      this.dataFormHis.HosID = this.$store.state.user.userInfo.OrgID
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndexHis,
        ...this.dataFormHis
      }
      this.loadTable = true
      this.$http({
        url: '/api/patient/getTheHisList',
        method: 'GET',
        params: params
      }).then(({ data }) => {
        // console.log(data)
        this.loadTable = false
        if (data) {
          this.dataList = data.dataList
          this.totalHis = data.totalCount
        } else {
          this.dataList = []
          this.totalHis = 0
        }
        // this.dataListLoading = false
      })
    },
    // 获取医院列表
    getOrgList () {
      this.$http({
        url: '/api/baseorg/getlist',
        method: 'GET',
        params: {
          pageIndex: 1,
          pageSize: 999
        }
      }).then(({ data }) => {
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