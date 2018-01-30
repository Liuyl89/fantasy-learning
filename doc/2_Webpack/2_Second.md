<div align="center">
  <h3 align="center">再识 Webpack</h3>
</div>

作者：liuyl

关于作者：GIS从业者，主要在ArcGIS平台下做WebGIS开发，最后有作者的联系方式

版权所有：转载请保留作者名和原始链接

这是一个系列教程，内容有一定连续性，可移步 [目录章](../../README.md) 查看所有教程

[教程示例代码下载](https://github.com/Liuyl89/fantasy-learning/)

### 一点前言

---

本篇教程将在 [上一篇 WebGIS开发教程(五) 初识 Webpack](./1_Start.md) 基础上，在 webpack 配置中增加对 CSS 样式的编译。我们还会尝试一下用 Sass 来写 CSS 样式。

### 下面是正文

---

#### 准备试验代码

我们先准备好用于试验的示例代码，代码以上一篇中最后的结果的为基础增加一些标签，并新建一个 CSS 文件，还会引用一个图片文件。

目录文件组织结构如下

![目录文件组织结构](http://upload-images.jianshu.io/upload_images/7292919-8d7207bc03878ab2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`bootstrap.html` 文件中代码如下

```
<!DOCTYPE html>
<!--[if lt IE 7]>
<html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>
<html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>
<html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>2_Webpack/2_Second</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/main.css">
    <script src="js/vendor/modernizr-2.6.2.min.js"></script>
</head>
<body>
<!-- Add your site or application content here -->
<div style="margin-top: 50px" class="container">
    <div class="jumbotron">
        <h1>Hello World</h1>
        <p>这是WebGIS开发教程的示例页面</p>
        <button id="my-btn" class="btn btn-primary btn-lg">点击</button>
        <div class="author">
            <a class="logo" href="https://www.jianshu.com/p/e9d23726063a" target="_blank"></a>
            <div class="info">
                <span class="name">
                    <a href="https://www.jianshu.com/p/e9d23726063a" target="_blank">
                        教程目录篇
                    </a>
                </span>
                <div class="meta"><span>请点击前往本系列教程的目录篇</span></div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<script src="dist/app.js"></script>
</body>
</html>
```

可以看到代码中主要的变化是引用了 `css/main.css` 文件，并增加了一组用于跳转到教程目录篇的 `html` 标签。其中引用的 `css` 类均在 `css/main.css` 文件之中，文件中的样式定义如下

```
.app {
    margin-top: 50px;
}

.author {
    margin: 30px 0 40px;
}

.author .logo {
    width: 48px;
    height: 48px;
    vertical-align: middle;
    display: inline-block;
    background-image: url(../img/logo.png);
    background-size: contain;
}

.author .info {
    vertical-align: middle;
    display: inline-block;
    margin-left: 8px;
}

.author .info .name {
    margin-right: 3px;
    font-size: 16px;
    vertical-align: middle;
}

.author .info .meta {
    margin-top: 5px;
    font-size: 12px;
    color: #969696;
}
```

此外增加了一个图片文件 `img/logo.png` ，被当作背景图片引用

`webpack.config.js` 文件和上一篇最后一样，没有变化

```
const path = require('path')
module.exports = {
    entry: {
        app: [path.resolve(__dirname, 'js/main.js')],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
}
```

在命令行窗口执行如下命令

```
webpack --config lesson\2_Webpack\2_Second\webpack.config.js
```

启动 nginx，浏览器访问 `http://localhost/lesson/2_Webpack/2_Second/bootstrap.html` ，我们将看到如下页面

![教程示例页面效果](http://upload-images.jianshu.io/upload_images/7292919-a72ecc45321213c2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果读者对以上过程感到困惑，请回顾一下系列教程的前面几篇。下面来进入本篇教程的正题

#### 用 webpack 打包 CSS 样式

    一切皆模块

    webpack 有一个不可不说的优点，它把所有的文件都都当做模块处理
    JS，CSS 和 FONTS 以及图片等等通过合适的 loader 都可以被处理

    webpack 提供两个工具处理样式表， css-loader 和 style-loader
    二者处理的任务不同， css-loader 使你能够使用类似 @import 和 url(...) 的方法实现 require() 的功能
    style-loader 将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入 webpack 打包后的 js 文件中。

上面这段描述引用自 [入门Webpack，看这篇就够了](https://www.jianshu.com/p/42e11515c10f) ，更深入的也不好描述了，读者在使用 webpack 过程中慢慢理解就好

现在我们来更改 webpack 配置，增加 module 配置段，这是配置段与之前的 `entry` 和 `output` 配置段是同级的

```
module: {
    rules: [{
        test: /\.css$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }],
    }, {
        test: /\.(png|gif|jpg)$/,
        use: [{
            loader: "url-loader",
            options: {
                limit: 10000
            },
        }],
    }]
}
```

然后将对 `css/main.css` 的引用从 `bootstrap.html` 文件中注释掉

```
<!--<link rel="stylesheet" href="css/main.css">-->
```

并用 `import` 语句在 `js/main.js` 文件中引用 `css/main.css` 文件

```
import './plugins'                           //本行为文件中已有代码
import { message }from './msg'               //本行为文件中已有代码
import '../css/main.css'
```

在执行 webpack 命令之前，我们还需要安装这段配置中涉及到的 loader ，在教程示例代码根目录执行下面的命令

```
npm install --save-dev style-loader css-loader url-loader file-loader
```

然后重新编译，执行 `webpack --config lesson\2_Webpack\2_Second\webpack.config.js` 命令。刷新页面，这时页面效果应该和之前没有区别，说明 CSS 样式已经被打包到了 `dist/app.js` 文件中了

#### 看看发生了什么

我们先看一下样式是怎么生效的，通过浏览器的调试工具查看 DOM 树， `<head>` 标签最后面多了一段 `<style>` 标签，查看里面的样式，正是我们定义在 `css/main.css` 文件中的样式

![被注入的样式](http://upload-images.jianshu.io/upload_images/7292919-9525e47800911cb5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

下面就在 webpack 编译生成的 `dist/app.js` 文件中查找线索，揭开这段 css 样式是如何被加到 `<head>` 标签中的

首先，由这句 `return __webpack_require__(__webpack_require__.s = 0);` 知道入口模块仍然 `0` 号模块， `0` 号模块直接返回  `1` 号模块， `1` 号模块就是我们的 `js/main.js` 文件

对照文件中

```
import './plugins'
import { message }from './msg'
import '../css/main.css'
```

被编译成

```
var __WEBPACK_IMPORTED_MODULE_0__plugins__ = __webpack_require__(2);
var __WEBPACK_IMPORTED_MODULE_0__plugins___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__plugins__);
var __WEBPACK_IMPORTED_MODULE_1__msg__ = __webpack_require__(3);
var __WEBPACK_IMPORTED_MODULE_2__css_main_css__ = __webpack_require__(4);
var __WEBPACK_IMPORTED_MODULE_2__css_main_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__css_main_css__);
```

从 `var __WEBPACK_IMPORTED_MODULE_2__css_main_css__ = __webpack_require__(4);` 这句得知对 `css/main.css` 文件中定义的样式的引用是在 `4` 号模块中开始执行的， `4` 号模块第一句如下

```
var content = __webpack_require__(5);
```
引入了  `5` 号模块，这个模块又做了什么呢

```
var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(7)(false);
// module
exports.push([module.i, ".app {\r\n    margin-top: 50px;\r\n}\r\n\r\n.author {\r\n    ... ]);
```

发现了 `css/main.css` 文件中定义的样式！只是被转换成了字符串，然后通过 `exports` 返回给了 `4` 号模块

回去看 `4` 号模块， 在 `var content = __webpack_require__(5);` 这一句后面不远处有下面这句

```
var update = __webpack_require__(9)(content, options);
```

从  `5` 号模块中拿到的样式字符串通过变量 `content` 传入了 `9` 号模块定义的函数中

 `9` 号模块是 `style-loader` 生成的向页面中动态插入样式的一组功能函数，在执行了

```
addStylesToDom(styles, options);
```

这一句之后，样式被插入到 `<head>` 标签的最后面。具体函数如何执行就不详细看了，有兴趣的读者可以自己调试看看

#### 那个 logo.png 图片怎么了

细心的读者可能在上面浏览器调试工具的截图中发现，`.author .logo` 中 `background-image` 后面的 `url` 和我们在文件中定义的不一样了，变成了很长的一串乱码

![变成乱码的 url](http://upload-images.jianshu.io/upload_images/7292919-cae6297d478db990.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这就是 webpack 配置中，下面这段的作用了

```
{
    test: /\.(png|gif|jpg)$/,
    use: [{
        loader: "url-loader",
        options: {
            limit: 20000
        },
    }],
}
```

这段告诉 webpack 在编译过程中，遇到样式中用 `url()` 引用的本地图片，如果大小没有超过 `limit:20000` 定义的 20000B ，就将图片转为 `base64` 编码，并直接输出到打包后的 `js` 文件中。这样可以有效减少页面因频繁加载小图片导致的额外开销。

我们在 `8` 号模块中可以找到图片北转换后的 `base64` 编码

```
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGA ...
```

在 `5` 号模块样式字符串中可以看到对 `8` 号模块的引用

```
background-image: url(" + escape(__webpack_require__(8)) + ");
```

如果我们将 `limit:20000` 改为 `limit:10000` 重新编译，图片文件因为大小超过了 10000B ，就不会被转码了，而是会被复制到 `dist` 目录里，同时文件名也会被改为一个 Hash 码。

这个工作是 `url-loader` 调用 `file-loader` 完成的，所以如果前面没有安装 `file-loader` ，在这里编译就会报错。

我想大家能够猜到这种情况下编译出的代码是什么样的，感兴趣的话可以去看一下。

#### 用 Sass 写样式

在 `css` 目录中新建一个名为 `main.scss` 的文件，然后文件中输入如下代码

```
.app {
  margin-top: 50px;
}

@mixin vertical-align-inline-block {
  vertical-align: middle;
  display: inline-block;
}

.author {
  margin: 30px 0 40px;
  .logo {
    width: 48px;
    height: 48px;
    @include vertical-align-inline-block;
    background-image: url(../img/logo.png);
    background-size: contain;
  }
  .info {
    @include vertical-align-inline-block;
    margin-left: 8px;
    .name {
      margin-right: 3px;
      font-size: 16px;
      vertical-align: middle;
    }
    .meta {
      margin-top: 5px;
      font-size: 12px;
      color: #969696;
    }
  }
}
```

这段样式就是用 `Sass` 语法编写的一段样式，和 `main.css` 文件中的样式效果完全相同。这段样式可能并不适合用来展示用  `Sass` 编写样式的益处，但我还是希望这种嵌套写法和我强行放入的 `mixin` 可以引起读者的注意。

大家可以简要浏览一下 [Sass 中文网--快速入门](https://www.sass.hk/guide/) 了解一下 `Sass` 的各种特性和语法。本系列教材后续都将使用  `Sass` 来编写样式文件。

`scss` 文件需要配置 `sass-loader` 才能在 webpack 中被打包编译

在 webpack 的配置中， 在`module` 配置段 的 `rules` 项的数组里加入如下配置

```
{
    test: /\.scss$/,
    use: [{
        loader: "style-loader"
    }, {
        loader: "css-loader"
    }, {
        loader: "sass-loader"
    }]
}
```

将 `js/main.js` 文件中对 `css/main.css` 文件的引用更改为 `css/main.scss`

```
// import '../css/main.css'
import '../css/main.scss'
```

用 `npm` 安装 `node-sass` 和 `sass-loader` ，这里注意一下，使用 `npm` 安装 `node-sass` 有很大的概率会因为网络问题导致安装失败，可以尝试使用 `cnpm` 进行安装。在教程示例代码根目录执行下面的命令

```
npm install sass-loader node-sass webpack --save-dev
```

重新进行 webpack 编译，刷新页面，页面效果应该与之前完全一致

### 这里是结尾

---

上一篇教程我们一起详细分析了 webpack 对 JS 文件的打包，这篇则主要针对 CSS 样式。这两部分也是 webpack 打包编译中最核心的部分，这两篇教程一起带大家从最基础的层面上来理解 webpack。

本篇中使用了很多个 `loader` ，与 `loader` 有关的配置是 webpack 配置中占比相对较大的部分，后续我们还会接触到一些其他 `loader`。每个 `loader` 其实都有一系列参数可以选用和配置，在对应项目的 github 主页会有介绍，了解一下有哪些参数还是很有必要的。

下一篇中我们将尝试使用一下 `HtmlWebpackPlugin` 这个插件，并学习使用 Gulp 来接管 Webpack。

##### 本教程是一个系列教程，可以到目录章查看所有教程

- [目录](../../README.md)
- [上一篇 WebGIS开发教程(五) 初识 Webpack](./1_Start.md)
- [下一篇 敬请期待](../../README.md)

#### 联系作者

---

- [简书主页](https://www.jianshu.com/u/a33591b39f71) 请优先关注我的简书账号，并在简书对应文章下留言，有APP通知推送所以能及时看到，简书也是我的文章首发平台
- [Github主页](https://github.com/Liuyl89/) 教程和相关代码在我的Github里都能够找到
- [ArcGIS知乎主页](http://zhihu.esrichina.com.cn/people/liuyl) 文章会被同步到ArcGIS知乎中，ArcGIS知乎是面向广大GISer的知识分享和问答平台，推荐大家经常去看看
- 微信公众号 搜索 幻想GIS 或扫描二维码，文章会通过公众号进行推送

    ![请扫码关注微信公众号 幻想GIS](http://upload-images.jianshu.io/upload_images/7292919-4932758f98ba8a3b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- QQMail liuyl89@qq.com
- GMail liuyl.gisuni@gmail.com 不太稳定，建议邮件后在简书里留言告诉我一下

---
