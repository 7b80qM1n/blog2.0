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

## FastDFS客户端

### 安装

```python
pip install py3Fdfs
```

#### 包的说明

py3fdfs源于fdfs-client,但在使用过程中, 和旧版略有不同(py3fdfs官网示例有误)

创建client实例对象的时候不能直接传入配置文件的地址字符串,否则报错.错误代码:

TypeError: type object argument after ** must be a mapping, not str

通过模块内`get_tracker_conf`函数, 获取配置文件后传入

上传成功后返回的字典内, 其中`Remote file_id`键对应的值由旧版模块`string`类型更改为`byte`类型.则, 返回的文件id是`byte`类型

如果项目中有自定义上传类, 需要解码返回的文件id为字符串,否则服务器报错.错误代码:

a bytes-like object is required, not 'str'

### 使用

使用FastDFS客户端，需要有配置文件

#### utils.py/FastDFS/client.conf

```python
connect_timeout = 30  #  连接超时时间，针对socket套接字函数connect
network_timeout = 60  #  tracker server的网络超时，单位为秒。发送或接收数据时，如果在超时时间后还不能发送或接收数据，则本次网络通信失败。 
base_path=FastDFS客户端存放日志文件的目录
tracker_server=运行tracker服务的机器ip:22122
log_level = info
use_connection_pool = false
connection_pool_max_idle_time = 3600
load_fdfs_parameters_from_tracker = false
use_storage_id = false  # 是否使用server ID作为storage server标识
storage_ids_filename = storage_ids.conf 
# use_storage_id 设置为true，才需要设置本参数
# 在文件中设置组名、server ID和对应的IP地址，参见源码目录下的配置示例：conf/storage_ids.conf
http.tracker_server_port = 80
```

## 自定义Django文件存储系统

Django自带文件存储系统，但是默认文件存储在本地，我们需要将文件保存到FastDFS服务器上，所以需要自定义文件存储系统

1. 需要继承自`django.core.files.storage.Storage`，如

   ```python
   from django.core.files.storage import Storage
   
   class FastDFSStorage(Storage):
       ...
   ```

2. 支持Django不带任何参数来实例化存储类，也就是说任何设置都应该从django.conf.settings中获取

   ```python
   from django.conf import settings
   from django.core.files.storage import Storage
   
   class FastDFSStorage(Storage):
       def __init__(self, base_url=None, client_conf=None):
           self.base_url = base_url or settings.FDFS_URL
           self.client_conf = client_conf or get_tracker_conf(settings.FDFS_CLIENT_CONF)
   ```

3. 存储类中必须实现`_open()`和`_save()`方法，以及任何后续使用中可能用到的其他方法

   `_open(name, mode='rb')`

   被Storage.open()调用，在打开文件时被使用。

   `_save(name, content)`

   被Storage.save()调用，name是传入的文件名，content是Django接收到的文件内容，该方法需要将content文件内容保存。

   Django会将该方法的返回值保存到数据库中对应的文件字段，也就是说该方法应该返回要保存在数据库中的文件名称信息。

   `exists(name)`

   如果名为name的文件在文件系统中存在，则返回True，否则返回False。

   `url(name)`

   返回文件的完整访问URL

   `delete(name)`

   删除name的文件

   `listdir(path)`

   列出指定路径的内容

   `size(name)`

   返回name文件的总大小

   注意，并不是这些方法全部都要实现，可以省略用不到的方法。

4. 需要为存储类添加`django.utils.deconstruct.deconstructible`装饰器

   #### utils.py/FastDFS/FastDFStest

   ```python
   from django.conf import settings
   from django.core.files.storage import Storage
   from django.utils.deconstruct import deconstructible
   from fdfs_client.client import Fdfs_client, get_tracker_conf
   
   
   @deconstructible
   class FastDFSStorage(Storage):
       def __init__(self, base_url=None, client_conf=None):
           """
           初始化
           :param base_url: 用于构造图片完整路径使用，图片服务器的域名
           :param client_conf: FastDFS客户端配置文件的路径
           """
           self.base_url = base_url or settings.FDFS_URL
           self.client_conf = client_conf or get_tracker_conf(settings.FDFS_CLIENT_CONF)
   
       def _open(self, name, mode='rb'):
           """
           用不到打开文件，所以省略
           """
           pass
   
       def _save(self, name, content):
           """
           在FastDFS中保存文件
           :param name: 传入的文件名
           :param content: 文件内容
           :return: 保存到数据库中的FastDFS的文件名
           """
   
           client = Fdfs_client(self.client_conf)
           result = client.upload_by_buffer(content.read())
   
           if result.get('Status') != 'Upload successed.':
               raise Exception('上传文件到FastDFS失败')
   
           file_name = result.get("Remote file_id")
           return file_name.decode()
   
       def url(self, name):
           """
           返回文件的完整URL路径
           :param name: 数据库中保存的文件名
           :return: 完整的URL
           """
           return self.base_url + name
   
       def exists(self, name):
           """
           判断文件是否存在，FastDFS可以自行解决文件的重名问题
           所以此处返回False，告诉Django上传的都是新文件
           :param name:  文件名
           :return: False
           """
           return False
   ```


## 在Django配置中设置自定义文件存储类

### settings/dev.py

```python
# django文件存储
DEFAULT_FILE_STORAGE = '.utils.FastDFS.FastDFStest.FastDFSStorage'

# FastDFS
FDFS_URL = 'http://运行tracker服务的机器ip:8888/'  
FDFS_CLIENT_CONF = os.path.join(BASE_DIR, 'utils/fastdfs/client.conf')
```

## 

