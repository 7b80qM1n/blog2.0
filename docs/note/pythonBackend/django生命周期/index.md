---

id: pythonBackend-django02

title: Django生命周期流程图
---

## 流程图

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210405232243.png)

## URL路由系统 url.py(路由层）

### 路由匹配

```python
url(r'^test/$',views.test),
url(r'^testadd/$')
url(r'^$', views.home)  # 首页
# 你在输入url的时候会默认加斜杆 django内部帮你坐到重定向 一次匹配不行 url后面加斜杆再来一次
# 取消自动加斜杆
APPEND_SLASH = False/True # 默认是自动加斜杆的 
```

### 无名有名分组

```python
# 分组就是给正则表达式加一个括号
# 无名分组  就是将括号内正则表达式匹配到的内容当作 位置参数 传递给后面的视图函数
url(r'^test/(\d+)', views.test)
def test(request,xxx):
    ...
# 有名分组  就是将括号内正则表达式匹配到的内容当作 关键字参数 传递给后面的视图函数
url(r'^testadd/(?P<name>\d+)', views.testadd)
def testadd(request,name):
    ...
# 有名无名是否可以混合使用呢?  不！！可！！以！！
# 无名有名可以复用   比如 
url(r'^test/(\d+)/(\d+)/(\d+)', views.test)
def test(request,*args):
    ...
url(r'^testadd/(?P<name>\d+)/(?P<age>\d+)/(?P<year>\d+)', views.testadd)
def testadd(request,**kwargs):
    ...
```

### 反向解析&无名有名反向解析

```python
"通过一些方法得到一个结果 该结果可以直接访问对应的url触发视图函数"
url(r'^func_k', views.func, name='ooo')   # name:给路由函数起一个别名
# 前端反向解析
<a href="{% url 'ooo' %}">xxx</a>    # 之后url的名字func_k无论怎么变 都会动态获取
# 后端反向解析
from django.shortcuts import render, HttpResponse, redirect, reverse
reverse('ooo')
# 无名有名反向解析 前端后端一样
url(r'^func_k/(\d+)', views.func, name='ooo')
url(r'^func_k/(?P<year>\d+)', views.func, name='ooo')
# 前端反向解析
<a href="{% url 'ooo' 1 %}">xxx</a>
# 后端反向解析
from django.shortcuts import render, HttpResponse, redirect, reverse
reverse('ooo', args(1,)) # 里面是个元祖 逗号不能少
```

### 路由分发

```python
"""
django的每一个应用都可以有自己的templates文件夹 urls.py static 文件夹
正是基于上述的特点 django能够非常好的做到分组开发（每个人写自己的app）
作为组长只需要将手下书写的app全部拷贝到一个新的django项目中然后在配置文件里面注册
所有的app再利用路由分发的特点将所有的app整合起来
当一个django项目中的url特别多的时候总路由urls.py代码非常冗余不好维护
这个时候也可以利用路由分发来减轻总路由的压力
"""
# 总路由
# 第一种写法
from django.conf.urls import url, include
from app01 import urls as app01_urls
from app02 import urls as app02_urls
urlpatterns = [
    url(r'^app01/', include(app01_urls)),
    url(r'^app02/', include(app02_urls))
]
# 推荐写法 
from django.conf.urls import url, include
urlpatterns = [
    url(r'^app01/', include('app01.urls')),
    url(r'^app02/', include('app02.urls'))
]
# 注意事项:总路由里面的url千万不能加$结尾
# 子路由
# app01 urls.py
from django.conf.urls import url
from app01 import views
urlpatterns = [
    url(r'^reg/',views.reg)
]
# app02 urls.py
from django.conf.urls import url
from app02 import views
urlpatterns = [
    url(r'^reg/',views.reg)
]
```

### 虚拟环境

```python
'在正常开发中我们会给每一个项目配备一个该项目独有的解释器环境'
'该环境内只有该项目用到的模块用不到一概不装  linux:缺什么才装什么'
'你每创建一个虚拟环境就类似于重新下载了一个纯净的python解释器'
'但是虚拟环境不要创建太多，是需要消耗硬盘空间的'
# 拓展
'开发当中我们会给每一个项目配备一个requirements.txt文件 里面书写了该项目所有的模块的的版本'
'你只需要直接输入一条命令即可一键安装所有模块的版本'
```

### django版本区别

```python
"""
django1.x路由层使用的是url方法
django2.x和3.x版本中路由层使用的是path方法
    url()第一个参数支持正则 path不支持正则 写什么就匹配什么
    如需正则可导入使用 re_path  2.x和3.x里面的re_path就等价于1.x里面的url
"""
'虽然path不支持正则但是它的内部支持五种转换器'
path( 'index/<int:id>/ ',index) # 将第二个路由里面的内容先转成整型然后以关键字的形式传递给后面的视图函数
def index( request,id):
    print ( id,type (id))
    return HttpResponse( 'index' )
"""
str		匹配除了路径分隔符(/) 之外的非空字符串，这是默认的形式
int		匹配正整数，包含0。
slug	匹配字母、数字以及横杠、下划线组成的字符串。
uuid	匹配格式化的uuid,如075194d3-6885-417e-a8a8-6c931e272f00 
path	匹配任何非空字符串，包含了路径分隔符(/) (不能用? )
"""
```

