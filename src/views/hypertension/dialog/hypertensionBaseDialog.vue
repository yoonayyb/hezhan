<template>
  <el-dialog
    title="高血压基础信息"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    width="600px"
    style="padding:10px 50px"
  >
    <el-form ref="form" label-position="right" :rules="rules" :model="detailForm" label-width="120px">
      <!-- <el-form-item label="日期">
    <el-input v-model="detailForm.sugar_time">
    </el-input>
      </el-form-item>-->
      <el-form-item prop="patient_name" label="患者姓名:">
        <el-input disabled v-model="detailForm.patient_name"></el-input>
      </el-form-item>
      <el-form-item prop="type_name" label="血压类型:">
        <el-input v-model="detailForm.type_name"></el-input>
      </el-form-item>
      <el-form-item prop="min_systolic_pressure" label="收缩压最低值:">
        <el-input v-model="detailForm.min_systolic_pressure"></el-input>
      </el-form-item>
      <el-form-item prop="max_systolic_pressure" label="收缩压最高值:">
        <el-input v-model="detailForm.max_systolic_pressure"></el-input>
      </el-form-item>
      <el-form-item prop="min_diastolic_pressure" label="舒张压最低值:">
        <el-input v-model="detailForm.min_diastolic_pressure"></el-input>
      </el-form-item>
      <el-form-item prop="max_diastolic_pressure" label="舒张压最高值:">
        <el-input v-model="detailForm.max_diastolic_pressure"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="!type" :disabled="disabled" type="primary" style="width:100px" @click="save">修改</el-button>
      <el-button v-if="type" :disabled="disabled" type="primary" style="width:100px" @click="save">添加</el-button>
      <el-button type="primary" style="width:100px" @click="closeModal">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as hypertension from "@/api/index";
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      detailForm: {},
      disabled: false,
      type: "",
      rules: {
        patient_name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        type_name: [
          { required: true, message: "请输入血压类型", trigger: "blur" }
        ],
        min_systolic_pressure: [
          { required: true, message: "请输入最低收缩压" },
          { pattern: /^\d+(\.\d)?$/, message: "请输入一位小数的数字类型" }
        ],
        max_systolic_pressure: [
          { required: true, message: "请输入最高收缩压" },
          { pattern: /^\d+(\.\d)?$/, message: "请输入一位小数的数字类型" }
        ],
        min_diastolic_pressure: [
          { required: true, message: "请输入最低舒张压" },
          { pattern: /^\d+(\.\d)?$/, message: "请输入一位小数的数字类型" }
        ],
        max_diastolic_pressure: [
          { required: true, message: "请输入最高舒张压" },
          { pattern: /^\d+(\.\d)?$/, message: "请输入一位小数的数字类型" }
        ]
      }
    };
  },
  methods: {
    getItemList(res, type = "") {
      console.log(res);
      switch (type) {
        case "hyperBase":
          this.$set(this.detailForm, "patient_name", res.name);
          this.detailForm.patient_id = res.id;
          this.type = "hyperBase";
          break;
        default:
          this.detailForm = res;
      }
    },
    save(res) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.disabled = true;
          hypertension
            .saveHypertensionBase(this.detailForm)
            .then(res => {
              this.disabled = false;
              if (res.data.status == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$emit("upload");
                this.$emit("close");
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(res => {
              this.disabled = false;
            });
        }
      });
    },
    closeModal() {
      this.detailForm = {};
      this.$refs.form.resetFields();
      this.$emit("close");
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/.el-dialog__body {
  padding: 30px 50px !important;
}
</style>
