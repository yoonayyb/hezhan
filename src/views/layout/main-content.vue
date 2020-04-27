<template>
  <main :class="{ 'site-content--tabs': $route.meta.isTab }" class="site-content" style="background:#fff;padding:0">
    <!-- <el-card
      :body-style="{position:'relative'}"
      shadow="hover"
      v-if="$route.name != 'discipline-alliance'"
    >-->

    <div class="site-body">
      <!-- <el-breadcrumb separator="/"
                     v-if="breadcrumbList&&breadcrumbList.length>0">
        <el-breadcrumb-item :key="index+'n'"
                            v-for="(item,index) in breadcrumbList">
          <span class="no-redirect"
                v-if="!item.PageUrl">{{ item.text }}</span>
          <router-link :to="{name:item.pageUrl}"
                       v-else>{{ item.text}}</router-link>

        </el-breadcrumb-item>

      </el-breadcrumb>-->

      <keep-alive>
        <router-view :key="key" v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view :key="key" v-if="!$route.meta.keepAlive"/>
    </div>
    <!-- </el-card> -->
    <!-- 学科联盟主页不使用el-card组件 -->
    <!-- <div
      class="discipline-alliance-wrapper"
      v-else
    >
      <keep-alive>
        <router-view
          :key="key"
          v-if="$route.meta.keepAlive"
        />
      </keep-alive>
      <router-view
        :key="key"
        v-if="!$route.meta.keepAlive"
      />
    </div>-->
  </main>
</template>

<script>
import { isURL } from "@/utils/validate";

export default {
  mounted() {
    this.routeChange();
  },
  data() {
    return {
      breadcrumbList: []
    };
  },
  watch: {
    $route: function(val) {
      this.routeChange();
    }
  },
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    },
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      }
    },
    siteContentViewHeight() {
      var height = this.documentClientHeight - 50 - 30 - 2;
      if (this.$route.meta.isTab) {
        height -= 40;
        return isURL(this.$route.meta.iframeUrl)
          ? { height: height + "px" }
          : { minHeight: height + "px" };
      }
      return { minHeight: height + "px" };
    }
  },
  methods: {
    routeChange() {
      // console.log(this.$route)
      const allRoutes = JSON.parse(sessionStorage.getItem("allRoutes") || "[]");
      this.breadcrumbList = [];
      if (!this.$route.meta.menuId) {
        return;
      }
      const that = this;
      const current = allRoutes.find(item => {
        return item.id === this.$route.meta.menuId;
      });

      if (current.pid === 0) {
        this.breadcrumbList.push(current);
      } else {
        (function routeRecursion(pid) {
          let parentRoute = allRoutes.find(item => {
            return item.id === pid;
          });
          if (parentRoute) {
            if (parentRoute.pid && parentRoute.pid !== 0) {
              routeRecursion(parentRoute.pid);
            }
          }
          that.breadcrumbList.push(parentRoute);
        })(this.$route.meta.pid);
        this.breadcrumbList.push(current);
      }
      // if (current.id = 9999 && current.id <= 212 && current.id >= 205) {
      //   this.breadcrumbList.push({
      //     Checked: false,
      //     Icon: null,
      //     PageUrl: 'reportDetail',
      //     Powers: 'edit,del,add,list',
      //     appIcon: null,
      //     appPageUrl: null,
      //     children: null,
      //     id: 9999,
      //     menuType: 1,
      //     pid: 0,
      //     sort: 4,
      //     state: null,
      //     text: '报告详情'
      //   })
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.site-body {
  background-color: #fff;
}
.report {
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1;
  box-sizing: border-box;
}
</style>
