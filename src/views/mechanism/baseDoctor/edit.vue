<template>
  <el-dialog
    class="dialogSt"
    :close-on-click-modal="false"
    width="1100px"
    :visible.sync="visible"
    :before-close="clearForm"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="!dataForm.ID" label="HIS导入" name="first">
        <el-form :inline="true" :model="dataFormHis">
          <el-form-item label="所属医院：">
            <el-select
              style="width: 225px"
              v-model="dataFormHis.HosID"
              placeholder="所属医院"
              clearable
              @change="hospChange"
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
            <el-select v-model="DepID" placeholder="科室名称" @change="changeDept" clearable>
              <el-option
                v-for="item in deptSelectList"
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="医生名称：">
            <el-input clearable placeholder="请输入医生名称" v-model="dataFormHis.DocName"></el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button @click="onSearch()" type="info" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" style="width: 100%">
          <el-table-column prop="StaffName" label="姓名" min-width="130"></el-table-column>
          <el-table-column prop="IdCardNo" label="身份证号" min-width="180"></el-table-column>
          <el-table-column prop="StaffId" label="员工编号" min-width="100"></el-table-column>
          <el-table-column prop="Title" label="职称" min-width="130"></el-table-column>
          <el-table-column prop="Psexname" label="性别名称"></el-table-column>
          <el-table-column prop="Tel" label="电话" min-width="150"></el-table-column>
          <el-table-column prop="Dept" label="科室名称" min-width="150"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="choiceDoc(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="!dataForm.ID ? '信息确认' : '修改'" name="second">
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          label-width="120px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="医院名称" prop="ORG_NAME">
                <el-input v-model="dataForm.ORG_NAME" disabled />

                <!-- <el-input
          v-model="dataForm.ORG_NAME"
          :readonly="dataForm.ID&&dataForm.ID!=='0'"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在科室" prop="DEPT_NAME" style="width:90%;display:inline-block">
                <el-input v-model="dataForm.DEPT_NAME" :readonly="true" />

                <!-- <el-input
          v-model="dataForm.DEPT_NAME"
          :readonly="dataForm.ID&&dataForm.ID!=='0'"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>-->
              </el-form-item>
              <el-button @click="deptClick" type="text">选择</el-button>
            </el-col>
            <el-col :span="8">
              <el-form-item label="医生姓名" prop="NAME">
                <el-input v-model="dataForm.NAME" disabled />
                <!-- <el-input
          v-model="dataForm.NAME"
          :readonly="dataForm.ID&&dataForm.ID!=='0'"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="医生职称" prop="JOB_TITLE">
                <el-input v-model="dataForm.JOB_TITLE" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职称级别" prop="JOB_TITLE_LEVEL">
                <el-input v-model="dataForm.JOB_TITLE_LEVEL" disabled />
                <!-- {{dataForm.JOB_TITLE_LEVEL}} -->
                <!-- <el-select
          v-model="dataForm.JOB_TITLE_LEVEL"
          placeholder="请选择..."
          style="width:100%;"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
        >
          <el-option
            v-for="item in zcjbTypes"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号" prop="NATIONAL_IDENTIFIER">
                <!-- {{dataForm.NATIONAL_IDENTIFIER}} -->
                <el-input v-model="dataForm.NATIONAL_IDENTIFIER" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="GENDER">
                <el-input v-if="dataForm.GENDER == 2" value="不详" disabled />
                <el-input
                  v-if="dataForm.GENDER != 2"
                  :value="dataForm.GENDER == 0 ? '男':'女'"
                  disabled
                />
                <!-- <el-select
          v-model="dataForm.GENDER"
          placeholder="请选择..."
          style="width:100%;"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
        >
          <el-option
            :value="0"
            label="男"
          ></el-option>
          <el-option
            :value="1"
            label="女"
          ></el-option>
                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话" prop="PHONE">
                <el-input v-model="dataForm.PHONE"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="员工编号" prop="EMP_ID">
                <el-input :value="dataForm.EMP_ID" disabled />
                <!-- 
        <el-input
          v-model="dataForm.EMP_ID"
          :readonly="dataForm.ID&&dataForm.ID!=='0'"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学位" prop="DEGREE_NAME">
                <el-input :value="dataForm.DEGREE_NAME" disabled />
                <!-- 
        <el-input
          v-model="dataForm.DEGREE_NAME"
          :readonly="dataForm.ID&&dataForm.ID!=='0'"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期" prop="BIRTHDAY">
                <div class="block">
                  <el-date-picker
                    v-model="dataForm.BIRTHDAY"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="是否处方" style="width:60%;" prop="IS_PRESCRIPTION">
            <el-radio-group v-model="dataForm.IS_PRESCRIPTION">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否使用抗生素" style="width:60%;" prop="IS_ANTIBIOTICS">
            <el-radio-group v-model="dataForm.IS_ANTIBIOTICS">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否使用抗肿瘤药物" style="width:60%;" prop="IS_ANTI_TUMOR">
            <el-radio-group v-model="dataForm.IS_ANTI_TUMOR">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item style="width:100%;" label="个人简介" prop="INTRODUCTION">
            <el-input
              style="width:500px;"
              v-model="dataForm.INTRODUCTION"
              :autosize="{ minRows: 5, maxRows: 10}"
              type="textarea"
            ></el-input>
          </el-form-item>

          <el-form-item style="width:100%;" label="擅长领域" prop="FIELD">
            <el-input
              style="width:500px;"
              v-model="dataForm.FIELD"
              :autosize="{ minRows: 5, maxRows: 10}"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <span style="float:right" class="dialog-footer">
          <el-button @click="clearForm">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()" :loading="submitButtonLoading">确定</el-button>
        </span>
      </el-tab-pane>
      <el-tab-pane v-if="!dataForm.ID" label="手动录入" name="third">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="医院名称" prop="ORG_NAME" style="width:90%;display:inline-block">
                <el-input v-model="dataForm.ORG_NAME" :disabled="!dataForm.ID?false:true" />

                <!-- <el-input
          v-model="dataForm.ORG_NAME"
          :readonly="dataForm.ID&&dataForm.ID!=='0'"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>-->
              </el-form-item>
              <el-button v-if="!dataForm.ID?true:false" @click="orgClick" type="text">选择</el-button>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在科室" prop="DEPT_NAME" style="width:90%;display:inline-block">
                <el-input v-model="dataForm.DEPT_NAME" :disabled="!dataForm.ID?false:true" />

                <!-- <el-input
          v-model="dataForm.DEPT_NAME"
          :readonly="dataForm.ID&&dataForm.ID!=='0'"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>-->
              </el-form-item>
              <el-button v-if="!dataForm.ID?true:false" @click="deptClick" type="text">选择</el-button>
            </el-col>
            <el-col :span="8">
              <el-form-item label="医生姓名" prop="NAME">
                <el-input v-model="dataForm.NAME" :disabled="!dataForm.ID?false:true" />
                <!-- <el-input
          v-model="dataForm.NAME"
          :readonly="dataForm.ID&&dataForm.ID!=='0'"
          :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="医生职称" prop="JOB_TITLE">
                <!-- <el-input v-model="dataForm.JOB_TITLE" disabled /> -->
                <el-select
                  v-model="dataForm.JOB_TITLE"
                  placeholder="请选择..."
                  style="width:100%;"
                  :disabled="dataForm.ID&&dataForm.ID!=='0'"
                >
                  <el-option
                    v-for="item in yszcTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职称级别" prop="JOB_TITLE_LEVEL">
                <!-- <el-input v-model="dataForm.JOB_TITLE_LEVEL" disabled /> -->
                <!-- {{dataForm.JOB_TITLE_LEVEL}} -->
                <el-select
                  v-model="dataForm.JOB_TITLE_LEVEL"
                  placeholder="请选择..."
                  style="width:100%;"
                  :disabled="dataForm.ID&&dataForm.ID!=='0'"
                >
                  <el-option
                    v-for="item in zcjbTypes"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号" prop="NATIONAL_IDENTIFIER">
                <!-- {{dataForm.NATIONAL_IDENTIFIER}} -->
                <el-input
                  v-model="dataForm.NATIONAL_IDENTIFIER"
                  :disabled="dataForm.ID&&dataForm.ID!=='0'"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="GENDER">
                <!-- <el-input v-if="dataForm.GENDER == 2" value="不详" disabled />
                <el-input v-if="dataForm.GENDER != 2" :value="dataForm.GENDER == 0 ? '男':'女'" disabled />-->
                <el-select
                  v-model="dataForm.GENDER"
                  placeholder="请选择..."
                  style="width:100%;"
                  :disabled="dataForm.ID&&dataForm.ID!=='0'"
                >
                  <el-option :value="0" label="男"></el-option>
                  <el-option :value="1" label="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话" prop="PHONE">
                <el-input v-model="dataForm.PHONE"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="员工编号" prop="EMP_ID">
                <!-- <el-input :model="dataForm.EMP_ID" :disabled="dataForm.ID&&dataForm.ID!=='0'" /> -->
                <el-input
                  v-model="dataForm.EMP_ID"
                  :readonly="dataForm.ID&&dataForm.ID!=='0'"
                  :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学位" prop="DEGREE_NAME">
                <!-- <el-input :model="dataForm.DEGREE_NAME" :disabled="dataForm.ID&&dataForm.ID!=='0'" /> -->

                <el-input
                  v-model="dataForm.DEGREE_NAME"
                  :readonly="dataForm.ID&&dataForm.ID!=='0'"
                  :disabled="dataForm.ID&&dataForm.ID!=='0'"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期" prop="BIRTHDAY">
                <div class="block">
                  <el-date-picker
                    v-model="dataForm.BIRTHDAY"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="是否处方" style="width:60%;" prop="IS_PRESCRIPTION">
            <el-radio-group v-model="dataForm.IS_PRESCRIPTION">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否使用抗生素" style="width:60%;" prop="IS_ANTIBIOTICS">
            <el-radio-group v-model="dataForm.IS_ANTIBIOTICS">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否使用抗肿瘤药物" style="width:60%;" prop="IS_ANTI_TUMOR">
            <el-radio-group v-model="dataForm.IS_ANTI_TUMOR">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item style="width:100%;" label="个人简介" prop="INTRODUCTION">
            <el-input
              style="width:500px;"
              v-model="dataForm.INTRODUCTION"
              :autosize="{ minRows: 5, maxRows: 10}"
              type="textarea"
            ></el-input>
          </el-form-item>

          <el-form-item style="width:100%;" label="擅长领域" prop="FIELD">
            <el-input
              style="width:500px;"
              v-model="dataForm.FIELD"
              :autosize="{ minRows: 5, maxRows: 10}"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <span style="float:right" class="dialog-footer">
          <el-button @click="clearForm">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()" :loading="submitButtonLoading">确定</el-button>
        </span>
      </el-tab-pane>
    </el-tabs>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="submitButtonLoading">确定</el-button>
    </span>-->

    <!--所属医院弹窗-->
    <el-dialog
      width="50%"
      title="选择医院"
      :visible.sync="ssjgVisible"
      @keyup.enter.native="getssjg()"
      append-to-body
    >
      <el-form style="width:100%">
        <el-form-item style="width:85%;display:inline-block">
          <el-input v-model="keyword" placeholder="请输入医院名称"></el-input>
        </el-form-item>
        <el-button type="primary" @click="getssjg()">搜索</el-button>
      </el-form>

      <div v-show="ssjgDivShow">
        <el-table
          :data="ssjgDataList"
          border
          v-loading="ssjgLoading"
          style="width: 100%;margin-top:20px"
        >
          <el-table-column prop="ORG_NAME" header-align="center" align="center" label="医院名称"></el-table-column>

          <el-table-column
            prop="INSTITUTION_TYPE"
            header-align="center"
            align="center"
            label="医院类型"
          ></el-table-column>

          <el-table-column prop="ORG_TYPE" header-align="center" align="center" label="医院等级"></el-table-column>

          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="ssjgSelect(scope.row.ID,scope.row.ORG_CODE,scope.row.ORG_NAME)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          small
          layout="prev, pager, next"
          @current-change="ssjgCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="totalPage"
        ></el-pagination>
      </div>
    </el-dialog>
    <!--所属医院弹窗-->

    <!--科室弹窗-->
    <el-dialog width="50%" title="选择科室" :visible.sync="deptVisible" append-to-body>
      <el-form style="width:100%">
        <el-form-item style="width:85%;display:inline-block">
          <el-input v-model="keyword" placeholder="请输入科室名称"></el-input>
        </el-form-item>
        <el-button type="primary" @click="getDept()">搜索</el-button>
      </el-form>

      <div v-show="deptDivShow">
        <el-table
          :data="deptDataList"
          border
          v-loading="deptLoading"
          style="width: 100%;margin-top:20px"
        >
          <el-table-column prop="NAME" header-align="center" align="center" label="科室名称"></el-table-column>

          <el-table-column prop="DEPT_TYPE_NAME" header-align="center" align="center" label="科室类型"></el-table-column>

          <el-table-column prop="WORK_PHONE" header-align="center" align="center" label="电话"></el-table-column>

          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="deptSelect(scope.row.ID,scope.row.NAME)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          small
          layout="prev, pager, next"
          @current-change="deptCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="totalPage"
        ></el-pagination>
      </div>
    </el-dialog>
    <!--科室弹窗-->
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { isMobile, isIdCard } from '@/utils/validate.js'
import { getDeptList } from '@/api/index'

