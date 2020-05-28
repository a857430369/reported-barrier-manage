import Layout from '@/layout'
//路由加载方法
function load(component) {
  return (resolve) => require([`@/views/${component}`], resolve)
}

let router = [
  {
    path: '/workDesk',
    redirect: '/workDesk/index',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/work-desk/index'),
        name: 'workDesk',
        meta: { title: '工作台', noCache: true },
      },
      {
        path: 'upload',
        name: '文件上传',
        component: load('upload-manage/upload'),
        meta: {
          title: '文件上传'
        }
      },
      {
        path: 'download',
        name: '文件下载',
        component: load('upload-manage/download'),
        meta: {
          title: '文件下载'
        }
      },
      {
        path: 'noticeShow',
        name: '公告管理',
        component: load('notice/notice_show'),
        meta: { title: '公告管理', noCache: true },
      },
      {
        path: 'noticeSee',
        name: '通知通告',
        component: load('notice/notice_see'),
        meta: { title: '通知通告', noCache: true },
      },
      {
        path: 'cf-deployManage',
        name: '模板管理',
        component: () => import('@/views/custom-form/manage/deployManage'),
        meta: {
          title: '模板管理',
        },
      },
      {
        path: 'classify',
        name: '分类管理',
        component: load('classify-page/classify'),
        meta: {
          title: '分类管理',
        },
      },
      {
        path: 'parameter',
        name: '参数管理',
        component: load('parameter-page/parameter'),
        meta: {
          title: '参数管理',
        },
      },

      {
        path: 'pendingPool',
        name: '待处理工单池',
        component: load('pool-page/pendingPool'),
        meta: {
          title: '待处理工单池',
        },
      },
      {
        path: 'allPool',
        name: '全部工单池',
        component: load('pool-page/allPool'),
        meta: {
          title: '全部工单池',
        },
      },
      {
        path: 'employeesList',
        name: '订单处理列表',
        component: load('pool-page/employees/employees-list'),
        meta: {
          title: '订单处理列表',
        },
      },
      {
        path: 'workorderList',
        name: '历史工单',
        component: load('pool-page/user/workorder-list'),
        meta: {
          title: '历史工单',
        },
      },
      {
        path: 'knowlegdeUser',
        name: '知识库',
        component: () => import('@/views/knowledge/knowlegde_user'),
        meta: {
          title: '知识库',
        },
      },
      {
        path: 'knowManage',
        name: '知识库管理',
        component: () => import('@/views/knowledge/knowManage'),
        meta: {
          title: '知识库管理',
        },
      },
      {
        path: 'knowledgeShow',
        name: '知识库展示',
        component: load('notice/notice_new'),
        meta: {
          title: '知识库展示',
        },
      },
      {
        path: 'annoucementShow',
        name: '通知通告详情',
        component: load('notice/notice_new'),
        meta: {
          title: '通知通告详情',
        },
      },
    ],
  },

  {
    path: '/test',
    name: '测试',
    component: load('test/test'),
    meta: {
      title: '测试',
    },
  },
  // {
  //   path: '/pendingList',
  //   name: '待处理列表',
  //   component: load('pool-page/employees/pending-list'),
  //   meta: {
  //     title: '待处理列表'
  //   }
  // }, {
  //   path: '/beingProcessedList',
  //   name: '处理中列表',
  //   component: load('pool-page/employees/being-processed-list'),
  //   meta: {
  //     title: '待处理列表'
  //   }
  // }, {
  //   path: '/processedList',
  //   name: '已处理列表',
  //   component: load('pool-page/employees/processed-list'),
  //   meta: {
  //     title: '已待处理列表'
  //   }
  // }, {
  //   path: '/grouping',
  //   name: '分组管理',
  //   component: load('group-page/group'),
  //   meta: {
  //     title: '分组管理'
  //   }
  // }, {
  //   path: '/user',
  //   name: '用户管理',
  //   component: load('user-page/user'),
  //   meta: {
  //     title: '用户管理'
  //   }
  // }, {
  //   path: 'chat',
  //   name: '聊天',
  //   component: load('chat-page/index'),
  //   meta: {
  //     title: '聊天'
  //   }
  // },
]

export { router }
