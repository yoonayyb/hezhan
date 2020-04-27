<template>
  <el-dialog
    v-loading="loadStatus"
    :title="!FlagId? '新增':'编辑'"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="clearForm"
  >
    <el-form
      :model="dataForm"
      :rules="ruleForm"
      ref="form"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item
        :rules="{ required: true, message: '请选择医院'}"
        label="医院名称"
        prop="Business_orgname"
        style="width:60%;display:inline-block"
      >
        <el-input
          :readonly="true"
          v-model="dataForm.Business_orgname"
          :disabled="dataForm.Id?true:false"
        ></el-input>
      </el-form-item>
      <el-button v-if="!dataForm.Id?true:false" @click="ssjgClick" type="text">选择</el-button>

      <el-form-item
        label="档次类型"
        prop="Template_name"
        :rules="{ required: true, message: '请输入档次类型'}"
      >
        <!-- <el-input v-model="dataForm.Template_name" style="width:52%"></el-input> -->
        <el-select
          :disabled="dataForm.Id?true:false"
          @change="changeSelectType"
          style="width:52%"
          v-model="dataForm.Template_code"
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeList"
            :key="item.CODE"
            :label="item.NAME"
            :value="item.CODE"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="Business_id" :rules="{ required: true, message: '请选择业务类型'}">
        <el-select
          :disabled="dataForm.Id?true:false"
          @change="changeSelectBusiness"
          style="width:52%"
          v-model="dataForm.Business_id"
          placeholder="请选择"
        >
          <el-option
            v-for="item in businessList"
            :key="item.ID"
            :label="item.NAME"
            :value="item.ID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="Price" label="定价" :rules="{ required: true, message: '请输入定价'}">
        <el-input @change="changePrice" type="number" v-model="dataForm.Price" style="width:52%"></el-input>（元）
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clearForm">取 消</el-button>
      <el-button type="primary" @click="submitDateform">确 定</el-button>
    </span>

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
  </el-dialog>
</template>
<script>
export default {
  data () {
    var validataPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('定价不能为空'))
      }
      if (!Number.isFinite(value)) {
        return callback(new Error('定价必须为数值型'))
      } else {
        if (value < 0) {
          return callback(new Error('定价不成小于0'))
        }
        callback()
      }
    }
    return {
      loadStatus: false,
      FlagId: '',
      businessList: [],
      typeList: [],
      dataForm: {},
      dialogVisible: false,
      ssjgVisible: false,
      pageIndex: 1,
      pageSize: 20,
      keyword: '',
      ssjgLoading: false,
      ssjgDataList: [],
      totalPage: '',
      ruleForm: {
        Price: [{ required: true, validator: validataPrice, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init (_id) {
      this.dialogVisible = true
      this.getssjg()
      this.getBusinessList()
      this.getTypeList()
      if (_id) {
        this.getDetail(_id)
      } else {
        this.getDetail()
      }
    },
    getDetail (id) {
      this.loadStatus = true
      if (id) {
        this.FlagId = id
        this.$http({
          url: `/api/SysPricingTemplate/GetViewModel/` + id,
          method: 'GET',
          data: this.dataForm
        }).then(({ data }) => {
          this.loadStatus = false
          if (data) {
            this.$set(data, 'Price', data.Price.toFixed(2))
            const target = {}
            this.dataForm = Object.assign(target, data)
          }
        })
      } else {
        this.$http({
          url: `/api/SysPricingTemplate/GetViewModel/0`,
          method: 'GET',
          data: this.dataForm
        }).then(({ data }) => {
          this.loadStatus = false
          // console.log(data)
          const target = {}
          this.dataForm = Object.assign(target, data)
          this.$refs.form.resetFields()
        })
      }
    },
    // 获取业务列表
    getBusinessList () {
      this.$http({
        url: `/api/BaseDict/GetBusinesslistByType`,
        methods: 'GET'
      }).then(({ data }) => {
        // console.log(data)
        if (data) {
          let i = JSON.stringify(data)
          this.businessList = JSON.parse(i)
        }
      })
    },
    // 获取档次类型列表
    getTypeList () {
      this.$http({
        url: `/api/BaseDict/getlist`,
        methods: 'GET',
        params: {
          pageIndex: 1,
          pageSize: 999,
          keyword: '',
          typeid: '32fedfd7-abbe-4149-883f-ed94dd642fed',
          code: ''
        }
      }).then(({ data }) => {
        // console.log(data)
        if (data) {
          let i = JSON.stringify(data.pageList)
          this.typeList = JSON.parse(i)
        }
      })
    },
    ssjgClick () {
      this.ssjgVisible = true
      this.ssjgDivShow = false
      this.pageIndex = 1
      this.keyword = ''
      this.getssjg()
    },
    // 获取所属医院
    getssjg () {
      this.ssjgLoading = true
      this.$http({
        url: '/api/BaseOrg/Getlist',
        method: 'GET',
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword
        }
      }).then(({ data }) => {
        if (data) {
          this.ssjgDataList = data.pageList
          this.totalPage = data.totalCount
          this.ssjgDivShow = true
        }
        this.ssjgLoading = false
      })
    },
    ssjgCurrentChange (val) {
      this.pageIndex = val
      this.getssjg()
    },
    ssjgSelect (_id, _code, _name) {
      this.$set(this.dataForm, 'Business_orgid', _id)
      this.$set(this.dataForm, 'Business_orgname', _name)
      // this.dataForm.Business_orgid = _id
      // this.dataForm.Business_orgname = _name
      this.ssjgVisible = false
    },
    submitDateform () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.dataForm)
          const target = {}
          const upForm = Object.assign(target, this.dataForm)
          this.$set(upForm, 'Superior_percent', upForm.Superior_percent / 100)
          this.$set(
            upForm,
            'Subordinate_percent',
            upForm.Subordinate_percent / 100
          )
          this.$http({
            url: '/api/SysPricingTemplate/Save',
            method: 'POST',
            data: upForm
          }).then(({ data }) => {
            if (data.status == 0) {
              this.$message({
                message: '新增成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.clearForm()
                  this.$emit('refrashList', '')
                }
              })
            } else {
              this.$message({
                message: data.msg,
                type: 'error',
                duration: 1000
              })
            }
          })
        }
      })
    },
    changeSelectBusiness (val) {
      if (val) {
        let i = this.businessList.find(value => value.ID == val)
        this.dataForm.Business_name = i.NAME
        this.dataForm.Business_code = i.CODE
      }
    },
    changeSelectType (val) {
      if (val) {
        let i = this.typeList.find(value => value.CODE == val)
        this.dataForm.Template_name = i.NAME
        this.dataForm.Template_code = i.CODE
      }
    },
    changePrice (val) {
      if (val) {
        this.$set(this.dataForm, 'Price', Math.round(val * 100) / 100)
      }
    },
    clearForm () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

