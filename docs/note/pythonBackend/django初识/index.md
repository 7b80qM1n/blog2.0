---

id: pythonBackend-django01

title: django初识

---

## django基本操作

```python
# 命令行操作
     1.创建django项目
     # 可以先切换到对应的盘
     django-admin startproject 项目名
     """
     ├──项目名文件夹
         ├──manage.py         django入口文件
         ├──db.sqlite3        django自带的小型数据库
         ├──项目名文件夹
             ├──settings.py   配置文件
             ├──urls.py      路由与视图函数对应关系（路由层）
             └──wsgi.py      wsgiref模块
         ├──app01文件夹
             ├──admin.py             django后台管理
             ├──apps.py              注册使用
             ├──mingrations文件夹    数据库迁移记录
                 ├──models.py       数据库相关的 模型类（orm）
                 ├──tests.py        测试文件
                 └──views.py        视图函数（视图层）
     """
     2.启动django项目
     # 先切换到项目目录下   cd /项目名
        python3 manage.py runserver   # http://127.0.0.1:8000/
	# 创建应用
    "Next,start your first app by running python manage.py startapp [ app_label]."
     python manage.py startapp 应用名
# pycharm操作
    # 创建应用
    1.pycharm左下角的Terminal用命令创建
    2.pycharm上方选项中的Tools-Run manage.py Task...( Ctrl + Alt + R )
# 命令行和pycharm创建的区别
    1.命令行创建不会自动有templates文件夹 需要你手动创建 而pycharm会自动帮你创建 并且还会自动在配置文件中配置对应的路径
    TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')]    # 这里帮你拼接了templates的路径 如果是命令行创建的需要手动添加
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

## 静态文件配置

```python
"""
我们将html文件默认都放在templates文件夹下
我们将网站所使用的静态文件默认都放在static文件夹下
静态文件
    前端已经写好了的 能够直接调用使用的文件 拿来就可以用的  eg：js css img 第三方前端框架  ...
    django默认是不会自动帮你创建static文件夹 需要你自己手动创建
        一般情况下我们在static文件夹内还会做进一步的划分处理
		├──static
			├──js
			├──css
			├──img
            其他第三方文件
*********************************************************************************
当你在写django项目的时候 可能会出现后端代码修改了但是前端页面没有变化的情况
    1.你在同一个端口开了多个django项目 一直在跑的其实是第一个django项目
    2.浏览器缓存的问题  f12检查 settings-打开后第一个页面(Preferences)下的Network
    把Disable cache (while DevTools is open) 勾选上 意思就是每次打开检查都会清楚缓存
**********************************************************************************
"""
STATIC_URL = '/static/' # 类似于访问静态文件的令牌 
# 如果你想要访问静态文件你就必须以这里面的内容开头 就如这里要以static开头
'    /static/bootstrap-3.3.7-dist/js/bootstrap.min.js'
# 静态文件配置
# 去下面列表里面从上往下依次查找 找到一个就不会往下找了 找不到才会报错
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')    # 第一个找的文件名
    os.path.join(BASE_DIR, 'static1')   # 第二个找的文件名
]
```

### 静态文件动态解析

```html
{% load static %}
<link rel="stylesheet" href="{% static 'bootstrap-3.3.7-dist/css/bootstrap.min.css' %}">
<script src="{% static 'bootstrap-3.3.7-dist/js/bootstrap.min.js' %}"></script>
```

## 应用

```python
# ******应用创建后需要在配置文件setting中注册******
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app01.apps.App01Config', # 全写
    'app01', # 简写
]
```

## django小白必会三板斧

```python
#  先在urls.py中添加  然后在views.py 最后在html页面输入{{ 需要拿的数据变量名 }}
HttpResponse
    返回字符串类型的数据
    return HttpResponse('这里是返回字符串类型的哦可以写字符串在这里')
render
    返回html文件的
    return render(request,'xxx.html')  # 自动去templates文件夹下帮你查找文件
    # 传值的两种方式
    # 第一种  更加的精确 节省资源 需要谁就传谁
    user_dict = {'user':'jqm','pwd':'jqmkfc'}
    return render(request,'xxx.html',{'data':user_dict.'mmm':123}) #接下来在html文件中{{ data }}的形式就可以获取值
    # 第二种  当你要传的数据特别多的时候用这个
    return render(request,'xxx.html',locals())  # locals会将名称空间中所有的局部变量传递给html页面
redirect
    重定向
        return redirect('https://www.baidu.com')  # 跳转到别人的网址
        return redirect('/home/')    # 跳自己的时候可以不用加ip和端口 
        # redirect括号内可以直接写url 也可以写别名 如果你的别名需要额外给参数的话那么就必须使用reverse解析了
