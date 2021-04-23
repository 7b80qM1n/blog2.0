---

id: Assorted-linuxport1

title: linux开放端口
---

1. 防火墙相关

   ```python
   查看防火墙状态 systemctl status firewalld
   开启防火墙 systemctl start firewalld  
   关闭防火墙 systemctl stop firewalld
   开启防火墙 service firewalld start 
   ```

   若遇到无法开启

   ```python
   先用：systemctl unmask firewalld.service 
   然后：systemctl start firewalld.service
   ```

   

2. 查询指定端口是否已开

   提示 yes，表示开启；no表示未开启

   ```python
   firewall-cmd --query-port=3306/tcp
   no
   ```

3. 添加指定需要开放的端口：

   ```python
   firewall-cmd --add-port=3306/tcp --permanent
   ```

   重载入添加的端口：

   ```python
   firewall-cmd --reload
   ```

   查询指定端口是否开启成功：

   ```python
   firewall-cmd --query-port=3306/tcp
   yes
   ```

   移除指定端口：
   
   ```python
   firewall-cmd --permanent --remove-port=3306/tcp
   ```

## 可以用上面的方法把需要开放的端口一个一个开启

## 也可以直接关掉防火墙...

