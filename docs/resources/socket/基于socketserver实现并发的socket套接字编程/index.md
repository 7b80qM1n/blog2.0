---
id: socket10
title: 基于socketserver实现并发的socket套接字编程
---


## 一、基于TCP协议


基于tcp的套接字，关键就是两个循环，一个链接循环，一个通信循环

socketserver模块中分两大类：server类（解决链接问题）和request类（解决通信问题）


### 1.1 server类

[![126-基于socketserver实现并发的socket-server类.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrn33c777j30cj0k1jsh.jpg)

### 1.2 request类

[![126-基于socketserver实现并发的socket-request类.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrn3iozvoj309b09q74j.jpg)

### 1.3 继承关系

![126-基于socketserver实现并发的socket-继承关系1.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrn3wa5e8j30mo0d9mxv.jpg)

![126-基于socketserver实现并发的socket-继承关系2.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrn4188ntj30lz0cjjs2.jpg)

![126-基于socketserver实现并发的socket-继承关系3.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrn4bt7sgj30aw05nmx6.jpg)

### 1.4 服务端

```python
import socketserver

class MyHandler(socketserver.BaseRequestHandler):
    def handle(self):
        # 通信循环
        while True:
            # print(self.client_address)
            # print(self.request) #self.request=conn

            try:
                data = self.request.recv(1024)
                if len(data) == 0: break
                self.request.send(data.upper())
            except ConnectionResetError:
                break


if __name__ == '__main__':
    s = socketserver.ThreadingTCPServer(('127.0.0.1', 8080), MyHandler, bind_and_activate=True)

    s.serve_forever()  # 代表连接循环
    # 循环建立连接，每建立一个连接就会启动一个线程（服务员）+调用Myhanlder类产生一个对象，调用该对象下的handle方法，专门与刚刚建立好的连接做通信循环
```

### 1.5 客户端

```python
import socket

phone = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
phone.connect(('127.0.0.1', 8080))  # 指定服务端ip和端口

while True:
    # msg=input('>>: ').strip() #msg=''
    msg = 'client33333'  # msg=''
    if len(msg) == 0: continue
    phone.send(msg.encode('utf-8'))
    data = phone.recv(1024)
    print(data)

phone.close()
```

### 1.6 客户端

```python
import socket

phone = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
phone.connect(('127.0.0.1', 8080))  # 指定服务端ip和端口

while True:
    # msg=input('>>: ').strip() #msg=''
    msg = 'client11111'  # msg=''
    if len(msg) == 0: continue
    phone.send(msg.encode('utf-8'))
    data = phone.recv(1024)
    print(data)

phone.close()
```

## 二、基于UDP协议

### 2.1 服务端

```python
import socketserver


class MyHandler(socketserver.BaseRequestHandler):
    def handle(self):
        # 通信循环
        print(self.client_address)
        print(self.request)

        data = self.request[0]
        print('客户消息', data)
        self.request[1].sendto(data.upper(), self.client_address)


if __name__ == '__main__':
    s = socketserver.ThreadingUDPServer(('127.0.0.1', 8080), MyHandler)
    s.serve_forever()
```

### 2.2 客户端

```python
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # 数据报协议-》udp

while True:
    # msg=input('>>: ').strip() #msg=''
    msg = 'client1111'
    client.sendto(msg.encode('utf-8'), ('127.0.0.1', 8080))
    data, server_addr = client.recvfrom(1024)
    print(data)

client.close()
```

### 2.3 客户端

```python
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # 数据报协议-》udp

while True:
    # msg=input('>>: ').strip() #msg=''
    msg = 'client2222'
    client.sendto(msg.encode('utf-8'), ('127.0.0.1', 8080))
    data, server_addr = client.recvfrom(1024)
    print(data)

client.close()
```

## 三、socketserver源码分析

```python
ftpserver=socketserver.ThreadingTCPServer(('127.0.0.1', 8080)，FtpServer)
ftpserver.serve_forever()
```

- 查找属性的顺序：ThreadingTCPServer->ThreadingMixIn->TCPServer->BaseServer
  1. 实例化得到ftpserver，先找类ThreadingTCPServer的**init**，在TCPServer中找到，进而执行server_bind，server_active
  2. 找ftpserver下的serve_forever，在BaseServer中找到，进而执行self._handle_request_noblock()，该方法同样是在BaseServer中
  3. 执行self._handle_request_noblock()进而执行request， client_address = self.get_request()（就是TCPServer中的self.socket.accept()），然后执行self.process_request(request， client_address)
  4. 在ThreadingMixIn中找到process_request，开启多线程应对并发，进而执行process_request_thread，执行self.finish_request(request， client_address)
  5. 上述四部分完成了链接循环，本部分开始进入处理通讯部分，在BaseServer中找到finish_request，触发我们自己定义的类的实例化，去找**init**方法，而我们自己定义的类没有该方法，则去它的父类也就是BaseRequestHandler中找….

### 3.1 源码总结

- 基于tcp的socketserver我们自己定义的类中的
  - self.server即套接字对象
  - self.request即一个链接
  - self.client_address即客户端地址
- 基于udp的socketserver我们自己定义的类中的
  - self.request是一个元组（第一个元素是客户端发来的数据，第二部分是服务端的udp套接字对象），如(b’adsf’, <socket.socket fd=200, family=AddressFamily.AF_INET, type=SocketKind.SOCK_DGRAM, proto=0, laddr=(‘127.0.0.1’, 8080)>)
  - self.client_address即客户端地址