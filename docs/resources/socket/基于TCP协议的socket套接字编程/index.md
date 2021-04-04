---
id: socket04
title: 
---

## 一、什么是Scoket


Socket是应用层与TCP/IP协议族通信的中间软件抽象层，它是一组接口。在设计模式中，Socket其实就是一个门面模式，它把复杂的TCP/IP协议族隐藏在Socket接口后面，对用户来说，一组简单的接口就是全部，让Socket去组织数据，以符合指定的协议。

所以，我们无需深入理解tcp/udp协议，socket已经为我们封装好了，我们只需要遵循socket的规定去编程，写出的程序自然就是遵循tcp/udp标准的。


![121-基于TCP协议的套接字编程-socket层.jpg?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrnjkhodkj30f20d8js4.jpg)

- 注意：也有人将socket说成ip+port，ip是用来标识互联网中的一台主机的位置，而port是用来标识这台机器上的一个应用程序，ip地址是配置到网卡上的，而port是应用程序开启的，ip与port的绑定就标识了互联网中独一无二的一个应用程序，而程序的pid是同一台机器上不同进程或者线程的标识。

### 二、套接字发展史及分类

套接字起源于 20 世纪 70 年代加利福尼亚大学伯克利分校版本的 Unix,即人们所说的 BSD Unix。 因此,有时人们也把套接字称为“伯克利套接字”或“BSD 套接字”。一开始,套接字被设计用在同 一台主机上多个应用程序之间的通讯。这也被称进程间通讯,或 IPC。套接字有两种（或者称为有两个种族）,分别是基于文件型的和基于网络型的。

### 2.1 基于文件类型的套接字家族

套接字家族的名字：AF_UNIX

unix一切皆文件，基于文件的套接字调用的就是底层的文件系统来取数据，两个套接字进程运行在同一机器，可以通过访问同一个文件系统间接完成通信

### 2.2 基于网络类型的套接字家族

套接字家族的名字：AF_INET

(还有AF_INET6被用于ipv6，还有一些其他的地址家族，不过，他们要么是只用于某个平台，要么就是已经被废弃，或者是很少被使用，或者是根本没有实现，所有地址家族中，AF_INET是使用最广泛的一个，python支持很多种地址家族，但是由于我们只关心网络编程，所以大部分时候我么只使用AF_INET)

## 三、套接字工作流程

一个生活中的场景。你要打电话给一个朋友，先拨号，朋友听到电话铃声后提起电话，这时你和你的朋友就建立起了连接，就可以讲话了。等交流结束，挂断电话结束此次交谈。 生活中的场景就解释了这工作原理。

![121-基于TCP协议的套接字编程-socket流程.jpg?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrnjqumlcj30da0dnwex.jpg)

先从服务器端说起。服务器端先初始化Socket，然后与端口绑定(bind)，对端口进行监听(listen)，调用accept阻塞，等待客户端连接。在这时如果有个客户端初始化一个Socket，然后连接服务器(connect)，如果连接成功，这时客户端与服务器端的连接就建立了。客户端发送数据请求，服务器端接收请求并处理请求，然后把回应数据发送给客户端，客户端读取数据，最后关闭连接，一次交互结束，使用以下Python代码实现：

```python
import socket

# socket_family 可以是 AF_UNIX 或 AF_INET。socket_type 可以是 SOCK_STREAM 或 SOCK_DGRAM。protocol 一般不填，默认值为 0
socket.socket(socket_family, socket_type, protocal=0)

# 获取tcp/ip套接字
tcpSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 获取udp/ip套接字
udpSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 由于 socket 模块中有太多的属性。我们在这里破例使用了'from module import *'语句。使用 'from socket import *'，我们就把 socket 模块里的所有属性都带到我们的命名空间里了，这样能大幅减短我们的代码
tcpSock = socket(AF_INET, SOCK_STREAM)
```

![121-基于TCP协议的套接字编程-小兵潮.gif](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrnjz17rvg30bj06dhdw.gif)

### 3.1 服务端套接字函数

| 方法       | 用途                                         |
| ---------- | -------------------------------------------- |
| s.bind()   | 绑定(主机,端口号)到套接字                    |
| s.listen() | 开始TCP监听                                  |
| s.accept() | 被动接受TCP客户的连接,(阻塞式)等待连接的到来 |

### 3.2 客户端套接字函数

| 方法           | 用途                                                    |
| -------------- | ------------------------------------------------------- |
| s.connect()    | 主动初始化TCP服务器连接                                 |
| s.connect_ex() | connect()函数的扩展版本,出错时返回出错码,而不是抛出异常 |

### 3.3 公共用途的套接字函数

| 方法            | 用途                                                         |
| --------------- | ------------------------------------------------------------ |
| s.recv()        | 接收TCP数据                                                  |
| s.send()        | 发送TCP数据(send在待发送数据量大于己端缓存区剩余空间时,数据丢失,不会发完) |
| s.sendall()     | 发送完整的TCP数据(本质就是循环调用send,sendall在待发送数据量大于己端缓存区剩余空间时,数据不丢失,循环调用send直到发完) |
| s.recvfrom()    | 接收UDP数据                                                  |
| s.sendto()      | 发送UDP数据                                                  |
| s.getpeername() | 连接到当前套接字的远端的地址                                 |
| s.getsockname() | 当前套接字的地址                                             |
| s.getsockopt()  | 返回指定套接字的参数                                         |
| s.setsockopt()  | 设置指定套接字的参数                                         |
| s.close()       | 关闭套接字                                                   |

### 3.4 面向锁的套接字方法

| 方法            | 用途                         |
| --------------- | ---------------------------- |
| s.setblocking() | 设置套接字的阻塞与非阻塞模式 |
| s.settimeout()  | 设置阻塞套接字操作的超时时间 |
| s.gettimeout()  | 得到阻塞套接字操作的超时时间 |