## 视图层

### 三板斧

```python
# 视图函数必须要返回一个HttpResponse对象正确―研究三者的源码即可得处结论
The view app01.views.index didn't return an HttpResponse object. It returned None instead.
# render简单内部原理
    from django. template import Template , Context
    res = Template( '<h1>{{ user }}</h1>' )
    con = Context({'user' :{'username' :'jason',' password' : 123}})
    retres. render (con )
    print(ret) 
    return HttpResponse(ret)
```

### JsonResponse对象

```python
'json格式的数据有什么用?   '
    ' --=前后端数据交互需要使用到json作为过渡实现跨语言传输数据 '
import json
def ab_json(request):
    user_idct = {'username': 'jqm很帅', 'password': '123'}
    json_str = json.dumps(user_dict)
    return HttpResponse(json_str)
"""
比如我们把后端的字典展示到前端浏览器上 那么我们一般都会先把这个字典转换成json格式的字符串  然后通过HttpResponse() 把它传过去就可以了  但是在这里我们发现了一个问题 就是如果
我们的字典中有汉字的话 他在浏览器上显示的时候会是这样的 ↓
{'username': 'jqm\u597d\u5e05\', 'password': '123'}
我们发现他会自己把汉字转换Unicode, 这不是我们想要的结果 点进去dumps的源码发现,里面有个参数叫ensure_ascii=True,就是它帮我们转换了 所以我们只要把这个参数改成False就
不会自动转码了 于是你可以这样写--> json_str = json.dumps(user_dict, ensure_ascii=False) 这样浏览器上就正常显示字典的内容了 
==============
那么言归正传 django里面有个更方便的模块 叫做JsonResponse 它可以直接return JsonResponse 把字典放进去 就不需要你再转化字符串了 ↓
"""
from django.http import JsonResponse 
def ab_json(request):
    user_idct = {'username': 'jqm很帅', 'password': '123'}
    return JsonResponse(user_dict)
'但通过上述方法 还是会发现会把汉字转换成Unicode, 点进去JsonResponse的源码发现它内部还是用的dumps'
	data = json.dumps(data,cls=encoder，**json_dumps_params)
"""
现在不知道JsonResponse怎么取消转换,但是知道dumps怎么取消,在源码里面发现有json_dumps_params=None这个参数,并且下方有if判断,如果是None他就会返回一个空字典 否则(json_dumps_params有值的情况下)执行 'data = json.dumps(data,cls=encoder，**json_dumps_params)'
我们再仔细看看这里面的**不就是打散吗? **会把字典里面的键值对打散成为关键字参数 也就意味着要想在dumps里面添加ensure_ascii=False 
就要在外部JsonResponse对象加上参数json_dumps_params={ensure_ascii:False}那么他进来后会自动被打散 变成ensure_ascii=False 
那么我们的目的就达到了
"""
from django.http import JsonResponse 
def ab_json(request):
    user_idct = {'username': 'jqm很帅', 'password': '123'}
    return JsonResponse(user_dict, json_dumps_params={ensure_ascii:False})
=======
'注意事项：默认只能序列化字典 序列化其他需要加上safe参数'
from django.http import JsonResponse 
def ab_json(request):
    l = [1,2,3,4,5]
    return JsonResponse(user_dict, json_dumps_params={'ensure_ascii':False, 'safe'=False})
```

### form表单上传文件及后端如何操作

```python
'form表单上传文件类型的数据 缺一不可'
1.method必须指定成post
2.enctype必须换成formdata
'方法'
request.POST  # 只能获取普通的键值对数据
request.FILES # 获取文件数据
'保存文件数据'
def ab_file(request):
    if request.method == 'POST':
        file_obj = request.FILES.get('file') # 文件对象
        with open(file_obj.name, 'wb') as f:
            for line in file_obj:
                f.write(line)
    return render(request, 'form.html')
'form表单上传文件类型的数据 缺一不可'
1.method必须指定成post
2.enctype必须换成formdata
```

### FBV与CBV

```python
# FBV就是在url中一个路径对应一个函数 CBV就是在url中一个路径对应一个类
# CBV 
    # CBV路由
    from django.views import View
    url(r'^login/', views.MyLogin.as_view())
    # views.py
    from django.views import View
    class MyLogin(View):
        def get(self, request):
            return render(request, 'form.html')
        def post(self, request):
            return HttpResponse('post方法')
    # CBV特点
    '能够直接根据请求方式的不同直接匹配到对应的方法执行'
```

### CBV源码剖析

