---

id: HTML01

title: HTML
---

## 简介

```html
<!--
超文本标记语言 HTML就是书写网页的一套标准
如果你想要让浏览器能够渲染出你写的页面 你就必须遵循HTML语法
我们浏览器看到的页面，内部其实都是HTML代码（所有的网站内部都是HTML代码）
    XML也可以书写前端页面，odoo框架内部的前端页面全部都是用XML书写的 一般是写一些公司内部管理软件
-->
# 注释
<!--单行注释-->
<!--
多行注释1
多行注释2
多行注释3
-->
由于HTML代码非常的杂乱无章并且很多，所以我们习惯性的用注释来划定区域方便后续的查找
<!--导航条开始-->
导航条所有的html代码
<!--导航条结束-->
<!--左侧菜单栏开始-->
左侧菜单栏的html代码
<!--左侧菜单栏结束-->
```

## head内常用标签

```html
<title>Title</title>  网页标题
<style>
    h1{
        color: deeppink;
    }
</style>    内部用来书写css代码
<script>
    alert(123)
</script>   内部用来书写js代码
<script src="qnm.js"></script>          引入外部js文件
<link rel="stylesheet" href="qnm.css">  引入外部css文件

<meta name="keywords" content="QQ, 腾讯QQ, MACQQ, QQ2013, QQ2014, QQ2015, QQ手机版, 手机Q 腾讯, tencent"> 
当你在用浏览器搜索的时候 只要输入keywords后面指定的关键字那么该网页都有可能被百度搜索出来展示给用户  SEO查询 网页推荐
<meta name="description" itemprop="description" content="欢迎访问QQ官网，下载新版QQ，了解QQ最新功能就在im.qq.com">
网页的描述性信息
```

## boby常用标签

### 基本标签

```html
<h1>我是h1</h1>  标题标签 1~6级标题
<b>加粗</b>
    <i>斜体</i>
    <u>下划线</u>
    <s>删除线</s>
    <p>段落</p>
    <br>  换行
    <hr> 水平分割线
```

### 标签分类

```html
<!--分类1-->
        双标签
            <h1></h1>
        单标签
            <img/>
<!--分类2-->
    块儿级标签：独占一行
        h1-h6  p  div
        1.块儿级标签可以修改长度 行内标签不可以 修改了也不会变化
        2.块儿级标签内部可以嵌套任意的块儿级标签和行内标签
            但是p标签虽然是块儿级标签 但是他只能嵌套行内标签 不能嵌套块儿级标签 如果你套了 问题也不大 
            因为浏览器会自动帮你解开（浏览器是直接面向用户的 不会轻易的报错 哪怕有报错 用户也基本感觉不出来）
    行内标签：自身文本多大就占多大
        i  u  s  b  span
        行内标签不能嵌套块儿级标签 可以嵌套行内标签
```

### 特殊符号

```html
&nbsp;空格	&gt;大于号		&lt;小于号		&amp;&		&yen;￥		&copy;©版权		&reg;®商标
```

### 常用标签

```html
<!--
div  块儿级标签 span 行内标签 上述的留两个标签是在构造页面初期最常使用的 
页面的布局一般先用div和span占位置后再去调整样式 尤其是div使用非常的频繁
div你可以把它看成是一块区域 也就意味着用div来提前固定所有的区域 之后再在区域内填写内容即可
而普通的文本先用span标签
-->
```

#### img标签

```html
<!--图片标签-->
<img src="" alt="">  src 图片路径 可以是本地的也可以是网上的 url自动朝该url发送get请求获取数据
alt="当图片加载不出来的时候 给图片的描述性信息"
title="当鼠标悬念浮到图片呢上之后 自动展示的提示信息"
height='800px'  width=""  高度和宽度当你只修改一个的时候 另外一个参数会等比例缩放调整
```

#### a标签

```html
<!--连接标签-->
<a href="" target=""></a> href放url，用户点击就会跳转到该url页面
target 
    默认a标签是在当前页面完成跳转 _self
    你也可以修改为新建页面跳转    _blank
    
<!--a标签的锚点功能-->
'''点击一个文本标题 页面会自动跳转到该标题对应的内容区域'''
<a href="" id="d1">顶部</a>
<a href="#d1">回到顶部</a>
```

### 标签具有的两个重要书写

```python
1.id值
    类似于标签的身份证号 在同一个html页面上id值不能重复
2.class值
    该值有点类似于面向对象里面的继承 一个标签可以继承多个class值
```

