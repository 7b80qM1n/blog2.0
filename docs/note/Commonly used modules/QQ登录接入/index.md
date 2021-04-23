---

id: modules08

title: QQ登录接入
---

QQ登录，亦即我们所说的第三方登录，是指用户可以不在本项目中输入密码，而直接通过第三方的验证，成功登录本项目。

## 接入准备

若想实现QQ登录，需要成为QQ互联的开发者，审核通过才可实现。注册方法可参考链接

https://wiki.connect.qq.com/%e6%88%90%e4%b8%ba%e5%bc%80%e5%8f%91%e8%80%85

成为QQ互联开发者后，还需创建应用，即获取本项目对应与QQ互联的应用ID，创建应用的方法参考链接

https://wiki.connect.qq.com/__trashed-2

QQ登录开发文档连接

https://wiki.connect.qq.com/%e7%bd%91%e7%ab%99%e5%ba%94%e7%94%a8%e6%8e%a5%e5%85%a5%e6%b5%81%e7%a8%8b

## 流程分析

1. 后端写好生成QQ登录界面地址接口,前端发请求获取QQ登录界面地址

2. 前端跳转到链接地址让用户登录,成功后QQ服务器会把code拼接到回调地址返回给前端

   前端拿到code后再次向后端发请求,把code传递给后端

3. 后端拿到code后,通过code向QQ服务器获取access_token,获取后通过access_token向QQ服务器再获取openid

![image-20210420133156872](https://gitee.com/JqM1n/biog-image/raw/master/20210420133203.png)



## QQ登录SDK使用

安装

```python
pip install QQLoginTool
```

使用

1. 导入

   ```python
   from QQLoginTool.QQtool import OAuthQQ
   ```

2. 提取前端传入的next参数记录用户从哪里来到登录界面

   ```python
   next_index = request.query_params.get('next') or '/'
   ```

3. 初始化OAuthQQ对象

   ```python
   oauth = OAuthQQ(client_id=settings.QQ_CLIENT_ID, client_secret=settings.QQ_CLIENT_SECRET,
                           redirect_uri=settings.QQ_REDIRECT_URI, state=next_index)
   ```

4. 调用方法,拼接好QQ登录网址返回

   ```python
   login_url = oauth.get_qq_url()
   return APIResponse(code=1, msg='请求成功', login_url=login_url)
   ```

5. 通过Authorization Code获取Access Token

   ```python
   access_token = oauth.get_access_token(code)
   ```

6. 通过Access Token获取OpenID

   ```python
   openid  = oauth.get_open_id(access_token)
   ```

查询数据库有没有这个openid 有openid,返回JWT 登录成功

QQ接入完毕,剩下的就是自己网站的逻辑了,例如:

- 没有openid,表示新用户,返回加密后的openid,前端暂存,获取信息后再绑定
  - 获取信息,如果用户已注册,校验密码后绑定openid,返回JWT,登录成功
  - 获取信息,如果用户未注册,添加用户后绑定openid,返回JWT,登录成功