```python
 突破口在urls.py
url(r'^login/', views.Mxxx.as_view())    # 函数执行完一定是个内存地址 --> view(闭包函数) 内存函数的地址
'函数名/方法名 加括号执行优先级最高'
'猜测'
    as_view() 要么是@staticmethod修饰的静态方法  要么是@classmethod修饰的类方法  √
    @classmethod
    def as_view(cls, **initkwargs):
        ...
        return view

# 那么views.Mxxx.as_view()可以变成views.view 那么url(r'^login/', views.Mxxx.as_view())就相当于↓
url(r'^login/', views.view)  # FBV一模一样 CBV与FBv在路由匹配上本质是一样的都是路由对应函数内存地址
def as_view(cls, **initkwargs):
    """
    Main entry point for a request-response process.
    """
    def view(request, *args, **kwargs):
        self = cls(**initkwargs)  # cls 就是我们自己写的类
        return self.dispatch(request, *args, **kwargs)
        """
        在看python源码的时候一定要时刻提醒自己面
        向对象属性方法查找顺序
        先从对象自己找
        再去产生对象的类里面找
        ...
        总结：看源码只要看到self点一个东西 一定要问你自己当前的self到底是谁
        """
    return view
# CBV精髓
def dispatch(self, request, *args, **kwargs):
    if request.method.lower() in self.http_method_names:
        # http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']
        handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        """
        反射：通过字符串来操作对象的方法或者属性
        ∵ handler = getattr(我们自己写的类, 'get', 当找不到属性或者方法时就会出现的第三个参数)
        ∴ handler = 我们自己写的类里面的get方法
        """
    else:
        handler = self.http_method_not_allowed
    return handler(request, *args, **kwargs)
    "自动调用get方法
```

## 模板层

### 模板语法

```python
{{}}:	变量相关
{% %}:	逻辑相关
'python内部的变量如整型 浮点型 字符串 列表 字典 集合 元祖 布尔值 都可以传过去'
n = 1  ==> {{ n }}
"""
传递函数名的时候会自动加括号调用 但是模板语法不支持给函数传额外的参数
传递类名的时候也会自动加括号调用(实例化) 
针对类名和函数名 模板语法会自动判断出当前变量名是否可以被调用 如果可以就自动执行
"""
class Myclass(object):
    def ooo(self):
        return 'bbb'
obj = Myclass()
return render(request, 'index.html', locals())
{{ obj.ooo }}  # 前端展示 bbb
# django模板语法的取值 是固定的格式 只能采用'句点符'
d = {'username':'jqm','age':18}     <p>{{ d.username }}  # 字典键取值 jqm
l = ['jjj', 'qq', 'mm']              <p>{{ l.0 }}         # 列表索引 jjj
di = ['hobby':[1,2,{'info':'nbb'}]]   <p>{{ di.hobby.2.info }}  # 支持键和索引混用 nbb
```

### 过滤器

```python
# 过滤器就类似于是模板语法的 内置方法 django 内置有60多个过滤器 暂时学10个左右 后续补充
{{数据|过滤器:参数}}  # 基本语法
**********************
# 转义 本身为了安全考虑 是取消转义的 加上safe就是转义了 
# 前端转义
hhh = '<h1>会会</h1>'    
{{ hhh|safe }}   
----- 
# 后端转义  
from django.utils.safestring import mark_safe
hhh = '<h1>会会</h1>'    res = mark_safe(hhh)  
{{ res }}    #  以后在写全栈页面的时候 前端代码不一定非要在前端页面书写 也可以先在后端写好 然后传递给页面
------
# 统计长度
n = 123  {{ n|lenth }}  # 3
# 默认值   
n = True {{ n|default:'第一个参数布尔值是True就展示第一个参数否则就展示冒号后面的值' }} 
# 文件大小 1234567/1024/1024=1.2 MB
n = 1234567  {{ n|filesizeformat }}  # 1.2 MB
# 日期格式化
n = datetime.datetime.now()  {{ current_time|date:'Y-m-d H:i:s' }}  # 2020-09-23 10:58:22
# 切片操作(支持步长)
n = [1, 2, 3, 4, 5, 6, 7]   {{ n|slice:'0:4:2'}}  # [1, 3]
# 窃取字符
n = '类似于摘要 冒号后面设置长度 后面的... 也占位'  {{ n|truncatechars:9 }}  # 类似于摘要 ...
# 窃取单词(长度不包含三个点，按照空格切)
 n = 'my name is jqm my age is 18 '  {{ n|truncatewords:9 }}  # my name is jqm my age is 18
# 移除特定的字符
n = 'j q m n b'  {{ n|cut:' ' }}  # jqmnb
# 拼接操作
n = 'jqm'  {{ n|join:'+' }}  # j+q+m
# 拼接操作(加法)
n1 = 'jqm'  n2 = 'nb'   {{ n1|add:n2 }} # 字符串相加 jqmnb   
n3 = 10    {{ n3|add:10 }}  # 20
```

