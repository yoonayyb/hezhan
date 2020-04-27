<template>
  <div
    :class="{ 'site-sidebar--fold': sidebarFold }"
    class="site-wrapper"
    element-loading-text="拼命加载中"
    v-cloak
    v-loading.fullscreen.lock="loading"
  >
    <template v-if="!loading">
      <div :style="{ 'height':'100%' }" class="site-content__wrapper">
        <main-navbar/>
        <!-- <TagsView v-if="$route.meta.isTab"/> -->

        <main-sidebar/>
        <main-content/>
      </div>
    </template>
    <!-- 修改密码 -->
    <change-password ref="changePassword"/>
  </div>
</template>

<script>
import { loginUpdate, getUserInfo } from "@/utils/api";
import MainNavbar from "./main-navbar";
import MainSidebar from "./main-sidebar";
import MainContent from "./main-content";
import TagsView from "@/components/TagView/index.vue";
import ChangePassword from "./change-password.vue";
import Vue from "vue";
export default {
  data() {
    return {
      loading: true,
      notices: [],
      settimer: ""
    };
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent,
    TagsView,
    ChangePassword
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      },
      set(val) {
        this.$store.commit("common/updateDocumentClientHeight", val);
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      }
    }
  },

  created() {
    const token = localStorage.getItem("access_token");
    console.log(this.$route);
    const { name: routeName } = this.$route;

    if (token && token !== "" && routeName !== "login") {
      // this.getUserInfo();
      this.init();
    } else {
      this.loading = false;
      this.$router.push({ name: "login" });
      location.reload();
    }
  },
  mounted() {
    this.resetDocumentClientHeight();
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight() {
      this.documentClientHeight = document.documentElement["clientHeight"];
      window.onresize = () => {
        this.documentClientHeight = document.documentElement["clientHeight"];
      };
    },
    // 修改密码
    changePassword() {
      this.$refs.changePassword.init();
    },
    // 获取当前管理员信息
    async getUserInfo() {
      const { data } = await getUserInfo();
      if (data && data.status === 0) {
        // 从用户信息知道用的是哪款设备
        // this.$device = data.data.deviceSupplier === '2' ? 'Fosiv' : 'Keda'
        // Vue.prototype.$device = data.data.deviceSupplier === '2' ? 'Fosiv' : 'Keda'
        // Vue.prototype.$orgName = window.SITE_CONFIG['orgName']
        localStorage.setItem(
          "deviceStatus",
          data.data.deviceSupplier === "2" ? "Fosiv" : "Keda"
        );
        // console.log(this.$device)
        let userInfo = data.data;
        userInfo.device = userInfo.deviceSupplier === "2" ? "Fosiv" : "Keda";
        this.$store.commit("SET_USERINFO", userInfo);
        if (data.data.Is_first === "0") {
          this.$alert("您还未修改初始密码,请去修改密码", {
            confirmButtonText: "确定",
            callback: action => {
              if (action === "confirm") {
                this.changePassword();
              }
            }
          });
        }
        this.loading = false;
        // console.log(this.$device)
      }
    },
    // 令牌更新或者过期
    init() {
      this.loading = false;
      var tokenExpiresAt = localStorage.getItem("token_expires_at");
      var serverLcalTimeSpan = localStorage.getItem("server_local_timeSpan");
      if (tokenExpiresAt && serverLcalTimeSpan) {
        var date1 = this.getUnifiedTime();
        var date2 = new Date(tokenExpiresAt.replace(/-/g, "/"));
        date2.setMinutes(date2.getMinutes() - 10);
        console.log(date1 - date2);
        // 超过过期时间了
        if (date1 > date2) {
          this.$router.push({ name: "login" });
          location.reload();
          localStorage.setItem("access_token", ""); // token
          // 跳转登录
        } else {
          if (this.settimer) {
            clearTimeout(this.settimer);
          }
          this.settimer = setTimeout(() => {
            this.updateToken();
          }, date2 - date1);
        }
      }
    },
    // 更新令牌
    updateToken() {
      const token = localStorage.getItem("access_token");
      const { name: routeName } = this.$route;

      if (!token && routeName !== "login") {
        return false;
      }

      loginUpdate().then(res => {
        if (res.data.status !== 0) {
          return;
        }
        var serverTime = new Date(res.data.data.SERVER_TIME.replace(/-/g, "/"));
        var localTime = new Date();
        var timeSpan = localTime - serverTime; // 本地时间与服务器时间的差值

        localStorage.setItem("token_expires_at", res.data.data.EXPIRES_AT); // token过期时间
        localStorage.setItem("access_token", res.data.data.ACCESS_KEY); // token
        localStorage.setItem("server_local_timeSpan", timeSpan); // 服务器时间与本地时间差

        this.init();
      });
    },
    getUnifiedTime() {
      var now = new Date();
      var serverLocalTimeSpan = localStorage.getItem("server_local_timeSpan");
      if (!serverLocalTimeSpan) {
        return now;
      }
      return new Date(now - serverLocalTimeSpan);
    }
  }
};
</script>
