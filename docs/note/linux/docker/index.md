---

id: linux-docker1

title: Docker
---

## 简介

docker是linux容器的一种封装，提供简单易用的容器使用接口。它是最流行的Linux容器解决方案。

docker的接口相当简单，用户可以方便的创建、销毁容器。

docker将应用程序与程序的依赖，打包在一个文件里面。运行这个文件就会生成一个虚拟容器。

程序运行在虚拟容器里，如同在真实物理机上运行一样，有了docker，就不用担心环境问题了。

### 镜像(image) :

- docker镜像就好比是一个模板,可以通过这个模板来创建容器服务,tomcat镜像===>run ==>tomcat01容器(提供服务器）,通过这个镜像可以创建多个容器（最终服务运行或者项目运行就是在容器中的)

### 容器(container) :

- Docker利用容器技术,独立运行一个或者一个组应用，通过镜像来创建的.启动，停止,删除,基本命令!目前就可以把这个容器理解为就是一个简易的linux系统

### 仓库(repository) : 

- 仓库就是存放镜像的地方!

- 仓库分为公有仓库和私有仓库!

- Docker Hub(默认是国外的)，阿里云....都有容器服务器（配置镜像加速!)

## 使用

1. 卸载旧的版本

   ```shell
   yum remove docker \
                     docker-client \
                     docker-client-latest \
                     docker-common \
                     docker-latest \
                     docker-latest-logrotate \
                     docker-logrotate \
                     docker-engine
   ```

2. 需要的安装包

   ```shell
   yum install -y yum-utils
   ```

3. 设置镜像的仓库

   ```shell
   yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   # 更新yum软件包索引
   yum makecache fast
   ```

4. 安装docker  ce社区版  ee企业版

   ```shell
   yum install docker-ce docker-ce-cli containerd.io
   ```

5. 启动docker

   ```shell
   systemctl start docker
   ```

6. 使用`docker version` 检测是否成功

