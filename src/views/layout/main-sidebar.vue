<template>
  <aside :class="'site-sidebar--' + sidebarLayoutSkin" class="site-sidebar">
    <div class="site-navbar__header">
      <h1 @click="$router.push({ name: 'home' })" class="site-navbar__brand">
        <em class="logo"></em>
        <a class="site-navbar__brand-lg" href="javascript:;" v-show="!sidebarFold" style="font-size: small">{{ title }}</a>
        <!-- <a class="site-navbar__brand-mini" href="javascript:;">医联体</a> -->
      </h1>
    </div>
    <div class="site-sidebar__inner">
      <el-menu
        :collapse="sidebarFold"
        :collapseTransition="false"
        unique-opened
        :default-active="menuActiveName || 'home'"
        class="site-sidebar__menu"
      >
        <sub-menu :dynamicMenuRoutes="dynamicMenuRoutes" :key="menu.menuId" :menu="menu" v-for="menu in menuList"></sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from "./main-sidebar-sub-menu";

export default {
  data() {
    return {
      dynamicMenuRoutes: [],
      title: "",
      hezhan: [
        {
          id: "1",
          pid: "1",
          text: "首页",
          Icon: "shouye",
          PageUrl: "home",
          Checked: false,
          sort: 1,
          menuType: 1,
          status: "1",
          children: []
        },
        {
          id: "1",
          pid: "0",
          text: "我的",
          Icon: "shouye",
          PageUrl: "my",
          Checked: false,
          sort: 1,
          menuType: 1,
          status: "1",
          children: [
            {
              id: "33",
              pid: "1",
              text: "所有项目",
              Icon: "",
              PageUrl: "report",
              Checked: false,
              sort: 2,
              menuType: 1,
              status: "1",
              children: []
            }
          ]
        },
        {
          id: "138",
          pid: "0",
          text: "项目",
          Icon: "xiangmu",
          Checked: false,
          sort: 1,
          menuType: 1,
          status: "1",
          children: [
            // {
            //   id: "142",
            //   pid: "1",
            //   text: "所有项目",
            //   Icon: "",
            //   PageUrl: "projectAll",
            //   Checked: false,
            //   sort: 2,
            //   menuType: 1,
            //   status: "1",
            //   children: []
            // },
            {
              id: "141",
              pid: "1",
              text: "所有项目",
              Icon: "",
              PageUrl: "projectCreate",
              Checked: false,
              sort: 2,
              menuType: 1,
              status: "1",
              children: []
            },
            {
              id: "191",
              pid: "1",
              text: "迭代",
              Icon: "",
              PageUrl: "iterateCreate",
              Checked: false,
              sort: 2,
              menuType: 1,
              status: "1",
              children: []
            },
            {
              id: "158",
              pid: "1",
              text: "需求",
              Icon: "",
              PageUrl: "demandCreate",
              Checked: false,
              sort: 2,
              menuType: 1,
              status: "1",
              children: []
            }
            // {
            //   id: "139",
            //   pid: "1",
            //   text: "我执行的",
            //   Icon: "",
            //   PageUrl: "projectDeal",
            //   Checked: false,
            //   sort: 2,
            //   menuType: 1,
            //   status: "1",
            //   children: []
            // },
            // {
            //   id: "140",
            //   pid: "1",
            //   text: "我参与的",
            //   Icon: "",
            //   PageUrl: "projectJoin",
            //   Checked: false,
            //   sort: 2,
            //   menuType: 1,
            //   status: "1",
            //   children: []
            // }
          ]
        }
        // {
        //   id: "188",
        //   pid: "0",
        //   text: "迭代",
        //   Icon: "diedai",
        //   Checked: false,
        //   sort: 1,
        //   menuType: 1,
        //   status: "1",
        //   children: [
        //     {
        //       id: "191",
        //       pid: "1",
        //       text: "我创建的",
        //       Icon: "",
        //       PageUrl: "iterateCreate",
        //       Checked: false,
        //       sort: 2,
        //       menuType: 1,
        //       status: "1",
        //       children: []
        //     },
        //     {
        //       id: "189",
        //       pid: "1",
        //       text: "我执行的",
        //       Icon: "",
        //       PageUrl: "iterateDeal",
        //       Checked: false,
        //       sort: 2,
        //       menuType: 1,
        //       status: "1",
        //       children: []
        //     },
        //     {
        //       id: "190",
        //       pid: "1",
        //       text: "我参与的",
        //       Icon: "",
        //       PageUrl: "iterateJoin",
        //       Checked: false,
        //       sort: 2,
        //       menuType: 1,
        //       status: "1",
        //       children: []
        //     }
        //   ]
        // },
        // {
        //   id: "155",
        //   pid: "0",
        //   text: "需求",
        //   Icon: "xuqiu",
        //   Checked: false,
        //   sort: 1,
        //   menuType: 1,
        //   status: "1",
        //   children: [
        //     {
        //       id: "158",
        //       pid: "1",
        //       text: "我创建的",
        //       Icon: "",
        //       PageUrl: "demandCreate",
        //       Checked: false,
        //       sort: 2,
        //       menuType: 1,
        //       status: "1",
        //       children: []
        //     },
        //     {
        //       id: "156",
        //       pid: "1",
        //       text: "我执行的",
        //       Icon: "",
        //       PageUrl: "demandDeal",
        //       Checked: false,
        //       sort: 2,
        //       menuType: 1,
        //       status: "1",
        //       children: []
        //     },
        //     {
        //       id: "157",
        //       pid: "1",
        //       text: "我参与的",
        //       Icon: "",
        //       PageUrl: "demandJoin",
        //       Checked: false,
        //       sort: 2,
        //       menuType: 1,
        //       status: "1",
        //       children: []
        //     }
        //   ]
        // }
      ]
    };
  },
  components: {
    SubMenu
  },
  computed: {
    sidebarLayoutSkin: {
      get() {
        return this.$store.state.common.sidebarLayoutSkin;
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      }
    },
    // menuList: {
    //   get() {
    //     console.log(this.$store.state.common.menuList);
    //     return this.$store.state.common.menuList;
    //   },
    //   set(val) {
    //     this.$store.commit("common/updateMenuList", val);
    //   }
    // },
    menuList: {
      get() {
        if (this.$store.state.user.userInfo.IsAdmin == "0") {
          this.hezhan.forEach(res => {
            if (res.children && res.children.length > 0) {
              let delectRouter = res.children.find(res => {
                return res.text == "所有项目";
              });
              let index = res.children.indexOf(delectRouter);
              index == -1 ? "" : res.children.splice(index, 1);
            }
          });
          return this.hezhan;
        } else {
          return this.hezhan;
        }
      },
      set() {}
    },
    menuActiveName: {
      get() {
        return this.$store.state.common.menuActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMenuActiveName", val);
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    },
    mainTabsActiveName: {
      get() {
        return this.$store.state.common.mainTabsActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMainTabsActiveName", val);
      }
    }
  },
  created() {
    this.title = window.SITE_CONFIG["orgName"];
    this.menuList = JSON.parse(sessionStorage.getItem("menuList") || "[]");
    this.dynamicMenuRoutes = JSON.parse(
      sessionStorage.getItem("dynamicMenuRoutes") || "[]"
    );
  }
};
</script>
<style lang="scss" scoped>
.logo {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url("../../../static/img/ico.jpg");
  background-size: 100%;
  margin-right: 5px;
}
</style>
