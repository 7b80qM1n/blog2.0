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

## CKEditor配置

### settings/dev.py

```python
# 富文本编辑器ckeditor参考配置
CKEDITOR_CONFIGS = {
    'default': {        
        # 'toolbar': 'full',   # 工具条功能     
        # 'width': 300,  # 编辑器宽
        'height': 300,   # 编辑器高度    
        'tabSpaces': 4,  # tab键转换空格数 
        'toolbar': 'Custom',  # 工具栏风格 Basic简洁 full  全能  其他自定义
        'toolbar_Custom': [  # 工具栏自定义按钮 
            ['Source', '-', 'Save', 'Preview'],
            ['Image', 'Table', 'HorizontalRule', 'Smiley'],
            ['Styles', 'Format'],
            ['Bold', 'Italic', 'Strike'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'],
            ['Maximize', '-', 'About'],
        ],
        'extraPlugins': ','.join(['codesnippet']),  # 加入代码块插件
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

## 配置中英文对照:

```python

Source = 源码模式
-
Save = 保存(提交表单)
NewPage = 新建
Preview = 预览
- = 分割线
Templates = 模板
Cut = 剪切
Copy = 复制
Paste = 粘贴
PasteText = 粘贴为无格式文本
PasteFromWord = 从 MS WORD 粘贴
-
Print = 打印
SpellChecker = 拼写检查
Scayt = 即时拼写检查
Undo = 撤销
Redo = 重做
-
Find = 查找
Replace = 替换
-
SelectAll = 全选
RemoveFormat = 清除格式
Form = 表单
Checkbox = 复选框
Radio = 单选框
TextField = 单行文本
Textarea = 多行文本
Select = 列表/菜单
Button = 按钮
ImageButton = 图片按钮
HiddenField = 隐藏域
/
Bold = 加粗
Italic = 倾斜
Underline = 下划线
Strike = 删除线
-
Subscript = 下标
Superscript = 上标
NumberedList = 编号列表
BulletedList = 项目列表
-
Outdent = 减少缩进量
Indent = 增加缩进量
Blockquote = 块引用
CreateDiv = 创建DIV容器
JustifyLeft = 左对齐
JustifyCenter = 居中
JustifyRight = 右对齐
JustifyBlock = 两端对齐
BidiLtr = 文字方向从左到右
BidiRtl = 文字方向从右到左
Link = 插入/编辑超链接(上传文件)
Unlink = 取消超链接
Anchor = 插入/编辑锚点链接
Image = 图像(上传)
Flash = 动画(上传)
Table = 表格
HorizontalRule = 插入水平线
Smiley = 插入表情
SpecialChar = 插入特殊符号
PageBreak = 插入分页符
/
Styles = 样式快捷方式
Format = 文本格式
Font = 字体
FontSize = 文字大小
TextColor = 文字颜色
BGColor = 背景颜色
Maximize = 全屏编辑模式
ShowBlocks = 显示区块
-
About = 显示关于
```

