<template>
  <el-dialog
    title="添加项目"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    width="600px"
    style="padding:10px 50px"
  >
    <el-form ref="form" :rules="rules" :model="detailForm" label-width="120px">
      <!-- <el-form-item prop="patient_name" label="状态:">
        <el-select style="width:100%" v-model="detailForm.status" clearable placeholder="请选择">
          <el-option v-for="item in status" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item prop="Name" label="项目名称:">
        <el-input v-model="detailForm.Name"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="ExecutorName" label="执行者:">
        <el-input @click.native="choose" v-model="detailForm.ExecutorName"></el-input>
      </el-form-item>-->
      <el-form-item prop="Partner" label="参与者:">
        <el-checkbox-group @change="changeBtn(IsHosts)" size="mini" style="display:flex" v-model="IsHosts">
          <el-checkbox-button
            v-if="tags"
            v-for="(tag,index) in tags"
            :label="tag"
            :key="index"
          >{{tag.Name || tag.UserNick}}</el-checkbox-button>
          <el-button
            style="margin-left:5px"
            type="primary"
            icon="el-icon-search"
            @click.native="choose()"
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
          effect="dark"
          closable
        >{{IsHost.Name || IsHost.UserNick}}</el-tag>
      </el-form-item>
      <el-form-item label="时间:">
        <el-date-picker
          v-model="sugar_time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="Remark" label="备注:">
        <el-input v-model="detailForm.Remark"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="patient_name" label="工时:">
        <el-input v-model="detailForm.patient_name"></el-input>
      </el-form-item>-->
      <el-form-item prop="PriorityId" label="优先级:">
        <el-select @change="selectGet" style="width:100%" v-model="detailForm.PriorityId" clearable placeholder="请选择">
          <el-option v-for="item in rankList" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" style="width:100px" :disabled="disabled" @click="edit">{{type}}</el-button>
      <el-button type="primary" style="width:100px" @click="closeModal">关闭</el-button>
    </span>
    <Model placeholder="输入关键词" @search="search" @select="select" @addAll="addAll" ref="model"></Model>
  </el-dialog>
</template>

<script>
import { addUserInformation } from "@/api/modules/manbing.js";
import Model from "@/components/model/model.vue";
import { getUserList } from "@/utils/api.js";
export default {
  props: {
    visible: Boolean,
    formData: Object,
    type: String
  },
  components: {
    Model
  },
  computed: {
    rankList() {
      console.log(this.$store.state.user.rank);
      return this.$store.state.user.rank;
    }
  },
  data() {
    return {
      sugar_time: [],
      detailForm: {
        ExecutorName: ""
      },
      rules: {
        Name: [{ required: true, message: "请输入项目名称", trigger: "blur" }]
      },
      // type: "",
      tags: [],
      IsHosts: [],
      disabled: false,
      tagIndex: ""
    };
  },
  methods: {
    getItemList(res) {
      console.log(res);
      this.detailForm = res;
      this.sugar_time = [];
      if (JSON.stringify(res) == "{}") {
        return;
      }
      this.tags = res.Partner || [];
      this.IsHosts = this.tags.filter(element => {
        return element.IsHost == "1";
      });

      console.log(this.IsHosts);
      this.$set(this.sugar_time, 0, res.BeginDate || "");
      this.$set(this.sugar_time, 1, res.EndDate || "");
      console.log(this.sugar_time);
    },
    select(row) {
      this.$set(this.detailForm, "ExecutorName", row.Name);
      this.detailForm.ExecutorId = row.Id;
      console.log(this.detailForm);
    },
    closeUser(IsHost) {
      this.IsHosts.splice(this.IsHosts.indexOf(IsHost), 1);
      this.changeBtn(this.IsHosts);
    },
    tagClick(index) {
      this.tagIndex == index ? (this.tagIndex = "") : (this.tagIndex = index);
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
    selectGet(res) {
      let obj = this.rankList.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.Id === res; //筛选出匹配数据
      });
      this.detailForm.PriorityName = obj.Name;
      console.log(this.detailForm.PriorityName);
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
    edit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.disabled = true;
          if (this.sugar_time.length) {
            this.detailForm.BeginDate = this.$moment(this.sugar_time[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            this.detailForm.EndDate = this.$moment(this.sugar_time[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }

          addUserInformation(this.detailForm)
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
/deep/.el-dialog__body {
  padding: 30px 50px !important;
}
</style>
