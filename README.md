# vue2-pc-template Vue+element ui 

#使用流程
1.复制项目
2.安装依赖 npm install or yarn install
3.修改vue.config.js,src/config/env.*.js(环境配置文件),调整需要页面，如百度统计[public/index.html,actionInitEndBack()]
4.npm run serve

#环境说明
NODE_ENV = node环境的变量，例如 测试也想按照生产环境的模式更好保障生产环境的正确性可以将stage也设置为 production 目前测试环境就是production
VUE_APP_ENV = app对应环境，例如调用的接口要是生产还是测试就根据这个参数，测试=测试，生产=生产。 注意vue.config.js 中的默认环境就是这个值，其他环境要判断也同个这个参数进行控制。



#aliyun，docker测试环境
```
构建脚本
# input your command here
yarn install
npm run build

部署脚本
#! /bin/bash
dirName=$(date "+%Y-%m-%d_%H-%M-%S")
fileDev="/home/publish/vueh5template/unzip/${dirName}"
mkdir -p ${fileDev}
tar zxvf /home/publish/vueh5template/package.tgz -C $fileDev
\cp -rf ${fileDev}/* /home/publish/vueh5template/runcode

ECS
mkdir /home/publish/vueh5template/nginx_conf,/home/publish/vueh5template/runcode,/home/publish/vueh5template/unzip
vim deault.conf 同项目dockerconfig default.conf

host api.vueh5template.com 到指定ip 

docker run -d -p 50808:80 -v /home/publish/vueh5template/runcode:/usr/share/nginx/html -v /home/publish/vueh5template/nginx_conf:/etc/nginx/conf.d/ --restart=always --name vue-h5-template nginx:latest

```

启动项目
----------------------------------------------
`package.json` 里的 `scripts` 配置 `serve` `stage` `build`，通过 `--mode xxx` 来执行不同环境

- 通过 `npm run serve` 启动本地 , 执行 `development`
- 通过 `npm run stage` 打包测试 , 执行 `staging` 需要测试环境配置nginx重写404到index，避免vue页面刷新404
- 通过 `npm run build` 打包正式 , 执行 `production` 需要环境配置nginx重写404到index，避免vue页面刷新404

router.config.js 参数解释
-------------------------------------------------
meta 内参数：keepAlive 是否缓存页面（配合）
            excludeScroll 是否排除滚动（特定情况下配合keepAlive使用）
            visitorCheck 是否进行游客验证 正常情况下 visitorCheck和loginCheck只有一个需要检查，也只能设置1个为true
            loginCheck 是否进行登录验证 后端接口也会校验权限，并返回对应值，前端先行校验一次，如业务较为复杂可考虑直接放弃全都校验全由后端处理。
           


二级目录模式需调整地方
--------------------------------------------------------
vue.config.js  module.exports 下 publicPath: '/二级目录名/' 

Nginx 配置
----------------------------------------------------
```
兼容 nginx配置
//// 二级域名模式
   location / {
      root /root/server/vue/wap/; #项目路径
      index index.html;                        
      try_files $uri $uri/ /index.html; #匹配不到任何静态资源，跳到同一个index.html 主要是加入这句
        # 如果try_files不生效可以尝试改为 
        #if (!-e $request_filename){
        #                rewrite ^/(.*) /index.html last;
        #            }
    }

nginx 加入不缓存index.html 防止不刷新无法加载最新 需配合下方index.html修改
location = /index.html {
    add_header Cache-Control "no-cache, no-store";
    root /root/server/vue/wap/; #项目路径
          index index.html;                        
          try_files $uri $uri/ /index.html; #匹配不到任何静态资源，跳到同一个index.html 主要是加入这句
            # 如果try_files不生效可以尝试改为 
            #if (!-e $request_filename){
            #                rewrite ^/(.*) /index.html last;
            #            }
}



// 二级目录模式
        location ^~ /abc/ {
                index index.html;
      try_files $uri $uri/ /abc/index.html; #匹配不到任何静态资源，跳到同一个index.html 主要是加入这句
        # 如果try_files不生效可以尝试改为 
         #   if (!-e $request_filename){
          #      rewrite ^/(.*) /lcyf-webs/index.html last;
          # }
            autoindex  off;
        }

nginx 加入不缓存index.html 防止不刷新无法加载最新(二级目录模式) 需配合下方index.html修改
location = /abc/index.html {
    add_header Cache-Control "no-cache, no-store";
}

-----
index.html页面被缓存导致没有刷新处理
index.html加入
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-control" content="no-cache">
<meta http-equiv="Cache" content="no-cache">



----------跨域问题在本地开启 proxy
注意将 config/env.development.js  中 baseApi: '/api' 设置为api api对应proxy配置的api 

```

