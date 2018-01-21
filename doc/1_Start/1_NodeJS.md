<div align="center">
  <h3 align="center">WebGIS开发教程(一) NodeJS安装</h3>
</div>

作者：liuyl

关于作者：GIS从业者，主要在ArcGIS平台下做WebGIS开发，最后有作者的联系方式

版权所有：转载请保留作者名和原始链接

这是一个系列教程，内容有一定连续性，可移步 [目录章](../../README.md) 查看所有教程

[教程示例代码下载](https://github.com/Liuyl89/fantasy-learning/)

### 一点前言

---

这套教程尽量使用最新稳定版本的环境、工具和第三方库

目前NodeJS最新稳定版本是8.9.4，未注明情况下均使用该版本NodeJS环境

教程代码开发系统环境为Windows，Mac和Linux在个别地方有差别，请自行修正

NodeJS已经成为目前JS前端开发的必备环境，即使项目是纯前端项目，也可能需要一些在NodeJS中执行的工具(如Babel、Webpack、Gulp等)来帮助编译和打包

### 下面是正文

---

#### 安装NodeJS

[NodeJS中文官网](http://nodejs.cn/download/) 下载最新版本NodeJS安装包

安装过程略...

安装后可以测试一下

命令行执行

```
node -v
```

命令返回

`v8.9.4`

#### 多个NodeJS版本共存

如果没有多版本共存的需求，可以略过本小节
不同版本的NodeJs特性和支持语法都会有不同，有时会需要多个版本共存

可以使用 [nvm](https://github.com/creationix/nvm) (linux & mac) 和 [nvm-windows](https://github.com/coreybutler/nvm-windows) (windows) 进行NodeJS的安装和版本切换

nvm的安装包请自行下载，安装过程略...

***以下过程以nvm-windows为例***

安装后可以在命令行窗口执行如下命令设置NodeJS和NPM的下载镜像，不然下载速度会比较慢
```
nvm node_mirror https://npm.taobao.org/mirrors/node/
nvm npm_mirror https://npm.taobao.org/mirrors/npm/
```

***注意！如果之前windows系统中在默认路径安装过NodeJs，即 `C:\Program Files\nodejs` 目录，在继续下一步前，要将nodejs目录整体删除，否则安装NodeJS后，会无法执行node命令。
同时，npm的安装目录也需要被删除 `C:\Users<user>\AppData\Roaming\npm`，否则npm命令可能不能正确地安装的第三方包***

在命令行窗口执行如下命令
```
nvm install 8.9.4
```

可以继续安装第二个版本的NodeJS，如7.5.0
```
nvm install 7.5.0
```

使用nvm use命令切换NodeJS版本
```
nvm use 8.9.4
```
命令返回

`Now using node v8.9.4 (64-bit)`

然后可以用 `node -v` 命令查看一下node版本

***注意！npm 安装的包在不同版本中是不共享的，所以全局安装时，如下一节提到的cnpm，需要在不同版本下分别安装***

#### 淘宝源设置

npm默认下载速度非常慢，速度慢又会导致安装第三方包失败，在国内使用npm时设置淘宝npm镜像是必需的

在命令行窗口执行如下命令

```
npm config set registry https://registry.npm.taobao.org
```

设置完成后所有下载请求都会通过淘宝镜像完成

#### 安装cnpm

即使设置了淘宝源，npm在安装某些包时仍会因个别工具下载超时导致安装失败，如node-sass这个包用npm直接安装有非常高的几率会失败

因此我建议大家日常可以使用cnpm进行包管理，或者在遇到包安装失败或无法使用时，用cnpm重新安装一下再试试

在命令行窗口执行如下命令安装cnpm

```
npm install cnpm -g
```

`install` 是使用npm时最常用的命令，`-g` 参数意味着这个包会安装在全局环境中，安装成功后，我们就可以在命令行窗口中使用cnpm命令了

cnpm完全继承了npm的命令，所有npm命令均可以使用cnpm执行

### 这里是结尾

---

node 和 npm 命令在前端开发中需要经常使用，请查看官方文档了解命令的各个常用参数

后面教程中如果用到一些命令也会简单作以介绍，但这些内容并不会在本教程中独立出现

下一篇我们将简单了解一下nginx的部署和使用，nginx是目前部署网站数量成长最快的服务器软件，而且配置起来相当简单，功能也极为强大。

##### 本教程是一个系列教程，可以到目录章查看所有教程

- [目录](../../README.md)
- [下一篇 WebGIS开发教程(二) Nginx 部署及配置](./2_Nginx.md)


#### 联系作者

---

- [简书主页](https://www.jianshu.com/u/a33591b39f71) 请优先关注我的简书账号，并在简书对应文章下留言，有APP通知推送所以能及时看到，简书也是我的文章首发平台
- [Github主页](https://github.com/Liuyl89/) 教程和相关代码在我的Github里都能够找到
- [ArcGIS知乎主页](http://zhihu.esrichina.com.cn/people/liuyl) 文章会被同步到ArcGIS知乎中，ArcGIS知乎是面向广大GISer的知识分享和问答平台，推荐大家经常去看看
- 微信公众号 搜索 幻想GIS 或扫描二维码，文章会通过公众号进行推送

    ![请扫码关注微信公众号 幻想GIS](http://upload-images.jianshu.io/upload_images/7292919-4932758f98ba8a3b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- QQMail liuyl89@qq.com
- GMail liuyl.gisuni@gmail.com 不太稳定，建议邮件后在简书里留言告诉我一下