![image-20210118203714763](https://gitee.com/JqM1n/biog-image/raw/master/20210118203722.png)

7. hello-word

```shell
docker run hello-world
```

![image-20210118204244812](https://gitee.com/JqM1n/biog-image/raw/master/20210118204244.png)

8. 查看一下下载的镜像

```shell
docker images
```

了解：卸载docker 

```shell
# 1.卸载依赖
yum remove docker-ce docker-ce-cli containerd.io
# 2.删除资源
rm -rf /var/lib/docker
```

## 阿里云镜像加速

### 1.登陆阿里云,找到阿里云容器镜像服务-镜像中心-镜像加速器,配置使用

```shell
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://j91r3vo1.mirror.aliyuncs.com"]
}
EOF

sudo systemctl daemon-reload

sudo systemctl restart docker
```

### 回顾下hello-world的流程

![image-20210118214619197](https://gitee.com/JqM1n/biog-image/raw/master/20210118214619.png)

## 底层原理

### Docker是怎么工作的?

Docker是一个Client-Server结构的系统,Docker的守护进程运行在主机上.通过Socker从客户端访问!

DockerServer接收到Docker-Client的指令,就会执行这个命令!

 ![image-20210118220921899](https://gitee.com/JqM1n/biog-image/raw/master/20210118220922.png)

### Docker为什么比Vm快

1. Docker有着比虚拟机更少的抽象层
2. Docker利用的是宿主机的内核,vm需要是Guest OS

所以说，新建一个容器的时候，docker不需要像虚拟机一样重新加载一个操作系统内核,避免引导.虚拟机是加载Guest OS，分钟级别的
而docker是利用宿主机的操作系统，省略了这个复杂的过程，秒级

![image-20210118220647886](https://gitee.com/JqM1n/biog-image/raw/master/20210118220647.png)

## docker的常用命令

### 帮助命令

```shell
docker	version 	 # 显示docker的版本信息 
docker	info		 # 显示docker的系统信息,包括镜像和容器的数量
docker 命令 --help 	# 帮助命令
```

帮助文档的地址: https://docs.docker.com/engine/reference/run/

## 镜像命令

```shell
[root@localhost ~]# docker images
# REPOSITORY:镜像的仓库源  TAG:镜像的标签   IMAGE ID:镜像的id  CREATED:镜像的创建时间  SIZE:镜像的大小
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
hello-world   latest    bf756fb1ae65   12 months ago   13.3kB
# 可选项
  -a, --all             # 列出所有镜像
  -q, --quiet           # 只显示镜像id
```

### docker 搜索镜像

```shell
docker search 镜像名
```

### docker pull  下载镜像

```shell
# 下载镜像 docker pull 镜像名[:tag]
[root@localhost /]# docker pull mysql
Using default tag: latest		# 如果不写 tag 默认就是latest
latest: Pulling from library/mysql
a076a628af6f: Pull complete 	# 分层下载,docker image的核心,联合文件系统
f6c208f3f991: Pull complete 
88a9455a9165: Pull complete 
406c9b8427c6: Pull complete 
7c88599c0b25: Pull complete 
25b5c6debdaf: Pull complete 
43a5816f1617: Pull complete 
69dd1fbf9190: Pull complete 
5346a60dcee8: Pull complete 
ef28da371fc9: Pull complete 
fd04d935b852: Pull complete 
050c49742ea2: Pull complete 
Digest: sha256:0fd2898dc1c946b34dceaccc3b80d38b1049285c1dab70df7480de62265d6213
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest  	# 真实地址
```

### docker rmi  删除镜像

```shell
[root@localhost /]# docker rmi -f 镜像id  # 删除指定的镜像
[root@localhost /]# docker rmi -f 镜像id 镜像id 镜像id  # 删除多个镜像id
[root@localhost /]# docker rmi -f $(docker images -aq)  # 删除全部镜像(有容器运行的话要先结束)
```

## 容器命令

### 用centos镜像来测试学习

```shell
docker pull centos
```

### 新建容器并启动

```shell
docker run [可选参数] images
--name="Name"	容器名字
-d			   后台方式运行
-it			   使用交互方式运行,进入容器查看内容
-P			   指定容器的端口 
-p			   随机指定端口
# 启动并进入容器
[root@localhost ~]# docker run -it centos /bin/bash
# 退出(容器停止并退出)  Ctrl + P + Q(容器不停止退出)
[root@af96f15d20e0 /]# exit
# 列出所有运行的容器
docker ps 命令  # 列出当前正在运行的命令  
-a   		   # 列出当前正在运行的容器+历史运行过的容器
-n=?		   # 显示最近创建的容器
-q			   # 只显示容器的编号
```

### 删除容器

```shell
docker rm 容器id					# 删除指定的容器,不能删除正在运行的容器,如果要强制删除 rm -f
docker rm -f $(docker ps -aq)	   # 删除所有的容器
```

### 启动和停止容器的操作

```shell
docker start    容器id   	# 启动容器
docker restart  容器id	# 重启容器
docker stop  	容器id	# 停止当前正在运行的容器
docker kill 	容器id	# 强制停止当前容器
```

## 常用其他命令

```shell
# 命令 docker run -d 镜像名!   后台运行
[root@localhost ~]# docker run -d centos
WARNING: IPv4 forwarding is disabled. Networking will not work.
9b9ec9b0d624a2eb1884e72346542a4b9099078ac5be8694829b8329bebc8c52
[root@localhost ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
# 常见的坑,docker 容器使用后台运行,就必须要有一个前台进程,docker发现没有应用,就会自动停止
```

### 查看日志

```shell
docker logs -tf --tail 容器, 没有日志
# 自己编写一段shell脚本
[root@localhost ~]# docker run -d centos /bin/sh -c "while true;do echo xxx;sleep 1;done
# 显示日志
[root@localhost ~]# docker logs -tf --tail 10 容器id
-tf 	# 显示日志
--tail number  # 要显示的日志条数
```

### 查看容器中进程信息

```shell
# 命令 docker top 容器id
[root@localhost ~]# docker top 87ae568c1dda
UID                 PID                 PPID                C                   STIME               TTY                
root                13493               13472               0                   12:45               ?                   
root                13871               13493               0                   12:49               ?                   
```

### 查看镜像的元数据

```shell
[root@localhost ~]# docker inspect 容器id
```

### 进入当前正在运行的容器

```shell
# 我们通常容器都是使用后台方式运行的,需要进入容器,修改一些配置
# 命令
docker exec -it 容器id /bin/bash
docker attach # 进入正在执行的终端,不会启动新的进程
```

### 从容器内拷贝文件到主机上

```shell
docker cp 容器id:容器内路径  目的主机路径
# 进入docker 内部
[root@localhost ~]# docker attach 9671095ee60f
[root@9671095ee60f /]# ls
bin  etc   lib	  lost+found  mnt  proc  run   srv  tmp  var
dev  home  lib64  media       opt  root  sbin  sys  usr
[root@9671095ee60f /]# cd /home
# 在容器内新建一个文件
[root@9671095ee60f home]# touch test.py
[root@9671095ee60f home]# exit       (容器运不运行无所谓 数据都在的)
# 将这个文件拷贝到我们的主机上
[root@localhost ~]# docker cp 9671095ee60f:/home/test.py  /home
[root@localhost ~]# cd /home
[root@localhost home]# ls
jqm  test.py

# 这里的拷贝是一个手动过程,未来我们使用 -v 卷的技术 可以事先 自动同步 
```

### 练习

```shell
Docker 安装Nginx
1.下载 运行
docker pull nginx
docker images
docker run -d --name nginx01 -p 3344:80 nginx
[root@localhost opt]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                  NAMES
869f45b6cb8c   nginx     "/docker-entrypoint.…"   18 seconds ago   Up 17 seconds   0.0.0.0:3344->80/tcp   nginx01
# 0.0.0.0:3344->80/tcp   访问宿主机的3344端口就是访问docker容器内的80端口,他们是映射关系
curl localhost:3344
# 进入容器
[root@localhost home]# docker exec -it nginx01 /bin/bash
root@80a586f08e54:/# whereis nginx
nginx: /usr/sbin/nginx /usr/lib/nginx /etc/nginx /usr/share/nginx
root@80a586f08e54:/# cd /etc/nginx
root@80a586f08e54:/etc/nginx# ls
conf.d		koi-utf  mime.types  nginx.conf   uwsgi_params
fastcgi_params	koi-win  modules     scgi_params  win-utf
root@80a586f08e54:/etc/nginx# 

```

![image-20210120042313697](https://gitee.com/JqM1n/biog-image/raw/master/20210120042313.png)

## 如何提交一个自己的镜像

```shell
Docker镜像都是制度的,当容器启动时,一个新的可写层被加载到镜像的顶部!
这一程就是我们通常说的容器层,容器之下都叫镜像层!
```

![image-20210120012044849](https://gitee.com/JqM1n/biog-image/raw/master/20210120012052.png)

## Commit镜像

```shell
# 进入容器空间内,安装一个vim或是python3等步骤
docker run -it centos /bin/bash
yum install vim -y
ecit # 退出
# 查看容器id
[root@localhost opt]# docker ps -a
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS                     PORTS     NAMES
ab7df0d07a57   centos    "/bin/bash"   31 seconds ago   Exited (0) 2 seconds ago             mystifying_tu
# 提交该容器,生成新的镜像文件   docker commit 容器id 镜像名
docker commit ab7df0d07a57 add-vim
# 导出你的docker镜像,可以发送给其他人使用了
docker save 镜像id  >  镜像的压缩文件
docker save e8d6a44424f4 > /opt/add-vim.tar
# 导入镜像文件
docker load < /opt/add-vim.tar
# 首次导入的镜像是没有标签名字的,手动添加即可
docker tag 镜像id 标签名
```

 

