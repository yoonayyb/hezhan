const _import = require('../import-' + process.env.NODE_ENV)

export default {
  dynamic: {
    pathologyApply: () => import('@/views/remote-pathology/apply/index.vue'),
    waitPathology: () =>
      import('@/views/remote-pathology/wait-pathology/index.vue'),
    statisticalQuery: () => import('@/views/remote-pathology/statisticalQuery/index.vue'),
    recordPathology: () => import('@/views/remote-pathology/record/index.vue'),
    approvalPathology: () =>
      import('@/views/remote-pathology/approval/index.vue')
  },
  static: [
    {
      path: '/pathologyDetail/:ID/:PatiendId',
      component: _import('remote-pathology/common/detail'),
      name: 'pathologyDetail',
      props: {
        pathologyType: ''
      },
      meta: {
        title: '病理详情',
        isTab: true
      }
    },
    {
      path: '/waitPathologyDetail/:ID/:PatiendId',
      component: () => import('@/views/remote-pathology/common/detail.vue'),
      name: 'waitPathologyDetail',
      props: {
        pathologyType: 'wait'
      },
      meta: {
        title: '病理详情',
        isTab: true
      }
    },
    {
      path: '/approvalPathologyDetail/:ID/:PatiendId',
      component: () => import('@/views/remote-pathology/common/detail.vue'),
      name: 'approvalPathologyDetail',
      props: {
        pathologyType: 'approval'
      },
      meta: {
        title: '病理详情',
        isTab: true
      }
    },
    {
      path: '/applyPathologyDetail/:ID/:PatiendId',
      component: () => import('@/views/remote-pathology/common/detail.vue'),
      name: 'applylPathologyDetail',
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
