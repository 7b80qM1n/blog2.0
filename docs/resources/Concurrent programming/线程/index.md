---

id: Concurrent02

title: 并发编程-线程
---

## 线程理论

```python
"""
进程：资源单位
线程：执行单位
例如：操作系统是一个工厂，进程是一个车间，线程是一个流水线，真正工作的是线程，工作过程中需要的资源由所在的进程提供

每一个进程肯定都自带一个线程
同一个进程内可以创建多个线程
"""

"""
开进程:申请内存空间，“拷贝代码”，消耗资源大
开线程：同一个进程内创建多个进程 无需上述两部操作 ，消耗资源相对较小
"""
```

## 开启线程的两种方式

```python
# 第一种
from threading import Thread
import time

def task(name):
    print(f'{name} is running')
    time.sleep(1)
    print(f'{name} is over')

# 开启线程不需要在main下面执行代码 直接书写就可以
# 但是我们还是习惯性的将启动命令写在main下面
t = Thread(target=task, args=('jqm',))
t.start()  # 创建线程的开销非常小 几乎是代码一执行线程就已经创建了
print('主')


# 第二种
class MyThread(Thread):
    def __init__(self, name):
        """针对双下划线开头双下划线结尾(__init__)方法 统一读成 双下init """
        # 重写了别人的方法，又不知道别人的方法里有啥，你就调用父类的方法
        super().__init__()
        self.name = name

    def run(self):
        print(f'{self.name} is running')
        time.sleep(1)
        print('end')
    
if __name__ == '__main__':
    t = MyThread('jqm')
    t.start()
    print('主')

```

## TCP服务端实现并发的效果 

```python
import socket
from threading import Thread
from multiprocessing import Process

"""
服务端
    1.要有固定的IP和PORT
    2.24小时不断的服务
    3.能够支持并发

从现在开始要养成看源码的习惯
我们前期要立志成为拷贝忍者卡卡西 不需要有任何的创新 
等你拷贝到一定境界了 就可以开发自己的思想了
"""
server = socket.socket()  # 括号里面不写默认是TCP协议
server.bind(('127.0.0.1', 8080))
server.listen(50)

# 讲服务的代码单独封装成一个函数
def func(conn):
    # 通信循环
    while True:
        try:    
            data = conn.recv(1024)
            # 针对linux mac 客户端断开连接后
            if len(data) == 0:break
            print(data.decode('utf-8'))
            conn.send(data.upper())
        except ConnectionRefusedError as e:
            print(e)
            break
    conn.close()
    
# 连接循环
while True:
    conn, addr = server.accept()
    # 叫其他人来服务
    t = Thread(target=func, args=(conn,))
    t.start()
    
"""客户端"""
import socket

client = socket.socket()
client.connect(('127.0.0.1', 8080))

while True:
    client.send(b'hello world')
    data = client.recv(1024)
    print(data.decode('utf-8'))
```

## 线程对象join方法

```python
from threading import Thread
import time

def func(name):
    print(f'{name} is running')
    time.sleep(3)
    print(f'{name} is over')

if __name__ == '__main__':
    t = Thread(target=func, args=('jqm',))
    t.start()
    t.join()  # 主线程等待子线程运行结束后再执行
    print('主')
```

## 同一个进程下的多个线程数据共享

```python
from threading import Thread

money = 100

def func():
    global money
    money = 666
    print(money)  # 666

if __name__ == '__main__':
    t = Thread(target=func)
    t.start()
    t.join()
    print(money)  # 666
```

## 线程对象及其他方法

```python
"""
current_thread().name  # 获取当前线程的名字
active_count()  # 统计当前正在活跃的线程数
"""
```

## 守护线程

```python
"""
主线程运行结束后不会立即结束，会等待所有其他除守护线程结束才会结束
    因为主线程的结束意味着所在的进程的结束
"""
if __name__ == '__main__':
    t = Thread(target=func, args=('jqm',))
    t.daemon = True   # 守护线程
    t.start()
```

## 线程互斥锁

```python
from threading import Thread, Lock
import time

money = 100
mutex = Lock()

def func():
    global money
    mutex.acquire()
    tmp = money
    time.sleep(0.1)
    money = tmp - 1
    mutex.release()

if __name__ == '__main__':
    t_list = []
    for i in range(100):
        t = Thread(target=func)
        t.start()
        t_list.append(t)
    for t in t_list:
        t.join()
    print(money)
```

