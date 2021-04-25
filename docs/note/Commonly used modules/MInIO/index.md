---

id: element-MInIO

title: MInIO 免费开源对象存储服务
---

## FastDFS和MinIO

1. FastDFS没有官方文档，所有的文档全是某某公司的自己总结的文档，或者是某某网友自己总结的文档。

2. FastDFS目前提供了 C 和 Java SDK ，以及 PHP 扩展 SDK。而MinIO几乎提供了所有主流开发语言的SDK以及文档。

3. MinIO号称是世界上速度最快的对象存储服务器。在标准硬件上，对象存储的读/写速度最高可以达到`183 GB/s`和`171 GB/s`。

4. MinIO提供了与`k8s`、`etcd`、`docker`等容器化技术深度集成方案，可以说就是为了云环境而生的。这点是FastDFS不具备的。

5. MInIO中文文档地址:http://docs.minio.org.cn/docs/

## MInIO 免费开源对象存储服务

### docker下载

```python
docker pull minio/minio:latest
```

### 创建目录

```python
mkdir -p /root/docker/minio/data
mkdir -p /root/docker/minio/config
```

### 启动服务 

```python
docker run -id -p 9000:9000 --name minio1 \
  --privileged=true \
  -e "MINIO_ACCESS_KEY=7b80qM1n" \
  -e "MINIO_SECRET_KEY=624904571@qq.com" \
  -v /root/docker/minio/data:/data \
  -v /root/docker/minio/config:/root/.minio \
  minio/minio server /data
```

### MinIO容器日志

获取MinIO日志，使用 `docker logs` 命令。

```python
docker logs <container_id>
```

### python 图片上传到minio时，在minio不是显示图片格式

```python
minioClient.put_object('xxxxx',fileName,IOData,length,content_type='image/png')
```

一定要注意`content_type`这个属性

由于浏览器的限制，当上传文件时，设置`header`为`application/octet-stream`时，浏览器打开链接会默认进行下载而不是在浏览器中加载文件，所以如果想要文件时直接打开浏览，上传时则不要设置`application/octet-stream`

常见的媒体格式类型如下：

```python
text/html ： HTML格式
text/plain ：纯文本格式
text/xml ： XML格式
image/gif ：gif图片格式
image/jpeg ：jpg图片格式
image/png：png图片格式
```

以`application`开头的媒体格式类型：

```python
application/xhtml+xml ：XHTML格式
application/xml： XML数据格式
application/atom+xml ：Atom XML聚合格式
application/json： JSON数据格式
application/pdf：pdf格式
application/msword ： Word文档格式
application/octet-stream ： 二进制流数据（如常见的文件下载）
application/x-www-form-urlencoded ： 中默认的encType，form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）
```

