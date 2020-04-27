<template>
  <el-dialog :close-on-click-modal="false" :title="!dataForm.ID ? '新增' : '修改'" :visible.sync="visible">
    <el-form :model="dataForm" label-width="100px" ref="dataForm">
      <el-form-item
        label="编号"
        prop="Code"
        style="width:60%;"
        :rules="[{ required: true, message: '请填写编号', trigger: 'blur'}]"
      >
        <el-input v-model="dataForm.Code"></el-input>
      </el-form-item>
      <el-form-item
        label="名称"
        prop="Name"
        style="width:60%;"
        :rules="[{ required: true, message: '请填写名称', trigger: 'blur'}]"
      >
        <el-input v-model="dataForm.Name"></el-input>
      </el-form-item>
      <el-form-item label="父级" prop="ParentName" style="width:60%;">
        <el-select placeholder="请选择" v-model="dataForm.ParentName" clearable @change="parentChange" style="width:100%">
          <el-option :key="item.ID" :label="item.NAME" :value="item.ID" v-for="item in baseDictTypeList"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary" :loading="submitButtonLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {},
      baseDictTypeList: [],
      submitButtonLoading: false
    };
  },
  created() {
    this.getBaseDictType();
  },
  methods: {
    init(id) {
      if (id) {
        this.$nextTick(res => {
          this.$http({
            url: `/api/baseDictType/GetViewModel`,
            method: "get",
            params: { id }
          }).then(({ data }) => {
            this.visible = true;
            this.dataForm = data.data;
            this.dataForm.ID = id;
          });
        });
      } else {
        this.visible = true;
        this.dataForm = {};
      }

      // console.log(id);
      // this.dataForm.ID = id || 0;
      // this.$http({
      //   url: this.$http.adornUrl("/api/baseDictType/GetViewModel/0"),
      //   method: "get",
      //   params: this.$http.adornParams()
      // })
      //   .then(({ data }) => {
      //     this.dataForm = data;
      //     console.log(this.dataForm);
      //   })
      //   .then(() => {
      //     this.visible = true;
      //     this.$nextTick(() => {
      //       this.$refs["dataForm"].resetFields();
      //     });
      //   })
      //   .then(() => {
      //     if (id) {
      //       this.dataForm.ID = id;
      //       this.$http({
      //         url: this.$http.adornUrl(
      //           `/api/baseDictType/GetViewModel/${this.dataForm.ID}`
      //         ),
      //         method: "get",
      //         params: this.$http.adornParams()
      //       }).then(({ data }) => {
      //         this.dataForm = data;
      //       });
      //     }
      //   });
    },
    getBaseDictType() {
      this.$http({
        url: this.$http.adornUrl("/api/baseDictType/getlist"),
        method: "GET",
        params: {
          pageSize: 999999
        }
      }).then(({ data }) => {
        if (data) {
          this.baseDictTypeList = data.pageList;
        } else {
          this.baseDictTypeList = [];
        }
      });
    },
    parentChange(val) {
      let label = this.baseDictTypeList.find(item => {
        return item.ID === val;
      });

      this.dataForm.ParentName = label.NAME;
      console.log(val, label, this.dataForm);
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true;
          this.$http({
            url: this.$http.adornUrl(`/api/baseDictType/save`),
            method: "post",
            data: this.$http.adornData(this.dataForm)
          })
            .then(({ data }) => {
              if (data && data.status === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.submitButtonLoading = false;

                    this.$emit("refreshDataList");
                  }
                });
              } else {
                this.$message.error(data.msg);
                this.submitButtonLoading = false;
              }
            })
            .catch(() => {
              this.submitButtonLoading = false;
            });
        }
      });
    }
  }
};
</script>
