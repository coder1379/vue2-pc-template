/**
 * 基础路由 children主要用于layout区分,children中 path均带上/
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    // 首页layout模板及内嵌的页面
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页类型layout',
      keepAlive: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', keepAlive: true, excludeScroll: true }
      },
      {
        // demo 页面 用于开发快速复制和组件使用查看
        path: '/dev-demo',
        name: 'DevDemo',
        component: () => import('@/views/demo/index'),
        meta: { title: 'Demo', keepAlive: true, visitorCheck: true }
      },
      {
        // demo-list 页面 用于开发快速复制和组件使用查看
        path: '/dev-demo/copy-base-list',
        name: 'DevDemoList',
        component: () => import('@/views/demo/copy-base-list'),
        meta: { title: 'DemoList', keepAlive: true, visitorCheck: true }
      },
      {
        // demo-page 全屏活动页
        path: '/dev-demo/all-page-test',
        name: 'All-page-test',
        component: () => import('@/views/demo/all-page-test'),
        meta: { title: 'all-page-test', visitorCheck: true }
      },
      {
        path: '/my',
        name: 'My',
        component: (resolve) => require(['@/views/my/index'], resolve), // 懒加载页面示例
        // component: () => import('@/views/my/index'),
        meta: { title: '我的', visitorCheck: true }
      }
    ]
  },
  {
    // footer-layout页面及子页面 页面带有头部
    path: '/footer-layout',
    component: () => import('@/views/layouts/footer'),
    redirect: '/home',
    meta: {
      title: 'footer-layout',
      keepAlive: false
    },
    children: [
      {
        // my setting
        path: '/my/set',
        name: 'MySet',
        component: () => import('@/views/my/set'),
        meta: { title: '设置', keepAlive: true, loginCheck: true }
      }
    ]
  },
  {
    // 无layout 路由 页面
    path: '/home/about',
    name: 'About',
    component: () => import('@/views/home/about'),
    meta: { title: '关于我们', visitorCheck: true }
  },
  {
    // 登录
    path: '/login',
    name: 'Login',
    component: () => import('@/views/home/login'),
    meta: { title: '登录', visitorCheck: true }
  },
  {
    // login
    path: '/wxlogin',
    name: 'Wxlogin',
    component: () => import('@/views/home/wxlogin'),
    meta: { title: '' }
  },
  // template 模板路径开始 根据需要移除 ssssssssssssssssssssss
  {
    // 登录页面模式 1
    path: '/template/login/login_1',
    name: 'TemplateLogin1',
    component: () => import('@/views/template/login/login_1'),
    meta: { title: '密码登录模板1' }
  },
  // template 模板路径结束 根据需要移除 eeeeeeeeeeeeeeeeeeeeee

  //  ////添加新路径写入到此行之上
  {
    // 404 路由不匹配时重定向页面
    path: '/404',
    name: '404',
    component: () => import('@/views/home/404'),
    meta: { title: '404' }
  },
  {
    // 最后的权限匹配，如果没有符合条件的页面将重定向到404
    path: '*',
    name: 'noPath',
    redirect: to => {
      console.log('页面没有找到发生重定向:')
      console.log(to)
      return { path: '/404' }
    },
    meta: { title: '' },
    hidden: true
  }
]
