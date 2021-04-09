---

id: pythonBasics-str1

title: 字符串常用操作
---

```python
"""
不会对字符串进行任何操作，都是产生一个新的字符串
.upper() 字符串大写
.lower()  字符串小写

.strip()  默认去除字符串两边的空格，换行符，制表符
.count()  某个元素出现的次数

split()  指定分隔符对字符串进行切片  以什么分割，最终形成一个列表此列表不含有这个分割的元素。
默认按照空格分割，返回一个列表 可以指定分隔符  例如用冒号分隔 
"""
str.split(':')
```

replace() (旧的,新的,替换多少个# 不写则默认替换全部）

```python
name='123 ,my name is 123'
print(name.replace('123','jqm',1)) # jqm ,my name is 123
```

join() 将序列中的元素以指定的字符连接生成一个新的字符串。 拼接可迭代对象 前提：列表里面的元素都是str类型

```python
s1 = ["a", "b", "c"]
print("+".join(s1))  # a+b+c
```

|  is系列  |        isalnum         |      isalpha       |      isdecimal       |        isdigit         |
| :------: | :--------------------: | :----------------: | :------------------: | :--------------------: |
| **描述** | 字符串由字母或数字组成 | 字符串只由字母组成 | 字符串只由十进制组成 | 字符串是否只由数字组成 |

```python
name = 'Jqmm1'
print(name.isalpha())    # False
```

**format**  **格式化输出**

第一种方法：

```python
"{} {}".format("hello", "world")    # 不设置指定位置，按默认顺序 'hello world'
```

第二种方法:

```python
"{0} {1}".format("hello", "world")  # 设置指定位置 'hello world'
"{1} {0} {1}".format("hello", "world")  # 设置指定位置 'world hello world'
```

第三种方法：

```python
a = '我叫{name}，今年{age}，性别{sex}.format{age=18,sex='男',name='jqm'}'  # 不固定位置
```

