---
id: socket06
title: 模拟ssh远程执行命令
---


输入`dir`命令，由于服务端发送字节少于1024字节，客户端可以接受。

输入`tasklist`命令，由于服务端发送字节多于1024字节，客户端只接受部分数据，并且当你再次输入`dir`命令的时候，客户端会接收`dir`命令的结果，但是会打印上一次的剩余未发送完的数据，这就是粘包问题。


## 一、服务端

```python
from socket import *
import subprocess

server = socket(AF_INET, SOCK_STREAM)

server.bind(('127.0.0.1', 8000))
server.listen(5)

print('start...')
while True:
    conn, client_addr = server.accept()

    while True:
        print('from client:', client_addr)

        cmd = conn.recv(1024)
        if len(cmd) == 0: break
        print('cmd:', cmd)

        obj = subprocess.Popen(cmd.decode('utf8'),  # 输入的cmd命令
                               shell=True,  # 通过shell运行
                               stderr=subprocess.PIPE,  # 把错误输出放入管道，以便打印
                               stdout=subprocess.PIPE)  # 把正确输出放入管道，以便打印

        stdout = obj.stdout.read()  # 打印正确输出
        stderr = obj.stderr.read()  # 打印错误输出

        conn.send(stdout)
        conn.send(stderr)

    conn.close()

server.close()
```

## 二、客户端

```python
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

client.connect(('127.0.0.1', 8000))

while True:
    data = input('please enter your data')
    client.send(data.encode('utf8'))
    data = client.recv(1024)

    print('from server:', data)

client.close()
```