预定义
-------------------------------------
别名统一@开头
静态资源尽量带上别名符号访问 如~@,~assets 避免不必要混乱

设计尺寸：375，在非style内联样式中可直接用px编写代码，将自动按照375比例转换为rem

layout 使用：layout模板存放 layouts
src/router/router.config.js 添加

统一样式处理
公共样式 src/assets/css/index.scss 全局样式统一目录 需要局部覆盖在页面 <style lang="scss" scoped> 中单独处理
 
混入样式 src/assets/css/mixin.scss 包含了常用的复杂语法 可通过@include 快速引用

全局css变量 src/assets/css/variables.scss 统一变量目录 公共css属性值例如主题颜色字体距离等均写入此目录 在其他css中进行引入 便于后续统一维护整体样式

vant全局样式覆盖 src/assets/css/vant-overwrite.scss vant组件大部分都可以自定义相关内容不建议进行全局vant样式覆盖 需要完全自定义vant主题可以使用less覆盖见 vant文档

-------------------------------------

对 https://github.com/sunniejs/vue-h5-template.git 根据自身业务进行了调整


调整内容:
-----------------------------------------
默认使用history模式

加入路由守卫动态设置 title 并加入项目名

注意keep-alive可以结合activated+deactivated 动态控制数据
keep-alive 调整，改为通过全局变量自定义控制滚动条位置,通过router/index.js 
scrollPositionList 保存y滚动条位置 例如: {'/about':30,'/home':90} 
路由前置守卫+keepAlive true 控制是否记录滚动条位置 this.setScrollPosition() 也可扩展为手动处理

// 如果涉及到部分页面使用了 fixed或者absolute 导致无法在最外层获取到滚动条和设置滚动条的情况需要自行在相关页面进行维护，router.config.js中excludeScroll字段为判断全局滚动设置
例如自定义为：  
//////// ex
路由中加入  excludeScroll: true 
pageContainerRef 为滚动元素的 ref
activated() {
       if (this.$route.meta.keepAlive === true) {
         // this.gotoScrollPosition()
         this.$refs.pageContainerRef.scrollTop = this.scrollPositionList[this.$route.path]
       }
     },
     beforeRouteLeave(to, from, next) { // 当使用自定义页面滚动配置的时候 需要在路由通过  excludeScroll: true  排除全局的滚动条设置防止覆盖
       if (from.meta.keepAlive === true) { // 由于部分html结构问题导致需要单独处理滚动条位置
         this.setScrollPosition(null, this.$refs.pageContainerRef.scrollTop)
       }
       next()
     },
     
     ///对于部分页面需要动态控制是否应该刷新采用 
     this.getRefreshStaticPage,this.setRefreshStaticPage
     
     例如:
       activated() {
         // 根据全局变量控制是否刷新页面
         if (this.getRefreshStaticPage()) {
           this.setRefreshStaticPage()
           this.loadData()
         }
       },
       mounted() {
         // 当非刷新的适合调用看，防止重复调用两次
         if (!this.getRefreshStaticPage()) {
           this.loadData()
         }
       },

        
/////// ex

在需要缓存的页面通过 
if (from.meta.keepAlive === true) {
  vue.gotoScrollPosition() // 如果为需要缓存调整滚动条位置
} 获取之前设置的滚动条位置并跳转到指定位置

快捷跳转页面 gotoPath('/path?id=123')

快捷返回前一页 gotoBack

