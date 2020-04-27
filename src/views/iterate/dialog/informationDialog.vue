<template>
  <el-dialog
    title="添加迭代版本"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    width="600px"
  >
    <el-form ref="form" :rules="rules" :model="detailForm" label-width="120px">
      <el-form-item prop="ProjectName" label="所属项目:">
        <!-- <el-input v-if="type=='添加子级' ||type=='修改' " disabled v-model="detailForm.ProjectName"></el-input> -->

        <el-input readonly @click.native="chooseProject" v-model="detailForm.ProjectName"></el-input>
      </el-form-item>
      <el-form-item v-if="type == '添加子级'" prop="label" label="父级名称:">
        <el-input disabled v-model="label"></el-input>
      </el-form-item>
      <el-form-item prop="Name" label="名称:">
        <el-input v-model="detailForm.Name"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="Partner" label="参与者:">
        <el-checkbox-group @change="changeBtn(IsHosts)" size="mini" v-model="IsHosts">
          <el-checkbox-button v-for="(tag,index) in tags" :label="tag" :key="index">{{tag.Name || tag.UserNick}}</el-checkbox-button>
          <el-button
            style="margin-left:5px"
            type="primary"
            icon="el-icon-search"
            @click.native="choose('multiple')"
            size="small"
            round
          ></el-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="IsHost" label="负责人:">
        <span v-if="!IsHosts.length" style="color:red">(请从参与者中添加负责人)</span>
        <el-tag
          @close="closeUser(IsHost)"
          style="margin-left:5px"
          v-for="(IsHost,index) in IsHosts"
          :key="index"
          effect="light"
          closable
        >{{IsHost.Name || IsHost.UserNick}}</el-tag>
      </el-form-item>
      <el-form-item prop="WorkHour" label="所需工时:">
        <el-input type="number" v-model.number="detailForm.WorkHour"></el-input>
      </el-form-item>
      <el-form-item label="时间:">
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
      </el-form-item>-->

      <el-form-item prop="Remark" label="备注:">
        <el-input :autosize="{ minRows: 2, maxRows: 4}" type="textarea" v-model="detailForm.Remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button v-if="type" type="primary" :disabled="disabled" style="width:100px" @click="save">修改</el-button> -->

      <el-button type="primary" style="width:100px" @click="save">{{type}}</el-button>
      <el-button type="primary" style="width:100px" @click="closeModal">关闭</el-button>
    </span>
    <Model placeholder="输入关键词" @search="search" @select="select" @addAll="addAll" ref="model"></Model>
    <ProjectModel placeholder="输入关键词" @search="projectSearch" @select="projectSelect" ref="ProjectModel"></ProjectModel>
  </el-dialog>
</template>

<script>
import {
  addRecordInformation,
  userInformation
} from "@/api/modules/manbing.js";
import Model from "@/components/model/model.vue";
import ProjectModel from "@/components/model/projectModel.vue";
import { getUserList } from "@/utils/api.js";
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
      label: "", //父级名称
      detailForm: {
        ExecutorName: "",
        sugar_time: []
      },
      tags: [],
      IsHosts: [],
      disabled: false,
      type: "",
      rules: {
        Name: [{ required: true, message: "请输入迭代名称", trigger: "blur" }],
        ProjectName: [{ required: true, message: "请输入项目名称" }]
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
      this.detailForm = {};
      this.$refs.form.resetFields();
      this.tags = [];
      switch (type) {
        case "edit":
          this.detailForm = res;
          this.tags = res.Partner || new Array();
          this.IsHosts = [
            this.tags.filter(res => {
              return res.IsHost == "1";
            })
          ];
          let sugar_time = [res.BeginDate || "", res.EndDate || ""];
          this.$set(this.detailForm, "sugar_time", sugar_time);
          this.detailForm.ProjectName = res.ProjectName;
          this.type = "修改";
          console.log(this.tags);
          console.log(this.detailForm);
          break;
        case "add":
          this.label = res.Name;
          this.detailForm.ParentId = res.Id;
          this.detailForm.ProjectName = res.ProjectName;
          this.detailForm.ProjectId = res.ProjectId;
          this.type = "添加子级";
          console.log(this.detailForm);
          break;
        default:
          this.type = "添加";
      }
    },
    select(row) {
      this.$set(this.detailForm, "ExecutorName", row.Name);
      // this.tags = Array.from(new Set(this.tags.push(row.Name)));
      // this.detailForm.joinId = row.Id;
      this.detailForm.ExecutorId = row.Id;
      console.log(this.detailForm);
    },
    addAll(row) {
      console.log(row);
      this.tags = row;
      this.IsHosts = [];
      let Partner = [];
      this.tags.forEach(element => {
        Partner.push({
          Id: "",
          UserId: element.Id,
          UserNick: element.Name,
          UserName: element.UserName,
          IsHost: "0"
        });
      });
      this.detailForm.Partner = Partner;
      console.log(Partner);
    },
    closeUser(IsHost) {
      this.IsHosts.splice(this.IsHosts.indexOf(IsHost), 1);
      this.changeBtn(this.IsHosts);
    },
    projectSelect(row) {
      this.$set(this.detailForm, "ProjectName", row.Name);
      this.detailForm.ProjectId = row.Id;
      console.log(this.detailForm);
    },
    changeBtn(res) {
      this.IsHosts = res;
      console.log(res);
      if (res.length) {
        for (let i = 0; i < this.detailForm.Partner.length; i++) {
          for (let j = 0; j < res.length; j++) {
            if (
              this.detailForm.Partner[i].UserNick ==
              (this.IsHosts[j].Name || this.IsHosts[j].UserNick)
            ) {
              this.detailForm.Partner[i].IsHost = "1";
              break;
            } else {
              this.detailForm.Partner[i].IsHost = "0";
            }
          }
        }
      } else {
        this.detailForm.Partner.forEach(res => {
          res.IsHost = "0";
        });
      }
      console.log(this.detailForm.Partner);
    },
    async search(Keyword) {
      let params = {
        PageSize: 20,
        PageIndex: 1,
        Keyword
      };
      let res = await getUserList(params);
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
      let res = await userInformation(params);
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
    async chooseProject() {
      let params = {
        PageSize: 20,
        PageIndex: 1
      };
      let res = await userInformation(params);
      console.log(res);
      if (res.data && res.data.Status === 0) {
        let project = res.data.PageList;
        this.$refs.ProjectModel.init(project);
      } else {
        this.$message.error(res.data.Message);
      }
    },
    async choose(type = "") {
      let res = await getUserList();
      console.log(type);
      if (res.data && res.data.Status === 0) {
        let userList = res.data.PageList;
        this.$refs.model.init(userList, type);
      } else {
        this.$message.error(res.data.Message);
      }
    },
    closeModal() {
      this.detailForm = {};
      this.$refs.form.resetFields();
      this.tags = [];
      this.IsHosts = [];
      this.$emit("close");
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
          this.detailForm.sugar_time = ""; //不传这个字段给后端
          addRecordInformation(this.detailForm)
            .then(res => {
              this.disabled = false;
              if (res.data.Status == 0) {
                this.$message({
                  message: res.data.Message,
                  type: "success"
                });
                this.tags = [];
                this.IsHosts = [];
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
