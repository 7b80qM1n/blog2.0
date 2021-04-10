---

id: modules06

title: .py与.pyc文件区别
---



## 标准编程语言

对于 **C** 语言，代码一般要先编译，再执行。

```
.c -> .exe
```

## 解释器语言

shell 脚本

```
.sh -> interpreter
```

## Byte Code 编译

**Python, Java** 等语言先将代码编译为 byte code（不是机器码），然后再处理：

```
.py -> .pyc -> interpreter
```



在Python的程序中，是把原始程序代码放在.py文件里，而Python会在执行.py文件的时候。将.py形式的程序编译成中间式文件（byte-compiled）的.pyc文件，这么做的目的就是为了加快下次执行文件的速度。

所以，在我们运行python文件的时候，就会自动首先查看是否具有.pyc文件，如果有的话，而且.py文件的修改时间和.pyc的修改时间一样，就会读取.pyc文件，否则，Python就会读原来的.py文件。

其实并不是所有的.py文件在与运行的时候都会产生.pyc文件，只有在import相应的.py文件的时候，才会生成相应的.pyc文件