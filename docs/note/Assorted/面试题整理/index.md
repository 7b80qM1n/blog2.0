---

id: pythonBackend-Assorted-3

title: 面试题整理
---

## is和==的区别

```python
"""
is判断的是内存地址
==判断的是值
"""
lst1 = [1, 2, 3]
lst2 = [1, 2, 3]
print(lst1 is lst2)  # False
print(lst1 == lst2)	 # True
a = "123"
b = "123"
print(a is b)   # True
print(a == b)	# True
```

## 一行代码实现数值交换

```python
a = 10
b = 20
a, b = b, a
```

## 一行代码实现删除列表中重复的值

```python
lst = [1, 2, 3, 4, 5, 5, 5]
print(list(set(lst)))  # 集合的数据是不重复的
```

## 遍历A中的每一个元素并打印出来

```python
A = [1, 2, [3, 4, ["434", ...]]]
for i in A:
    if type(i) == list:
        A.extend(i)
    else:
        print(i)
```

## 将列表内的元素,根据位数合并成字典

```python
"""
输出:{1: [1, 2, 4, 8], 
     2: [16, 32, 64], 
     3: [128, 256, 512], 
     4: [1024, 2048, 4096, 8192], 
     5: [16384, 32768, 65536], 
     6: [4294967296, 4545465]}
"""
lst = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 4294967296]
dic = {}
for item in lst:
    it = str(item)
    if len(it) < 6:
        dic.setdefault(len(it), []).append(item)
    else:
        dic.setdefault(6, []).append(item)
print(dic)
```

## 用最简洁的方法把二位数组转换成一维数组

```python
"""
转换前
	lst =[[1,2,3],[4,5,6]，[7,8,9]]
转换后
	lst = [1, 2, 3, 4, 5, 6, 7, 8, 9]
"""
lst = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(sum(lst, []))
```

## 将列表按下列规则排序,补全代码

```python
"""
1，正数在前，负数在后
2．正数从小到大(1,2,3,4)
3．负数从大到小(-1,-2,-3,-4)
A = [7, -8, 5, 4, 0, -2, -5]
补全代码
	sorted(A, key=lambda x:_____)
"""
A = [7, -8, 5, 4, 0, -2, -5]
print(sorted(A, key=lambda x: ((x < 0), abs(x))))
"""
第一条件是x<0,当结果是False时就是0 True时就是1 
比如第一个参数是7 那么7<0就是False 就相当于0 就排在前面 第二个参数是-8 -8<0就是True 相当于1 排在0后面
第二条件是绝对值排序,  最终列表就按照(0,7) (1,8) (0,5) (0,4) (0,0) (1,2) (1,5)进行排序
排序完就是  (0,0) (0,4) (0,5) (0,7) (1,2) (1,5) (1,8)
所以最终结果 [0, 4, 5, 7, -2, -5, -8]
"""
```

## 编程找出1000以内的所有完数

```python
"""python一个数如果恰好等于它的因子之和。这个数就称为完数。例如:6= 1 + 2+3"""
for n in range(1, 1000):
    factor_list = []   # 因数列表
    for factor in range(1, n):
        if n % factor == 0:
            factor_list.append(factor)
    if n == sum(factor_list):
        print(n, factor_list)
```

## 一行代码通过filter和lambda函数输出以下列表索引为奇数对应的元素

```python
"""
list(enumerate(list_b))) ===> [(0, 12), (1, 213), (2, 22), (3, 2), (4, 2), (5, 2), (6, 22), (7, 2), (8, 2), (9, 32)]
[i for i in filter(lambda a: a[0] % 2 == 1, list(enumerate(list_b)))]  ====> [(1, 213), (3, 2), (5, 2), (7, 2), (9, 32)]
"""
list_b = [12, 213, 22, 2, 2, 2, 22, 2, 2, 32]
print([i[1] for i in filter(lambda a: a[0] % 2 == 1, list(enumerate(list_b)))])  # [213, 2, 2, 2, 32]
```

**考点:	逻辑运算符**

**运算顺序:	()  > not  > and  > or**

` A or B `==>  如果`A`表示`True`,那么结果就是`A` ; 如果`A`表示`Flase`,那么结果就是`B`