### 标签（模板语法for循环和if判断）

```python
# for循环
'counter0':类似索引从0开始  'counter':计数器从1开始  'first':是不是第一个  'last':是不是最后一个  # {{ forloop.counter }}
{% for i in n %}
    ...
{% endfor %}
# if判断
n = True
    {% if n %}
    ...
    {% elif b %}
        ...
    {% else %}
        ...
{% endif %}
# for和if混合使用
{% for i in l %}
    {% if forloop.first %}
        <p>会把列表第一个替换掉</p>
    {% elif forloop.last %}
        <p>会把列表最后一个替换掉</p>
    {% else %}
        <p>{{ i }}</p>
    {% endif %}
    {% empty %}
    <p>for循环的可迭代对象内部没有元素 根本没法循环就会执行这条</p>
{% endfor %}
# 补充 with标签起别名
n = {'username':'jqm','hobby':[1, 2, {'info':'nnnn'}]}
# 这里要拿到'nnnn'非常麻烦 {% n.hobby.2.info %} 如果以后要经常拿的话 写起来很痛苦 可以起别名
{% with n.hobby.2.info as nb %}
    <p>{{ nb }}</p>  # 在with语法内就可以通过as后面的别名快速的使用到前面非常复杂获取数据的方式
{% endwith %}
```

### 自定义过滤器、标签、inclusion_tag

```python
'先执行以下三个步骤'
1.在应用下创建一个名字'必须'叫templatetags文件夹
2.在该文件夹内创建'任意'名称的py文件 eg:mytag.py
3.在该py文件内'必须'先书写下面两句话(单词一个都不能错)
    from django import template
    register = template.Library()
    # 自定义过滤器 最多两个参数
    @register.filter(name='xxxx')
    def myuuu(x,y):
        return x + y
    # 自定义标签(参数可以有多个)
    @register.simple_tag(name='oooo')
    def mykkk(x, y, z):
        return f'{x}{y}{z}'
# 先加载过来
{% load mytag %}
# 自定义过滤器
n = 123  {{ n|xxxx:10}} # 133
# 自定义标签 标签多个参数彼此之间空格隔开
{% oooo x y z %}
# 自定义inclusion_tag
'内部原理'
    先定义一个方法 在页面上调用该方法 并且可以传值
    该方法会神农工程一些数据然后传递给一个html页面 
    之后将熏染好的结果放到调用的位置
@register.inclusion_tag('xxx.html')\
def mybbb(n):
    data = [f'第{i}项' for i in range(5)]
    return locals()  # 将data传递给xxx.html
{% left 5 %}
# 总结：当html页面某一个地方的页面需要传参数才能够动态的渲染出来 并且在多个页面上都需要使用到该局部 那么就考虑将该局部页面做成inclusion_tag形式
```

### 模板的继承

```javascript
'有一些网站 整体都差不多 只是某一个局部在做变化'
# 模板的继承 你自己先选好一个你要继承的模板页面
{% extends 'home.html' %}
# 继承了之后子页面跟模板页面长的是一模一样的 你需要在模板页面上提前划定可以被修改的区域
{% block content %}
    模板内容
{% endblock %}
# 子页面就可以声明想要修改哪块划定了的区域
{% block content %}
    子页面内容
{% endblock %}
# 一般情况下模板页面上应该至少有三块区域是可以被修改的区域
1.css区域
{% block css %}
    ...
{% endblock %}
2.html区域
{% block html %}
    ...
{% endblock %}
3.js区域
{% block js %}
    ...
{% endblock %}
 # 每一个子页面就都可以有自己独有的css代码 html代码 js代码
```

### 模板的导入

```python
'将页面的某一个局部当成模板的形式 哪个地方需要就可以直接导入使用即可'
{% include 'xxx.html' %}
```

## 模型层（ORM语法）：跟数据库打交道的

### 测试脚本环境准备

```python
'当你只是想测试django中的某一个py文件内容 那么你可以不用书写前后端交互的形式 而是直接写一个测试脚本即可'
    '脚本代码无论是写在应用下的tests.py还是自己单独开设py文件都可以'
# 测试环境的准备 去manage.py中拷贝前四行代码 然后自己写两行
import os
import sys
if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "项目settings的路径")
    import django 
    django.setup()
    # 在这个代码块的下面就可以测试django里面的单个py文件了
    # 所有的测试代码必须等到环境准备完毕后才能书写
    from app01 import models  
        ...
```

### 查看内部sql语句的方式

```python
# 方式1
res = models.User.objects.values('name')
print(res.query)  # 只有queryset对象才能够点击query查看内部的sql语句
# 方式2  所有的sql语句都能查看
'在Django项目的settings.py文件中，在最后复制粘贴如下代码：'
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console':{
            'level':'DEBUG',
            'class':'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'propagate': True,
            'level':'DEBUG',
        },
    }
}
'配置好之后，再执行任何对数据库进行操作的语句时，会自动将Django执行的sql语句打印到pycharm终端上'
```

