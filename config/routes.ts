export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './User/Login'},
      {name: '注册', path: '/user/register', component: './User/Register'}
    ],
  },
  // {path: '/',redirect: '/add_chart'},
  {path: '/welcome', name: '首页', icon: 'home', component: './Welcome'},
  {path: '/add_chart', name: '智能分析', icon: 'lineChart', component: './AddChart'},
  {path: '/add_chart_async', name: '智能分析（异步）', icon: 'barChart', component: './AddChartAsync'},
  {path: '/my_chart', name: '我的图表', icon: 'pieChart', component: './MyChart'},
  {path: '/profile', name: '个人中心', icon: 'UserOutlined', component: './User/Profile'},
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];
