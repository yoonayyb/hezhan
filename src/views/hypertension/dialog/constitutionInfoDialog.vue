<template>
  <el-dialog
    title="体质指数信息"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    width="600px"
    style="padding:10px 50px"
  >
    <el-form ref="form" label-position="right" :rules="rules" :model="detailForm" label-width="120px">
      <el-form-item prop="patient_name" label="患者姓名:">
        <div v-if="!type">{{detailForm.patient_name}}</div>
        <el-input disabled v-else v-model="detailForm.patient_name"></el-input>
      </el-form-item>
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
      <el-form-item prop="height" label="身高:">
        <el-input v-model="detailForm.height">
          <div slot="suffix">cm</div>
        </el-input>
      </el-form-item>
      <el-form-item prop="weight" label="体重:">
        <el-input v-model="detailForm.weight">
          <div slot="suffix">kg</div>
        </el-input>
      </el-form-item>
      <el-form-item prop="bmi" label="体质指数值:">
        <el-input disabled v-model="detailForm.bmi"></el-input>
      </el-form-item>
      <el-form-item prop="remarks" label="备注:">
        <el-input v-model="detailForm.remarks"></el-input>
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
        screen_time: [
          { required: true, message: "请输入日期", trigger: "blur" }
        ],
        patient_name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        height: [
          { required: true, message: "请输入身高" },
          {
            pattern: /^(0?|([1-9]+\d*))(\.\d)?$/,
            message: "请输入保留一位小数的正确数值"
          }
        ],
        weight: [
          { required: true, message: "请输入体重" },
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
  watch: {
    "detailForm.height": {
      deep: true,
      handler(a, b) {
        let typeNumber = Number(
          (
            Number(this.detailForm.weight) /
            Math.pow(Number(this.detailForm.height) / 100, 2)
          ).toFixed(1)
        );
        let valueBMI = isNaN(typeNumber)
          ? ""
          : isFinite(typeNumber) && typeNumber == 0
            ? ""
            : typeNumber;
        this.$set(this.detailForm, "bmi", valueBMI);
      }
    },
    "detailForm.weight": {
      deep: true,
      handler(a, b) {
        let typeNumber = Number(
          (
            Number(this.detailForm.weight) /
            Math.pow(Number(this.detailForm.height) / 100, 2)
          ).toFixed(1)
        );
        let valueBMI = isNaN(typeNumber)
          ? ""
          : isFinite(typeNumber) && typeNumber == 0
            ? ""
            : typeNumber;
        this.$set(this.detailForm, "bmi", valueBMI);
      }
    }
  },
  methods: {
    getItemList(res, type) {
      console.log(res);
      switch (type) {
        case "const":
          this.$set(this.detailForm, "patient_name", res.name);
          this.detailForm.patient_id = res.id;
          this.type = "const";
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
          this.detailForm.bmi = this.detailForm.bmi.toString();
          hypertension
            .saveConstitutionInfo(this.detailForm)
            .then(res => {
              console.log(res);
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
