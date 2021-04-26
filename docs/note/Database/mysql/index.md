---

id: Database-mysql

title: mysql
---

## 本质

其实每个人都可以开发一款数据库软件 因为它仅仅就是一款基于网络通信的应用程序 也就意味着数据库软件其实有很多很多

### 关系型数据库

数据之间彼此有关系或者约束  存储数据的表现形式是以表格存储        如 MySQL、oracle、db2、access、sql server     

### 非关系型数据库        

存储数据通常都是以k、v键值对的形式        如 redis、mongdb、memcache

### 常见软件的默认端口号

```
MySQL    3306
redis    6379
mongodb  27017
django   8000
flask    5000
```

## sql语句初识

连接服务端的命令

```python
mysql -h 127.0.0.1 -P 3306 -uroot -p    
# 可以简写   
mysql -uroot -p
```

客户端退出 退出命令加不加分号都可以执行 quit 或 exit

```python
mysql> quit
Bye
```

## 其他设置

windows将mysql服务端制作成系统服务

```
mysqld --install
移除mysql系统服务
mysqld --remove
设置密码
mysqladmin -uroot -p原密码 password 新密码
```

重置密码

```
1.先关闭当前mysql服务端
命令行的方法启动（让mysql跳过用户名密码验证功能）
    mysqld --skip-grant-tables
2.直接以无密码的方式连接
    mysql -uroot -p  直接回车
3.修改当前用户的密码
    update mysql.user set password=password(新密码) where user='root' and host='localhost';
4.立刻将修改数据刷到硬盘
    flush privileges;
5.关闭当前服务端 然后以正常校验授权表的形式启动
```

配置文件

ini结尾的一般都是配置文件  程序启动会先加载配置文件中的配置之后才真正的启动

自己配置需要你新建一个my.ini的配置文件  修改配置文件后一定要重启服务才能生效

```
[mysqld]
character-set-server=utf-8
collation-server=utf-8_general_ci
[client]
default-character-set=utf-8
[mysql]
default-character-set=utf-8
```

## 基本sql语句

### 针对库的增删查改

- 增

  ```python
  create database 库名;
  create database 库名 charset='gbk';
  create database 库名 default charset=utf8;
  ```

  查

  ```python
  show databases;              查所有
  show create databases 库名;  查单个
  ```

  改

  ```python
  alter database 库名 charset='utf-8';
  ```

  删

  ```python
  drop database 库名;
  ```

### 针对表的增删改查

在操作表（文件）的时候 需要指定所在的库（文件夹）

查看当前你所在的库的名字

```python
select database();
```

切换库

```python
use 库名;
```

- 增

  ```python
  create table 表名(字段名1 类型(宽度) 约束条件 例如：id int,name char(4))
  ```

  查

  ```python
  show tables;    查看当前库下面所有的表名
  show create table 表名;
  describe 表名;  支持简写 desc 表名;   (建议用这个)
  ```

  改

  ```python
  alter table 表名 modify name char(16);
  ```

  删

  ```python
  drop table 表名;
  ```

也可以用绝对路径的形式操作不同的库

```python
create table 库名.表名(id int);
```

### 针对数据的在增删改查

一定要先有库 有表 最后才能操作记录

- 增

  ```python
  insert into 表名 values(1,'jqm')
  insert into 表名 values(1,'whh'),(2,'cwh'),(3,'tank');
  小知识点：插入数据的时候可以指定字段
  insert into 表名(name,id) values('jqm',1)
  ```

  查

  ```python
  select * from 表名;     该命令当数据量特别大的时候不建议使用
  select * from 表名\G;   当表字段特别多 展示的时候错乱 可以使用\G分行展示
  select id,name from 表名;
  ```

  改

  ```python
  update 表名 set name='修改的内容' where id > 1;
  ```

  删

  ```python
  dalete from 表名 where id > 1;
  delete from 表名 where name='jqm';
  delete from 表名;  将表的所有数据清空
  ```

## mysql主要存储引擎

```python
innodb     是MySQL5.5版本及之后默认的存储引擎 支持事务 行锁 外键 数据更加的安全
myisam     是MySQL5.5版本之前默认的存储引擎 虽数据安全没有innodb可靠 但查询速度上较innodb更快
menmory    内存引擎（数据全部存放在内存中）断电数据丢失 临时数据存储
blackhole  无论存什么，都立刻消失 黑洞
```

查看MySQL所有的存储引擎

```python
show engines;
```

创建innodb存储引擎的表

```python
create table t1(id int) engine=innodb;
```

## 创建表的完整语法

```python
create table 表名(
    字段名1 类型(宽度)  约束条件，
    字段名2 类型(宽度)  约束条件，
    字段名3 类型(宽度)  约束条件                
);
1.在同一张表中字段名不能重复
2.宽度和约束条件是可选的可写可不写 而字段名和字段类型是必须写的约束条件写的话也支持多个 
        字段名1 类型（宽度） 约束条件1 约束条件2... create table t1(id) 报错
3.最后一行不能有逗号
```

