---

id: pythonBackend-django06

title: Django发QQ邮件
---



## 获取QQ邮箱授权码

### **1、什么是授权码？**

授权码是QQ邮箱推出的，用于登录第三方客户端的专用密码。

适用于登录以下服务：POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务。

**温馨提醒：为了你的帐户安全，更改QQ密码以及独立密码会触发授权码过期，需要重新获取新的授权码登录。**

### **2、怎么获取授权码？**

操作: 设置 ---> 帐户 ，按照以下流程操作。

（1）点击“生成授权码”

![image-20210423212501744](https://gitee.com/JqM1n/biog-image/raw/master/20210423212501.png)

（2）验证密保

![image-20210423212602767](https://gitee.com/JqM1n/biog-image/raw/master/20210423212602.png)

（3）获取授权码

![image-20210423212610905](https://gitee.com/JqM1n/biog-image/raw/master/20210423212610.png)

## 三、Django中配置

### dev.py中添加如下代码

```python
# Host for sending email.
EMAIL_HOST = 'smtp.qq.com'                 # 发送方的smtp服务器地址

# Port for sending email.
EMAIL_PORT = 587                           # smtp服务端口

# Optional SMTP authentication information for EMAIL_HOST.
EMAIL_HOST_USER = 'you email@qq.com'       # 发送方 邮箱地址
EMAIL_HOST_PASSWORD = 'uzlbagwxizkfcfdf'   # 获得的  授权码
EMAIL_USE_TLS = True                       # 必须为True
EMAIL_USE_SSL = False
EMAIL_SSL_CERTFILE = None
EMAIL_SSL_KEYFILE = None
EMAIL_TIMEOUT = None

# Default email address to use for various automated correspondence from
# the site managers.
DEFAULT_FROM_EMAIL = 'you email@qq.com'  # 和 EMAIL_HOST_USER  相同
```

### HTML 邮件

####  代码如下:

```python
def send_verify_email(to_email, verify_url):
    import os
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "B2cMall.settings.dev")
    import django
    from django.conf import settings
    django.setup()
    subject = '邮件激活-B2cMall'
    html_message = f'<p>亲爱的{to_email}</p>' \
                   '<br>' \
                   '<p>感谢您注册.请点击此链接激活您的邮箱:</p>' \
                   f'<p><a href="{verify_url}">{verify_url}</a></p>' \
                   '<br>'\
                   '<p>(这是一封自动生成的email,请勿回复)</p>'

    send_mail(subject, '', settings.DEFAULT_FROM_EMAIL, [to_email, ], html_message=html_message)
```

#### 

