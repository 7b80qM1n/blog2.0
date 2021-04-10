---

id: pythonBasics-list1

title: 列表常用操作
---

## 增

append    在列表末尾添加元素

```python
lst = [1, 2, 'a']
lst.append(666)
print(lst) # [1, 2, 'a', 666]
```

extend  迭代着追加，在列表的最后面迭代着追加一组数据

```python
lst = [1, 2, '7']
lst.extend('b80')
print(lst)	# [1, 2, '7', 'b', '8', '0']
```

## 删

pop       默认删除最后一个 返回删除的元素

```python
lst = ["7", "b", "8", "0"]
ret = lst.pop(1)
print(ret)  # b
print(lst)  # ['7', '8', '0']
```

remove   指定元素删除，如果有重名元素，默认删除从左数第一个	

```python
lst = ["7", "b", "8", "0", "q"]
lst.remove('q')
print(lst)  # ['7', 'b', '8', '0']
```

clear     清空列表里的元素

```python
lst = ["7", "b", "8", "0"]
lst.clear()
print(lst)  # []
```

del  按照索引删除      [：：2]按照切片 步长删除

```python
lst = ["1", "2", "3", "4", "5", "6"]
del lst[1]
del lst[::2]
print(lst)
```

## 改

按照索引改

```python
lst = ["7", "a", "8", "0"]
lst[1] = "b"
print(lst)  # ['7', 'b', '8', '0']
```

按照切片改

```python
lst = ["7", "a", "7", "0"]
lst[1:3] = "b8"
print(lst)  # ['7', 'b', '8', '0']
```

按照切片(步长)改值(必须一一对应)

```python
lst = ["改", "b", "吧", "0"]
lst[::2] = "78"
print(lst)  # ['7', 'b', '8', '0']
```

sort   方法用于在原位置对列表进行排序

```python
a = [2, 1, 3, 4, 5]
a.sort()  # 他没有返回值，所以只能打印a  默认从小到大排序
print(a)  # [1, 2, 3, 4, 5]

a.sort(reverse=True)  # 从大到小排序
print(a)  # [5, 4, 3, 2, 1]
```

reverse 翻转

```python
a = [8, 1, 3, 4, 5, 4, 5, 2, 1]
a.reverse()  # 他也没有返回值，所以只能打印a
print(a)  # [1, 2, 5, 4, 5, 4, 3, 1, 8]
```

列表也可以相加与整数相乘

```python
l1 = [1, 2, 3]
l2 = [4, 5, 6]
# print(l1+l2)  # [1, 2, 3, 4, 5, 6]
print(l1*3)  # [1, 2, 3, 1, 2, 3, 1, 2, 3]
```

## 查

按照索引查

```python
lst = ["7", "b", "8", "0"]
print(lst[1])  # b
```

按照切片查

```python
lst = ["7", "b", "8", "0"]
print(lst[:2])  # ['7', 'b']
```

index（从列表中找出某个值的第一个匹配项的索引位置）通过元素找索引

```python
lst = ["7", "b", "8", "0", "b"]
print(lst.index('b'))  # 1 
```

count（数）（统计某个元素在列表中出现的次数）。

```python
lst = ["7", "b", "8", "0", "b"]
print(lst.count('b'))  # 2
```

## 循环列表，改变列表大小的问题

有列表l1, l1 = [11, 22, 33, 44, 55]，请把索引为奇数对应的元素删除（不能一个一个删除，此l1只是举个例子，里面的元素不定）。

有人说这个还不简单么？我循环列表，然后进行判断，只要他的索引为奇数，我就删除。OK，你可以照着这个思路去做。

那么根据题意，这个题最终的结果应该是：l1 = [11, 33, 55],但是你得到的结果却是： l1 = [11, 33, 44] 为什么不对呢？？？

用这个进行举例：当你循环到22时，你将列表中的22删除了，但是你带来的影响是：33,44,55都会往前进一位，他们的索引由原来的2,3,4变成了1,2,3 所以你在往下进行循环时，就会发现，额........完全不对了。

![image-20210409212028735](https://gitee.com/JqM1n/biog-image/raw/master/20210409212036.png)

那这个怎么解决呢？有三种解决方式：

1.直接删除

```python
print(l1[::2])
```

2.倒叙法删除

```python
for i in range(len(l1)-1, -1, -1):
    if i % 2 == 1:
        l1.pop(i)
print(l1)
```

3.思维置换

```python
l2 = []
for i in range(len(l1)):
    if i % 2 == 0:
        l2.append(l1[i])
print(l2)
```

## 列表推导式

用一行代码去构建一个比较复杂，有规律的列表

列表推导式分为两种模式：

1. 循环模式：[变量(加工的变量) for 变量 in iterable]

   将10以内所有整数的平方写入列表。

   ```python
   l1 = [i ** 2 for i in range(1, 11)]
   print(l1)
   ```

2. 筛选模式：[变量(加工的变量) for 变量 in iterable if 条件]

   筛选模式就是在上面的基础上加上一个判断条件，将满足条件的变量留到列表中。

   1. 三十以内可以被三整除的数。

   ```python
   multiples = [i for i in range(30) if i % 3 == 0]
   print(multiples)
   ```

   2. 找到嵌套列表中名字含有两个‘e’的所有名字（有难度）

   ```python
   names = [['Tom', 'Billy', 'Jefferson', 'Andrew', 'Wesley', 'Steven', 'Joe'],
            ['Alice', 'Jill', 'Ana', 'Wendy', 'Jennifer', 'Sherry', 'Eva']]
   
   print([name for lst in names for name in lst if name.count('e') >= 2])  # 注意遍历顺序，这是实现的关键
   ```

   