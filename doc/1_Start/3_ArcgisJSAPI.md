<div align="center">
  <h3 align="center">WebGIS开发教程(三) 本地部署ArcGIS API for JavaScript</h3>
</div>

作者：liuyl

关于作者：GIS从业者，主要在ArcGIS平台下做WebGIS开发，最后有作者的联系方式

版权所有：转载请保留作者名和原始链接

这是一个系列教程，内容有一定连续性，可移步 [目录篇](../../README.md) 查看所有教程

[教程示例代码下载](https://github.com/Liuyl89/fantasy-learning/)

### 一点前言

---


这个系列教程大部分内容都将侧重于基于 ArcGIS API for JavaScript 进行 WebGIS 开发，但后续也会考虑在单独的章节中介绍一些比较出名的开源地图API库的使用。好在理解编程思想和积累经验的重要程度远大于掌握某项技术，以 ArcGIS 平台为起点，熟练后再尝试其他平台也是个非常不错的学习路径

关于在本地部署 ArcGIS API for JavaScript ，本身并不复杂，且网络上已有大量教程存在。本不想重复造轮子的，但鉴于近期 ArcGIS API for JavaScript 版本迭代非常快，而且是两个主要版本在并行维护和更新，所以还是觉得有必要单独开一篇来介绍一下。这也能让这个教程完整性更好一些

技术更新迭代很快，这套教程的不想局限于特定技术和版本，所以本篇及系列教程的其他篇会在某些时刻对内容做一些补充和更新。本篇中，会有一个章节来持续性跟踪 ArcGIS API for JavaScript 的版本更新

### 下面是正文

---

#### 关于 3.x 版本和 4.x 版本的选择

目前 ESRI 官方并行维护着两个主要版本，数字3开头的 3.x 版本和数字4开头的 4.x 版本，目前这两个主要版本基本都保持着1个季度发布一个小版本的更新节奏。没有听说 3.x 版本最终会更新维护到什么时候，但 4.x 毫无疑问将会比 3.x 走得更远。如果在2017年初写这篇教程，我会毫不犹豫推荐大家从 3.x 版本开始，但现在 4.x 版本实现的功能已经足够丰富，所以我会推荐刚接触的同学直接从 4.x 起步。

但是如果你是想一个实际项目选择确定一个版本的话，可以参考下面列出几个参考要素来权衡、选择一下

- 选择 3.x
    - 需要兼容 IE11 以下版本的IE浏览器和其他不支持 WebGL 的浏览器 （吐槽：还是要尽力引导用户使用现代浏览器）
    - 有必需功能，这个功能不幸地在 [功能矩阵](https://developers.arcgis.com/javascript/latest/guide/functionality-matrix/index.html) 中被标为 `Coming soon` 和 `Not planned`
    - 已有基于 3.x 版本的成果，没有足够的资源将成果迁移到 4.x 版本上（变化很大，迁移成本很大）

- 选择 4.x
    - 需要三维浏览、分析功能， 3.x 版本不支持三维相关功能，只能用 4.x 版本
    - 不满足上面选择 3.x 版本中列出的几条

（以上如有遗漏，欢迎留言帮助我补充）

简而言之，如果不知道为什么要选择 3.x 版本，请选择 4.x 版本

此外，当小版本更新后，建议大家尝试将正在开发的项目的依赖版本也升级一下。 3.x 版本的这一过程一般来说都会非常顺利。 4.x 版本有时会存在类、方法等的名称变更或位置迁移，升级后针对性处理一下，问题一般也不会很大。

#### 官方文档

ArcGIS API for JavaScript 的文档和示例一直都很不错，建议将 Api 和示例都全部浏览一遍，开发时遇到问题要习惯于从 API 文档中寻找答案。因为版本迭代太快，所以不要对网络上的中文文档报太大期望。

[4.x 版本官方文档](https://developers.arcgis.com/javascript/)
[3.x 版本官方文档](https://developers.arcgis.com/javascript/3/)

官方文档页面国内访问速度不是很快，尤其是示例，可以参考下文在本地环境中部署 SDK

#### API 及 SDK 下载

[官方下载页面](https://developers.arcgis.com/downloads/apis-and-sdks?product=javascript
) 需要注册账号并登陆后才能下载

#### API 及 SDK 本地部署

API 和 SDK 将被部署到 nginx 中，如果不清楚如何使用 nginx ，请浏览上一篇教程 [WebGIS开发教程(二) Nginx 部署及配置](https://www.jianshu.com/p/a94a92456d58)

下面以在Windows系统 1.13.8 版本 nginx 中部署为例

API 和 SDK 都可以部署在 nginx-1.13.8\html 目录中，但为了和本教程示例代码相配套，我们这里设置一个名为 arcgis_js_api 的虚拟目录来用于部署。可以下载本教程的示例代码，在示例代码中将看到同样的目录结构

在 nginx-1.13.8 文件夹的父文件夹中创建名为 public 的文件夹，构建子文件夹，并将下载的 API 解压复制到目录中，最后形成如下目录结构：

![API 本地部署目录结构](http://upload-images.jianshu.io/upload_images/7292919-39bfe2a14a307897.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4.4 及之后的版本的 API 部署和之前的版本有一些不同，这里分开说明

##### 部署 4.4 和 3.21 及之后版本

4.x 适用于 4.4、4.5、4.6 及之后版本， 3.x 适用于 3.21、3.22、3.23 及之后的版本

以 4.6 版本为例

修改 `public\arcgis_js_api\library\4.6\init.js` 和  `public\arcgis_js_api\library\4.6\dojo\dojo.js` 两个文件

替换 `[HOSTNAME_AND_PATH_TO_JSAPI]` 为 `localhost/arcgis_js_api/library/4.6/`

4.4 和 3.21 版本后， API 不再默认支持 Http 协议。如果使用默认的 Https 协议，如上替换后就可以了，但如果想在 nginx 中使用，还需要配置 CA 证书，这部分内容请参考 [Nginx + Https本地部署ArcGIS JavaScript API 4.4/4.5](https://www.jianshu.com/p/24488c6fbc30)

一般情况下，我们在本地部署为 Http 协议比较方便，所以在本教程中，需要将上述两个文件按如下方式修改

改之前

```
baseUrl:"https://[HOSTNAME_AND_PATH_TO_JSAPI]dojo"
```

改之后

***注意 https 被修改成了 http***

```
baseUrl:"http://localhost/arcgis_js_api/library/4.6/dojo"
```

##### 部署 4.3 和 3.20 及之前版本

以 3.20 版本为例

修改 `public\arcgis_js_api\library\3.20\init.js` 和  `public\arcgis_js_api\library\3.20\dojo\dojo.js` 两个文件

替换 `[HOSTNAME_AND_PATH_TO_JSAPI]` 为 `localhost/arcgis_js_api/library/3.20/`

API 会自动判断使用 Http 协议或 Https 协议

##### 部署 SDK

下载 SDK 后，解压并将文件夹按如下方式放置即可

![SDK 本地部署目录结构](http://upload-images.jianshu.io/upload_images/7292919-276496e061367022.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 配置虚拟目录

修改 nginx 的配置文件 `nginx-1.13.8\conf\nginx.conf` ，添加名为 arcgis_js_api 的虚拟目录

server 段配置为如下形式

```
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }

		location ^~/arcgis_js_api/ {
            alias   ..\\public\\arcgis_js_api\\;
        }
    }
```

#### 访问 API 和 SDK

为配合本教程示例代码使用，请按上述方法部署 3.23 和 4.6 版本的 API ，SDK 可视需要选择部署

本地访问地址

4.6 API [http://localhost/arcgis_js_api/library/4.6/init.js](http://localhost/arcgis_js_api/library/4.6/init.js)
4.6 SDK [http://localhost/arcgis_js_api/sdk/4.6/index.html](http://localhost/arcgis_js_api/sdk/4.6/index.html)

3.23 API [http://localhost/arcgis_js_api/library/3.23/init.js](http://localhost/arcgis_js_api/library/3.23/init.js)
3.23 SDK [http://localhost/arcgis_js_api/sdk/3.23/index.html](http://localhost/arcgis_js_api/sdk/3.23/index.html)

### API 版本更新新特性追踪

---

本节用于整理和记录各个版本的 ArcGIS API for JavaScript 在更新时增加的新特性和新功能，以方便了解各版本之间的差别

具体内容留后慢慢补充和更新


### 这里是结尾

---

因为官方提供的 CDN 在国内访问极其不稳定，国内 CDN 版本又过于滞后，因此在日常工作中，基本都是使用自己本地部署的 API ，希望这篇教程能够帮助大家解决部署过程中遇到的问题和困惑

下一篇我们将使用 [HTML5 ★ BOILERPLATE](http://www.bootcss.com/p/html5boilerplate/) 前端模板、 Bootstrap 和 ArcGIS API for JavaScript 做出一个 Hello World 页面，并部署在 nginx 中，正式开启WebGIS开发旅程

##### 本教程是一个系列教程，可以到目录章查看所有教程

- [目录](../../README.md)
- [上一篇 WebGIS开发教程(二) Nginx 部署及配置](./2_Nginx.md)
- [下一篇 WebGIS开发教程(四) 一个 Hello World 地图页](./4_HelloWorld.md)

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
