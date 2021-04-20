---

id: modules06

title: itsdangerous 生成临时身份令牌
---

## 安装

```python
pip install itsdangerous
```

## 使用

生成

```python
from itsdangerous import TimedJSONWebSignatureSerializer
from django.conf import settings

# (密钥, 有效时间)
serializer = TimedJSONWebSignatureSerializer(settings.SECRET_KEY, expires_in=300)
# 字典数据,返回bytes类型
token = serializer.dumps({'name': 'jqm'}).decode()
```

校验

```python
from itsdangerous import TimedJSONWebSignatureSerializer, BadData
from django.conf import settings

# 校验
serializer = TimedJSONWebSignatureSerializer(settings.SECRET_KEY, expires_in=300)
try:
    # 校验失败会抛出itsdangerous.BadData异常
    data = serializer.loads(token)
except BadData:
    ...
```

