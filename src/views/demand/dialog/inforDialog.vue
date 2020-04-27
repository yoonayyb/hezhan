<template>
  <el-dialog
    title="添加需求"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    width="600px"
    style="padding:10px 50px"
  >
    <el-form ref="form" :rules="rules" :model="detailForm" label-width="100px">
      <el-form-item prop="patient_name" label="患者姓名:">
        <div v-if="!type">{{detailForm.patient_name}}</div>
        <el-input v-else disabled v-model="detailForm.patient_name"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="sugar_type_name" label="血糖类型:">
        <div v-if="!type">{{detailForm.sugar_type_name}}</div>
        <el-input v-else v-model="detailForm.sugar_type_name"></el-input>
      </el-form-item>-->

      <el-form-item prop="sugar_time" label="日期:">
        <el-date-picker
          style="width:100%"
          v-model="detailForm.sugar_time"
          type="datetime"
          :picker-options="pickerOptions0"
          format="yyyy-MM-dd HH:mm"
          placeholder="日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="sugar_type" label="具体时段:">
        <el-select style="width:100%" clearable v-model="detailForm.sugar_type" placeholder="请选择具体时段">
          <el-option v-for="item in typeArr" :key="item.value" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sugar" label="血糖值:">
        <el-input v-model="detailForm.sugar"></el-input>
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
import { addBaseInformation } from "@/api/modules/manbing.js";
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
        sugar_time: [
          { required: true, message: "请输入日期", trigger: "blur" }
        ],
        patient_name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        sugar_type: [
          { required: true, message: "请输入具体时段", trigger: "blur" }
        ],
        sugar_type_name: [
          { required: true, message: "请输入血糖类型", trigger: "blur" }
        ],
        sugar: [
          { required: true, message: "请输入血糖值" },
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
  computed: {
    typeArr() {
      return this.$store.state.common.typeArr;
    }
  },
  methods: {
    getItemList(res, type = "") {
      console.log(res);
      switch (type) {
        case "info":
          this.$set(this.detailForm, "patient_name", res.name);
          this.detailForm.patient_id = res.id;
          this.type = "info";
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
          this.detailForm.sugar_time = this.$moment(
            this.detailForm.sugar_time
          ).format("YYYY-MM-DD HH:mm:ss"); //转日期格式
          addBaseInformation(this.detailForm)
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
                this.$message.error(res.msg);
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
