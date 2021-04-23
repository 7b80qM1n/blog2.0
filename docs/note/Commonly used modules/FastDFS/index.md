---

id: element-FastDFS

title: FastDFS分布式文件系统
---

## 什么是FastDFS

FastDFS 是用 c 语言编写的一款开源的分布式文件系统。FastDFS 为互联网量身定制， 充分考虑了冗余备份、负载均衡、线性扩容等机制，并注重高可用、高性能等指标，使用 FastDFS 很容易搭建一套高性能的文件服务器集群提供文件上传、下载等服务。

FastDFS 架构包括 **Tracker server** 和 **Storage server**。客户端请求 Tracker server 进行文 件上传、下载，通过 Tracker server 调度最终由 Storage server 完成文件上传和下载。

- **Tracker server** 作用是负载均衡和调度，通过 Tracker server 在文件上传时可以根据一些 策略找到 Storage server 提供文件上传服务。可以将 tracker 称为**追踪服务器**或**调度服务器**。
- **Storage server** 作用是文件存储，客户端上传的文件最终存储在 Storage 服务器上， Storageserver 没有实现自己的文件系统而是利用操作系统 的文件系统来管理文件。可以将 storage 称为**存储服务器**。

服务端两个角色:

- **Tracker**: 管理集群，tracker 也可以实现集群。每个 tracker 节点地位平等。收集 Storage 集群的状态。
- **Storage**: 实际保存文件， Storage 分为多个组，每个组之间保存的文件是不同的。每 个组内部可以有多个成员，组成员内部保存的内容是一样的，组成员的地位是一致的，没有 主从的概念。

## 文件上传流程

![image-20210423203348658](https://gitee.com/JqM1n/biog-image/raw/master/20210423203348.png)

客户端上传文件后存储服务器将文件 ID 返回给客户端，此文件 ID 用于以后访问该文 件的索引信息。文件索引信息包括:组名，虚拟磁盘路径，数据两级目录，文件名。

![image-20210423204117444](https://gitee.com/JqM1n/biog-image/raw/master/20210423204117.png)

- **组名**：文件上传后所在的 storage 组名称，在文件上传成功后有 storage 服务器返回， 需要客户端自行保存。
- **虚拟磁盘路径**：storage 配置的虚拟路径，与磁盘选项 store_path*对应。如果配置了 store_path0 则是 M00，如果配置了 store_path1 则是 M01，以此类推。
- **数据两级目录**：storage 服务器在每个虚拟磁盘路径下创建的两级目录，用于存储数据 文件。
- **文件名**：与文件上传时不同。是由存储服务器根据特定信息生成，文件名包含:源存储 服务器 IP 地址、文件创建时间戳、文件大小、随机数和文件拓展名等信息。

## 使用Docker安装FastDFS

### 1. 获取镜像

可以利用已有的FastDFS Docker镜像来运行FastDFS。

获取镜像可以通过下载

```shell
sudo docker image pull delron/fastdfs
```

也可是直接使用提供给大家的镜像备份文件

```shell
sudo docker load -i 文件路径/fastdfs_docker.tar
```

加载好镜像后，就可以开启运行FastDFS的tracker和storage了。

### 2. 运行tracker

执行如下命令开启tracker 服务

```shell
sudo docker run -dti --network=host --name tracker -v /var/fdfs/tracker:/var/fdfs delron/fastdfs tracker
```

- 我们将fastDFS tracker运行目录映射到本机的 /var/fdfs/tracker目录中。

执行如下命令查看tracker是否运行起来

```shell
sudo docker container ls
```

如果想停止tracker服务，可以执行如下命令

```shell
sudo docker container stop tracker
```

停止后，重新运行tracker，可以执行如下命令

```shell
sudo docker container start tracker
```

### 3. 运行storage

执行如下命令开启storage服务

```shell
sudo docker run -dti --network=host --name storage -e TRACKER_SERVER=10.211.55.5:22122 -v /var/fdfs/storage:/var/fdfs delron/fastdfs storage
```

- TRACKER_SERVER=本机的ip地址:22122 本机ip地址不要使用127.0.0.1
- 我们将fastDFS storage运行目录映射到本机的/var/fdfs/storage目录中

执行如下命令查看storage是否运行起来

```shell
sudo docker container ls
```

如果想停止storage服务，可以执行如下命令

```shell
sudo docker container stop storage
```

停止后，重新运行storage，可以执行如下命令

```shell
sudo docker container start storage
```

**注意：如果无法重新运行，可以删除`/var/fdfs/storage/data`目录下的`fdfs_storaged.pid` 文件，然后重新运行storage。**