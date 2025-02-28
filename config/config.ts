import { defineConfig } from 'umi'
export default defineConfig({
  routes: [
    { path: '/', component: 'home' },
    { path: '/video/:id', component: 'video' },
  ],
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/tailwindcss', '@umijs/plugins/dist/request'],
  tailwindcss: {},
  request: {},
})