```

## request对象初识

```python
# 在前期我们使用django提交post请求的时候 需要去配置文件中注释掉一行代码 否则会报403
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # 一些安全设置，比如XSS脚本过滤、ssl重定向
    'django.contrib.sessions.middleware.SessionMiddleware',  # 会在数据库中生成一个django_session的表
    'django.middleware.common.CommonMiddleware',  # 1.给路径加上反斜杠  2.配置中定义会阻栏的一些请求反爬虫useragent的监控 比如baidu.com会自动的处理成www.baidu.com
    # 'django.middleware.csrf.CsrfViewMiddleware',   # 跨域请求伪造中间件。加入这个中间件，在提交表单的时候会必须加入csrf_token，cookie中也会生成一个名叫csrftoken的值，也会在header中加入一个HTTP_X_CSRFTOKEN的值来防止CSRF攻击。
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # 向每个接收到的HttpRequest对象添加user属性，表示当前登录的用户
    'django.contrib.messages.middleware.MessageMiddleware',   # 消息中间件。展示一些后台信息给前端页面。如果需要用到消息，还需要在INSTALLED_APPS中添加django.contrib.message才能有效。如果不需要，可以把这两个都删除。
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # 防止通过浏览器页面跨Frame出现clickjacking（欺骗点击）攻击出现
]

*********************************************************************
request.method  # 返回请求方式并且是 全大写 的 字符串 形式<class 'str'>
request.POST    # 获取用户post请求提交的普通数据不包含文件
    request.POST.get()      # 只获取列表最后一个元素
    request.POST.getlist()  # 直接将列表取出
request.GET    # 获取用户get请求提交的(问号后面携带的参数)普通数据  
    request.GET.get()      # 只获取列表最后一个元素
    request.GET.getlist()  # 直接将列表取出
# get 返回网页 post 返回数据 
# get请求携带的数据是有大小限制的 大概只有4kb左右
# post请求没有大小限制
def login(request):
    if request == 'POST':
        # 获取用户提交的post请求数据（不包括文件）
        # <QueryDict: {'username': ['jqm'], 'password': ['123']}>
        username = request.POST.getlist('username') 
        return HttpResponse('宝贝 收到')
    return render(request, 'login.html')
    
////////////////////////'request的其他方法'//////////////////////////////
/ / /     request.id_ajax()        # 判断该请求是否是ajax请求          
/ / /     request.body             # 原生的浏览器发过来的二进制数据
/ / /     request.path             # 获取完整的url
/ / /     request.get_full_path()  # 获取完整的url及问号后面的参数
///////////////////////////////////////////////////////////////////////
```

## Django链接数据库(MySQL)

```python
# 默认用的是sqlite3
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
# django链接MySQL
1.第一步配置文件中的配置
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'day60',
        'USER': 'root',
        'PASSWORD': 'jqmkfc039988',
        'HOST': '127.0.0.1',
        'PORT': 3306,
        'CHARSET': 'utf8'
    }
}
2.代码声明
    django默认用的是mysqldb模块链接MySQL
    但是该模块的兼容性不好 需要手动改为用pymysql链接
    # 在项目名下的 init.py 或者任意的应用名下的init文件中书写以下代码即可
    import pymysql
    pymysql.install_as_MySQLdb()
```

### Django ORM

```python
ORM 对象关系映射
作用:能够让一个不用sql语句的小白也能够通过python面向对象的代码简单快捷的操作数据库
不足之处:封装程度太高有时候sql语句的效率偏低需要你自己写sQL语句
    类    --->  表
    对象  --->  记录
对象属性  --->  记录某个字段对应的值
***************************************************************
第一步: 在models.py下书写
# verbose_name='对字段的一个解释' 都可以加
class User(models.Model):
    # id int primary_key auto_increment
    # 由于一张表中必须要有一个主键字段并且一般情况下都叫id字段
    # 所以orm当你不定义主键字段的时候orm会自动帮你创建一个名为id主键字段
    # #也就意味着后续我们在创建模型表的时候如果主键字段名没有额外的叫法那么主键字段可以省略不写
    id = models.AutoField(primary_key=True)
    # username varchar(32)  CharField必须指定max_length参数 不指定会报错
    username = models.CharField(max_length=32)
    # password int
    password = models.IntegerField()
    # price 小数 max_digits=8 decimal_places=2 总共8位 小数点后面占2位
    price = models.DecimalField(max_digits=8, decimal_places=2)
    # auto_now_add=True  每一次数据创建出来 这个字段会自动更新  多用于注册时间 上次登录时间
    publish_data = models.DateField(auto_now_add=True)
第二步: 数据库迁移命令
python manage.py makemigrations 将操作记录记录到小本本上(makemigrations文件夹)
python manage.py migrate        将操作真正的同步到数据库中
# 只要你修改了models.py中跟数据库相关的代码 上述两条命令就要重新执行一次
```

### 编辑功能

```python
# 先将数据库中的数据全部展示到前端 然后给每一个数据两个按钮 编辑和删除
    模板语法 
    {% for x in x %} 
        <tr><td>...<a href='/edit_user/?user_id={{ user_obj.id }}'>编辑</a>
                   <a href='/delete_user/?user_id={{ user_obj.id }}'>删除</a>
    {% endfor %}
