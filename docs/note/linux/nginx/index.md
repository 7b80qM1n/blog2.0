---

id: linux-nginx1

title: Nginx

---

我们平时访问的网站服务 就是 Web 网络服务，一般是指允许用户通过浏览器访问到互联网中各种资源的服务。

Web 网络服务是一种被动访问的服务程序，即只有接收到互联网中其他主机发出的 请求后才会响应，最终用于提供服务程序的 Web 服务器会通过 HTTP(超文本传输协议)或 HTTPS(安全超文本传输协议)把请求的内容传送给用户。

目前能够提供 Web 网络服务的程序有 IIS、Nginx 和 Apache 等。其中，IIS(Internet Information Services，互联网信息服务)是 Windows 系统中默认的 Web 服务程序

2004 年 10 月 4 日，为俄罗斯知名门户站点而开发的 Web 服务程序 Nginx 横空出世。 Nginx 程序作为一款轻量级的网站服务软件，因其稳定性和丰富的功能而快速占领服务器市 场，但 Nginx 最被认可的还当是系统资源消耗低且并发能力强，因此得到了国内诸如新浪、 网易、腾讯等门户站的青睐。

## 强大之处

- 支持高并发，能支持几万并发连接
- 资源消耗少，在3万并发连接下开启10个nginx线程消耗的内存不到200M
- 可以做http反向代理和负载均衡
- 支持异步网络i/o事件模型epoll

## Tengine

Tengine是由淘宝网发起的Web服务器项目。它在Nginx的基础上，针对大访问量网站的需求，添加了很多高级功能和特性。Tengine的性能和稳定性已经在大型的网站如淘宝网，天猫商城等得到了很好的检验。它的最终目标是打造一个高效、稳定、安全、易用的Web平台。

`Nginx/Tenginx  `

官方nginx/淘宝nginx 

这两个一模一样，淘宝的nginx官方文档更加详细

注意编译软件之前还是要解决系统的开发环境，例如如下：

```shell
yum install gcc patch libffi-devel python-devel  zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel openssl openssl-devel -y
```

## 安装启动

1. 进入淘宝nginx官网，下载源代码，进行编译安装

   ```shell
   wget http://tengine.taobao.org/download/tengine-2.3.2.tar.gz 
   ```

2. 解压缩

   ```shell
   tar -zxvf tengine-2.3.2.tar.gz
   ```

3. 进入源码目录，指定安装目录

   ```shell
   [root@localhost tengine-2.3.2]# ./configure  --prefix=/opt/tngx232
   ```

4. 编译、编译安装，生成nginx的可执行命令目录

   ```shell
   make && make install
   ```

5. 安装完成后，会生成/opt/tngx232/文件夹，nginx可以使用的配置都在这里了

   ```shell
   [root@localhost tngx232]# ls
   conf   html  logs  sbin
   conf   存放*.conf配置文件的
   html   存放网页的静态文件的目录
   logs   日志
   sbin   存放nginx的可执行命令
   ```

6. 添加nginx到PATH中，可以快捷执行命令

   ```shell
   vim /etc/profile
   # 写入
   PATH="/opt/tngx232/sbin:/opt/python373/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin::/root/bin"
   ```

7. 首次启动nginx，注意要关闭防火墙

   ```shell
   直接输入nginx命令即可启动
   nginx    # 首次输入是直接启动，不得再次输入
   nginx -s reload  # 平滑重启，重新读取nginx的配置文件，而不重启进程
   nginx -s stop    # 停止nginx进程
   nginx -t         # 检测nginx配置文件语法是否正确
   ```

   默认访问nginx的首页的站点url是

   ```shell
   http://主机ip地址:80/index.html
   ```

## nginx的配置文件注释

```shell
#定义nginx的工作进程数，以cpu核数为准
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;
#error_log  "pipe:rollback logs/error_log interval=1d baknum=7 maxsize=2G";
#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

# nginx的核心功能区域
http {
    include       mime.types;
    default_type  application/octet-stream;
	# 打开次nginx的访问日志功能，即可查看日志
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;
	# nginx开启静态资源压缩，打开此功能能够极大的提升网站访问，以及静态资源压缩
    gzip  on;
	
	# 提供静态资源缓存功能
	# 第一次访问过网页之后，nginx能够让图片js等静态资源，缓存到浏览器上，浏览器下次访问网站，速度就几乎是秒开了
	# nginx支持便携多个server｛｝区域块，以达到多虚拟主机，多个站点的功能
    server {
    	# 定义该网站的端口 
        listen       80;
        # 填写域名，没有就默认即可
        server_name  localhost;
		# 更改nginx的编码支持
        charset utf-8;

        location / {
        	# 这个root参数，是定义该虚拟主机，资料存放路径的，可以自由修改
            root   html;
            # index参数，用来定义nginx首页文件的名字，只要是在这个目录下的index.html文件即可
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```



## nginx的web站点功能

修改nginx的首页内容

进入html目录下，找到index.html文件，默认读取的是这个文件

```shell
[root@localhost html]# pwd
/opt/tngx232/html
[root@localhost html]# vim index.html 
```

## nginx的多站点功能

在配置文件`nginx.conf`下的http下的server{}下再添加一个server{}

```shell
server{
listen 89;
serber_name _;
# nginx的域名匹配
# 当用户访问 主机ip：89的时候，返回该目录的内容
location / {
		root     /目录内容;
		index    index.html;
}
}
```

