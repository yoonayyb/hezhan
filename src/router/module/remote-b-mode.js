const _import = require('../import-' + process.env.NODE_ENV)

export default {
  dynamic: {
    // remoteBmodeApproval: _import('remote-b-mode/approval/index'),
    // remoteBmodeApply: _import('remote-b-mode/apply/index'),
    // remoteBmodeRecord: _import('remote-b-mode/record/index'),
    // remoteBmodePartake: _import('remote-b-mode/partake/index'),
    // remoteBmodeStatistical: _import('remote-b-mode/statisticalQuery/index')

  },
  static: [
    // {
    //   path: '/remoteBmodeEdit/edit',
    //   component: _import('remote-b-mode/apply/edit'),
    //   name: 'remoteBmodeEdit',
    //   meta: {
    //     title: '远程B超申请',
    //     isTab: true
    //   }
    // },
    // {
    //   path: '/remoteBmode/detail/:ID/:PatiendId',
    //   component: _import('remote-b-mode/common/detail'),
    //   name: 'remoteBmodeDetail',
    //   meta: {
    //     title: '远程B超详情',
    //     isTab: true
    //   }
    // }
  ]
}
