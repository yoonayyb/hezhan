<template>
  <el-dialog :title="!dataForm.ID ? '新增' : '修改'" :close-on-click-modal="false" width="900px" :visible.sync="visible">
    <el-form :model="dataForm" :inline="true" :rules="dataRule" ref="dataForm" label-width="140px" style="width:900px">
      <el-form-item label="医院名称" prop="ORG_NAME">
        <el-input v-model="dataForm.ORG_NAME"></el-input>
      </el-form-item>
      <el-form-item label="医院简称" prop="SHORT_NAME" :rules="{ required: true, message: '请填写医院简称'}">
        <el-input v-model="dataForm.SHORT_NAME" style="width:203px"></el-input>
      </el-form-item>
      <el-form-item label="医院编号" prop="ORG_CODE" :rules="{ required: true, message: '请填写医院编码'}">
        <el-input v-model="dataForm.ORG_CODE"></el-input>
      </el-form-item>
      <el-form-item label="缩写编号" prop="INSTITUTION_CODE" :rules="{ required: true, message: '请填写缩写编号'}">
        <el-input v-model="dataForm.INSTITUTION_CODE" style="width:203px"></el-input>
      </el-form-item>
      <el-form-item label="医院类别" prop="INSTITUTION_TYPE" :rules="{ required: true, message: '请选择医院类别'}">
        <el-select v-model="dataForm.INSTITUTION_TYPE" placeholder="请选择..." style="width:180px">
          <el-option v-for="item in jglbTypes" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医院等级" prop="ORG_TYPE" :rules="{ required: true, message: '请选择医院等级'}">
        <el-select v-model="dataForm.ORG_TYPE" placeholder="请选择..." style="width:100%">
          <el-option v-for="item in yydjTypes" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="省" prop="ADDR_PROVINCE" :rules="{ required: true, message: '请选择省',trigger: 'blur'}">
        <el-select v-model="dataForm.ADDR_PROVINCE" placeholder="请选择..." style="width:180px" @change="provChange">
          <el-option v-for="item in provTypes" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="ADDR_CITY" :rules="{ required: true, message: '请选择市',trigger: 'blur'}">
        <el-select v-model="dataForm.ADDR_CITY" placeholder="请选择..." style="width:100%" @change="cityChange">
          <el-option v-for="item in cityTypes" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="区/县"
        prop="ADDR_COUNTY"
        :rules="{ required: true, message: '请选择区/县',trigger: 'blur'}"
        style="width:700px"
      >
        <el-select @change="countyChange" v-model="dataForm.ADDR_COUNTY" placeholder="请选择..." style="width:180px">
          <el-option v-for="item in countyTypes" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="ADDR_DETAILS" :rules="{ required: true, message: '请填写'}">
        <el-input
          v-model="dataForm.ADDR_DETAILS"
          style="width:550px"
          :autosize="{ minRows: 5, maxRows: 10}"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="ORG_DESC" style="width:700px;">
        <el-input
          style="width:550px"
          v-model="dataForm.ORG_DESC"
          :autosize="{ minRows: 5, maxRows: 10}"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="REMARK" style="width:700px;">
        <el-input style="width:550px" v-model="dataForm.REMARK" :autosize="{ minRows: 5, maxRows: 10}" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="submitButtonLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getOrgViewModel } from "@/api/modules/baseOrg";
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        ID: 0,
        ORG_NAME: "",
        ORG_CODE: "",
        ADDR_COUNTY: "" //因为selcect数组层级太深，在这里声明好让vue监听到。
      },
      dataRule: {
        ORG_NAME: [{ required: true, message: "医院名称", trigger: "blur" }]
      },
      jglbTypes: [],
      yydjTypes: [],
      provTypes: [],
      cityTypes: [],
      countyTypes: [],
      submitButtonLoading: false
    };
  },
  watch: {
    countyTypes: {
      deep: true,
      handler(a, b) {
        this.cityTypes = this.cityTypes.slice();
      }
    }
  },
  methods: {
    init(id) {
      this.getjglb();
      this.getyydj();
      this.dataForm.ID = id || 0;
      if (this.dataForm.ID) {
        getOrgViewModel({ id: this.dataForm.ID })
          .then(({ data }) => {
            this.dataForm = data.data;
            console.log(this.dataForm);
            this.visible = true;
            this.getProvince(this.dataForm.ADDR_PROVINCE);
            // this.$nextTick(() => {
            //   this.$refs["dataForm"].resetFields();
            // });
          })
          .catch(res => {
            this.$message.error(res);
          });
      } else {
        this.getProvince();
        this.visible = true;
      }

      // this.$http({
      //   url: this.$http.adornUrl('/api/baseOrg/GetViewModel'),
      //   method: 'get',
      //   params: {ID: ''}
      // }).then(({data}) => {
      //   this.dataForm = data
      //   console.log(this.dataForm)
      // }).then(() => {
      //   this.visible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].resetFields()
      //   })
      // }).then(() => {
      //   if (id) {
      //     this.dataForm.ID = id
      //     this.$http({
      //       url: this.$http.adornUrl(`/api/baseOrg/GetViewModel`),
      //       method: 'get',
      //       params: this.$http.adornParams()
      //     }).then(({data}) => {
      //       this.dataForm = data
      //     })
      //   }
      // })
    },
    close() {
      this.visible = false;
      this.$refs["dataForm"].resetFields();
      this.dataForm = {};
    },
    // 获取医院类别
    getjglb() {
      this.$http({
        url: this.$http.adornUrl("/api/baseDict/GetlistByType"),
        method: "GET",
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999,
          TypeId: "f2a60cb1-f549-4bda-8b51-b2d42dff53d2"
        })
      }).then(({ data }) => {
        if (data) {
          this.jglbTypes = data.pageList;
          for (var i = 0; i < data.pageList.length; i++) {
            // this.jglbTypes[i].value = data[i].NAME
            this.$set(this.jglbTypes[i], "value", data.pageList[i].NAME);
          }
          // console.log(this.jglbTypes)
        }
      });
    },

    // 获取医院等级
    getyydj() {
      this.$http({
        url: this.$http.adornUrl("/api/baseDict/GetlistByType"),
        method: "GET",
        params: this.$http.adornParams({
          pageIndex: 1,
          pageSize: 999,
          TypeId: "95f914e9-6787-4498-8f0a-5a92e6da71b7"
        })
      }).then(({ data }) => {
        if (data) {
          this.yydjTypes = data.pageList;
          for (var i = 0; i < data.pageList.length; i++) {
            this.yydjTypes[i].value = data.pageList[i].NAME;
          }
        }
      });
    },

    // -----省市县-----
    getProvince(val) {
      this.$http({
        url: this.$http.adornUrl("/api/BaseDict/GetListArea"),
        method: "GET",
        params: { parentid: 0 }
      }).then(({ data }) => {
        if (data) {
          this.provTypes = data;
          for (var i = 0; i < data.length; i++) {
            this.provTypes[i].value = data[i].region_name;
          }
          if (this.dataForm.ID && val) {
            console.log(this.provTypes);
            this.provChange(val, "save");
          }
        }
      });
    },
    provChange(val, type = "") {
      let obj = {};
      obj = this.provTypes.find(item => {
        return item.value === val;
      });
      console.log(val, obj);
      if (type) {
      } else {
        this.dataForm.ADDR_CITY = "";
        this.cityTypes = [];
        this.dataForm.ADDR_COUNTY = "";
        this.countyTypes = [];
      }
      this.$http({
        url: this.$http.adornUrl("/api/BaseDict/GetListArea"),
        method: "GET",
        params: { parentid: obj.region_id }
      }).then(({ data }) => {
        if (data) {
          this.cityTypes = data;
          for (var i = 0; i < data.length; i++) {
            // this.cityTypes[i].value = data[i].region_name;
            this.$set(this.cityTypes[i], "value", data[i].region_name);
          }
        }
      });
    },
    cityChange(val) {
      this.$set(this.dataForm, "ADDR_CITY", val);
      let obj = {};
      obj = this.cityTypes.find(item => {
        return item.value === val;
      });
      this.dataForm.ADDR_COUNTY = "";
      this.countyTypes = [];
      this.$http({
        url: this.$http.adornUrl("/api/BaseDict/GetListArea"),
        method: "GET",
        params: { parentid: obj.region_id }
      }).then(({ data }) => {
        if (data) {
          this.countyTypes = data;
          for (var i = 0; i < data.length; i++) {
            // this.countyTypes[i].value = data[i].region_name;
            this.$set(this.countyTypes[i], "value", data[i].region_name);
          }
        }
      });
    },
    countyChange(val) {
      console.log(this.countyTypes, this.dataForm.ADDR_CITY);
      this.$set(this.dataForm, "ADDR_COUNTY", val);
    },
    // -----省市县-----

    // 表单提交
    dataFormSubmit() {
      this.submitButtonLoading = true;
      this.dataForm.ID = this.dataForm.ID.toString(); //后端要求传字符串格式
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/api/baseOrg/save`),
            method: "post",
            data: this.dataForm
          }).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.submitButtonLoading = false;
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          this.submitButtonLoading = false;
        }
      });
    }
  }
};
</script>
