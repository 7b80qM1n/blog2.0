---

id: Assorted-pip1

title: 配置pip安装源
---

1、采用国内源，加速下载模块的速度

2、常用pip源：

-- 豆瓣：https://pypi.douban.com/simple

-- 阿里：https://mirrors.aliyun.com/pypi/simple

3、加速安装的命令：

-- >: pip install -i https://pypi.douban.com/simple 模块名

## 永久配置安装源

### Windows

1. 文件管理器文件路径地址栏敲：`%APPDATA%` 回车，快速进入 `C:\Users\电脑用户\AppData\Roaming`文件夹中
2. 新建 pip 文件夹并在文件夹中新建 pip.ini 配置文件
3. 新增`pip.ini` 配置文件内容

### MacOS、Linux

1. 在用户根目录下 ~ 下创建`.pip` 隐藏文件夹，如果已经有了可以跳过

   ```shell
   mkdir ~/.pip
   ```

2. 进入 `.pip` 隐藏文件夹并创建 `pip.conf` 配置文件

   ```shell
   cd ~/.pip && touch pip.conf
   ```

3. 启动 Finder(访达) 按 `cmd+shift+g` 来的进入，输入 `~/.pip` 回车进入

4. 新增 `pip.conf` 配置文件内容

### 配置文件内容

```python
"""
[global]
index-url = http://pypi.douban.com/simple
[install]
use-mirrors =true
mirrors =http://pypi.douban.com/simple/
trusted-host =pypi.douban.com
"""
```

