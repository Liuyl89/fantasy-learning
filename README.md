## Fantasy Learning ——WebGIS开发教程
***Auth by Liuyl from GisUni***

### 前言

---

这个教程的目标是帮助大家在WebGIS开发的过程中，能够更顺利地使用当前JS生态中那些热门的技术，提高开发效率，做出更好的WebGIS应用

目前计划分多篇介绍如何使用Webpack、Gulp等工具辅助我们开发，如何使用React和Redux开发一个WebGIS站点，如何让这些工具及框架和Arcgis API for JavaScript很好地结合在一起

教程中还会介绍那些常用的WebGIS功能在这样一套技术架构中该如何实现

配合文档，会有一整套示例代码供大家试验和使用

目前这个教程的编制工作刚刚起步，内容将会一点点丰富起来。如果各位客官有好的想法和建议的话，欢迎通过后面列出的联系方式反馈给我

[点击下载示例代码](https://github.com/Liuyl89/fantasy-learning/archive/master.zip)

### 目录

---

这个目录是个大体思路，后续会视情况进行调整

1. 起步
    - [NodeJS 环境搭建](doc/1_Start/1_NodeJS.md)
    - [Nginx 部署及配置](doc/1_Start/2_Nginx.md)
    - [本地部署 ArcGIS API for JavaScript](doc/1_Start/3_ArcgisJSAPI.md)
    - [一个 Hello World 地图页](doc/1_Start/4_HelloWorld.md)
2. 使用 Webpack 和 Gulp
    - [初识 Webpack](doc/2_Webpack/1_Start.md)
    - [再识 Webpack](doc/2_Webpack/2_Second.md)
    - 让 Gulp 接管 Webpack
    - 用 Webpack 引入 jQuery 和 Bootstrap
    - 用 Webpack 引入 ArcGIS API for JavaScript
    - 用 React 再做一次 Hello World 地图页
3. 项目实践那些事
    - 用 Webpack 把第三方库打包成 DLL
    - 将通用组件拆分到可独立维护的 JS 文件中
    - 用工厂模式让应用在 3.x 和 4.x 中随性切换
    - 不如试一下 Leaflet 和 MapBox
    - 使用 Promise 和 Async/Await
    - 让 Redux 处理复杂交互
    - 常用第三方库和插件
    - 使用 ESlint 控制代码质量
    - 如何测试
    - 如何自动构建文档
4. 使用 React 实现常用 WebGIS 功能
    - 经典 WebGIS 应用页面布局
    - 图层管理
    - 分屏浏览
    - 二三维切换与联动
    - 绘制图形和缓冲区
    - 点击地图查询
    - 弹一个模态框
    - 地图上渲染统计图
5. JavaScript 也能写后台
    - 用 Express 做后台
    - 用 Restful 应对复杂业务
    - ORM 不止能查库，还能查 ArcGIS Server 服务
    - 来一套完整的用户模块
    - 拒绝崩溃
6. 通过 JavaScript 看 ArcGIS 产品
    - 定制 ArcGIS Portal
    - Insights for ArcGIS
    - WebApp Builder
    - 捷泰 Geocoding
    - ......

7. JavaScript 还能写原生应用
    - React Native 版 Hello World
    - 浏览个地图
8. 用 JavaScript 实现三维功能
...


#### 联系作者

---

- [简书主页](https://www.jianshu.com/u/a33591b39f71) 请优先关注我的简书账号，并在简书对应文章下留言，有APP通知推送所以能及时看到，简书也是我的文章首发平台
- [Github主页](https://github.com/Liuyl89/) 教程和相关代码在我的Github里都能够找到
- [ArcGIS知乎主页](http://zhihu.esrichina.com.cn/people/liuyl) 文章会被同步到ArcGIS知乎中，ArcGIS知乎是面向广大GISer的知识分享和问答平台，推荐大家经常去看看
- 微信公众号 搜索 幻想GIS 或扫描二维码，文章会通过公众号进行推送

    ![请扫码关注微信公众号 幻想GIS](http://upload-images.jianshu.io/upload_images/7292919-4932758f98ba8a3b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- QQMail liuyl89@qq.com
- GMail liuyl.gisuni@gmail.com 不太稳定，建议邮件后在简书里留言告诉我一下