`A and B` ==>  如果`A`表示`True`,那么结果就是`B` ; 如果`A`表示`Flase`,那么结果就是`A`

```python
print(1 or 3)
print(1 and 3)
print(0 and 2 and 1)
print(0 and 2 or 1)
print(0 and 2 or 1 or 4)
print(0 or False and 1)
"""
1 or 2和1 and 2输出分别是什么?为什么?
1 <(2 ==2)和1< 2 =2结果是什么?为什么?
"""
```

**考点:简单但实用性强**

```python
# 如何实现"1,2,3"变成["1", "2","3"]
# 如何实现["1","2", "3"]变成[1,2,3]
a = "1,2,3"
lst = a.split(",")
print(lst)
print([int(i) for i in lst])
```

**考点:通过fromkeys得到的字典的值为可变的数据类型时, 值共用一个**

**fromkeys：创建一个字典：字典的所有键来自一个可迭代对象，字典的值使用同一个值。**

```python
dic = dict.fromkeys([1, 2, 3], [])   # {1: [], 2: [], 3: []}
dic[1].append(666)
print(id(dic[1]),id(dic[2]),id(dic[3]))  # 2204617892552 2204617892552 2204617892552
print(dic)  # {1: [666], 2: [666], 3: [666]}
```

**考点:元组中如果只有一个元素,并且没有逗号那么它不是元组,它与该元素的数据类型一致**

```python
a = (1)
b = (1,)
print(type(a))		# <class 'int'>
print(type(b))		# <class 'tuple'>
```

**考点:深浅拷贝**

```python
"""
求a,b,c,d的值
"""
import copy

a = [1, 2, 3, [4, 5], 6]
b = a
c = copy.copy(a)
d = copy.deepcopy(a)

b.append(10)
c[3].append(11)
d[3].append(12)

print(a)	# [1, 2, 3, [4, 5, 11], 6, 10]
print(b)	# [1, 2, 3, [4, 5, 11], 6, 10]
print(c)	# [1, 2, 3, [4, 5, 11], 6]
print(d)	# [1, 2, 3, [4, 5, 12], 6]
```

![image-20210408083849751](https://gitee.com/JqM1n/biog-image/raw/master/20210408083849.png)

**考点: 栈:先进后出**

```python
"""
一个栈的输入序列为1,2,3,4,5．则下列序列中不可能是栈的输出序列的是:
A. 1 5 4 3 2
B. 2 3 4 1 5
C. 1 5 4 2 3
D. 2 3 1 4 5
"""
```

**考点:删除列表元素会导致列表索引发生变化**

```python
"""
阅读以下代码,并写出程序的输出结果
"""
alist = [2, 4, 5, 6, 7]
for var in alist:
    if var % 2 == 0:
        alist.remove(var)
print(alist)  # [4, 5, 7]
```

**考点:内存指向问题**

```python
"""
求结果:
"""
kvps = {"1":1, "2":2}
theCopy = kvps  # 赋值操作就是让两个变量指向同一个内存地址
kvps["1"] = 5
sum = kvps["1"] + theCopy["1"]
print(sum)   # 5 + 5 = 10
```

![image-20210408104639744](https://gitee.com/JqM1n/biog-image/raw/master/20210408104646.png)

**考点:浅拷贝**

```python
A = ["Amir", "Barry", "Chales", "Dao"]
B = A
C = A[:]
B[0] = "Alice"
C[1] = "Bob"
sum = 0
for ls in (A, B, C):
    if ls[0] == "Alice":
        sum += 1
    if ls[1] == "Bob":
        sum += 10
print(sum)	# 12
```

**考点:装饰器**

```python
"""写装饰器,限制函数被执行的频率,如10秒一次"""
import time
def wrapper(func):
    start_time = 0   # 函数上次执行时间
    def inner(*args, **kwargs):
        nonlocal start_time
        now_time = time.time()
        if now_time - start_time > 10:
            ret = func(*args, **kwargs)
            start_time = now_time
            return ret
        else:
            print(f"访问频繁,{10-int(now_time - start_time)}秒后再试")
    return inner

@wrapper
def func():
    print("函数执行了")

while True:
    func()
    time.sleep(1)
```

