---
id: socket07
title: 粘包问题
---

## 一、什么是粘包？


注意：只有TCP有粘包现象，UDP永远不会粘包，为何，且听我娓娓道来。


首先需要掌握一个socket收发消息的原理

![123-粘包问题-socket收发消息.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrne4rww5j30fm0b5wf5.jpg)

发送端可以是一K一K地发送数据，而接收端的应用程序可以两K两K地提走数据，当然也有可能一次提走3K或6K数据，或者一次只提走几个字节的数据，也就是说，应用程序所看到的数据是一个整体，或说是一个流（stream），一条消息有多少字节对应用程序是不可见的，因此TCP协议是面向流的协议，这也是容易出现粘包问题的原因。而UDP是面向消息的协议，每个UDP段都是一条消息，应用程序必须以消息为单位提取数据，不能一次提取任意字节的数据，这一点和TCP是很不同的。怎样定义消息呢？可以认为对方一次性write/send的数据为一个消息，需要明白的是当对方send一条信息的时候，无论底层怎样分段分片，TCP协议层会把构成整条消息的数据段排序完成后才呈现在内核缓冲区。

例如基于TCP的套接字客户端往服务端上传文件，发送时文件内容是按照一段一段的字节流发送的，在接收方看了，根本不知道该文件的字节流从何处开始，在何处结束。

所谓粘包问题主要还是因为接收方不知道消息之间的界限，不知道一次性提取多少字节的数据所造成的。

此外，发送方引起的粘包是由TCP协议本身造成的，TCP为提高传输效率，发送方往往要收集到足够多的数据后才发送一个TCP段。若连续几次需要send的数据都很少，通常TCP会根据优化算法把这些数据合成一个TCP段后一次发送出去，这样接收方就收到了粘包数据。

- TCP（transport control protocol，传输控制协议）是面向连接的，面向流的，提供高可靠性服务。收发两端（客户端和服务器端）都要有一一成对的socket，因此，发送端为了将多个发往接收端的包，更有效的发到对方，使用了优化方法（Nagle算法），将多次间隔较小且数据量小的数据，合并成一个大的数据块，然后进行封包。这样，接收端，就难于分辨出来了，必须提供科学的拆包机制。 即面向流的通信是无消息保护边界的。
- UDP（user datagram protocol，用户数据报协议）是无连接的，面向消息的，提供高效率服务。不会使用块的合并优化算法，, 由于UDP支持的是一对多的模式，所以接收端的skbuff(套接字缓冲区）采用了链式结构来记录每一个到达的UDP包，在每个UDP包中就有了消息头（消息来源地址，端口等信息），这样，对于接收端来说，就容易进行区分处理了。 即面向消息的通信是有消息保护边界的。
- TCP是基于数据流的，于是收发的消息不能为空，这就需要在客户端和服务端都添加空消息的处理机制，防止程序卡住，而udp是基于数据报的，即便是你输入的是空内容（直接回车），那也不是空消息，udp协议会帮你封装上消息头，实验略

udp的recvfrom是阻塞的，一个recvfrom(x)必须对唯一一个sendinto(y),收完了x个字节的数据就算完成,若是y>x数据就丢失，这意味着udp根本不会粘包，但是会丢数据，不可靠

TCP的协议数据不会丢，没有收完包，下次接收，会继续上次继续接收，己端总是在收到ack时才会清除缓冲区内容。数据是可靠的，但是会粘包。

## 二、TCP发送数据的四种情况

![123-粘包问题-粘包可能.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrne8areij30fl070mxv.jpg)

假设客户端分别发送了两个数据包D1和D2给服务端，由于服务端一次读取到的字节数是不确定的，故可能存在以下4种情况。

1. 服务端分两次读取到了两个独立的数据包，分别是D1和D2，没有粘包和拆包；
2. 服务端一次接收到了两个数据包，D1和D2粘合在一起，被称为TCP粘包；
3. 服务端分两次读取到了两个数据包，第一次读取到了完整的D1包和D2包的部分内容，第二次读取到了D2包的剩余内容，这被称为TCP拆包；
4. 服务端分两次读取到了两个数据包，第一次读取到了D1包的部分内容D1_1，第二次读取到了D1包的剩余内容D1_2和D2包的整包。

特例：如果此时服务端TCP接收滑窗非常小，而数据包D1和D2比较大，很有可能会发生第五种可能，即服务端分多次才能将D1和D2包接收完全，期间发生多次拆包。

## 三、粘包的两种情况

1.发送端需要等缓冲区满才发送出去，造成粘包（发送数据时间间隔很短，数据了很小，会合到一起，产生粘包）

### 3.1 服务端

```python
Copy# _*_coding:utf-8_*_
__author__ = 'lqz'
from socket import *
ip_port = ('127.0.0.1', 8080)

TCP_socket_server = socket(AF_INET, SOCK_STREAM)
TCP_socket_server.bind(ip_port)
TCP_socket_server.listen(5)

conn, addr = TCP_socket_server.accept()

data1 = conn.recv(10)
data2 = conn.recv(10)

print('----->', data1.decode('utf-8'))
print('----->', data2.decode('utf-8'))

conn.close()
```

### 3.2 客户端

```python
Copy# _*_coding:utf-8_*_
__author__ = 'lqz'
import socket
BUFSIZE = 1024
ip_port = ('127.0.0.1', 8080)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
res = s.connect_ex(ip_port)

s.send('hello'.encode('utf-8'))
s.send('feng'.encode('utf-8'))
```

2.接收方不及时接收缓冲区的包，造成多个包接收（客户端发送了一段数据，服务端只收了一小部分，服务端下次再收的时候还是从缓冲区拿上次遗留的数据，产生粘包）

### 3.3 服务端

```python
Copy# _*_coding:utf-8_*_
__author__ = 'lqz'
from socket import *
ip_port = ('127.0.0.1', 8080)

TCP_socket_server = socket(AF_INET, SOCK_STREAM)
TCP_socket_server.bind(ip_port)
TCP_socket_server.listen(5)

conn, addr = TCP_socket_server.accept()

data1 = conn.recv(2)  # 一次没有收完整
data2 = conn.recv(10)  # 下次收的时候,会先取旧的数据,然后取新的

print('----->', data1.decode('utf-8'))
print('----->', data2.decode('utf-8'))

conn.close()
```

### 3.4 客户端

```python
Copy# _*_coding:utf-8_*_
__author__ = 'lqz'
import socket
BUFSIZE = 1024
ip_port = ('127.0.0.1', 8080)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
res = s.connect_ex(ip_port)

s.send('hello feng'.encode('utf-8'))
```

## 四、补充问题一：为何TCP是可靠传输，udp是不可靠传输

- 基于TCP的数据传输请参考我的另一篇文章https://www.cnblogs.com/lqz/p/11027575.html，TCP在数据传输时，发送端先把数据发送到自己的缓存中，然后协议控制将缓存中的数据发往对端，对端返回一个ack=1，发送端则清理缓存中的数据，对端返回ack=0，则重新发送数据，所以TCP是可靠的
- udp发送数据，对端是不会返回确认信息的，因此不可靠

## 五、补充问题二：send(字节流)和recv(1024)及sendall

- recv里指定的1024意思是从缓存里一次拿出1024个字节的数据
- send的字节流是先放入己端缓存，然后由协议控制将缓存内容发往对端，如果待发送的字节流大小大于缓存剩余空间，那么数据丢失，用sendall就会循环调用send，数据不会丢失