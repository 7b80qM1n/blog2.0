---

id: Assorted-virtualenv1

title: 虚拟环境搭建
---

## 好处

1. 使不同应用开发环境相互独立
2. 环境升级不影响其他应用，也不会影响全局的python环境
3. 防止出现包管理混乱及包版本冲突

## windows

##### 安装

```shell
pip3 install virtualenv
pip3 install virtualenvwrapper-win
```

##### 配置虚拟环境管理器工作目录

```python
# 配置环境变量：
# 控制面板 => 系统和安全 => 系统 => 高级系统设置 => 环境变量 => 系统变量 => 点击新建 => 填入变量名与值
变量名：WORKON_HOME  变量值：自定义存放虚拟环境的绝对路径
eg: WORKON_HOME: E:\Develop\virtual_envPy
# 同步配置信息：
# 去向Python3的安装目录 => Scripts文件夹 => virtualenvwrapper.bat => 双击
```

## MacOS、Linux

##### 安装

```shell
pip3 install -i https://pypi.douban.com/simple virtualenv
pip3 install -i https://pypi.douban.com/simple virtualenvwrapper
```

##### 工作文件

```python
# 先找到virtualenvwrapper的工作文件 virtualenvwrapper.sh，该文件可以刷新自定义配置，但需要找到它
# MacOS可能存在的位置 /Library/Frameworks/Python.framework/Versions/版本号文件夹/bin
# Linux可能所在的位置 /usr/local/bin  |  ~/.local/bin  |  /usr/bin
# 建议不管virtualenvwrapper.sh在哪个目录，保证在 /usr/local/bin 目录下有一份
# 如果不在 /usr/local/bin 目录，如在 ~/.local/bin 目录，则复制一份到 /usr/local/bin 目录
	-- sudo cp -rf ~/.local/bin/virtualenvwrapper.sh /usr/local/bin
```

##### 配置

```python
# 在 ~/.bash_profile 完成配置，virtualenvwrapper的默认默认存放虚拟环境路径是 ~/.virtualenvs
# WORKON_HOME=自定义存放虚拟环境的绝对路径，需要自定义就解注
VIRTUALENVWRAPPER_PYTHON=/usr/local/bin/python3
source /usr/local/bin/virtualenvwrapper.sh

# 在终端让配置生效：
	-- source ~/.bash_profile
```

## 使用

```python
# 在终端工作的命令

# 1、创建虚拟环境到配置的WORKON_HOME路径下
# 选取默认Python环境创建虚拟环境：
	-- mkvirtualenv 虚拟环境名称
# 基于某Python环境创建虚拟环境：
	-- mkvirtualenv -p python2.7 虚拟环境名称
	-- mkvirtualenv -p python3.6 虚拟环境名称

# 2、查看已有的虚拟环境
	-- workon

# 3、使用某个虚拟环境
	-- workon 虚拟环境名称
	
# 4、进入|退出 该虚拟环境的Python环境
	-- python | exit()

# 5、为虚拟环境安装模块
	-- pip或pip3 install 模块名

# 6、退出当前虚拟环境
	-- deactivate

# 7、删除虚拟环境(删除当前虚拟环境要先退出)
	-- rmvirtualenv 虚拟环境名称
```

## pycharm使用

### (前提,虚拟环境里面已经装了指定版本的django)

![image-20210322200336131](https://gitee.com/JqM1n/biog-image/raw/master/20210322200343.png)

### 路径选择虚拟环境下的Scripts的python.exe

![image-20210322202017343](https://gitee.com/JqM1n/biog-image/raw/master/20210322202017.png)

