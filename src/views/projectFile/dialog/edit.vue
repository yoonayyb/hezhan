<template>
  <el-dialog
    title="修改项目"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    width="600px"
    style="padding:10px 50px"
  >
    <el-form ref="form" :rules="rules" :model="detailForm" label-width="120px">
      <el-form-item prop="Name" label="项目名称:">
        <el-input v-model="detailForm.Name"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="ExecutorName" label="执行者:">
        <el-input @click.native="choose" v-model="detailForm.ExecutorName"></el-input>
      </el-form-item>-->
      <el-form-item prop="Partner" label="参与者:">
        <el-tag
          @close="closeUser(tag)"
          style="margin-left:5px"
          v-for="(tag,index) in tags"
          :key="index"
          closable
        >{{tag.Name || tag.UserNick}}</el-tag>
        <el-button type="primary" icon="el-icon-search" @click.native="choose('multiple')" size="small" round></el-button>
        <!-- <el-input readonly @click.native="choose" v-model="detailForm.ExecutorName"></el-input> -->
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
    <Model placeholder="输入姓名" @search="search" @select="select" @addAll="addAll" ref="model"></Model>
  </el-dialog>
</template>

<script>
import { addUserInformation } from "@/api/modules/manbing.js";
import Model from "@/components/model/model.vue";
import { getUserList } from "@/utils/api.js";
export default {
  props: {
    visible: Boolean
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
        Name: [{ required: true, message: "请输入迭代名称", trigger: "blur" }],
        ProjectName: [{ required: true, message: "请输入项目名称" }]
      },
      type: "",
      tags: [],
      disabled: false
    };
  },

  methods: {
    select(row) {
      this.$set(this.detailForm, "ExecutorName", row.Name);
      this.detailForm.ExecutorId = row.Id;
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
          UserNick: element.Name,
          IterateId: ""
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
    getItemList(res) {
      console.log(res);
      this.detailForm = res;
      this.tags = res.Partner;
      this.$set(this.sugar_time, 0, res.BeginDate || "");
      this.$set(this.sugar_time, 1, res.EndDate);
      // this.sugar_time[0] = row.BeginDate;
      // this.sugar_time[1] = row.EndDate;
      this.type = "修改";
      console.log(this.sugar_time);
    },
    closeModal() {
      this.detailForm = {};
      this.$refs.form.resetFields();
      this.$emit("close");
    },
    edit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.disabled = true;
          this.detailForm.BeginDate = this.$moment(this.sugar_time[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.detailForm.EndDate = this.$moment(this.sugar_time[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          addUserInformation(this.detailForm)
            .then(res => {
              this.disabled = false;
              if (res.data.Status == 0) {
                this.$message({
                  message: res.data.Message,
                  type: "success"
                });
                this.tags = [];
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
    },
    input(a) {
      console.log(a);
      this.$set(
        this.detailForm,
        "birthday",
        getBirthdayFromIdCard(this.detailForm.id_no) || ""
      );
      this.$set(this.detailForm, "sex", getSex(this.detailForm.id_no) || "");
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/.el-dialog__body {
  padding: 30px 50px !important;
}
</style>
