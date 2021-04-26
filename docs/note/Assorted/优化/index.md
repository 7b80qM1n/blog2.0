---

id: pythonBackend-Assorted-2

title: 优化
---

## 数据库优化

### 数据库查询优化

#### only和defer  

```python
# only
"""
only是只查该字段 直接将结果封装到返回给你的对象中
点该字段 不需要再走数据库
但如果你点了不是括号内的字段  就会频繁的去走数据库查询
"""
res = models.Book.objects.only('name')    # 只查name字段，
for r in res:
    # print(r.name)   # 返回name
    print(r.price)  # 查询的结果没有，因此要每次都去查
# defer
"""
defer是查除了该字段的 所有字段 直接将结果封装到返回给你的对象中
点该其他字段 不需要再走数据库
但如果你点了不是括号内的字段  就会频繁的去走数据库查询
"""
res = models.Book.objects.defer("name") # 查除了name字段之外的字段，只走一次数据库
for r in res:
    # print(r.name)   # 查询的结果没有，没有的时候会去走数据库
    print(r.price)
# defer和only互为反关系
```

#### select_related与prefetch_related

```python
# select_related  内部的本质是链表操作 inner join  消耗资源就在连表上，但是不用多次访问数据库
'括号内只能外键字段并且多对多不行 将连表之后的结果全部查询出来封装到对象里面'
'之后对象在点击表的字段的时候都无需再走数据库'
def select_related(self, *fields)
    性能相关：表之间进行join连表操作，一次性获取关联的数据。
    总结：
    1. select_related主要针一对一和多对一关系进行优化。
    2. select_related使用SQL的JOIN语句进行优化，通过减少SQL查询的次数来进行优化、提高性能。
# prefetch_related  内部的本质是子查询 消耗资源在反复问数据库的次数上，但是不需要连表
'内部通过子查询的方式将多张的表数据也封装到对象中 这样用户在使用的时候也是感觉不出来的'
def prefetch_related(self, *lookups)
    性能相关：多表连表操作时速度会慢，使用其执行多次SQL查询在Python代码中实现连表操作。
    总结：
    1. 对于多对多字段（ManyToManyField）和一对多字段，可以使用prefetch_related()来进行优化。
    2. prefetch_related()的优化方式是分别查询每个表，然后用Python处理他们之间的关系。
# 详细：https://www.icode9.com/content-4-527314.html
```

### Mysql达到1亿多条数据，怎么处理

mysql在常规配置下，一般只能承受2000万的数据量(同时读写，且表中有大文本字段，单台服务器)，其实当数据量达到500万-800万的时候就应该考虑做优化。现在超过1亿，并不断增加的情况下，建议如下处理：

1. 分表，可以按时间，或按一定的规则拆分，比如分类，做到查询某一条数据，尽量在一个子表中。比如分表可以采用按时间分，根据实际情况一个月或一个季度的分
2. 分库，分库最基本的就是读写分离，不行就多加机器做负载，尤其是写入，放在新表中，定期进行同步，如果其中记录不断有update，最好将写的数据放在redis中，定期同步
3. 表的大文本字段分离出来，成为独立的新表。存储大文本字段，可以使用NOSQL数据库
4. 优化架构或优化SQL查询，避免联表查询，尽量不要用count(*), in，递归等消耗性能的语句
5. 使用缓存，重复读取时，直接从缓存中读取

上面是低成本的管理方法，基本几台服务器即可搞定，但是管理起来麻烦一些。



> https://www.qindaosou.com/ask/20200912509722.html

## DRF缓存

有些数据是经常被用户查询使用的，而且数据基本不变化，所以我们可以将这些数据进行缓存处理，减少数据库的查询次数。

在Django REST framework中使用缓存，可以通过`drf-extensions`扩展来实现。

关于扩展使用缓存的文档，可参考链接http://chibisov.github.io/drf-extensions/docs/#caching

### 安装

```python
pip install drf-extensions
```

### 使用方法

1） 直接添加装饰器

可以在使用rest_framework_extensions.cache.decorators中的cache_response装饰器来装饰返回数据的类视图的对象方法，如

```python
class CityView(views.APIView):
    @cache_response()
    def get(self, request, *args, **kwargs):
        ...
```

