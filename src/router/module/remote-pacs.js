const _import = require('../import-' + process.env.NODE_ENV)

export default {
  dynamic: {
    remotPacsApproval: _import('remote-pacs/approval/index'),
    remotePacsApply: _import('remote-pacs/apply/index'),
    remotePacsRecord: _import('remote-pacs/record/index'),
    remotePacsPartake: _import('remote-pacs/partake/index')
  },
  static: [
    {
      path: '/remotePacs/edit',
      component: _import('remote-pacs/apply/edit'),
      name: 'remotePacsEdit',
      meta: {
        title: '远程影像申请',
        isTab: true
      }
    },
    {
      path: '/remotePacs/detail/:ID/:PatiendId',
      component: _import('remote-pacs/common/detail'),
      name: 'remotePacsDetail',
      meta: {
        title: '远程影像详情',
        isTab: true
      }
    }
  ]
}
