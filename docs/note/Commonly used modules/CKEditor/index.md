---

id: element-CKEditor

title: CKEditor富文本编辑器
---

为了快速简单的让用户能够在页面中编辑带格式的文本，我们引入富文本编辑器。富文本即具备丰富样式格式的文本。

![image-20210425184133](https://gitee.com/JqM1n/biog-image/raw/master/20210425184133.png)

##  安装

```python
pip install django-ckeditor
```

## 注册

```python
INSTALLED_APPS = [
    ...
    'ckeditor',  # 富文本编辑器
    'ckeditor_uploader',  # 富文本编辑器上传图片模块
    ...
]
```

## CKEditor设置

### settings/dev.py

```python
# 富文本编辑器ckeditor配置
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',  # 工具条功能
        'height': 300,  # 编辑器高度
        # 'width': 300,  # 编辑器宽
    },
}
CKEDITOR_UPLOAD_PATH = ''  # 上传图片保存路径，使用了FastDFS，所以此处设为''
```

## 添加ckeditor路由

### 总路由

```python
url(r'^ckeditor/', include('ckeditor_uploader.urls')),
```

## 模型类添加字段

ckeditor提供了两种类型的Django模型类字段

1. `ckeditor.fields.RichTextField` 不支持上传文件的富文本字段
2. `ckeditor_uploader.fields.RichTextUploadingField` 支持上传文件的富文本字段

在商品模型类（SPU）中，要保存商品的详细介绍、包装信息、售后服务，这三个字段需要作为富文本字段

```python
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField

class Goods(BaseModel):
    """
    商品SPU
    """
    ...
    desc_detail = RichTextUploadingField(default='', verbose_name='详细介绍')
    desc_pack = RichTextField(default='', verbose_name='包装信息')
    desc_service = RichTextUploadingField(default='', verbose_name='售后服务')
```