cache_response装饰器可以接收两个参数

```python
@cache_response(timeout=60*60, cache='default')
```

- timeout 缓存时间
- cache 缓存使用的Django缓存后端（即CACHES配置中的键名称）

如果在使用cache_response装饰器时未指明timeout或者cache参数，则会使用配置文件中的默认配置，可以通过如下方法指明：

```python
# DRF扩展
REST_FRAMEWORK_EXTENSIONS = {
    # 缓存时间
    'DEFAULT_CACHE_RESPONSE_TIMEOUT': 60 * 60,
    # 缓存存储
    'DEFAULT_USE_CACHE': 'default',
}
```

- DEFAULT_CACHE_RESPONSE_TIMEOUT 缓存有效期，单位秒
- DEFAULT_USE_CACHE 缓存的存储方式，与配置文件中的`CACHES`的键对应。

**注意，cache_response装饰器既可以装饰在类视图中的get方法上，也可以装饰在REST framework扩展类提供的list或retrieve方法上。使用cache_response装饰器无需使用method_decorator进行转换。**

2）使用drf-extensions提供的扩展类

drf-extensions扩展对于缓存提供了三个扩展类：

- **ListCacheResponseMixin**

  用于缓存返回列表数据的视图，与ListModelMixin扩展类配合使用，实际是为list方法添加了cache_response装饰器

- **RetrieveCacheResponseMixin**

  用于缓存返回单一数据的视图，与RetrieveModelMixin扩展类配合使用，实际是为retrieve方法添加了cache_response装饰器

- **CacheResponseMixin**

  为视图集同时补充List和Retrieve两种缓存，与ListModelMixin和RetrieveModelMixin一起配合使用。

三个扩展类都是在`rest_framework_extensions.cache.mixins`中。

## 页面静态化

页面静态化即将动态渲染生成的页面结果保存成html文件，放到静态文件服务器中。用户访问的时候访问的直接是处理好之后的html静态文件。

**对于页面中属于每个用户展示不同数据内容的部分，可以在用户请求完静态化之后的页面后，在页面中向后端发送请求，获取属于用户的特殊的数据。**



在页面中既会用到Django的模板语法，也会用到前端Vue的模板语法，可以通过在前端中修改Vue的模板变量语法来避免冲突

```python
var vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    ...
})
```

对于首页的静态化，考虑到页面的数据可能由多名运营人员维护，并且经常变动，所以将其做成定时任务，即定时执行静态化。

在Django执行定时任务，可以通过django-crontab扩展来实现。

### 安装

```shell
pip install django-crontab
```

### 添加应用

```python
INSTALLED_APPS = [
    ...
    'django_crontab',  # 定时任务
    ...
]
```

### 设置任务的定时时间

在配置文件中设置定时执行的时间

每个定时任务分为三部分定义：

- 任务时间

  ```shel
  基本格式 :
  
  * * * * *
  
  分 时 日 月 周      命令
  
  M: 分钟（0-59）。每分钟用*或者 */1表示
  
  H：小时（0-23）。（0表示0点）
  
  D：天（1-31）。
  
  m: 月（1-12）。
  
  d: 一星期内的天（0~6，0为星期天）。
  ```

- 任务方法

- 任务日志

首页的定时任务设置如下

```python
# 定时任务
CRONJOBS = [
    # 每5分钟执行一次生成主页静态文件
    ('*/5 * * * *', 'contents.crons.generate_static_index_html', '>> /Users/delron/Desktop/meiduo_mall/logs/crontab.log')
]
```

### 解决中文字符问题

在定时任务中，如果出现非英文字符，会出现字符异常错误

![crontab错误](https://gitee.com/JqM1n/biog-image/raw/master/20210426174723.png)

可以通过在配置文件中添加定时任务执行的附加命令来实现

```python
# 解决crontab中文问题
CRONTAB_COMMAND_PREFIX = 'LANG_ALL=zh_cn.UTF-8'
```

### 开启定时任务

添加定时任务到系统中

```shell
python manage.py crontab add
```

显示已经激活的定时任务

```shell
python manage.py crontab show
```

移除定时任务

```shellv
python manage.py crontab remove
```