# 编辑功能
    # 点击编辑按钮朝后端发送编辑数据的请求
    # 问题：如何告诉后端用户想要编辑哪条数据？
        # 1.将编辑按钮所在的那一行数据的主键值发送给后端
        # 2.利用url问号后面携带参数的方式
        def edit_user(request):
            # 获取url问号后面的参数
            edit_id = requrst.GET.get('user_id')
            # 查询当前用户想要编辑的数据id
            edit_obj = models.User.objects.filter(id=edit_id).first()
            if request.method == 'POST':
                username = request.POST.get('username')  # 当前需要拿到的就username一个数据 所以用get
                password = request.POST.get('password')  
                # 去数据库中修改对应的数据内容
                models.User.objects.filter(id=edit_id).update(username=username,password=password)
                # 跳转到数据的展示页面(重定向)
                return redirect('/userlist/')
            # 将数据对象展示到编辑页面上(和注册页面差不多 主要是有input框输入和能提交数据)
            return render(request, 'edit_user.html', locals())     
# 删除功能
# 删除数据内部其实并不是真正的删除我们会给数据添加一个标识字段用来表示当前数据是否被删除了 
# 如果数据被删了仅仅只是将字段修改一个状态 is_delete中的Flase改成True而已
def delete_user(request):
    # 获取用户想要删除的数据id值
    delete_id = request.GET.get('user_id')
    # 去数据库中删除对应的数据内容
    models.User.objects.filter(id=delete_id).delete()
    # 跳转到数据的展示页面(重定向)
    return redirect('/userlist/')   
```

### orm创建表关系

```python
# 在django1.x版本中外键默认就是级联更新删除的 
# 在django2.x版本中外键需要加上 on_delete=models.CASCADE null=True
# 一对多ForeignKey 一般都是在多的一方创建外键 ForeignKey会自动给字段加_id后缀 
publish = models.ForeignKey(to='Publish') # to='关联的表名(类的名)' 
# 多对多ManyToManyField  authors是一个虚拟字段 主要是用来告诉orm xx和xx是多对多关系 让orm自动帮你创建第三张关系表
authors = models.ManyToManyField(to='Author')
# 一对一OneToOneField 建在任意一方都可以 推荐建在查询频率较高的表中 OneToOneField会自动给字段加_id后缀 
author_detail = models.OneToOneField(to='AuthorDetail')
```

### 多对多三种创建方式

```python
# 全自动：利用orm自动帮我们创建第三张关系表
    class Book(models.Model):
        name = models.CharField(max_length=32)
        authors = models.ManyToManyField(to='Author')
        
    class Author(models.Model):
        name = models.CharField(max_length=32)
    ""
    优点：代码不需要你写 非常的方便 还支持orm提供操作第三张关系表的方法
    缺点：第三种关系表的扩展性极差（没有办法额外添加字段）
    ""
# 纯手动
    class Book(models.Model):
        name = models.CharField(max_length=32)
        
    class Author(models.Model):
        name = models.CharField(max_length=32)
        
    class Book2Author(models.Models):
        book_id = models.ForeignKey(to='Book')
        author_id = models.ForeignKey(to='Author')
# 半自动   可以试用orm的正反向查询 但是没法使用add,set,remove,clear这四个方法
    class Book(models.Model):
        name = models.CharField(max_length=32)
        authors = models.ManytoManyField(to='Author', 
                                            through='Book2Author',
                                            through_fields=('book ', 'author ')
                                            )# through_fields参数顺序 当前的表是谁 就把对应的关联字段放在前面
    # 判断的本质是通过第三张表查询对应的表 需要用到哪个字段就把哪个字段放前面
    class Author(models.Model):
        name = models.CharField(max_length=32)
        
    class Book2Author(models.Models):
        book = models.ForeignKey(to='Book')
        author = models.ForeignKey(to='Author')
        
# 总结：你需要掌握的是全自动和半自动 为了拓展性更高 一般都使用半自动 不过只是查询的时候省事了 有需要的话还是全手动吧 
```

### 分页器

```python
"django也有内置的分页器模块 但是功能较少代码繁琐不便于使用 所以我们用自定义的分页器"
'简单分页器推导过程'
    1.queryset对象是可以切片操作的
    2.用户到底要访问哪一页 如何确定？  url?page=1  获取到的数据都是字符串类型 注意类型转换
    3.自己规定展示多少条数据
    4.切片的起始位置和终止位置  # 找出他们四个的规律 
    5.当前数据的总条数 book_queryset.count()
    6.如何确定总共需要多少页才能展示完所有的数据 # 利用python内置函数divmod()  
    7.前端模板语法是没有range功能的  # 前端的代码不一定都要在前端写  也可以在后端写好传过去
    8.针对需要展示的页码需要你自己规划好到底多少个页码 # 一般情况下页码的个数设计都是奇数 （符合中国人对称美） 11个页码  当前页-5,当前页+6
    9.针对页码小于6的情况 你需要做判断处理不能再减 否则出现负数