快捷路由push routerPush({ name: 'A-b', params: { id: 123, name: 'name' })

request 加入timeout可以动态设置超时时间，，根据需要维护,和 hideloading同级

-------------------------------------

目录结构
------------------------------------------
```bash
├── public 静态文件目录
│   ├── dist 旧web html文件目录，直接将原html项目代码拷贝即可，注意 需要修改底部我的跳转地址到 /my
├── src 源码地址
│   ├── api 接口封装地址
│   ├── assets 静态资源
│   ├── components 组件
│   ├── config 环境配置文件
│   ├── filters 数据过滤函数封装
│   ├── plugins 使用的插件配置
│   ├── router 路由配置
│   ├── store 状态封装
│   ├── utils 常用函数封装
│   ├── views 视图目录
│   │   ├── apitest 统一测试接口上线后可删除 
│   │   ├── goods 产品页面目录 - 由于使用了旧产品html 目前该目录未使用
│   │   ├── home 主页目录 - 由于使用了旧产品html 目前该目录未使用，行后根本可写入此目录
│   │   ├── layouts 页面模板目录
│   │   ├── my 我的页面目录
│   │   ├── myteam 我的团队目录
│   │   ├── order 订单目录 - 由于使用了旧产品html 目前该目录未使用，行后根本可写入此目录
├── webroot 测试或生产打包后的跟目录文件，由于旧项目使用的dist为了避免混乱使用了这个名字
├── vue.config.js 环境配置文件
```

缓存页面动态变更方案2 适用于在动态控制缓存页面场景较多的业务 也可尝试同时一起使用 有待测试
-------------------------------------------------------------------------------
```需要的设置缓存的页面：
<keep-alive :include="keepAlivePage">
          <router-view></router-view>
</keep-alive>

<script>
  computed: {
    ...mapGetters([
      'keepAlivePage'
    ])
  }
</script>

VUEX state加入数组：
const state = {
  keepAlivePage: [] // 需要缓存的页面，如果说你一开始就要缓存，那么你可以在这里设置初始值，如果你不需一开始就设置缓存，那么设置为空，再通过某种条件通过mutations或者actions改变keepAlivePage
}

getter中加入：
const getters = {
  keepAlivePage: state => state.settings.keepAlivePage // 获取需要缓存的页面
}
export default getters

动态控制：
this.$store.dispatch('settings/addKeepAlivePage', 'Home') //'Home'就是你要增加页面缓存的名称。

VUEX actions中加入：
const actions = {
  addKeepAlivePage ({ commit }, name) {
    commit('ADD_KEEP_ALVE', name)
  }
}

VUEX mutations中加入：
const mutations = {
 ADD_KEEP_ALVE: (state, name) => {
    state.keepAlivePage = state.keepAlivePage.concat(name)
  }
}

注意！！这里要特别注意页面组价的名字要和router设置页面的名字要一一对应，不然的话接下来的需求就会实现不了！！

来源地址
https://blog.csdn.net/qq_42268364/article/details/102368148

```




环境安装流程
-----------------------------------------------------------
win 10 nodejs 安装流程 vue项目搭建过程

win10下安装node和npm
第一步:官网 https://nodejs.org/zh-cn/download/ 下载免安装的压缩包 选择 Windows 二级制文件(.zip) 64位版本

第二步:解压下载的压缩文件例如：node-v14.15.4-win-x64.zip（注意不要解压在中文路径下或者C盘Windows、Program Files等需要管理员权限的目录下）,解压完整后在解压出的目录（例如node-v14.15.4-win-x64）中创建两个文件node-cache,node-global用来指定npm的模块路径和缓存路径(类似于java的maven库)

第三步:配置环境变量.在环境变量->系统变量下新建一个变量，变量名为NODE_HOME ,变量值为node-v14.15.4-win-x64所有目录的绝对路面。
添加如下%NODE_HOME%,%NODE_HOME%\node-global两个环境变量到path ,点击系统路径里的Path,点击新建：输入:%NODE_HOME% 添加后在新建输入:%NODE_HOME%\node-global
注意添加完环境变量后关闭IDE编辑器或命令或重启电脑

第四步:打开cmd,配置刚才新建的两个文件夹
npm config set prefix "D:\Program Files (x86)\nodejs\node-v12.10.0-win-x64\node-global"
npm config set cache "D:\Program Files (x86)\nodejs\node-v12.10.0-win-x64\node-cache"
注意这里的文件夹为自己的安装目录

查看安装的node和npm
cmd下输入 node --version 
cmd下输入 npm --version

第五步安装 yarn ，由于国内npm经常安装缓慢可用考虑用yarn代替

cmd 下 输入 npm install -g yarn

安装完成后即可到该项目目录下运行：
npm install 如果此命令安装没有反应可用执行 yarn install

npm yarn均无法安装改用淘宝镜像执行如下命令。
设置淘宝为国内镜像源(相当于maven设置阿里是国内的远程镜像仓库)
打开cmd输入
npm config set registry https://registry.npm.taobao.org
设置完了输入
npm config get registry查看设置的国内镜像对不对

安装淘宝镜像后重新执行 npm install 或 yarn install 任然无法安装完成则改为使用cnpm 由于cnpm安装的目录有时存在未知问题一般最后采用

安装淘宝镜像后npm用cnpm代替，其它命令不变
npm install -g cnpm --registry=https://registry.npm.taobao.org

执行 cnpm install 完整安装

- 通过 `npm run serve` 启动本地 , 执行 `development`
- 通过 `npm run stage` 打包测试 , 执行 `staging`
- 通过 `npm run build` 打包正式 , 执行 `production`

执行 npm run serve 将自动打开测试网页

----------------------------------------------------


### Node 版本要求

`Vue CLI` 需要 Node.js 8.9 或更高版本 (推荐 8.11.0+)。你可以使用 [nvm](https://github.com/nvm-sh/nvm) 或
[nvm-windows](https://github.com/coreybutler/nvm-windows) 在同一台电脑中管理多个 Node 版本。

本示例 Node.js 12.14.1

### 启动项目

```bash

git clone https://github.com/coder1379/vue-h5-template

cd vue-h5-template

npm install

npm run serve
```

### <span id="env">✅ 配置多环境变量 </span>

`package.json` 里的 `scripts` 配置 `serve` `stage` `build`，通过 `--mode xxx` 来执行不同环境

- 通过 `npm run serve` 启动本地 , 执行 `development`
- 通过 `npm run stage` 打包测试 , 执行 `staging`
- 通过 `npm run build` 打包正式 , 执行 `production`

```javascript
"scripts": {
  "serve": "vue-cli-service serve --open",
  "stage": "vue-cli-service build --mode staging",
  "build": "vue-cli-service build",
}
```

##### 配置介绍

&emsp;&emsp;以 `VUE_APP_` 开头的变量，在代码中可以通过 `process.env.VUE_APP_` 访问。  
&emsp;&emsp;比如,`VUE_APP_ENV = 'development'` 通过`process.env.VUE_APP_ENV` 访问。  
&emsp;&emsp;除了 `VUE_APP_*` 变量之外，在你的应用代码中始终可用的还有两个特殊的变量`NODE_ENV` 和`BASE_URL`

在项目根目录中新建`.env.*`

- .env.development 本地开发环境配置

```bash
NODE_ENV='development'
# must start with VUE_APP_
VUE_APP_ENV = 'development'

```

- .env.staging 测试环境配置

```bash
NODE_ENV='production'
# must start with VUE_APP_
VUE_APP_ENV = 'staging'
```

- .env.production 正式环境配置

```bash
 NODE_ENV='production'
# must start with VUE_APP_
VUE_APP_ENV = 'production'
```

这里我们并没有定义很多变量，只定义了基础的 VUE_APP_ENV `development` `staging` `production`  
变量我们统一在 `src/config/env.*.js` 里进行管理。

这里有个问题，既然这里有了根据不同环境设置变量的文件，为什么还要去 config 下新建三个对应的文件呢？  
**修改起来方便，不需要重启项目，符合开发习惯。**

config/index.js

```javascript
// 根据环境引入不同配置 process.env.NODE_ENV
const config = require('./env.' + process.env.VUE_APP_ENV)
module.exports = config
```

配置对应环境的变量，拿本地环境文件 `env.development.js` 举例，用户可以根据需求修改

```javascript
// 本地环境配置
module.exports = {
  title: 'vue-h5-template',
  baseUrl: 'http://localhost:9018', // 项目地址
  baseApi: 'https://test.xxx.com/api', // 本地api请求地址
  APPID: 'xxx',
  APPSECRET: 'xxx'
}
```

根据环境不同，变量就会不同了

```javascript
// 根据环境不同引入不同baseApi地址
import { baseApi } from '@/config'
console.log(baseApi)
```

[▲ 回顶部](#top)

### <span id="rem">✅ rem 适配方案 </span>

不用担心，项目已经配置好了 `rem` 适配, 下面仅做介绍：

Vant 中的样式默认使用`px`作为单位，如果需要使用`rem`单位，推荐使用以下两个工具:

- [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) 是一款 `postcss` 插件，用于将单位转化为 `rem`
- [lib-flexible](https://github.com/amfe/lib-flexible) 用于设置 `rem` 基准值

##### PostCSS 配置

下面提供了一份基本的 `postcss` 配置，可以在此配置的基础上根据项目需求进行修改

```javascript
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
```

更多详细信息： [vant](https://youzan.github.io/vant/#/zh-CN/quickstart#jin-jie-yong-fa)

**新手必看，老鸟跳过**

很多小伙伴会问我，适配的问题,因为我们使用的是 Vant UI，所以必须根据 Vant UI 375 的设计规范走，一般我们的设计会将 UI 图上
传到蓝湖，我们就可以需要的尺寸了。下面就大搞普及一下 rem。

我们知道 `1rem` 等于`html` 根元素设定的 `font-size` 的 `px` 值。Vant UI 设置 `rootValue: 37.5`,你可以看到在 iPhone 6 下
看到 （`1rem 等于 37.5px`）：

```html
<html data-dpr="1" style="font-size: 37.5px;"></html>
```

切换不同的机型，根元素可能会有不同的`font-size`。当你写 css px 样式时，会被程序换算成 `rem` 达到适配。

因为我们用了 Vant 的组件，需要按照 `rootValue: 37.5` 来写样式。

举个例子：设计给了你一张 750px \* 1334px 图片，在 iPhone6 上铺满屏幕,其他机型适配。

- 当`rootValue: 75` , 样式 `width: 750px;height: 1334px;` 图片会撑满 iPhone6 屏幕，这个时候切换其他机型，图片也会跟着撑
  满。
- 当`rootValue: 37.5` 的时候，样式 `width: 375px;height: 667px;` 图片会撑满 iPhone6 屏幕。

也就是 iphone 6 下 375px 宽度写 CSS。其他的你就可以根据你设计图，去写对应的样式就可以了。

当然，想要撑满屏幕你可以使用 100%，这里只是举例说明。

```html
<img class="image" src="https://www.sunniejs.cn/static/weapp/logo.png" />

<style>
  /* rootValue: 75 */
  .image {
    width: 750px;
    height: 1334px;
  }
  /* rootValue: 37.5 */
  .image {
    width: 375px;
    height: 667px;
  }
</style>
```

[▲ 回顶部](#top)

### <span id="vw">✅ vm 适配方案 </span>

本项目使用的是 rem 的 适配方案，其实无论你使用哪种方案，都不需要你去计算 12px 是多少 rem 或者 vw, 会有专门的工具去帮你做
。如果你想用 vw，你可以按照下面的方式切换。

#### 1.安装依赖

```bash

npm install postcss-px-to-viewport -D

```

#### 2.修改 .postcssrc.js

将根目录下 .postcssrc.js 文件修改如下

```javascript
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
    },
    'postcss-px-to-viewport': {
      viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false // 允许在媒体查询中转换`px`
    }
  }
}
```

#### 3.删除原来的 rem 相关代码

src/main.js 删除如下代码

```javascript
// 移动端适配
import 'lib-flexible/flexible.js'
```

package.json 删除如下代码

```javascript
"lib-flexible": "^0.3.2",
"postcss-pxtorem": "^5.1.1",
```

运行起来，F12 元素 css 就是 vw 单位了

[▲ 回顶部](#top)

### <span id="vant">✅ VantUI 组件按需加载 </span>

项目采
用[Vant 自动按需引入组件 (推荐)](https://youzan.github.io/vant/#/zh-CN/quickstart#fang-shi-yi.-zi-dong-an-xu-yin-ru-zu-jian-tui-jian)下
面安装插件介绍：

[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 是一款 `babel` 插件，它会在编译过程中将
`import` 的写法自动转换为按需引入的方式

#### 安装插件

```bash
yarn add babel-plugin-component -D
```

在`babel.config.js` 设置

```javascript
// 对于使用 babel7 的用户，可以在 babel.config.js 中配置
const plugins = [
  [
    'component',
    {
      libraryName: 'element-ui',
      styleLibraryName: "theme-chalk",
    }
  ]
]
module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'usage', corejs: 3 }]],
  plugins
}
```

#### 使用组件

项目在 `src/plugins/vant.js` 下统一管理组件，用哪个引入哪个，无需在页面里重复引用

```javascript
// 按需全局引入 element组件
import Vue from 'vue'
import { Button } from 'element-ui'
Vue.use(Button)
```

[▲ 回顶部](#top)

### <span id="sass">✅ Sass 全局样式</span>

首先 你可能会遇到 `node-sass` 安装不成功，别放弃多试几次！！！

每个页面自己对应的样式都写在自己的 .vue 文件之中 `scoped` 它顾名思义给 css 加了一个域的概念。

```html
<style lang="scss">
  /* global styles */
</style>

<style lang="scss" scoped>
  /* local styles */
</style>
```

#### 目录结构

vue-h5-template 所有全局样式都在 `@/src/assets/css` 目录下设置

```bash
├── assets
│   ├── css
│   │   ├── index.scss               # 全局通用样式
│   │   ├── mixin.scss               # 全局mixin
│   │   └── variables.scss           # 全局变量
```

#### 自定义 vant-ui 样式

现在我们来说说怎么重写 `vant-ui` 样式。由于 `vant-ui` 的样式我们是在全局引入的，所以你想在某个页面里面覆盖它的样式就不能
加 `scoped`，但你又想只覆盖这个页面的 `vant` 样式，你就可在它的父级加一个 `class`，用命名空间来解决问题。

```css
.about-container {
  /* 你的命名空间 */
  .van-button {
    /* vant-ui 元素*/
    margin-right: 0px;
  }
}
```

#### 父组件改变子组件样式 深度选择器

当你子组件使用了 `scoped` 但在父组件又想修改子组件的样式可以 通过 `>>>` 来实现：

```css
<style scoped>
.a >>> .b { /* ... */ }
</style>
```

#### 全局变量

`vue.config.js` 配置使用 `css.loaderOptions` 选项,注入 `sass` 的 `mixin` `variables` 到全局，不需要手动引入 ,配
置`$cdn`通过变量形式引入 cdn 地址,这样向所有 Sass/Less 样式传入共享的全局变量：

```javascript
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const defaultSettings = require('./src/config/index.js')
module.exports = {
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      // 给 scss-loader 传递选项
      scss: {
        // 注入 `sass` 的 `mixin` `variables` 到全局, $cdn可以配置图片cdn
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        prependData: `
                @import "assets/css/mixin.scss";
                @import "assets/css/variables.scss";
                $cdn: "${defaultSettings.$cdn}";
                 `
      }
    }
  }
}
```

设置 js 中可以访问 `$cdn`,`.vue` 文件中使用`this.$cdn`访问

```javascript
// 引入全局样式
import '@/assets/css/index.scss'

// 设置 js中可以访问 $cdn
// 引入cdn
import { $cdn } from '@/config'
Vue.prototype.$cdn = $cdn
```

在 css 和 js 使用

```html
<script>
  console.log(this.$cdn)
</script>
<style lang="scss" scoped>
  .logo {
    width: 120px;
    height: 120px;
    background: url($cdn + '/weapp/logo.png') center / contain no-repeat;
  }
</style>
```

[▲ 回顶部](#top)

### <span id="vuex">✅ Vuex 状态管理</span>

目录结构

```bash
├── store
│   ├── modules
│   │   └── app.js
│   ├── index.js
│   ├── getters.js
```

`main.js` 引入

```javascript
import Vue from 'vue'
import App from './App.vue'
import store from './store'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
```

使用

```html
<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['userName'])
    },

    methods: {
      // Action 通过 store.dispatch 方法触发
      doDispatch() {
        this.$store.dispatch('setUserName', '真乖，赶紧关注公众号，组织都在等你~')
      }
    }
  }
</script>
```

[▲ 回顶部](#top)

### <span id="router">✅ Vue-router </span>

本案例采用 `hash` 模式，开发者根据需求修改 `mode` `base`

**注意**：如果你使用了 `history` 模式，`vue.config.js` 中的 `publicPath` 要做对应的**修改**

前往:[vue.config.js 基础配置](#base)

```javascript
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export const router = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/home/index'), // 路由懒加载
    meta: {
      title: '首页', // 页面标题
      keepAlive: false // keep-alive 标识
    }
  }
]
const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置 vue.config.js publicPath
    // base: '/app/',
    scrollBehavior: () => ({ y: 0 }),
    routes: router
  })

export default createRouter()
```

更多:[Vue Router](https://router.vuejs.org/zh/)

[▲ 回顶部](#top)

### <span id="axios">✅ Axios 封装及接口管理</span>

`utils/request.js` 封装 axios ,开发者需要根据后台接口做修改。

- `service.interceptors.request.use` 里可以设置请求头，比如设置 `token`
- `config.hideloading` 是在 api 文件夹下的接口参数里设置，下文会讲
- `service.interceptors.response.use` 里可以对接口返回数据处理，比如 401 删除本地信息，重新登录

```javascript
import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests 这里和nginx * 有冲突，测试环境改为false ，生产环境考虑true
  timeout: 5000 // request timeout
})

// request 拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    if (store.getters.token) {
      config.headers['X-Token'] = ''
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)
export default service
```

#### 接口管理

在`src/api` 文件夹下统一管理接口

- 你可以建立多个模块对接接口, 比如 `home.js` 里是首页的接口这里讲解 `user.js`
- `url` 接口地址，请求的时候会拼接上 `config` 下的 `baseApi`
- `method` 请求方法
- `data` 请求参数 `qs.stringify(params)` 是对数据系列化操作
- `hideloading` 默认 `false`,设置为 `true` 后，不显示 loading ui 交互中有些接口不需要让用户感知

```javascript
import qs from 'qs'
// axios
import request from '@/utils/request'
//user api

// 用户信息
export function getUserInfo(params) {
  return request({
    url: '/user/userinfo',
    method: 'post',
    data: qs.stringify(params),
    hideloading: true // 隐藏 loading 组件
  })
}
```

#### 如何调用

```javascript
// 请求接口
import { getUserInfo } from '@/api/user.js'

const params = { user: 'sunnie' }
getUserInfo(params)
  .then(() => {})
  .catch(() => {})
```

[▲ 回顶部](#top)

### <span id="base">✅ Webpack 4 vue.config.js 基础配置 </span>

如果你的 `Vue Router` 模式是 hash

```javascript
publicPath: './',
```

如果你的 `Vue Router` 模式是 history 这里的 publicPath 和你的 `Vue Router` `base` **保持一直**

```javascript
publicPath: '/app/',
```

```javascript
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: './', // 署应用包时的基本 URL。 vue-router hash 模式使用
  //  publicPath: '/app/', // 署应用包时的基本 URL。  vue-router history模式使用
  outputDir: 'dist', //  生产环境构建文件的目录
  assetsDir: 'static', //  outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: !IS_PROD,
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  devServer: {
    port: 9020, // 端口号
    open: false, // 启动后打开浏览器
    overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true
    }
    // ...
  }
}
```

[▲ 回顶部](#top)

### <span id="alias">✅ 配置 alias 别名 </span>

```javascript
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))
  }
}
```

[▲ 回顶部](#top)

### <span id="proxy">✅ 配置 proxy 跨域 </span>

如果你的项目需要跨域设置，你需要打来 `vue.config.js` `proxy` 注释 并且配置相应参数

<u>**!!!注意：你还需要将 `src/config/env.development.js` 里的 `baseApi` 设置成 '/'**</u>

```javascript
module.exports = {
  devServer: {
    // ....
    proxy: {
      //配置跨域
      '/api': {
        target: 'https://test.xxx.com', // 接口的域名
        // ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
```

使用 例如: `src/api/home.js`

```javascript
export function getUserInfo(params) {
  return request({
    url: '/api/userinfo',
    method: 'post',
    data: qs.stringify(params)
  })
}
```

[▲ 回顶部](#top)

### <span id="bundle">✅ 配置 打包分析 </span>

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  chainWebpack: config => {
    // 打包分析
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
  }
}
```

```bash
npm run build
```

[▲ 回顶部](#top)

### <span id="externals">✅ 配置 externals 引入 cdn 资源 </span>

这个版本 CDN 不再引入，我测试了一下使用引入 CDN 和不使用,不使用会比使用时间少。网上不少文章测试 CDN 速度块，这个开发者可
以实际测试一下。

另外项目中使用的是公共 CDN 不稳定，域名解析也是需要时间的（如果你要使用请尽量使用同一个域名）

因为页面每次遇到`<script>`标签都会停下来解析执行，所以应该尽可能减少`<script>`标签的数量 `HTTP`请求存在一定的开销，100K
的文件比 5 个 20K 的文件下载的更快，所以较少脚本数量也是很有必要的

暂时还没有研究放到自己的 cdn 服务器上。

```javascript
const defaultSettings = require('./src/config/index.js')
const name = defaultSettings.title || 'vue mobile template'
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

// externals
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  vant: 'vant',
  axios: 'axios'
}
// CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: []
  },
  // 生产环境
  build: {
    css: ['https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.css'],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.min.js'
    ]
  }
}
module.exports = {
  configureWebpack: config => {
    config.name = name
    // 为生产环境修改配置...
    if (IS_PROD) {
      // externals
      config.externals = externals
    }
  },
  chainWebpack: config => {
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中
     */
    config.plugin('html').tap(args => {
      if (IS_PROD) {
        args[0].cdn = cdn.build
      } else {
        args[0].cdn = cdn.dev
      }
      return args
    })
  }
}
```

在 public/index.html 中添加

```javascript
    <!-- 使用CDN的CSS文件 -->
    <% for (var i in
      htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.css) { %>
      <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="preload" as="style" />
      <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="stylesheet" />
    <% } %>
     <!-- 使用CDN加速的JS文件，配置在vue.config.js下 -->
    <% for (var i in
      htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.js) { %>
      <script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
    <% } %>
```

[▲ 回顶部](#top)

### <span id="console">✅ 去掉 console.log </span>

保留了测试环境和本地环境的 `console.log`

```bash
npm i -D babel-plugin-transform-remove-console
```

在 babel.config.js 中配置

```javascript
// 获取 VUE_APP_ENV 非 NODE_ENV，测试环境依然 console
const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)
const plugins = [
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    },
    'vant'
  ]
]
// 去除 console.log
if (IS_PROD) {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'entry' }]],
  plugins
}
```

[▲ 回顶部](#top)

### <span id="chunks">✅ splitChunks 单独打包第三方模块</span>

```javascript
module.exports = {
  chainWebpack: config => {
    config.when(IS_PROD, config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // 将 runtime 作为内联引入不单独存在
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: 'chunk-libs',
            chunks: 'initial', // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          vantUI: {
            name: 'chunk-vantUI', // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
```

[▲ 回顶部](#top)

### <span id="ie">✅ 添加 IE 兼容 </span>

之前的方式 会报 `@babel/polyfill` is deprecated. Please, use required parts of `core-js` and
`regenerator-runtime/runtime` separately

`@babel/polyfill` 废弃，使用 `core-js` 和 `regenerator-runtime`

```bash
npm i --save core-js regenerator-runtime
```

在 `main.js` 中添加

```javascript
// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

配置 `babel.config.js`

```javascript
const plugins = []

module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'usage', corejs: 3 }]],
  plugins
}
```

[▲ 回顶部](#top)

### <span id="pettier">✅ Eslint + Pettier 统一开发规范 </span>

VScode （版本 1.47.3）安装 `eslint` `prettier` `vetur` 插件 `.vue` 文件使用 vetur 进行格式化，其他使用`prettier`,后面会
专门写个如何使用配合使用这三个玩意

在文件 `.prettierrc` 里写 属于你的 pettier 规则

```bash
{
   "printWidth": 120,
   "tabWidth": 2,
   "singleQuote": true,
   "trailingComma": "none",
   "semi": false,
   "wrap_line_length": 120,
   "wrap_attributes": "auto",
   "proseWrap": "always",
   "arrowParens": "avoid",
   "bracketSpacing": false,
   "jsxBracketSameLine": true,
   "useTabs": false,
   "overrides": [{
       "files": ".prettierrc",
       "options": {
           "parser": "json"
       }
   }]
}
```

Vscode setting.json 设置

```bash
    {
  // 将设置放入此文件中以覆盖默认设置
  "files.autoSave": "off",
  // 控制字体系列。
  "editor.fontFamily": "Consolas, 'Courier New', monospace,'宋体'",
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  // 以像素为单位控制字号。
  "editor.fontSize": 16,
  // 控制选取范围是否有圆角
  "editor.roundedSelection": false,
  // 建议小组件的字号
  "editor.suggestFontSize": 16,
  // 在“打开的编辑器”窗格中显示的编辑器数量。将其设置为 0 可隐藏窗格。
  "explorer.openEditors.visible": 0,
  // 是否已启用自动刷新
  "git.autorefresh": true,
  // 以像素为单位控制终端的字号，这是 editor.fontSize 的默认值。
  "terminal.integrated.fontSize": 14,
  // 控制终端游标是否闪烁。
  "terminal.integrated.cursorBlinking": true,
  // 一个制表符等于的空格数。该设置在 `editor.detectIndentation` 启用时根据文件内容进行重写。
  // Tab Size
  "editor.tabSize": 2,
  // By default, common template. Do not modify it!!!!!
  "editor.formatOnType": true,
  "window.zoomLevel": 0,
  "editor.detectIndentation": false,
  "css.fileExtensions": ["css", "scss"],
  "files.associations": {
    "*.string": "html",
    "*.vue": "vue",
    "*.wxss": "css",
    "*.wxml": "wxml",
    "*.wxs": "javascript",
    "*.cjson": "jsonc",
    "*.js": "javascript"
  },
  // 为指定的语法定义配置文件或使用带有特定规则的配置文件。
  "emmet.syntaxProfiles": {
    "vue-html": "html",
    "vue": "html"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true
  },
  //保存时eslint自动修复错误
  "editor.formatOnSave": true,
  // Enable per-language
  //配置 ESLint 检查的文件类型
  "editor.quickSuggestions": {
    "strings": true
  },
  // 添加 vue 支持
  // 这里是针对vue文件的格式化设置，vue的规则在这里生效
  "vetur.format.options.tabSize": 2,
  "vetur.format.options.useTabs": false,
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatter.css": "prettier",
  "vetur.format.defaultFormatter.scss": "prettier",
  "vetur.format.defaultFormatter.postcss": "prettier",
  "vetur.format.defaultFormatter.less": "prettier",
  "vetur.format.defaultFormatter.js": "vscode-typescript",
  "vetur.format.defaultFormatter.sass": "sass-formatter",
  "vetur.format.defaultFormatter.ts": "prettier",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "aligned-multiple", // 超过150折行
      "wrap-line-length": 150
    },
    // #vue组件中html代码格式化样式
    "prettier": {
      "printWidth": 120,
      "tabWidth": 2,
      "singleQuote": false,
      "trailingComma": "none",
      "semi": false,
      "wrap_line_length": 120,
      "wrap_attributes": "aligned-multiple", // 超过150折行
      "proseWrap": "always",
      "arrowParens": "avoid",
      "bracketSpacing": true,
      "jsxBracketSameLine": true,
      "useTabs": false,
      "overrides": [
        {
          "files": ".prettierrc",
          "options": {
            "parser": "json"
          }
        }
      ]
    }
  },
  // Enable per-language
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "vetur.validation.template": false,
  "html.format.enable": false,
  "json.format.enable": false,
  "javascript.format.enable": false,
  "typescript.format.enable": false,
  "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": false,
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur"
  },
  "emmet.includeLanguages": {
    "wxml": "html"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // 开启eslint自动修复js/ts功能
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "minapp-vscode.disableAutoConfig": true,
  "javascript.implicitProjectConfig.experimentalDecorators": true,
  "editor.maxTokenizationLineLength": 200000
}

```

##IOS 微信分享问题处理方案关键字：assign

[▲ 回顶部](#top)

# 鸣谢 ​

[vue-cli4-config](https://github.com/staven630/vue-cli4-config)  
[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
[vue-h5-template](https://github.com/sunniejs/vue-h5-template.git) 