- 宽度

  ```python
  是用来限制数据的存储 特例：只有整型括号里面的数字不是表示限制位数
      一般情况下指的是对存储数据的限制 create table t1(name char); 默认宽度是1
  针对不同的版本会出现不同的效果
      5.6版本默认没有开启严格模式 规定智能寸一个字符你给了多少个字符那么我会自动帮你截取
      5.7版本及以上或者开启了严格模式 那么规定只能存几个 就不能超，一但超出范围立刻报错
  ```

- 约束条件 是宽度的基础之上增加的额外的约束 null not null 

  ```python
  create table t1(id int,name char not null);
  ```

- 严格模式 

  如何查看

  ```python
  show variables like "%mode"; 
  模糊匹配/查询 关键字 like  %：匹配任意多个字符 _:匹配任意单个字符
  ```

  修改严格模式

  ```python
  set session  只在当前窗口有效
  set global   全家有效
  set global sql_mode = 'STRICT_TRANS_TABLES';  将多余的空格剔除  修改完重进
  set global sql_mode = 'STRICT_TRANS_TABLES,PAD_CHAR_TO_FULL_LENGYH';  改回来
  ```

## mysql基本数据类型

### 整形

分类 TINYINT SMALLINT MEDUIMINT INT BIGINT    

默认情况下都是带符号的 整型约束条件之无符号unsigned 无符号

### 浮点型

分类 FLOAT DOUBLE DECIMAL

存储限制

```python
float(255,30)    总共255位  小数部分占30位   身高 体重 薪资
double(255,30)   总共255位  小数部分占30位
decimal(65,30)   总共65位   小数部分占30位   科学计算 原子弹
float < double < decimal  结合场景 三者都能使用
```

### 字符类型

| 类型                    | 优点                                        | 缺点         | 说明                                      |
| ----------------------- | ------------------------------------------- | ------------ | ----------------------------------------- |
| char:定长 char(4)       | 存取都很简单 直接按照固定的字符存取数据即可 | 浪费空间     | 超过四个字符直接报错 不够四个字符空格补全 |
| varchar:变长 varchar(4) | 省空间 存的时候需要制作报头                 | 存取比较麻烦 | 数据超过四个字符直接报错 不够有几个存几个 |

char_length统计字段长度

```python
select char_length(name) from t1;
```

### 时间类型

| 类型 | date   | datetime     | time   | year |
| ---- | ------ | ------------ | ------ | ---- |
|      | 年月日 | 年月日时分秒 | 时分秒 | 年   |

栗子:

```python
create table student(id int,name varchar(16),born_year year,birth date,study_time time,reg_time datetime);
```

### 枚举与集合类型

```python
分类：枚举（enum） 多选一 （场景：性别）只能选择一个
      集合（set） 多选多 （场景：爱好）可以多个或者一个
具体使用
    create table teachar(
        id int,
        name char(16),
        gender enum('male','female'),
        hobby set('read','tea','dbj')
    );
```

### 约束条件补充

default默认值 可以设置默认值 比如男生比较多 性别默认男

```python
create table 表名(id int,name char(16),gender enum('male','female') default 'male');
```

unique单例唯一  比如id号是唯一的 必须是不同的

```python
create  table 表名(id int unique,name char(16));
```

unique联合唯一  比如ip地址和端口号合起来是唯一的 必须是不同的

```python
create table 表名(id int,ip char(16),port int,unique(ip,port));
```

primary key主键 

1. 约束效果相当于 not null + unique   非空且唯一 是Innodb存储引擎组织数据的依据 

   ```python
   create table 表名(id int primary key);
   ```

2. Innodb存储引擎在创建表的时候必须有primary key 它类似于目录 能够帮助提升查询效率并且也是建表的依据

   一张表有且只有一个主键 如果你没有设置主键 那么会从上往下搜索直到遇到一个非空且唯一的字段将它自动升级为主键

   如果表中没有主键也没有其他任何的非空且唯一字段 那么Innodb会采用自己内部提供的一个隐藏字段作为主键 隐藏意味无法使用

3. 一张表通常都应该有一个主键字段 并且通常将id/uid/sid字段作为主键

单个字段主键

```python
create table 表名(id int primary key,name char(16));
```

联合主键（多个字段联合起来作为表的主键 实质还是一个主键）

```python
create table 表名(ip char(16),port int,primary key(ip,port));
```

auto_increment自增

通常都是加在主键上的 不能给普通字段加 当编号太多 人为维护太麻烦 所以自增 比如id自动+1  

创建表的(数据的唯一标识id、uid、sid)字段的时候 后面必须加primary key auto_increment