## GIL全局解释器锁

```python
"""
In CPython, the global interpreter lock, or GIL, is a mutex that prevents multiple 
native threads from executing Python bytecodes at once. This lock is necessary mainly 
because CPython’s memory management is not thread-safe. (However, since the GIL 
exists, other features have grown to depend on the guarantees that it enforces.)

python解释器有多个版本
    Cpython
    Jpython
    Pypypython
但是普遍使用的都是CPython解释器

在CPyhton解释器中GIL是一把互斥锁，用来阻止同一个进程下的多个线程的同时执行
    同一个进程下的多个线程无法利用多核优势!!!
   疑问：python的多线程是不是一点用都没有???无法利用多核优势 
   总结：多进程和多线程都有各自的优势 并且我们后面写项目的时候通常可以在多进程下面再开设多线程 
    这样的话既可以利用多核也可以节省资源消耗  IO密集型-->线程  计算密集型-->进程
因为cpython中的内存管理不是线程安全的
内存管理（垃圾回收机制）
    1.应用计数
    2.标记清楚
    3.分代回收


重点：
    1.GIL不是python的特点而是CPython的特点
    2.GIL是保证解释器级别的数据的安全
    3.GIL会导致同一个进程下的多个线程无法同时执行即无法利用多核优势（*******）
    4.针对不同的数据还是需要加不同的锁处理
    5.解释性语言的通病：同一个进程下多个线程无法利用多核优势
```

## 验证python多线程是否有用

```python
"""
应该结合任务的具体类型再做判断
应该对任务分两种情况讨论

IO密集型
    多线程更加节省资源
计算密集型
    多进程更加合理
    
多进程多线程都是有用的，并且后面的操作都是多进程加上多线程从而达到效率的最大化
```

## 了解内容

### 死锁和递归锁（了解）

**当你知道锁的使用抢锁必须要释放锁，其实你在操作的时候也极其容易产生死锁现象（整个程序卡死，阻塞）**

```python
from threading import Thread, Lock
import time

mutexA = Lock()
mutexB = Lock()
# 类只要加括号多次 产生的肯定是不同的对象
# 如果你想要实现您多次加括号等到的是相同的对象 单例模式

class MyThead(Thread):
    def run(self):
        self.func1()
        self.func2()

    def func1(self):
        mutexA.acquire()
        print(f'{self.name} 抢到A锁')
        mutexB.acquire()
        print(f'{self.name} 抢到B锁')
        mutexB.release()
        print(f'{self.name} 释放B锁')
        mutexA.release()
        print(f'{self.name} 释放A锁')

    def func2(self):
        mutexB.acquire()
        print(f'{self.name} 抢到B锁')
        time.sleep(2)
        mutexA.acquire()
        print(f'{self.name} 抢到A锁')
        mutexA.release()
        print(f'{self.name} 释放A锁')
        mutexB.release()
        print(f'{self.name} 释放B锁')

if __name__ == '__main__':
    for i in range(10):
        t = MyThead()
        t.start()
```

### **递归锁（了解）**

```python
"""
递归锁的特点
    可以被连续的acquire和release
    但是只能被第一个抢到这把锁执行上述操作
    它的内部有一个计数器 每acquire一次计数加一 每release 一次就减一
    只要计数不为0 那么其他人就无法抢到该锁
"""
from threading import Thread, Lock, RLock
import time

mutexA = mutexB = RLock()

# 类只要加括号多次 产生的肯定是不同的对象
# 如果你想要实现您多次加括号等到的是相同的对象 单例模式

class MyThead(Thread):
    def run(self):
        self.func1()
        self.func2()

    def func1(self):
        mutexA.acquire()
        print(f'{self.name} 抢到A锁')
        mutexB.acquire()
        print(f'{self.name} 抢到B锁')
        mutexB.release()
        print(f'{self.name} 释放B锁')
        mutexA.release()
        print(f'{self.name} 释放A锁')

    def func2(self):
        mutexB.acquire()
        print(f'{self.name} 抢到B锁')
        time.sleep(2)
        mutexA.acquire()
        print(f'{self.name} 抢到A锁')
        mutexA.release()
        print(f'{self.name} 释放A锁')
        mutexB.release()
        print(f'{self.name} 释放B锁')

if __name__ == '__main__':
    for i in range(10):
        t = MyThead()
        t.start()
```