const validatePhone = (rule, value, callback) => {
  if (value && value !== '无') {
    if (isMobile(value) || value.trim() === '') {
      callback()
    } else {
      callback(new Error('手机格式不正确'))
    }
  } else {
    callback()
  }
}

const valideteIdCard = (rule, value, callback) => {
  if (isIdCard(value)) {
    callback()
  } else {
    callback(new Error('身份证格式不正确'))
  }
}

export default {
  components: { Treeselect },
  data () {
    return {
      HosID: '',
      DepID: '',
      transDeptId: '',
      deptSelectList: [],
      dataFormHis: {
        pageIndex: 1,
        pageSize: 9999
      },
      activeName: 'first',
      fromOrg: '',
      isShow: false,
      visible: false,
      innerVisible: false,
      dataListLoading: false,
      dataList: [],
      ssjgVisible: false,
      ssjgLoading: false,
      ssjgDivShow: false,
      ssjgDataList: [],
      deptVisible: false,
      deptLoading: false,
      deptDivShow: false,
      deptDataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: '',
      dataForm: {
        ID: 0,
        ORG_ID: '',
        ORG_CODE: '',
        ORG_NAME: '',
        GENDER: 1,
        EMP_ID: ''
      },
      dataRule: {
        // NATIONAL_IDENTIFIER: [{validator: valideteIdCard, trigger: 'blur'}],
        PHONE: [{ validator: validatePhone, trigger: 'blur' }]
      },
      yszcTypes: [],
      zcjbTypes: [],
      submitButtonLoading: false,
      orgs: []
    }
  },

  methods: {
    init (id) {
      this.getyszc()
      this.getzcjb()
      this.getOrgList()
      this.dataForm.ID = id || '0'
      this.$http({
        url: this.$http.adornUrl('/api/BaseDoctor/GetViewModel'),
        method: 'get',
        params: { ID: '' }
      })
        .then(({ data }) => {
          this.dataForm = data
          // console.log(data)
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
            this.activeName = 'second'
            this.$http({
              url: this.$http.adornUrl(
                `/api/BaseDoctor/GetViewModel?id=${this.dataForm.ID}`
              ),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.dataForm = data
            })
          }
        })
    },

    orgClick () {
      this.ssjgVisible = true
      this.ssjgDivShow = false
      this.pageIndex = 1
      this.keyword = ''
      this.getssjg()
    },

    deptClick () {
      if (!this.dataForm.ORG_ID) {
        this.$message.error('请先选择医院')
        return
      }
      this.deptVisible = true
      this.deptDivShow = false
      this.pageIndex = 1
      this.keyword = ''
      this.getDept()
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
      this.dataForm.DEPT_ID = ''
      this.dataForm.DEPT_NAME = ''
    },
    // 获取所属医院
    getssjg () {
      this.ssjgLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/BaseOrg/GetAllianceListBase'),
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

    // 科室当前页
    deptCurrentChange (val) {
      this.pageIndex = val
      this.getDept()
    },
    // 选择科室
    deptSelect (_id, _name) {
      this.dataForm.DEPT_ID = _id
      this.dataForm.DEPT_NAME = _name
      this.deptVisible = false
    },
    // 获取科室
    getDept () {
      this.deptLoading = true
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
          this.deptDataList = data.pageList
          this.totalPage = data.totalCount
          this.deptDivShow = true
        }
        this.deptLoading = false
      })
    },

    // -----医生职称-----
    yszcChange (val) {
      let obj = {}
      obj = this.yszcTypes.find(item => {
        return item.value === val
      })
      this.dataForm.JOB_TITLE = obj.label
    },
    getyszc () {
      this.$http({
        url: this.$http.adornUrl('/api/baseDict/GetlistByType'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999,
          TypeId: '043db869-3ac1-4dea-993d-97074246b421'
        })
      }).then(({ data }) => {
        if (data) {
          this.yszcTypes = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            this.yszcTypes[i].value = data.pageList[i].ID
            this.yszcTypes[i].label = data.pageList[i].NAME
          }
        }
      })
    },
    // -----医生职称-----

    // 获取职称级别
    getzcjb () {
      this.$http({
        url: this.$http.adornUrl('/api/baseDict/GetlistByType'),
        method: 'GET',
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999,
          TypeId: '55be3a8b-b1bd-499b-9fa7-d660c5f03883'
        })
      }).then(({ data }) => {
        if (data) {
          this.zcjbTypes = data.pageList
          for (var i = 0; i < data.pageList.length; i++) {
            this.zcjbTypes[i].value = data.pageList[i].NAME
          }
        }
      })
    },

    // 表单提交
    dataFormSubmit () {
      console.log(123)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true

          this.$http({
            url: this.$http.adornUrl(`/api/BaseDoctor/save`),
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
                    this.clearForm()
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
    getDeptSelectList (id) {
      // this.dataFormHis.DepID = ''
      let params = {
        pageIndex: 1,
        pageSize: 999,
        keyword: '',
        orgid: id
      }
      getDeptList(params).then(({ data }) => {
        this.deptSelectList = data.pageList
        // console.log(this.deptSelectList)
      })
    },
    changeDept (val) {
      this.dataFormHis.DepID = val
    },
    hospChange (val) {
      this.DepID = ''
      this.deptSelectList = []
      this.getDeptSelectList(val)
    },
    onSearch () {
      let obj = JSON.stringify(this.dataFormHis.HosID)
      this.HosID = JSON.parse(obj)
      let objDe = JSON.stringify(this.dataFormHis.DepID)
      this.transDeptId = JSON.parse(objDe)
      this.$http({
        url: '/api/BaseDoctor/GetHisDoctorList',
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
    choiceDoc (row) {
      this.dataForm.ORG_ID = this.HosID
      this.dataForm.ORG_NAME = row.Hname
      this.dataForm.ORG_CODE = row.Hid
      this.dataForm.DEPT_ID = this.transDeptId
      this.dataForm.DEPT_NAME = row.Dept
      this.dataForm.NAME = row.StaffName
      this.dataForm.JOB_TITLE = row.Title
      this.dataForm.JOB_TITLE_LEVEL = row.TitleLevel
      this.dataForm.NATIONAL_IDENTIFIER = row.IdCardNo
      if (row.Psexname) {
        this.dataForm.GENDER = row.Psexname
      } else {
        this.dataForm.GENDER = 2
      }
      this.dataForm.PHONE = row.Tel
      this.dataForm.EMP_ID = row.StaffId
      this.dataForm.DEGREE_NAME = row.DegreeName
      this.dataForm.BIRTHDAY = row.Birthday
      this.dataForm.IS_PRESCRIPTION = Number(row.IsPrescription)
      this.dataForm.IS_ANTIBIOTICS = Number(row.IsAntibiotics)
      this.dataForm.IS_ANTI_TUMOR = Number(row.IsAntiTumor)
      this.dataForm.INTRODUCTION = row.Summary
      this.dataForm.FIELD = row.Adept
      this.activeName = 'second'
      console.log(this.dataForm)
    },
    clearForm () {
      this.DepID = ''
      this.dataList = []
      this.dataFormHis = {}
      this.activeName = 'first'
      this.visible = false
      document.body.style['overflow-y'] = 'auto'
    }
  }
}
</script>
