<template>
  <el-dialog
    v-loading="loadStatus"
    :title="!flagId? '新增': '编辑'"
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
       
        label="上级医院名称"
        prop="Business_orgname"
        style="width:60%;display:inline-block"
      >
        <el-input
          :readonly="true"
          :disabled="dataForm.Id?true:false"
          v-model="dataForm.Business_orgname"
        ></el-input>
      </el-form-item>
      <el-button v-if="!dataForm.Id?true:false" @click="ssjgClick" type="text">选择</el-button>

      <el-form-item label="业务模块" :rules="{ required: true, message: '请选择医院'}" prop="Business_id">
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

      <el-form-item label="价格模板" :rules="{ required: true, message: '请价格模板'}" prop="PRICING_ID">
        <el-select
          @change="changeSelectTemplate"
          style="width:52%"
          v-model="dataForm.PRICING_ID"
          placeholder="请选择"
        >
          <el-option
            v-for="item in priceTemplteList"
            :key="item.Id"
            :label="item.Template_name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
    
        label="下级医院名称"
        prop="sub_orgname"
        style="width:60%;display:inline-block"
      >
        <el-input
          :readonly="true"
          v-model="dataForm.sub_orgname"
          :disabled="dataForm.Id?true:false"
        ></el-input>
      </el-form-item>
      <el-button v-if="!dataForm.Id?true:false" @click="xjjgClick" type="text">选择</el-button>

      <!-- <el-form-item label="分成名称" prop="Name" :rules="{ required: true, message: '请输入分成名称'}">
        <el-input v-model="dataForm.Name" style="width:52%"></el-input>
      </el-form-item>-->
      <el-form-item label="上级分成" prop="Superior_percent">
        <el-input
          @change="superiorChange"
          v-model.number="dataForm.Superior_percent"
          type="number"
          style="width:52%"
        ></el-input>%
      </el-form-item>
      <el-form-item label="下级分成" prop="Subordinate_percent">
        <el-input
          @change="subordinateChange"
          v-model.number="dataForm.Subordinate_percent"
          type="number"
          style="width:52%"
        ></el-input>%
      </el-form-item>
      <!-- <el-form-item> -->
      <!-- <el-button type="primary" @click="submitForm('form')">提交保存</!-->
      <!-- <el-button @click="resetForm('form')">重置</el-button> -->
      <!-- </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clearForm">取 消</el-button>
      <el-button type="primary" @click="submitDateform">确 定</el-button>
    </span>
    <el-dialog :visible.sync="ssjgVisible" append-to-body title="选择医院" width="600px">
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
              v-if="flag == '1'"
              @click="ssjgSelect(scope.row.ID,scope.row.ORG_CODE,scope.row.ORG_NAME)"
              size="small"
              type="text"
            >选择</el-button>
            <el-button
              v-if="flag == '2'"
              @click="xjjgSelect(scope.row.ID,scope.row.ORG_CODE,scope.row.ORG_NAME)"
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
    var validataPercent = (rule, value, callback) => {
      if (!String(value)) {
        return callback(new Error('分成不能为空'))
      }
      if (value < 0) {
        return callback(new Error('分成不能小于0'))
      }
      if (!Number.isFinite(value)) {
        return callback(new Error('分成必须为数值型'))
      } else {
        if (value > 100) {
          return callback(new Error('分成不成超过100'))
        }
        callback()
      }
    }
    var validataOrg = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择一家医院'))
      }
      // console.log(this.dataForm.Business_orgid == this.dataForm.sub_orgid)
      if (this.dataForm.Business_orgid == this.dataForm.sub_orgid) {
        return callback(new Error('上下级不能为同一家医院'))
      }
      callback()
    }
    return {
      loadStatus: false,
      flagId: '',
      flag: '1', // 上下级医院的判断标识 1为上级 2为下级
      businessList: [],
      dataForm: {},
      dialogVisible: false,
      ssjgVisible: false,
      pageIndex: 1,
      pageSize: 20,
      keyword: '',
      ssjgLoading: false,
      ssjgDataList: [],
      totalPage: '',
      priceTemplteList: [],
      ruleForm: {
        Superior_percent: [
          { required: true, validator: validataPercent, trigger: 'change' }
        ],
        Subordinate_percent: [
          { required: true, validator: validataPercent, trigger: 'change' }
        ],
        Business_orgname: [
          { required: true, validator: validataOrg, trigger: 'change' }
        ],
        sub_orgname: [
          { required: true, validator: validataOrg, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init (_id) {
      this.dialogVisible = true
      this.getssjg()
      this.getBusinessList()
      if (_id) {
        this.getDetail(_id)
      } else {
        this.getDetail()
      }
    },
    getDetail (id) {
      this.loadStatus = true
      if (id) {
        this.flagId = id
        this.$http({
          url: `/api/SysPricing/GetViewModel/` + id,
          method: 'GET',
          data: this.dataForm
        }).then(({ data }) => {
          if (data) {
            this.loadStatus = false
            this.$set(
              data,
              'Subordinate_percent',
              Math.round(Number(data.Subordinate_percent) * 10000) / 100
            )
            this.$set(
              data,
              'Superior_percent',
              Math.round(Number(data.Superior_percent) * 10000) / 100
            )
            const target = {}
            this.dataForm = Object.assign(target, data)
            this.getPriceTemplate()
          }
        })
      } else {
        this.$http({
          url: `/api/SysPricing/GetViewModel/0`,
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
    // 上级医院
    ssjgClick () {
      this.ssjgVisible = true
      this.ssjgDivShow = false
      this.pageIndex = 1
      this.flag = '1'
      this.keyword = ''
      this.getssjg()
    },
    // 下级医院
    xjjgClick () {
      this.ssjgVisible = true
      this.ssjgDivShow = false
      this.pageIndex = 1
      this.flag = '2'
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
          pageIndex: 1,
          pageSize: 999,
          keyword: this.keyword
        }
      }).then(({ data }) => {
        if (data) {
          // let i = {}
          // data.pageList = Object.assign(i, data.pageList)
          // data.pageList.forEach((element, index) => {
          //   // console.log(index)
          //   if (this.dataForm.Business_orgid == element.ID) {
          //     data.pageList.splice(index, 1)
          //   } else if (this.dataForm.sub_orgid == element.ID) {
          //     data.pageList.splice(index, 1)
          //   }
          // })
          this.ssjgDataList = data.pageList
          this.totalPage = data.totalCount
          this.ssjgDivShow = true
        }
        this.ssjgLoading = false
      })
    },
    // 获取价格模板
    getPriceTemplate () {
      this.ssjgLoading = true
      this.$http({
        url: '/api/SysPricingTemplate/GetPricingTMPListByBusinessCode',
        method: 'GET',
        params: {
          businessCode: this.dataForm.Business_code,
          orgID: this.dataForm.Business_orgid
        }
      }).then(({ data }) => {
        if (data) {
          this.priceTemplteList = data.pageList
        }
        this.ssjgLoading = false
      })
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
    ssjgCurrentChange (val) {
      this.pageIndex = val
      this.getssjg()
    },
    ssjgSelect (_id, _code, _name) {
      this.$set(this.dataForm, 'Business_orgid', _id)
      this.$set(this.dataForm, 'Business_orgname', _name)
      if (this.dataForm.sub_orgid) {
        this.$refs.form.validateField(['sub_orgname'])
      }
      if (this.dataForm.Name) {
        this.$set(this.dataForm, 'Name', '')
        this.$set(this.dataForm, 'PRICING_ID', '')
        this.$refs.form.clearValidate(['PRICING_ID'])
      }
      if (this.dataForm.Business_code) {
        this.getPriceTemplate()
      }
      // this.dataForm.Business_orgid = _id
      // this.dataForm.Business_orgname = _name
      this.ssjgVisible = false
    },
    xjjgSelect (_id, _code, _name) {
      this.$set(this.dataForm, 'sub_orgid', _id)
      this.$set(this.dataForm, 'sub_orgname', _name)
      if (this.dataForm.Business_orgid) {
        this.$refs.form.validateField(['Business_orgname'])
      }
      // this.dataForm.Business_orgid = _id
      // this.dataForm.Business_orgname = _name
      this.ssjgVisible = false
    },
    submitDateform () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.dataForm)
          // this.$set(this.dataFormUp, 'Superior_percent', this.dataForm.Superior_percent / 100)
          // this.$set(this.dataFormUp, 'Subordinate_percent', this.dataForm.Subordinate_percent / 100)
          // this.$set(this.dataFormUp, 'Business_orgid', this.dataForm.Business_orgid)
          // this.$set(this.dataFormUp, 'Business_orgname', this.dataForm.Business_orgname)
          // this.$set(this.dataFormUp, 'Name', this.dataForm.Name)
          const target = {}
          const upForm = Object.assign(target, this.dataForm)
          this.$set(upForm, 'Superior_percent', upForm.Superior_percent / 100)
          this.$set(
            upForm,
            'Subordinate_percent',
            upForm.Subordinate_percent / 100
          )
          this.$http({
            url: '/api/SysPricing/Save',
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
    // 上级分成
    superiorChange (val) {
      if (val <= 100) {
        this.$set(
          this.dataForm,
          'Subordinate_percent',
          Math.round((100 - val) * 100) / 100
        )
        this.$set(
          this.dataForm,
          'Superior_percent',
          Math.round(val * 100) / 100
        )
      }
    },
    // 下级分成
    subordinateChange (val) {
      if (val <= 100) {
        this.$set(
          this.dataForm,
          'Superior_percent',
          Math.round((100 - val) * 100) / 100
        )
        this.$set(
          this.dataForm,
          'Subordinate_percent',
          Math.round(val * 100) / 100
        )
      }
      console.log(this.dataForm)
    },
    clearForm () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    changeSelectBusiness (val) {
      if (val) {
        let i = this.businessList.find(value => value.ID == val)
        this.dataForm.Business_name = i.NAME
        this.dataForm.Business_code = i.CODE
      }
      this.$set(this.dataForm, 'Name', '')
      this.$set(this.dataForm, 'PRICING_ID', '')
      this.$refs.form.clearValidate(['PRICING_ID'])
      if (this.dataForm.Business_orgid) {
        this.getPriceTemplate()
      }
    },
    changeSelectTemplate (val) {
      if (val) {
        let i = this.priceTemplteList.find(value => value.Id == val)
        console.log(i)
        this.$set(this.dataForm, 'Name', i.Template_name)
        this.$set(this.dataForm, 'PRICING_ID', i.Id)
        this.$set(this.dataForm, 'Business_orgid', i.Business_orgid)
        this.$set(this.dataForm, 'Business_orgname', i.Business_orgname)
      }
    }
  }
}
</script>

