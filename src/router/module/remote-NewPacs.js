const _import = require('../import-' + process.env.NODE_ENV)

export default {
  dynamic: {
    remotPacsApprovalNew: _import('remote-NewPacs/approval/index'), // 审核报告
    remotePacsApplyNew: _import('remote-NewPacs/apply/index'), // 影像申请
    remotePacsRecordNew: _import('remote-NewPacs/record/index'), // 影像记录
    remotePacsRecordSecond: _import('remote-NewPacs/record/indexII'), // 影像记录II
    remotePacsWaitPathology: _import('remote-NewPacs/wait-pathology/index'), // 影像签收
    remotePacsStatisticalQuery: _import('remote-NewPacs/statisticalQuery/index') // 影像统计
  },
  static: [{
    path: '/pacsDetail/:ID/:PatiendId',
    component: _import('remote-NewPacs/common/detail'),
    name: 'pacsDetail',
    props: {
      pathologyType: ''
    },
    meta: {
      title: '影像详情',
      isTab: true
    }
  },
  {
    path: '/waitPacsDetail/:ID/:PatiendId',
    component: () => import('@/views/remote-NewPacs/common/detail.vue'),
    name: 'waitPacsDetail',
    props: {
      pathologyType: 'wait'
    },
    meta: {
      title: '影像详情',
      isTab: true
    }
  },
  {
    path: '/approvalPacsDetail/:ID/:PatiendId',
    component: () => import('@/views/remote-NewPacs/common/detail.vue'),
    name: 'approvalPacsDetail',
    props: {
      pathologyType: 'approval'
    },
    meta: {
      title: '病理详情',
      isTab: true
    }
  },
  {
    path: '/applyPacsDetail/:ID/:PatiendId',
    component: () => import('@/views/remote-NewPacs/common/detail.vue'),
    name: 'applylPacsDetail',
    props: {
      pathologyType: 'apply'
    },
    meta: {
      title: '病理详情',
      isTab: true
    }
  }
  ]
}