### 3.5 面向文件的套接字的函数

| 方法         | 用途                         |
| ------------ | ---------------------------- |
| s.fileno()   | 套接字的文件描述符           |
| s.makefile() | 创建一个与该套接字相关的文件 |

![121-基于TCP协议的套接字编程-打电话.jpg?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrnk104poj30c80c874e.jpg)

## 四、基于TCP协议的套接字编程(简单)

- 可以通过`netstat -an | findstr 8080`查看套接字状态

### 4.1 服务端

```python
import socket

#1、买手机
phone = socket.socket(socket.AF_INET,
                      socket.SOCK_STREAM)  #tcp称为流式协议,udp称为数据报协议SOCK_DGRAM
# print(phone)

#2、插入/绑定手机卡
# phone.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
phone.bind(('127.0.0.1', 8081))

#3、开机
phone.listen(5)  # 半连接池，限制的是请求数

#4、等待电话连接
print('start....')
conn, client_addr = phone.accept()  #（三次握手建立的双向连接，（客户端的ip，端口））
print(conn)
print(client_addr)

#5、通信：收\发消息
data = conn.recv(1024)  #最大接收的字节数
print('来自客户端的数据', data)
conn.send(data.upper())

# import time
# time.sleep(500)
#6、挂掉电话连接
conn.close()

#7、关机
phone.close()
```

### 4.2 客户端

```python
import socket
# socket.AF
#1、买手机
phone = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print(phone)
#2、拨电话
phone.connect(('127.0.0.1', 8081))  # 指定服务端ip和端口

#3、通信：发\收消息
phone.send('hello'.encode('utf-8'))
# phone.send(bytes('hello',encoding='utf-8'))
data = phone.recv(1024)
print(data)

# import time
# time.sleep(500)
#4、关闭
phone.close()
```

## 五、基于TCP协议的套接字编程(循环)

### 5.1 服务端

```python
import socket

#1、买手机
phone = socket.socket(socket.AF_INET,
                      socket.SOCK_STREAM)  #tcp称为流式协议,udp称为数据报协议SOCK_DGRAM
# print(phone)

#2、插入/绑定手机卡
# phone.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
phone.bind(('127.0.0.1', 8080))

#3、开机
phone.listen(5)  # 半连接池，限制的是请求数

#4、等待电话连接
print('start....')
while True:  # 连接循环
    conn, client_addr = phone.accept()  #（三次握手建立的双向连接，（客户端的ip，端口））
    # print(conn)
    print('已经有一个连接建立成功', client_addr)

    #5、通信：收\发消息
    while True:  # 通信循环
        try:
            print('服务端正在收数据...')
            data = conn.recv(1024)  #最大接收的字节数，没有数据会在原地一直等待收，即发送者发送的数据量必须>0bytes
            # print('===>')
            if len(data) == 0: break  #在客户端单方面断开连接，服务端才会出现收空数据的情况
            print('来自客户端的数据', data)
            conn.send(data.upper())
        except ConnectionResetError:
            break
    #6、挂掉电话连接
    conn.close()

#7、关机
phone.close()
```

### 5.2 客户端

```python
import socket

#1、买手机
phone = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# print(phone)
#2、拨电话
phone.connect(('127.0.0.1', 8080))  # 指定服务端ip和端口

#3、通信：发\收消息
while True:  # 通信循环
    msg = input('>>: ').strip()  #msg=''
    if len(msg) == 0: continue
    phone.send(msg.encode('utf-8'))
    # print('has send----->')
    data = phone.recv(1024)
    # print('has recv----->')
    print(data)

#4、关闭
phone.close()
```

### 5.3 客户端

```python
import socket

#1、买手机
phone = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# print(phone)
#2、拨电话
phone.connect(('127.0.0.1', 8080))  # 指定服务端ip和端口

#3、通信：发\收消息
while True:  # 通信循环
    msg = input('>>: ').strip()
    phone.send(msg.encode('utf-8'))
    data = phone.recv(1024)
    print(data)

#4、关闭
phone.close()
```

## 六、地址占用问题

有的同学在重启服务端时可能会遇到：

![121-基于TCP协议的套接字编程-bug.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrnja6p66j30lz02xjru.jpg)

这个是由于你的服务端仍然存在四次挥手的time_wait状态在占用地址（如果不懂，请深入研究1.tcp三次握手，四次挥手 2.syn洪水攻击 3.服务器高并发情况下会有大量的time_wait状态的优化方法）

### 6.1 方法一

```python
# 加入一条socket配置，重用ip和端口

phone=socket(AF_INET,SOCK_STREAM)
phone.setsockopt(SOL_SOCKET,SO_REUSEADDR,1) #就是它，在bind前加
phone.bind(('127.0.0.1',8080))
```

### 6.2 方法二(Linux)

```python
发现系统存在大量TIME_WAIT状态的连接，通过调整linux内核参数解决，
vi /etc/sysctl.conf

编辑文件，加入以下内容：
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_fin_timeout = 30
 
然后执行 /sbin/sysctl -p 让参数生效。
 
net.ipv4.tcp_syncookies = 1 表示开启SYN Cookies。当出现SYN等待队列溢出时，启用cookies来处理，可防范少量SYN攻击，默认为0，表示关闭；

net.ipv4.tcp_tw_reuse = 1 表示开启重用。允许将TIME-WAIT sockets重新用于新的TCP连接，默认为0，表示关闭；

net.ipv4.tcp_tw_recycle = 1 表示开启TCP连接中TIME-WAIT sockets的快速回收，默认为0，表示关闭。

net.ipv4.tcp_fin_timeout 修改系統默认的 TIMEOUT 时间
```