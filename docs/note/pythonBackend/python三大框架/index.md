---

id: pythonBackend-1

title: python三大框架

---

```
A: socket部分

B: 路由与视图函数对应关系（路由匹配）

C: 模版语法
```

## django

```python
"""
特点：大而全 自带的功能特别特别特别多 类似于航空母舰
不足之处: 有时候过于笨重 搭建小型网站就比如用航空母舰盖茅草屋 
    
A用的是别人的  wsgiref模块
B用的是自己的
C用的是自己的（没有jinja2好用 但是也很方便）

正常启动django的注意事项：
计算机名称不能有中文、一个pycharm窗口只能开一个项目、项目里面所有的文件也尽量不要出现中文、项目报错点击最后一个报错信息里面的源码把逗号删掉
"""
```

### MTV和MVC模型

```python
# MTV:Django号称是MTV模型
M:models
T:templates
v:views
# MVC:其实django本质也是MVC
M:models
v:views
c:controller
# vue框架:MVVM模型
```

## flask

```python
"""
特点：小而精 自带的功能特别特别特别的少

第三方的模块特别特别特别的多 如果将flask第三方模块加起来完全可以盖过django 并且越来越像django

不足之处：比较依赖于第三方的开发者 比如说flask更新了 第三方模块还没更新 会造成兼容性的问题

A用的是别人的 werkzeug（内部还是wsgiref模块）

B自己写的

C用的是别人的（jinja2）
"""
```

## tornado

```python
"""
特点：异步非阻塞 支持高并发 牛逼到甚至可以开发游戏

ABC都是自己写的
"""
```

