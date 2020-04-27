

<template>
  <el-dialog
    :before-close="handleClose"
    :visible.sync="dialogVisible"
    title="选择医生"
    width="750px"
  >
    <div style="display:flex">
      <el-select
        :disabled="isInHosp"
        @change="getOrgsChange"
        placeholder="请选择医院"
        style="width:30%;margin-right:5px"
        v-model="orgid"
      >
        <el-option
          :key="item.ID"
          :label="item.ORG_NAME"
          :value="item.ID"
          v-for="item in orgList"
        ></el-option>
      </el-select>
      <el-select
        @change="getDeptChange"
        clearable
        filterable
        placeholder="请选择科室"
        style="width:30%;margin-right:5px"
        v-model="deptid"
      >
        <el-option
          :key="item.ID"
          :label="item.NAME"
          :value="item.ID"
          v-for="item in deptList"
        ></el-option>
      </el-select>
      <el-input
        class="input-with-select"
        placeholder="请输入医生姓名"
        style="margin-bottom:20px;width:38%"
        v-model="keyword"
      >
        <el-button
          @click="onSearch"
          icon="el-icon-search"
          slot="append"
        ></el-button>
      </el-input>
    </div>

    <el-table
      :data="list"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        align="center"
        label="所属科室"
        prop="DEPT_NAME"
        width="220"
      ></el-table-column>
      <el-table-column
        align="center"
        label="职称"
        prop="JOB_TITLE"
      ></el-table-column>
      <el-table-column
        align="center"
        label="医生名字"
        prop="NAME"
      ></el-table-column>
      <el-table-column
        align="center"
        label="性别"
        prop="GENDER"
      >
        <template slot-scope="scope">{{scope.row.GENDER===0?'女':'男'}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            @click="select(scope.row)"
            size="small"
            type="text"
          >选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :total="total"
      @current-change="currentChange"
      background
      layout="prev, pager, next"
    ></el-pagination>
    <span
      class="dialog-footer"
      slot="footer"
    >
      <el-button
        @click="dialogVisible = false"
        size="small"
      >取 消</el-button>
    </span>
  </el-dialog>
</template>


<script>
import { getDoctorList, getDeptList } from '@/api/index'
import { getOrgListBase } from '@/api/modules/baseOrg.js'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    inHosp: {
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
  async created () {
    const { data } = await getOrgListBase()
    this.orgList = data.pageList

    this.getDepts()
    this.getDataList()
  },
  data () {
    return {
      dialogVisible: false,
      list: [],
      keyword: '',
      pageSize: 10,
      pageIndex: 1,
      total: null,
      orgid: '',
      deptid: '',
      orgList: [],
      deptList: [],
      loading: false
    }
  },

  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    },
    isInHosp () {
      this.getDataList()
      return this.inHosp
    }
  },

  methods: {
    handleClose (done) {
      this.pageIndex = 1
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
    getOrgsChange () {
      this.deptid = ''
      this.pageIndex = 1
      this.getDepts()
      this.getDataList()
    },
    getDeptChange () {
      this.pageIndex = 1
      this.getDataList()
    },
    getDepts () {
      let params = {
        orgid: this.orgid,
        pageSize: 9999999
      }
      getDeptList(params).then(({ data }) => {
        if (data.status === 0) {
          this.deptList = data.pageList
        }
      })
    },
    getDataList () {
      this.loading = true
      let params = {}
      if (this.inHosp) {
        this.orgid = this.userInfo.OrgID
        params = {
          keyword: this.keyword,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          deptid: this.deptid,
          orgid: this.userInfo.OrgID
        }
      } else {
        params = {
          keyword: this.keyword,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          deptid: this.deptid,
          orgid: this.orgid
        }
      }

      getDoctorList(params).then(res => {
        this.list = res.data.pageList
        this.total = res.data.totalCount
        this.loading = false
      })
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