
<template>
  <el-dialog
    class="dialogSt"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="900px"
    :before-close="clearForm"
  >
    <!-- <div slot="title">{{ !dataForm.ID ? '新增' : '修改' }}</div> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="!dataForm.ID ? '新增' : '修改'" name="first">
        <el-form :model="dataForm" label-width="140px" ref="dataForm">
          <el-form-item
            :rules="{ required: true, message: '请选择医院'}"
            label="所属医院名称"
            prop="ORG_NAME"
            style="width:60%;display:inline-block"
          >
            <el-input
              :readonly="true"
              v-model="dataForm.ORG_NAME"
              :disabled="dataForm.ID?true:false"
            ></el-input>
          </el-form-item>
          <el-button v-if="!dataForm.ID?true:false" @click="ssjgClick" type="text">选择</el-button>

          <el-form-item
            :rules="{ required: true, message: '请填写科室名称'}"
            label="科室名称"
            prop="NAME"
            style="width:60%;"
          >
            <el-input v-model="dataForm.NAME" :disabled="dataForm.ID?true:false"></el-input>
          </el-form-item>

          <el-form-item
            :rules="{ required: true, message: '请填写科室编号'}"
            label="科室编号"
            prop="CODE"
            style="width:60%;"
          >
            <el-input v-model="dataForm.CODE"></el-input>
          </el-form-item>

          <el-form-item label="上级科室名称" prop="PARENT_NAME" style="width:60%;display:inline-block">
            <el-input :readonly="true" v-model="dataForm.PARENT_NAME"></el-input>
          </el-form-item>
          <input type="hidden" v-model="dataForm.PARENT_ID" />
          <el-button @click="sjksClick" type="text">选择</el-button>

          <el-form-item
            :rules="{ required: true, message: '请选择科室类型'}"
            label="科室类型"
            prop="DEPT_TYPE"
            style="width:60%;"
          >
            <el-select
              @change="deptChange"
              placeholder="请选择..."
              style="width:100%;"
              v-model="dataForm.DEPT_TYPE"
            >
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in deptType"
              ></el-option>
            </el-select>
            <input type="hidden" v-model="dataForm.DEPT_TYPE_NAME" />
          </el-form-item>

          <el-form-item
            label="电话"
            prop="WORK_PHONE"
            style="width:60%;"
          >
            <el-input type="number" v-model="dataForm.WORK_PHONE"></el-input>
          </el-form-item>

          <el-form-item label="科室主任" prop="MANAGER_NAME" style="width:60%;display:inline-block">
            <el-input readonly v-model="dataForm.MANAGER_NAME"></el-input>
          </el-form-item>
          <input type="hidden" v-model="dataForm.MANAGER_ID" />
          <el-button @click="kszrClick" type="text">选择</el-button>
          <el-form-item label="业务科室" prop="unitFlag" style="width:60%;display:inline-block">
            <!-- <el-input readonly v-model="dataForm.unitFlag"></el-input> -->
            <el-select v-model="dataForm.unitFlag" placeholder="请选择业务科室">
              <el-option
                v-for="item in unitFlagList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <el-radio v-model="dataForm.unitFlag" label= "2">综合（非业务科室）</el-radio> -->
          </el-form-item>
          <el-form-item label="科室介绍" prop="INTRODUCTION">
            <el-input
              :autosize="{ minRows: 5, maxRows: 10}"
              type="textarea"
              v-model="dataForm.INTRODUCTION"
            ></el-input>
          </el-form-item>
        </el-form>
        <span class="dialog-footer" style="float: right">
          <el-button :loading="submitButtonLoading" @click="dataFormSubmit()" type="primary">确定</el-button>
          <el-button @click="clearForm">取消</el-button>
        </span>
      </el-tab-pane>
      <el-tab-pane v-if="!dataForm.ID" label="HIS导入" name="second">
        <el-form :inline="true" :model="dataFormHis">
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
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室名称：">
            <el-input clearable placeholder="请输入科室名称" v-model="dataFormHis.DepName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSearch()" type="info" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" style="width: 100%">
          <el-table-column prop="DeptId" label="科室编码" width="130"></el-table-column>
          <el-table-column prop="DeptName" label="科室名称" width="130"></el-table-column>
          <el-table-column prop="PyCode" label="拼音代码"></el-table-column>
          <el-table-column label="科室类型">
            <template slot-scope="scope">
              <div v-if="scope.row.DeptType == '0'">门诊</div>
              <div v-if="scope.row.DeptType == '1'">住院</div>
              <div v-if="scope.row.DeptType == '2'">公用</div>
            </template>
          </el-table-column>
          <el-table-column prop="DeptParname" label="科室主任名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="choiceDept(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- <span class="dialog-footer" slot="footer">
      <el-button :loading="submitButtonLoading" @click="dataFormSubmit()" type="primary">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>-->

    <!--所属医院弹窗-->
    <el-dialog :visible.sync="ssjgVisible" append-to-body title="所属医院" width="600px">
      <el-form style="width:100%">
        <el-form-item style="width:85%;display:inline-block">
          <el-input placeholder="请输入医院名称" v-model="keyword"></el-input>
        </el-form-item>
        <el-button @click="getssjg()" type="primary">搜索</el-button>
      </el-form>

      <el-table
        :data="ssjgDataList"
        border
        style="width: 100%;margin-top:20px"
        v-loading="ssjgLoading"
      >
        <el-table-column align="center" header-align="center" label="医院名称" prop="ORG_NAME"></el-table-column>

        <el-table-column align="center" header-align="center" label="医院类型" prop="INSTITUTION_TYPE"></el-table-column>

        <el-table-column align="center" header-align="center" label="医院等级" prop="ORG_TYPE"></el-table-column>

        <el-table-column align="center" header-align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="ssjgSelect(scope.row.ID,scope.row.ORG_CODE,scope.row.ORG_NAME)"
              size="small"
              type="text"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="totalPage"
        @current-change="ssjgCurrentChange"
        layout="prev, pager, next"
        small
      ></el-pagination>
    </el-dialog>
    <!--所属医院弹窗-->
    <!--上级科室弹窗-->
    <el-dialog :visible.sync="sjksVisible" append-to-body title="上级科室" width="600px">
      <el-form style="width:100%">
        <el-form-item style="width:85%;display:inline-block">
          <el-input placeholder="请输入上级科室" v-model="keyword"></el-input>
        </el-form-item>
        <el-button @click="getsjks()" type="primary">搜索</el-button>
      </el-form>

      <el-table
        :data="sjksDataList"
        border
        style="width: 100%;margin-top:20px"
        v-loading="sjksLoading"
      >
        <el-table-column align="center" header-align="center" label="科室名称" prop="NAME"></el-table-column>

        <el-table-column align="center" header-align="center" label="科室类型" prop="DEPT_TYPE_NAME"></el-table-column>

        <el-table-column align="center" header-align="center" label="电话" prop="WORK_PHONE"></el-table-column>

        <el-table-column align="center" header-align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="sjksSelect(scope.row.ID,scope.row.NAME)" size="small" type="text">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="totalPage"
        @current-change="sjksCurrentChange"
        layout="prev, pager, next"
        small
      ></el-pagination>
    </el-dialog>
    <!--上级科室弹窗-->
    <!--科室主任弹窗-->
    <el-dialog :visible.sync="kszrVisible" append-to-body title="科室主任" width="600px">
      <el-form style="width:100%">
        <el-form-item style="width:85%;display:inline-block">
          <el-input placeholder="请输入科室主任" v-model="keyword"></el-input>
        </el-form-item>
        <el-button @click="getkszr()" type="primary">搜索</el-button>
      </el-form>

      <el-table
        :data="kszrDataList"
        border
        style="width: 100%;margin-top:20px"
        v-loading="kszrLoading"
      >
        <el-table-column align="center" header-align="center" label="姓名" prop="NAME"></el-table-column>

        <el-table-column align="center" header-align="center" label="性别" prop="GENDER"></el-table-column>

        <el-table-column align="center" header-align="center" label="职称" prop="JOB_TITLE"></el-table-column>

        <el-table-column align="center" header-align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="kszrSelect(scope.row.ID,scope.row.NAME)" size="small" type="text">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="totalPage"
        @current-change="kszrCurrentChange"
        layout="prev, pager, next"
        small
      ></el-pagination>
    </el-dialog>
    <!--科室主任弹窗-->
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dataList: [],
      activeName: 'first',
      dataFormHis: {
        pageIndex: 1,
        pageSize: 9999
      },
      visible: false,
      ssjgVisible: false,
      ssjgLoading: false,
      ssjgDivShow: false,
      ssjgDataList: [],
      sjksVisible: false,
      sjksLoading: false,
      sjksDivShow: false,
      sjksDataList: [],
      kszrVisible: false,
      kszrLoading: false,
      kszrDivShow: false,
      kszrDataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: '',
      dataForm: {
        ID: 0,
        ORG_ID: '',
        ORG_CODE: '',
        ORG_NAME: ''
      },
      deptType: [],
      submitButtonLoading: false,
      orgs: [],
      HosID: '',
      unitFlagList: [{
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }]
    }
  },

  methods: {
    init (id) {
      this.getOrgList()
      this.getDeptType()
      this.dataForm.ID = id || 0
      this.$http({
        url: this.$http.adornUrl('/api/basedept/GetViewModel'),
        method: 'get',
        params: { ID: '' }
      })
        .then(({ data }) => {
          this.dataForm = data
          console.log(this.dataForm)
        })
        .then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        })
        .then(() => {
          if (id) {
            this.dataForm.ID = id
            this.$http({
              url: this.$http.adornUrl(
                `/api/basedept/GetViewModel/${this.dataForm.ID}`
              ),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.dataForm = data
            })
          }
        })
    },
    handleClick (tab) {
      console.log(tab, event)
    },

    // -----科室类型-----
    getDeptType () {
      this.$http({
        url: this.$http.adornUrl('/api/baseDict/GetlistByType'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999,
          TypeId: '8B4BECEE-C336-4DF1-9583-CAA81904801F'
        })
      }).then(({ data }) => {
        if (data) {
          this.deptType = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            this.deptType[i].value = data.pageList[i].CODE
            this.deptType[i].label = data.pageList[i].NAME
          }
        }
      })
    },
    deptChange (val) {
      let obj = {}
      obj = this.deptType.find(item => {
        return item.value === val
      })
      this.dataForm.DEPT_TYPE_NAME = obj.label
    },
    // -----科室类型-----

    // -----所属医院-----
    ssjgClick () {
      this.ssjgVisible = true
      this.ssjgDivShow = false
      this.pageIndex = 1
      this.keyword = ''
      this.getssjg()
    },
    // 所属医院当前页
    ssjgCurrentChange (val) {
      this.pageIndex = val
      this.getssjg()
    },
    // 选择所属医院
    ssjgSelect (_id, _code, _name) {
      this.dataForm.ORG_ID = _id
      this.dataForm.ORG_CODE = _code
      this.dataForm.ORG_NAME = _name
      this.ssjgVisible = false
      // 清空科室
      this.dataForm.PARENT_ID = ''
      this.dataForm.PARENT_NAME = ''
      // 清空主任
      this.dataForm.MANAGER_ID = ''
      this.dataForm.MANAGER_NAME = ''
    },
    // 获取所属医院
    getssjg () {
      this.ssjgLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/BaseOrg/Getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword
        })
      }).then(({ data }) => {
        if (data) {
          this.ssjgDataList = data.pageList
          this.totalPage = data.totalCount
          this.ssjgDivShow = true
        }
        this.ssjgLoading = false
      })
    },
    // -----所属医院-----

    // -----上级科室-----
    sjksClick () {
      if (!this.dataForm.ORG_ID) {
        this.$message.error('请先选择所属医院')
        return
      }
      this.sjksVisible = true
      this.sjksDivShow = false
      this.pageIndex = 1
      this.keyword = ''
      this.getsjks()
    },
    // 上级科室当前页
    sjksCurrentChange (val) {
      this.pageIndex = val
      this.getsjks()
    },
    // 选择上级科室
    sjksSelect (_id, _name) {
      this.dataForm.PARENT_ID = _id
      this.dataForm.PARENT_NAME = _name
      this.sjksVisible = false
    },
    // 获取上级科室
    getsjks () {
      this.sjksLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/BaseDept/Getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword,
          orgid: this.dataForm.ORG_ID
        })
      }).then(({ data }) => {
        if (data) {
          this.sjksDataList = data.pageList
          this.totalPage = data.totalCount
          this.sjksDivShow = true
        }
        this.sjksLoading = false
      })
    },
    // -----上级科室-----

    // -----科室主任-----
    kszrClick () {
      if (!this.dataForm.ORG_ID) {
        this.$message.error('请先选择所属医院')
        return
      }
      this.kszrVisible = true
      this.kszrDivShow = false
      this.pageIndex = 1
      this.keyword = ''
      this.getkszr()
    },
    // 科室主任当前页
    kszrCurrentChange (val) {
      this.pageIndex = val
      this.getkszr()
    },
    // 选择科室主任
    kszrSelect (_id, _name) {
      this.dataForm.MANAGER_ID = _id
      this.dataForm.MANAGER_NAME = _name
      this.kszrVisible = false
    },
    // 获取科室主任
    getkszr () {
      this.kszrLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/BaseDoctor/Getlist'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword
        })
      }).then(({ data }) => {
        if (data) {
          this.kszrDataList = data.pageList
          this.kszrDataList.forEach(element => {
            if (element.GENDER == 2) {
              element.GENDER = '不详'
            } else {
              element.GENDER = element.GENDER === 1 ? '男' : '女'
            }
          })
          this.totalPage = data.totalCount
          this.kszrDivShow = true
        }
        this.kszrLoading = false
      })
    },
    // -----科室主任-----

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true
          this.$http({
            url: this.$http.adornUrl(`/api/basedept/save`),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          })
            .then(({ data }) => {
              if (data && data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    document.body.style['overflow-y'] = 'auto'
                    this.visible = false
                    this.submitButtonLoading = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.submitButtonLoading = false
              }
            })
            .catch(_ => {
              this.submitButtonLoading = false
            })
        }
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
    // 获取HIS科室列表
    onSearch () {
      // console.log(123)
      // this.dataListLoading = true
      let obj = JSON.stringify(this.dataFormHis.HosID)
      this.HosID = JSON.parse(obj)
      this.$http({
        url: 'api/BaseDept/GetHisDeptList',
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
    // 选择科室后回调
    choiceDept (row) {
      console.log(row)
      this.dataForm.ORG_NAME = row.Hname
      this.dataForm.ORG_ID = this.HosID
      this.dataForm.ORG_CODE = row.Hid
      this.dataForm.NAME = row.DeptName
      this.dataForm.CODE = row.DeptId
      this.dataForm.PARENT_ID = row.DeptParid
      this.dataForm.PARENT_NAME = row.DeptParname
      switch (row.DeptType) {
        case '0': // 门诊
          // let i = 'c42d7e56-f85f-4a72-b696-eccf650cd757'
          // let i1 = this.deptType.find(value => value.ID == i)
          this.dataForm.DEPT_TYPE = '0'
          this.dataForm.DEPT_TYPE_NAME = '门诊'
          break
        case '1': // 住院
          // let i2 = '99b2b304-afe1-4f9e-bec8-1a29b2445598'
          // let i3 = this.deptType.find(value => value.ID == i2)
          this.dataForm.DEPT_TYPE = '1'
          this.dataForm.DEPT_TYPE_NAME = '住院'
          break
        case '2': // 综合 公用
          // let i4 = 'bd683294-c488-4d5a-9462-48036977753f'
          // let i5 = this.deptType.find(value => value.ID == i4)
          this.dataForm.DEPT_TYPE = '2'
          this.dataForm.DEPT_TYPE_NAME = '公用'
          break
      }
      // this.dataForm.DEPT_TYPE = row.DeptType
      this.dataForm.WORK_PHONE = row.Dtel
      this.dataForm.MANAGER_ID = row.DmId
      this.dataForm.MANAGER_NAME = row.DmName
      this.dataForm.INTRODUCTION = row.Hdesc
      this.activeName = 'first'
      // console.log(this.dataForm)
    },
    clearForm () {
      this.dataList = []
      this.dataFormHis = {}
      this.activeName = 'first'
      this.visible = false
      document.body.style['overflow-y'] = 'auto'
    }
  }
}
</script>