### 字段的增删改查

```python
# 字段的增加
1.输入字段代码后 执行两条命令 如若没有设置默认值 终端会提示 可以在终端内直接给出默认值 
2.该字段可以为空  null=True
    info = models.CharField(max_length=32, verbose_name='个人简介', null=True)  
3.直接给字段设置默认值  default=''
    hobby = models.CharField(max_length=32, verbose_name='爱好', default='study')
# 字段的修改
    直接修改代码然后执行数据库迁移的两条命令即可
# 字段的删除  （谨慎使用！！）
    直接注释对应的字段代码然后执行数据库迁移的两条命令即可 注意 执行完毕之后字段对应的数据也没了    
```

### **单表操作** 	

#### 必知必会13条

```python
1.all()           # 查询所有数据
2.filter()        # 带有过滤条件的查询
3.get()           # 直接拿数据对象 但是条件不存在直接报错
4.first()         # 拿queryset里面第一个元素
5.last()          # 拿queryset里面最后一个元素
res = models.User.objects.all.last()
6.values()        # 可以指定获取数据字段 是queryset对象 列表套字典
7.values_list()   # 可以指定获取数据字段 是queryset对象 列表套元祖
8.distinct()      # 去重
res = models.User.objects.values('name').distinct()
'去重一定要是一模一样的数据 如果带有主键那么肯定不一样 你在往后的查询中一定不要忽略主键'
9.order_by()     # 排序 
10.reverse()     # 反转 前提是数据已经排序过
11.count()       # 统计当前数据的个数
12.exclude()     # 排除xx在外
```

#### 神奇的双下划线查询

```python
# 大于xx__gt  小于xx__lt    大于等于xx__gte    小于等于xx__lte  
# 年龄大于35岁的
res = models.User.objects.filter(age__gt=35)
# 查找范围xx__range 首尾都要
# 包含某些值xx__in  
# 年龄是18或者32或者40
res = models.User.objects.filter(age__in=[18,32,48])
# xx__icontains 查询出名字自里面含有某个字符的数据 忽略大小写  xx__icontains 区分大小写   模糊查询
res = models.User.objects.filter(name__contains='p')
# xx__date类型字段 可以根据年月日进行过滤
# 查询时间是1月份的 month月 year年 day天
res = models.User.objects.filter(register_time__month='1')
```

### 数据的增删改查

```python
# 数据的查询
from app01 import models
user_obj = models.User.objects.filter(username=username) # 可以把filter当成where记忆
# 返回的结果是一个querySet对象你可以把它看成是一个列表套数据对象
# [数据对象1，数据对象2...]  支持索引和切片操作但是不支持负数并且不推荐你使用索引  推荐用first
user_obj = models.User.objects.filter(username=username).first()  # first括号内可以写多个参数 查询的时候默认是and的关系
# 方式二 拿到所有的数据
user_queryset = models..User.objects.all()   
************
# 数据的增加
# 第一种方式
res = models.User.objects.create(username=username,password=password)   # 返回值就是当前被创建的对象本身
# 第二种方式
user_obj = models.User(username=username,password=password)
user_obj.save()   # 保存数据
************
# 数据的修改  eg:修改对象edit_id
# 第一种方式
models.User.objects.filter(id=edit_id).update(username=username,password=password)
'将filter查询出来的列表中所有的对象全部更新 批量更新操作'
# 第二种方式
edit_obj.username = username
edit_obj.password = password
edit_obj.save()
'上述方法当字段特别多的时候效率会非常的低 从头到尾将数据的所有字段全部更新一遍 无论该字段是否被修改'
************
# 数据的删除
models.User.objects.filter(id=delete_id).delete()
```

### 多表操作

