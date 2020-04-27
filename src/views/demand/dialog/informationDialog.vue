<template>
  <el-dialog
    title="添加需求"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    width="600px"
  >
    <el-form ref="form" v-loading="loading" :rules="rules" :model="detailForm" label-width="120px">
      <el-form-item prop="ParentName" label="所属迭代:">
        <el-input v-if="type=='添加子级' || type=='修改'" disabled v-model="detailForm.ParentName"></el-input>
        <el-input v-else readonly @click.native="chooseIterate" v-model="detailForm.ParentName"></el-input>
      </el-form-item>
      <el-form-item v-if="type == '添加子级'" prop="lable" label="父级名称:">
        <el-input disabled v-model="lable"></el-input>
      </el-form-item>
      <el-form-item prop="Name" label="名称:">
        <el-input v-model="detailForm.Name"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="ExecutorName" label="执行者:">
        <el-input readonly @click.native="choose" v-model="detailForm.ExecutorName"></el-input>
      </el-form-item>-->
      <el-form-item prop="Partner" label="参与者:">
        <el-tag
          @close="closeUser(tag)"
          style="margin-left:5px"
          v-for="(tag,index) in tags"
          :key="index"
          closable
        >{{tag.Name || tag.UserNick}}</el-tag>
        <el-button type="primary" icon="el-icon-search" @click.native="choose()" size="small" round></el-button>
        <!-- <el-input readonly @click.native="choose" v-model="detailForm.ExecutorName"></el-input> -->
      </el-form-item>
      <el-form-item prop="WorkHour" label="所需工时:">
        <el-input v-model.number="detailForm.WorkHour"></el-input>
      </el-form-item>
      <el-form-item prop="sugar_time" label="时间:">
        <el-date-picker
          v-model="detailForm.sugar_time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="PriorityId" label="优先级:">
        <el-select @change="selectGet" style="width:100%" v-model="detailForm.PriorityId" clearable placeholder="请选择">
          <el-option v-for="item in rankList" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="Remark" label="备注:">
        <el-input :autosize="{ minRows: 2, maxRows: 4}" type="textarea" v-model="detailForm.Remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button v-if="type" type="primary" :disabled="disabled" style="width:100px" @click="save">修改</el-button> -->

      <el-button type="primary" style="width:100px" @click="save">{{type}}</el-button>
      <el-button type="primary" style="width:100px" @click="closeModal">关闭</el-button>
    </span>
    <Model placeholder="输入关键字" @search="search" @select="select" @addAll="addAll" ref="model"></Model>
    <ProjectModel placeholder="输入关键字" @search="projectSearch" @select="projectSelect" ref="ProjectModel"></ProjectModel>
  </el-dialog>
</template>

<script>
import {
  addBaseInformation,
  recordInformation,
  getDemandDetail
} from "@/api/modules/manbing.js";