'当我们需要使用到非django内置的第三方功能或者组件代码的时候 我们一般情况下会创建一个utils文件夹 在该文件夹下内对模块进行功能划分'
'utils可以在每个应用下创建 具体结合实际情况'
# 这里我们是在项目下创建的utils文件夹 然后创建了一个mypage.py放入自定义分页器的python代码  <这个自定义分页器的代码是基于bootstrap的 使用前必须导入bootstrap>
后端：
from utils.mypage import Pagination  # 把代码导入进来
def book_list(request):
    # 查询所有的书籍
    book_queryset = models.Book.objects.all()
    # 传递生成对象（分页器）
    page_obj = Pagination(current_page=request.GET.get('page', 1), all_count=book_queryset.count())  # current_page当前页  all_count总条数
    # 直接对总数据进行切片操作
    page_queryset = book_queryset[page_obj.start:page_obj.end]
    return render(request, 'book_list.html', locals())
前端：
<div align='center'>  # div让分页器居中
    {{ page_obj.page_html|safe }}  # 自定义的分页器使用 最后记得加safe转义
</div>
```

### 附件：自定义分页器的代码

```python
class Pagination(object):
    def __init__(self, current_page, all_count, per_page_num=3, pager_count=3):
        """
        封装分页相关数据
        :param current_page: 当前页
        :param all_count:    数据库中的数据总条数
        :param per_page_num: 每页显示的数据条数
        :param pager_count:  最多显示的页码个数
        """
        try:
            current_page = int(current_page)
        except Exception as e:
            current_page = 1

        if current_page < 1:
            current_page = 1

        self.current_page = current_page

        self.all_count = all_count
        self.per_page_num = per_page_num

        # 总页码
        all_pager, tmp = divmod(all_count, per_page_num)
        if tmp:
            all_pager += 1
        self.all_pager = all_pager

        self.pager_count = pager_count
        self.pager_count_half = int((pager_count - 1) / 2)

    @property
    def start(self):
        return (self.current_page - 1) * self.per_page_num

    @property
    def end(self):
        return self.current_page * self.per_page_num

    def page_html(self):
        # 如果总页码 < 11个：
        if self.all_pager <= self.pager_count:
            pager_start = 1
            pager_end = self.all_pager + 1
        # 总页码  > 11
        else:
            # 当前页如果<=页面上最多显示11/2个页码
            if self.current_page <= self.pager_count_half:
                pager_start = 1
                pager_end = self.pager_count + 1

            # 当前页大于5
            else:
                # 页码翻到最后
                if (self.current_page + self.pager_count_half) > self.all_pager:
                    pager_end = self.all_pager + 1
                    pager_start = self.all_pager - self.pager_count + 1
                else:
                    pager_start = self.current_page - self.pager_count_half
                    pager_end = self.current_page + self.pager_count_half + 1

        page_html_list = []
        # 添加前面的nav和ul标签
        page_html_list.append('''
                    <nav aria-label='Page navigation>'
                    <ul class='pagination'>
                ''')
        first_page = '<li><a href="?page=%s">首页</a></li>' % (1)
        page_html_list.append(first_page)

        if self.current_page <= 1:
            prev_page = '<li class="disabled"><a href="#">上一页</a></li>'
        else:
            prev_page = '<li><a href="?page=%s">上一页</a></li>' % (self.current_page - 1,)

        page_html_list.append(prev_page)

        for i in range(pager_start, pager_end):
            if i == self.current_page:
                temp = '<li class="active"><a href="?page=%s">%s</a></li>' % (i, i,)
            else:
                temp = '<li><a href="?page=%s">%s</a></li>' % (i, i,)
            page_html_list.append(temp)

        if self.current_page >= self.all_pager:
            next_page = '<li class="disabled"><a href="#">下一页</a></li>'
        else:
            next_page = '<li><a href="?page=%s">下一页</a></li>' % (self.current_page + 1,)
        page_html_list.append(next_page)

        last_page = '<li><a href="?page=%s">尾页</a></li>' % (self.all_pager,)
        page_html_list.append(last_page)
        # 尾部添加标签
        page_html_list.append('''
                                           </nav>
                                           </ul>
                                       ''')
        return ''.join(page_html_list)
```

### form组件

```python
************************************************************************************************
////////////////////////////// '校验数据'//////////////////////////////
from django import forms
class MyForm(forms.Form):
    # 字符串类型 最小三位 最大8位
    username = forms.CharField(min_length=3, max_length=8, label='用户名', )  'label属性默认是字段首字母大写的形式 可以自定义参数值'
    # 同上
    password = forms.CharField(min_length=3, max_length=8, error_messages={'min_length': '用户名最少3位',
                         'max_length': '密码最少8位','required': '用户名不能为空'}) # 可用error_messages自定义错误信息 required min_length  max_length
    # email
    email = forms.EmailField(error_messages={'invalid': '邮箱格式不正确'})  # invalid 
