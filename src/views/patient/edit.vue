<template>
  <div>
    <h4>患者姓名：{{this.$route.query.name}}</h4>

    <el-tabs
      @tab-click="handleClick"
      type="border-card"
      v-model="activeName2"
    >
      <el-tab-pane
        label="患者病历"
        name="second"
      >
        <el-form
          :model="dataForm"
          label-width="130px"
          ref="dataForm"
        >
          <el-form-item
            label="病历类型"
            prop="TIMES"
          >
            <el-select
              @change="typeChange"
              placeholder="请选择病历类型"
              v-model="type"
            >
              <el-option
                :value="0"
                label="出院记录"
              ></el-option>
              <el-option
                :value="1"
                label="入院病历"
              ></el-option>
              <el-option
                :value="2"
                label="病程记录"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <leave v-if="type===0"></leave>
        <goIn v-if="type===1"></goIn>
        <courseDisease v-if="type===2"></courseDisease>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// import leave from './component/medicalRecord/leave.vue'
// import goIn from './component/medicalRecord/goIn.vue'
// import courseDisease from './component/medicalRecord/courseDisease.vue'

export default {
  data () {
    return {
      activeName2: 'second',
      medicalRecordTypes: [],
      type: 0,
      dataForm: {}
    }
  },
  components: {
   // leave,
   // goIn,
   // courseDisease
  },
  created () {
    this.getMedicalRecordType()
  },

  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    getMedicalRecordType () {
      // getBaseDict('c97ac0b9-a050-4dad-a92f-735c8833f43f').then(res => {
      //   this.medicalRecordTypes = res.data
      // })
    },
    typeChange (val) { }
  }
}
</script>
