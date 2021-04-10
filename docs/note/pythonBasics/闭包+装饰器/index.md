---

id: pythonBasics-decorator1

title: 闭包 + 装饰器
---

## 闭包

```python
"""
例：整个历史中的某个商品的平均收盘价。什么叫平局收盘价呢？就是从这个商品一出现开始，每天记录当天价格，然后计算他的平均值：平均值要考虑直至目前为止所有的价格。
比如大众推出了一款新车：小白轿车。
第一天价格为：100000元，平均收盘价：100000元
第二天价格为：110000元，平均收盘价：（100000 + 110000）/2 元
第三天价格为：120000元，平均收盘价：（100000 + 110000 + 120000）/3 元
........
"""
```

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210410092704.png)

上面被红色方框框起来的区域就是闭包，被蓝色圈起来的那个变量应该是make_averager()函数的局部变量，它应该是随着make_averager()函数的执行结束之后而消失。但是他没有，是因为此区域形成了闭包，series变量就变成了一个叫自由变量的东西，averager函数的作用域会延伸到包含自由变量series的绑定。也就是说，每次我调用avg对应的averager函数时，都可以引用到这个自用变量series，这个就是闭包。

### 什么是闭包?

1. 内层函数对外层函数非全局变量的引用(使用)，就会形成闭包。
2. 闭包只能存在嵌套函数中。

### 闭包有什么作用？

**保证数据的安全。**

被引用的非全局变量也称作自由变量，这个自由变量会与内层函数产生一个绑定关系，自由变量不会再内存中消失。

### 闭包的应用：

1. 可以保存一些非全局变量但是不易被销毁、改变的数据。
2. 装饰器。

`函数名.__code__.co_freevars` 查看函数的自由变量，判定是否是闭包

```python
def make_averager():
    series = []
    def averager(new_value):
        series.append(new_value)
        total = sum(series)
        return total / len(series)
    return averager
avg = make_averager()
# 函数名.__code__.co_freevars 查看函数的自由变量
print(avg.__code__.co_freevars)  # ('series',)
```

## 装饰器

### 开放封闭原则

1. 对扩展是开放的

   我们说，任何一个程序，不可能在设计之初就已经想好了所有的功能并且未来不做任何更新和修改。所以我们必须允许代码扩展、添加新功能。

2. 对修改是封闭的

   就像我们刚刚提到的，因为我们写的一个函数，很有可能已经交付给其他人使用了，如果这个时候我们对函数内部进行修改，或者修改了函数的调用方式，很有可能影响其他已经在使用该函数的用户。

所以装饰器最终最完美的定义就是：在不改变原被装饰的函数的源代码以及调用方式下，为其添加额外的功能。

###  标准版装饰器

```python
def wrapper(func):
    def inner(*args,**kwargs):
        '''执行被装饰函数之前的操作'''
        ret = func
        '''执行被装饰函数之后的操作'''
        return ret
    return inner
```

### 示例 ( 未语法糖优化前 )

```python
import time

def home(name, age):
    time.sleep(3)  # 模拟一下网络延迟以及代码的效率
    print(name, age)
    print(f'欢迎访问{name}主页')

def timer(func):  # func = home
    def inner(*args, **kwargs):  # 函数定义时，*代表聚合：所以你的args = ('太白',18)
        start_time = time.time()
        func(*args, **kwargs)  # 函数的执行时，*代表打散：所以*args --> *('太白',18)--> func('太白',18)
        end_time = time.time()
        print(f'此函数的执行效率为{end_time - start_time}')
    return inner

home = timer(home)
home('jqm', 18)
```

如果你想给home加上装饰器，每次执行home之前你要写上一句：`home = timer(home)`这样你在执行home函数才是真生的添加了额外的功能。但是每次写这一句也是很麻烦。所以，Python给我们提供了一个简化机制，用一个很简单的符号去代替这一句话。

```python
import time

def timer(func):  # func = home
    def inner(*args, **kwargs):
        start_time = time.time()
        func(*args, **kwargs)
        end_time = time.time()
        print(f'此函数的执行效率为{end_time - start_time}')
    return inner

@timer  # home = timer(home)
def home(name, age):
    time.sleep(3)  # 模拟一下网络延迟以及代码的效率
    print(name, age)
    print(f'欢迎访问{name}主页')

home('jqm', 18)
```

你看此时我调整了一下位置，你要是不把装饰器放在上面，timer是找不到的。home函数如果想要加上装饰器那么你就在home函数上面加上`@home`，就等同于那句话` home = timer(home)`。这么做没有什么特殊意义，就是让其更简单化，比如你在影视片中见过野战军的作战时由于不方便说话，用一些简单的手势代表一些话语，就是这个意思。

### 补充:带参数装饰器

```python
def auth(db_type):
    def wrapper(func):
        def inner(*args, **kwargs):
            '执行被装饰函数之前的操作'
            ret = func
            '执行被装饰函数之后的操作'
            return ret
        return inner
    return wrapper

@auth(db_type='file')  
# auth(db_type='file')最后返回wrapper内存地址 所以@auth('file')=@wrapper  
# 而@wrapper又相当于是 login=wrapper(login)
def login(x, y):
    print(x, y)
```