form_obj = MyForm({'username': 'jqm', 'password': '123', 'email': '123'})
***********************************************************************************************************************************
print(form_obj.is_valid())   # 判断数据是否合法 只有在数据全部合法的情况下才会返回True
# 通过看form组件源码得知必须先执行is_valid()  clean_data和errors才会有值  
# 源码流程：
# 1.is_valid()
# 2.self.errors
# 3.self.full_clean()
# 4.self._clean_fields()    内部起了一个for循环，先去校验每个字段配置的规则，校验完成，走该字段的局部钩子函数一个一个执行完、校验完
    # if hasattr(self, 'clean_%s' % name):
    #     value = getattr(self, 'clean_%s' % name)()
    #     self.cleaned_data[name] = value
#   self._clean_form()      内部会走全局钩子(self.clean())--->self就会有clean_data和errors
print(form_obj.cleaned_data)  # 查看所有校验通过的数据 字典
print(form_obj.errors)       # 查看所有不符合校验和原因  字典
***********************************************************************************************************************************
'校验数据的时候 默认情况下数据可以多传但是绝不能少传'
////////////////////////////// '渲染标签'//////////////////////////////
# form组件只会帮你渲染获取用户输入的标签 input select radio checkbox 不会帮你渲染提交按钮的
def index(request):
    # 生成一个空对象
    form_obj = MyForm()
    # 传到前端去
    return render(request, 'index.html', locals())
# 前端用空对象做操作 
# 第一种方式（代码书写极少，但是封装程度太高 拓展性太差 一般只在本地测试中使用 ）
{{ form_obj.as_p }}  、  {{ form_obj.as_ul }}  、 {{ form_obj.as_table }}
# 第二种方式（可拓展性强 但是需要书写的代码太多 一般情况不用）
<p>{{ form_obj.username.label }}:{{ form_obj.username }}</P>
<p>{{ form_obj.password.label }}:{{ form_obj.password }}</P>
<p>{{ form_obj.email.label }}:{{ form_obj.email }}</P>
'第三种方式（推荐使用 代码书写简单 拓展性也高）'
{% for form in form_obj %}
    <p>{{ form.label }}:{{ form }}</p> 
{% endfor %}
////////////////////////////// '展示错误信息'//////////////////////////////
# 浏览器会帮你自动校验 但是前端的校验弱不禁风 可以通过form表单添加novalidate取消浏览器校验
/////前端/////
<form action="" method="post" novalidate>
    {% for form in form_obj %}
        <p>{{ form.label }}:{{ form }}</p>
        <span>{{ form.errors.0 }}</span>
    {% endfor %}
</form>
/////后端/////
from django import forms
class MyForm(forms.Form):
    # 字符串类型 最小三位 最大8位
    username = forms.CharField(min_length=3, max_length=8, label='用户名', )  'label属性默认是字段首字母大写的形式 可以自定义参数值'
    # 同上
    password = forms.CharField(min_length=3, max_length=8, error_messages={'min_length': '用户名最少3位',
                         'max_length': '密码最少8位','required': '用户名不能为空'}) # 可用error_messages自定义错误信息 required min_length  max_length
    # email
    email = forms.EmailField(error_messages={'invalid': '邮箱格式不正确', 'required': '邮箱不能为空'})  # invalid 
def index(request):
    form_obj = MyForm()
        if request.method = 'POST':
        # 校验数据需要字典 但是刚好request.POST就是字典
            form_obj = MyForm(request.POST)  # 这里post请求的form_obj对象变量名和上面get请求的对象变量名必须一样
        # 判断数据是否合法
            if form_obj.is_valid():
                ...
            else
                ...
            return render(request, 'index.html', locals())
////////////////////////////// '钩子函数(HOOK)'//////////////////////////////
在特定的节点自动触发完成相应操作   钩子函数在forms组件中就类似于第二道关卡 能够让我们自定义校验规则
在forms组件中有两种钩子函数 
    局部钩子
        当你需要给某个字段增加校验规则的时候可以使用
    全局钩子
        当你需要给多个字段增加校验规则的时候可以使用
# 实际案例
1.校验用户名中不能含有666    # 只是校验username字段 局部钩子
2.校验密码和确认密码不一致    # 要校验多个 用全局
from django import forms
class MyForm(forms.Form):
    username = forms.CharField(min_length=3, max_length=8, error_messages={'min_length': '用户名最少3位',
                         'max_length': '用户名最少8位','required': '用户名不能为空'})) 
    password = forms.CharField(min_length=3, max_length=8, error_messages={'min_length': '密码最少3位',
                         'max_length': '密码最少8位','required': '密码不能为空'}) 
    confirm_password = forms.CharField(min_length=3, max_length=8, error_messages={'min_length': '确认密码最少3位',
                         'max_length': '确认密码最少8位','required': '确认密码不能为空'})
    # email
    email = forms.EmailField(error_messages={'invalid': '邮箱格式不正确', 'required': '邮箱不能为空'})  
