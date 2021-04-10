---

id: linux-deploy1

title: 项目部署环境
---

## python3的环境编译

```shell
编译安装python3的步骤

1.很重要 必须执行此操作 安装好编译环境，c语言也是编译后运行，需要gcc编译器golang，对代码先编译，再运行，python是直接运行
yum install gcc patch libffi-devel python-devel zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel 
2.获取python的源码，下载且安装
wget https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tgz
3.解压缩
tar -zxvf Python-3.7.3.tgz
4..解压缩完毕之后，生成了python369的源代码目录，进入源代码目录准备开始编译
cd Python-3.7.3
5.此时进行编译三部曲
5.1 指定python3的安装路径，以及对系统的开发环境监测，使用如下命令
# configure是一个脚本文件，用于告诉gcc编译器， python3即将安装到哪里，以及对基础的开发环境检查，检查openssl，检查sqllite，等等 结束后主要是生成makefile用于编译的
./configure --prefix=/opt/python373/
5.2 开始编译 直接输入make指令即可 + 5.3 编译安装 生成python3的可执行程序，也就是生成/opt/python373/
make  && make install
6.等待出现如下结果 表示安装结束
Successfully installed pip-19.0.3 setuptools-40.8.0
7.此时可以去检查python3的可执行程序目录
[root@localhost python373]# pwd
/opt/python373/bin
8.配置PATH环境变量，永久修改PATH，添加python3的目录 放入开头位置
vim /etc/profile
写入如下内容
PATH="/opt/python373/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:"
9.手动读取 加载所有的变量
source /etc/profile
10.检查python3的目录，以及pip3的绝对路径
[root@localhost ~]# which python3
/opt/python373/bin/python3
[root@localhost ~]# which pip3
/opt/python373/bin/pip3
```

## 创建django项目，linux运行diango

```shell
1.安装django模块
[root@localhost opt]# pip3 install -i https://pypi.douban.com/simple django==1.11.8
2.创建django项目
[root@localhost opt]# django-admin startproject test1
3.创建一个app
django-admin startapp app01
4.修改settings.py, 注册app01,修改如下
# 默认只允许 本地 127.0.0.1 访问
# 启动在了linux的机器上，如果不修改windows无法访问
# 写一个 * 表示允许所有的主机访问
ALLOWED_HOSTS = ["*"]
5.运行django
[root@localhost test1]# python3 manage.py runserver 0.0.0.0:8080

```

## 虚拟环境

```shell
1.下载虚拟环境工具
pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple virtualenv
2.创建虚拟环境
[root@localhost opt]# virtualenv --python=python venv1
3.激活虚拟环境
[root@localhost opt]# cd venv1/bin/
[root@localhost bin]# source /opt/venv1/bin/activate
4.退出虚拟环境
(venv1) [root@localhost bin]# deactivate
```



## 保证开发环境生产环境python模块一致性

```shell
1.导出模块信息
pip3 freeze > requirements.txt

2.安装模块信息
(venv1) [root@localhost tmp]# pip3 install -i https://pypi.douban.com/simple -r requirements.txt 
```

## linux启动项目

```shell
1.准备好代码上传到linux服务器中
lrzsz
xftp
举例：scp
	1.1在cmd下，输入  ps：要压缩文件 eg：saas.zip
	PS C:\Users\62490\Desktop> scp .\saas.zip root@192.168.195.128:/opt/
	1.2.在linux中zip格式压缩文件用unzip命令解压
	[root@localhost opt]# unzip saas.zip 
2.新建一个虚拟环境，激活 用于运行
[root@localhost sass]# virtualenv --python=python venv_saas
[root@localhost sass]# source /opt/sass/venv_saas/bin/activate
3.安装所需要的模块依赖
(venv_saas) [root@localhost sass]# pip3 install -i https://pypi.douban.com/simple -r requirements.txt 
4.安装mariadb(mysql) 且启动
(venv_saas) [root@localhost sass]# yum install mariadb-server mariadb -y
(venv_saas) [root@localhost sass]# systemctl start mariadb
5.由于数据库是空的，还得进行数据库表的导入，导出本地数据库表
#参数--all-databases能够导出所有的数据库，表(！可能会乱码！！！可以用Navicat导出然后发过来！！！)
PS C:\Users\62490\Desktop\saas> mysqldump -uroot -p --all-databases > alldb.sql
6.发送此alldb.sql文件，给linux，然后创建一个同名的数据库，再进行数据导入
# 1.进入数据库
(sass_venv) [root@localhost opt]# mysql -uroot -p
# 2.创建后退出
MariaDB [(none)]> create database saas;
MariaDB [(none)]> exit;
# 3.导入数据
mysql -uroot -p saas < /opt/alldb.sql

```

