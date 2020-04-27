<template>
<el-dialog title="HIS导入病人" :close-on-click-modal="false"  :visible.sync="visible" width="1000px">
<div>
  <el-form
        :inline="true"
        :model="dataFormHis"
        >
        <el-form-item label="所属医院：">
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
          >
          </el-option>
        </el-select>
      </el-form-item>
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
          >
          </el-option>
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
        <el-button
          @click="onSearch()"
          type="info"
          icon="el-icon-search"
        >查询</el-button>
      </el-form-item>
        </el-form>
        <el-table
      :data="dataList"
      style="width: 100%">
      <el-table-column
        prop="Pname"
        label="患者姓名"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="Psexname"
        label="性别名称"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="出生日期"
        min-width="150">
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
      </el-table-column> -->
      <el-table-column
        prop="Pcard"
        label="身份证号"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="MedicalInsNum"
        label="医保号"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="HealthCardNum"
        label="健康卡号"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="InsCardNo"
        label="社保号"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="choiceDept(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
</div>
</el-dialog>
</template>
<script>
export default {
  data () {
    return {
      orgs: [],
      keyWordTypeList: [
        {'label': '患者姓名', 'value': '1'},
        {'label': '身份证', 'value': '2'},
        {'label': '住院号', 'value': '3'}
      ],
      dataFormHis: {},
      visible: false,
      dataList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.getOrgList()
    },
        // 获取HIS科室列表
    onSearch () {
      // console.log(123)
      // this.dataListLoading = true
      this.$http({
        url: '/api/patient/getTheHisList',
        method: 'GET',
        params: this.dataFormHis
      }).then(({ data }) => {
        console.log(data)
        if (data) {
          this.dataList = data.dataList
          // this.totalPage = data.totalCount
        } else {
          this.dataList = []
          // this.totalPage = 0
        }
        this.dataListLoading = false
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
    },
    choiceDept () {
      console.log(123)
    }
  }
}
</script>