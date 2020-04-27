<template>
  <div>
    <el-tabs tab-position="top" type="card" v-model="activeTab">
      <el-tab-pane label="未读消息" name="unread">
        <span slot="label">
          未读消息
          <span v-if="unreadData.length>0">({{unreadData.length}})</span>
          <!-- <el-badge :value="unreadData.length" v-if="unreadData.length>0"/> -->
        </span>
        <el-table :data="unreadData" border="" style="width: 100%">
          <el-table-column label="时间" prop="CREATE_TIME" width="180">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_TIME|formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="ACTION_NAME" width="180"></el-table-column>
          <el-table-column label="标题" prop="TITLE"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="toPage(scope.row)" size="mini" type="text">详情</el-button>
              <el-button @click="setRemind(scope.row)" size="mini" type="text">设为已读</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="setAllRemind" size="small" style="margin-top:10px" v-if="unreadData.length>0">全部设为已读</el-button>
      </el-tab-pane>
      <el-tab-pane label="已读消息" name="second">
        <span slot="label">
          已读消息
          <span v-if="alreadyReadData.length>0">({{alreadyReadData.length}})</span>
          <!-- <el-badge :value="alreadyReadData.length" type="primary" v-if="alreadyReadData.length>0"/> -->
        </span>
        <el-table :data="alreadyReadData" border="" style="width: 100%">
          <el-table-column label="时间" prop="CREATE_TIME" width="180">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_TIME|formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="ACTION_NAME" width="180"></el-table-column>
          <el-table-column label="标题" prop="TITLE"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="toPage(scope.row,true)" size="mini" type="text">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submitSuccess: false,
      rmindList: [],
      dataForm: {},
      activeTab: "unread",
      unreadData: [], // 未读
      alreadyReadData: [] // 已读
    };
  },
  created() {
    this.getConfigRmindList();
    this.getRmind();
    this.getAlreadyRemind();
  },
  methods: {
    getConfigRmindList() {
      this.$http({
        method: "get",
        url: "/api/Remind/GetConfigList"
      }).then(res => {
        this.rmindList = res.data.pageList;
      });
    },
    configChange(val, index) {
      this.rmindList[index].IS_ENABLE = val;
    },
    // 获取消息列表
    getRmind() {
      this.$http({
        method: "get",
        url: "/api/Remind/GetRemind",
        params: { isRead: 0 }
      }).then(({ data }) => {
        this.unreadData = data.pageList;
        this.$store.commit(
          "common/updataUnreadQuantity",
          this.unreadData.length
        );
      });
    },
    getAlreadyRemind() {
      this.$http({
        method: "get",
        url: "/api/Remind/GetRemind",
        params: { isRead: 1 }
      }).then(({ data }) => {
        this.alreadyReadData = data.pageList;
      });
    },
    // 跳转到详情
    toPage(row, isRead) {
      this.setRemind(row, true);
      if (row.ACTION_ALIAS === "AC01") {
        if (isRead) {
          this.$router.push({
            name: "remoteDetail",
            params: {
              ID: row.TARGET_ID,
              PatiendId: row.PATIENT_ID
            }
          });
          return false;
        }
        // 会诊业务
        this.$router.push({
          name: "remoteDetail",
          params: {
            ID: row.TARGET_ID,
            PatiendId: row.PATIENT_ID
          },
          query: { viewType: "approval", pageType: "approval" }
        });
      }
      if (row.ACTION_ALIAS === "AC02") {
        if (isRead) {
          // 转诊业务
          this.$router.push({
            name: "transferDetail",
            params: {
              ID: row.TARGET_ID,
              PatiendId: row.PATIENT_ID
            }
          });
          return false;
        }
        // 转诊业务
        this.$router.push({
          name: "transferDetail",
          params: {
            ID: row.TARGET_ID,
            PatiendId: row.PATIENT_ID
          },
          query: { viewType: "approval", pageType: "approval" }
        });
      }
    },
    setRemind(item, isUnRemind) {
      const params = {
        NofifyId: item.ID
      };
      this.$http({
        method: "POST",
        url: "/api/Remind/SetRemind",
        data: params
      }).then(({ data }) => {
        if (isUnRemind) {
          return false;
        }
        if (data.status === 0) {
          this.$message({
            message: data.msg,
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getRmind();
              this.getAlreadyRemind();
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    setAllRemind() {
      this.$http({
        method: "POST",
        url: "/api/Remind/SetRemindAll"
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message({
            message: data.msg,
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getRmind();
              this.getAlreadyRemind();
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.submitSuccess = true;
          this.$http({
            url: this.$http.adornUrl(`/api/Remind/SetConfig`),
            method: "post",
            data: this.rmindList
          }).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: data.msg,
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.submitSuccess = false;
                }
              });
            } else {
              this.submitSuccess = false;
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType;
      },
      set(val) {
        this.$store.commit("common/updateNavbarLayoutType", val);
      }
    },
    sidebarLayoutSkin: {
      get() {
        return this.$store.state.common.sidebarLayoutSkin;
      },
      set(val) {
        this.$store.commit("common/updateSidebarLayoutSkin", val);
      }
    }
  }
};
</script>
