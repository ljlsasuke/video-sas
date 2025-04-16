module.exports = {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#818cf8',
        black: '#15181e',
      },
      height: {
        tn: '48px', // 顶部TopNav的高度
      },
      margin: {
        mtn: '58px', // 下面元素和顶部TopNav的距离
      },
      inset: {
        tn: '58px', // 同mtn，这个是给（top/right/bottom/left）用的
      },
    },
  },
}
