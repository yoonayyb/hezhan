<template>
  <div>
    <PatientForm :id="this.$route.params.ID" ref="patientForm"></PatientForm>
    <div style="width:200px;margin-left:70px">
      <!-- <el-button :disabled="disableStatus" class="fr" @click="toHis" type="success">HIS导入</el-button> -->
      <el-button :disabled="disableStatus" @click="submit" type="primary">保存</el-button>
      <div class="clear"></div>
    </div>
    <!-- <addHisPatient ref="addHisPatient"></addHisPatient> -->
  </div>
</template>

<script>
import PatientForm from '@/components/business/AddNewPatient/index'
import addHisPatient from '@/components/business/AddNewPatient/addHisPatient'

export default {
  components: { PatientForm, addHisPatient },
  data () {
    return {
      disableStatus: false
    }
  },
  methods: {
    submit () {
      this.disableStatus = true
      this.$refs.patientForm.dataFormSubmit().then(res => {
        this.$store.commit('DEL_VISITED_VIEW', this.$route)
        this.$router.go(-1)
        this.disableStatus = false
      })
    },
    toHis () {
      this.$refs.addHisPatient.init()
    }
  }
}
</script>
