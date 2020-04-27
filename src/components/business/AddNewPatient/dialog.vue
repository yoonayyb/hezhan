<template>
  <el-dialog title="新增病人"
             :visible.sync="dialogVisible"
             width="700px"
             :close-on-click-modal="false"
             @close="disableStatus=false">
    <patient-form ref="patientForm"
                  @patient="getPatient" />
    <span slot="footer"
          class="dialog-footer"
          style="text-align: center;">
      <el-button @click="submit"
                 :disabled="disableStatus"
                 type="primary">保存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PatientForm from '@/components/business/AddNewPatient/index'

export default {
  components: { PatientForm },
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    if (this.value) {
      this.dialogVisible = this.value
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  data () {
    return {
      dialogVisible: false,
      disableStatus: false
    }
  },
  methods: {
    submit () {
      this.disableStatus = true
      this.$refs.patientForm.dataFormSubmit().then((res) => {
        console.log(res)
      }).catch(() => {
        this.disableStatus = false
      })
    },
    getPatient (data) {
      this.dialogVisible = false
      this.$emit('patient', data)
    }
  }

}
</script>

<style>
</style>