import Model from "@/components/model/model.vue";
import ProjectModel from "@/components/model/projectModel.vue";
import { getProjectUserList } from "@/utils/api.js";
export default {
  props: {
    visible: Boolean
  },
  components: {
    Model,
    ProjectModel
  },
  data() {
    return {
      lable: "", //父级名称
      detailForm: {
        ExecutorName: "",
        sugar_time: []
      },
      tags: [],
      disabled: false,
      loading: false,
      type: "",
      rules: {
        Name: [{ required: true, message: "请输入迭代名称", trigger: "blur" }],
        ParentName: [{ required: true, message: "请输入项目名称" }],
        sugar_time: [{ required: true, message: "请输入时间范围" }],
        WorkHour: [
          { required: true, message: "请输入数值工时" },
          { type: "number", message: "年龄必须为数字值" }
        ]
      }
    };
  },
  computed: {
    rankList() {
      console.log(this.$store.state.user.rank);
      return this.$store.state.user.rank;
    }
  },
  methods: {
    getItemList(res = "", type = "") {
      console.log(res);
      this.detailForm = {};
      this.$refs.form.resetFields();
      this.tags = [];
      this.loading = true;
      switch (type) {
        case "edit":
          let pramas = {
            demandId: res.Id
          };
          getDemandDetail(pramas).then(res => {
            this.loading = false;
            if (res.data.Status == 0) {
              console.log(res.data.Data);
              this.detailForm = res.data.Data;
              this.tags = this.detailForm.Partner;
              console.log(this.tags);
              let sugar_time = [
                this.detailForm.BeginDate || "",
                this.detailForm.EndDate || ""
              ];
              this.$set(this.detailForm, "sugar_time", sugar_time);
              this.detailForm.ParentName = this.detailForm.IterateName;
              this.type = "修改";
              console.log(this.detailForm);
            } else {
              this.loading = false;
              this.$message.error(res.data.Message);
            }
          });

          break;
        case "add":
          console.log(res);
          this.loading = false;
          this.lable = res.Name;
          this.detailForm.ParentId = res.Id;
          this.detailForm.ProjectId = res.ProjectId;
          this.detailForm.ParentName = res.IterateName;
          this.type = "添加子级";
          console.log(this.detailForm);
          break;
        default:
          this.loading = false;
          this.type = "添加";
      }
    },
    select(row) {
      this.$set(this.detailForm, "ExecutorName", row.Name);
      this.detailForm.ExecutorId = row.Id;
      console.log(this.detailForm);
    },
    projectSelect(row) {
      console.log(row);
      this.$set(this.detailForm, "ParentName", row.Name);
      this.detailForm.IterateId = row.Id;
      this.detailForm.ProjectId = row.ProjectId;
      console.log(this.detailForm);
    },
    closeUser(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    addAll(row) {
      console.log(row);
      this.tags = row;
      let Partner = [];
      this.tags.forEach(element => {
        Partner.push({
          Id: "",
          UserId: element.Id,
          UserNick: element.UserNick,
          UserName: element.UserName
        });
      });
      this.detailForm.Partner = Partner;
      console.log(Partner);
    },
    async search(Keyword) {
      let params = {
        Keyword,
        projectId: this.detailForm.ProjectId
      };
      let res = await getProjectUserList(params);
      console.log(res);
      if (res.data && res.data.Status === 0) {
        let userList = res.data.PageList;
        this.$refs.model.init(userList);
      } else {
        this.$message.error(res.data.Message);
      }
    },
    async projectSearch(Keyword) {
      let params = {
        PageSize: 20,
        PageIndex: 1,
        Keyword
      };
      let res = await recordInformation(params);
      console.log(res);
      if (res.data && res.data.Status === 0) {
        let project = res.data.PageList;
        this.$refs.ProjectModel.init(project);
      } else {
        this.$message.error(res.data.Message);
      }
    },
    selectGet(res) {
      let obj = this.rankList.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.Id === res; //筛选出匹配数据
      });
      this.detailForm.PriorityName = obj.Name;
      console.log(this.detailForm.PriorityName);
    },
    async chooseIterate() {
      let params = {
        PageSize: 20,
        PageIndex: 1
      };
      let res = await recordInformation(params);
      console.log(res);
      if (res.data && res.data.Status === 0) {
        let project = res.data.PageList;
        this.$refs.ProjectModel.init(project);
      } else {
        this.$message.error(res.data.Message);
      }
    },
    async choose(type = "") {
      if (!this.detailForm.ProjectId) {
        this.$message.error("请先选择所属迭代");
        return;
      }
      let res = await getProjectUserList({
        projectId: this.detailForm.ProjectId
      });
      console.log(type);
      console.log(res);
      if (res.data && res.data.Status === 0) {
        let userList = res.data.PageList;
        this.$refs.model.init(userList, type);
      } else {
        this.$message.error(res.data.Message);
      }
    },
    closeModal() {
      this.detailForm = {};
      this.$emit("close");
      this.$refs.form.resetFields();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.disabled = true;
          if (this.detailForm.sugar_time) {
            this.detailForm.BeginDate = this.$moment(
              this.detailForm.sugar_time[0]
            ).format("YYYY-MM-DD HH:mm:ss");
            this.detailForm.EndDate = this.$moment(
              this.detailForm.sugar_time[1]
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          addBaseInformation(this.detailForm)
            .then(res => {
              this.disabled = false;
              if (res.data.Status == 0) {
                this.$message({
                  message: res.data.Message,
                  type: "success"
                });
                this.$emit("upload");
                this.$emit("close");
              } else {
                this.$message.error(res.data.Message);
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
</style>
