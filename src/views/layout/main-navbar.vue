<template>
  <nav :class="'site-navbar--' + navbarLayoutType" class="site-navbar clearfix">
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item @click="sidebarFold = !sidebarFold" class="site-navbar__switch" index="0">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <!-- <div class="fl">当前位置:首页</div> -->
      <!-- <div>
        <span class="el-icon-location-outline"></span>
      </div>-->
      <div class="custom-content-con">
        <!-- <a
          @click="jumpToEdu"
          v-if="remoteEdu"
          class="bell "
          target="_blank"
        >
          <i class="iconfont icon-shipinhuizhen"></i>
          <div>远程教学</div>
        </a>-->

        <div class="bell" v-if="remoteAllianceview && xklmflag == '1'" @click="jumpToDA">
          <i class="iconfont icon-jiaoliuquan"></i>
          <span>学科联盟</span>
        </div>
        <!-- <div
          class="bell"
          @click="jumpToApp"
        >
          <i class="el-icon-mobile-phone"></i>
          <span>app下载</span>

        </div>-->
        <!-- <div class="line"></div>

        <div @click="showBrush = true"
             class="bell">
          <i class="el-icon-edit-outline"></i>
          <span>画笔</span>

        </div>
        -->
        <div class="bell" @click="$router.push({ name: 'noticeSettings' })">
          <el-badge :value="unreadQuantity" :hidden="unreadQuantity===0">
            <i class="el-icon-bell"></i>
            <span>消息</span>
          </el-badge>
        </div>
        <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
          <el-menu-item class="site-navbar__avatar" index="3" style="background:transparent !important">
            <el-dropdown :show-timeout="0" placement="bottom">
              <span class="el-dropdown-link">
                <img :src="$url+userInfo.imgPath" v-if="userInfo.imgPath">
                <img v-else src="~@/assets/img/avatar3.jpg">
                {{ userInfo.Name }}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="personalInfoHandle()">个人信息</el-dropdown-item>
                <el-dropdown-item @click.native="changePassword()">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 个人信息-->
    <personal-info ref="personalInfo" v-show="personalInfoVisible"/>、
    <!-- 画笔 -->
    <paint-brush @close="showBrush=false" v-if="showBrush"/>
    <!-- 修改密码 -->
    <change-password ref="changePassword"/>
  </nav>
</template>

<script>
import PersonalInfo from "./userInfo";
import Breadcrumb from "@/components/Breadcrumb";
import PaintBrush from "@/components/Paintbrush/index.vue";
import ChangePassword from "./change-password.vue";
import { herf } from "@/utils/index.js";
import SignParams from "@/utils/signParams";
const Sign = new SignParams();

export default {
  data() {
    return {
      personalInfoVisible: false,
      showBrush: false,
      remindList: [],
      remoteEdu: window.SITE_CONFIG["edu"],
      remoteAllianceview: window.SITE_CONFIG["allianceview"],
      xklmflag: ""
    };
  },
  components: {
    PersonalInfo,
    Breadcrumb,
    PaintBrush,
    ChangePassword
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType;
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
      set(val) {
        this.$store.commit("common/updateSidebarFold", val);
      }
    },
    userInfo: {
      get() {
        return this.$store.state.user.userInfo;
      }
    },
    unreadQuantity() {
      return this.$store.state.common.unreadQuantity;
    }
  },
  created() {
    // this.getRemind()
    this.xklmflag = window.SITE_CONFIG["xklmflag"];
    // console.log(window.SITE_CONFIG['xklmflag'])
  },
  methods: {
    // 学科联盟跳转
    jumpToDA() {
      herf.open({
        url: window.SITE_CONFIG["allianceview"],
        query: {
          ...Sign.getParams()
        }
      });
    },
    jumpToEdu() {
      herf.open({
        url: window.SITE_CONFIG["edu"],
        query: {
          ...Sign.getParams()
        }
      });
      // window.open(window.SITE_CONFIG['edu'])
    },
    jumpToApp() {
      this.$http({
        method: "get",
        url: "/api/MobileClientVersion/GetViewModelLast"
      }).then(res => {
        if (res.status == 200) {
          window.open(window.SITE_CONFIG["baseUrl"] + res.data.path);
        }
      });
    },
    getRemind() {
      this.$http({
        method: "get",
        url: "/api/Remind/GetRemind",
        params: { isRead: 0 }
      }).then(res => {
        this.remindList = res.data.pageList;
        this.$store.commit(
          "common/updataUnreadQuantity",
          this.remindList.length
        );
      });
    },
    // 个人信息
    personalInfoHandle() {
      this.personalInfoVisible = true;
      this.$nextTick(() => {
        this.$refs.personalInfo.init();
      });
    },
    // 修改密码
    changePassword() {
      this.$refs.changePassword.init();
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/api/Login/logout"),
            method: "post",
            data: this.$http.adornData()
          }).then(({ data }) => {
            this.$router.options.isAddDynamicMenuRoutes = false;
            localStorage.setItem("access_token", "");
            this.$router.replace({ name: "login" });
            location.reload(); // 解决路由重复加载的问题
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.custom-content-con {
  float: right;
  height: auto;
  display: flex;
  align-items: center;
  > * {
    float: right;
    box-sizing: border-box;
    cursor: pointer;
    color: #606266;
  }
  .item {
    padding: 0 15px;
    font-size: 12px;
  }
  .bell {
    height: 30px;
    margin-top: 5px;
    line-height: 30px;
    padding: 0 15px;
    font-size: 12px;
    display: flex;
    align-items: center;
    &:hover {
      color: #3e8ef7;
    }
    .iconfont {
      font-style: normal;
      font-weight: 400;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: baseline;
      display: inline-block;
      -webkit-font-smoothing: antialiased;
      margin-right: 5px;
      font-size: 18px;
    }
    i {
      font-size: 21px;
    }
  }
}

.line {
  width: 1px;
  height: 20px;
  background-color: #999;
}
</style>
