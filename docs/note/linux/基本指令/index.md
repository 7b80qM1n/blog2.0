---

id: linux-basic1

title: 基本指令
---

## mkdir  创建文件夹  

```shell
[root@localhost test]# mkdir 1 2 
[root@localhost test]# ls
1  2
# 在/tmp目录下 创建出 python 1  python 2 .. python 5
mkdir /tmp/python{1..5} 
```

### -p  递归创建

```shell
[root@localhost test]# mkdir -p 3/4 5/6 
[root@localhost test]# ls
1  2  3  5
```

### tree

yum如同pip一样，自动的安装东西，解决依赖

```shell
yum install tree -y
```

以树状图显示文件目录的层级结构

```shell
[root@s25linux test]# mkdir -p 1/2 3/4
[root@s25linux test]# tree
.
├── 1
│   └── 2
└── 3
    └── 4
```

## 查看linux命令的帮助信息

1. 用man手册，linux提供的帮助文档

   ```shell
   man ls
   man cp
   man mkdir
   ```

2. 命令加上`--help`参数，查看简短帮助信息

   ```shell
   mkdir --help
   rm --help
   ```

3. 在线搜索一些命令 网站 linux.51yip.com

## echo命令

echo命令如同python的print—样，能够输出字符串到屏幕给用户看

```shell
echo "感谢老铁送上的奥力给"
感谢老铁送上的奥力给
[root@localhost tmp]# name="感谢老铁送上的飞机"
[root@localhost tmp]# echo $name
感谢老铁送上的飞机
```

## PATH

就是环境变量  注意,PATH的路径，是有先后顺序的,从左往右，读取的

```shell
echo $PATH
/usr/local/sbin:/usr/local/bin :/sbin :/ bin:/usr/sbin:/usr/bin :/root/bin
```

如果编译安装了一个python3，装在了`/opt/python36/`目录下，怎么添加PATH?

```shell
# 这个变量赋值，就是将python3添加到环境变量中了
PATH="/opt/python36/bin/:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin"
# 上述变量赋值的操作，只是临时生效，我们想永久的更改PATH的值，还得修改/etc/profile
vim /etc/profile # 打开文件，在文件末尾，添加PATH值的修改
PATH="/opt/python36/bin/:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:"
```

### which

会在`$PATH`设置的目录里查找符合条件的文件

```shell
[root@localhost test]# which python
/usr/bin/python
```

## linux单引号和双引号的区别

单引号中的内容，仅仅就是个字符串，不识别任何其他的特殊符号

双引号中的内容，能够识别特殊符号，以及变量

```shell
[root@localhost test]# name="我们是穿越在银河的火箭队"
[root@localhost test]# echo '$name'
$name
[root@localhost test]# echo "$name"
我们是穿越在银河的火箭队
```

## vim

安装

```shell
yum install vim -y
```

vim打开一个不存在的文件，默认会创建此文件

```shell
vim first.py
```

用vim写一个python脚本

1. 此时会进入命令模式，按下字母`i`，进入编辑模式

   ```shell
   # !coding:utf-8
   print('lbwnb')
   ```

2. 想要退出编辑模式,按下键盘的`ESC`，回到命令模式

3. 输入一个英文的`:`，进入底线命令模式

4. 输入 `wq!`       ==> write写入内容 / quit退出vim / !强制性的操作

   `:wq!`强制保存写入退出vim

   `:q!`强制不保存内容，直接退出

5. 如何执行这个脚本文件

   ```shell
   [root@localhost test]# python first.py
   lbwnb
   ```

在命令模式下 常用的指令

|  指令   |                             描述                             |
| :-----: | :----------------------------------------------------------: |
|    $    |                        快读移动到行尾                        |
|    0    |                     快速移动到光标的行首                     |
|    x    |                      删除光标所在的字符                      |
|    g    |                      移动到文件的第一行                      |
|    G    |                     移动到文件的最后一行                     |
| /string | 你要从文件开头寻找名称为string的字符串，n键跳转到下一个匹配的字符 |
| ?string |                      向上搜索字符串信息                      |
|    %    |                       找到括号的另一半                       |
|   yy    |                        复制光标当前行                        |
|   3yy   |                        复制光标后3行                         |
|    p    |                      打印yy所复制的内容                      |
|   dd    |                        删除光标所在行                        |
|   4dd   |                    删除光标向下的4行内容                     |
|   dG    |                删除光标当前行到行尾的所有内容                |
|    u    |                             撤销                             |

如何快速的复制，打印生成多行内容

例如按下9999yy就是复制9999行，然后按下p打印，就能够快速的复制N多行了...

底线命令模式

```shell
:数字  快速的定位到某一行
:set nu  显示vim的行号
命令模式下(没有输入i进行编辑前)，ngg 比如想到第86行，输入 "86gg" 或"86G" (这个不用按回车就直接定位到对应行了)
```

