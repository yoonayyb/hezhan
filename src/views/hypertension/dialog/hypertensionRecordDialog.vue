<template>
  <el-dialog
    title="血压记录信息"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    width="600px"
    style="padding:10px 50px"
  >
    <el-form ref="form" :rules="rules" label-position="right" :model="detailForm" label-width="120px">
      <el-form-item prop="patient_name" label="患者姓名:">
        <div v-if="!type">{{detailForm.patient_name}}</div>
        <el-input disabled v-else v-model="detailForm.patient_name"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="type_name" label="血压类型:">
        <div v-if="!type">{{detailForm.type_name}}</div>
        <el-input v-else v-model="detailForm.type_name"></el-input>
      </el-form-item>-->

      <el-form-item prop="screen_time" label="日期:">
        <el-date-picker
          style="width:100%"
          v-model="detailForm.screen_time"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions0"
          placeholder="日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="systolic_pressure" label="收缩压:">
        <el-input v-model="detailForm.systolic_pressure"></el-input>
      </el-form-item>
      <el-form-item prop="diastolic_pressure" label="舒张压:">
        <el-input v-model="detailForm.diastolic_pressure"></el-input>
      </el-form-item>
      <el-form-item prop="pulse" label="脉搏:">
        <el-input v-model="detailForm.pulse"></el-input>
      </el-form-item>
      <el-form-item prop="remarks" label="备注:">
        <el-input v-model="detailForm.remarks"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="!type" type="primary" :disabled="disabled" style="width:100px" @click="save">修改</el-button>
      <el-button v-if="type" type="primary" :disabled="disabled" style="width:100px" @click="save">添加</el-button>
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
      type: "",
      disabled: false,
      rules: {
        screen_time: [
          { required: true, message: "请输入日期", trigger: "blur" }
        ],
        patient_name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        type_name: [
          { required: true, message: "请输入血压类型", trigger: "blur" }
        ],
        systolic_pressure: [
          { required: true, message: "请输入收缩压" },
          {
            pattern: /^(0?|([1-9]+\d*))(\.\d)?$/,
            message: "请输入保留一位小数的正确数值"
          }
        ],
        diastolic_pressure: [
          { required: true, message: "请输入舒张压" },
          {
            pattern: /^(0?|([1-9]+\d*))(\.\d)?$/,
            message: "请输入保留一位小数的正确数值"
          }
        ],
        pulse: [
          { required: true, message: "请输入脉搏" },
          {
            pattern: /^(0?|([1-9]+\d*))(\.\d)?$/,
            message: "请输入保留一位小数的正确数值"
          }
        ]
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    getItemList(res, type) {
      console.log(res);
      switch (type) {
        case "hyperRecord":
          this.$set(this.detailForm, "patient_name", res.name);
          this.detailForm.patient_id = res.id;
          this.type = "hyperRecord";
          break;
        default:
          this.detailForm = res;
      }
    },
    closeModal() {
      this.detailForm = {};
      this.$refs.form.resetFields();
      this.$emit("close");
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.disabled = true;
          this.detailForm.screen_time = this.$moment(
            this.detailForm.screen_time
          ).format("YYYY-MM-DD HH:mm:ss"); //转日期格式
          hypertension
            .saveHypertensionRecord(this.detailForm)
            .then(res => {
              this.disabled = false;
              if (res.data.status == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$emit("upload");
                this.$emit("close");
              } else if (res.data.status == 2) {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(res => {
              this.disabled = false;
            });
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/.el-dialog__body {
  padding: 30px 50px !important;
}
</style>
