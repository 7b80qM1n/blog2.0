---
id: socket08
title: 解决粘包问题
---


## 一、解决粘包问题(low版)


问题的根源在于，接收端不知道发送端将要传送的字节流的长度，所以解决粘包的方法就是围绕，如何让发送端在发送数据前，把自己将要发送的字节流总大小让接收端知晓，然后接收端来一个死循环接收完所有数据。


### 1.1 服务端

```python
import socket, subprocess

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server.bind(('127.0.0.1', 8000))
server.listen(5)

while True:
    conn, addr = server.accept()

    print('start...')
    while True:
        cmd = conn.recv(1024)
        print('cmd:', cmd)

        obj = subprocess.Popen(cmd.decode('utf8'),
                               shell=True,
                               stderr=subprocess.PIPE,
                               stdout=subprocess.PIPE)

        stdout = obj.stdout.read()

        if stdout:
            ret = stdout
        else:
            stderr = obj.stderr.read()
            ret = stderr

        ret_len = len(ret)

        conn.send(str(ret_len).encode('utf8'))

        data = conn.recv(1024).decode('utf8')

        if data == 'recv_ready':
            conn.sendall(ret)

    conn.close()

server.close()
```

### 1.2 客户端

```python
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

client.connect(('127.0.0.1', 8000))

while True:
    msg = input('please enter your cmd you want>>>').strip()

    if len(msg) == 0: continue

    client.send(msg.encode('utf8'))
    length = int(client.recv(1024))

    client.send('recv_ready'.encode('utf8'))

    send_size = 0
    recv_size = 0

    data = b''

    while recv_size < length:
        data = client.recv(1024)
        recv_size += len(data)

    print(data.decode('utf8'))
```

### 1.3 为何low

程序的运行速度远快于网络传输速度，所以在发送一段字节前，先用send去发送该字节流长度，这种方式会放大网络延迟带来的性能损耗

## 二、补充struct模块

### 2.1 简单使用

![124-解决粘包问题-struct模块参数.png?x-oss-process=style/watermark](https://tva1.sinaimg.cn/large/007S8ZIlly1gjrnbe0gaaj30hm0b1dim.jpg)

```python
import struct
import json

# 'i'是格式
try:
    obj = struct.pack('i', 1222222222223)
except Exception as e:
    print(e)
    obj = struct.pack('i', 1222)
print(obj, len(obj))
'i' format requires -2147483648 <= number <= 2147483647
b'\xc6\x04\x00\x00' 4
res = struct.unpack('i', obj)
print(res[0])
1222
```

## 三、解决粘包问题

解决粘包问题的核心就是：为字节流加上自定义固定长度报头，报头中包含字节流长度，然后一次send到对端，对端在接收时，先从缓存中取出定长的报头，然后再取真实数据。

### 3.1 使用struct模块创建报头

```python
import json
import struct

header_dic = {
    'filename': 'a.txt',
    'total_size':
    111111111111111111111111111111111222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222223131232,
    'hash': 'asdf123123x123213x'
}

header_json = json.dumps(header_dic)

header_bytes = header_json.encode('utf-8')
print(len(header_bytes))

# 'i'是格式
obj = struct.pack('i', len(header_bytes))
print(obj, len(obj))
223
b'\xdf\x00\x00\x00' 4
res = struct.unpack('i', obj)
print(res[0])
223
```

### 3.2 服务端

```python
from socket import *
import subprocess
import struct
import json

server = socket(AF_INET, SOCK_STREAM)
server.bind(('127.0.0.1', 8000))
server.listen(5)

print('start...')
while True:
    conn, client_addr = server.accept()
    print(conn, client_addr)

    while True:
        cmd = conn.recv(1024)

        obj = subprocess.Popen(cmd.decode('utf8'),
                               shell=True,
                               stderr=subprocess.PIPE,
                               stdout=subprocess.PIPE)

        stderr = obj.stderr.read()
        stdout = obj.stdout.read()

        # 制作报头
        header_dict = {
            'filename': 'a.txt',
            'total_size': len(stdout) + len(stderr),
            'hash': 'xasf123213123'
        }
        header_json = json.dumps(header_dict)
        header_bytes = header_json.encode('utf8')

        # 1. 先把报头的长度len(header_bytes)打包成4个bytes，然后发送
        conn.send(struct.pack('i', len(header_bytes)))
        # 2. 发送报头
        conn.send(header_bytes)
        # 3. 发送真实的数据
        conn.send(stdout)
        conn.send(stderr)

    conn.close()

server.close()
```

### 3.3 客户端

```python
from socket import *
import json
import struct

client = socket(AF_INET, SOCK_STREAM)
client.connect(('127.0.0.1', 8000))

while True:
    cmd = input('please enter your cmd you want>>>')

    if len(cmd) == 0: continue

    client.send(cmd.encode('utf8'))

    # 1. 先收4个字节，这4个字节中包含报头的长度
    header_len = struct.unpack('i', client.recv(4))[0]

    # 2. 再接收报头
    header_bytes = client.recv(header_len)

    # 3. 从包头中解析出想要的东西
    header_json = header_bytes.decode('utf8')
    header_dict = json.loads(header_json)
    total_size = header_dict['total_size']

    # 4. 再收真实的数据
    recv_size = 0
    res = b''
    while recv_size < total_size:
        data = client.recv(1024)

        res += data
        recv_size += len(data)

    print(res.decode('utf8'))

client.close()
```

## 四、TCP协议粘包问题分析

1.nagle算法规定，TCP协议会将数据量较小、时间间隔短的数据合并为一条发送给客户端

### 4.1 服务端

```python
from socket import *

server = socket(AF_INET, SOCK_STREAM)
server.bind(('127.0.0.1', 8080))
server.listen(5)

conn, addr = server.accept()

# 正确做法，客户端制作报头
# res1 = conn.recv(5)
# print('第一次；', res1)

# res2 = conn.recv(5)
# print('第二次；', res2)

# res3 = conn.recv(4)
# print('第三次；', res3)


# low方法+客户端的睡眠
res1 = conn.recv(1024)
print('第一次；', res1)

res2 = conn.recv(1024)
print('第二次；', res2)

res3 = conn.recv(1024)
print('第三次；', res3)
```

### 4.2 客户端

```python
Copyfrom socket import *
import time

client = socket(AF_INET, SOCK_STREAM)
client.connect(('127.0.0.1', 8080))

client.send(b'hello')
client.send(b'world')
client.send(b'lqz')
# 服务端收到b'helloworldlqz'

client.send(b'hello')
time.sleep(0.2)
# 服务端收到b'hello'

client.send(b'world')
time.sleep(0.2)
# 服务端收到b'world'

client.send(b'lqz')
# 服务端收到b'lqz'
```

2.接收方不及时接收缓冲区的包，造成多个包接收（客户端发送了一段数据，服务端只收了一小部分，服务端下次再收的时候还是从缓冲区拿上次遗留的数据，产生粘包）

### 4.3 服务端

```python
# _*_coding:utf-8_*_
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

### 4.4 客户端

```python
# _*_coding:utf-8_*_
__author__ = 'lqzlqz'
import socket
BUFSIZE = 1024
ip_port = ('127.0.0.1', 8080)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
res = s.connect_ex(ip_port)

s.send('hello feng'.encode('utf-8'))
```