## cat命令

用这只猫瞄一眼文件的内容

```shell
cat 文件名  # 读取内容 -n 显示行号
[root@localhost test]# cat -n first.py
    1  # !coding:utf-8
    2  print('lbwnb')
```

## linux的重定向符号

| 符号 |                             描述                             |
| :--: | :----------------------------------------------------------: |
|  >   |      重定向输出覆盖符，如同python的 with open中的―w模式      |
|  >>  |                 重定向输出追加符，如同a模式                  |
|  <   | 重定向写入覆盖符，用的很少，用在数据导入等操作中,mysql数据导入 |
|  <<  |                    用在cat命令中，很少见                     |

echo输出一个字符串，内容不在屏幕上打印，写入到一个文件中

```shell
[root@s25linux test]# echo "左边跟我一起画个龙" > 迪斯科.txt
[root@s25linux test]# cat -n 迪斯科.txt
	1 左边跟我一起画个龙
```

追加写入文件内容

```shell
[root@s25linux tmp]# echo "右边跟我划一道彩虹" >> 迪斯科.txt
[root@localhost test]# cat -n 迪斯科.txt
     1	左手跟我一起画个龙
     2	右边跟我划一道彩虹
```

## cp命令

对于配置文件的修改，或者是代码文件的修改，防止突然写错了，复制一份

复制文件

```shell
cp  木兰诗.txt  新_木兰诗.txt
```

复制文件夹，复制文件夹需要添加  -r 递归复制参数

```shell
cp -r a new_a
```

## mv命令

mv命令可以移动文件、文件夹的路径，也能够进行重命名

- 移动位置，语法: 

  mv 你要移动的文件或是文件夹 移动之后的目录名(如果文件夹不存在是改名)

  ```shell
  mv text.txt   b文件夹  #  移动 text.txt到b文件夹下（b文件夹要存在）
  ```

- 重命名，语法: 

  mv 旧文件名  新文件名

  ```shell
  mv 文件1  文件2
  ```

## alias别名命令

直接输入可以查看当前系统的别名

```shell
[root@localhost test]# alias
...
alias mv='mv -i'
alias rm='rm -i' # 为什么rm命令默认会有一个让用户确认删除的动作呢?因为rm -i参数的作用
alias which='alias | /usr/bin/which --tty-only --read-alias --show-dot --show-tilde'
...
```

给启动服务添加一个别名 当你敲下start就是在执行后面的长串命令，很方便

```shell
alias start="python3 /home/mysite/manager.py runserver 0.0.0.0:8000 "
```

## find命令

可以用于搜索机器上所有的资料 按照文件名字搜索，linux一切皆文件

语法 

```shell
find   你要从哪找 -type 你要的文件类型是什么 -name 你要的内容名字是什么 -size 你要的文件内容多大 
-type f 是找普通文本文件
-type d 是找 文件夹 类型
-name  是指定文件的名字内容
```

在系统上 全局搜索  所有的.txt 文件

```shell
find / -name "*.txt"
```

指定在etc目录下，局部搜索一个网卡配置文件、名字是以ifcfg开头的文本类型文件

```shell
find  /etc  -type  f  -name   "ifcfg*"
```

## grep

查找文件里符合条件的字符串、语法：

```shell
grep [参数] [--color=auto] [字符串] filename
```

参数详解:

```shell
-i : 忽略大小写
-n : 输出行号
-v : 反向选择
--color = auto : 给关键词部分添加颜色
```

举例:

```shell
grep "我要找什么" /tmp/oldboy.txt
#排除 -v，排除我要找的东西
grep -v "我要找什么 /tmp/oldboy.txt
# 找出/etc/passwd下root用户所在行，以及行号，显示颜色
cat /etc/passwd |grep '^root' --color=auto -n
# 找出/etc/passwd所有不允许登录的用户
grep /sbin/nologin /etc/passwd
# 找到/etc/passwd的所有与mysql有关行，行号
cat /etc/passwd |grep 'mysql' -n
```

## head、tail命令

head显示文件前几行，默认前10行

tail显示文件后几行，默认后10行

```shell
# 查看前两行
head -2 /tmp/oldboy.txt
# 查看后两行
tail -2 /tmp/oldboy.txt
# 持续刷新显示
tail -f xx.log
# 显示文件10-30行
head -30 /tmp/oldboy.txt |tail -21
```

## scp命令

scp命令用于Linux之间复制文件和目录。

scp是 secure copy的缩写, scp是linux系统下基于ssh登陆进行安全的远程文件拷贝命令。

语法

```shell
scp [可选参数] 本地源文件 远程文件标记
参数
-r :递归复制整个目录
-v:详细方式输出
-q:不显示传输进度条
-C：允许压缩
```

传输本地文件到远程地址