# 校验用户名中不能含有666 局部钩子
    def clean_username(self):  # clean_会自动找到字段生成名字  只有通过了上面的校验才会执行这个
        # 获取用户名
        username = self.cleaned_data.get('username')
        if '666' in username:
            # 提示前端展示错误信息
            self.add_error('username', '光喊666是不行的')
        # 将钩子函数拿出来了 要记得放回去
        return username
# 校验密码和确认密码不一致  全局钩子
    def clean(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data.get('confirm_password')
        if not confirm_password == password:
            self.add_error('confirm_password', '两次密码不一致')
        # 将钩子函数放回去 因为是全局的 所以把cleaned_data放回去
            return self.cleaned_data
```

### form组件其他参数及补充知识点

```python
label  # 是自定义字段名
error_messages   # 自定义报错信息
initial   # 默认值
required  # 控制字段是否必填
widget=forms.widgets.TextInput(attrs={'class': 'form-control xx xx'})  # widget=forms.widgets.TextInput控制type类型 attrs控制属性 多个样式直接空格

from django.core.validators import RegexValidator
validators=[RegexValidator(r'^[0-9]+$', '请输入数字'), RegexValidator(r'^159[0-9]+$', '数字必须以159开头')]   # 支持正则校验
```

### 其他类型渲染

```python
class LoginForm(forms.Form):
    ...
    # radioSelect  单radio值为字符串
    gender = forms.fields.ChoiceField(
        choices=((1, "男"), (2, "女"), (3, "保密")),
        label="性别",
        initial=3,
        widget=forms.widgets.RadioSelect()
    )
    # 单选Select
    hobby = forms.ChoiceField(
        choices=((1, "篮球"), (2, "足球"), (3, "双色球"), ),
        label="爱好",
        initial=3,
        widget=forms.widgets.Select()
    )
    # 多选Select
     hobby2 = forms.MultipleChoiceField(
        choices=((1, "篮球"), (2, "足球"), (3, "双色球"), ),
        label="爱好",
        initial=[1, 3],
        widget=forms.widgets.SelectMultiple()
    # 单选checkbox
     keep = forms.ChoiceField(
        label="是否记住密码",
        initial="checked",
        widget=forms.widgets.CheckboxInput()
    )
    # 多选checkbox
    hobby2 = forms.MultipleChoiceField(
        choices=((1, "篮球"), (2, "足球"), (3, "双色球"),),
        label="爱好",
        initial=[1, 3],
        widget=forms.widgets.CheckboxSelectMultiple()
    ) 
```

## cookie和session

### cookie

```python
cookie就是保存在客户端浏览器上的信息 表现形式一般都是k:v键值对
django操作cookie 需要借助HttpResponse对象
# 设置cookie
    obj.set_cookie(key,value)
# 加盐设置
    obj.set_signed_cookie(key,value,salt='盐')
# 获取cookie
    request.COOKIES.get(key)
# 加盐获取
    request.get_signed_cookie(key,salt='盐')
# 设置cookie的时候可以添加一个超时时间
    obj.set_cookie('username', '456', max_age=5, expires=5)    # 都是以秒为单位 expires是针对IE浏览器
# 主动删除cookie （注销功能）
    obj.delete_cookie('username')
```

### session

```python
session就是保存在服务端上的信息，也可以有很多地方储存 表 文件 缓存 其他...  表现形式一般都是k:v键值对（可以有多个） 需要基于cookie才能工作
给客户端返回的是一个随机的字符串    sessionid:随机字符串
在默认情况下session是需要djangom默认的一张diango_session表  数据迁移命令后会自动生成  django默认session的过期时间是14天  

# 设置过期时间
request.session.set_expiry() # 括号内可以放  整数(秒为单位) 日期对象（datetime/timedelta） 不写就是默认的14天
# 清除session
    request.session.delete()  
    request.session.flush()  # 清空浏览器和服务端的  推荐使用这个  
django_session表中的数据条数是取决于浏览器的 同一个计算机上（ip地址）同一个浏览器只会有一条数据生效 
(当session过期的时候可能会出现多条数据对应一个浏览器 但是该现象不会持续很久 内部会自动识别过期的数据清除 也可以通过代码清除)
# 设置session
request.session['key'] = value
'内部发生了什么事情?'
1.django内部会自动帮你生成一个随机字符串
2.django内部自动将随机字符串和对应的数据存储到django_session表中
    2.1先在内存中操作数据的缓存 
    2.2在响应结果django中间件的时候才真正的操作数据库
3.将产生的随机字符串返回给客户端浏览器保存
# 获取session
request.session.get('key')
'内部发生了什么事情?'
1.自动从浏览器请求中获取sessionid对应的随机字符串
2.拿着该随机字符串去django_session表中查找对应数据
3.如果比对上了 则将对应的数据取出并以字典的形式封装到request.session中 如果比对不上 则request.session.get() 返回的是None
```

### CBV添加装饰器的三种方式

```python
from django.utils.decorators import method_decorator
@method_decorator(login_auth_cookie, name='get')  # 方式2 可以添加多个针对不同的方法加不同的装饰器
@method_decorator(login_auth_cookie, name='post')
class Mylogin():
    @method_decorator(login_auth_cookie)  # 方式3 它会直接作用于当前类中所有的方法
    def dispatch(self, request, *args, **kwargs):
        pass
    @method_decorator(login_auth_cookie)  # 方式1 指名道姓 装哪里生效哪里
    def get(self, request):
        pass
    def post(self, request):
        pass
```

## Django中间件

```python
"""
django中间件是django的保安 （有点类似安检，来的时候摸一摸 不过走的时候也要摸一摸）
1.请求来的时候需要先经过中间件才能到达真正的的django后端     顺序是从上到下
2.响应走的时候也需要经过中间件才能发出去                    顺序是从下到上
django中间件默认有七个 同时支持程序员自定义中间件并且暴露给程序员五个可以自定义的方法
django中间件能做的事情 
    只要是涉及到项目全局的功能，你就要想到中间件 
    全局身份校验 全局访问频率校验 全局权限校验 ...
//////////////////////////////'必须掌握'/////////////////////////////
'process_request'
    1.请求来的时候需要经过每一个中间件里面的process_request方法 结果的顺序是按照配置文件中注册的中间件的顺序从上往下依次执行
    2.如果中间件里面没有自定义的方法，那么直接跳过执行下一个中间件
    3.如果该方法返回了HttpResponse对象，那么请求将不再继续往后执行 而是直接原路返回（校验失败不允许访问...） 
    process_request方法就是用来做全局相关的所有限制功能  （比如没登录 黑名单 ...）
'process_response'
    1.响应走的时候需要经过每一个中间件里面的process_response方法 该方法有两个额外的参数request和response
    2.该方法必须返回一个HttpResponse对象 默认返回的就是response对象 
        也可以返回自己的 返回后就会不管后面的视图函数返回的是什么 都会变成这里设置返回的  （狸猫换太子）
    3.顺序是按照配置文件中的注册了的中间件从下往上依次经过 如果你没有定义的话 直接跳过执行下一个
******'如果在第一个process_request方法就已经返回了HttpReponse对象，那么响应走的时候就会直接走同级别的process_response返回'******
flask框架也有一个中间件但是它的规律是只要返回数据了就必须经过所有中间件里面类似process_response的方法
--------------------------------------------------------------------------------
2.了解即可 
    process_view
        路由匹配成功之后视图函数之前，会自动执行中间件里面的该方法 顺序是按照配置文件中的注册了的中间件从上往下的顺序依次执行
    process_template_reponse  参数 request,response
        返回的是HttpResonse对象有render属性的时候才会触发 顺序是按照配置文件中注册了的中间件从下往下往上的顺序依次执行
    process_exception  参数 request,exception
        当视图函数出现异常的情况下触发 顺序是按照配置文件中注册了的中间件从下往下往上的顺序依次执行
"""
```

### 如何自定义中间件

```python
"""
1.在项目名或者应用名下创建一个任意名称的文件夹
2.在该文件内创建一个任意名称的py文件
3.在该py文件内需要书写类 （这个类必须继承MiddlewareMixin）在类里面定义五个方法即可 
4.需要将类的路径以字符串的形式注册到配置文件中才能生效
MIDDLEWARE = ['django.midd...']
"""
```

## csrf跨站请求伪造

```javascript
<!--
钓鱼网站： 搭建一个跟正规网站一模一样的界面 用户不小心进入钓鱼网站 给某人账户打钱 钱确实是提交给了银行的系统 但是打钱的账户变成了一个莫名其妙的账户
内部本质： 在钓鱼网站的页面 针对对方账户 只给用户提供一个没有name属性的普通input框 然后我们在内部隐藏一个已经写好name和valuee的input框
如何规避上述问题：csrf请求伪造校验 
    我们网站在给用户返回一个具有提交数据功能页面的时候回给这页面加一个唯一标识 
    当这个页面朝后端发送post请求的时候 我们后端会先校验唯一标识 如果唯一标识校验不对 则会直接拒绝 （403 forbbiden）
form表单如何符合校验：
    在form页面添加一个 {% csrf_token %}
-->
ajax如何符合校验：
{% load static %}  // 第三种方式
<script src="{% static 'js/mysetup.js' %}"></script>  // 自己创建一个js文件把js代码放进去 放在static文件夹的文件夹下 比如js文件夹下的mysetup.js
<script>
    $('#d1').click(function(){
    $.ajax({
        url:'',
        type:'post',
        // 第一种 利用标签查找直接获取页面上的随机字符串
        data:{'username':'jqm','csrfmiddlewaretoken':$('[name=csrfmiddlewaretoken]').val()},
        // 第二种 利用模板语法
        data:{'username':'jqm','csrfmiddlewaretoken':'{{ csrf_token }}'},
        // 第三种 通用方式 直接拷贝js代码并引入js文件到自己的html页面上
        data:{'username':'jqm'}
        success:function(){
            ...
        }
    })
})</script>
```

### js代码

```javascript
// 官方文档：https://docs.djangoproject.com/en/1.11/ref/csrf/
function getCookie(name) { 
    var cookieValue = null; 
    if (document.cookie && document.cookie != '') { 
        var cookies = document.cookie.split(';'); 
        for (var i = 0; i < cookies.length; i++) { 
            var cookie = jQuery.trim(cookies[i]); 
            // Does this cookie string begin with the name we want? 
            if (cookie.substring(0, name.length + 1) == (name + '=')) { 
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); 
                break; 
            } 
        } 
    } 
    return cookieValue; 
} 
var csrftoken = getCookie('csrftoken'); 
   
function csrfSafeMethod(method) { 
    // these HTTP methods do not require CSRF protection 
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)); 
} 
$.ajaxSetup({ 
    crossDomain: false, // obviates need for sameOrigin test 
    beforeSend: function(xhr, settings) { 
        if (!csrfSafeMethod(settings.type)) { 
            xhr.setRequestHeader("X-CSRFToken", csrftoken); 
        } 
    } 
});
```

## csrf相关装饰器

```python
from django.views.decorators.csrf import csrf_protect, csrf_exempt
"csrf_protect 需要校验 csrf_exempt 忽视校验 "
'FBV
@csrf_protect 
def ooo(request):
    ...
