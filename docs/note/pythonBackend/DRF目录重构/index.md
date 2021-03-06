---

id: pythonBackend-django04

title: DRF目录重构
---

## 重构项目目录

```python
"""
├── luffyapi
	├── logs/				# 项目运行时/开发时日志目录 - 包
    ├── manage.py			# 脚本文件
    ├── luffyapi/      		# 项目主应用，开发时的代码保存 - 包
     	├── apps/      		# 开发者的代码保存目录，以模块[子应用]为目录保存 - 包
        ├── libs/      		# 第三方类库的保存目录[第三方组件、模块] - 包
    	├── settings/  		# 配置目录 - 包
			├── dev.py   	# 项目开发时的本地配置
			└── pro.py  	# 项目上线时的运行配置
		├── urls.py    		# 总路由
		└── utils/     		# 多个模块[子应用]的公共函数类库[自己开发的组件]
    └── scripts/       		# 保存项目运营时的脚本文件 - 文件夹
"""
```

## 配置开发环境

### 1.修改 wsgi.py 与 manage.py 两个文件：

```python
# manage.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'luffyapi.settings.dev')
# wsgi.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'luffyapi.settings.pro')
# manage_pro.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'luffyapi.settings.pro')
```

### 2.将settings.py删除，内容拷贝到settings/dev.py中,并修改dev.py文件内容

```python
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
USE_TZ = False
sys.path.insert(0, BASE_DIR)  # 此时因为配置文件的改动,BASE_DIR是小luffyapi,也加入到环境变量中
sys.path.insert(1, os.path.join(BASE_DIR, 'apps'))  # apps也加入到环境变量
```

修改配置