### 信号量 （了解）

**信号量在不同的阶段可能对应不同的技术点，在并发编程中信号量指的是锁!!**

```python
"""
那么我们将互斥锁比喻成一个厕所的话，那么信号量就相当于多个厕所
"""
from threading import Thread, Semaphore
import time
import random

sm = Semaphore(5) # 括号内写数字 写几就表示开设几个坑位

def task(name):
    sm.acquire()
    print(f'{name} 正在蹲坑')
    time.sleep(random.randint(1, 5))
    sm.release()

if __name__ == '__main__':
    for i in range(1, 21):
        t = Thread(target=task, args=(f'伞兵{i}号',))
        t.start()
```

### Event事件（了解）

**一些进程/线程需要等待另外一些进程/线程运行完毕之后才能运行，类似于发射信号一样**

```python
from threading import Thread, Event
import time

event = Event()  # 造一个红绿灯

def light():
    print('红灯亮着的')
    time.sleep(3)
    print('绿灯亮了')
    # 告诉等待的人可以走了
    event.set()

def car(name):
    print(f'{name} 车正在等红灯')
    event.wait()   # 等待别人给你发信号
    print(f'{name} 车加油门彪走了')

if __name__ == '__main__':
    t = Thread(target=light)
    t.start()

    for i in range(1,21):
        t = Thread(target=car, args=(f'{i}',))
        t.start()
```

### **线程q（了解）**

```python
"""
同一个进程下多个线程数据是共享的
为什么先同一个进程下还会去使用队列呢
因为队列就是管道+锁，所以用队列还是为了保证数据的安全

"""
import queue
# 我们现在使用的都是只能在本地测试使用的

# 队列q 先进先出
q = queue.Queue(3)
q.put(1)  # 存
q.get()   # 取
q.get_nowait() # 没有数据直接报错
q.get(timeout=3)    # 等到3秒拿不到数据报错
q.full()  # 判断队列是否满了
q.empty()  # 判断队列是否空了

# 堆栈q 先进后出
q = queue.LifoQueue(3)  # last in first out
q.put(1)
q.put(2)
print(q.get())  # 2

# 优先级q  你可以给放入队列中的数据设置进出的优先级
# put括号内放一个元组 第一个放数字表示优先级，需要注意的是 数字越小优先级越高
q = queue.PriorityQueue(3)
q.put((10, '111'))
q.put((-5, '222'))
print(q.get())  # (-5, '222')
```

## 进程池和线程池（掌握）

```python
"""
无论是开设进程也好线程也好 都需要消耗资源 只不过开线程消耗的资源比进程稍微小那么一点而已
我们是不可能做到无限制的开设进程和线程的 因为计算机的硬件跟不上！硬件的开发速度跟不上软件
我们的宗旨应该是在保证计算机能够正常工作的情况下最大限度的利用它
"""
# 池的概念
"""
什么是池?
    池是用来保证计算机硬件安全的情况下最大限度的利用计算机 
    它降低了程序的运行效率但是保证了计算机硬件的安全，从而让你写的程序能够正常运行
"""
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import time
import os
# 线程池
pool = ThreadPoolExecutor()  # 括号内可以传数字 默认会开设当前计算机CPU个数五倍的线程
# 进程池
# pool = ProcessPoolExecutor()  # 括号内可以传数字 默认会开设当前计算机CPU个数的进程
"""
池子造出来之后 里面会固定存在五个线程
这五个线程不会出现重复创建和销毁的过程
"""
def task(n):
    print(n, os.getpid())
    time.sleep(2)
    return n**n

# 异步回调方法 
def call_back(n):
    print(n.result())
"""
任务的提交方式
    同步：提交任务之后原地等待任务的返回结果 期间不做任何事
    异步：提交任务之后不原地等待任务的返回结果 直接继续往下执行
        返回结果如何获取？？
        异步提交任务的返回结果 应该通过回调机制来获取
        回调机制    
            就相当于给每个异步任务绑定了一个方法
            一旦该任务有结果立刻触发方法
"""
if __name__ == '__main__':
    for i in range(20):
        pool.submit(task, i).add_done_callback(call_back)  # 绑定回调机制方法

# 池子对象的办法
pool.shotdown()  # 关闭池子 等待池子中所有的任务运行结束 再继续往后执行代码
```