## nginx的404页面优化

在server下添加这个配置，当用户请求出错，出现404的时候，就返回 root定义的目录去寻找404.html文件

```shell
server{
	error_page 404 /404.html;
}
```

## nginx的访问日志

日志功能对每个用户访问网站的日志信息都记录到指定的日志文件里，开发运维人员可以分析用户的浏览器行为

此功能由ngx_http_log_module模块负责

修改`nginx.conf`  在http{}代码块中，打开注释，即可查看日志

```shell
# 打开此nginx的访问日志功能，
log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';

access_log  logs/access.log  main;
```

| 日志功能参数          |                             描述                             |
| :-------------------- | :----------------------------------------------------------: |
| $request              |        对应请求信息、url "GET /favicon.ico HTTP/1.1"         |
| $time_local           |          发送时间 对应[14/Aug/2018:18:46:52 +0800]           |
| $status               |                            状态码                            |
| $http_referer         |                 url跳转、是否是其他url过来的                 |
| $remote_user          |                    远程用户，没有就是 "-"                    |
| $remote_addr          |                         记录客户端ip                         |
| $http_user_agent      | 客户端身份信息 nginx可判断, 如若是手机浏览器就转发移动端页面给用户查看 ...等等 |
| $body_bytes_sent      |                         请求体的大小                         |
| $http_x_forwarded_for |                    记录客户端的来源真实ip                    |



## nginx正向代理

```shell
正向代理，也就是传说中的代理,他的工作原理就像一个跳板（VPN），简单的说：
我是一个用户，我访问不了某网站，但是我能访问一个代理服务器，这个代理服务器呢，他能访问那个我不能访问的网站，于是我先连上代理服务器，告诉他我需要那个无法访问网站的内容，代理服务器去取回来，然后返回给我。
正向代理 代理服务器 代理的是客户端
反向代理 代理服务器 代理的是服务端
```

![1132884-20181207105156894-13556838981](https://gitee.com/JqM1n/biog-image/raw/master/20210411060756.png)

## 反向代理

这里用nginx的多站点功能模拟出两台服务器 

第一个虚拟主机的配置，作用是反向代理

修改`nginx.conf`如下

```shell
server {
    listen    85;
    server_name   localhost;
    charset utf-8;
    error_page   404  /40x.html;
    # 这里的locaiton路径匹配，如果你写的是root参数，就是一个web站点功能
    # 如果你写的是proxy_pass参数，就是一个请求转发，反向代理功能
    location / {
    # 当请求发送给192.168.178.140:80的时候 直接通过如下的参数，转发给90端口
    proxy_pass  http://192.168.111.128:90;
)
```

第二个虚拟主机，作用是web站点功能，资源服务器，提供页面的

修改`nginx.conf`如下

```shell
server {
    listen    90;
    server_name   localhost;
    charset utf-8;
    error_page   404  /40x.html;
    # 当请求来到192.168.111.128:90的时候，就返回/sass/目录下的index.html
    location / {
    root  /sass/;
    index index.html;
)
}
```



![image-20210111194621608](https://gitee.com/JqM1n/biog-image/raw/master/20210111194811.png)

## nginx负载均衡

Web服务器，直接面向用户，往往要承载大量并发请求，单台服务器难以负荷

我使用多台WEB服务器组成集群，前端使用Nginx负载均衡，将请求分散的打到我们的后端服务器集群中，实现负载的分发

那么会大大提升系统的吞吐率、请求性能、高容灾

![image-20210411062151400](https://gitee.com/JqM1n/biog-image/raw/master/20210411062151.png)

这里也是用nginx多站点模拟

用`upstream`关键词定义负载均衡池，写入资源服务器的地址

第一个虚拟主机的配置,作用是反向代理

```shell
upstream  sass_server {
server 192.168.111.128:90;
server 192.168.111.128:95;
}
server {
    listen    85;
    server_name   localhost;
    charset utf-8;
    error_page   404  /40x.html;
    # 这里的locaiton路径匹配，如果你写的是root参数，就是一个web站点功能
    # 如果你写的是proxy_pass参数，就是一个请求转发，反向代理功能
    location / {
    # 当请求发送给192.168.178.140:80的时候 直接通过如下的参数，转发给90端口
    proxy_pass  http://sass_server;
)
```

第二台虚拟主机，作用是web站点功能，资源服务器，提供页面的

```shell
server {
    listen    90;
    server_name   localhost;
    charset utf-8;
    error_page   404  /40x.html;
    # 当请求来到192.168.111.128:90的时候，就返回/sass/目录下的index.html
    location / {
        root  /sass/;
        index index.html;
)
}
```

第三个server{}标签的作用，同样是返回资源页面，查看负载均衡效果，95端口

```shell
server {
    listen    95;
    server_name   localhost;
    charset utf-8;
    error_page   404  /40x.html;
    # 当请求来到192.168.111.128:90的时候，就返回/sass/目录下的index.html
    location / {
        root  /sass/;
        index index.html;
)
}
```



## nginx的负载均衡算法

```shell
1.默认是轮询机制，一台服务器处理一次，
2.加权轮询，在server内部后面添加weight即可分配权重
upstream  sass_server {
    server 192.168.111.128:90 weight=4;
    server 192.168.111.128:95 weight=1;
}
```