- scp 本地文件  远程用户名@远程ip:远程文件夹/

  ```shell
  scp /tmp/chaoge.py root@192.168.1.155:/home/
  ```

- scp 本地文件  远程用户名@远程ip:远程文件夹/远程文件名

  ```shell
  scp /tmp/chaoge.py root@192.168.1.155:/home/chaoge_python.py
  ```

- scp -r  本地文件夹  远程用户名@远程ip:远程文件夹/

  ```shell
  scp -r /tmp/oldboy root@192.168.1.155:/home/oldboy
  ```

 复制远程文件到本地

```shell
scp root@192.168.1.155:/home/oldboy.txt /tmp/oldboy.txt
scp -r root@192.168.1.155:/home/oldboy /home/
```

### du命令

用于显示目录或文件的大小

显示指定的目录或文件所占用的磁盘空间

语法 + 使用

 ```shell
du  [参数]  [文件或目录]
-s 显示总计
-h 以k，M,G为单位显示，可读性强
# 什么都不跟，代表显示当前目录所有文件大小
du   
# 显示/home的总大小
du -sh /home
 ```

## netstat命令

查看linux的网络端口情况

```shell
常用的参数组合 -t -n -u -l -p
# 显示机器所有的tcp、udp的所有端口连接情况
netstat -tunlp 
# 例如验证服务器80端口是否存在
netstat -tunlp | grep 80
# 过滤3306端口是否存在
netstat -tunlp  | grep 3306
# 过滤ssh服务是否正常
netstat -tunlp | grep ssh
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1284/sshd           
tcp6       0      0 :::22                   :::*                    LISTEN      1284/sshd   
```

有些公司为了保护服务器安全，更改了默认的远程连接端口  

例: ssh端口 26674 ip  123.206.16.61  账号 xiaohu 密码 xiaohu666

```shell
ssh  -p 26674  xiaohu@123.206.16.61
```

## top命令

windows的任务管理器见过吧

能够显示 动态的进程信息 cpu、内存，网络，磁盘io等使用情况，也就是一个资源管理器

那么linux的资源管理器就是top命令

![image-20210411010834191](https://gitee.com/JqM1n/biog-image/raw/master/20210411010841.png)

```shell
第一行 (uptime) 系统时间 主机运行时间 用户连接数(who) 系统1，5，15分钟的平均负载

第二行:进程信息 进程总数 正在运行的进程数 睡眠的进程数 停止的进程数 僵尸进程数

第三行:cpu信息
0.0 us：用户空间所占CPU百分比
0.0 sy：内核空间占用CPU百分比
0.0 ni：用户进程空间内改变过优先级的进程占用CPU百分比
100.0 id：空闲CPU百分比
0.0 wa：等待输入输出的CPU时间百分比
0.0 hi：硬件CPU中断占用百分比
0.0 si：软中断占用百分比
0.0 st：虚拟机占用百分比

第四行：内存信息（与第五行的信息类似与free命令）
2895296 total：物理内存总量
73744 free：空闲的内存总量（free+used=total）
931216 used：已使用的内存总量
1890336 buffers：用作内核缓存的内存量

第五行：swap信息
2097148 total：交换分区总量
2097148 free：空闲交换区总量
0 used：已使用的交换分区总量
1752520 avail Mem：可以分配和使用的内存量,而不会导致更多的交换
```

## ps命令

查看linux进程信息

语法

```shell
ps -ef  # -ef，是一个组合参数,-e -f 的缩写，默认显示linux所有的进程信息，以及pid，时间，进程名等信息
```

过滤系统有关vim的进程

```shell
[root@localhost test]# ps -ef | grep "vim"
root      33696  10535  0 19:11 pts/4    00:00:00 grep --color=auto vim
```

一个django运行后，如何验证django是否运行了，它会产生些什么内容?

- 产生一个python相关的进程信息
- 查看端口情况，django会占用一个端口
- 能够产生日志，检测到用户的请求

## kill命令

杀死进程的命令

```shell
kil1  进程的id号
pkill -9 进程名
如果遇见卡死的进程,杀不掉，就发送  -9  强制的信号
kill -9  pid
```

## yum源

yum源的默认仓库文件夹是`/etc/yum.repos.d`,只有在这个目录第一层的*.repo结尾的文件，才会被yum读取

1. 下载wget命令

   ```shell
   yum install wget -y  # wget命令就是在线下载一个url的静态资源
   ```

2. 备份旧的yum仓库源

   ```shell
   cd  /etc/yum.repos.d
   mkdir repobak
   mv *.repo   repobak  #备份repo文件
   ```

3. 下载新的阿里的yum源仓库，阿里的开源镜像 developer.aliyun.com/mirror

   ```shell
   wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
   ```

4. 继续下载第二个 epel仓库

   ```shell
   wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo
   ```






