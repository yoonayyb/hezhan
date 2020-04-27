<template>
  <el-dialog :close-on-click-modal="false" :title="!dataForm.ID ? '新增' : '修改'" :visible.sync="visible" @close="close">
    <el-form :model="dataForm" :rules="dataRule" label-width="150px" ref="dataForm">
      <el-form-item :rules="{ required: true, message: '请选择医院'}" label="医院" prop="OrgName">
        <el-input :readonly="true" style="width: 55%" v-model="dataForm.OrgName"></el-input>
        <el-button @click="choose('org')" type="text">选择</el-button>
      </el-form-item>

      <el-form-item :rules="{ required: true, message: '请选择部门'}" label="部门" prop="DeptName">
        <el-input :readonly="true" style="width: 55%" v-model="dataForm.DeptName"></el-input>
        <el-button @click="choose('dect')" type="text">选择</el-button>
      </el-form-item>

      <el-form-item :rules="{ required: true, message: '请填写位置'}" label="位置" prop="Position">
        <el-input style="width: 55%" v-model="dataForm.Position"></el-input>
      </el-form-item>

      <el-form-item :rules="{ required: true, message: '请填写会议室名称'}" label="会议室名称" prop="FieldName">
        <el-input style="width: 55%" v-model="dataForm.FieldName"></el-input>
      </el-form-item>

      <el-form-item :rules="{ required: true, message: '请选择是否闲置'}" label="是否闲置">
        <el-select placeholder="请选择设备状态" style="width: 55%" v-model="dataForm.IsFree">
          <el-option :value="0" label="闲置中"></el-option>
          <el-option :value="1" label="正在使用"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="DESCRIPTION">
        <el-input :autosize="{ minRows: 5, maxRows: 10}" style="width: 55%" type="textarea" v-model="dataForm.Remarkes"></el-input>
      </el-form-item>
    </el-form>

    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="submitButtonLoading" @click="dataFormSubmit()" type="primary">确定</el-button>
    </span>

    <!--弹窗-->
    <Model
      :column="table.column"
      :dataList="modelData"
      :placeholder="table.placeholder"
      :totalPage="totalPage"
      @close="onModelClose"
      @page-change="onPageChange"
      @search="onModelSearch"
      @select="onModelSelect"
      v-model="showModel"
    ></Model>
  </el-dialog>
</template>

<script>
import {
  getOrgFieldViewModel,
  saveOrgField,
  getDept,
  getOrgList
} from "@/utils/api.js";
import Model from "@/components/model/model";

export default {
  data() {
    return {
      visible: false,
      dataForm: {},
      dataFormElse: {},
      dataRule: {
        OrgName: [{ message: "请选择医院", trigger: "change" }],
        Dect: [{ message: "请选择科室", trigger: "change" }],
        DeptName: [{ message: "请填写设备名称", trigger: "blur" }],
        ButTime: [{ type: "date", message: "请选择购买时间", trigger: "blur" }]
      },

      /*
       * 选择弹框
       * */
      showModel: false,
      chooseType: "",
      modelData: [],
      totalPage: 0,
      pageIndex: 0,
      keyword: "",
      table: {},
      submitButtonLoading: false,
      deptTable: {
        title: "选择科室",
        placeholder: "请选择科室",
        column: [
          {
            prop: "NAME",
            label: "科室"
          }
        ]
      },
      orgTable: {
        title: "选择医院",
        placeholder: "请选择医院",
        column: [
          {
            prop: "ORG_NAME",
            label: "医院名称"
          }
        ]
      }
    };
  },

  components: {
    Model
  },
  methods: {
    // 初始化
    init(id) {
      getOrgFieldViewModel("", { ID: "" })
        .then(res => {
          this.dataForm = res.data;
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (id) {
            getOrgFieldViewModel(id).then(({ data }) => {
              this.dataForm = data;
            });
          }
        });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true;
          let Viewdata = JSON.parse(JSON.stringify(this.dataForm));
          saveOrgField(Viewdata)
            .then(({ data }) => {
              if (data && data.status === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.submitButtonLoading = true;
                    this.$emit("refreshDataList");
                  }
                });
              } else {
                this.$message.error(data.msg);
                this.submitButtonLoading = true;
              }
            })
            .catch(() => {
              this.submitButtonLoading = true;
            });
        }
      });
    },

    close() {
      this.$emit("close");
    },
    /*
     * 弹框
     * */
    choose(name) {
      if (name === "org") {
        this.showModel = true;

        this.chooseType = name;
        this.table = this.orgTable;
        this.getOrg();
        return;
      }
      if (name === "dect") {
        if (!this.dataForm.OrgName) {
          this.$message.error("请先选择医院");
          return;
        }

        this.showModel = true;

        this.chooseType = name;
        this.table = this.deptTable;
        this.getDept();
      }
    },
    getDept() {
      let params = {
        orgid: this.dataForm.OrgId,
        pageSize: 15,
        pageIndex: this.pageIndex,
        keyword: this.keyword
      };
      getDept(params).then(res => {
        console.log(res);
        this.totalPage = res.data.totalCount;
        this.modelData = res.data.pageList;
      });
    },
    getOrg() {
      getOrgList({}).then(res => {
        this.totalPage = res.data.totalCount;
        this.modelData = res.data.pageList;
        console.log(res);
      });
    },
    onModelClose() {
      // 初始化弹框分页
      this.keyword = "";
      this.pageIndex = 0;
      this.totalPage = 0;
      this.visible = true;
    },
    onModelSearch(val) {
      this.keyword = val;
      this.pageIndex = 0;
      this.totalPage = 0;
    },
    // 科室选择
    onModelSelect(row) {
      this.showModel = true;
      if (this.chooseType === "org") {
        this.dataForm.OrgName = row.ORG_NAME;
        this.dataForm.OrgId = row.ID;

        // 重新选择医院时清空科室
        this.dataForm.DeptName = "";
        this.dataForm.DeptId = "";

        this.showModel = false;
        return;
      }
      if (this.chooseType === "dect") {
        this.dataForm.DeptName = row.NAME;
        this.dataForm.DeptId = row.ID;
        this.showModel = false;
        return;
      }
      console.log(row);
    },
    onPageChange(page) {
      this.pageIndex = page;
      if (this.chooseType === "org") {
        this.getOrg();
      }
      if (this.chooseType === "dect") {
        this.getDept();
      }
    }
  }
};
</script>
