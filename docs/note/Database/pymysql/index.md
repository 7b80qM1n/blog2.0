---

id: Database-pymysql
title: pymysql
---

## pymysql模块的基本使用

```python
import pymysql

# 连接数据库
conn = pymysql.connect(
    host='127.0.0.1',
    port=3306,
    user='root',
    password='jqmkfc039988',
    database='db666',
    charset='utf8',  # 编码千万不要加-
    autocommit=True  # 自动提交
)
# 产生一个游标对象就是用来帮你执行命令的 默认是元组 
cursor = conn.cursor(cursor=pymysql.cursors.Di ctCursor)  # pymysql.cursors.DictCursor 用字典的形式
sql = 'select * from userinfo;'
affect_rows = cursor.execute(sql)
# print(affect_rows)  # execute返回的是你当前sql语句所影响的行数，返回结果一般不用
print(cursor.fetchone())    # 只拿一条 读取数据类似于文件光标的移动
# print(cursor.fetchall())    # 拿所有
# print(cursor.fetchmany(1))  # 可以指定拿几条
cursor.scroll(1, 'relative')  # 相对于光标所在的位置继续往后移动1位
cursor.scroll(1, 'absolute')  # 相对于数据的开头往后继续移动1位
# 针对增删改 pymysql涉及到数据的修改 需要二次确认真正的操作数据 conn.commit() 提交
# autocommit=True后就可以不用手动提交
# 增：
sql='insert into 表名(id,name) values(%s,%s)'
rows = cursor.executemany(sql, (1,'jqm'))
rows = cursor.executemany(sql, [(2,'whh'),(3,'cwh'),(4,'tank')]) # 可以一次性插入N多条数据 用[]括起来
```

## sql注入问题  

利用一些语法的特性 书写一些特定的语句实现固定的语法 

日常生活中很多软件在注册的时候都不能含有特殊符号 因为怕你构造出特定的语句入侵数据库 不安全 

敏感的数据不要自己做拼接 给execute就可以了

```python
import pymysql

conn = pymysql.connect(
    host='127.0.0.1',
    port=3306,
    user='root',
    password='jqmkfc039988',
    database='db666',
    charset='utf8'
)
cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
username = input('请输入用户名：').strip()
password = input('请输入密码：').strip()

sql = 'select * from userinfo where name=%s and password=%s;'   # 只能识别%s
row = cursor.execute(sql, (username, password))
if row:
    print('登录成功')
else:
    print('用户名或者密码错误')
```



