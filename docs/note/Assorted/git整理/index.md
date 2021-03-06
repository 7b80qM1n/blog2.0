---

id: Assorted-git整理

title: git整理
---


>完成 协同开发 项目，帮助程序员整合代码

>帮助开发者合并开发的代码

>如果出现冲突代码的合并，会提示后提交合并代码的开发者，让其解决冲突

## git与svn比较

SVN 、 GIT（都是同一个人的个人项目）

github、gitee（两个采用git版本控制器管理代码的公共平台）

git：集群化、多分支

![image-20210329145632325](https://gitee.com/JqM1n/biog-image/raw/master/20210329145639.png)

![image-20210329145712980](https://gitee.com/JqM1n/biog-image/raw/master/20210329145713.png)

## git的工作流程

![image-20210329145749139](https://gitee.com/JqM1n/biog-image/raw/master/20210329145749.png)

## git分支管理

![image-20210329145833113](https://gitee.com/JqM1n/biog-image/raw/master/20210329145833.png)

## 安装

```
1.下载对应版本：https://git-scm.com/download
2.安装git：在选取安装路径的下一步选取 Use a TrueType font in all console windows 选项
```

### 过滤文件

##### .gitignore 文件

```python
logs/
scripts/
pem/
# pycharm
.idea/
.DS_Store

__pycache__/
*.py[cod]
*$py.class

# Django stuff:
const.py
*.sqlite3

# database migrations
*/migrations/*.py
!*/migrations/_init__.py
```



## remote源操作

```shell
"""
1）查看仓库已配置的远程源
>: git remote
>: git remote -v

2）查看remote命令帮助文档
>: git remote -h

3）删除远程源
>: git remote remove 源名
eg: git remote remove origin

4）添加远程源
>: git remote add 源名 源地址
>: git remote add origin git@gitee.com:doctor_owen/luffyapi.git

5）提交代码到远程源
>: git push 源名 分支名

6）克隆远程源
>: git clone 远程源地址
"""

"""
1）通过克隆方式连接远程源，默认远程源名就叫origin；所以主动添加远程源来连接远程仓库，源码也用origin
2）本地一个仓库只需要和远程一个源进行同步，所以只需要连接一个远程源，如果还想把本地代码同步给第三个平台，那么可以通过主动添加远程源来连接第三个平台的远程仓库，此时的源码就不能再叫origin了，比如online都可以
3）pull和push都可以提供选择不同的源码，和不同的远程仓库交互
"""
```

### 采用ssh协议连接远程源

```
官网：https://gitee.com/help/articles/4181#article-header0

本机命令，生成公钥：ssh-keygen -t rsa -C "*@*.com"
	邮箱可以任意填写
本机命令，查看公钥：cat ~/.ssh/id_rsa.pub

码云线上添加公钥：项目仓库 => 管理 => 部署公钥管理 => 添加公钥 => 添加个人公钥
```

### 如何成为其他码云项目的开发者

```python
"""
1）生成自己电脑的公钥，配置到自己的码云个人公钥中
2）把自己的码云用户名提供给别人，别人添加你成为项目开发者
3）自己确认添加，成为开发者，克隆开发项目，进行开发
"""
```

### 如何成为公司自建git服务器的开发者

```python
"""
1）生成自己电脑的公钥(公钥生成一次就可以了)，把它提交给项目管理者
2）项目管理者添加你公钥，加入开发者，提供给你项目克隆地址
3）克隆开发项目，进行开发
"""
```

### 协同开发

```python
"""
1）作为开发者，第一次同步项目（前台已经是项目开发者了）
>: git clone 项目地址

2）保证自己本地有dev分支，且与远程仓库版本同步(没有就自己新建)

3）本地开发的代码，必须add、commit到本地版本库后，才和远程仓库进行交互

4）交互顺序：必须 先拉(pull)后提(push)

5）必须切换到要交互的分支，在与远程同名的分支进行交互，如本地dev与远程dev交互
>: git checkout dev
>: git add .
>: git commit -m '本次提交的信息提示'
>: git pull origin dev
>: git push origin dev
"""
```

### 冲突解决

```python
"""
1）在远程仓库和本地仓库版本不一致时，拉取远程仓库版本到本地时，两个版本进入融合，可能会出现版本冲突

2）定位冲突文件冲突代码，线下沟通冲突代码，整合代码解决冲突

3）将解决冲突后的代码重新提交到本地版本库

4）再拉去远程仓库，直到没有冲突，提交本地版本库到远程
"""

"""
<<<<<<< HEAD  # 冲突的开始
# 自己的代码
=======  # 分割线
# 别人的代码
>>>>>>> b63c408abd05b87fc492d40523240561999dba50  # 冲突的结束(版本)
"""

"""
1）删除冲突相关标识：冲突的开始、分割线、冲突的结束(版本)
2）线下沟通，根据实际需求完成代码整合
3）测试整合后的代码

"""

"""
出现冲突的前提：
1）不同开发者同时操作了同一文件
2）并且在相同行写了代码
强调：有业务交际时，版本合并不一定会出现冲突相关的标识，但是可能会带着代码运行崩溃，所有理论上每一次版本合并，都要测试合并后的所有功能(及其之少的情况)
"""
```

### 远程仓库回滚

```shell
用dev分支举例
1）本地切换到远程要回滚的分支对应的本地分支
git checkout dev

2）回滚本地分支
git reset --hard 版本号

3）本地版本强行提交给服务器
git push origin dev -f
```