## uwsgi启动python web

```shell
1.安装uwsgi工具
pip3 install -i https://pypi.douban.com/simple uwsgi
2.编写uwsgi.ini # 手动创建此uwsgi的配置文件
touch uwsgi.ini
# 写入如下的内容参数去启动项目
[uwsgi]
#Django-related settings
# the base directory ( full path)
#填写项目的第一层绝对路径
chdir = /opt/sass
# Django 's wsgi file
#填写项目第二层的相对路径，找到第二层目录下的wsgi.py
module = sass.wsgi
#the virtualenv ( full path )
#填写虚拟环境解释器的第一层工作目录
home = /opt/sass/venv_saas
#process-related settings#master
master = true
# maximum number of worker processes
# 代表定义uwsgi运行的多进程数量，官网给出的优化建议是 2*cpu+1
processes = 9
# the socket (use the full path to be safe
# socket = 0.0.0.0:8000
# 这里的socket参数，是用于和nginx结合部署的unix-socket参数，先暂停使用
# 线上不会用http参数，因为对后端是不安全的，使用socket参数是安全的连接，用nginx反向代理去访问# 后端程序是运行在防火墙内部，外网是无法直接访问的
# 临时使用http参数,便于我们用浏览器调试访问
http = 0.0.0.0:8000

# ... with appropriate permissions - may be needed# chmod-socket=664
# clear environment on exit
vacuum = true

```

## supervisor

supervisor 是基于 python 的任务管理工具，用来自动运行各种后台任务，当然你也能直接利用 nohup 命令使任务自动后台运行，但如果要重启任务，每次都自己手动 kill 掉任务进程，这样很繁琐，而且一旦程序错误导致进程退出的话，系统也无法自动重载任务。这里用supervisor对uwgsi进行一个管理

日志路径为/var/log/supervisor

```shell
1.安装
yum install supervisor -y
2.生成supervisor的配置文件
echo_supervisord_conf > /etc/supervisord.conf

3.uwsgi和uwsgi.ini都配置完毕之后，开始使用supervisor工具进行管理了
	3.1 找到uwsgi的绝对路径  which uwsgi
	/opt/sass/venv_saas/bin/uwsgi
	3.2 找到uwsgi.ini的绝对路径
	/opt/sass/uwsgi.ini
	3.3 因此 启动项目的完整绝对路径命令是
	/opt/sass/venv_saas/bin/uwsgi  --ini  /opt/sass/uwsgi.ini
4.修改supervisor的配置文件
(venv_saas) [root@localhost sass]# pwd
/opt/sass
(venv_saas) [root@localhost sass]# vim /etc/supervisord.conf 
# 将3.3的 项目的完整绝对路径命令 写入command中，如下
[program:sass]
command=/opt/sass_venv/bin/uwsgi  --ini  /opt/sass/uwsgi.ini   ; # supervisor其实就是在帮你执行命令而已!
autostart=true    ; # 在supervisord启动的时候也自动启动
startsecs=10      ; # 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true  ; # 程序退出后自动重启,可选值:[unexpected,true, false],默认为unexpected,表示进程意外杀死后才重启
stopasgroup=true  ; # 默认为false,进程被杀死时，是否向这个进程组发送stop信号,包括子进程
killasgroup=true  ; # 默认为false,向进程组发送kill信号,包括子进程
5.启动supervisor，默认就会直接启动uswgi了
supervisord -c /etc/supervisord.conf   # 启动supervisor服务端，指定配置文件启动
# 检查进程信息
(venv_saas) [root@localhost sass]# ps -ef|grep supervisor
root       3301      1  0 15:18 ?        00:00:00 /usr/bin/python /usr/bin/supervisord -c /etc/supervisord.conf
root       3320   2556  0 15:19 pts/0    00:00:00 grep --color=auto supervisor
6.进入supervisor任务管理终端
supervisorctl -c /etc/supervisord.conf 
# 一些指令
supervisor> status   # 启动
supervisor> restart 进程名 # 重启
```

