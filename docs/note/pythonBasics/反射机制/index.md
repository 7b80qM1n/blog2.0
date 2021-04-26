---

id: pythonBasics-getattr

title: 反射机制
---



它可以把字符串映射成实例的变量或实例的方法然后可以去执行调用、修改等操作。

它有四个重要的方法：

- **getattr** 获取指定字符串名称的对象属性
- **setattr** 为对象设置一个属性
- **hasattr** 判断对象是否有对应的对象（字符串）
- **delattr** 删除对象的属性

attr是属性英文的前几个字母，属性指的是类中类变量、实例变量和方法。但是要注意不能是私有的，如果你的变量是以“_”开头，那将无法获取。

**getattr()函数的使用方法：**接收2个参数，前面的是一个类或者模块，后面的是一个字符串，注意了！是个字符串！

## 反射到底有什么用？

考虑有这么一个场景：需要根据用户输入url的不同，调用不同的函数，实现不同的操作，也就是一个WEB框架的url路由功能。路由功能是web框架里的核心功能之一，例如Django的urls。

```
import commons 

def run():
    inp = input("请输入您想访问页面的url：  ").strip()
    func = getattr(commons, inp)
    func() 

if __name__ == '__main__':
    run()
```

**原理：**func = getattr(commons,inp)语句是关键，通过getattr()函数，从commons模块里，查找到和inp字符串“外形”相同的函数名，并将其返回，然后赋值给func变量。变量func此时就指向那个函数，func()就可以调用该函数。



## 应用场景

 1、View类的dispatch通过接收到的请求方法变为小写从而使用反射得到类中的相对应方法

```python
class View(object):
     def dispatch(self, request, *args, **kwargs):
            
         if request.method.lower() in self.http_method_names:
             handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
         else:
             handler = self.http_method_not_allowed
         return handler(request, *args, **kwargs)
```



 2、settings配置中心和中间件使用了反射

```python
import importlib

# 获取到settings文件的路径
self.SETTINGS_MODULE = settings_module

# 通过importlib.import_module获取到settings文件对象
mod = importlib.import_module(self.SETTINGS_MODULE) 


# 循环获取到settings文件对象里面的属性
for setting in dir(mod):
    # 得到大写的属性名
    if setting.isupper():
        # 得到属性值比如中间件等其他配置属性
        setting_value = getattr(mod, setting)
```



## 基于django中间件学习编程思想

### 模块补充

```python
import importlib # 该方法最小只能到py文件名
ret = importlib.import_module('myfile.b')  
print(ret)  # from myfile import b
```

### 包+面向对象+字符串+鸭子类型+反射

```python
创建notify文件夹 里面都是不同功能的py文件  __init__.py  email.py qq.py  wechat.py  里面分别有各个名字的类 
#  __init__.py  下面书写代码
import settings
import importlib


def send_all():
    for path_str in settings.NOTIFY_LIST:   # path_str 就是settings里面的字符串  'notify.email.Email'
        module_path, class_name = path_str.rsplit('.', maxsplit=1)  # rsplit从右往左切 maxsplit只切一次
        # module_path = 'notify.email'  class_name  = 'Email'
        # 第一步 利用字符串导入模块
        module = importlib.import_module(module_path)  # from notify import email
        # 第二步 利用反射获取类名
        cls = getattr(module, class_name)  # 拿到类  Email QQ WeCaht
        # 第三步 生成类的对象
        obj = cls()
        # 第四步 利用鸭子类型直接调用send方法
        obj.send(content)
# email.py   下面书写代码
class Email(object):
    def __init__(self):
        pass
    def send(self, content):
        print(f'Email:{content}')
# qq.py  下面书写代码
class QQ(object):
    def __init__(self):
        pass
    def send(self, content):
        print(f'QQ:{content}')
# wechat.py  下面书写代码
class WeChat(object):
    def __init__(self):
        pass
    def send(self, content):
        print(f'WeChat:{content}')
外面创建 settings.py  start.py 
# settings.py  下面配置
NOTIFY_LIST = [
    'notify.email.Email',
    'notify.qq.QQ',
    'notify.wechat.WeChat'
]
     
# start.py 下面使用代码
import notify

notify.send_all('已被调用')  # Email:已被调用  QQ:已被调用  WeChat:已被调用
```



