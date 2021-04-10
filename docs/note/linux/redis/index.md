---

id: linux-redis1

title: Redis
---

redis是内存型数据库，可以用作数据库、缓存和消息中间件

断电、进程重启，数据丢失. 支持配置redis的数据持久化，防止数据丢失

redis支持master-slave复制，读写分离，防止单点故障，数据丢失

## 五大数据类型

+ string，字符串类型
+ hash，哈希类型，如同python的dict
+ set，无序集合
+ zset，有序集合
+ list，双向队列，向左插入数据，向右插入数据，向左，右，提取数据

## redis安全启动与配置文件

### 安装方式1

```shell
1.下载redis源码
wget https://download.redis.io/releases/redis-6.0.10.tar.gz
2.解压缩
tar -zxf redis-6.0.10.tar.gz 
3.切换redis源码目录
cd redis-6.0.10.tar.gz 
4.编译源文件
make
5.编译好后，src/目录下有编译好的redis指令
6.make install 安装到指定目录，默认在/user/local/bin
```

### 安装2、配置

1. 安装

   ```shell
   yum install redis -y
   ```

2. 修改redis.conf，更改默认端口，设置密码，开启安全模式等操作

   ```shell
   vim /etc/redis.conf
   # 用yum安装的redis默认配置文件在/etc/redis.conf  配置文件修改如下
   # 这里是绑定redis的启动地址，如果你要支持远程链接，就改为0.0.0.0
   bind 0.0.0.0
   # 更改端口
   port 6500
   # 设置redis的密码
   requirepass 你的密码
   # 默认打开了安全模式
   protected-mode yes
   # 打开一个redis后台运行的参数
   daemonize yes
   ```

3. 启动redis

   ```shell
   [root@localhost ~]# redis-server /etc/redis.conf
   # 检查redis的进程
   [root@localhost ~]# ps -ef |grep redis
   root       9163      1  0 22:30 ?        00:00:00 redis-server 0.0.0.0:6500
   root       9176   8669  0 22:31 pts/1    00:00:00 grep --color=auto redis
   ```

4. 连接redis服务端，指定ip地址和端口，以及密码连接redis

   ```shell
   # -p 指定端口  -h 指定ip地址  auth指令，用于密码验证
   [root@localhost ~]# redis-cli -p 6500 -h 192.168.111.128
   192.168.111.128:6500> auth 你的密码
   OK
   192.168.111.128:6500> ping
   PONG
   ```

## redis常用指令

```shell
keys * 列出redis所有的key
```

## redis数据持久化

AOF(append-only log file) 

记录服务器执行的所有变更操作命令（例如set del等)并在服务器启动时，通过重新执行这些命令来还原数据集

AOF文件中的命令全部以redis协议的格式保存，新命令追加到文件末尾

```shell
优点︰最大程序保证数据不变		缺点:日志记录非常大
redis-client	写入数据	>	redis-server	同步命令	>	AOF文件
```

### 配置参数

1. 准备一个新的配置文件，里面定义了aof的功能性参数即可使用

   ```shell
   vim sass_redis.conf
   ```

   写入如下内容

   ```shell
   daemonize yes
   port 6379
   logfile /sass/6379/redis.log
   dir /sass/6379
   appendonly yes  # 开启aof功能
   appendfsync everysec # 每秒钟持久化一次
   ```

2. 创建aof的数据文件夹

   ```shell
   mkdir  -p  /sass/6379
   ```

3. 启动aof的redis的数据库

   ```shell
   redis-server  sass_redis.conf
   ```

4. aof机制的数据库，在首次启动的时候，就会生成aof数据文件了，如下

   ```shell
   [root@localhost 6379]# ls
   appendonly.aof 	redis.log
   # redis的aof持久化机制，是在重启的时候，redis重新执行一遍aof文件中的命令，实现数据复现
   ```

## redis主从复制

```shell
master  --复制-->  slave
只读写				只读
# 采用一主多从的形式会更加稳妥，主库挂了从库可以切换成新的主库
```

### 配置参数

1. 准备好3个redis的配置文件，分别写入如下内容

   ```shell
   vim sass_master_redis.conf  # 配置文件1（主）
   port 6379
   daemonize yes
   pidfile /sass/6379/redis.pid
   loglevel notice
   logfile "/sass/6379/redis.log"
   dbfilename dump.rdb
   dir /sass/6379
   protected-mode no
   ```

   ```shell
   vim sass_slave1_redis.conf   # 配置文件2（从）
   port 6389
   daemonize yes
   pidfile /sass/6389/redis.pid
   loglevel notice
   logfile "/sass/6389/redis.log"
   dbfilename dump.rdb
   dir /sass/6389
   protected-mode no
   slaveof 127.0.0.0.1  6379  # 定义好复制关系，启动后，立即就会建立复制
   ```

   ```shell
   vim sass_slave2_redis.conf   # 配置文件3（从）
   port 6389
   daemonize yes
   pidfile /sass/6399/redis.pid
   loglevel notice
   logfile "/sass/6399/redis.log"
   dbfilename dump.rdb
   dir /sass/6399
   protected-mode no
   slaveof 127.0.0.0.1  6379  # 定义好复制关系，启动后，立即就会建立复制
   ```

