---

id: linux-introduce1

title: 初识
---

在服务器领域，IBM、HP、Novell、Oracle等厂商都全方位支持Linux，Linux已经成为了这个世界上增长最迅速的操作系统。2011年排名前500的超级计算机中，92.4%都是Linux操作系统。

在桌面领域，Ubantu、openSUSE等发行版本持续增长。2008年9月，基于Linux内核的手机操作系统Android发布，历经4年多的发展，截止2012年12月，Android已经成为最主流的手机操作系统，也同时Android也成为最广泛的平板电脑操作系统。

Linux就是个操作系统：它和Windows XP、Windows7、8、10什么的一样就是一个操作系统而已！

Linux能干什么：能当服务器，在服务器上安装者各种企业应用、服务。 比如：Web服务（Nginx，Apache，例如淘宝网站就是二次开发的Tengine服务器）、数据库（MySQL，存储网站信息数据的）等等……

Linux系统用在哪些领域：例如淘宝、京东的服务器就是Linux系统，再比如美团、滴滴、快手、xx直播，总之他们都是Linux服务器。Linux同时也在桌面领域（windows桌面）、嵌入式领域（阿里云的YunOS，安卓操作系统）、大数据\云计算的领域迅速发展

## 切换root用户

进入到linux界面后，可以输入`ifconfig`命令查看网络ip地址

如果不能用，输入

```python
yum installnet-tools -y # 安装软件包net-tools
```

登录系统后，需要切换root超级用户，否则权限很低

```bash
[root@localhost ~]# su- root 
# 需要输入root密码
```

## 远程链接 linux

对于服务器而言，我们不会直接去触碰机器，而是通过网络连接

确保你的服务器，正确的获取到了ip地址

安装远程连接工具`xshell` 或者`secureCRT`, macos的直接使用ssh命令即可

```shell
ssh root@ip地址
```

## 修改linux的全局配置文件

编辑这个文件，写入你想永久生效的变量和值，系统每次开机都会读取这个文件，让其生效

```shell
vim  /etc/profile
```

这是自定义的变量,设置系统中文

```shell
export LC_ALL=zh_CN.UTF-8
# 设置系统英文
export LC_ALL=en_Us.UTF-8
```

## linux之文档与目录结构

```python
"""
├── /			    根目录
    ├── opt			是大型软件存放目录，例如/opt/nginx /opt/redis /opt/python3 /opt/mongodb
    ├── root		是超级用户的家目录
    ├── home		是普通用户的统—管理家目录
    ├── etc			是配置文件存放的目录
    └── var			是存放经常变化文件的目录例如日志。
"""
```