![image-20210416102553536](https://gitee.com/JqM1n/biog-image/raw/master/20210416102553.png)

### 3.封装异常/日志/Response/跨域

#### 封装logger

##### dev.py

```python
# 项目上线后, 日志文件打印级别不能过低，因为一次日志记录就是一次文件io操作
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,  # 是否禁用已经存在的日志器
    'formatters': {  # 日志信息显示为格式
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(lineno)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(module)s %(lineno)d %(message)s'
        },
    },
    'filters': {  # 对日志进行过滤
        'require_debug_true': {  # django在debug模式下才输出日志
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {  # 日志处理方法
        'console': {  # 向终端中输出日志
            'level': 'WARNING',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'file': {  # 向文件中输出日志
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            # 日志位置,日志文件名,日志保存目录必须手动创建，注：这里的文件路径要注意BASE_DIR代表的是小luffyapi
            'filename': os.path.join(os.path.dirname(BASE_DIR), "logs", "luffy.log"),
            # 日志文件的最大值,这里我们设置300M
            'maxBytes': 300 * 1024 * 1024,
            # 日志文件的数量,设置最大日志数量为10
            'backupCount': 10,
            # 日志格式:详细格式
            'formatter': 'verbose',
            # 文件内容编码
            'encoding': 'utf-8'
        },
    },
    # 日志对象
    'loggers': {  # 日志器
        'django': {  # 定义了一个名为django的日志器
            'handlers': ['console', 'file'],  # 可以同时向终端与文件中输出日志
            'propagate': True, # 是否让日志信息继续冒泡给其他的日志处理系统
        },
    }
}
```

##### utils/logger.py

```python
import logging
log = logging.getLogger('django') # 跟配置文件中loggers日志对象下的名字对应
```

#### 封装项目异常处理

##### utils/exception.py

```python
from rest_framework.views import exception_handler
from luffyapi.utils.response import APIResponse
from luffyapi.utils.logger import log

def common_exception_handler(exc, context):
    log.error(f'视图{context["view"].__class__.__name__}出错,错误:{str(exc)}')
    ret = exception_handler(exc, context)
    if not ret:
        if isinstance(exc, KeyError):
            return APIResponse(code=0, msg='key error')
        return APIResponse(code=0, msg='error', result=str(exc))
    else:
        return APIResponse(code=0, msg='error', result=ret.data)
```

##### dev.py

```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'utils.exception.common_exception_handler',}
```

#### 二次封装Response模块

##### utils/response.py

```python
from rest_framework.response import Response

class APIResponse(Response):
    def __init__(self, code=1, msg='成功', result=None, status=None, headers=None, content_type=None, **kwargs):
        dic = {
            'code': code,
            'msg': msg
        }
        if result:
            dic['result'] = result
        dic.update(kwargs)
        super().__init__(data=dic, status=status, headers=headers, content_type=content_type)
```

#### 跨域

```python
pip install django-cors-headers
```

##### 配置 dev.py

```python
# 注册app
    INSTALLED_APPS = [
    	# ...
    	'corsheaders',
    ]
# 添加中间件
    MIDDLEWARE = [  # Or MIDDLEWARE_CLASSES on Django < 1.10
    	...
    	'corsheaders.middleware.CorsMiddleware',
    	'django.middleware.common.CommonMiddleware',
    	...
    ]
# 添加下面的配置
    CORS_ALLOW_CREDENTIALS = True  # 允许携带cookie
    CORS_ORIGIN_ALLOW_ALL = True
    # CORS白名单
    CORS_ORIGIN_WHITELIST = (
    	'*'
    )
    CORS_ALLOW_METHODS = (
    	'DELETE',
    	'GET',
    	'OPTIONS',
    	'PATCH',
    	'POST',
    	'PUT',
    	'VIEW',
    )
    
    CORS_ALLOW_HEADERS = (
        'authorization',
    	'content-type',
        # 下面的头可以不要
    	'XMLHttpRequest',
    	'X_FILENAME',
    	'accept-encoding',
    	'dnt',
    	'origin',
    	'user-agent',
    	'x-csrftoken',
    	'x-requested-with',
    	'Pragma',
    )
```



### 4.数据库配置

#### 创建项目数据库

```python
"""
1.管理员连接数据库
>: mysql -uroot -p
2.创建数据库
>: create database luffyapi default charset=utf8;
"""
```

#### 为指定数据库配置指定账户

```python
"""
设置权限账号密码
# 授权账号命令：grant 权限(create, update) on 库.表 to '账号'@'host' identified by '密码'
1.配置任意ip都可以连入数据库的账户
>: grant all privileges on luffyapi.* to 'luffy'@'%' identified by 'Luffy123?';
2.由于数据库版本的问题，可能本地还连接不上，就给本地用户单独配置
>: grant all privileges on luffyapi.* to 'luffy'@'localhost' identified by 'Luffy123?';
3.刷新一下权限
>: flush privileges;
只能操作luffy数据库的账户
账号：luffyapi
密码：Luffy123?
"""
```

#### 配置文件配置

```python
ATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'luffyapi',
        'USER': 'luffyapi',
        'PASSWORD': 'Luffy123?',
        'HOST': 'localhost',
        'PORT': 3306
    }
}
import pymysql
pymysql.install_as_MySQLdb()
```

#### Django 2.x 一些版本pymysql兼容问题

##### Django不采用2.0.7版本很可能出现以下问题，需要修改源代码

![image-20210322214215777](https://gitee.com/JqM1n/biog-image/raw/master/20210322214215.png)

### 5.User表配置

```python
# 用户要基于auth的user表,必须在数据库迁移命令之前操作好 后期如果再做,会报错,解决办法:
-把所有app下的迁移文件,全删除
-admin,auth app下的迁移文件删除(from django.contrib import auth  migrationsw文件夹)
-删库(数据导出后删库),重新迁移,导入数据
```

#### 创建user模块

```python
前提：在虚拟环境下
>: python ../../manage.py startapp user
```

##### user/models.py

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    telephone = models.CharField(verbose_name='电话号码', max_length=11)
    icon = models.ImageField(verbose_name='默认头像', upload_to='icon', default='icon/default.png')

    class Meta:
        db_table = 'luffy_user'
        verbose_name = '用户表'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.username
```

##### 配置media/注册user模块/配置User表  dev.py 

```python
INSTALLED_APPS = [
    # ...
    'user',
]
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
AUTH_USER_MODEL = 'user.user'
```

##### 主路由分发并打开media文件夹路径    luffyapi/urls.py

```python
from django.urls import path, re_path, include
from django.views.static import serve
from django.conf import settings
urlpatterns = [
    # ...
    path('user/', include('user.urls')),
    re_path('media/(?P<path>.*)', serve, {'document_root': settings.MEDIA_ROOT}),
]
```

##### 子路由：user/urls.py

```python
from django.urls import path, include
from utils.router import router
router = routers.SimpleRouter()
urlpatterns = [
    path('', include(router.urls)),
]
```

##### 最后迁移

### 6.Simple UI 一个基于Django Admin的现代化主题

#### pip安装  

```python
pip3 install django-simpleui
```

##### dev.py

```python
# 注册app
INSTALLED_APPS = [
    'simpleui',
    # ...
  ]
# admin LOGO
SIMPLEUI_LOGO = 'luffyapi/media/icon/default.png'
```

##### admin.py

```python
from django.contrib import admin
from . import models

admin.site.register(models.模型表名)
```

