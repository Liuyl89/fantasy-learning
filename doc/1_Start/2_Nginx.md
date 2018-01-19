<div align="center">
  <h3 align="center">WebGIS开发教程(二) Nginx 部署及配置</h3>
</div>

作者：liuyl

关于作者：GIS从业者，主要在ArcGIS平台下做WebGIS开发，最后有作者的联系方式

版权所有：转载请保留作者名和原始链接

[教程示例代码下载](https://github.com/Liuyl89/fantasy-learning/)

---

### 一点前言

---

Nginx 是一个很强大的高性能 Web 和反向代理服务器，它在很多方面都具有非常优越的特性，例如并发数、复载均衡、集群等等

Nginx 的常用配置非常简单明了，实际工作中用的最多的是反向代理，如果能够灵活使用，会给开发和部署工作带来巨大的便利

本篇既是一个入门教程，也会被当成一个总结和记录 nginx 使用经验的地方，随着对 nginx 使用的深入，后续会不断在本篇中补充新的内容

各位同学如果在使用 nginx 过程中遇到问题，也可在本篇后面留言讨论

### 注意
---

本篇内容的测试环境为 Windows 系统， Mac 和 Linux 系统在个别地方会有所不同，请自行调整

编写时官方最新版本 `1.13.8` ，如无特殊说明，下文中均使用该版本

### 下面是正文

---

#### 下载、部署、启动

[官网下载页](http://nginx.org/en/download.html) 下载 nginx/Windows-1.13.8 安装包

打开压缩包，将里面的 nginx-1.13.8 文件夹解压到硬盘，最好是纯英文路径，以免出问题

打开命令行窗口，进入 nginx-1.13.8 文件夹，执行下面的语句启动Nginx

```
start nginx
```

正常情况命令行并不会返回任何信息，但在任务管理器中，我们可以找到名为 nginx.exe 的进程。请确定当前80端口未被其他服务器软件占用，如被占用请关闭占用端口的服务器软件或参考下文修改 nginx 的监听端口

在浏览器访问 [http://localhost](http://localhost) 页面，就能看到 nginx 的欢迎页面了

![Nginx欢迎页面](http://upload-images.jianshu.io/upload_images/7292919-9a6ab66a004bbe69.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

是不是很简单很畅快~

#### 重启和关闭

下文中我们将不断修改 nginx 的配置文件，修改配置文件后需要重启才会让更改后的配置生效，仍然要在命令行窗口 nginx-1.13.8 文件夹中执行下面的命令

```
nginx -s reload
```

如果配置文件中存在错误，执行重启命令会失败，并返回错误信息和位置，根据信息仔细检查配置文件，修改后重新执行重启命令即可

如下图是删除了 nginx-1.13.8\conf\nginx.conf 文件中的一个分号导致出错

![](http://upload-images.jianshu.io/upload_images/7292919-da0094634b057e5e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

想要手动关闭 nginx ，执行如下命令，或者暴力一点直接 kill 掉 nginx.exe 进程

```
nginx -s stop
```

#### 基础配置项

nginx 中最常修改的配置文件是 nginx-1.13.8\conf\nginx.conf 文件，下文无特殊说明时，各个配置项的修改都是在这个文件中进行的（说实话，我从未改过其他文件，也没研究过那些文件是做什么的~）

一个基础 nginx 配置是如下结构

```
worker_processes  1;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
    }
}
```

这一段配置是直接可用的，访问 http://localhost 时，nginx 将在 nginx-1.13.8\html 文件夹（ location 中的 root 指定的）中查找资源，默认请求 index.html 文件（ location 中的 index 指定的），这就是上面我们看到的那个欢迎页面

一个配置文件中有且仅能有一个 http 配置块，http 配置块中可以有多个 server 配置块，server 配置块中 listen 定义了监听端口，改成其他非80端口后重启即可生效。 server_name 定义了域名

不同的 server 配置块中 listen 项和 server_name 项可以相同也可以不同， server_name 还可以设置为正则表达式，这使得我们可以在一个 nginx 实例中监听多个端口，而且每个端口上还可以指定不同域名。有时我们可能需要在一台服务器的80端口上部署处于不同域名的多个网站，配置起来非常方便

强烈建议浏览一下下面的两篇文章，对 server_name 的配置方式有个整体认识，这套按序匹配和正则表达式的机制在 nginx 的多个配置项中都能使用

[nginx学习（十）——nginx的配置系统6之server_name](http://blog.csdn.net/xxcupid/article/details/52515237)
[关于Nginx的server_name](http://blog.51cto.com/onlyzq/535279)

#### 虚拟目录

一般情况下，我们可以把想要部署的资源复制到 `nginx-1.13.8\html` 文件夹中，例如放一个图片文件，其物理路径为 `nginx-1.13.8\html\assets\img\test.png` ，这时可以通过 `http://localhost/assets/img/test.png` 访问这个图片

我们的 ArcGIS API for JavaScript 就可以按这种方式部署到 html 文件夹中

但很多时候我们要部署的资源并不是都能很容易的复制到 nginx 的目录中，这时就要为这个资源配置虚拟目录。一个server配置块中可以有多个 location 配置块，每个 location 就相当于一个虚拟目录。

假设在 D 盘有一个资源目录，路径是这样的 `D:\assets\`，里面有个文件路径为 `D:\assets\img\test.png`，我们可以像下面这样配置来访问这个图片

```
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        location ^~/assets_path/ {
            alias   D:\\assets\\;
        }
    }
```

第二个 location 后的 `/assets_path/` 就是我们指定的虚拟目录，如果对80端口的访问 url 中包含 `/assets_path/` ，那么 nginx 就会去 `alias` 指定的物理路径中查找资源

所以此时，图片的访问地址应该是 `http://localhost/assets_path/img/test.png`

这里要注意的是 Windows 系统中，物理路径的 `\` 需要写成 `\\` 。这个物理路径也可以设置成相对于 nginx 目录的路径，例如与 nginx-1.13.8 文件夹同级有一个名为 assets 的文件夹，这个文件夹可以用 `..\\assets\\` 指定

location 后面的路径也可以写成正则表达式，而且多个 location 也是按顺序匹配，匹配成功就立刻停止。这与
 server 块中的 server_name 的写法及匹配机制是一样的

#### 反向代理

反向代理是 nginx 最实用的功能，我最初选择使用 nginx 就是为了用反向代理解决跨域问题。灵活使用反向代理功能能让一个庞大系统的各个部分更容易集成，各子系统的实现技术选择更灵活，在开发中也能带来很大的便利

看一下下面这段配置

```
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        location ^~/nginx_proxy/ {
            proxy_pass   http://nginx.org/;
        }
    }
```

这一段增加了一个 `/nginx_proxy/` 虚拟目录，浏览器访问 `http://localhost/nginx_proxy/index.html` 地址时，nginx 将用这一段的配置进行处理。proxy_pass 指定了 `http://nginx.org/` ，意思是所有被匹配到的请求都相当于在请求 `http://nginx.org/` 。这背后实际是 nginx 先去请求了 [http://nginx.org/index.html](http://nginx.org/index.html) ，然后将得到的结果返回给访问 [http://localhost/nginx_proxy/index.html](http://localhost/nginx_proxy/index.html) 的浏览器。这就是反向代理。

可以继续尝试一下访问 [http://localhost/nginx_proxy/en/download.html](http://localhost/nginx_proxy/en/download.html) ，实际上我们得到的页面是 [http://nginx.org/en/download.html](http://nginx.org/en/download.html)

有时候为了避免用于反向代理的虚拟目录名称与实际目录结构中的文件夹重名，会给所有反向代理一个统一的虚拟目录

例如下面这个配置

```
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        location ^~/proxy/nginx/ {
            rewrite ^/proxy/nginx/(.*)$ /$1 break;
            proxy_pass   http://nginx.org/;
        }
        location ^~/proxy/other/ {
            rewrite ^/proxy/other/(.*)$ /$1 break;
            proxy_pass   http://other.org/;
        }
    }
```

此时可以通过 [http://localhost/proxy/nginx/](http://localhost/proxy/nginx/) 来访问 nginx 的官网主页

rewrite 配置项实际是在改写浏览器请求的地址，并将改写后的地址拼接到 `proxy_pass` 指定的地址的后面。在这个配置中，就是把 `/proxy/other` 去掉。这里需要写一个正则表达式，如何写还是各位同学多多试验、自行体会吧

现在我参与的项目基本都会在顶层部署 nginx ，然后将网站和静态资源部署在 nginx 中，反向代理 Tomcat 中的 Java 后台、NodeJS 后台、ArcGIS 服务、第三方服务等等，各子系统及后台会通过配置反向代理和虚拟目录的方式与主系统处于同一域之下，以此解决用户权限集成的问题

### Issues

---

这一章节用于一些经验和资源的积累，针对工作中可能用到的 nginx 的一些配置、优化方法进行记录，并留存相关文章、资源的链接

本节将会持续、不定时更新

#### 为 Nginx 创建 Windows 服务

使用的是一个叫 WinSw 的工具，我也一直在使用。有人写过详细教程，我就不重写了

 [把 Nginx 创建为 Windows 的一个服务](http://blog.csdn.net/defonds/article/details/7906005)

#### Nginx + Https

现在流行全站 Https ，之前写过一篇介绍如何生成自签名 ssl 证书并在 nginx 中开启 Https ，虽然是为部署 ArcGIS JavaScript API 写的， 但也足够了。文章贴出来供大家参考

[Nginx + Https本地部署ArcGIS JavaScript API 4.4/4.5](https://www.jianshu.com/p/24488c6fbc30)

#### location配置中 root 和 alias 的区别

很好理解，请参考这篇文章  [Nginx的alias的用法及与root的区别](http://blog.csdn.net/kinginblue/article/details/50748683)

#### 多工作进程及针对 CPU 性能优化

nginx 默认启动后会开启两个进程，一个守护进程（主进程），一个工作进程。工作进程是负责处理请求的进程，可以通过配置项开启多个工作进程，充分利用 CPU 的多个核心，提高请求处理能力

默认 nginx.conf 配置最前面就是工作进程数的配置，改为如下可以将工作进程变成2个，这样启动后我们将看到3个 nginx.exe 进程

```
worker_processes  2;
```

工作进程也不能设置太多，过多反而会使效率降低，这个数字是和 CPU 核心数相关的，而且有相关配置项来优化工作进程和 CPU 核心的关系，详细请参考下面这篇文章

[针对CPU的nginx配置优化](http://www.cnblogs.com/yolo-Yu/articles/6442185.html)


### 这里是结尾

---

***放飞思路，灵活使用***

前段时间接了个小任务，也就是改改页面。但是目标系统要依赖一堆 ArcGIS 产品和公司产品才能跑起来，这要是在自己的开发环境中搭建起来，未免代价太大了。好在同事分享给我了一个 nginx 的配置文件，里面把系统的各种依赖服务和不需要修改的页面全部反向代理到公司服务器上去了，最后我自己的环境上只需要有要更改的文件

真是无比舒服~~

其实有时候并不是自己不会做，只是想不到而已~~

下一篇我们将使用 [HTML5 ★ BOILERPLATE](http://www.bootcss.com/p/html5boilerplate/) 前端模板做出第一个 Hello world 网站，并部署在 nginx 中，正式开启前端开发旅程

##### 本教程是一个系列教程，可以到目录章查看所有教程

- [目录](../../README.md)
- [上一篇 WebGIS开发教程(一) NodeJS安装](./1_NodeJS.md)
- [下一篇 敬请期待]()

#### 联系作者

---

- [简书主页](https://www.jianshu.com/u/a33591b39f71) 请优先关注我的简书账号，并在简书对应文章下留言，有APP通知推送所以能及时看到，简书也是我的文章首发平台
- [Github主页](https://github.com/Liuyl89/) 教程和相关代码在我的Github里都能够找到
- [ArcGIS知乎主页](http://zhihu.esrichina.com.cn/people/liuyl) 文章会被同步到ArcGIS知乎中，ArcGIS知乎是面向广大GISer的知识分享和问答平台，推荐大家经常去看看
- 微信公众号 搜索 幻想GIS 或扫描二维码，文章会通过公众号进行推送

    ![请扫码关注微信公众号 幻想GIS](http://upload-images.jianshu.io/upload_images/7292919-4932758f98ba8a3b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- QQMail liuyl89@qq.com
- GMail liuyl.gisuni@gmail.com 不太稳定，建议邮件后在简书里留言告诉我一下