```python
# 一对多外键增删改查
# 增 第一种 直接写实际字段 id
models.User.objects.create(title='三国演义',price=123.23,publish_id=1)
# 增 第二种 虚拟字段 对象
publish_obj = models..Publish.objects.filter(pk=2).first()
models.User.objects.create(title='红楼梦',price=666.23,publish=publish_obj)
# 删除
models.Publish.objects.filter(pk=1).delete()  # 级联删除
# 修改 第一种
models.Book.objects.filter(pk=1).update(publish_id=2)
# 第二种 对象
publish_obj = models.Publish.objects.filter(pk=1).first()
models.Book.objects.filter(pk=1).update(publish=publish_obj)
# 多对多 增删改查 就是在操作第三张表
# 如何给书籍添加作者?
# 一
book_obj = models.Book.objects.filter(pk=1).first()
book_obj.authors.add(1)  # 书籍id为1的书籍绑定一个主键为1的作者
book_obj.authors.add(2,3)  # 书籍id为1的书籍绑定一个主键为2一个为3的作者
# 二
author_obj = models.Author.objects.filter(pk=1).first()
author_obj1 = models.Author.objects.filter(pk=2).first()
author_obj2 = models.Author.objects.filter(pk=3).first()
book_obj.authors.add(author_obj)
book_obj.authors.add(author_obj1,author_obj2)
'add给第三张关系表添加数据 括号内既可以传数字也可以传对象 并且都支持多个'
# 删除
# 一
book_obj.authors.remove(2)
book_obj.authors.remove(1,3)
# 二
book_obj = models.Author.objects.filter(pk=2).first()
book_obj1 = models.Author.objects.filter(pk=3).first()
book_obj.authors.remove(author_obj, author_obj1)
'remove括号内既可以传数字也可以传对象 并且都支持多个'
# 修改
# 一
book_obj.authors.set([1,2])  # 括号内必须是可迭代对象
book_obj.authors.set([3])
# 二
author_obj = models.Author.objects.filter(pk=2).first()
author_obj1 = models.Author.objects.filter(pk=3).first()
book_obj.authors.set([author_obj,author_obj1]) # 括号内必须是一个可迭代对象
'set 括号内必须传一个可迭代对象 该对象内既可以是数字也可以对象 并且都支持多个'
# 清空
# 在第三张关系表中清空某个书籍与作者的绑定关系
book_obj.authors.clear()  # 括号内不要加任何参数
```

#### 正反向的概念

```python
# 正向
    外键字段在我手上 那么我查你的时候 就是正向
# 反向
    外键字段不在我手上 那么我查你的时候 就是反向
'正向查询按字段,      查询的结果多个的时候需要加.all()'
'反向查询按表名小写,   查询的结果多个的时候需要加_set.all()'
```

#### 多表查询

##### 正向查找（两种方式）

###### 子查询（基于对象的跨表查询）

```python
# 语法：  对象.关联字段.字段
# 要点:先拿到对象，再通过对象去查对应的外键字段，分两步
book_obj = models.Book.objects.first()  # 第一本书对象(第一步)
print(book_obj.publisher)  # 得到这本书关联的出版社对象
print(book_obj.publisher.name)  # 得到出版社对象的名称
```

###### 联表查询（基于双下划线的跨表查询）

```python
# 语法：  关联字段__字段
# 要点:利用Django给我们提供的神奇的双下划线查找方式
models.Book.objects.all().values("publisher__name")
# 拿到所有数据对应的出版社的名字，神奇的下划线帮我们夸表查询
```

##### 反向查找（两种方式）

###### 子查询（基于对象的跨表查询）

```python
# 语法：  obj.表名_set
# 要点:先拿到外键关联多对一，一中的某个对象，由于外键字段设置在多的一方，所以这里还是借用Django提供的双下划线来查找
publisher_obj = models.Publisher.objects.first()  # 找到第一个出版社对象
books = publisher_obj.book_set.all()  # 找到第一个出版社出版的所有书 
titles = books.values_list("title")  # 找到第一个出版社出版的所有书的书名
# 结论:如果想通过一的那一方去查找多的一方，由于外键字段不在一这一方，所以用__set来查找即可
# 当你的查询结果可以有多个的时候 就必须加_set.all() 一个的时候不需要加
```

###### 联表查询（基于双下划线的跨表查询）

```python
# 语法：  表名__字段
# 要点:直接利用双下滑线完成夸表操作
titles = models.Publisher.objects.values("book__title")
# 案例
# 查询书籍主键是1的作者的手机号
# 分析; 涉及到三张表 书籍表 作者表 作者详情表
res = models.Book.objects.filter(pk=1).values('authors__author_detail__phone')
```

### 其他查询

#### 聚合查询

```python
'聚合查询通常情况下都是配合分组一起使用的 只要是跟数据库相关的模块'
'基本上都是在django.db.models里面 没有就在django.db'
from app01 import models
from django.db.models import Max, Min, Sum, Count, Avg
res = models.Book.objects.aggregate(Max('price'), Min('price'), Sum('price'), Count('pk'), Avg('price'))
```

#### 分组查询

```python
'分组之后默认只能获取到分组的依据 组内其他字段都无法直接获取了 严格模式 ONLY_FULL_GROUP_BY'
1.统计每一本书的作者个数
# models后面点什么 就按什么分组
res = models.Book.objects.annotate(a_num=Count('authors')).Value('a_num') # a_num是我们自定义的字段 用来存储统计出来的每本书对应的作者个数
2.统计每个出版社卖的最便宜的书的价格
res = models.Publish.objects.annotate(min_price=Min('book_price')).Value('name', 'min_price')
3.统计不止一个作者的图书
# 先按照图书分组 求每一本书对应的作者个数
# 过滤出不止一个作者的图书
res = models.Book.objects.annotate(author_num=Count('authors')).filter(author_num_gt=1).value('title','author_num')
# 只要你的rom语句得出的结果还是一个queryset对象 那么它就可以继续无限制的点queryset对象封装的方法
# 查询每个作者出的书的总价格
res = models.Authors.objects.annotate(price_sum=Sum('book__price')).value('price_num')
"按照指定的字段分组 models.Book.objects.values('price').annotate()"
        '-如果annotate前面有value会按照value里面的分组，如果没有就按照models.后面的进行分组
"如果出现分组查询报错的情况 需要修改数据库严格模式"
```