@csrf_exempt 
def ooo(request):  # 也有的人会在urls.py里面直接 url('ooo/', csrf_exempt(views.ooo))
"""
CBV 
针对 csrf_protect  三种方式都可以
针对 csrf_exempt   只有给dispatch才有效 可以用第三种变形成第一种的形式
"""
@method_decorator(csrf_exempt, name='dispatch')
class MyCsrfToken(View):
    def dispatch(self, request, *args, **kwaras):
        return super(MyCsrfToken, self).dispatch(request, *args, **kwagrs)
    def get(self, request):
        ...
    def post(self, request):
        ...
```

## Auth模块

### Auth模块功能

```python
'django在启动之后就可以直接admin路由，需要输入用户名和密码，数据参考的就是auth_user表，并且还必须是管理员用户才能进入'
python manage.py createsuperuser   # 创建超级用户（管理员）
///////////////////'auth提供的方法'//////////////////////
from django.contrib import auth
# 自动获取表并比对密码（登陆功能）  1.自动查找auth_user标签  2.自动给密码加密再比对 PS：必须同时传入用户名和密码 不能只传一个
user_obj = auth.authenticate(request, username=username, password=password)    # 有返回值 返回的是用户对象 如果密码比对不上 返回None
print(user_obj .username) # 当前登陆的用户的用户名 
# 保存用户状态  执行该方法后就可以在任何地方通过request.user获取到当前登陆的对象
auth.login(request, user_obj )  # 类似于session的设置  request.session[key] = user_obj 
# 删除用户状态 （注销功能）
auth.logout(request)  
# 判断用户是否登陆
request.user.is_authenticated()
# 创建普通用户 （注册功能）
from django.contrib.auth.models import User
User.object.create_user(username=username, password=password)
# 创建超级用户
python manage.py createsuperuser

