module.exports = {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
      },

      height: {
        tn: '48px', // 顶部TopNav的高度
      },
      margin: {
        mtn: '58px', // 下面元素和顶部TopNav的距离
      },
    },
  },
}
