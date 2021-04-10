---

id: pythonBasics-function1

title: 函数 + f-strings
---

## 作用

以功能为导向，减少代码重复，使代码可读性好

## 函数的结构

```python
def 函数名():
    函数体
```

### return返回值

```python
return 会给函数的执行者返回值。

遇到return,函数结束,return下面的（函数内）的代码不会执行

如果return后面什么都不写，或者函数中没有return,则返回的结果是None

如果return后面写了一个值,返回给调用者这个值

如果return后面写了多个结果,返回给调用者一个tuple(元组),调用者可以直接使用元组的解构获取多个变量。
```

## 函数的参数

### 实参角度：

- 位置参数   

  位置参数就是从左至右，实参与形参一一对应。

-  关键字参数

  ```python
  def date(sex, age, hobby):
      print("拿出手机")
      print("打开陌陌")
      print(f'设置筛选条件：性别: {sex}，年龄：{age},爱好：{hobby}')
      print("找个漂亮的妹子")
      print("问她,约不约啊!")
      print("ok 走起")
  
  date(hobby='唱歌', sex='女', age='25~30')
  ```

- 混合参数 

  把上面两种参数混合着使用. 也就是说在调用函数的时候即可以给出位置参数, 也可以指定关键字参数.

  混合参数一定要记住：关键字参数一定在位置参数后面。

## 形参角度

- 位置参数

  位置参数其实与实参角度的位置参数是一样的，就是按照位置从左至右，一一对应

- 默认参数（经常使用）

  大多数传进来的参数都是一样的, 一般用默认参数，参考open函数的源码，mode=‘r’就是默认值参数

- 万能参数

    `*`  在定义的时候代表聚合，在调用的时候代表打散

  `(*args)`		这个形参会将实参所有的位置参数接收，放置在一个元组中，并将这个元组赋值给args这个形参

  ```python
  def func(*args):
      print(args)  # ('jqm', '男')
  
  func('jqm', '男')
  ```

  `(**kwargs)`  这个形参会将实参所有的关键字参数接收，放置在一个字典中，并将这个字典赋值给kwagrs这个形参

  ```python
  def func(**kwargs):
      print(kwargs)  # {'name': 'jqm', 'sex': '男'}
  
  func(name='jqm', sex='男')
  ```

- 仅限关键字参数(了解)  

  放在`*args`和`**kwargs`之间,传值时要用关键字参数方式传递

  ```python
  def func(*args, c, **kwargs):
      print(c)  # jqm
  
  func(c='jqm')
  ```

### 形参的顺序：位置参数，*args，默认参数，仅限关键字参数,  **kwargs

##  *****  **的用法之打散**   

将位置参数的实参（可迭代类型）前面加上`*`，相当于将这些实参给拆解成一个一个的组成元素当成位置参数，然后传给args

```python
def func(*args):
    print(args)  # (1, 2, 3, 4, 5)

func(*[1, 2, 3], *[4, 5])  # 相当于func(1, 2, 3, 4, 5)
```

将位置参数的实参（字典）前面加上`**`，相当于将字典的键值组合成关键字参数，然后传给kwargs

```python
def func(**kwargs):
    print(kwargs)  # (1, 2, 3, 4, 5)

func(**{"name": "jqm", "age": 18})  # 相当于 func(name="jqm", age=18)
```

## 函数名的应用

函数名可以赋值给其他变量

```python
def func():
    print("呵呵")
print(func)
a = func  # 把函数当成一个变量赋值给另一个变量
a()  # 函数调用 func()
```

函数名可以当作容器类的元素

```python
def func1():
    print("in func1: 嘻嘻")
def func2():
    print("in func2: 哈哈")
lst = [func1, func2]
for i in lst:
    i()
```

函数名可以当作函数的参数

```python
def func1(x):
    print('in func1')
    x()
def func2():
    print('in func2')

func1(func2)
```

函数名可以作为函数的返回值

```python
def func1():
    print('in func1')

def func2(f):
    print('in func2')
    return f

ret = func2(func1) 
ret()  # ret, f, func1 都是指向的func1这个函数的内存地址
```

## 补充: 新特性之 f-strings格式化输出

他的结构就是F(f)+ str的形式，在字符串中想替换的位置用{}展位，与format类似，但是用在字符串后面写入替换的内容，而他可以直接识别。

```python
name = 'jqm'
age = 18
msg = F'姓名：{name},年龄：{age}'  # 大写字母也可以 
print(msg)  # 姓名：jqm,性别：18，年龄：男
```

他可以加任意的表达式，非常方便：

```python
print(f'{3 * 21}')  # 63
name = 'barry'
print(f"全部大写：{name.upper()}")  # 全部大写：BARRY
# 字典也可以
teacher = {'name': 'jqm', 'age': 18}
msg = f"The teacher is {teacher['name']}, aged {teacher['age']}"
print(msg)  # The comedian is jqm, aged 18
# 列表也行
l1 = ['jqm', 18]
msg = f'姓名：{l1[0]},年龄：{l1[1]}.'
print(msg)  # 姓名：jqm,年龄：18.
```

可以用函数完成相应的功能，然后将返回值返回到字符串相应的位置

```python
def sum_a_b(a, b):
    return a + b
a = 1
b = 2
print('求和的结果为' + f'{sum_a_b(a,b)}')  # 求和的结果为3
```

