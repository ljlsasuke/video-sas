import path from 'path'
import { defineConfig } from 'umi'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export default defineConfig({
  routes: [
    { path: '/', component: 'home' },
    { path: '/video/:id', component: 'video' },
    { path: '/search', component: 'search' },
  ],
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/tailwindcss', '@umijs/plugins/dist/request'],
  tailwindcss: {
    timeout: 10000, // 10s 算启动超时
  },
  request: {},
  define: {
    'process.env.UMI_APP_API_URL': process.env.UMI_APP_API_URL,
    'process.env.UMI_APP_ENV': process.env.UMI_APP_ENV,
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
