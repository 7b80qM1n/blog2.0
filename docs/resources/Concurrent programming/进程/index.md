---

id: Concurrent01

title: 并发编程-进程
---

## **操作系统的发展史**  

**其实主要就是围绕cpu的利用率问题**

第一代（**1940~1955**） 手工操作----穿孔卡片

第二代（**1955~1965**） 磁带存储---批处理系统

第三代(**1955~1965**)	 集成电路,多道程序系统

第四代（**1980~至今**）现代计算机

## 多道技术

```python
"""
单核实现并发的效果

并发：看起来像同时运行的就可以叫并发
并行：真正意义上的同时运行
    
空间与时间上的复用
    空间上
        多个程序共用一套计算机硬件
    时间上
        切换+保存状态
"""
# 切换分为两种情况
# 1.当一个程序遇到IO操作（输入输出读写等等）的时候，操作系统会立刻剥夺该程序的CPU执行权限（提高了cpu的利用率，并且是不影响程序的执行效率）
# 2.当一个程序长时间占用cpu，操作系统也会立刻剥夺该程序的cpu执行权限（降低了程序的运行效率，但是玩出了并发的效果）
```

## 进程

```python
"""
程序就是一堆死代码，'死'
进程则是正在执行的过程， '活'
"""

# 进程的调度算法
"""
先来先服务调度算法
短作业优先调度算法
时间片轮转法+多级反馈队列
"""
```

## 进程运行的三状态图

```python
"""
就绪态：一切程序必须要先经过就绪态才能进入运行态
运行态：正在被cpu执行
阻塞态：程序遇到IO操作了
理想情况：我们希望我们开发的程序一直处于就绪态和运行态之间
"""
```

## 两对重要概念

### 同步与异步

```python
"""任务的提交方式
同步
    任务提交之后原地等待任务的返回结果期间不做任何事情
异步
    任务提交之后不原地等待任务的返回结果直接执行下一行代码
        结果由异步回调机制做处理
```

### 阻塞非阻塞

```python
"""程序的运行状态
阻塞：阻塞态
非阻塞：就绪态，运行态
```

**上面的两对概念通常会组合出现，但是最常用的就是异步加非阻塞**

## 开启进程的两种方式

```python
from mutiprocessing import process

# 1.类实例化产生对象
from multiprocessing import Process
import time
def func(name):
    print(f'{name} is running')
    time.sleep(3)
    print(f'{name} is over ')

if __name__ == '__main__':
    # 1.创建一个对象
    p = Process(target=func, args=('jqm',))
    # 容器类型哪怕里面只有一个元素，建议都用逗号隔开
    # 2.开启进程
    p.start()  # 告诉操作系统帮你创建一个进程
    print('主进程')
# 2.类的继承  run方法
from multiprocessing import Process
import time

class MyProcess(Process):
    def run(self):
        print('hello')
        time.sleep(1)
        print('hi')

if __name__ == '__main__':
    p = MyProcess
    p.start()
    print('主进程')

"""
在windows里面开启进程的代码一定要写在main代码块内
创建一个进程就是在内存空间中申请一块内存空间将需要的代码丢进去
"""
```

**进程间数据是相互隔离的（默认情况下）**

## 进程对象和其他方法

```python
"""
一台计算机上面运行着很多进程，那么计算机是如何区分并管理这些进程服务端的呢？
计算机会给每一个运行的进程分配一个PID号
如何查看
    windows电脑：进入cmd输入tasklist即可查看，tasklist|findstr PID号查看具体进程
        mac电脑：进入终端之后输入pa aux，pa aux|grep PID号查看具体的进程
"""
from multiprocessing import Process, current_process
print(current_process().pid)  # 查看当前进程的进程号

import os
os.getpid()  # 查看当前进程进程号
os.getppid()  # 查看当前进程的父进程进程号


p = Process(target=函数名)
p.terminate()  # 杀死当前进程
# 是操作系统帮你去杀死当前进程，但是需要一定的时间，而代码的运行速度极快
time.sleep(0.1)
print(p.is_alive())  # 判断当前进程是否存活
```

## 僵尸进程和孤儿进程

```python
"""
僵尸进程：进程结束后不会立刻释放占用的资源（PID），会保留一段时间供父进程查看
孤儿进程：子进程存活，父进程意外死亡，孤儿进程操作系统会自动回收相应资源
"""
```

## 守护进程