2. 生成文件夹，并启动

   ```shell
   mkdir -p  /sass/{6379,6389,6399}
   redis-server  sass_master_redis.conf
   redis-server  sass_slave1_redis.conf
   redis-server  sass_slave2_redis.conf
   # 启动后可以检查他们的进程，以及复制关系
   redis-cli -p 6379 info replication
   redis-cli -p 6389 info replication
   redis-cli -p 6399 info replication
   ```

### 手动进行主从复制故障切换

如果一个 从库 挂了，问题不大，再弄一个就可以了 但是如果 主库 挂了，问题就很大了

所以需要让 从库 在 主库 挂了之后切换成新的主库，翻身农奴做主人

```shell
# 例如这里主库6379挂了，6389做新的主库
redis-cli -p 6389 slaveof no one
# 将从库6399的复制信息改为新主库6389即可
redis-cli -p 6399 slaveof 127.0.0.0.1 6389
```

你会发现如此手动切换复制关系是很难受的，如果半夜宕机.....因此需要一个保安帮你看着~

### redis高可用哨兵

Redis-Sentinel是redis官方推荐的高可用性解决方案，当用redis作master-slave的高可用时，

如果master本身宕机，redis本身或者客户端都没有实现主从切换的功能。

而redis-sentinel就是一个独立运行的进程，用于监控多个master-slave集群，自动发现master宕机，进行自动切换slave > master。

### redis哨兵的工作原理

配置好redis的哨兵进程，一般都是使用3个哨兵（保安)

哨兵的作用是盯着redis主库，不断询问它是否存活，如果超过30s(设置的时间阈值）都没有回应，3个哨兵会判断主库宕机，谈话进行投票机制，因为3个哨兵，要自动的去选择从库为新的主库，每个哨兵的意见可能不一样  因此引出投票机制，少数服从多数

当多个哨兵达成一致，选择某一个从库节点，自动的修改他们的配置文件，切换新的主库，此时如果宕机的主库恢复，哨兵会自动将其加入集群，且自动分配为新的从库，这一切都是自动化的

### 配置Redis Sentinel

一主二从的环境搭建好后，准备招来3个值班的redis哨兵

1. 分别准备3个哨兵的配置文件

   ```shell
   sass_sentinel_26379.conf
   sass_sentinel_26370.conf
   sass_sentinel_26381.conf
   ```

2. 分别修改如下（三个哨兵的配置文件，仅仅是端口号的不同，修改对应的端口号即可）

   ```javascript
   // Sentinel节点的端口
   port 26379  
   dir /var/redis/data/
   logfile "26379.log"
   
   // 当前Sentinel节点监控 192.168.119.10:6379 这个主节点
   // 2代表判断主节点失败至少需要2个Sentinel节点节点同意
   // mymaster是主节点的别名
   sentinel monitor sassredis 127.0.0.0.1 6379 2
   
   // 每个Sentinel节点都要定期PING命令来判断Redis数据节点和其余Sentinel节点是否可达，如果超过30000毫秒30s且没有回复，则判定不可达
   sentinel down-after-milliseconds sassredis 30000
   
   // 当Sentinel节点集合对主节点故障判定达成一致时，Sentinel领导者节点会做故障转移操作，选出新的主节点，
   原来的从节点会向新的主节点发起复制操作，限制每次向新的主节点发起复制操作的从节点个数为1
   sentinel parallel-syncs sassredis 1
   
   // 故障转移超时时间为180000毫秒
   sentinel failover-timeout sassredis 180000
   deamonize yes  # 以守护进程的形式
   ```

3. 分别启动3个哨兵进程，以及查看进程信息

   ```shell
   redis-sentinel sass_sentinel_26379.conf
   redis-sentinel sass_sentinel_26380.conf
   redis-sentinel sass_sentinel_26381.conf
   ps -ef|grep redis
   ```

4. 检查redis哨兵的配置文件，以及哨兵的状态

   ```shell
   redis-cli -p 26379 info sentinel
   sentinel_masters : 1
   sentinel_tilt:0
   sentinel_running_scripts :0
   sentinel_scripts__queue_length : 0
   sentinel_simulate_failure_flags : 0
   master0:name=sassredis,status=ok, address=127.0.0.1:6379,slaves=2,sentinels=3
   ```

## redis-cluster配置

1. 并发问题

   redis官方生成可以达到10万/每秒，每秒执行10万条命令 假如业务需要每秒100万的命令执行呢?

2. 数据量太大

   一台服务器内存正常是16-256G，就像新浪微博作为世界上最大的redis存储，就超过1TB的数据，去哪里买这么大的内存条?

   各大公司有自己的解决方案，推出各自的集群功能，核心思想都是将数据分片（sharding）存储在多个redis实例中，每一片就是一个redis实例

各大企业集群方案：

- twemproxy由Twitter开源
- codis由豌豆荚开发，基于co和c开发
- redis-cluster官方3.0版本后的集群方案

具体搭建：cnblogs.com/pyyu/p/9844093.html



