import path from 'path'
import { defineConfig } from 'umi'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export default defineConfig({
  routes: [
    { path: '/', component: 'home' },
    { path: '/video/:bv', component: 'video' },
    { path: '/search', component: 'search' },
    {
      path: '/space/:id',
      component: 'space',
      routes: [
        { path: '/space/:id', redirect: '/space/:id/collection' },
        { path: '/space/:id/upload', component: 'space/upload' },
        { path: '/space/:id/collection', component: 'space/collection' },
        { path: '/space/:id/watchlater', component: 'space/watchlater' },
        { path: '/space/:id/watchHistory', component: 'space/watchHistory' },
      ],
    },
  ],
  npmClient: 'pnpm',
  favicons: ['/logo.svg'],
  plugins: ['@umijs/plugins/dist/tailwindcss'],
  tailwindcss: {
    // 设置超时时间为 10 秒（单位：毫秒）
    // 此配置无用，正确方法如下
    // https://github.com/umijs/umi/issues/12563#issuecomment-2746306307
    // timeout: 10000,
  },
  define: {
    'process.env.UMI_APP_API_URL': process.env.UMI_APP_API_URL,
    'process.env.UMI_APP_ENV': process.env.UMI_APP_ENV,
    'process.env.UMI_APP_STATIC_URL': process.env.UMI_APP_BACK_URL,
  },
  proxy: {
    '/media': {
      target: process.env.UMI_APP_BACK_URL,
      changeOrigin: true,
    },
  },
  vite: {
    plugins: [
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  },
})
