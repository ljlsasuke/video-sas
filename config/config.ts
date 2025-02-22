import { defineConfig } from 'umi'
export default defineConfig({
  routes: [
    { path: '/', component: 'home' },
    { path: '/video/:id', component: 'video' },
  ],
  npmClient: 'pnpm',
  plugins: [
    '@umijs/plugins/dist/tailwindcss',
    '@umijs/plugins/dist/request',
    '@umijs/plugins/dist/antd',
  ],
  tailwindcss: {},
  request: {},
  antd: {
    style: 'less', // 或 'css'，根据项目配置
    // theme: {
    //   '@primary-color': '#1DA57A',
    // },
  },
})
