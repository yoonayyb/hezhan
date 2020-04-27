<template>
  <el-submenu
    v-if="menu.children && menu.children.length >= 1"
    :index="menu.id + 'menu'"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'"
  >
    <template slot="title">
      <icon-svg :name="menu.Icon||''" class="site-sidebar__menu-icon" v-if="menu.pid===0"></icon-svg>
      <span>{{ menu.text }}</span>
    </template>
    <sub-menu v-for="item in menu.children" :key="item.Id" :menu="item" :dynamicMenuRoutes="dynamicMenuRoutes"></sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.id + ''" @click="gotoRouteHandle(menu)">
    <icon-svg :name="menu.Icon || ''" class="site-sidebar__menu-icon" v-if="menu.pid===0"></icon-svg>
    <span>{{ menu.text }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from "./main-sidebar-sub-menu";
export default {
  name: "sub-menu",
  props: {
    menu: {
      type: Object,
      required: true
    },
    dynamicMenuRoutes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      quanxian: this.$store.state.user.userInfo.IsAdmin
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
    }
  },
  methods: {
    gotoRouteHandle(menu) {
      console.log(menu);
      if (menu && menu.PageUrl !== "") {
        this.$router.push({ name: menu.PageUrl });
      }
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      // let route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.id)
      // if (route.length >= 1) {
      //   this.$router.push({ name: route[0].name })
      // }
    }
  }
};
</script>