## nginx结合uwsgi项目部署

### 1.纯后端部署   supervisor + nginx + uwsgi + django + virtualenv(虚拟环境) + mariadb(mysql)

```shell
1.创建虚拟环境，用于运行项目（虚拟环境创建参考上面的`虚拟环境`）

	(sass_venv) [root@localhost sass]# source /opt/sass_venv/bin/activate

2.上传代码到linux中，调试项目是否能够运行（`模块依赖`、`mariadb数据库的安装，以及数据导入`）
	# 启动数据库
	(sass_venv) [root@localhost sass]# systemctl start mariadb

    (sass_venv) [root@localhost sass]# python3 manage.py runserver
    Performing system checks...

    System check identified no issues (0 silenced).
    January 12, 2021 - 06:47:50
    Django version 1.11.8, using settings 'sass.settings'
    Starting development server at http://127.0.0.1:8000/
    Quit the server with CONTROL-C.

3.在线上，是使用uwsgi结合uwsgi.ini配置文件启动项目的，因此启动方式参考上面的 `uwsgi启动python web`

    '注意配置文件里面的http=0.0.0.0:8000 线上是不会用http的 所以注释掉 改用上面的socket'
    # 使用此协议运行后台，就无法通过浏览器访问了，协议不一样
    socket = 0.0.0.0:8000
    # 线上不会用http参数，因为对后端是不安全的，使用socket参数是安全的连接，用nginx反向代理去访问# 后端程序是运行在防火墙内部，外网是无法直接访问的
    # http = 0.0.0.0:8000

4.使用supervisor启动uwsgi进程，需要修改supervisord.conf配置文件,参考上面的 `supervisor`

    (sass_venv) [root@localhost sass]# vim /etc/supervisord.conf
    [program:sass]
    command=/opt/sass_venv/bin/uwsgi  --ini  /opt/sass/uwsgi.ini   ;
    autostart=true    ;
    startsecs=10      ;
    autorestart=true  ;
    stopasgroup=true  ;
    killasgroup=true  ;
    # 配置好后启动
    (sass_venv) [root@localhost sass]# supervisord -c /etc/supervisord.conf

5.检查后台的状态：

    (sass_venv) [root@localhost sass]# supervisorctl -c /etc/supervisord.conf
    sass                             RUNNING   pid 4660, uptime 0:02:11

6.此时配置好nginx.conf，请求转发给后台即可，修改如下：
    (sass_venv) [root@localhost sass]# vim /opt/tngx232/conf/nginx.conf 
        server {
            listen       80;
            server_name  localhost;
            charset utf-8;
            location / {
                # 通过uwsgi_pass把请求转发给后端的uwsgi服务器
                uwsgi_pass 0.0.0.0:8000;
                # 这个参数是固定的，是添加一些转发请求头内容
                include uwsgi_params;
                    }
            }
    # 配置完后,重启nginx
    (sass_venv) [root@localhost sass]# nginx -s reload
7.此时已经部署成功了，但是静态文件无法加载，还要配置nginx接收所有的django静态文件，修改如下：
	7.1修改django的配置文件，收集所有的静态文件放入一个统一管理的目录
	(sass_venv) [root@localhost sass]# vim sass/settings.py 
	STATIC_ROOT='/saas_static/'  
	7.2用命令收集静态文件
	(sass_venv) [root@localhost sass]# python3 manage.py collectstatic
8.通过nginx去找到静态文件即可,在nginx.conf里的http的server添加如下配置：
	# 当请求的url是localhost/static/js   localhost/static/css  等等等以static开头的url，都告诉nginx去saas_static目录下寻找
	location /static {
	alias  /saas_static;
	}
	# 保存退出，重启nginx
	(sass_venv) [root@localhost sass]# nginx -s reload
	
```

![image-20210111223629632](https://gitee.com/JqM1n/biog-image/raw/master/20210111223629.png)

![image-20210111224324790](https://gitee.com/JqM1n/biog-image/raw/master/20210111224324.png)

### 2.前后端分离部署 vue+nginx+uwsgi+django+mariadb(mysql)+redis

```shell
 注意在线上部署的架构流程图中，django后台，是躲在防火墙之后的，只能通过nginx反向代理去访问....
```

##  ![image-20210113151044860](https://gitee.com/JqM1n/biog-image/raw/master/20210113151052.png)