#### 标签既可以有默认的书写也可以有自定义的书写

```html
<p id="d1" class="c1" username="jqm" password="123"></p>
```

### 列表标签

#### 无序列表(较多)

```html
<ul>
    <li>第一项</li>
    <li>第二项</li>
    <li>第三项</li>
</ul>
<!--虽然ul标签很丑 但是在页面布局的时候 只要是排版一致的的几行数据基本上用的都是ul标签-->
```

#### 有序列表(了解)

```html
<!--Pycharm-->ol>li{$}*3 tab键可快速建立下列格式
<ol type="I" start="5">  I做序列 I II III IV V开始 
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ol>
1 A I a ...
```

#### 标题列表(了解)

```html
<dl>
    <dt>标题1</dt>
    <dd>内容1</dd>
    <dt>标题2</dt>
    <dd>内容2</dd>
</dl>
```

### 表格标签

```html
<table border="1" cellpadding="5" cellspacing="10">
    <thead> 表头（字段信息）
        <tr>  一个tr就表示一行
            <th>username</th>  th加粗 td正常
            <th>password</th>
            <th>hobby</th>
        </tr>
    </thead> 
    <tbody> 表单（数据信息）
        <tr>
            <td colspan="2">jqm</td>  水平方向占两行 rowspan 竖直方向占两行
<!--                <td>123</td>-->
            <td>whh</td>
        </tr>
        <tr>
            <td>whh</td>
            <td>123</td>
            <td>jqm</td>
        </tr>
    </tbody>
</table>
```

### 表单标签

```html
<!--form表单能够获取用户数据并且发送到后端-->
<form action="http://127.0.0.1:5000/index/" method="post" enctype="multipart/form-data">   
    <!--method 控制提交方式默认是get请求  enctype 控制数据提交的编码格式-->
    <p>
        <label for="d1">用户名<input type="text" id="d1" value placeholder="请设置用户名"></label></p>
    <p>
        <label for="d2">密码</label><input type="password" id="d2" value placeholder="请设置登录密码"></p>

    <p>生日<input type="date"></p>

    <p>性别
        <input type="radio" name="gender" value="male" checked>男
        <input type="radio" name="gender" value="female">女</p>

    <p>省份
        <select name="province" id="">
            <option value="bj">北京</option>
            <option value="sh" selected>上海</option>
        </select></p>

   
    <p>了解
        <select name="" id="" >
            <optgroup label="nvyou">
                <option value="">相泽南</option>
                <option value="">天使萌</option>
            </optgroup>
            <optgroup label="nvyou2">
                <option value="">明里紬</option>
            </optgroup>
        </select></p>

    <p>文件
        <input type="file" multiple></p>  

    <p>文本框
        <textarea name="" id="" cols="30" rows="10"></textarea></p>

    <input type="submit" value="注册">
    <input type="reset" value="重置">
    <input type="button" value="空白按钮">
    <button>可提交的按钮</button>
</form>
```

#### 表单标签注释

```python
action:控制数据提交的后端路径（给哪个服务端提交数据）
    1.什么都不写 默认朝当前页面所在的url提交数据
    2.写全路径：https://www.baidu.com eg：朝百度服务端提交
    3.只写路径后缀action='/index/' 自动识别出当前服务端的ip和port拼接到前面
input和label都是行内标签 input不跟label关联也没有问题
input标签通过type属性变形
    text:普通文本
    password:密文
    date:日期  
    submit:用来触发form表单提交数据的动作
    button:就是一个普普通通的按钮 本身没有任何的功能 但是它是最有用的 
    reset:重置内容
    radio:单选
        默认选中要加checked='checked'
        当标签的属性名和属性值一样的时候可以简写
    checkbox:多选
    file:获取文件 加multiple也可以一次性获取多个
    hidden:隐藏当前input框
针对用户输入的标签。如果你加了value 那就是默认值
    disable 禁用  readonly只读
    value placeholder:默认值
select标签默认是单选 可以加multiple变多选  默认选中selected
textarea标签：获取大量文本
所有获取用户输入的标签 都应该有name属性
    name就类似于字典的key 用户的数据就类似于字典的value
针对用户选择的标签 用户不需要输入内容 但是你需要提前给这些标签添加内容value值
form表单提交文件需要注意
    1.method必须是post
    2.enctype="multipart/form-data"       enctype类似于数据提交的编码格式 
        默认是urlenncoded 只能够提交普通的文本数据 formdata 就可以支持提交文件数据
```



