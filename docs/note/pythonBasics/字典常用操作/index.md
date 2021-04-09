---

id: pythonBasics-dict1

title: 字典常用操作
---

## 字典的创建方式

### 方式一 直接创建

```python
dic = dict({'one': 1, 'two': 2, 'three': 3})
print(dic)  # {'one': 1, 'two': 2, 'three': 3}
```

### 方式二 快速创建

```python
dic = dict(one=1,two=2,three=3)
print(dic)  # {'one': 1, 'two': 2, 'three': 3}
```

### 方式三 元组嵌套

```python
dic = dict((('one', 1),('two', 2),('three', 3)))
# dic = dict([('one', 1),('two', 2),('three', 3)])
print(dic)  # {'one': 1, 'two': 2, 'three': 3}
```

## 增

通过键值对直接增加   有则改之，无则增加

```python
dic = {'name': 'jqm', 'age': 18}
dic['weight'] = 75 # 没有weight这个键，就增加键值对
print(dic) # {'name': 'jqm', 'age': 18, 'weight': 75}
dic['name'] = 'whh' # 有name这个键，就成了字典的改值
print(dic) # {'name': 'whh', 'age': 18, 'weight': 75} 
```

setdefault   有则不变，无则增加  dict.setdefault(key, default=None)

```python
dic = {'name': 'jqm', 'age': 18}
ret = dic.setdefault('height', 175)  # 没有height此键，则添加
print(dic)  # {'name': 'jqm', 'age': 18, 'height': 175}
print(ret)  # 175
ret = dic.setdefault('name', 'barry')  # 有此键则不变
print(dic)  # {'name': 'jqm', 'age': 18, 'height': 175}
print(ret)  # jqm
```

## 删

pop 通过key删除字典的键值对，返回删除的值，可设置返回值。

```python
dic = {'name': 'jqm', 'age': 18}
ret = dic.pop('name')
ret1 = dic.pop('n', None)
print(ret)  # jqm
print(dic)  # {'age': 18}
print(ret1)  # None
```

popitem 3.5版本之前，popitem为随机删除，3.6之后为删除最后一个，有返回值

```python
dic = {'name': 'jqm', 'age': 18}
ret = dic.popitem()
print(ret)  # ('age', 18)
print(dic)  # {'name': 'jqm'}
```

## 改

通过键值对直接改

```python
dic = {'name': 'jqm', 'age': 18}
dic['name'] = 'barry'
print(dic)  # {'name': 'barry', 'age': 18}
```

## 查

 get   可以设置返回值

```python
dic = {'name': 'jqm', 'age': 18}
v = dic.get('name')
print(v)  # 'jqm'
v = dic.get('name1')
print(v)  # None
v = dic.get('name2', '没有此键')
print(v)  # 没有此键
```

三种特殊的 keys values items

```python
keys()
dic = {'name': 'jqm', 'age': 18}
print(dic.keys())  # dict_keys(['name', 'age'])

values()
dic = {'name': 'jqm', 'age': 18}
print(dic.values())  # dict_values(['jqm', 18])

items()
dic = {'name': 'jqm', 'age': 18}
print(dic.items())  # dict_items([('name', 'jqm'), ('age', 18)])
for key, value in dic.items():
    print(key, value)
    """
    name jqm
    age 18
    """
```

## update ：可增可改可更新

```python
'增1'
dic = {'name': 'jqm', 'age': 18}
dic.update(sex='男', height=175)
print(dic) # {'name': 'jqm', 'age': 18, 'sex': '男', 'height': 175}
'同理可改（覆盖）'
dic = {'name': 'jqm', 'age': 18}
dic.update(name='男')  
print(dic) # {'name': '男', 'age': 18}
'增2'
dic = {'name': 'jqm', 'age': 18}
dic.update([(1, 'a'),(2, 'b'),(3, 'c'),(4, 'd')]) # 列表里面的 元组 分别赋值 成key和value
print(dic) # {'name': 'jqm', 'age': 18, 1: 'a', 2: 'b', 3: 'c', 4: 'd'}
```

更新，有则覆盖，无则增加 

```python
dic1 = {"name":"jin","age":18,"sex":"male"}
dic2 = {"name":"alex","weight":75}
dic1.update(dic2)
print(dic1) # {'name': 'alex', 'age': 18, 'sex': 'male', 'weight': 75}
print(dic2) # {'name': 'alex', 'weight': 75} 
```

## fromkeys

创建一个字典：字典的所有键来自一个可迭代对象，字典的值使用同一个值。（坑）

```python
dic = dict.fromkeys('abcd', 'jqm')
print(dic)  # {'a': 'jqm', 'b': 'jqm', 'c': 'jqm', 'd': 'jqm'}

dic = dict.fromkeys([1, 2, 3], 'jqm')
print(dic)  # {1: 'jqm', 2: 'jqm', 3: 'jqm'}

# 这里有一个坑，就是如果通过fromkeys得到的字典的值为可变的数据类型，那么你得小心了。 
# 值共用一个，所以只要其中一个改变，其他共用这个值的都会改变
dic = dict.fromkeys([1, 2, 3], [])
dic[1].append(666)
print(id(dic[1]), id(dic[2]), id(dic[3]))  # 2204617892552 2204617892552 2204617892552
print(dic)  # {1: [666], 2: [666], 3: [666]}
```

## 循环字典，改变字典大小的问题

来，先来研究一个小题，有如下字典：`dic = {'k1': '黑黑', 'k2': 'barry', 'k3': '白白', 'age': 18,...} `

请将字典中所有键带k元素的键值对删除。你要遍历所有的键，符合的删除，对吧？ 嗯，请开始你的表演。

```python
dic = {'k1': '黑黑', 'k2': 'barry', 'k3': '白白', 'age': 18} 
for i in dic:
    if 'k' in i:
        del dic[i]
print(dic)
```

你会发现，报错了。。。。。

![image-20210409215120242](https://gitee.com/JqM1n/biog-image/raw/master/20210409215120.png)

翻译过来是：字典在循环迭代时，改变了大小。

他的意思很简单，你的字典在循环时，不要改变这个字典的大小，只要改变大小，就会报错！那么怎么解决？？?

改变思路，把字典转换成列表，循环列表，然后对字典进行循环删除操作

```python
dic = {'k1': '黑黑', 'k2': 'barry', 'k3': '白白', 'age': 18}
# 将字典中键含有k元素的键值对删除
for i in list(dic):
    if 'k' in i:
        dic.pop(i)
print(dic)  # {'age': 18}
```

所以说，他和列表差不多，只不过比列表更暴力一些，对其进行总结就是：

在循环一个字典的过程中，不要改变字典的大小（增，删字典的元素），这样会直接报错。