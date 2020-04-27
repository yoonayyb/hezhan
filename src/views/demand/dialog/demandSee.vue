<template>
  <el-container>
    <el-header style="height:auto">
      <el-page-header @back="back" content="需求详情"></el-page-header>
      <!-- <el-button @click="back" type="primary" icon="el-icon-arrow-left">返回</el-button>
      <span>需求详情</span>-->
    </el-header>
    <el-main>
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <!-- <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">项目需求</template>
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column prop="date" label="日期" width="180"></el-table-column>
                  <el-table-column prop="name" label="姓名" width="180"></el-table-column>
                  <el-table-column prop="address" label="地址"></el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">迭代版本</template>
                <el-table header-align="center" align="center" border="" :data="tableDataIterate" style="width: 100%">
                  <el-table-column prop="Name" label="迭代名称"></el-table-column>
                  <el-table-column prop="StatusName" label="状态"></el-table-column>
                  <el-table-column prop="PriorityName" label="优先级"></el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>-->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>项目需求</span>
              </div>
              <!-- <template slot="title">迭代版本</template>
              <el-table header-align="center" align="center" border="" :data="tableDataIterate" style="width: 100%">
                <el-table-column prop="Name" label="迭代名称"></el-table-column>
                <el-table-column prop="StatusName" label="状态"></el-table-column>
                <el-table-column prop="PriorityName" label="优先级"></el-table-column>
              </el-table>-->
            </el-card>
          </div>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>参与者</span>
            </div>
            <el-tag v-if="tags.length" style="margin-left:5px" v-for="(tag,index) in tags" :key="index">{{tag.UserNick}}</el-tag>
            <div v-if="!tags.length" style="padding-left:10px">无</div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>所有动态</span>
            </div>
            <el-table header-align="center" align="center" border="" :data="LogDynamic" style="width: 100%">
              <el-table-column prop="Textcontent" label="修改内容"></el-table-column>
              <el-table-column label="创建日期">
                <template slot-scope="scope">
                  <div>{{ scope.row.CreateDate | formatTimeI}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { getDemandDetail } from "@/api/modules/manbing.js";
import Model from "@/components/model/model.vue";

export default {
  components: {
    Model
  },
  computed: {},
  created() {
    this.getDemandDetail();
  },
  data() {
    return {
      tableData: [],
      tableDataIterate: [],
      disabled: false,
      tags: "",
      LogDynamic: []
    };
  },
  // watch:{
  //   'detailForm.id_no':{
  //     deep:true,
  //     handler(a,b){
  //       console.log(111)
  //       this.$set(this.detailForm,'birthday',getBirthdayFromIdCard(this.detailForm.id_no))
  //     }
  //   }
  // },
  methods: {
    getDemandDetail() {
      let pramas = {
        demandId: this.$route.params.Id
      };
      getDemandDetail(pramas).then(res => {
        console.log(res);
        if (res.data.Status == 0) {
          this.tableDataIterate = res.data.Data.Iterate;
          this.tags = res.data.Data.Partner;
          this.LogDynamic = res.data.Data.LogDynamic;
          console.log(this.tags);
          // this.tableDataIterate.forEach(res => {
          //   if (res.Demand.length) {
          //     this.tableData.push = res.Demand;
          //   }
          // });
        } else {
          this.$message.error(res.Message);
        }
      });
    },
    back() {
      window.history.back();
    },
    select(row) {
      this.$set(this.detailForm, "ExecutorName", row.Name);
      this.detailForm.ExecutorId = row.Id;
      console.log(this.detailForm);
    },
    choose() {
      console.log(this.userList);
      this.$refs.model.init(this.userList);
    },
    getItemList(res) {
      console.log(res);
      this.detailForm = res;
      //去掉时分秒
      if (res.length) {
        this.detailForm.birthday = this.detailForm.birthday.split(" ")[0];
      }
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
          this.detailForm.BeginDate = this.sugar_time[0];
          this.detailForm.EndDate = this.sugar_time[1];
          addUserInformation(this.detailForm)
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
.box-card {
  height: auto;
  min-height: 0;
  margin-bottom: 10px;
}
</style>
