---

id: pythonBackend-Assorted-2

title: 优化
---

## 数据库优化

### 数据库查询优化

#### only和defer  

```python
# only
"""
only是只查该字段 直接将结果封装到返回给你的对象中
点该字段 不需要再走数据库
但如果你点了不是括号内的字段  就会频繁的去走数据库查询
"""
res = models.Book.objects.only('name')    # 只查name字段，
for r in res:
    # print(r.name)   # 返回name
    print(r.price)  # 查询的结果没有，因此要每次都去查
# defer
"""
defer是查除了该字段的 所有字段 直接将结果封装到返回给你的对象中
点该其他字段 不需要再走数据库
但如果你点了不是括号内的字段  就会频繁的去走数据库查询
"""
res = models.Book.objects.defer("name") # 查除了name字段之外的字段，只走一次数据库
for r in res:
    # print(r.name)   # 查询的结果没有，没有的时候会去走数据库
    print(r.price)
# defer和only互为反关系
```

#### select_related与prefetch_related

```python
# select_related  内部的本质是链表操作 inner join  消耗资源就在连表上，但是不用多次访问数据库
'括号内只能外键字段并且多对多不行 将连表之后的结果全部查询出来封装到对象里面'
'之后对象在点击表的字段的时候都无需再走数据库'
def select_related(self, *fields)
    性能相关：表之间进行join连表操作，一次性获取关联的数据。
    总结：
    1. select_related主要针一对一和多对一关系进行优化。
    2. select_related使用SQL的JOIN语句进行优化，通过减少SQL查询的次数来进行优化、提高性能。
# prefetch_related  内部的本质是子查询 消耗资源在反复问数据库的次数上，但是不需要连表
'内部通过子查询的方式将多张的表数据也封装到对象中 这样用户在使用的时候也是感觉不出来的'
def prefetch_related(self, *lookups)
    性能相关：多表连表操作时速度会慢，使用其执行多次SQL查询在Python代码中实现连表操作。
    总结：
    1. 对于多对多字段（ManyToManyField）和一对多字段，可以使用prefetch_related()来进行优化。
    2. prefetch_related()的优化方式是分别查询每个表，然后用Python处理他们之间的关系。
# 详细：https://www.icode9.com/content-4-527314.html
```

