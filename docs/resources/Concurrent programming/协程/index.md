---

id: Concurrent03

title: 并发编程-协程+IO
---

```python
"""
进程：资源单位
线程：执行单位
协程：单线程下实现并发  
    多道技术：切换 + 保存状态
    代码级别检测IO 一旦遇到IO了 在代码级别完成切换
    这样给CPU的感觉是这个程序一直在运行 没有IO 从而提升程序的运行效率
    这个概念完全是程序员YY出来的  根本不存在
一味的切换+保存状态也有可能会降低程序的效率 例如 计算密集型
"""
```

## 1.gevent模块（了解）

```python
from gevent import monkey;monkey.patch_all()
import time
from gevent import spawn

"""
gevent模块本身无法检测常见的一些IO操作 在使用的时候需要你额外的导入一句话
from gevent import monkey
monkey.patch_all()
又由于上面的两句话在使用gevent模块的时候是肯定要导入的 所以还支持简写
from gevent import monkey;monkey.patch_all()
"""

def heng():
    print('函数1正在运行中')
    time.sleep(2)
    print('函数1还在运行')

def ha():
    print('函数2正在运行中')
    time.sleep(3)
    print('函数2还在运行')

start_time = time.time()
# 同步情况下
# heng()
# ha()
# print(time.time()-start_time)  # 5.0384955406188965
# gvent模块下切换+保存状态 提高效率
g1 = spawn(heng)
g2 = spawn(ha)
g1.join()
g2.join()
print(time.time()-start_time)  # 3.033905506134033
```

## 2.协程实现TCP服务端的并发

```python
"""服务端"""
from gevent import monkey;monkey.patch_all()
import socket
from gevent import spawn

def server(ip, port):
    server = socket.socket()  # 括号里面不写默认是TCP协议
    server.bind((ip, port))
    server.listen(5)
    while True:
        conn, addr = server.accept()
        spawn(communication, conn)

def communication(conn):
    while True:
        try:
            data = conn.recv(1024)
            # 针对linux mac 客户端断开连接后
            if len(data) == 0: break
            print(data.decode('utf-8'))
            conn.send(data.upper())
        except ConnectionRefusedError as e:
            print(e)
            break
    conn.close()

if __name__ == '__main__':
    g1 = spawn(server, '127.0.0.1', 8080)
    g1.join()
    
"""客户端"""
from threading import Thread, current_thread
import socket

def x_client():
    client = socket.socket()
    client.connect(('127.0.0.1', 8080))
    n = 0
    while True:
        msg = f'{current_thread().name, n} say hello '
        n += 1
        client.send(msg.encode('utf-8'))
        data = client.recv(1024)
        print(data.decode('utf-8'))

if __name__ == '__main__':
    for i in range(500):
        t = Thread(target=x_client)
        t.start()
```

## 总结

```python
"""
我们可以通过
    多进程下面开设多线程，多线程下面开设协程，从而使我们的程序执行效率提升
"""
```

## IO模型

### **1.****阻塞IO(blocking IO)**

```python
"""
在服务端开设多进程或者多线程 进程池和线程池 其实还是没有结局IO问题 
该等的地方还是得等 没有规避  只不过多个人等待 彼此互不干扰
"""
```

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210407193302.png)

### 2.非阻塞IO(non-blocking IO)

```python
"""
虽然非阻塞IO给你的感觉非常的牛逼 自己检测IO  自己切换 实现服务端的并发 
但是该模型会长时间占用着CPU 并且不干活（占着茅坑不拉屎）就是让CPU不停的空转
我们实际应用中也不会考虑使用非阻塞IO模型
"""
```

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210407193330.png)

### 3.多路复用IO(IO multiplexing)

```python
"""
当监管的对象只有一个的时候 多路复用IO连阻塞IO都比不上!!
但是IO多路复用可以一次性监管很多个对象
监管： server conn
监管机制是操作系统本身就有的 如果你想要用该监管机制（select）
需要你导入对应的select模块
"""
"""
监管机制:
    select机制  windows linux都有
    poll机制 只有linux有 poll和select都可以监管对个对象 但是poll监管的数量更多
上述select和poll机制其实都不是很完美 当监管对象特别多的时候 可能会出现极大的延时响应
    epoll机制 只有linux有 它给每一个监管对象都绑定一个回调机制 一旦有响应 回调机制就会立刻发起提醒
    
针对不同的操作系统还需要考虑不同的检测机制 书写代码太繁琐 有一个能够根据你跑的平台不同自动帮你选择对应的监管机制-->selectors模块
"""
```

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210407193401.png)

### 4.异步IO(Asynchronous I/O)

```python
"""
异步IO模型是所有模型中效率最高的 也是使用最广泛的
相关的模型和框架
    模块：asyncio 模块
    异步框架：sanic tronado twisted    特点就是速度快!!!
"""
```

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210407193426.png)

## 四个IO模型对比

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210407193817.png)