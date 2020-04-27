<template>
  <div class="mod-role">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="所属医院：">
            <el-select
              style="width:230px"
              @change="onOrgChange"
              filterable
              placeholder="请选择医院"
              size="small"
              v-model="orgid"
            >
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.ID"
                v-for="item in orgs"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属科室：">
            <el-select
              :loading="deptSelectLoading"
              filterable
              placeholder="请选择科室"
              size="small"
              v-model="deptid"
              clearable
            >
              <el-option
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
                v-for="item in depts"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="医生姓名："
            size="small"
          >
            <el-input
              clearable
              placeholder="请输入"
              v-model="keyword"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button size="small" @click="addOrUpdateHandle()" icon="el-icon-plus" type="primary" v-permission="['add']">新增</el-button>
          <el-button
            :disabled="dataListSelections.length <= 0"
            @click="generateAccount()"
            icon="el-icon-plus"
            size="small"
            type="primary"
            v-permission="['edit']"
          >生成账号</el-button>
          <!--<el-button
            :disabled="dataListSelections.length <= 0"
            @click="deleteHandle()"
            icon="el-icon-delete"
            size="small"
            type="danger"
            v-permission="['del']"
          >删除</el-button>-->

          <el-button
            @click="onSearch()"
            icon="el-icon-search"
            size="small"
            type="info"
            v-permission="['list']"
          >查询</el-button>
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
      <el-table-column
        align="center"
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="所属医院"
        prop="ORG_NAME"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="所在科室"
        prop="DEPT_NAME"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="医生姓名"
        prop="NAME"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="职称"
        prop="JOB_TITLE"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="性别"
        prop="GENDER"
        width="50"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="出生日期"
        prop="BIRTHDAY"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="电话"
        prop="PHONE"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="学位"
        prop="DEGREE_NAME"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="员工编号"
        prop="EMP_ID"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            @click="addOrUpdateHandle(scope.row.ID)"
            size="small"
            type="text"
            v-permission="['edit']"
          >修改</el-button>
          <el-button
            v-permission="['edit']"
            @click="generateAccount(scope.row.ID)"
            size="small"
            type="text"
          >生成账号</el-button>
          <!-- <el-button @click="deleteHandle(scope.row)" size="small" type="text" v-permission="['del']">删除</el-button>-->
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
    <add-or-update
      @refreshDataList="getDataList"
      ref="addOrUpdate"
      v-if="addOrUpdateVisible"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './edit'
import { getDeptList } from '@/api/index'
import { hex_md5 } from '@/utils/md5.js'
import defultOrgId from '@/mixin/defultOrgId'

export default {
  mixins: [defultOrgId],
  created () {
    this.getOrgId().then(id => {
      this.orgid = id
      this.getDeptSelectList()
    })
    this.getOrgList()
    this.getDataList()
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  data () {
    return {
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
      addOrUpdateVisible: false,
      keyword: '',
      orgid: '',
      orgs: [],
      deptKeyword: '',
      deptid: '',
      depts: [],
      deptSelectLoading: false
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
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
    onOrgChange (val) {
      this.orgid = val
      this.deptid = ''
      this.getDeptSelectList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/BaseDoctor/getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword,
          orgid: this.orgid,
          deptid: this.deptid
        })
      }).then(({ data }) => {
        if (data) {
          this.dataList = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            var curData = data.pageList[i]
            if (curData.BIRTHDAY != null) {
              var dateArr = curData.BIRTHDAY.split('T')
              this.dataList[i].BIRTHDAY = dateArr[0]
            }
            if (this.dataList[i].GENDER !== 2) {
              this.dataList[i].GENDER = curData.GENDER === 0 ? '男' : '女'
            } else {
              this.dataList[i].GENDER = '不详'
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
    getDeptSelectList () {
      let params = {
        pageIndex: 1,
        pageSize: 999999,
        keyword: '',
        orgid: this.orgid
      }
      getDeptList(params).then(({ data }) => {
        this.deptSelectLoading = false
        this.depts = data.pageList
      })
    },
    generateAccount (id) {
      let ids
      if (id) {
        ids = [id]
      } else {
        ids = this.dataListSelections.map(item => {
          return item.ID
        })
      }
      let params = {
        ids: ids.join(','),
        password: hex_md5('123456'),
        cleartextpassword: '123456'
      }
      const loading = this.$loading({
        lock: true,
        text: '正在生成账号',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$http({
        url: `/api/BaseDoctor/createUserName?ids=${ids.join(
          ','
        )}&cleartextpassword=123456&password=${hex_md5('123456')}`,
        method: 'post',
        data: params
      })
        .then(({ data }) => {
          if (data.status === 0) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                loading.close()
                this.getDataList()
              }
            })
          } else {
            loading.close()
            this.$message.error(data.msg)
          }
        })
        .catch(_ => {
          loading.close()
        })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      window.scrollTo(0, 0)
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      window.scrollTo(0, 0)
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      document.body.style['overflow-y'] = 'hidden'
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 搜索
    onSearch () {
      this.pageIndex = 1
      this.getDataList()
    },
    // 删除
    deleteHandle (row) {
      var ids = row
        ? [row.ID]
        : this.dataListSelections.map(item => {
          return item.ID
        })
      let names = row
        ? [row.NAME]
        : this.dataListSelections.map(item => {
          return item.NAME
        })
      this.$confirm(`将删除医生[${names.join(',')}]`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              '/api/BaseDoctor/delete?ids=' + ids.join(',')
            ),
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
        .catch(() => { })
    }
  }
}
</script>
