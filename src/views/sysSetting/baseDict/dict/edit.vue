<template>
  <el-dialog :close-on-click-modal="false" :title="!dataForm.ID ? '新增' : '修改'" :visible.sync="visible">
    <el-form :model="dataForm" label-width="100px" ref="dataForm" style="width:500px">
      <el-form-item label="名称" prop="Name" :rules="{ required: true, message: '请填写名称', trigger: 'blur'}">
        <el-input v-model="dataForm.Name"></el-input>
      </el-form-item>
      <el-form-item label="父级类型" prop="TypeId" :rules="{ required: true, message: '请选择类型', trigger: 'blur'}">
        <el-select @change="typeChange" placeholder="请选择" v-model="dataForm.TypeId" style="width:100%;">
          <el-option :key="item.ID" :label="item.NAME" :value="item.ID" v-for="item in types"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子级类型" prop="SubTypeId">
        <el-select @change="subTypeChange" placeholder="请选择" v-model="dataForm.SubTypeId" style="width:100%;">
          <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in chilrenTypes"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编号" prop="Code" :rules="{ required: true, message: '请填写编号', trigger: 'blur'}">
        <el-input v-model="dataForm.Code"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="Sort" :rules="{ required: true, message: '请填写排序', trigger: 'blur'}">
        <el-input v-model.number="dataForm.Sort" type="number"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="Status">
        <el-select placeholder="请选择" v-model="dataForm.Status" style="width:100%;">
          <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in statusList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="Description">
        <el-input :autosize="{ minRows: 5, maxRows: 10}" type="textarea" v-model="dataForm.Description"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary" :loading="submitButtonLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import treeToArray from "../../sysRole/TreeTable/customEval";

export default {
  components: { Treeselect },
  data() {
    return {
      visible: false,
      dataForm: {
        ID: "0",
        ORG_NAME: "",
        ORG_CODE: "",
        SubType: "",
        SubTypeId: ""
      },
      types: [],
      chilrenTypes: [],
      submitButtonLoading: false,
      statusList: [
        {
          label: "启用",
          value: 0
        },
        {
          label: "禁用",
          value: 1
        }
      ]
    };
  },
  created() {
    this.getChilrenTypes();
  },

  methods: {
    init(id) {
      this.visible = true;
      console.log(id);
      if (id) {
        this.dataForm.ID = id;
        this.$http({
          url: `/api/BaseDict/GetViewModel`,
          method: "get",
          params: { id }
        }).then(({ data }) => {
          this.dataForm = data.data;
          this.$refs["dataForm"].resetFields();
        });
      } else {
        this.dataForm = {};
      }
      this.getTypes();
    },
    // 获取字典类型
    getTypes() {
      this.$http({
        url: this.$http.adornUrl("/api/baseDictType/getlist"),
        method: "GET",
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999
        })
      }).then(({ data }) => {
        if (data) {
          this.types = data.pageList;
          for (var i = 0; i < data.pageList.length; i++) {
            var m = data.pageList[i];
            this.types[i].id = m.ID;
            this.types[i].code = m.CODE;
            this.types[i].label = m.NAME;
          }
        }
      });
    },
    typeChange(val) {
      this.dataForm.SubType = "";
      this.dataForm.SubTypeId = "";
      if (val && val !== "") {
        this.getChilrenTypes();
      }
    },
    subTypeChange(e) {
      if (this.chilrenTypes.length) {
        this.chilrenTypes.forEach(res => {
          if (res.Id == e) {
            this.dataForm.SubType = res.Name;
            this.dataForm.SubTypeId = res.Id;
          }
        });
        console.log(e);
        console.log(this.dataForm.SubTypeId);
        console.log(this.chilrenTypes);
      }
    },
    getChilrenTypes() {
      this.$http({
        url: "/api/baseDictType/GetSubtypesByTypeID",
        method: "get",
        params: { typeID: this.dataForm.TypeId }
      }).then(({ data }) => {
        if (data && data.length > 0) {
          this.chilrenTypes = data;
        } else {
          this.chilrenTypes = [];
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true;
          this.$http({
            url: this.$http.adornUrl(`/api/BaseDict/save`),
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
                    this.dataForm = {};
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
