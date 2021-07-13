import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      redirect: '/layout/home',
      component: '@/pages/layout/index',
    },
    {
      path: '/layout',
      component: '@/pages/layout/index',
      routes: [
        {
          path: '/layout/home',
          component: '@/pages/home/index',
        },
        {
          path: '/layout/shop',
          component: '@/pages/shop/index',
        },
        {
          path: '/layout/color',
          component: '@/pages/colorCard/index',
        },
        {
          path: '/layout/addArticle',
          component: '@/pages/addArticle/index',
        },
        {
          path: '/layout/plan',
          component: '@/pages/plan/index',
        },
      ],
    },
    {
      path: '/login',
      component: '@/pages/login/index',
    },
  ],
  fastRefresh: {},
  sass: {
    implementation: require('node-sass'),
  },
  alias: {
    images: '/src/images',
  },
  dva: {
    immer: { enableES5: true }, //表示是否启用 immer 以方便修改 reducer。
    hmr: true, //表示是否启用 dva model 的热更新。
    lazyLoad: true, //懒加载 dva models，如果项目里 models 依赖了 import from umi 导出模块，建议开启，避免循环依赖导致模块 undefined 问题。
  },
});
