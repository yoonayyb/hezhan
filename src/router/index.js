/* eslint-disable no-dupe-keys */
/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import {
  getUserInfo
} from '@/utils/api'
import {
  Message
} from 'element-ui'
// import accountEnquiry from './module/accountEnquiry'
// import reportQuery from './module/reportQuery'

Vue.use(Router)
// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)
console.log(process)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  //
  {
    path: '/404',
    component: _import('common/404'),
    name: '404',
    meta: {
      title: '404未找到'
    }
  },
  {
    path: '/login',
    component: _import('common/login'),
    name: 'login',
    meta: {
      title: '登录'
    }
  },
]

const consAndTransRoutes = [
  // 转诊新建和修改


]


// 动态本地路由组组件
const routerMap = {
  home: _import('common/home'),
  /// /系统设置路由
  sysUser: _import('sysSetting/sysUser/index'),
  baseDictInfo: _import('sysSetting/baseDict/dict/index'),
  baseDictType: _import('sysSetting/baseDict/type/index'),
  mobieVision: _import('sysSetting/baseDict/mobieVision/index'),
  billingManage: _import('sysSetting/billingManage/billing/index'),
  divide: _import('sysSetting/billingManage/divide/index'),
  medicalRecordType: _import('sysSetting/baseDict/recordType/index'),
  romoteDrug: _import('sysSetting/baseDict/remoteClinicDrugs/index'),
  sysMenu: _import('sysSetting/sysMenu/index'),
  sysRole: _import('sysSetting/sysRole/index'),
  sysRoleEdit: _import('sysSetting/sysRole/edit'),
  // sysRolePermission: _import('sysSetting/sysRole/permission')
  deptAuth: _import('sysSetting/deptAuth/index'),
  sysUersRole: _import('sysSetting/sysUersRole/index'),
  sysOptLogs: _import('sysSetting/sysOptLogs/index'),
  sysErrorEx: _import('sysSetting/sysErrorEx/index'),

  // 医院管理
  baseOrg: _import('mechanism/baseOrg/index'),
  baseDept: _import('mechanism/baseDept/index'),
  baseDoctor: _import('mechanism/baseDoctor/index'),
  orgDevice: _import('mechanism/ORG_device/index'),
  OrgField: _import('mechanism/ORG_field/index'),

  // 病人
  // patient: _import('patient/index'),


  // 流程管理 workflow
  workflowLinkDefine: _import('workflow/linkDefine/index'), // 审批流程定义
  workflow: _import('workflow/workflow/index'), // 审批流程定义

}
// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('layout/main'),
  name: 'main',
  redirect: {
    name: 'home'
  },
  meta: {
    title: '主入口整体布局'
  },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {
      path: '/home',
      component: _import('common/home'),
      name: 'home',
      meta: {
        title: '首页',
        isTab: true
      }
    },
    {
      path: '/iterateDeal',
      component: _import('iterate/iterateDeal'),
      name: 'iterateDeal',
      meta: {
        title: '我执行的',
        isTab: true
      }
    },
    {
      path: '/iterateJoin',
      component: _import('iterate/iterateJoin'),
      name: 'iterateJoin',
      meta: {
        title: '我参与的',
        isTab: true
      }
    },
    {
      path: '/iterateCreate',
      component: _import('iterate/iterateCreate'),
      name: 'iterateCreate',
      meta: {
        title: '我创建的',
        isTab: true
      }
    },
    {
      path: '/demandDeal',
      component: _import('demand/demandDeal'),
      name: 'demandDeal',
      meta: {
        title: '我执行的',
        isTab: true
      }
    },
    {
      path: '/demandJoin',
      component: _import('demand/demandJoin'),
      name: 'demandJoin',
      meta: {
        title: '我参与的',
        isTab: true
      }
    },
    {
      path: '/demandCreate',
      component: _import('demand/demandCreate'),
      name: 'demandCreate',
      meta: {
        title: '我创建的',
        isTab: true
      }
    },
    {
      path: '/projectSee',
      component: _import('projectFile/dialog/projectSee'),
      name: 'projectSee',
      meta: {
        title: '项目详情'
      }
    },
    {
      path: '/demandSee',
      component: _import('demand/dialog/demandSee'),
      name: 'demandSee',
      meta: {
        title: '需求详情'
      }
    },
    {
      path: '/iterateSee',
      component: _import('iterate/dialog/iterateSee'),
      name: 'iterateSee',
      meta: {
        title: '迭代详情'
      }
    },
    {
      path: '/report',
      component: _import('my/report'),
      name: 'report',
      meta: {
        title: '工作汇报'
      }
    },
    // {
    //   path: '/bypertensionBase',
    //   component: _import('hypertension/hypertensionBase'),
    //   name: 'bypertensionBase',
    //   meta: {
    //     title: '高血压基础信息',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/bloodPressureInfo',
    //   component: _import('hypertension/hypertensionRecord'),
    //   name: 'bloodPressureInfo',
    //   meta: {
    //     title: '血压记录信息',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/constitutionInfo',
    //   component: _import('hypertension/constitutionInfo'),
    //   name: 'constitutionInfo',
    //   meta: {
    //     title: '体质指数信息',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/GlycatedInfo',
    //   component: _import('hypertension/glycatedInfo'),
    //   name: 'GlycatedInfo',
    //   meta: {
    //     title: '糖化血红蛋白信息',
    //     isTab: true
    //   }
    // },
    {
      path: '/projectAll',
      component: _import('projectFile/projectAll'),
      name: 'projectAll',
      meta: {
        title: '所有项目',
        isTab: true
      }
    },
    {
      path: '/projectDeal',
      component: _import('projectFile/projectDeal'),
      name: 'projectDeal',
      meta: {
        title: '我执行的',
        isTab: true
      }
    },
    {
      path: '/projectJoin',
      component: _import('projectFile/projectJoin'),
      name: 'projectJoin',
      meta: {
        title: '我参与的',
        isTab: true
      }
    },
    {
      path: '/projectCreate',
      component: _import('projectFile/projectCreate'),
      name: 'projectCreate',
      meta: {
        title: '我创建的',
        isTab: true
      }
    },
    // {
    //   path: '/ChronicImport',
    //   component: _import('patientFilesManage/ChronicImport'),
    //   name: 'ChronicImport',
    //   meta: {
    //     title: '慢病信息导入',
    //     isTab: true
    //   }
    // },
    {
      path: '/noticeSettings',
      component: _import('sysSetting/noticeSettings/index'),
      name: 'noticeSettings',
      meta: {
        title: '通知设置',
        isTab: true
      }
    },
    // ...consAndTransRoutes,
    // ...medicalRecordRoutes, // 病历
    // ...pathology.static,
    // ...remotePacs.static,
    // ...remoteBmode.static,
    // ...remotePacsNew.static,
    // {
    //   path: '/sysRole/edit',
    //   component: _import('sysSetting/sysRole/edit'),
    //   name: 'sysRoleEdit',
    //   meta: {
    //     title: '编辑角色信息',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/sysRole/permission',
    //   component: _import('sysSetting/sysRole/permission'),
    //   name: 'sysRolePermission',
    //   meta: {
    //     title: '编辑角色权限',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/patient/essentialInfo/:ID',
    //   component: _import('patient/essentialInfo'),
    //   name: 'patientEssentialInfo',
    //   meta: {
    //     title: '病人基本信息',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/patient/edit',
    //   component: _import('patient/edit'),
    //   name: 'patientEdit',
    //   meta: {
    //     title: '病人信息',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/deptAuth/edit',
    //   component: _import('sysSetting/deptAuth/edit'),
    //   name: 'deptAuthEdit',
    //   meta: {
    //     title: '部门权限修改',
    //     isTab: false
    //   }
    // },
    // {
    //   path: '/sysUser/permission',
    //   component: _import('sysSetting/sysUser/permission'),
    //   name: 'sysUserPermission',
    //   meta: {
    //     title: '个人权限',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/deptAuth/permission',
    //   component: _import('sysSetting/deptAuth/permission'),
    //   name: 'deptAuthPermission',
    //   meta: {
    //     title: '部门权限编辑',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/workflow/detail',
    //   component: _import('workflow/workflow/detail'),
    //   name: 'workflowDetail',
    //   meta: {
    //     title: '流程管理详情',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/workflow/personnel',
    //   component: _import('workflow/workflow/personnel'),
    //   name: 'workflowPersonnel',
    //   meta: {
    //     title: '流程管理人员',
    //     isTab: true
    //   }
    // },

    {
      path: '/changePassword',
      component: _import('common/changePassword'),
      name: 'changePassword',
      meta: {
        title: '修改密码',
        isTab: false
      }
    },

    /*
     * 不与业务相关
     * */
    {
      path: '/theme',
      component: _import('common/theme'),
      name: 'theme',
      meta: {
        title: '主题1'
      }
    }
  ],
  beforeEnter(to, from, next) {
    let token = localStorage.getItem('access_token') // token
    if (!token || !/\S/.test(token)) {
      localStorage.setItem('access_token', '') // token
      next({
        name: 'login'
      })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  // mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
        } else {
          resolve({
            x: 0,
            y: 0
          })
        }
      }, 500)
    })
  },
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})
let adminRouter = {
  path: '/patientAll',
}
let contrl = true
router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储

  // console.log(store.state.user.userInfo, contrl)
  // if (store.state.user.userInfo && store.state.user.userInfo.IsAdmin == '0' && contrl) {
  //   let delectRouter = mainRoutes.children.find(res => {
  //     return res.path == adminRouter.path
  //   })
  //   let index = mainRoutes.children.indexOf(delectRouter)
  //   console.log(index)
  //   index == -1 ? '' : mainRoutes.children.splice(index, 1)
  //   contrl = false
  // }
  if (
    router.options.isAddDynamicMenuRoutes ||
    fnCurrentRouteType(to) === 'global' ||
    mainRoutes.length > 1 ||
    to.name === 'login'
  ) {
    next()
  } else {
    next({
      replace: true
    })
    return
    getUserInfo().then(res => {
      const status = res.data.status
      if (status === 0) {
        const listTree = res.data.data.listTree
        // listTree.push(reportRoute)
        fnAddDynamicMenuRoutes(listTree) // 构造服务器返回的菜单，构造成vue-router能渲染的菜单
        router.options.isAddDynamicMenuRoutes = true // 是否已经添加动态(菜单)路由
        sessionStorage.setItem('menuList', JSON.stringify(listTree || '[]')) // 路由保存到sessionStorage
        // sessionStorage.setItem('menuList', JSON.stringify(reportRoute || '[]'))
        next({
          ...to,
          replace: true
        })
      } else {
        Message.error(res.data.msg)
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next({
          name: 'login'
        })
      }
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (
      globalRoutes[i].children &&
      globalRoutes[i].children.length >= 1
    ) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
// 构建动态菜单
let allRoutes = []

function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    allRoutes.push(menuList[i])
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].PageUrl && /\S/.test(menuList[i].PageUrl)) {
      menuList[i].PageUrl = menuList[i].PageUrl.replace(/^\//, '')

      if (routerMap[menuList[i].PageUrl]) {
        var route = {
          path: '/' + menuList[i].PageUrl || '',
          component: routerMap[menuList[i].PageUrl],
          name: menuList[i].PageUrl,
          meta: {
            menuId: menuList[i].id,
            title: menuList[i].text,
            isDynamic: true,
            isTab: true,
            keepAlive: true,
            pid: menuList[i].pid,
            Powers: menuList[i].Powers.split(',')
          }
        }
        routes.push(route)
      }
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      {
        path: '*',
        redirect: {
          name: '404'
        }
      }
    ])
    sessionStorage.setItem(
      'dynamicMenuRoutes',
      JSON.stringify(mainRoutes.children || '[]')
    )
    sessionStorage.setItem('allRoutes', JSON.stringify(allRoutes || '[]'))

    console.log('\n')
    console.log(
      '%c!<-------------------- 动态(菜单)路由 s -------------------->',
      'color:blue'
    )
    console.log(mainRoutes.children)
    console.log(
      '%c!<-------------------- 动态(菜单)路由 e -------------------->',
      'color:blue'
    )
  }
}

export default router