/////////////////'auth提供的登陆认证装饰器'////////////////
from django.contrib.auth.decorators import login_required
@login_required(login_url='/login/')  # 局部配置 用户没有登陆跳转到login_url指定的网址
def set_password(request):
    if request.method = 'post':
        ...
        if new_password == confirm_password:
            # 校验老密码是否正确  check_password
            is_right = request.user.check_password(old_password)  # 自动加密比对 返回布尔值
            if is_right:
                # 修改密码
                request.user.set_password(new_password)
                # 操作数据库修改数据
                request.user.save()
# 全局配置 在settings里面配置   优先级 局部 > 全局
LOGIN_URL = '/login/'
```

### Auth模块扩展表字段

```python
from django.contrib.auth.models import AbstractUser
class UserInfo(AbstractUser):
'如果继承AbstractUser,在执行数据库迁移命令的时候就不会创建auth_user表了,会直接创建当前这个类为名的表,好处是可以直接点击自己创建的表完成操作拓展'
'前提:设计之初就应该设计好这个类  auth_user表必须是没有被创建过的 继承的类中不能有跟AbstractUser里面一样的字段名'
******'最后还需要在配置文件中声明一下告诉django你要用UserInfo(自己创建的类)替代auth_user'  # AUTH_USER_MODEL = '应用名.当前类名'
'替换后auth模块的功能还是正常使用 参考的表由原来的auth_user变成UserInfo'
    phone = models.BigIntegerField()
```