#### F查询

```python
'F可以帮我们取到表中某个字段对应的值来当作我的筛选条件，而不是我认为自定义常量的条件了，实现了动态比较的效果
'Django 支持 F() 对象之间以及 F() 对象和常数之间的加减乘除和取模的操作。基于此可以对表中的数值类型进行数学运算
# 查询卖出数大于库存的书籍
from django.db.models import F
ret1=models.Product.objects.filter(maichu__gt=F('kucun'))
# 将所有的书籍的价格都加500快
models.Book.objects.update(price=F('price')+ 500)
'在操作字符类型的数据的时候 F不能够直接做到字符串的拼接 如有需要则需导入Concat模块'
from django.db.models.functions import Concat
from django.db.models import Value
models.Book.object.update(title=Concat(F('title'),Value('str')))
```

#### Q查询

```python
from django.db.models import Q
1.查询卖出数大于100或者小于600的书籍
res = models.Book.objects.filter(Q(maichu__gt=100)|Q(price__lt=600))  # |就是or关系
# 逗号分割  就是and关系  ~小波浪号就是取反 not关系
# Q的高阶用法 能够将查询条件的左边也变成字符串的形式
q = Q()
q.connector = 'or'  # 默认是and关系
q.children.append(('price_lt',600))
q.children.append(('kucun_gt',600))
res = models.Book.object.filter(q) 
print(res)
```

### django中如何开启事务

```python
from django.db import transaction
with transaciton.atomic():
    sql语句
    sql语句2
    # 在with代码块内书写的所有orm操作都是属于同一事务
```

### ORM

#### 常用字段及参数

```python
'verbose_name参数 所有字段都可以用 用来对字段的描述 类似于备注'
AutoField  # int自增列，必须填入参数 primary_key=True。当model中如果没有自增列，则自动会创建一个列名为id的列。
IntegerField # 一个整数类型,范围在 -2147483648 to 2147483647。(一般不用它来存手机号(位数也不够)，直接用字符串存，)
CharField  # 字符类型，必须提供max_length参数， max_length表示字符长度
EmailField # varchar(254)
DecimalField  # 小数 max_digits=8 decimal_places=2 总共8位 小数点后面占2位
DateField  # 日期字段，日期格式  YYYY-MM-DD，相当于Python中的datetime.date()实例。
DateTimeField  # 日期时间字段，格式 YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ]，相当于Python中的datetime.datetime()实例。
    auto_now:每次修改数据的时候都会自动更新当前世间   
    auto_now_add:只在创建数据的时候记录创建时间后续不会自动修改了
BooleanField(Field)  # 布尔值类型 该字段传布尔值（False/True） 在数据库里面存0/1
TextField(Field)  # 文本类型 该字段可以用来存大段内容（文章、博客...）
FileField(Field)   # 字符类型 给该字段传一个文件对象，会自动将文件保存到/data目录下然后将文件路径保存到数据库中 
BigIntegerField    # 大整形  值的区间是 -9223372036854775808 — 9223372036854775807
PositiveIntegerField  # 正整数  0-2147483647
SmallIntegerField  # 小整数 -32768 ～ 32767
'django orm中blank和null的区别'
'blank只是在填写表单的时候可以为空，而在数据库上存储的是一个空字符串;null是在数据库上表现NULL，而不是一个空字符串;'
'需要注意的是，日期型(DateField、TimeField、DateTimeField)和数字型(IntegerField、DecimalField、FloatField)不能接受空字符串'
'如要想要在填写表单的时候这两种类型的字段为空的话，则需要同时设置nul=True、blank=True;'
```

#### choices参数（数据库字段设计常见）

```python
# 只要某个字段的可能性是可以列举完全的 那么一般情况下都会采用choices参数
# models.py
class User(models.Model):
    gender_choices = (
        (1, '男'),
        (2, '女'),
        (3, '其他'),
    )
    gender = models.IntegerField(choices=gender_choices)
    """
    该gender字段存的还是数字 但是如果存的数字在上面元组列举的范围之内
    那么就可以非常轻松的获取到数字对应的真正的内容
    """
# 存的时候 没有列举出来的数字也能存(范围还是按照字段类型决定)
    models.User.objects.create(username='tony', age=18, gender=1)
    models.User.objects.create(username='tank', age=18, gender=4)
# 只要是choices参数的字段 如果你想要获取对应的信息 固定写法 get_字段名_display()
    user_obj = models.User.objects.filter(pk=1).first()
    print(user_obj.get_gender_display())  # 男
    # 如果没有对应关系  那么字段是什么就返回什么
    user_obj = models.User.objects.filter(pk=2).first()
    print(user_obj.get_gender_display())  # 4
```

