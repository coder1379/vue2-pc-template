// 获取 VUE_APP_ENV 非 NODE_ENV，测试环境依然 console
const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)
const plugins = [
  [
    'component',
    {
      libraryName: 'element-ui',
      styleLibraryName: "theme-chalk",

    }
  ]
]
// 去除 console.log
if (IS_PROD) {
  // plugins.push('transform-remove-console')
}

module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'usage', corejs: 3 }]],
  //plugins // 全局引入直接屏蔽
}
