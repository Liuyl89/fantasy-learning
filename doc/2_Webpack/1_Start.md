<div align="center">
  <h3 align="center">WebGIS开发教程(五) 初识 Webpack</h3>
</div>

作者：liuyl

关于作者：GIS从业者，主要在ArcGIS平台下做WebGIS开发，最后有作者的联系方式

版权所有：转载请保留作者名和原始链接

这是一个系列教程，内容有一定连续性，可移步 [目录章](../../README.md) 查看所有教程

[教程示例代码下载](https://github.com/Liuyl89/fantasy-learning/)

### 一点前言

---

Webpack 的学习曲线非常陡峭，然而一旦开始慢慢接触，你就会开始一点点发现它的价值。

在我开始写这篇教程时，简书上已经有一篇阅读量超60万长篇教程了

[入门Webpack，看这篇就够了](https://www.jianshu.com/p/42e11515c10f)

***文如标题！***

如果我的教程再同样写一遍，就没有意义了。所以，在接下来的几篇教程中，我将试图带着读者深入到 Webpack 打包编译后的代码中一探究竟。因为我自己就是在看了 Webpack 打包后的代码后，才恍然大悟般理解了 Webpack 究竟在做什么，后来遇到配置不如预想中生效时，也总能通过读生成后的代码找出问题所在，并做出合理的应对。

建议各位读者可以先花时间浏览一遍上面给出的这篇教程，也可以在阅读本教程时与其比对这看，互相补充

同时我也强烈建议各位读者跟随教程的脚步一点点动手配置自己的 Webpack ，这几乎是一件一劳永逸的工作，因为之后，你可能都不需要再从头写一个 Webpack 配置文件了，针对不同的情况，修修改改即可

### 下面是正文

---

#### Webpack做什么

Webpack 是什么，我就不去找定义了，只说 Webpack 做什么

`我们写的代码` => 经过 Webpack 编译 => `待部署代码`

其实在前一篇教程中 `我们写的代码` 就是 `待部署代码` ，二者是等同的，直接部署在 nginx 中即可访问。如果我们做个简单小项目，部署时可能也可以用同样的方式。但在实际生产中，最最基本的，部署前应该是要对代码做一次压缩混淆的，这时流程就是下面这样了

`我们写的代码` => 压缩混淆 => `待部署代码`

后来我们发现 ES6 语法很新潮，想用新语法写代码，然而并非所有浏览器都支持ES6语法，也有很多用户在用老版本浏览器，这时就需要用 Babel 把 ES6 语法转换成老语法，于是又要有这样的流程

`我们写的代码` => Babel 转换 => `待部署代码`

再后来又有新需求

`我们写的代码` => Sass / Less 编译 => `待部署代码`

`我们写的代码` => JSX / TypeScript 编译 => `待部署代码`

`我们写的代码` => 合并 js / css / 图片文件  => `待部署代码`

最后我们发现 `我们写的代码` 和 `待部署代码` 之间隔了千上万水，需要处理的事情太多了，必须要有一个东西帮我们统一处理这些任务，于是有了 Webpack

Webpack 本身并不能做这些事，它是通过配置将一个个插件组合起来完成的。我们使用 Webpack ，其实就是通过配置，告诉 Webpack 将要使用哪些插件、如何处理  `我们写的代码`，并在处理后把 `待部署代码` 输出到指定的位置

#### 配合教程示例做一些准备

首先从本篇开始，几乎所有教程示例的运行都会需要 NodeJS 环境。如果你还没有安装好 NodeJS 环境，请参考第一篇教程 [WebGIS开发教程(一) NodeJS安装](https://www.jianshu.com/p/744587e71df2)

请下载 [教程示例代码](https://github.com/Liuyl89/fantasy-learning/)，接下来的所有操作都是基于教程示例代码中的目录结构进行的，若读者操作的目录结构不同，各命令的写法和配置的写法可能会有所不同

我们先创建一个为这篇教程准备的文件夹 `lesson\2_Webpack\1_Start`

将 `lesson\1_Start\4_HelloWorld\js` 文件夹和 `lesson\1_Start\4_HelloWorld\bootstrap.html` 文件复制到 `lesson\2_Webpack\1_Start` 文件夹中，这是 bootstrap.html 能够正常访问的最小文件集合，可以访问 [http://localhost/lesson/2_Webpack/1_Start/bootstrap.html](http://localhost/lesson/2_Webpack/1_Start/bootstrap.html) 测试一下 nginx 是否正常工作

新建文件 `js/msg.js` 文件，里面添加一行代码

```
let message='Hello World'
```

修改 `bootstrap.html` 文件，把之前跳转到教程主页的 `<a>` 标签改为 `<button>` ，将文件中 `<a class="btn btn-primary btn-lg" target="_blank" href="https://www.jianshu.com/p/519dbc371575" role="button">前往 教程</a>` 这一行改为下面这句

```
<button id="my-btn" class="btn btn-primary btn-lg" >点击</button>
```

在对 `js/main.js` 文件的引用前增加对 `js/msg.js` 文件的引用

```
<script src="js/msg.js"></script>
<script src="js/main.js"></script>
```

然后在 `js/main.js` 文件中绑定按钮 `my-btn` 的 click 事件处理函数。 `js/main.js` 文件改之前是空的，直接加入下面这段

```
$('#my-btn').click(() => {
    alert(message)
})
```

如果有读者对这段代码感到困惑，请先熟悉一下 jQuery 和 ES6 ， `()=>{}` 语法是 ES6 中增加的定义函数的语法

现在我们可以刷新页面然后点击一下按钮，不出意外的话，会弹出一个写有 Hello World 的提示框。

如果页面不如期望中那样，请尝试检查代码拼写、清除浏览器缓存、换用支持 ES6 的浏览器或查看浏览器是否阻拦了提示框。现在起，读者应该要开始频繁的按 `F12` 键打开浏览器的调试工具，时刻关注调试工具控制台输出的错误信息，查看网络请求是否成功、响应数据是否正常，并学习和练习如何调试前端代码。教程中不会讲述如何做这些事情，然而它们太过重要，所有前端开发者都应该从一开始就进行训练（建议日常开发使用 Chrome 进行调试）。

#### 安装 Webpack

编写本篇教程时，npm 默认安装的 webpack 版本为 `3.10.0` ，webpack 版本不同可能会导致配置写法不同，如过程中遇到问题，可在安装时指定版本号

在命令行中，进入教程代码示例的根目录，执行如下两个命令

```
npm install -g webpack
npm install --save-dev webpack
```

执行成功后，根目录下会自动生成一个名为 `node_modules` 的文件夹

此时我们的目录结构大体是这样的

![目录结构](http://upload-images.jianshu.io/upload_images/7292919-a3c0b55fa8e42f45.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


继续在命令行中执行如下命令会看到版本号

```
webpack -v
```

#### 最简 Webpack 配置打包

现在我们在 `lesson\2_Webpack\1_Start` 文件夹中创建一个名为 `webpack.config.js` 的文件，并在新建的文件中输入如下内容

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
修改文件 `js/msg.js` 文件，在最后面添加一句 `export  { message }` ，之后文件中内容如下

```
let message = 'Hello World'
export  { message }
```

修改一下 `js/main.js` 文件，在最开始添加一句代码 `import msg from './msg'`，并修改 `alert` 的参数，使文件中的代码如下

```
import { message }from './msg'

$('#my-btn').click(() => {
    alert(message)
})
```

在命令行中，进入教程代码示例的根目录，执行如下命令

```
webpack --config lesson\2_Webpack\1_Start\webpack.config.js
```

如不出意外，命令行会返回如下信息提示打包成功

![打包成功](http://upload-images.jianshu.io/upload_images/7292919-7b133f6cb1a497aa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


这时，我们会发现， `lesson\2_Webpack\1_Start` 文件夹下多出了一个 `dist` 文件夹，里面有一个 `app.js` 文件

![打包后目录结构](http://upload-images.jianshu.io/upload_images/7292919-17f5cc4aea3a6142.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

修改 `bootstrap.html` 文件，注释掉对 `js/main.js` 和 `js/msg.js` 的引用，增加对 `dist/app.js` 文件的引用，如下

```
<!--<script src="js/msg.js"></script>-->
<!--<script src="js/main.js"></script>-->
<script src="dist/app.js"></script>
```

访问 [http://localhost/lesson/2_Webpack/1_Start/bootstrap.html](http://localhost/lesson/2_Webpack/1_Start/bootstrap.html) ，点击按钮，这个页面的行为与之前是完全一致的

#### 刚刚发生了什么

现在我们来一起详细看看刚才执行的命令和命令背后 webpack 做了什么

刚刚执行了一个命令

```
webpack --config lesson\2_Webpack\1_Start\webpack.config.js
```

这个命令让 webpack 按照我们创建的 `lesson\2_Webpack\1_Start\webpack.config.js` 文件进行打包，指定配置文件的路径使用 `--config 文件路径` 参数，当不指定 `--config` 时，webpack 命令在当前目录中默认查找 `webpack.config.js` 或 `webpackfile.js` 文件作为配置文件

因此，如果我们在命令行中先进入到 `lesson\2_Webpack\1_Start` 目录中，然后执行 `webpack` 命令，效果是一样的，如下

![另一种执行命令](http://upload-images.jianshu.io/upload_images/7292919-8f6c711c81bce9b7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

下面看一下 `webpack.config.js` 文件中的配置

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

我们先排除一下 NodeJS 代码的干扰

首先， `const path = require('path')` 一句是 NodeJS 中引入模块的写法， `path` 模块是 NodeJS 的自带模块，提供一些处理文件路径的工具函数。可以简单了解一下 [Node.js Path 模块](http://www.runoob.com/nodejs/nodejs-path-module.html) 。`path.resolve(__dirname, 'js/main.js')` 执行得到的是 `'E:\...\fantasy-learning\lesson\2_Webpack\1_Start\js\main.js'`

虽说 `webpack.config.js` 是一个配置文件，但 `.js` 扩展名意味着这是一个可以执行的文件。实际上很多配置项的值都是在执行命令时动态确定的，我们甚至有办法在执行命令时调试配置文件，在其中设置断点。灵活使用这一点很关键，当需要为一个项目准备多种情况（如一套用于开发、一套用于部署）下的 webpack 配置时，抽离公共部分能有效减少重复配置

`module.exports` 是 NodeJS 的模块化语法，在 NodeJS 中，每个文件都是一个模块，`module.exports` 就是模块暴露给引用者的数据和方法。第一句用到的 `require('模块路径')` 得到的就是模块路径指向的文件中 `module.exports` 赋值的对象。

NodeJS 使用 CommonJS 规范做模块化，我们的 ArcGIS API for JavaScript 里面用的 Dojo 用的是 AMD规范， 可以看一下这篇，[js模块化编程之彻底弄懂CommonJS和AMD/CMD！](http://www.cnblogs.com/chenguangliang/p/5856701.html)。然后在 ES6 中，两种规范都没用，用了 Import/Export
 语法，前面我们在 `main.js` 文件中添加了一句 `import msg from './msg'`，就是这个。这些不同的写法之后会经常出现在教程中，教程中也将不再做过多解释，所以建议对此感到困惑的同学花些时间理解一下。

##### 现在不受干扰地看究竟配置了什么

`module.exports =` 后面的就是我们的配置了，这个对象将被 webpack 获取到，并按其中的配置执行打包操作

配置分为 `entry` 和 `output` 两段，这两段是必须指定的，缺一不可

```
    entry: {
        app: [path.resolve(__dirname, 'js/main.js')],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
```

`entry` 指定了打包的入口文件，就是告诉 webpack 从哪个文件作为起始开始打包。`app` 是打包后生成文件的标识，后面的数组中指定了要打包到标识为 `app` 的文件中的入口文件。

`output` 指定了打包后文件的输出配置。filename是用来生成文件名的模板，这里的 `[name]` 在生成打包后文件时会被填入 `entry` 段指定的 `'app'` ，即生成的文件名为 `app.js` 。`path` 指定了 `app.js` 文件的输出路径，这里动态得到的是 `'E:\...\fantasy-learning\lesson\2_Webpack\1_Start\dist\'`。

上面说的这些，换成一句话就是，把 `main.js` 文件中涉及到的所有代码打包生成为一个名为 `app.js` 的文件中，并将 `app.js` 文件放到 `output.path` 指定的文件夹中

请注意 ***main.js 文件中涉及到的所有代码*** 这一句

我们之前在 `main.js` 文件最开始加了一句 `import msg from './msg'` ，在 ES6 中，这句的意思是加载 `./msg.js` 文件，如果这个文件从未被执行过，立即执行一次这个文件。如果这个文件最后还 export 了对象出来，把这个对象（即 `{message:'Hello World'}`）存起来，后面再有什么地方引用这个文件时，直接返回被存起来的对象

实际在 webpack 打包时，webpack 通过识别所有的 `import` 语句，将这些语句都编译成了另一种形式，并连同被 `import` 的文件中的代码一并输出到了 `app.js` 文件中。在最终代码执行上，和上一段中我们的本意保持一致

假如 `msg.js` 文件中也写了 `import` 语句引用了其他一些文件，这些文件也会被同样处理。所以最后变成这样，本来这些分散独立的文件之间通过 `import` 语句互相引用， webpack 依靠识别 `import` 语句顺藤摸瓜，将引用链上的所有文件打包到了一个文件中

所以在这里实际上我们引用了 `main.js` 和 `msg.js` 两个文件，却只添加了一个 `app.js` 文件的引用。因为 `app.js` 文件中已经包括了那两个文件中的代码

在一个复杂的项目中，逻辑会被拆散到非常多的独立文件中，这样的打包策略能将最终页面加载时的文件请求次数控制在一个可控范围内，会极大地提高页面加载效率

#### 深入 app.js 文件一探究竟

下面这个是去掉了大部分注释和不影响本教程的代码，简单有个印象后，我们来一点点读懂这段代码
```
(function(modules) {
 	var installedModules = {}; // 加载后的模块被缓存在这里
 	function __webpack_require__(moduleId) { // 这个函数用来执行模块加载
 		if(installedModules[moduleId]) { // 如果模块存在于缓存中，直接返回缓存中的结果
 			return installedModules[moduleId].exports;
 		}
 		var module = installedModules[moduleId] = { // 内部使用的模块存储结构
 			i: moduleId, // 模块id，对应于模块在 modules 数组中的索引号
 			l: false, // 模块是否已加载过
 			exports: {} // 模块输出对象
 		};
        // 执行模块内的代码
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 		module.l = true;
 		return module.exports; // 将模块输出对象返回给引用模块的地方
 	}
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                configurable: false,
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
 	...
 	return __webpack_require__(__webpack_require__.s = 0);
 })
/************************************************************************/
 ([
/* 0 */
      (function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__(1);
      }),
/* 1 */
      (function(module, __webpack_exports__, __webpack_require__) {
          var __WEBPACK_IMPORTED_MODULE_0__msg__ = __webpack_require__(2);
          $('#my-btn').click(() => {
                alert(__WEBPACK_IMPORTED_MODULE_0__msg__["a" /* message */])
          })
       }),
/* 2 */
      (function(module, __webpack_exports__, __webpack_require__) {
           __webpack_require__.d(__webpack_exports__, "a", function() { return message; });
           let message = 'Hello World'
       })
 ]);
```

首先，这一段代码的最外层是一个被立刻调用的函数

```
(function(modules) {
      // 外层函数体
})
/************************************************************************/
([
/* 0 */...,
/* 1 */...,
/* 2 */...
])
```

后半部分 `()`里是一个有三个元素的数组，这个数组被作为参数 `modules` 传入前半部分定义的函数中，整个文件加载完成后，这个函数调用立刻被执行

外层函数先定义 `installedModules` 用于缓存已被加载的模块，再定义名为 `__webpack_require__(moduleId)` 的用于执行模块加载的函数，最后 `return __webpack_require__(__webpack_require__.s = 0);` 一句执行 `0` 号模块的加载，并将模块输出对象返回

`0` 号模块是 webpack 自动生成的模块

```
(function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(1);
}),
```

里面执行加载 `1` 号模块，并将自身的输出对象设置为 `1` 号模块的输出对象。这里实际反映的是 `app: [path.resolve(__dirname, 'js/main.js')],` 这一句配置中数组里的文件。其实数组里可以指定多个文件，例如如果将这句配置改为 `app: [path.resolve(__dirname, 'js/main.js'),path.resolve(__dirname, 'js/plugins.js')],` ，webpack 生成的 `0` 号模块将是下面这样

```
(function(module, exports, __webpack_require__) {
    __webpack_require__(1); // 加载 js/main.js
    module.exports = __webpack_require__(3); // 加载 js/plugins.js
}),
```

回到之前的配置，接着看 `1` 号模块

```
(function(module, __webpack_exports__, __webpack_require__) {
    var __WEBPACK_IMPORTED_MODULE_0__msg__ = __webpack_require__(2);
    $('#my-btn').click(() => {
        alert(__WEBPACK_IMPORTED_MODULE_0__msg__["a" /* message */])
    })
}),
```

`var __WEBPACK_IMPORTED_MODULE_0__msg__ = __webpack_require__(2);` 这句是由 `import msg from './msg'` 编译后得到的，原语句的含义是，加载 `./msg.js` 模块，并把模块输出的对象赋值给变量 `msg`

之前说了，webpack 会识别并编译 `import` 语句，依靠依赖链来打包所有文件，webpack 由这句知道要去将 `./msg.js` 文件也打包起来，打包后 `./msg.js` 模块被标记成 `2` 号模块，同时 import 语句被编译成

```
var __WEBPACK_IMPORTED_MODULE_0__msg__ = __webpack_require__(2);
```

`__webpack_require__(2)` 去加载 `2` 号模块，模块输出的对象被赋值到 `__WEBPACK_IMPORTED_MODULE_0__msg__` 变量中。

 `2` 号模块被打包编译成如下的样子

```
(function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.d(__webpack_exports__, "a", function() { return message; });
    let message = 'Hello World'
})
```

`__webpack_require__.d(__webpack_exports__, "a", function() { return message; });` 一句为模块输出对象定义了一个名为 `a` 的只读属性，属性的 `get` 设置为 `function() { return message; }`。执行这句后，访问 `__webpack_exports__['a']` 得到的就是变量 `message` 了。

若是不太熟悉 `__webpack_require__.d` 函数中的代码，可以阅读一下这篇文章 [解析 神奇的 Object.defineProperty](https://segmentfault.com/a/1190000004346467?utm_source=tuicool)

接下来我们回到 `1` 号模块，我们看到对 `message` 的访问被编译成了

```
__WEBPACK_IMPORTED_MODULE_0__msg__["a" /* message */]
```

也就是刚刚我们说的，这一句得到的就是 `msg.js` 文件中定义 `message` 变量

`app.js` 文件执行的最后，下面这段被执行，为页面的按钮绑定了 `click` 事件处理函数

```
$('#my-btn').click(() => {
    alert(__WEBPACK_IMPORTED_MODULE_0__msg__["a" /* message */])
})
```

至此，`app.js` 文件执行结束，虽然绕了些弯子，但执行后的结果和我们单独引用文件时是一致的。区别就是经 webpack 打包后，虽然代码被写在两个文件中，页面却只需要加载一个文件，而且这两个文件都是以模块形式存在的，变量都被封闭在模块内部，只有被 `export` 的那些，才会在 import 语句引用了这个模块后被访问到。

### 这里是结尾

---

这一篇写得长了点，而且只了解了一下最简单的 webpack 配置，和在此配置下，webpack 是如何进行打包编译的。希望各位读者看后能够对 webpack 的基本工作原理有所理解，因为之后再复杂的配置，都不过是在此基础上增加一些变化。

下一篇我们将继续以这一篇中的配置为基础，一步步去添加那些最常用的配置项和插件。但之后将不会再像这篇一样去详细分析 webpack 打包后的代码了，只会在必要的时候点出我们添加的配置是如何影像到最后生成的代码的。希望大家经过此篇后，在使用 webpack 的过程中遇到问题是，能够习惯于从打包后的代码中寻找问题所在，不再在面对诸多配置项时感到迷惑和无助。

##### 本教程是一个系列教程，可以到目录章查看所有教程

- [目录](../../README.md)
- [上一篇 WebGIS开发教程(四) 一个 Hello World 地图页](../1_Start/4_HelloWorld.md)
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

***
