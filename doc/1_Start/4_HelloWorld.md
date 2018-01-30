<div align="center">
  <h3 align="center">WebGIS开发教程(四) 一个 Hello World 地图页</h3>
</div>

作者：liuyl

关于作者：GIS从业者，主要在ArcGIS平台下做WebGIS开发，最后有作者的联系方式

版权所有：转载请保留作者名和原始链接

这是一个系列教程，内容有一定连续性，可移步 [目录篇](../../README.md) 查看所有教程

[教程示例代码下载](https://github.com/Liuyl89/fantasy-learning/)

### 一点前言

---

这会是一个略显复杂的 Hello World

做 Web 开发，一上来就要面对至少三种程序语言(或协议)，HTML、JavaScript、CSS

相较之下，下面这段 C 语言版 Hello World 确实是对初学者太过友好了~~

```
#include <stdio.h>
void main()
{
     printf("Hello World\n");
}
```

很遗憾，本教程不会专门讨论 HTML、JavaScript、CSS 的基本语法，甚至不会过多探讨 jQuery、Bootstrap、ES6、lodash 等的语法或用法，以及浏览器调试工具的使用方法。这些将被默认为读者已经掌握的前置知识，否则这个教程就无法将内容聚焦于 WebGIS 开发了。因此，如果在阅读本系列教程过程中，遇到那些未做说明而让你感到困惑的步骤或代码，请先花时间查找资料补足相关知识，也可留言以获取作者和其他读者的帮助。

本篇我们将使用 [HTML5 BOILERPLATE](https://link.jianshu.com/?t=http%3A%2F%2Fwww.bootcss.com%2Fp%2Fhtml5boilerplate%2F) 、 [Bootstrap 3](https://v3.bootcss.com/) 和 ArcGIS API for JavaScript 做出一个 Hello World 页面，页面将部署在 nginx 中。

关于 nginx 和 ArcGIS API for JavaScript 的部署请阅读WebGIS开发教程的第二篇和第三篇，这一篇中我们将直接使用前面两篇中部署好的 nginx 和 API

### 下面是正文

---

#### 使用 HTML5 BOILERPLATE 搭建初始页面

 [HTML5 BOILERPLATE](https://link.jianshu.com/?t=http%3A%2F%2Fwww.bootcss.com%2Fp%2Fhtml5boilerplate%2F) 是一个 web 开发前端模版，模板的作用就是让我们以模板为基础开始进行开发，很多重要的却和要实现的功能无关的工作已经由模板做好了。甚至不太需要深究模板究竟帮我们做了什么，直接使用就可以了

如果想了解模板大概做了什么，可以阅读这篇文章 [HTML5 Boilerplate - 让页面有个好的开始](http://www.cnblogs.com/season-huang/p/4187219.html)

通常情况下，开发一个新页面时，我都会从这里起步，而不是手动新建一个新的 html 文件。

##### 下载

点击链接直接下载 v4.1.0 版本 [ html5-boilerplate](https://github.com/h5bp/html5-boilerplate/zipball/v4.1.0)

#####  部署

将压缩包内的文件夹解压到 `lesson\1_Start\` 目录中，lesson 目录是放示例页面和代码的目录，该目录和 nginx-1.13.8 同级，复制后将文件夹名称从`h5bp-html5-boilerplate-3cd1967` 更改为 `4_HelloWorld`

完成后目录结构应该是这样的
![目录结构](http://upload-images.jianshu.io/upload_images/7292919-82548bbdce1fe215.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 为 lesson 目录配置虚拟目录

修改 nginx 的配置文件 `nginx-1.13.8\conf\nginx.conf` ，添加名为 lesson 的虚拟目录

server 段中添加如下配置

```
location ^~/lesson/ {
    alias   ..\\lesson\\;
}
```

修改后重启 nginx

##### 访问页面

访问 [http://localhost/lesson/1_Start/4_HelloWorld/index.html](http://localhost/lesson/1_Start/4_HelloWorld/index.html)

恭喜，我们看到了第一个欢迎页面

![HTML5 Boilerplate 欢迎页](http://upload-images.jianshu.io/upload_images/7292919-2485734966065d99.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 修改 index.html

在国内使用这套模板时，还需要做一点点修改

替换 jQuery 的 CDN `<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>` 为

```
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
```

注释或删除 google 统计

```
<!--<script>-->
    <!--var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];-->
    <!--(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];-->
    <!--g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';-->
    <!--s.parentNode.insertBefore(g,s)}(document,'script'));-->
<!--</script>-->
```

刷新页面，虽然页面没有变化，但调试工具中已经不会再提示无法获取 `jquery.min.js` 文件了

以上经过修改的 `index.html` 文件，可以在示例代码 `lesson\1_Start\4_HelloWorld\index.html` 路径下找到

#### 引入 Bootstrap

[Bootstrap](https://v3.bootcss.com/) 是最受欢迎的 HTML、CSS 和 JS 框架，用于开发响应式布局、移动设备优先的 WEB 项目 (引自 Bootstrap 官网)

使用 Bootstrap 至少可以保证我们的示例页面在未经美术设计的情况下，不至于太过难看。在实际项目中我一般也会引入 Bootstrap ，在样式和响应式布局方面能够提供很好的基础和便利，官方提供的组件和插件也都很实用。另外，基于 Bootstrap 的第三方 jQuery 插件非常丰富好用，例如 Treeview、Table等，可以省下重复造轮子的时间和精力。

这个教程所有示例页面都会引入 Bootstrap，且通常情况下，教程中不会试图解释使用 Bootstrap 的相关代码，请读者通过官方文档自行补充相关知识

##### 创建新的 html 文件

复制粘贴上一小节修改后的 `index.html` 文件到同一目录中，重命名为 `bootstrap.html`

##### 修改 bootstrap.html 文件

注释对 `normalize.css` 和 `main.css` 样式文件的引用，添加对 bootstrap 样式文件的引用。之所以要注释掉原来的两个，是因为 `bootstrap.min.css` 中已经包括了这两个文件中的样式，不需要再重复引用了

```
<!--<link rel="stylesheet" href="css/normalize.css">-->
<!--<link rel="stylesheet" href="css/main.css">-->
<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
```

在 jQuery 引用的后面添加 bootstrap 的 js 文件引用

```
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script></script>
<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
```

修改页面显示的内容，替换 `<p>Hello world! This is HTML5 Boilerplate.</p>` 为

```
<div style="margin-top: 50px" class="container">
    <div class="jumbotron">
        <h1>Hello World</h1>
        <p>这是WebGIS开发教程的示例页面</p>
        <a class="btn btn-primary btn-lg" target="_blank"
            href="https://www.jianshu.com/p/519dbc371575" role="button">前往 教程</a>
    </div>
</div>
```

##### 访问页面

访问 [http://localhost/lesson/1_Start/4_HelloWorld/bootstrap.html](http://localhost/lesson/1_Start/4_HelloWorld/bootstrap.html) 查看修改后的页面

可以看到如下页面

![访问 bootstrap.html](http://upload-images.jianshu.io/upload_images/7292919-7dcd1f334a54c242.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

以上经过修改的 `bootstrap.html` 文件，可以在示例代码 `lesson\1_Start\4_HelloWorld\bootstrap.html` 路径下找到


#### 引入 ArcGIS API for JavaScript

复制粘贴上一小节修改后的 `bootstrap.html` 文件到同一目录中，重命名为 `map.html`

##### 修改 map.html 文件

添加 main.css 文件的引用（这个文件和下面的 init.js 文件都是在上一篇教程中部署的 API 文件）

```
<link rel="stylesheet" href="/arcgis_js_api/library/4.6/esri/css/main.css">
```

添加 init.js 文件的引用

```
<script src="/arcgis_js_api/library/4.6/init.js"></script>
```



修改页面 html ，将之前的

```
<div style="margin-top: 50px" class="container">
    ...
</div>
```

改为

```
<div style="margin-top: 50px" class="container">
    <div class="jumbotron">
        <div id="view-main" style="height:400px"></div>
    </div>
</div>
```

在最后一个 `script` 标签后添加新的 `script` 标签。这段代码取自 ArcGIS API for JavaScript 官方文档中最基础的示例，如需详细了解代码意义，请阅读官方文档 [Intro to MapView - Create a 2D map](https://developers.arcgis.com/javascript/latest/sample-code/intro-mapview/index.html)

```
<script>
    require([
        "esri/Map",
        "esri/views/MapView",
        "dojo/domReady!"
    ], function (Map, MapView) {
        var map = new Map({
            basemap: "streets",
        })
        var view = new MapView({
            container: "view-main",
            map: map,
            zoom: 3,
            center: [110, 40],
        })
    })
</script>

```

经过上述修改，最终我们的页面将是下面这个样子(去掉了部分注释代码)

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
    <title>4_HelloWorld</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">

    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="/arcgis_js_api/library/4.6/esri/css/main.css">
    <script src="js/vendor/modernizr-2.6.2.min.js"></script>
</head>
<body>
<!--[if lt IE 7]>
<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
    your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to
    improve your experience.</p>
<![endif]-->

<!-- Add your site or application content here -->
<div style="margin-top: 50px" class="container">
    <div class="jumbotron">
        <div id="view-main" style="height:400px"></div>
    </div>
</div>

<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="/arcgis_js_api/library/4.6/init.js"></script>
<script src="js/plugins.js"></script>
<script src="js/main.js"></script>

<script>
    require([
        "esri/Map",
        "esri/views/MapView",
        "dojo/domReady!"
    ], function (Map, MapView) {
        var map = new Map({
            basemap: "streets",
        })
        var view = new MapView({
            container: "view-main",
            map: map,
            zoom: 3,
            center: [110, 40],
        })
    })
</script>
</body>
</html>

```

##### 访问页面

访问 [http://localhost/lesson/1_Start/4_HelloWorld/map.html](http://localhost/lesson/1_Start/4_HelloWorld/map.html) 查看修改后的页面

可以看到如下页面

![访问 map.html](http://upload-images.jianshu.io/upload_images/7292919-1eb6873124b20674.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

以上经过修改的 `map.html` 文件，可以在示例代码 `lesson\1_Start\4_HelloWorld\map.html` 路径下找到


### 这里是结尾

---

这篇教程讲述了一下从零开始，如何以 HTML5 BOILERPLATE 和 Bootstrap 为基础，编写一个地图页面。若是几年前，已经可以在 `map.html` 的基础上通过不断添加 html 和 js 代码来构建项目应用了，一个复杂的
 WebGIS 应用也不过就是在此基础上将代码分散到其他文件之中，并按某种逻辑或思想来组织这些文件和代码

但放到现在，若仍如此就稍显脱离时代潮流了。从下一篇开始，我们将一步步尝试使用 Gulp 和 Webpack 帮助我们进行 WebGIS 开发。这一篇中涉及到的所有东西都不会被舍弃，但我们还需要学习使用更多的工具和技术才能再次看到这一篇教程中最后看到的页面

然而，也许这一切都是值得的~

##### 本教程是一个系列教程，可以到目录章查看所有教程

- [目录](../../README.md)
- [上一篇 WebGIS开发教程(三) 本地部署 ArcGIS API for JavaScript](./3_ArcgisJSAPI.md)
- [下一篇 WebGIS开发教程(五) 初识 Webpack](../2_Webpack/1_Start.md)

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
