---

id: pythonBackend-django05

title: Celery异步任务框架
---

Celery是一个简单、灵活且可靠的，处理大量消息的分布式系统

专注于实时处理的异步任务队列

同时也支持任务调度

### 官方

Celery 官网：http://www.celeryproject.org/

Celery 官方文档英文版：http://docs.celeryproject.org/en/latest/index.html

Celery 官方文档中文版：http://docs.jinkan.org/docs/celery/


注意：

```
Celery is a project with minimal funding, so we don’t support Microsoft Windows. Please don’t open any issues related to that platform.
```

## Celery异步任务框架

```
"""
1）可以不依赖任何服务器，通过自身命令，启动服务(内部支持socket)
2）celery服务为为其他项目服务提供异步解决任务需求的
注：会有两个服务同时运行，一个是项目服务，一个是celery服务，项目服务将需要异步处理的任务交给celery服务，celery就会在需要时异步完成项目的需求

人是一个独立运行的服务 | 医院也是一个独立运行的服务
	正常情况下，人可以完成所有健康情况的动作，不需要医院的参与；但当人生病时，就会被医院接收，解决人生病问题
	人生病的处理方案交给医院来解决，所有人不生病时，医院独立运行，人生病时，医院就来解决人生病的需求
"""
```

## Celery架构

Celery的架构由三部分组成，消息中间件（message broker）、任务执行单元（worker）和 任务执行结果存储（task result store）组成。

![image-20210410100828644](https://gitee.com/JqM1n/biog-image/raw/master/20210410100828.png)

#### 消息中间件

Celery本身不提供消息服务，但是可以方便的和第三方提供的消息中间件集成。包括，RabbitMQ, Redis等等

#### 任务执行单元

Worker是Celery提供的任务执行的单元，worker并发的运行在分布式的系统节点中。

#### 任务结果存储

Task result store用来存储Worker执行的任务的结果，Celery支持以不同方式存储任务的结果，包括AMQP, redis等

## 使用场景

异步执行：解决耗时任务,将耗时操作任务提交给Celery去异步执行，比如发送短信/邮件、消息推送、音视频处理等等

延迟执行：解决延迟任务

定时执行：解决周期(周期)任务,比如每天数据统计

## Celery的安装配置

```
pip install celery
```

消息中间件：RabbitMQ/Redis

app=Celery(‘任务名’, broker=’xxx’, backend=’xxx’)

## Celery执行异步任务

### 包架构封装

```python
"""
project
    ├── celery_task			  celery包
		├── sms				 任务1 
			├── __init__.py  
			└── tasks.py	 异步任务代码
		├── __init__.py 	 
		├── config.py		 配置相关文件
		└── celery.py		 启动函数
"""
```

### 异步执行

#### celery.py

```python
from celery import Celery

# 创建实例对象
app = Celery('B2cMall')

# 加载配置文件
app.config_from_object('celery_task.config')

# 自动注册异步任务
app.autodiscover_tasks(['celery_task.sms'])
```

#### config.py

```python
# broker_url='redis://127.0.0.1:6379/7' 不加密码
broker_url = f'redis://:123456@127.0.0.1:6379/7'  # 任务队列
backend_url = f'redis://:123456@127.0.0.1:6379/8'  # 结构存储
```

#### sms/tasks.py

```python
from celery_task.celery import app

@app.task(name="xxx")  # 注册任务,name=任务别名
def send_sms_code(mobile, code):
    pass
```

#### 执行

windows

celery不支持在windows下运行任务，需要借助eventlet来完成

`-c`是协程的数量，生产环境可以用1000

```python
pip3 install eventlet
celery -A celery_task worker -l info -P eventlet -c 10
```

非windows

```python
celery -A celery_task worker -l info
```

#### 提交异步任务

```python
send_sms_code.delay(mobile, code)
```

### 定时执行

#### 举例目录

```python
"""
project
    ├── celery_task			  celery包
		├── test_time		  定时任务1 
			├── __init__.py  
			└── tasks.py	 异步任务代码
		├── __init__.py 	 
		├── config.py		 配置相关文件
		└── celery.py		 启动函数
"""
```

#### celery.py

```python
from celery import Celery

# 创建实例对象
app = Celery('B2cMall')

# 加载配置文件
app.config_from_object('celery_task.config')

# 自动注册异步任务
app.autodiscover_tasks(['celery_task.test_time'])

# 时区
app.conf.timezone = 'Asia/Shanghai'
# 是否使用UTC
app.conf.enable_utc = False

# 任务的定时配置
from datetime import timedelta

app.conf.beat_schedule = {
    'add': {
        'task': 'celery_task.test_time.tasks.add',  # 路径
        'schedule': timedelta(seconds=2),  # 单位s
        'args': (123,456),  # 参数 
    }}
```

#### config.py

```python
# broker_url='redis://127.0.0.1:6379/7' 不加密码
broker_url = f'redis://:123456@127.0.0.1:6379/7'  # 任务队列
backend_url = f'redis://:123456@127.0.0.1:6379/8'  # 结构存储
```

#### test_time/tasks.py

```python
from celery_task.celery import app

@app.task         # 注意定时任务的装饰器是没有括号的
def add(x, y):
    return x+y
```

任务添加好了，需要让celery单独启动一个进程来定时发起这些任务， 注意， 这里是发起任务，不是执行，这个进程只会不断的去检查你的任务计划，每发现有任务需要执行了，就发起一个任务调用消息，交给celery worker去执行

```python
celery -A celery_task beat -l info
```

执行同上

windows

```python
celery -A celery_task worker -l info -P eventlet
```

非windows

```python
celery -A celery_task worker -l info
```

#### 