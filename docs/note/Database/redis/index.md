---

id: Database-redis
title: Redis
---

## 基本数据类型

Redis支持5种数据类型：string（字符串），hash（哈希），list（列表），set（集合）及zset(sorted set：有序集合)。

### String 

① **string** 是最简单的类型，就是普通的 set 和 get，做简单的 KV 缓存。redis 的 string 可以包含任何数据。比如jpg图片或者序列化的对象。string 类型是 Redis 最基本的数据类型，string 类型的值最大能存储 512MB。

**常用命令**：get、set、incr、decr、mget等。

**String在Redis底层是怎么存储的？**

Redis是C语言开发的，C语言自己就有字符类型，但是Redis却没直接采用C语言的字符串类型，而是自己构建了`动态字符串（SDS）`的抽象类型。

![v2-cdbba6ed68e0fc3b0f6a3baf2f05be34_720w](https://gitee.com/JqM1n/biog-image/raw/master/20210426135908.jpeg)

就好比这样的一个命令，其实我是在Redis创建了两个SDS，一个是名为`aobing`的Key SDS，另一个是名为`cool`的Value SDS，就算是字符类型的List，也是由很多的SDS构成的Key和Value罢了。

SDS在Redis中除了用作字符串，还用作缓冲区（buffer），那到这里大家都还是有点疑惑的，C语言的字符串不好么为啥用SDS？SDS长啥样？有什么优点呢?

为此我去找到了Redis的源码，可以看到SDS值的结果大概是这样的，源码的在GitHub上是开源的大家一搜就有了。

```
struct sdshdr{
 int len;
 int free;
 char buf[];
}
```

![image](https://gitee.com/JqM1n/biog-image/raw/master/20210426135923.png)

https://zhuanlan.zhihu.com/p/152074927

**使用场景：**

- **缓存功能：String**字符串是最常用的数据类型，不仅仅是**Redis**，各个语言都是最基本类型，因此，利用**Redis**作为缓存，配合其它数据库作为存储层，利用**Redis**支持高并发的特点，可以大大加快系统的读写速度、以及降低后端数据库的压力。
- **计数器：**微博数, 粉丝数，许多系统都会使用**Redis**作为系统的实时计数器，可以快速实现计数和查询的功能。而且最终的数据结果可以按照特定的时间落地到数据库或者其它存储介质当中进行永久保存。
- **共享用户Session：**用户重新刷新一次界面，可能需要访问一下数据进行重新登录，或者访问页面缓存**Cookie**，但是可以利用**Redis**将用户的**Session**集中管理，在这种模式只需要保证**Redis**的高可用，每次用户**Session**的更新和获取都可以快速完成。大大提高效率。

```
redis 127.0.0.1:6379> SET name "runoob"
"OK"
redis 127.0.0.1:6379> GET name
"runoob"
```

　　在以上实例中我们使用了 Redis 的 **SET** 和 **GET** 命令。键为 name，对应的值为 **runoob**。

　　**注意：**一个键最大能存储512MB。

### Hash

② **Redis** **hash** 是一个键值(key => value)对集合。Redis hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象。

常用命令：hget，hset，hgetall 等。

**Hash在Redis底层是怎么存储的？**

底层使用Rehash哈希表实现，哈希的好处就是如果哈希函数选好，值的分布均匀，哈希表可以在接近 O(1) 的时间内进行读写操作。哈希表通过哈希函数实现 Key 和数组下标的转换，通过开放寻址法和链表法来解决哈希冲突。哈希函数设计的好坏决定了哈希冲突的概率，也就决定哈希表的性能。

**压缩列表**：当一个哈希只包含少量键值对，并且每个键值对的键和值是小整数值，要么就是长度比较短的字符串，那么Redis就会使用压缩列表来做哈希的底层实现。

**应用场景**：我们简单举个实例来描述下Hash的应用场景，比如我们要存储一个用户信息对象数据，包含以下信息：

1. 用户ID为查找的key，存储的value用户对象包含姓名，年龄，生日等信息，如果用普通的key/value结构来存储，主要有以下2种存储方式：

![1368782-20180821202451984-479691318](https://gitee.com/JqM1n/biog-image/raw/master/20210426140004.png)

1. 第一种方式将用户ID作为查找key，把其他信息封装成一个对象以序列化的方式存储，这种方式的缺点是，增加了序列化/反序列化的开销，并且在需要修改其中一项信息时，需要把整个对象取回，并且修改操作需要对并发进行保护，引入CAS等复杂问题。

![1368782-20180821202546802-636845502](https://gitee.com/JqM1n/biog-image/raw/master/20210426140019.png)

1. 第二种方法是这个用户信息对象有多少成员就存成多少个key-value对儿，用用户ID+对应属性的名称作为唯一标识来取得对应属性的值，虽然省去了序列化开销和并发问题，但是用户ID为重复存储，如果存在大量这样的数据，内存浪费还是非常可观的。
2. 那么Redis提供的Hash很好的解决了这个问题，Redis的Hash实际是内部存储的Value为一个HashMap，并提供了直接存取这个Map成员的接口，如下图：

![1368782-20180821202632663-939669694](https://gitee.com/JqM1n/biog-image/raw/master/20210426140033.png)

1. 也就是说，Key仍然是用户ID，value是一个Map，这个Map的key是成员的属性名，value是属性值，这样对数据的修改和存取都可以直接通过其内部Map的Key(Redis里称内部Map的key为field)，也就是通过 key(用户ID) + field(属性标签) 就可以操作对应属性数据了，既不需要重复存储数据，也不会带来序列化和并发修改控制的问题，很好的解决了问题。
2. 这里同时需要注意，Redis提供了接口(hgetall)可以直接取到全部的属性数据，但是如果内部Map的成员很多，那么涉及到遍历整个内部Map的操作，由于Redis单线程模型的缘故，这个遍历操作可能会比较耗时，而另其它客户端的请求完全不响应，这点需要格外注意。

**使用场景：**

- 存储部分变更数据，如用户信息等。

实现方式：上面已经说到Redis Hash对应Value内部实际就是一个HashMap，实际这里会有2种不同实现，这个Hash的成员比较少时Redis为了节省内存会采用类似一维数组的方式来紧凑存储，而不会采用真正的HashMap结构，对应的value redisObject的encoding为zipmap，当成员数量增大时会自动转成真正的HashMap，此时encoding为ht。

```
redis> HSET myhash field1 "Hello" field2 "World"
"OK"
redis> HGET myhash field1
"Hello"
redis> HGET myhash field2
"World"
```

　　实例中我们使用了 Redis **HMSET, HGET** 命令，**HMSET** 设置了两个 field=>value 对, HGET 获取对应 **field** 对应的 **value**。每个 hash 可以存储 232 -1 键值对（40多亿）。

### List 

③ **Redis list** 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）。

**常用命令：**lpush（添加左边元素），rpush，lpop（移除左边第一个元素），rpop，lrange（获取列表片段，LRANGE key start stop）等。

**实现方式：**Redis list的实现为一个双向链表，即可以支持反向查找和遍历，更方便操作，不过带来了部分额外的内存开销，Redis内部的很多实现，包括发送缓冲队列等也都是用的这个数据结构。

**压缩列表：**当一个列表只包含少量列表项，并且每个列表项要么就是小整数值，要么就是长度比较短的字符串，那么Redis就会使用压缩列表来做列表的底层实现。

**使用场景：**

- 比如微博的关注列表，粉丝列表等都可以用Redis的list结构来实现。
- 比如微博，当用户量越来越多时，而且每一个用户都有自己的文章列表，而且当文章多时，都需要分页展示，这时可以考虑使用Redis的列表，列表不但有序同时还支持按照范围内获取元素，可以完美解决分页查询功能，大大提高查询效率，下拉不断分页，如果性能高，就一页一页走。
- **消息队列：Redis**的链表结构，可以轻松实现阻塞队列，可以使用左进右出的命令组成来完成队列的设计。比如：数据的生产者可以通过**Lpush**命令从左边插入数据，多个数据消费者，可以使用**BRpop**命令阻塞的“抢”列表尾部的数据。
- 取最新N个数据的操作：记录前N个最新登陆的用户Id列表，超出的范围可以从数据库中获得。

```
//把当前登录人添加到链表里
ret = r.lpush("login:last_login_times", uid)
//保持链表只有N位
ret = redis.ltrim("login:last_login_times", 0, N-1)
//获得前N个最新登陆的用户Id列表
last_login_list = r.lrange("login:last_login_times", 0, N-1)
```

**比如微博：**

　　最新微博ID使用了常驻缓存，这是一直更新的。但是我们做了限制不能超过5000个ID，因此我们的获取ID函数会一直询问Redis。只有在start/count参数超出了这个范围的时候，才需要去访问数据库。我们的系统不会像传统方式那样“刷新”缓存，Redis实例中的信息永远是一致的。SQL数据库（或是硬盘上的其他类型数据库）只是在用户需要获取“很远”的数据时才会被触发，而主页或第一个评论页是不会麻烦到硬盘上的数据库了。

```
redis 127.0.0.1:6379> lpush runoob redis
(integer) 1
redis 127.0.0.1:6379> lpush runoob mongodb
(integer) 2
redis 127.0.0.1:6379> lpush runoob rabitmq
(integer) 3
redis 127.0.0.1:6379> lrange runoob 0 10
1) "rabitmq"
2) "mongodb"
3) "redis"
redis 127.0.0.1:6379>
```

　　列表最多可存储 232 - 1 元素 (4294967295, 每个列表可存储40多亿)。

### Set

④ **Redis set**是string类型的无序集合。集合是通过hashtable实现的，概念和数学中个的集合基本类似，可以交集，并集，差集等等，set中的元素是没有顺序的。所以添加，删除，查找的复杂度都是O(1)。

*sadd 命令：*添加一个 string 元素到 key 对应的 set 集合中，成功返回1，如果元素已经在集合中返回 0，如果 key 对应的 set 不存在则返回错误。

**常用命令：**sadd，spop，smembers，sunion 等。

**应用场景：**Redis set对外提供的功能与list类似是一个列表的功能，特殊之处在于set是可以自动排重的，当你需要存储一个列表数据，又不希望出现重复数据时，set是一个很好的选择，并且set提供了判断某个成员是否在一个set集合内的重要接口，这个也是list所不能提供的。

Set 就是一个集合，集合的概念就是一堆不重复值的组合。利用Redis提供的Set数据结构，可以存储一些集合性的数据。

**实现方式：** 底层使用了intset和hashtable两种数据结构存储的，intset我们可以理解为数组，而且存储数据的时候是有序的，hashtable就是普通的哈希表（key为set的值，value永远为null），实际就是通过计算hash的方式来快速排重的，这也是set能提供判断一个成员是否在集合内的原因。

**案例：**在微博中，可以将一个用户所有的关注人存在一个集合中，将其所有粉丝存在一个集合。Redis还为集合提供了求交集、并集、差集等操作，可以非常方便的实现如**共同关注、共同喜好、二度好友**等功能，对上面的所有集合操作，你还可以使用不同的命令选择将结果返回给客户端还是存集到一个新的集合中。

**使用场景：**

- 交集，并集，差集：(Set)

```
//book表存储book名称
set book:1:name    ”The Ruby Programming Language”
set book:2:name     ”Ruby on rail”
set book:3:name     ”Programming Erlang”
//tag表使用集合来存储数据，因为集合擅长求交集、并集
sadd tag:ruby 1
sadd tag:ruby 2
sadd tag:web 2
sadd tag:erlang 3
//即属于ruby又属于web的书？
inter_list = redis.sinter("tag.web", "tag:ruby") 
//即属于ruby，但不属于web的书？
inter_list = redis.sdiff("tag.ruby", "tag:web") 
//属于ruby和属于web的书的合集？
inter_list = redis.sunion("tag.ruby", "tag:web")
```

- 获取某段时间所有数据去重值

　　这个使用Redis的set数据结构最合适了，只需要不断地将数据往set中扔就行了，set意为集合，所以会自动排重。

sadd key member

```
redis 127.0.0.1:6379> sadd runoob redis
(integer) 1
redis 127.0.0.1:6379> sadd runoob mongodb
(integer) 1
redis 127.0.0.1:6379> sadd runoob rabitmq
(integer) 1
redis 127.0.0.1:6379> sadd runoob rabitmq
(integer) 0
redis 127.0.0.1:6379> smembers runoob
1) "redis"
2) "rabitmq"
3) "mongodb"
```

　　**注意：**以上实例中 rabitmq 添加了两次，但根据集合内元素的唯一性，第二次插入的元素将被忽略。集合中最大的成员数为 232 - 1(4294967295, 每个集合可存储40多亿个成员)。

### Sorted Set

⑤ **Redis zset** 是排序的 **Set**，去重但可以排序，写进去的时候给一个分数，自动根据分数排序。

*zadd 命令：*添加元素到集合，元素在集合中存在则更新对应score。

**常用命令**：zadd，zrange，zrem，zcard等

**实现方式**：Redis sorted set的**内部使用HashMap和跳跃表(SkipList)来保证数据的存储和有序**，HashMap里放的是成员到score的映射，而跳跃表里存放的是所有的成员，排序依据是HashMap里存的score，**使用跳跃表的结构可以获得比较高的查找效率**，并且在实现上比较简单。

**使用场景**：Redis sorted set的使用场景与set类似，区别是set不是自动有序的，而sorted set可以通过用户额外提供一个优先级(score)的参数来为成员排序，并且是插入有序的，即自动排序。当你需要一个有序的并且不重复的集合列表，那么可以选择sorted set数据结构，比如twitter 的public timeline可以以发表时间作为score来存储，这样获取时就是自动按时间排好序的。和Set相比，**Sorted Set关联了一个double类型权重参数score**，使得集合中的元素能够按score进行有序排列，redis正是通过分数来为集合中的成员进行从小到大的排序。zset的成员是唯一的,但分数(score)却可以重复。比如一个存储全班同学成绩的Sorted Set，其集合value可以是同学的学号，而score就可以是其考试得分，这样在数据插入集合的时候，就已经进行了天然的排序。另外还可以用Sorted Set来做带权重的队列，比如普通消息的score为1，重要消息的score为2，然后工作线程可以选择按score的倒序来获取工作任务。让重要的任务优先执行。

![image-20210426140208387](https://gitee.com/JqM1n/biog-image/raw/master/20210426140208.png)

```
redis 127.0.0.1:6379> zadd runoob 0 redis
(integer) 1
redis 127.0.0.1:6379> zadd runoob 0 mongodb
(integer) 1
redis 127.0.0.1:6379> zadd runoob 0 rabitmq
(integer) 1
redis 127.0.0.1:6379> zadd runoob 0 rabitmq
(integer) 0
redis 127.0.0.1:6379> > ZRANGEBYSCORE runoob 0 1000
1) "mongodb"
2) "rabitmq"
3) "redis"
```

各个数据类型应用场景：

| 类型                   | 简介                                                    | 特性                                                         | 场景                                           |
| ---------------------- | ------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| string                 | 二进制安全                                              | 可以包含任何数据，比如jpg图片或序列化的对象，一个键最大能存512M | 缓存、限流、计数器、分布式锁、分布式session    |
| Hash（字典）           | 键值对集合                                              | 适合存储对象，并且可以像数据库中update一个属性一样只修改某一项属性值 | 存储用户信息、用户主页访问量、修改用户属性     |
| List（列表）           | 链表（双向链表）                                        | 增删快,提供了操作某一段元素的API                             | 微博关注人时间轴列表、分页消息队列             |
| Set（集合）            | 哈希表实现，元素不重复                                  | 添加、删除、查找的复杂度都是O(1)为集合提供了求交集、并集、差集等操作 | 微博共同关注、共同喜好、赞、踩、标签、好友关系 |
| Sorted Set（有序集合） | 将Set中的元素增加一个权重参数score，元素按score有序排列 | 数据插入集合时，已经进行天然排序                             | 微博热搜带权重的消息队列                       |

![image (1)](https://gitee.com/JqM1n/biog-image/raw/master/20210426140253.png)

## 高级数据类型

**bitmap**是一种伪数据类型，是基于String实现的。因为redis的key和value本身就支持二进制的存储方式，所以bitmaps只是一个独特的扩展。因为是面向字节操作，所以他的最大长度就是512M，最适合设置成2^32个不同字节,可以用来实现 **布隆过滤器（BloomFilter）**。

**业务场景**

- 统计每天某一部电影是否被点播
- 统计每天有多少部电影被点播
- 统计每周/月/年有多少部电影被点播
- 统计年度哪部电影没有被点播

**HyperLogLog**

供不精确的去重计数功能，比较适合用来做大规模数据的去重统计，例如统计 UV

**Geospatial**

可以用来保存地理位置，并作位置距离计算或者根据半径计算位置等。有没有想过用Redis来实现附近的人？或者计算最优地图路径？

这三个其实也可以算作一种数据结构，不知道还有多少朋友记得，我在梦开始的地方，Redis基础中提到过，你如果只知道五种基础类型那只能拿60分，如果你能讲出高级用法，那就觉得你有点东西。



## 压缩列表

   听到“压缩”两个字，直观的反应就是节省内存，数组要求每个元素的大小相同，如果我们要存储不同长度的字符串，那我们就需要用最大长度的字符串大小作为元素的大小(假设是20个字节)。存储小于 20 个字节长度的字符串的时候，便会浪费部分存储空间。

![%E6%95%B0%E7%BB%84](https://gitee.com/JqM1n/biog-image/raw/master/20210426140310.png)

  数组的优势占用一片连续的空间可以很好的利用CPU缓存访问数据。如果我们想要保留这种优势，又想节省存储空间我们可以对数组进行压缩。

![%E6%95%B0%E7%BB%84%E5%8E%8B%E7%BC%A9](https://gitee.com/JqM1n/biog-image/raw/master/20210426140325.png)

但是这样有一个问题，我们在遍历它的时候由于不知道每个元素的大小是多少，因此也就无法计算出下一个节点的具体位置。这个时候我们可以给每个节点增加一个lenght的属性。

![%E5%8E%8B%E7%BC%A9%E5%88%97%E8%A1%A8](https://gitee.com/JqM1n/biog-image/raw/master/20210426140341.png)

 如此，我们在遍历节点的之后就知道每个节点的长度(占用内存的大小)，就可以很容易计算出下一个节点再内存中的位置。这种结构就像一个简单的压缩列表了。



## 持久化

**Redis** 提供了 RDB 和 AOF 两种持久化方式，RDB 是把内存中的数据集以快照形式写入磁盘，实际操作是通过 fork 子进程执行，采用二进制压缩存储；AOF 是以文本日志的形式记录 **Redis** 处理的每一个写入或删除操作。

### RBD方式（默认）

例如，如果先前的快照是在10分钟前创建的，并且现在已经至少有300次新写入，则将创建一个新的快照。

- 优点

- - 把整个 Redis 的数据保存在单一文件中，比较适合用来做灾备
  - **性能最大化**，`fork` 子进程来完成写操作，让主进程继续处理命令，所以使 IO 最大化。使用单独子进程来进行持久化，主进程不会进行任何 IO 操作，保证了 Redis 的高性能。
  - 相对于数据集大时，比 AOF 的 **启动效率** 更高。

- 缺点

- - 如果说数据需要尽量保存下来，则不适合实用rdb
  - 在数据量庞大的时候，对系统消耗过大

```
save 900 1  # 在900秒以内有1次更新，就会持久化
save 300 10 
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb   # 数据的保存文件
dir ./ # 保存目录
```



### AOF方式

如果运行 Redis 的计算机停止运行，电源线出现故障或者您 `kill -9` 的实例意外发生，则写入 Redis 的最新数据将丢失。

**AOF** 对日志文件的写入操作使用的追加模式，有灵活的同步策略，支持每秒同步、每次修改同步和不同步，缺点就是相同规模的数据集，AOF 要大于 RDB，AOF 在运行效率上往往会慢于 RDB。

- 优点

- - 持久化更好
  - aof将所有的操作都追加到一个文件中，redis-check-aof 
  - 文件易读

- 缺点

- - AOF 文件比 RDB **文件大**，且**恢复速度慢，**文件会越来越大
  - **数据集大** 的时候，比 rdb **启动效率低**。

```
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
```



### 两种方式如何选择？

- 一般来说， 如果想达到足以媲美 PostgreSQL 的 **数据安全性**，你应该 **同时使用两种持久化功能**。在这种情况下，当 Redis 重启的时候会优先载入 AOF 文件来恢复原始的数据，因为在通常情况下 AOF 文件保存的数据集要比 RDB 文件保存的数据集要完整。
- 如果你 **可以承受数分钟以内的数据丢失**，那么你可以 **只使用 RDB 持久化**。
- 有很多用户都只使用 AOF 持久化，但并不推荐这种方式，因为定时生成 RDB 快照（snapshot）非常便于进行数据库备份， 并且 RDB 恢复数据集的速度也要比 AOF 恢复的速度要快，除此之外，使用 RDB 还可以避免 AOF 程序的 bug。
- 如果你只希望你的数据在服务器运行的时候存在，你也可以不使用任何持久化方式。



## key过期策略

**三种过期策略**（redis使用惰性删除+定期删除）

- **定时删除**

- - 含义：在设置key的过期时间的同时，为该key创建一个定时器，让定时器在key的过期时间来临时，对key进行删除
  - 优点：保证内存被尽快释放
  - 缺点：

- - - 若过期key很多，删除这些key会占用很多的CPU时间，在CPU时间紧张的情况下，CPU不能把所有的时间用来做要紧的事儿，还需要去花时间删除这些key
    - 定时器的创建耗时，若为每一个设置过期时间的key创建一个定时器（将会有大量的定时器产生），性能影响严重
    - 没人用

- **惰性删除**

- - 含义：key过期的时候不删除，每次从数据库获取key的时候去检查是否过期，若过期，删除key，然后执行相应操作。
  - 优点：删除操作只发生在从数据库取出key的时候发生，而且只删除当前key，所以对CPU时间的占用是比较少的，而且此时的删除是已经到了非做不可的地步（如果此时还不删除的话，我们就会获取到了已经过期的key了）
  - 缺点：若大量的key在超出超时时间后，很久一段时间内，都没有被获取过，那么可能发生内存泄露（无用的垃圾占用了大量的内存）

- **定期删除**

- - 含义：redis会把设置了过期时间的key放在单独的字典中，定时遍历来删除到期的key。该策略是前两者的一个折中方案。通过调整定时扫描的时间间隔和每次扫描的限定耗时，可以在不同情况下使得CPU和内存资源达到最优的平衡效果。

- - - 检查当前库中的指定个数个key（默认是每个库检查20个key，注意相当于该循环执行20次，循环体时下边的描述）
    - 如果当前库中没有一个key设置了过期时间，直接执行下一个库的遍历
    - 随机获取一个设置了过期时间的key，检查该key是否过期，如果过期，删除key
    - 判断定期删除操作是否已经达到指定时长，若已经达到，直接退出定期删除。

- - 优点：

- - - 通过限制删除操作的时长和频率，来减少删除操作对CPU时间的占用--处理"定时删除"的缺点
    - 定期删除过期key--处理"惰性删除"的缺点

- - 缺点

- - - 在内存友好方面，不如"定时删除"
    - 在CPU时间友好方面，不如"惰性删除"

- - 难点

- - - 合理设置删除操作的执行时长（每次删除执行多长时间）和执行频率（每隔多长时间做一次删除）（这个要根据服务器运行情况来定了）



## 淘汰策略

当内存不足时才会触发淘汰策略

| 策略            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| volatile-lru    | 从已设置过期时间的 KV 集中优先对最近最少使用(less recently used)的数据淘汰 |
| volitile-ttl    | 从已设置过期时间的 KV 集中优先对剩余时间短(time to live)的数据淘汰 |
| volitile-random | 从已设置过期时间的 KV 集中随机选择数据淘汰                   |
| allkeys-lru     | 从所有 KV 集中优先对最近最少使用(less recently used)的数据淘汰 |
| allKeys-random  | 从所有 KV 集中随机选择数据淘汰                               |
| noeviction      | 不淘汰策略，若超过最大内存，返回错误信息                     |



## 数据一致性

**方案一**：**延迟双删，**不严谨，在修改mysql前后都进行redis.del(key)操作，并且第二次删除通过延迟的方式进行。

1. 先删除缓存
2. 再写数据库
3. 休眠500毫秒（根据具体的业务时间来定，这点不稳定）
4. 再次删除缓存

需要评估自己的项目的读数据业务逻辑的耗时。这么做的目的，就是确保读请求结束，写请求可以删除读请求造成的缓存脏数据。当然，这种策略还要考虑 redis 和数据库主从同步的耗时。最后的写数据的休眠时间：则在读数据业务逻辑的耗时的基础上，加上几百ms即可。比如：休眠1秒。



**方案二**：**mq异步延迟删除（高并发）**

1. 先删除缓存
2. 再写数据库
3. 触发异步写入串行化mq（也可以采取一种key+version的分布式锁）
4. mq接受再次删除缓存

异步删除对线上业务无影响，串行化处理保障并发情况下正确删除。



**方案三**：**异步更新缓存(基于binlog的同步机制，主从复制中获得的灵感)（低并发）**

1. **先修改数据库**
2. **再使用阿里巴巴的Canal订阅binlog日志，而Canal正是模仿了mysql的slave数据库的备份请求**
3. **然后把binlog推送mq消息队列，异步推送更新。**

这样一旦MySQL中产生了新的写入、更新、删除等操作，就可以把binlog相关的消息推送至mq消息队列，Redis再根据消息队列中binlog的记录，对Redis进行更新。其实这种机制，很类似MySQL的主从备份机制，因为MySQL的主备也是通过binlog来实现的数据一致性。