```python
create table 表名(id int primary key auto_increment,name char(16));
delete from 表名  删除表中数据的时候 主键的自增不会停止
truncate 表名     清空表数据并且重置主键
```

## 表与表之间的关系

### 外键

外键就是用来在代码层面真正的实现表与表之间的关系  foreign key

### 表与表之间建立关系

表与表之间只有三种关系 一对多 多对多 一对一 

- 一对多        

  针对一对多 外键字段建在多的一方    

- 多对多        

  关系表无需外键 单独开设一张表专门用来存储关系    

- 一对一        

  外键字段建在任意方均可 但是推荐你建在查询频率较高的表中

栗子:

```python
一对多判断 图书与出版社
    先站在图书表    一本书能否被多个出版社出版    不行! 版权问题
    再站在出版社表  一个出版社可以出版多本书      行!
    结论：单向的一对多成立 那么表关系就是一对多 书是多的一方
外键带来的约束
    1.在创建表的时候一定要先创建被关联表
    2.在插入数据的时候也要先插入被关联表数据
    3.操作数据的时候 会出现多种限制 同步更新 同步删除
create 被关联表名(id int);
create 表名(id int,publish_id int,
    foreign key(publish_id) reference 被关联表名(被关联字段)
    on update cascade  # 同步更新
    on delete cascade  # 同步删除
    );
多对多的判断  图书和作者
    先站在图书表  一本书可不可以有多个作者    可以！
    再站在作者表  一个作者可不可以写多本图书   可以！
    结论：图书和作者是双向的一对多 那么表关系就是 多对多  一定要单独开设一张新的表存储关系
 表1  create table book(id int...)
 表2  create table author(id int...)
存储表 create table book2author(id ...
    book_id int,author_id int,
    foreign key(book_id) references book(id)
    on update cascade on delete cascade,
    foreign key(author_id) references author(id)
    on update cascade on delete cascade   
);
判断一对一 QQ用户表 等等 
    当你一张表中的数据并不都是频率需要用到的情况 但是字段又特别的多 
    那么这个时候你就应该考虑分表 然后做一对一的关联 节省查询时间和传输时间
    create table author(
        id...authordetail_id int unique,
        foreign key(authordetail_id) references authordetail(id)
        on update cascade on delete cascade            
    );
    create table authordetail(id...);
```

## 修改表

修改表名

```python
alter table t1 rename new_t1; 
```

增加字段

```python
alter table 表名 add 字段名 字段类型(宽度) 约束条件;
alter table 表名 add 字段名 字段类型(宽度) 约束条件 first;
alter table 表名 add 字段名 字段类型(宽度) 约束条件after 字段名;
```

删除字段

```python
alter table 表名 drop 字段名;
```

修改字段

```python
alter table 表名 modify 字段名 字段类型(宽度) 约束条件;
alter table 表名 change 旧字段名 新字段名 字段类型(宽度) 约束条件;
```

## 复制表

我们sq1语句查询的结果其实也是一张虚拟表

```python
create table 表名 select * from 旧表;   不能复制主键 外键
create table new_dep2 select * from dep where id > 3;
```

## where筛选条件

作用：对整体数据的一个筛选操作

栗子:

- 查询id大于等于3小于等于6的数据

  ```python
  select id,name,age from emp where id>=3 and id<=6;
      select id,name,age from emo where id between 3 and 6; between 两者之间  结果和上面一致 
  ```

  查询id小于3或者id大于6的数据

  ```python
  select * from emp where id not between 3 and 6;
  ```

  查询薪资是20000或者18000或者17000的数据  

  ```python
  select * from emp where salary=20000 or salary=18000 or salary=17000;  这样写太麻烦
      select * from emp where salary in (20000,18000,17000);   结果等同于这个  建议用这个
  ```

  查询薪资不在20000，18000，17000范围的数据  (不在 not in)

  ```python
  select * from emp where salary not in (20000,18000,17000);
  ```

  查询员工姓名中包含字母o的员工的姓名和薪资

  ```python
  select name,salary from emp where name like '%o%';   模糊查询like  % 匹配任意多个字符
  ```

  查询员工姓名是由四个字符组成的 姓名和薪资

  ```python
  select name,salary from emp where name like '____';  模糊查询like  _ 匹配任意单个字符
      select name,salary from emp where char_length(name) = 4;   这样写也可以
  ```

  查询岗位描述为空的员工姓名和岗位名  针对mull不能用等号 用is

  ```python
  select name,port from emp where post_comment is Null;
  ```

## group by分组 

分组实际应用场景 如 男女比例 部门平均薪资 国家之间数据统计  应用场景非常多

需要分组的场景 关键字 每个 平均 最高 最低 .....

```python
select * from emp group by post;  按照post分组
```

