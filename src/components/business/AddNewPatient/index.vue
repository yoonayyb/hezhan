<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             label-width="120px"
             ref="dataForm"
             style="width:550px">
      <el-form-item label="姓名"
                    prop="PATIENT_NAME">
        <el-input :disabled="this.$route.params.ID && this.$route.params.ID != 0"
                  v-model="dataForm.PATIENT_NAME"></el-input>
      </el-form-item>

      <el-form-item label="性别"
                    prop="GENDER">
        <el-select :loading="DictGroup.gender.loading"
                   @change="(val)=>valueChange(val,'gender')"
                   @visible-change="(val)=>val?getGender():''"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.GENDER">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.gender.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="体重(KG)"
                    prop="WEIGHT">
        <el-input type="number"
                  v-model="dataForm.WEIGHT"
                  onmousewheel="return false;"
                  @onmousewheel="scrollFunc()"
                  @onDOMMouseScroll="scrollFunc()"></el-input>
      </el-form-item>

      <el-form-item label="身高(CM)"
                    prop="HEIGHT">
        <el-input type="number"
                  v-model="dataForm.HEIGHT"
                  onmousewheel="return false;"
                  @onmousewheel="scrollFunc()"
                  @onDOMMouseScroll="scrollFunc()"></el-input>
      </el-form-item>

      <el-form-item label="手机"
                    prop="MOBILE">
        <el-input v-model="dataForm.MOBILE"
                  type="number"
                  onmousewheel="return false;"
                  @onmousewheel="scrollFunc()"
                  @onDOMMouseScroll="scrollFunc()"></el-input>
      </el-form-item>

      <el-form-item label="家庭电话"
                    prop="TELEPHONE">
        <el-input v-model="dataForm.TELEPHONE"></el-input>
      </el-form-item>

      <el-form-item label="出生地"
                    prop="BIRTH_PLACE">
        <el-input v-model="dataForm.BIRTH_PLACE"></el-input>
      </el-form-item>

      <el-form-item label="国籍"
                    prop="NATIONALITY_ID">
        <el-select @change="(val)=>valueChange(val,'nationality')"
                   @visible-change="(val)=>val?getNationality():''"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.NATIONALITY_ID">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.nationality.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="省"
                    prop="ADDR_PROVINCE">
        <el-select @change="provChange"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.ADDR_PROVINCE">
          <el-option :key="item.ID"
                     :label="item.region_name"
                     :value="item.region_name"
                     v-for="item in provTypes"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="市"
                    prop="ADDR_CITY">
        <el-select @change="cityChange"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.ADDR_CITY">
          <el-option :key="item.region_name"
                     :label="item.region_name"
                     :value="item.region_name"
                     v-for="item in cityTypes"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="区/县"
                    prop="ADDR_COUNTY">
        <el-select placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.ADDR_COUNTY">
          <el-option :key="item.region_name"
                     :label="item.region_name"
                     :value="item.region_name"
                     v-for="item in countyTypes"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="现居住详细地址"
                    prop="ADDR_DETAILS">
        <el-input v-model="dataForm.ADDR_DETAILS"></el-input>
      </el-form-item>

      <el-form-item label="出生日期"
                    prop="BIRTH_DATE">
        <div class="block">
          <el-date-picker placeholder="选择日期"
                          style="width:100%;"
                          type="date"
                          v-model="dataForm.BIRTH_DATE"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="婚姻状况名称"
                    prop="MARRIAGE_STATUS_NAME">
        <el-select @change="(val)=>valueChange(val,'marriage')"
                   @visible-change="(val)=>val?getMarriage():''"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.MARRIAGE_STATUS_NAME">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.marriage.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="民族名称"
                    prop="NATION_ID">
        <el-select @change="(val)=>valueChange(val,'nation')"
                   @visible-change="(val)=>val?getNation():''"
                   placeholder="请选择..."
                   style="width:100%"
                   v-model="dataForm.NATION_ID">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.nation.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="职业名称"
                    prop="OCCUPATION_ID">
        <el-select @change="(val)=>valueChange(val,'occupation')"
                   @visible-change="(val)=>val?getOccupation():''"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.OCCUPATION_ID">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.occupation.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文化程度名称"
                    prop="EDUCATION_DEGREE_ID">
        <el-select @change="(val)=>valueChange(val,'culture')"
                   @visible-change="(val)=>val?getCulture():''"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.EDUCATION_DEGREE_ID">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.culture.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="工作单位名称"
                    prop="WORK_PLACE">
        <el-input v-model="dataForm.WORK_PLACE"></el-input>
      </el-form-item>

      <el-form-item label="电子邮件地址"
                    prop="EMAIL">
        <el-input v-model="dataForm.EMAIL"></el-input>
      </el-form-item>
      <el-form-item label="ABO血型名称"
                    prop="BLOOD_ABO_ID">
        <el-select @change="(val)=>valueChange(val,'blood')"
                   @visible-change="(val)=>val?getBlood():''"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.BLOOD_ABO_ID">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.blood.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="RH血型名称"
                    prop="BLOOD_RH_ID">
        <el-select @change="(val)=>valueChange(val,'RHBlood')"
                   @visible-change="(val)=>val?getRHBlood():''"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.BLOOD_RH_ID">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.RHBlood.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="医院名称"
                    prop="ORG_ID">
        <el-select @change="(val)=>valueChange(val,'org')"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.ORG_ID">
          <el-option :key="item.ID"
                     :label="item.ORG_NAME"
                     :value="item.ID"
                     v-for="item in DictGroup.org.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="医保类型"
                    prop="MEDICAL_INSURANCE_TYPE_ID">
        <el-select @change="(val)=>valueChange(val,'medicalInsurance')"
                   @visible-change="(val)=>val?getMedicalInsurance():''"
                   placeholder="请选择..."
                   style="width:100%;"
                   v-model="dataForm.MEDICAL_INSURANCE_TYPE">
          <el-option :key="item.ID"
                     :label="item.NAME"
                     :value="item.ID"
                     v-for="item  in DictGroup.medicalInsurance.list"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="医保号"
                    prop="MEDICAL_INSURANCE_NUM">
        <el-input v-model="dataForm.MEDICAL_INSURANCE_NUM"></el-input>
      </el-form-item>

      <el-form-item label="健康卡号"
                    prop="HEALTH_CARD_NUM">
        <el-input v-model="dataForm.HEALTH_CARD_NUM"></el-input>
      </el-form-item>

      <el-form-item label="身份证号"
                    prop="ID_NUMBER">
        <el-input :disabled="this.$route.params.ID != 0 && this.$route.params.ID"
                  v-model="dataForm.ID_NUMBER"></el-input>
      </el-form-item>

      <el-form-item label="联系人姓名"
                    prop="CONTACT_NAME">
        <el-input v-model="dataForm.CONTACT_NAME"></el-input>
      </el-form-item>

      <el-form-item label="联系人联系方式"
                    prop="CONTACT_PHONE">
        <el-input type="number"
                  onmousewheel="return false;"
                  @onmousewheel="scrollFunc()"
                  @onDOMMouseScroll="scrollFunc()"
                  v-model="dataForm.CONTACT_PHONE"></el-input>
      </el-form-item>

      <el-form-item label="联系人关系"
                    prop="CONTACT_RELATETIONSHIP">
        <el-input v-model="dataForm.CONTACT_RELATETIONSHIP"></el-input>
      </el-form-item>

      <el-form-item label="联系人地址"
                    prop="CONTACT_ADDRESS">
        <el-input v-model="dataForm.CONTACT_ADDRESS"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getBaseDict,
  getOrgList,
  getGenderDict,
  getMarriageDict,
  getNationDict,
  getCultureDict,
  getOccupationDict,
  getRHBloodDict,
  getMedicalInsuranceDict,
  getBloodDict,
  getNationalityDict
} from '@/api/index'

