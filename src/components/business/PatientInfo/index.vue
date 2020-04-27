<template>
  <div v-loading='loadStatus'>
    <table class="cus-table">
      <tr>
        <td class="header">患者姓名</td>
        <td>{{data.PATIENT_NAME }}</td>
        <td class="header">性别</td>
        <td>{{ data.GENDER_NAME }}</td>
      </tr>
      <tr>
        <td class="header">年龄</td>
        <td>{{data.AGE==0?'-':data.AGE }}</td>
        <td class="header">身高（cm）</td>
        <td>{{ data.HEIGHT==0?'-':data.HEIGHT}}</td>
      </tr>
      <tr>
        <td class="header">体重（kg）</td>
        <td>{{ data.WEIGHT?data.WEIGHT:'-' }}</td>
        <td class="header">出生日期</td>
        <td>{{ data.BIRTH_DATE? data.BIRTH_DATE.split('T')[0]:'' }}</td>
      </tr>
      <tr>
        <td class="header">证件类型</td>
        <td>身份证</td>
        <td class="header">证件号码</td>
        <td>{{data.ID_NUMBER}}</td>
      </tr>
      <tr>
        <td class="header">国籍</td>
        <td>{{ data.NATIONALITY_NAME}}</td>
        <td class="header">民族</td>
        <td>{{ data.NATION_NAME }}</td>
      </tr>
      <tr>
        <td class="header">工作单位</td>
        <td>{{ data.WORK_PLACE }}</td>
        <td class="header">职业</td>
        <td>{{ data.OCCUPATION_NAME }}</td>
      </tr>
      <tr>
        <td class="header">联系方式</td>
        <td>{{ data.TELEPHONE }}</td>
        <td class="header">家庭住址</td>
        <td>{{ data.ADDR_DETAILS }}</td>
      </tr>
      <tr>
        <td class="header">医保类型</td>
        <td>{{ data.MEDICAL_INSURANCE_TYPE }}</td>
        <td class="header">医保卡号</td>
        <td>{{ data.MEDICAL_INSURANCE_NUM}}</td>
      </tr>
      <tr>
        <td class="header">健康卡号</td>
        <td>{{data.HEALTH_CARD_NUM }}</td>
        <td class="header">婚姻状态</td>
        <td>{{ data.MARRIAGE_STATUS_NAME }}</td>
      </tr>
      <!-- <tr>
        <td class="header">患者知情同意书</td>
        <td
          class="file-td"
          colspan="3"
        >
          <div v-if="patientInfoAtt&&patientInfoAtt.length>0">
            <div
              :key="index"
              @click="toFileHref(file)"
              class="file"
              v-for="(file,index) in patientInfoAtt"
            >{{file.name}}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="header">其他附件</td>

        <td
          class="file-td"
          colspan="3"
        >
          <div v-if="otherAtt&&otherAtt.length>0">
            <div
              :key="index"
              @click="toFileHref(file)"
              class="file"
              v-for="(file,index) in otherAtt"
            >{{file.name}}</div>
          </div>

        </td>
      </tr> -->
    </table>

    <el-dialog
      :title="img.name"
      :visible.sync="dialogVisible"
      style="text-align:center"
      width="50%"
    >
      <img
        :src="baseURL+img.path"
        style="max-width:100%"
      >
    </el-dialog>
  </div>
</template>

<script>
import { loadFileByBizTypeId } from '@/api/index'
export default {
  data () {
    return {
      data: {},
      baseURL: window.SITE_CONFIG['baseUrl'],
      patientInfoAtt: [],
      otherAtt: [],
      dialogVisible: false,
      img: {},
      loadStatus: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.loadStatus = true
      this.$http({
        url: this.$http.adornUrl('/api/Patient/GetViewModel/' + this.$route.params.PatiendId),
        method: 'GET'
      }).then(({ data }) => {
        this.loadStatus = false
        this.data = data
        // this.getPatientInfoAtt()
      })
    },
    // 获取患者知情同意书
    getPatientInfoAtt () {
      loadFileByBizTypeId(this.$route.params.ID).then(res => {
        const flies = res.data.data
        flies.find(item => {
          if (item.FileTypeId === 'a0fd0dfe-0fe8-40a6-a1c4-dbefa5141642') {
            this.patientInfoAtt.push({
              name: item.Name,
              path: item.Path
            })
          }
          if (item.FileTypeId === 'c1fb8d23-2227-455d-b6cc-b0be3db84503') {
            this.otherAtt.push({
              name: item.Name,
              path: item.Path
            })
          }
        })
      })
    },
    toFileHref (file) {
      const reg = /^(\s|\S)+(jpg|png|bmp|JPG|PNG)+$/
      if (reg.test(file.path)) {
        this.dialogVisible = true
        this.img = file
      } else {
        window.open(this.baseURL + file.path)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cus-table {
  margin-top: 20px;
  width: 100%;
  td {
    border: 1px solid #e5e5e5;
    font-weight: 500;
    text-align: left;
  }
  .header {
    text-align: left;
    width: 140px !important;
    font-weight: normal;
  }
}
.file-td {
  .file {
    color: #5599ff;
    display: block;
    padding: 5px 0;
    cursor: pointer;
    &:hover {
      color: #66b1ff;
      border-color: transparent;
      background-color: transparent;
    }
  }
}
</style>