```python
"""
被守护进程结束之后，守护进程立刻也跟着结束（陪葬）
"""
from multiprocessing import Process
import time

def func(name):
    print(f'{name}正在活着')
    time.sleep(3)
    print(f'{name}正在死亡')

if __name__ == '__main__':
    p = Process(target=func, args=('子进程',))
    p.daemon = True  # 将进程P设置成守护进程 这一句一定要放在start方法上面才能有效否则会直接报错
    p.start()
    print('主进程死亡')
```

## 互斥锁

多个进程操作同一份数据的时候，会出现数据错乱的问题

针对上述问题，解决方法就是加锁处理：**将并发变成串行，牺牲效率但是保证了数据的安全**

注意： 只在操作数据的部分加锁即可，锁尽量不要自己去处理  很容易造成死锁现象

拓展：行锁  表锁

行锁：操作表格中的一行数据的时候其他人都不能操作

表锁：操作一张表的时候其他都不能操作

```python
from multiprocessing import Process, Lock
import time
import json
import random

'''文件名：data，内容：{"ticket_num":1}'''

# 查票
def search(i):
    # 文件操作读取票数
    with open('data', 'r', encoding='utf-8')as f:
        dic = json.load(f)
    print(f'用户{i}查询余票：{dic.get("ticket_num")}')

# 买票  1.先查  2.再买
def buy(i):
    # 先查票
    with open('data', 'r', encoding='utf-8')as f:
        dic = json.load(f)
    # 模拟网络延迟
    time.sleep(random.randint(1, 2))
    # 判断当前是否有票
    if dic.get("ticket_num") > 0:
        # 修改数据库，买票
        dic["ticket_num"] -= 1
        # 写入数据库
        with open('data', 'w', encoding='utf-8')as f:
            json.dump(dic, f)
            print(f'用户{i}买票成功')
    else:
        print(f'用户{i}买票失败')

# 整合上面两个函数
def run(i, mutex):
    search(i)
    # 给买票环节加锁处理
    # 抢锁
    mutex.acquire()

    buy(i)
    # 释放锁
    mutex.release()

if __name__ == '__main__':
    # 在主进程中生成一把锁 让所有的子进程抢 谁先抢到谁先买票
    mutex = Lock()
    for b in range(1, 11):
        p = Process(target=run, args=(b, mutex))
        p.start()
```

## 队列Queue

**队列：先进先出**

**堆栈：先进后出**

```python
from multiprocessing import Queue

# 创建一个队列
q = Queue(5)  # 括号内可以传数字 表示生成的队列最大可以同时存放的数据量

# 往队列中存数据 当数据满的时候如果还有数据要放程序会阻塞，直到有位置
q.put(111)
print(q.full())     # 判断当前队列是否满了
print(q.empty())    # 判断当前队列是否为空了

# 往队列中取数据 队列中如果已经没有数据的话，get方法会原地阻塞
v1 = q.get()
# v2 = q.get_nowait()     # 没有数据直接报错queue.Empty
# v2 = q.get(timeout=3)   # 没有数据之后原地等待三秒之后再报错，queue.Empty
try:
    v2 = q.get(timeout=3)
    print(v2)
except Exception as e:
    print('一滴都没有了')

"""
q.full()
q.empty()
q.get_nowait()
在多进程情况下是不精确的
"""
```

## IPC机制

**进程和进程之间是无法直接交互的**

**但是可以通过队列或者管道实现数据交互 队列=管道+锁**

**本地测试的时候才可能用到Queue，实际生产用的都是别人封装好的功能非常强大的工具 redis kafka RQ**

```python
from multiprocessing import Queue, Process
"""
研究思路
    1.主进程和子进程借助于队列通信
    2.子进程跟子进程借助于队列通信
"""

def producer(q):
    q.put('我是23号技师 很高兴为您服务')

def consumer(q):
    print(q.get())

if __name__ == '__main__':
    q = Queue()
    p = Process(target=producer, args=(q,))
    p1 = Process(target=consumer, args=(q,))
    p.start()
    p1.start()
```

## 生产者消费者模型

**生产者+消息队列+消费者**

```python
"""
生产者：生产数据
消息队列：临时存放数据
消费者：拿数据处理数据
为何要有消息队列的存在 是为了解决供需不平衡的问题
"""
# JoinableQueue
"""
可以被等待的Q ，你在往队列放数据的时候，内部有一个计数器自动加1
你在往队列去数据的时候，内部有一个计数器自动减1
q.join()  当计数器为0的时候才继续往运行
"""
```

## 