分组之后 最小可操作单位应该是组 不再是组内的单个数据 不应该考虑单个数据 而应该以组为操作单位    

上述命令在你没有设置严格模式的时候是可正常执行的 返回的是分组之后 每个组的第一条数据    但是这不符合分组的规范；

分组之后 没办法直接获取组内的单个数据 如果设置了严格模式 那么上述命令会直接报错

```python
set global sel_mode = 'strict_trans_tables,only_full_group_by';  设置严格模式
```

设置严格模式之后 分组 默认只能拿到分组的数据 其他字段不能直接获取 需要借助于一些方法

### 聚合函数 min max avg sum count

栗子:

- 获取每个部门的最高薪资

  ```python
  select post,max(salary) from emp group by post;
          as可以给字段起别名
          select post as '部门',max(salary) as '最高薪资' from emp group by post;  
          as还可以给表临时起别名
          select t1.id,t1.name from emp as t1; 
  ```

  获取每个部门的最低薪资

  ```python
  select post,min(salary) from emp group by post;
  ```

  获取每个部门的平均薪资

  ```python
  select post,avg(salary) from emp group by post;
  ```

  获取每个部门的薪资总和

  ```python
  select post,sum(salary) from emp group by post;
  ```

  获取每个部门的人数

  ```python
  select post,count(id) from emp group by post;
  ```

  group_concat获取分组之后的其他字段 还支持拼接操作

  查询分组之后的部门名称和每个部门下所有的员工姓名

  ```python
  select post,group_concat(name) from emp group by post;
  select post,group_concat(name,'拼接的字符',salary) from emp group by post;
  ```

  不分组的时候

  ```python
  select group_concat('Name',name),concat('sal:',salary) from emp;
  ```

### 分组补充

分组注意事项

```python
where先对整体数据进行过滤之后再分组操作
where筛选条件不能使用聚合函数
关键字where和group by同时出现的时候group by 必须在where的后面
select max(salary) from emp;  不分组默认整体就是一组
统计各部门年龄在30岁以上的员工的平均薪资
    1.先求所有年龄大于30岁的员工
    select * from emp where age>30;
    2.再对结果进行分组
    select * from emp where age>30 group by post;
    3.部门的平均薪资
    select post,avg(salary) from emp where age>30 group by post;
```

分组之后的筛选条件having的语法跟where是一致的 只不过having是在分组之后进行的过滤操作 

即having是可以直接使用聚合函数的

统计各部门年龄在30岁以上的员工的平均工资并且保留平均薪资大于10000的部门

```python
select post,avg(salary) from emp where age > 30 group by post having avg(salary) > 10000;
```

## distinct去重

一定注意 必须是完全一样的数据才可以去重 不要将主键忽视了  有主键存在的情况下 是不可能去重的

```python
select distinct age from emp;
```

## order by排序

```python
secelt * from emp order by salary;               默认是升序asc  
secelt * from emp order by salary desc;          可以修改为降序
先按照age降序排 如果碰到age相同 则再按照salary升序排
select * from emp oerder by age desc,salary asc;
1.统计各部门年龄在10岁以上的员工平均工资并且保留平均薪资大于1000的部门，然后对平均工资降序排序
select post,avg(salary) from emp where age > 10 group by post 
    having avg(salary) > 1000order by avg(salary) desc;
```

## limit限制展示条数

针对数据过多的情况 我们通常做分页处理

  ```python
select * from 表名 limit 3;      只展示三条数据
select * from 表名 limit 5,5;   第一个参数是起始位置 第二个参数是展示条数
  ```

## 正则regexp

```python
select * from 表名 where name regexp '正则表达式';
```

## 多表查询

联表操作

```python
select * from 表名1,表名2;  笛卡尔积(了解)
inner join 内连接   只拼接两种表中都公有的部分
    select * from 表名1 inner join 表名2 on 表名1.字段 = 表名2.字段;
left join 左连接   左表数据全部展示 没有对应的就用NULL补全
right join 右连接  右表数据全部展示 没有对应的就用NULL补全
union 全连接       左右表数据全部展示 没有对应的就用NULL补全
```

子查询

```python
子查询就是我们平时解决问题的思路 分步处理  将一张表的查询结果当作另外一条sql语句的查询条件
（当作条件的时候 用括号括起来）
select * from emp where id in (select id from dep);
关键字exists（了解）
    只返回布尔值 True False 返回True的时候外层查询语句执行 返回False的时候不执行
```

## 总结

1. 书写sql语句的时候 select后面先用*占位 之后写完再查
2. 在IE较为复杂的sql语句的时候 不要想着一口气写完 写一点查一点看一点再写
   （只要涉及到数据查询相关的语法都不应该一次性写完 不太现实）
3. 在做多表查询的时候 联表操作和子查询你可能会结合使用



