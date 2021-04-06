---

id: pythonBackend-django03

title: Django Rest Framework
---

## web的两种开发模式
  
- 前后端分离: 只专注于写后端接口，返回json，xml格式数据
  - 业务服务器和静态服务器是分开的
  - ![image-20201107194712199](https://gitee.com/JqM1n/biog-image/raw/master/20201107194712.png)

- 前后端不分离: 前后端混合开发   返回的是html页面 需要写模板
  - 页面和数据都是由后端处理的
  - ![image-20201107194732895](https://gitee.com/JqM1n/biog-image/raw/master/20201107194733.png)

## Restful规范

```python
"""
REST全称是Representational State Transfer，中文意思是表述（编者注:通常译为表征性状态转移)。它首次出现在2000年Roy Fielding的博士论文中。
RESTfu1是一种定义web API接口的设计风格，尤其适用于前后端分离的应用模式中。
这种风格的理念认为后端开发任务就是提供数据的，对外提供的是数据资源的访问接口，所以在定义接口时，客户端访问的URL路径就表示这种要操作的数据资源。
"""
10条规范
1 数据的安全保障:ur1链接一般都采用https协议进行传输注:采用https协议，可以提高数据交互过程中的安全性
2 接口特征表现，一看就知道是个api接口
    - 用api关键字标识接口ur1:
        - [https://api.baidu.com](https://api.baidu.com/)
        - https://www.baidu.com/api
    注:看到api字眼，就代表该请求ur1链接是完成前后台数据交互的
    - 路飞的接口:
        https://api.luffycity.com/api/v1/course/free/
3 多数据版本共存
    - 在url链接中标识数据版本
        - https://api .baidu.com/v1
        - https://api.baidu.com/v2
    注:ur1链接中的v1、v2就是不同数据版本的体现（只有在一种数据资源有多版本情况下）
4 数据即是资源，均使用名词（可复数）
    – 接口一般都是完成前后台数据的交互，交互的数据我们称之为资源
        - https://api.baidu.com/users
        - https://api.baidu.com/books
        - https://api.baidu.com/book
    注:一般提倡用资源的复数形式，在url链接中奖励不要出现操作资源的动词，错误示范:
     https://api.baidu.com/delete-user
    – 特殊的接口可以出现动词，因为这些接口一般没有一个明确的资源，或是动词就是接口的核心含义
        - https ://api.baidu.com/place/search
        - https://api.baidu.com/login
5 资源操作由请求方式决定（method）
    – 操作资源一般都会涉及到增删改查，我们提供请求方式来标识增删改查动作
        - https://api.baidu.com/books       - get请求:获取所有书
        - https://api.baidu.com/books/1     - get请求:获取主键为1的书
        - https://api.baidu.com/books       - post请求:新增一本书书
        - https://api.baidu.com/books/1     - put请求:整体修改主键为1的书
        - https://api.baidu.com/books/1     - patch请求:局部修改主键为1的书
        - https://api.baidu.com/books/1     - delete请求:删除主键为1的书

6 过滤，通过在ur1上传参的形式传递搜索条件
    - https://api.example.com/v1/zoos?limit=10              :指定返回记录的数量
    - https://api.example.com/v1/zoos?offset=10             :指定返回记录的开始位置
    - https://api.example.com/v1/zoos?page=2&per_page=100   :指定第几页，以及每页的记录数
    - https://api.example.com/v1/zoos?sortby=namedorder=asc :指定返回结果按照哪个属性排序，以及排序顺序
    - https://api.example.com/v1/zoos?animal_type_id=1      :指定筛选条件

7 响应状态码
    7.1正常响应
        – 响应状态码2×x
            - 200:常规请求
            - 201:创建成功
    7.2重定向响应
        -响应状态码3xx
            - 301:永久重定向
            - 302:暂时重定向
    7.3客户端异常
        -响应状态码4x×
            - 403:请求无权限
            - 404:请求路径不存在
            - 405:请求方法不存在
    7.4服务器异常
        -响应状态码5×x
            - 500:服务器异常
    
8 错误处理，应返回错误信息，error当做key
        {
        error:“无权限操作
        }
9 返回结果，针对不同操作，服务器向用户返回的结果应该符合以下规范 
    GET     /collection              :返回资源对象的列表(数组
    GET     /collection/resource     :返回单个资源对象
    POST    /collection              :返回新生成的资源对象
    PUT     /collection/resource     :返回完整的资源对象
    PATCH   /collection/resource     :返回完整的资源对象 
    DELETE  /collection/resource     :返回一个空文档

10 需要ur1请求的资源需要访问资源的请求链接
'Hypermedia API，RESTful API最好做到Hypermedia，即返回结果中提供链接，连向其他API方法，使得用户不查文档，也知道下一步应该做什么
              {
                    "name":"肯德基(罗餐厅)"，
                     "img": "https://image.baidu.com/kfc/001.png"
              }
```

## 安装和简单使用

```python
'drf就是基于django的一个框架一个组件，可以帮我们快速开发遵循Restful规范接口的一个程序，本质上是django的一个app，给我们提供的一大堆的视图
安装: pip install djangorestframeword
配置: settings.py中注册子应用：INSTALLED_APPS = [ 'rest_framework',]
```

## APIviews类的执行过程分析

```python
# APIviews源码分析
from rest_frameword.views import APIview
# urls.py
path('booksapiview/', views.BooksAPIview.as_view())  # 参考CBV的源码
# APIview的as_view方法（类的绑定方法）
    def as_view(cls, **initkwargs):
        view = suppr().as_view(**initkwargs)  # 调用父类(View)的as_view(**initkwargs)
        view.cls = cls
        view.initkwargs = initkwargs
        # 只要继承了APIview 以后所有的请求都没有csrf认证了
        return csrf_exempt(view)
# APIview的dispatch方法
    def dispatch(self, request, *args, **kwagrs):
        self.args = args
        self.kwargs = kwargs
        # 重新包装一个request对象 以后再用的request对象就是新的request对象了
        request = self.initialize_request(request, *args, **kwagrs)
        self.request = request
        self.headers = self.default_response_headers  
        try:
            # 三大认证模块
            self.initial(request, *args, **kwagrs)
            # Get the appropriate handler method
            if request.method.lower() in self.http_method_names:
                 hand1er = getattr(self，request.method.lower(),self.http_method_not_a1lowed)
            else:
                handler = self.http_method_not_a1lowed
            # 响应模块
            response = handler(request， iargs，六章kwar gs)
             # 异常模块
            except Exception as exc:
                response = self.handle_exception(exc)
            # 渲染模块
            self.response = self.finalize_response(request, response, *args, **kwargs)
            return self.response
# APIview的initial方法
    def initial(self, request, *args, **kwargs)
        # Determine the API version, if versioning is in use.
        # drf版本的处理
        version, scheme = self.determine_version(request, *args, **kwargs)
        request.version, request.versioning_scheme = version, scheme
        self.perform_authentication(request)
        # 认证组件:校验用户一游客、合法用户、非法用户
        # 游客:代表校验通过，直接进入下一步校验(权限校验)
        # 合法用户:代表校验通过，将用户存储在request,user中，再进入下一步校验(权限校验)
        # 非法用户:代表校验失败，抛出异常，返回403权限异常结果
        self.check_permissions(request)
        # 权限组件:校验用户权限–必须登录、所有用户、登录读写游客只读、自定义用户角色
        # 认证通过:可以进入下一步校验(频率认证)
        # 认证失败:抛出异常,返回403权限异常结果
        se1f.check_throttles(request)
        # 频率组件:限制视图接口被访问的频率次数–限制的条件(IP、id、唯一键)、频率周期时间(s、 m、h)、频率的次数（3/S)
        # 没有达到限次:正常访问接口
        # 达到限次:限制时间内不能访问,限制时间达到后，可以重新访问
"""请求来了之后一旦匹配到路由上 执行原来的view 里面有dispatch 但是执行的是APIviews的dispatch 
第三行 重新包装了request对象 之后又执行了self.initial 里面有三大认证模块 权限 频率 认证  
然后又回来 里面执行FBV里面的反射 里面还有异常处理模块 最后渲染 如果浏览器访问就显示这样 如果是postman就返回json格式"""
```

## Request对象

```python
from rest_framework.request import Request
# 只要继承了APIView，视图类中的request对象，都是新的，也就是上面那个request的对象了
# 老的request在新的request._request
# 以后使用reqeust对象，就像使用之前的request是一模一样（因为重写了_getattr__方法）
    def__getattr__(self，attr):
        try:
            return getattr(self._request，attr) # 通过反射，取原生的request对象，取出属性或方法 
        except AttributeError :
            return self.__getattribute__(attr)
# request.data感觉是个数据属性，其实是个方法，@property，修饰了
    request.dat它是一个字典，post请求不管使用什么编码，传过来的数据，都在这里
# get请求传过来数据，从哪取?
    @property 
    def query_params(self):
        """
        More semantically correct name for request.GET.
        """
        return self._request.GET
# 视图类中
    print (request.query_params）# get请求，地址中的参数
# 原来在
    print(request.GET)
"""
request.data 返回请求主题的解析内容。这跟标准的 request.POST 和 request.FILES 类似，并且还具有以下特点：
        · 包括所有解析的内容，文件（file） 和 非文件（non-file inputs）。
        · 支持解析 POST 以外的 HTTP method ， 比如 PUT， PATCH。
        · 更加灵活，不仅仅支持表单数据，传入同样的 JSON 数据一样可以正确解析，并且不用做额外的处理（意思是前端不管提交的是表单数据，还是 JSON 数据，.data 都能够正确解析）
request.GET 改写成request.query_params 为了代码更加清晰可读，推荐使用 request.query_params ，而不是 Django 中的 request.GET，
    这样那够让你的代码更加明显的体现出 ----- 任何 HTTP method 类型都可能包含查询参数（query parameters），而不仅仅只是 'GET' 请求。
    """
```

## 序列化器的使用

```python
# 定义和作用
    序列化是将程序语言转换为JSON/XML; 反序列化是将JSON/XML转换为程序语言;
    对应到Django中,序列化即把模型对象转换为字典形式, 在返回给前端,主要用于输出, 反序列化是将接受前端的字典类型数据,通过验证再转换为模型对象.
# 序列化器的作用：
    进行数据的校验
    对数据对象进行转换
# 使用 
1.创建一个py文件（这里举例叫ser.py），里面写一个序列化的类，继承serializers
from rest_frameword import serializers
class xxxSerializer(serializers.Serializer):
2.在类中书写要序列化的类，想序列化哪个字段，就在类中写哪个字段
    id = serializers.CharField()
    username = serializers.CharField(min_length=10,max_length=32)  # 括号里参数的是普通校验 
    
    # 要修改就要使用save 使用save 必须重新书写update 
    def update(self, instance, validated_data): # instance就是对象 validated_data是校验后的数据
        instance.username = validated_data.get('username')
        instance.save()  # django orm提供的方法
        
    # 要新增数据 就要重写create
    def create(self, validated_data):
        instance = Book.objects.create(**validated_data)
        return instance 
```

| 参数/描述 |  |  |  |  |  |
| :----:| :----: | :----:| :----:| :----:| :----:|
| min_lenght | max_length | allow_blank | trim_whitespace | min_value | max_value |
|  最小长度  |  最大长度  | 是否允许为空 | 是否截断空白字符 |  最小值   |  最大值   |

```python
3.在视图类views.py中使用，导入-->实例化的到序列化的对象，把要序列化的对象传入
'这里举例的是查看单个和修改 所以需要主键值 所以urls.py中path加正则匹配数字' eg: re_path('books/(?P<pk>\d+)', views.BookView.as_view())
from app01.ser import BookSerializer     # 导入写好的序列化类
from rest_framework.views import APIView   # 
from rest_framework.response import Response  # drf提供的响应对象
from app01.models import Book  # 传入模型层的类
class BookView(APIView):
    def get(self, request, pk):
        # 获取对象
        book = Book.objects.filter(pk=pk).first()
        # 得到一个序列化对象
        book_ser = BookSerializer(book)
        return Response(book_ser.data)  # book_ser.data是一个字典
# 使用Response要在settings.py文件的INSTALLED_APPS中添加'rest_framework'
# drf提供的Response不仅可以转换成json 还可以判断如果是浏览器的话就返回界面好看点的json，如果是postman的话 就直接返回json 
# 也可以用之前的JsonResponse 但是JsonResponse对象汉字识别还需要加json_dumps_params={ensure_ascii:False} 而且浏览器没有界面 只有json数据
```

### 局部校验和全局校验

```python
ser.py
class xxxSerializer(serializers.Serializer):
    # 局部钩子
    def validate_name(self, data): # validate_字段名 接收一个data参数  这个参数是字段的值 字符串类型
        if ...:
            ...
        else:
            ...
    # 全局钩子
    def validate(self, validate_data):  # validate_data校验后的数据
        if ...:
            ...
        else:
            ...
```

### 修改和删除

```python
class BookView(APIView):
    def put(self, request, pk):
        response_msg = {'status':100, 'msg':''}
        # 找到这个对象
        book = Book.object.filter(pk=pk).first()
        # 得到一个序列化的对象
        book_ser = BookSerializer(instance=book, data=request.data)
        # 数据验证
        if book_ser.is_valid():  # 返回Ture表示通过
            book_ser.save()  # 使用save 必须重新书写update 
            response_msg['msg'] = '修改成功'
            response_msg['data'] = book_ser.data
        else:
            response_msg['status'] = 101
            response_msg['msg'] = '校验失败'
            response_msg['data'] = book_ser.errors
        return Response(response_msg)
        
    def delete(self, request, pk):
        Book.object.filter(pk=pk).delete()
        return Response({'status':100, 'msg':'删除成功'})
```

### read_only和write_only

```python
read_only   表明该字段仅用于序列化输出，默认False ,如果设置成True，postman中可以看到该字段，修改时，不需要传该字段
write_only  表明该字段仅用于反序列化输入，默认False，,如果设置成True，postman中看不到该字段，修改时，该字段需要传

# 以下了解
required         表明该字段在反序列化时必须输入，默认True
default          反序列化时使用的默认值
allow_null       表明该字段是否允许传入None，默认False
validators       该字段使用的验证器
error_messages   包含错误编号与错误信息的字典
```

### 查询所有和新增

```python
'查询和新增是不需要主键id的 所以urls.py中要重新定义一个'  eg：path('books/', views.BooksView.as_view())
class BooksView(APIView):
    # 查询所有
    def get(self, request):
        response_msg = {'status':100, 'msg':''}
        books = Book.objects.all()
        book_ser = BookSerializer(books, many=True)  # 序列化多条需要加many=True
        response_msg['data'] = book_ser.data
        return Response(response_msg)
    # 新增  一定要记得重写create方法
    def post(self, request):
        response_msg = {'status':100, 'msg':''}
        # 修改才有instance，新增的没有instance，只有data
        book_ser = BookSerializer(data=request.data)
        # 校验字段
        if book_ser.is_valid():
            book_ser.save()
            response_msg['msg'] = '增加成功'
            response_msg['data'] = book_ser.data
        else:
            response_msg['status'] = 101
            response_msg['msg'] = '数据校验失败'
            response_msg['data'] = book_ser.errors
        return Response(response_msg)
```

### 模型类序列化器

```python
'''如果我们想要使用序列化器对应的是Django的模型类，DRF为我们提供了ModelSerializer模型类序列化器来帮助我们快速创建一个Serializer类。

ModelSerializer与常规的Serializer相同，但提供了：
    基于模型类自动生成一系列字段
    基于模型类自动为Serializer生成validators，比如unique_together
****包含默认的create()和update()的实现****   不需要重写create和updata方法了
    '''
class BookModelserializer(serializers.Mode1serializer):
class Meta:
    model = Book  # 对应上mode1s.py中的模型
    fields = '__all__'  # 包含所有字段
    # fields = ('username',)  # 只序列化指定的字段
    # exclude = ('username',） # 跟fields不能都写，明确排除掉哪些字段
    extra_kwargs = {
            'username': {'max_length': 16, 'min_length': 4},  # 类似于这种形式username = serializers.charField(max_length=16, min_length=4)
        }
# read_only_fields和write_only_fields都弃用了，可以使用extra_kwargs来变向修改
    extra_kwargs = {
    'username' : { 'write_only' : True} ,
    }
```

### serializers高级用法

```python
# source的使用
'1 可以改字段名字'      xxx = serializers.charField(source='title')  ---> book对象.title
'2 可以.跨表'          publish = serializers.CharField(source='publish.email')   ---> book对象.publish.email
'3 可以.执行方法'       pub_date = serializers.charField(source='test') 比如说这里test是Book表模型中的方法 pub_date显示的就是test方法最后的返回值 ---> book对象.test
# serializerMethodFie1d() 的使用
'它需要有个配套方法，方法名叫get_字段名，返回值就是要显示的东西'
authors=serializers.SerializerMethodField()
def get_authors(self,instance):
     # instance就是book对象
    authors=instance.authors.all()# 取出所有作者
    new_list=[]
    for author in authors:
        new_list.append({'name':author.name, 'age' :author.age})
        return new_list
```

## drf视图家族

```python
# 两个视图基类
APIView-->继承自View
GenericAPIView-->继承自APIView, 做了一些扩展:
    - queryset = None
    - serializer_class = None
```

###  基于APIview写的接口

```python
# views.py
from app01.models import Book
from app01.ser import BookSerializer
from rest_framework.response import Response  
from rest_framework.views import APIView
    
class BookView(APIView):
    def get(self, request):
        book_list = Book.objects.all()
        book_ser = BookSerializer(book_list, many=True)
        return Response(book_ser.data)

    def post(self, request):
        book_ser = BookSerializer(data=request.data)
        if book_ser.is_valid():
            book_ser.save()
            return Response(book_ser.data)
        else:
            return Response({'status': 101, 'msg': '校验失败'})

class BookDetailView(APIView):
    def get(self, request, pk):
        book = Book.objects.all().filter(pk=pk).first()
        book_ser = BookSerializer(book)
        return Response(book_ser.data)

    def put(self, request, pk):
        book = Book.objects.all().filter(pk=pk).first()
        book_ser = BookSerializer(instance=book, data=request.data)
        if book_ser.is_valid():
            book_ser.save()
            return Response(book_ser.data)
        else:
            return Response({'status': 101, 'msg': '校验失败'})

    def delete(self, request, pk):
        Book.objects.filter(pk=pk).delete()
        return Response({'status ': 100, 'msg': '删除成功'})
        
# models.py
from django.db import models

class Book(models.Model):
    name = models.CharField(max_length=32,null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2,null=True)
    publish = models.CharField(max_length=32,null=True)
    
#ser.py
from rest_framework import serializers
from app01.models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
# ur1s.py
# django 1.x
url(r'^books/$', views.BookView.as_view()),
url(r'^books/(?P<pk>\d+)', views.BookDetailView.as_view()),
# django 2.x
path('books/', views.BookView.as_view()),
re_path('books/(?P<pk>\d+)', views.BookDetailView.as_view())
```

### 基于GenericAPIview写的接口

```python
# views.py
from app01.models import Book
from app01.ser import BookSerializer
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView

class Book2View(GenericAPIView):
    # queryset要传的queryset对象，查询所有图书
    # serializer_class 使用哪个序列化类来序列化这堆数据
    queryset = Book.objects    # 加不加.all() 都可以 源码内部会判断
    serializer_class = BookSerializer
    def get(self, request):
        book_list = self.get_queryset()
        book_ser = self.get_serializer(book_list, many=True)
        return Response(book_ser.data)

    def post(self, request):
        book_ser = BookSerializer(data=request.data)
        if book_ser.is_valid():
            book_ser.save()
            return Response(book_ser.data)
        else:
            return Response({'status': 101, 'msg': '校验失败'})

class Book2DetailView(GenericAPIView):
    queryset = Book.objects
    serializer_class = BookSerializer
    def get(self, request, pk):
        book = self.get_object()
        book_ser = self.get_serializer(book)
        return Response(book_ser.data)

    def put(self, request, pk):
        book = self.get_object()
        book_ser = self.get_serializer(instance=book, data=request.data)
        if book_ser.is_valid():
            book_ser.save()
            return Response(book_ser.data)
        else:
            return Response({'status': 101, 'msg': '校验失败'})

    def delete(self, request, pk):
        self.get_object().delete()
        return Response({'status ': 100, 'msg': '删除成功'})

# urls.py
# django 1.x
url(r'^books2/$', views.Book2View.as_view()),
url(r'^books2/(?P<pk>\d+)', views.Book2DetailView.as_view())
# django 2.x
path('books2/', views.Book2View.as_view()),
re_path('books2/(?P<pk>\d+)', views.Book2DetailView.as_view())
```

### 基于GenericAPIview和5个视图扩展类写的接口

```python
from app01.models import Book
from app01.ser import BookSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin, RetrieveModelMixin
# views.py
class Book3View(GenericAPIView, ListModelMixin, CreateModelMixin):
    queryset = Book.objects
    serializer_class = BookSerializer
    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)

class Book3DetailView(GenericAPIView, UpdateModelMixin, DestroyModelMixin, RetrieveModelMixin):
    queryset = Book.objects
    serializer_class = BookSerializer
    def get(self, request, pk):
        return self.retrieve(request, pk)

    def put(self, request, pk):
        return self.update(request, pk)

    def delete(self, request, pk):
        return self.destroy(request, pk)
        
# urls.py
# django 1.x
url(r'^books3/$', views.Book3View.as_view()),
url(r'^books3/(?P<pk>\d+)', views.Book3DetailView.as_view())
# django 2.x
path('books3/', views.Book3View.as_view()),
re_path('books3/(?P<pk>\d+)', views.Book3DetailView.as_view())
```

### GenericAPIview的9个视图子类

```python
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, 
    ListCreateAPIView, RetrieveUpdateAPIView, RetrieveDestroyAPIView, RetrieveUpdateDestroyAPIView
# ListCreateAPIView -->ListAPIView, CreateAPIView           / RetrieveUpdateAPIView -->RetrieveAPIView, UpdateAPIView 
# RetrieveDestroyAPIView -->RetrieveAPIView, UpdateAPIView  / RetrieveUpdateDestroyAPIView -->RetrieveAPIView, UpdateAPIView, DestroyAPIView
class Book4View(ListAPIView, CreateAPIView):  # 获取所有，新增
    queryset = Book.objects
    serializer_class = BookSerializer

class Book4DetailView(RetrieveAPIView, UpdateAPIView, DestroyAPIView):  # 获取单个 修改单个 删除单个
    queryset = Book.objects
    serializer_class = BookSerializer
    
# urls.py
# django 1.x
url(r'^books4/$', views.Book4View.as_view()),
url(r'^books4/(?P<pk>\d+)', views.Book4DetailView.as_view())
# django 2.x
path('books4/', views.Book4View.as_view()),
re_path('books4/(?P<pk>\d+)', views.Book4DetailView.as_view())
```

### (终极版)使用ModelViewSet写5个接口

```python
from rest_framework.viewsets import ModelViewSet
class Book5View(ModelViewSet):  # 5个接口写一起
    queryset = Book.objects
    serializer_class = BookSerializer

# urls.py  ModelViewSet里面的GenericViewSet里面的ViewSetMixin重写了as.view方法
# django 1.x
url(r'^books5/$', views.Book5View.as_view(actions={'get': 'list', 'post': 'create'})), # 当路径匹配上，又是get请求，会执行Book5View类的list方法 post请求 会执行..create方法
url(r'^books5/(?P<pk>\d+)', views.Book5View.as_view(actions={'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
# django 2.x
path('books5/', views.Book5View.as_view(actions={'get': 'list', 'post': 'create'})),
re_path('books5/(?P<pk>\d+)', views.Book5View.as_view(actions={'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
```

## 自动生成路由

```python
# 第一步:导入routers模块
from rest_framework import routers
# 第二步:有两个类,实例化得到对象
# routers.DefaultRouter 生成的路由更多
# routers.simpleRouter   用这个就够了
router = routers.SimpleRouter()
# 第三步:注册
# router.register('前缀'，'继承自Modelviewset视图类'，'别名')
router.register ('books', views.BookviewSet) # 不要加斜杠了
# 第四步 自动生成的路由,加入到原路由中
urlpatterns += router.urls
```

### action的使用

```python
# action干什么用？为了给 继承自ModelViewSet的视图类中 定义的函数 也添加路由
# 使用
class BookViewSet(ModelViewSet):
    queryset =Book.objects.all()
    serializer_class = BookSerializer
    # methods第一个参数，传一个列表，列表中放请求方式，
    # ^books/get_1/$ [name='book-get-1'] 当向这个地址发送get请求，会执行下面的函数
    # detail：布尔类型 如果是True
    #^books/(?P<pk>[^/.]+)/get_1/$ [name='book-get-1']
    @action(methods=['GET','POST'],detail=True)  # method：请求方式，detail：是否带pk
    def get_1(self,request,pk):
        book=self.get_queryset()[:2]  # 从0开始截取一条
        ser=self.get_serializer(book,many=True)
        return Response(ser.data)
```

## 三大认证

### 认证

```python
# 认证的实现
1 写一个类，继承BaseAuthentication，重写authenticate，认证的逻辑写在里面，认证通过，返回两个值，一个值最终给了Requet对象的user，认证失败，抛异常：APIException或者AuthenticationFailed
2 全局使用，局部使用
# 使用
# 写一个认证类 app_auth.py
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from app01.models import UserToken
class MyAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # 认证通过，可以返回None (有多个认证时)，返回两个值 user，auth，源码中可以看到必须返回user，后面的值可以返回token(单独token认证)、auth（多认证）或者None（认证不通过）
        # 如果认证失败，抛出AuthenticationFailed异常
        token=request.GET.get('token')
        if token:
            user_token=UserToken.objects.filter(token=token).first()
            # 认证通过
            if user_token:
                return user_token.user,token
            else:
                raise AuthenticationFailed('认证失败')
        else:
            raise AuthenticationFailed('请求地址中需要携带token')

# 可以有多个认证，从左到右依次执行
# 全局使用，在setting.py中配置
REST_FRAMEWORK={
    "DEFAULT_AUTHENTICATION_CLASSES":["app01.app_auth.MyAuthentication",]
}
    # 局部禁用
    authentication_classes=[]
# 局部使用，在视图类上写
authentication_classes=[MyAuthentication]
'当用户发来请求时，找到认证的所有类并实例化成为对象列表，然后将对象列表封装到新的request对象中，'
 '以后在视图中调用request.user，在内部会循环认证的对象列表，并执行每个对象的authenticate方法，该方法用于认证，它会返回两个值分别赋值给request.user/request.auth'
 '一般情况下，用户对象就在request.user，token就是request.auth'
```

### 自定义权限

```python
# 写一个类，继承BasePermission，重写has_permission，如果权限通过，就返回True，不通过就返回False
from rest_framework.permissions import BasePermission

class UserPermission(BasePermission):
    def  has_permission(self, request, view):
        # 不是超级用户，不能访问
        # 由于认证已经过了，request内就有user对象了，当前登录用户
        user=request.user  # 当前登录用户
        # 如果该字段用了choice，通过get_字段名_display()就能取出choice后面的中文
        print(user.get_user_type_display())
        if user.user_type==1:
            return True
        else:
            return False
         
# 局部使用
class TestView(APIView):
    permission_classes = [app_auth.UserPermission]
# 全局使用
REST_FRAMEWORK={
    "DEFAULT_AUTHENTICATION_CLASSES":["app01.app_auth.MyAuthentication",],
    'DEFAULT_PERMISSION_CLASSES': [
        'app01.app_auth.UserPermission',
    ],
}
# 局部禁用
class TestView(APIView):
    permission_classes = []
```

### 内置频率

```python
'匿名用户，用IP作为用户唯一标记，但如果用户换代理ip，无法做到真正的限制'
'登陆用户，用户名或用户ID做标识'
# 内置的频率限制(限制未登录用户)
# 全局使用  限制未登录用户1分钟访问5次
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '3/m',
    }
}
##############views.py
from rest_framework.permissions import IsAdminUser
from rest_framework.authentication import SessionAuthentication,BasicAuthentication
class TestView4(APIView):
    authentication_classes=[]
    permission_classes = []
    def get(self,request,*args,**kwargs):
        return Response('我是未登录用户')

# 局部使用
from rest_framework.permissions import IsAdminUser
from rest_framework.authentication import SessionAuthentication,BasicAuthentication
from rest_framework.throttling import AnonRateThrottle
class TestView5(APIView):
    authentication_classes=[]
    permission_classes = []
    throttle_classes = [AnonRateThrottle]
    def get(self,request,*args,**kwargs):
        return Response('我是未登录用户，TestView5')
# 内置频率限制之，限制登录用户的访问频次
# 需求：未登录用户1分钟访问5次，登录用户一分钟访问10次
全局：在setting中
  'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ),
    'DEFAULT_THROTTLE_RATES': {
        'user': '10/m',
        'anon': '5/m',
    }
        
 局部配置：
	在视图类中配一个就行
```

## 过滤

```python
# 1 安装：pip3 install django-filter
# 2 注册，在app中注册
INSTALLED_APPS = [
    ...
    'django_filters'
]
# 3 全局配，或者局部配
 'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',)
# 4 视图类
class BookView(ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # 第一种方式:
    filter_backends = [DjangoFilterBackend,] # 局部配
    filter_fields = ('name',)  # 配置可以按照哪个字段来过滤
    # 第二种方式: 写一个类然后配置
    filter_backends = [DjangoFilterBackend,] 
    filter_class = AAbb  # filter_class = 类名
    # 自己写的类
    from django_filters.rest_framework import FilterSet
    class AAbb(FilterSet):
        class Meta:
            model=models.Course
            fields=['course_category']
            
# 自定义过滤规则
from rest_framework.filters import BaseFilterBackend

class MyFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        ... 
        过滤规则
        ...
        return queryset
# 区间过滤(沿用第二种方法,实现价格区间过滤)
from django_filters.rest_framework import FilterSet
class AAbb(FilterSet):
    # 课程的价格范围要大于min_price,小于max_price
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gt')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lt')
    class Meta:
        model=models.Course
        fields=['course_category']   
```

## 排序

```python
# 局部使用和全局使用
# 局部使用
from rest_framework.generics import ListAPIView
from rest_framework.filters import OrderingFilter
from app01.models import Book
from app01.ser import BookSerializer
class Book2View(ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ('id', 'price')
    
# urls.py
path('books2/', views.Book2View.as_view()),
]

# 使用：
http://127.0.0.1:8000/books2/?ordering=-price
http://127.0.0.1:8000/books2/?ordering=price
http://127.0.0.1:8000/books2/?ordering=-id
```

## 异常处理

```python
# 统一接口返回
# exceptions.py
# 自定义异常方法，替换掉全局
# 写一个方法
# 自定义异常处理的方法
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
def my_exception_handler(exc, context):
    response=exception_handler(exc, context)
    # 两种情况，一个是None，drf没有处理
    #response对象，django处理了，但是处理的不符合咱们的要求
    # print(type(exc))

    if not response:
        if isinstance(exc, ZeroDivisionError):
            return Response(data={'status': 777, 'msg': "除以0的错误" + str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={'status':999,'msg':str(exc)},status=status.HTTP_400_BAD_REQUEST)
    else:
        # return response
        return Response(data={'status':888,'msg':response.data.get('detail')},status=status.HTTP_400_BAD_REQUEST)
    
# 全局配置setting.py
'EXCEPTION_HANDLER': 'app01.app_auth.my_exception_handler',
```

## 分页

```python
# 自定义 paginations.py
from rest_framework.pagination import PageNumberPagination as DRFPageNumberPagination

class PageNumberPagination(DRFPageNumberPagination):
    page_size = 1
    page_query_param = 'page'
    max_page_size = 10
    page_size_query_param = 'size'
# 使用
from .paginations import PageNumberPagination
pagination_class = PageNumberPagination
```

## 版本

```python
1.url写version
urlpatterns = [
    url(r'^api/(?P<version>\w+)/',include('xx.urls')),
]
2.在视图中应用
from rest_framework.versioning import URLPathVersioning
class OrderView(APIView):
    versioning_class = URLPathVersioning  # 版本局部应用
    def get(self, request, *args, **kwargs):
        ...
3.配置
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',   # 版本全局应用
    'PAGE_SIZE': 2,  # 分页大小
    'ALLOWED_VERSIONS': ['v1', 'v2']  # 版本控制
}
```

## 跨域

```python
 '由于浏览器具有"同源策略"的限制，如果在同一个域下发送ajax请求，浏览器的同源策略不会阻止'
 '如果在不同域下发送ajax，浏览器的同源策略会阻止'
 解决方法：CORS(跨站资源共享，本质是设置响应头)设置响应头解决跨越
 response['Access-Contro7-A77ow-origin'] ="*"
 '简单请求：发送一次请求'
 条件：
    1、请求方式：HEAD、GET、POST
    2、请求头信息：
        Accept
        Accept-Language
        Content-Language
        Last-Event-ID
        Content-Type 对应的值是以下三个中的任意一个
                                application/x-www-form-urlencoded
                                multipart/form-data
                                text/plain
 
注意：同时满足以上两个条件时，则是简单请求，否则为复杂请求
 '复杂请求：发送两次请求 在发送数据之前会先发一次OPTIONS请求用于做“预检”，只有“预检”通过后才再发送一次请求用于数据传输。'
 
 可以自己写在中间件 也可以使用第三方的解决
 1.自己写
from django.utils.deprecation import MiddlewareMixin

class MvMiddle(MiddlewareMixin):
    def process_response(self, request, response):
        response['Access-Control-Allow-Origin'] = '*'
        if request.method == "OPTIONS":
            response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
 "然后中间件配置"
 MIDDLEWARE = [
    ...
    "luffyapi.utils.middle.MyMiddle"
] 
2. 第三方解决方案
2.1 pip安装
    pip install django-cors-headers
2.2 添加到settings的app中
    INSTALLED_APPS = (
    	...
    	'corsheaders',
    	...
    )
2.3 添加中间件
    MIDDLEWARE = [  # Or MIDDLEWARE_CLASSES on Django < 1.10
    	...
    	'corsheaders.middleware.CorsMiddleware',
    	'django.middleware.common.CommonMiddleware',
    	...
    ]
2.4 setting下面添加下面的配置
    CORS_ALLOW_CREDENTIALS = True
    CORS_ORIGIN_ALLOW_ALL = True
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
    	'XMLHttpRequest',
    	'X_FILENAME',
    	'accept-encoding',
    	'authorization',
    	'content-type',
    	'dnt',
    	'origin',
    	'user-agent',
    	'x-csrftoken',
    	'x-requested-with',
    	'Pragma',
    )
```

## JWT

```python
'一般在前后端分离时用于做认证(登陆)使用的技术,jwt的实现原理用户登陆成功之后会给前端返回一段token,token是由.分割的三短组成'
 '第一段是类型和算法信息,第二段是用户信息和超时时间,第三段是sa256(前两段拼接)加密+base64url'
 '以后前端再次发来信息时,会有超时验证,token的合法性校验,优势就是token只在前端保存,后端只负责校验,内部还集成了超时时间,后端可以根据时间校验是否超时'
 '内部还存在hash256加密,所以用户不可以修改token,只要一修改就认证失败'
 1.安装
 pip install djangorestframework-jwt
 2.setting注册app
 'rest_framework_jwt',
 
 3.代码
 from rest_framework_jwt.serializers import jwt_payload_handler, jwt_encode_handler
# 根据user对象生成payload(中间值的数据)
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
payload = jwt_payload_handler(user)
# 构造前面数据，bose64加密；中间数据bose64加密;前两段拼接然后做hs256加密（加盐），再做base64加密，生成token
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
token = jwt_encode_handler(payload)
 4.配置过期时间
 import datetime
JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=10),  # jwt过期时间
}
# jwt的认证
import jwt
from api import models
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_jwt.settings import api_settings

class HulaQueryParamAuthentication(BaseAuthentication):
    def authenticate(self, request):

        token = request.query_params.get('token')

        if not token:
            raise AuthenticationFailed({'code': 1002, "error": '登陆成功后才能操作'})

        jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
        try:
            payload = jwt_decode_handler(token)
        except jwt.ExpiredSignature:
            msg = {'code': 1003, "error": 'token已过期'}
            raise AuthenticationFailed(msg)
        except jwt.DecodeError:
            msg = {'code': 1004, "error": 'token格式错误'}
            raise AuthenticationFailed(msg)
        except jwt.InvalidTokenError:
            msg = {'code': 1005, "error": '认证失败'}
            raise AuthenticationFailed(msg)

        # 认证成功
        user_object = models.UserInfo.objects.filter(username=payload['username']).firet()
        return (user_object, token)
class OrderView(APIView):
    authentication_classes = [HulaQueryParamAuthentication, ]
    def get(self, request, *args, **kwargs):
        request.user  # 用户对象
        request.auth  # token
        return Response('...')
```

## DRF总结

```python
- 继承哪个类:
        -如果想改路由(自动生成路由:ViewSet)
        # 视图
        class LoginView(ViewSet):
            @action(methods=['POST'], detail=False)
            def login(self, request, *args, **kwargs):
                ...
        # 路由
        from django.urls import path, include
        from . import views
        from rest_framework import routers
        
        router = routers.SimpleRouter()
        router.register('', views.LoginView, 'login')
        urlpatterns = [
            path('', include(router.urls))
        ]
        -如果想跟数据库和序列化类打交道:GenericViewSet
            - 增删查改(5个试图扩展类)
```

## 补充:自动生成接口文档

```python
1.安装: pip install coreapi
2.在主路由中配置
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    ...
    path('docs/', include_docs_urls(title='站点页面标题'))
]
3.视图类必须是继承自APIView及其子类的视图。
```