#### 自定义char字段

```python
# Django中的CharField对应的MySQL数据库中的varchar类型，没有设置对应char类型的字段，但是Django允许我们自定义新的字段
class MycharField(models.Field):
    def __init__(self, max_length, *args, **kwargs):
        self.max_length = max_length
        # 调用父类的init方法 一定要是关键字参数的形式传入max_length
        super().__init__(max_length=max_length, *args, **kwargs)
    def db_type(self, connection):
        """
        返回真正的数据类型及各种约束条件
        :param connection:
        :return:
        """
        return f'char({self.max_length})'
# 自定义字段的使用
myfield = MyCharField(max_lenth=16, null=True)
```

#### 外键字段及参数

```python
db_index  # 如果db_index=True 则代表着为此字段设置索引 （复习索引是什么）
to_field  # 设置要关联的表字段 默认不写关联的就是另外一张的主键字段
on_delete # 当删除关联表中的数据时，当前表与其关联的行的行为
    on_delete=None,               # 删除关联表中的数据时,当前表与其关联的field的行为
    on_delete=models.CASCADE,     # 删除关联数据,与之关联也删除
    on_delete=models.DO_NOTHING,  # 删除关联数据,什么也不做
    on_delete=models.PROTECT,     # 删除关联数据,引发错误ProtectedError
    # models.ForeignKey('关联表', on_delete=models.SET_NULL, blank=True, null=True)
    on_delete=models.SET_NULL,    # 删除关联数据,与之关联的值设置为null（前提FK字段需要设置为可空,一对一同理）
    # models.ForeignKey('关联表', on_delete=models.SET_DEFAULT, default='默认值')
    on_delete=models.SET_DEFAULT, # 删除关联数据,与之关联的值设置为默认值（前提FK字段需要设置默认值,一对一同理）
    on_delete=models.SET,         # 删除关联数据,
     a. 与之关联的值设置为指定值,设置：models.SET(值)
     b. 与之关联的值设置为可执行对象的返回值,设置：models.SET(可执行对象)
 DB_CONSTRAINT参数
     db_constraint 唯一约束
     db_constraint = True  方便查询 约束字段
     db_constraint = fales  不约束字段 同时也可以查询 一般公司都用false,这样就省的报错
'django2.x及以上版本 需要你自己制定外键字段的级联更新级联删除'
```

#### orm批量插入数据

```python
'当你想要批量插入数据的时候 使用orm给你提供的bulk_create能够大大的减少操作时间'
def ab_pl(request):
    book_list = []
    for i in rang(10000):
        book_obj = models.Book(title=f'第{i}本书')
        book_list.append(book_obj)
    models.Book.objects.bulk_create(book_list)
```

#### 补充:抽象表

```python
# 抽象类是一个特殊的类，它的特殊之处在于只能被继承，不能被实例化
# 如果多个模型表中有需要重复书写的相同的字段，可以创建类将其封装起来，并且将这个类弄成抽象表，不要被数据库创建出来
from django.db import models
from django.contrib.auth.models import AbstractUser

class BaseModel(models.Model):
    is_delete = models.BooleanField(default=False)
    # auto_now_add=True 只要记录创建，不需要手动插入时间，自动把当前时间插入
    create_time = models.DateTimeField(auto_now_add=True)
    # auto_now=True,只要更新，就会把当前时间插入
    last_update_time = models.DateTimeField(auto_now=True)

    # import datetime
    # create_time=models.DateTimeField(default=datetime.datetime.now)
    class Meta:
        # 单个字段，有索引，有唯一
        # 多个字段，有联合索引，联合唯一
        abstract = True  # 抽象表，不再数据库建立出表
```

#### orm后续补充

##### Django中_meta 部分用法

```python
class User(models.Model):
    username = models.charField(verbose_name='用户名',max_1ength=32,db_index=True) 
...
    # 获取该类内所有字段信息（对象），包含反向关联的字段
    field_object = models.User._meta.get_field("username")
    field_object.verbose_name  # 用户名
    field_object.null  # False
class book(models.Model):
    user= models.ForeignKey(verbose_name='书',to='UserInfo')
    # rel获取外键的对象 
那么    models.book._meta.get_field("user").rel.model.object.filter()  
等同于  model.UserInfo.object.filter()
 
其他：
model.UserInfo._meta.app_label                       
#获取该类所在app的app名称
model.UserInfo._meta.model_name
#获取该类对应表名（字符串类型）
model.UserInfo._meta.get_field('username')
#获取该类内指定字段信息（对象）
model.UserInfo._meta.fields
#获取该类内所有字段对象
model.UserInfo._meta.many_to_many
#获取该类内多对多字段信息
```

