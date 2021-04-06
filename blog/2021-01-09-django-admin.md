---
slug: blog/python/Django-admin后台设置

title: "Django 设置admin后台表和App(应用)为中文名" 

author: 庆民gg

tags: [python,问题/坑/]



---



#####
<table>
     <tr>
        <td ><center><img src="https://gitee.com/JqM1n/biog-image/raw/master/20210311200802.png"/></center></td>
		<td ><center><img src="https://gitee.com/JqM1n/biog-image/raw/master/20210311200604.png"/></center></td>
     </tr>
</table>

<!-- truncate -->

## 设置表名为中文

### 1.设置Models.py文件

```python
class Teacher(models.Model):
    name = models.CharField()
    ...  # 省略其他字段信息
    
    class Meta:
        verbose_name = "导师"   # 单数形式显示的字段
        verbose_name_plural = verbose_name     # 复数形式显示字段，默认admin后台显示复数形式
```

## 设置App(应用)为中文

### 1. 修改要修改的应用目录下的apps.py

```python
from django.apps import AppConfig

class CourseConfig(AppConfig):
    name = 'course'
    verbose_name = '课程'
```

### 2. 修改要修改的应用目录下的__init__.py文件

```python
default_app_config = 'course.apps.CourseConfig'  # 格式：应用名.apps.class名（apps.py中修改的class名）
```