export default {
  props: {
    id: {
      type: String,
      default: '0'
    }
  },
  data () {
    const validateID_NUMBER = (rule, value, callback) => {
      const reg = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/
      const reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (value) {
        if (value.length == 15 || value.length == 18) {
          if (value.length == 18) {
            if (!reg1.test(value)) {
              callback(new Error('身份证格式不正确'))
            } else {
              callback()
            }
          } else if (value.length == 15) {
            if (!reg.test(value)) {
              callback(new Error('身份证格式不正确'))
            } else {
              callback()
            }
          }
        } else {
          callback(new Error('身份证长度不正确'))
        }
      } else {
        callback(new Error('身份证不能为空'))
      }
    }
    return {
      dataForm: {},
      isSave: false, // 防重复提交
      dataRule: {
        PATIENT_NAME: [
          // 病人
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        ORG_ID: [
          // 医院
          { required: true, message: '请选择医院', trigger: 'change' }
        ],
        MOBILE: [
          // 手机
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { max: 11, message: '手机号码不能超过11位', trigger: 'blur' },
          {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: '手机号码格式有误',
            trigger: 'blur'
          }
        ],
        ID_NUMBER: [
          // 身份证号
          {
            validator: validateID_NUMBER,
            trigger: 'blur'
          }
        ]
      },
      orgList: [],
      medicalInsuranceList: [],
      provTypes: [],
      cityTypes: [],
      countyTypes: [],

      mdeical: null,
      medicalRecordTypes: [],
      mdeicalList: [],

      // 字典组
      DictGroup: {
        // 性别
        gender: {
          list: [],
          loading: true
        },
        // 是否已婚
        marriage: {
          list: [],
          loading: true
        },
        // 民族名称
        nation: {
          list: [],
          loading: true
        },
        // 国籍
        nationality: {
          list: [],
          loading: true
        },
        // 文化程度名称
        culture: {
          list: [],
          loading: true
        },
        // 职业名称
        occupation: {
          list: [],
          loading: true
        },
        // RH血型名称
        RHBlood: {
          list: [],
          loading: true
        },
        // ABO血型名称
        blood: {
          list: [],
          loading: true
        },
        // 医院
        org: {
          list: [],
          loading: true
        },
        // 医保类型
        medicalInsurance: {
          list: [],
          loading: true
        }
      }
    }
  },
  created () {
    if (this.id && this.id !== '0') {
      this.getGender()
      this.getMarriage()
      this.getNation()
      this.getCulture()
      this.getOccupation()
      this.getRHBlood()
      this.getMedicalInsurance()
      this.getBlood()
      this.getNationality()
      this.getMedicalRecordType()
    }
    this.getProvince()
    this.getOrg()
    this.init(this.id)
  },
  methods: {
    doesDataExis (name) {
      if (this.DictGroup[name].list && this.DictGroup[name].list.length > 0) {
        return true
      } else {
        return false
      }
    },
    init (id) {
      this.$http({
        url: this.$http.adornUrl('/api/Patient/GetPatientViewModel/0'),
        method: 'get'
      })
        .then(res => {
          this.$nextTick(() => {
            this.$refs.dataForm.resetFields()
          })
          this.dataForm = JSON.parse(JSON.stringify(res.data.patient))
          if (id === '0') {
            this.dataForm.WEIGHT = ''
            this.dataForm.HEIGHT = ''
          }
        })
        .then(() => {
          if (id && id !== '0') {
            this.$http({
              url: `/api/Patient/GetPatientViewModel/${id}`,
              method: 'get'
            }).then(res => {
              this.dataForm = JSON.parse(JSON.stringify(res.data.patient))
            })
          }
        })
    },
    // 表单提交
    dataFormSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            let data = {
              patient: this.dataForm,
              mdeical: this.mdeical,
              mdeicalList: this.mdeicalList
            }
            this.isSave = true
            this.$http({
              url: `/api/Patient/SavePatient`,
              method: 'post',
              data: data
            }).then(({ data }) => {
              if (data && data.status === 0) {
                resolve()
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.isSave = false
                    // console.log(data)
                    this.$emit('patient', data)
                  }
                })
              } else {
                this.$message.error(data.msg)
                reject(data.msg)
              }
            })
          } else {
            reject(new Error('验证不通过'))
          }
        })
      })
    },
    getMedicalRecordType () {
      getBaseDict('c97ac0b9-a050-4dad-a92f-735c8833f43f').then(res => {
        this.medicalRecordTypes = res.data
      })
    },

    getMedicalRecord (obj) {
      this.mdeical = obj
    },
    // 获取性别
    getGender () {
      if (this.doesDataExis('gender')) {
        return false
      }
      getGenderDict().then(res => {
        this.DictGroup.gender.list = res.data.pageList
        this.DictGroup.gender.loading = false
        console.log(res)
      })
    },
    // 婚姻状态
    getMarriage () {
      if (this.doesDataExis('marriage')) {
        return false
      }
      getMarriageDict().then(res => {
        this.DictGroup.marriage.list = res.data.pageList
        this.DictGroup.marriage.loading = false
      })
    },
    // 职业
    getNation () {
      if (this.doesDataExis('nation')) {
        return false
      }
      getNationDict().then(res => {
        this.DictGroup.nation.list = res.data.pageList
        this.DictGroup.nation.loading = false
      })
    },
    // 文化程度
    getCulture () {
      if (this.doesDataExis('culture')) {
        return false
      }
      getCultureDict().then(res => {
        this.DictGroup.culture.list = res.data.pageList
        this.DictGroup.culture.loading = false
      })
    },
    // 职业
    getOccupation () {
      if (this.doesDataExis('occupation')) {
        return false
      }
      getOccupationDict().then(res => {
        this.DictGroup.occupation.list = res.data.pageList
        this.DictGroup.occupation.loading = false
      })
    },
    // RH血型
    getRHBlood () {
      if (this.doesDataExis('RHBlood')) {
        return false
      }
      getRHBloodDict().then(res => {
        this.DictGroup.RHBlood.list = res.data.pageList
        this.DictGroup.RHBlood.loading = false
      })
    },
    getBlood () {
      if (this.doesDataExis('blood')) {
        return false
      }
      getBloodDict().then(res => {
        this.DictGroup.blood.list = res.data.pageList
        this.DictGroup.blood.loading = false
      })
    },
    // 医保类型
    getMedicalInsurance () {
      if (this.doesDataExis('medicalInsurance')) {
        return false
      }
      getMedicalInsuranceDict().then(res => {
        this.DictGroup.medicalInsurance.list = res.data.pageList
        this.DictGroup.medicalInsurance.loading = false
      })
    },
    // 国籍
    getNationality () {
      if (this.doesDataExis('nationality')) {
        return false
      }
      getNationalityDict().then(res => {
        this.DictGroup.nationality.list = res.data.pageList
        this.DictGroup.nationality.loading = false
      })
    },
    // 医院
    getOrg () {
      if (this.doesDataExis('org')) {
        return false
      }
      getOrgList().then(res => {
        this.DictGroup.org.list = res.data.pageList
        this.DictGroup.org.loading = false
      })
    },
    valueChange (val, type) {
      if (type === 'gender') {
        let label = this.DictGroup.gender.list.find(item => {
          return val === item.ID
        })
        this.dataForm.GENDER = label.ID
        this.dataForm.GENDER_NAME = label.NAME
        return
      }
      if (type === 'marriage') {
        let label = this.DictGroup.marriage.list.find(item => {
          return val === item.ID
        })
        this.dataForm.MARRIAGE_STATUS = label.ID
        this.dataForm.MARRIAGE_STATUS_NAME = label.NAME
        return
      }
      if (type === 'nation') {
        let label = this.DictGroup.nation.list.find(item => {
          return val === item.ID
        })
        this.dataForm.NATION_NAME = label.NAME
        return
      }
      if (type === 'occupation') {
        let label = this.DictGroup.occupation.list.find(item => {
          return val === item.ID
        })
        this.dataForm.OCCUPATION_NAME = label.NAME
        return
      }
      if (type === 'culture') {
        let label = this.DictGroup.culture.list.find(item => {
          return val === item.ID
        })
        this.dataForm.EDUCATION_DEGREE_NAME = label.NAME
        return
      }
      if (type === 'blood') {
        let label = this.DictGroup.blood.list.find(item => {
          return val === item.ID
        })
        this.dataForm.BLOOD_ABO_NAME = label.NAME
        return
      }
      if (type === 'RHBlood') {
        let label = this.DictGroup.RHBlood.list.find(item => {
          return val === item.ID
        })
        this.dataForm.BLOOD_RH_NAME = label.NAME
        return
      }
      if (type === 'org') {
        this.DictGroup.org.list.forEach(item => {
          if (item.ID === val) {
            this.dataForm.ORG_NAME = item.ORG_NAME
          }
        })
        return
      }
      if (type === 'medicalInsurance') {
        let label = this.DictGroup.medicalInsurance.list.find(item => {
          return val === item.ID
        })
        this.dataForm.MEDICAL_INSURANCE_TYPE = label.NAME
        return
      }
      if (type === 'nationality') {
        let label = this.DictGroup.nationality.list.find(item => {
          return val === item.ID
        })
        this.dataForm.NATIONALITY_NAME = label.NAME
      }
    },
    // 省市县
    getProvince () {
      this.$http({
        url: this.$http.adornUrl('/api/BaseDict/GetListArea'),
        method: 'GET',
        params: { parentid: 0 }
      }).then(({ data }) => {
        if (data) {
          this.provTypes = data
        }
      })
    },
    provChange (val) {
      let obj = {}
      obj = this.provTypes.find(item => {
        return item.region_name === val
      })
      this.dataForm.ADDR_CITY = ''
      this.dataForm.ADDR_COUNTY = ''
      this.cityTypes = []
      this.countyTypes = []
      this.$http({
        url: this.$http.adornUrl('/api/BaseDict/GetListArea'),
        method: 'GET',
        params: { parentid: obj.region_id }
      }).then(({ data }) => {
        if (data) {
          this.cityTypes = data
        }
      })
    },
    cityChange (val) {
      let obj = {}
      obj = this.cityTypes.find(item => {
        return item.region_name === val
      })
      this.dataForm.ADDR_COUNTY = ''
      this.countyTypes = []
      this.$http({
        url: this.$http.adornUrl('/api/BaseDict/GetListArea'),
        method: 'GET',
        params: { parentid: obj.region_id }
      }).then(({ data }) => {
        if (data) {
          this.countyTypes = data
        }
      })
    }
  }
}
</script>
