---

id: css01

title: CSS
---

## 简介

**层贴样式表：就是给HTML标签添加样式的，让它变的更加好看**

```css
/*单行注释*/
通常我们在写css样式的时候也会用注释来划分样式区域（因为HTML代码多所以对应的css代码也会很多）
/*这是博客园首页的css样式文件*/
/*顶部导航条样式*/
...
/*左侧菜单栏样式*/
...
/*右侧菜单栏样式*/
...
```

```css
css的语法结构
选择器{属性1:值1;属性2:值2;属性3:值3;}
简写：div#d1.c1   tab键   --->  <div id="d1" class="c1"></div>
css的三种引入方式
    1.style标签内部直接书写
    <style>
        h1{
            color: deeppink;
        }
    </style>
    2.行内式（一般不用 多用于临时修改）
    <h1 style="color: deeppink">桃乃木香奈</h1>
    3.link标签引入外部css文件（最正规的方式 解耦合）
    <link rel="stylesheet" href="mycss.css">
```

## 选择器（找）

### 基本选择器

```css
ID选择器
#d1{
    color: deeppink;
}
类选择器
.c1{
    color: deeppink;
}
标签选择器
div{
    color: deeppink;
}
```

### 组合选择器

```css
后代选择器  只要是span内部的p都拿到
div span{
    color:red;
}
儿子选择器  只拿内部第一层级的span
div>span{
    color:red;
}
毗邻选择器 同级别紧挨着的下面的第一个
div+span{
    color:red;
}
弟弟选择器 同级别下面所有的
div~span{
    color:red;
}
```

### 属性选择器

```css
1.含有某个属性
[username]{
    color:red;
}
2.含有某个属性并且有某个值
[username="jqm"]{
    color:red;
}
3.含有某个属性并且有某个值的某个标签
input[username="jqm"]{
    color:red;
}
```

### **分组和嵌套** 

```css
/*分组  逗号表示并列关系*/
div,p,span{
    color: deeppink;
}
/*嵌套*/
#d1,.c1,span{
    color:deeppink;
}
```

### 伪类选择器	

```css
a:link{ /*访问之前的状态*/
    color: tan;
}
a:hover{ /*需要记住*/
    color: deeppink; /*鼠标悬浮态*/
}
a:active{
    color: crimson; /*鼠标点击不松开的状态 激活态*/
}
a:visited{
    color: darkgray; /*访问之后的状态*/
}
input:focus{ /*input框获取焦点(鼠标点了input框)*/
    background-color: cornflowerblue;
}
```

### 伪元素选择器

```css
p:first-letter {   /*开头第一个字大*/
    font-size: 48px;
    color: orange;
}
p:before{  /*开头加文本内容 但无法选中*/
    content:'桃乃木';
    color: hotpink;
}
p:after{  /*结尾加文本内容 但无法选中*/
    content: '香奈';
    color: tan;
}
```

### 选择器优先级

```python
1.选择器相同 书写顺序不同
    就近原则：谁近就听谁的
2.选择器不同
    行内式 > id选择器 > 类选择器 > 标签选择器 
```

## CSS属性相关

### 长宽

```css
p{
    background-color: orange;   
    height: 200px;
    width: 400px;
}
```

**块儿级标签没有设置宽度的情况下默认占浏览器一整行**

**块儿级标签的高度也是取决于标签内部的文本的高度行内标签无法设置长宽 写了也无法生效**

### 字体属性

```css
p{
    font-size: 24px;    字体大小
    font-family:        字体样式 草书 行书...
    font-weight: inherit;   border lighter 100-900 inherit继承父元素的粗细值
    font-weight: bolder;    加粗
    color: orange;      直接写颜色英文
    color: #ee762e;     颜色编号
    color: rgb(255,103,0);      三基色 数字 范围0-255
    color: rgba(255,103,0);     第四个参数是颜色的透明度 范围是0-1
}
```

### 文字属性

```css
p{
    text-align: center;          文字居中center 左对齐left 右对齐right
    text-decoration: underline;  下划线underline 头顶线overline 删除线line-through
    text-indent: 32px;           首行缩进
}
a{
    text-decoration: none;  去掉a标签下划线
}
```

### 背景图片

```css
background-color: red;
background-image: url("图片地址");   默认全部铺满
background-repeat: no-repeat;       不铺
background-repeat:repeat-x;         其实浏览器不是一个平面 是一个三维立体结构
background-repeat:repeat-y;         z轴指向用户 越大离用户越近
background-position:center center;  第一个左 第二个上
 ↓ 如果出现了多个属性名前缀是一样的情况下 一般情况下都可以简写 只写前缀 填上你想要加的参数即可 位置随意 个数也无限制
background: red url("图片地址") no-repeat center center; 

 ↓ 例子：参考im.qq.com
<style>
    #d1{
        height: 1000px;
        background-image: url("111.png");
    }
    #d2{
        height: 2000px;
        background: url("2.jpg") fixed;  /*attachment*/
    }
    #d3{
        height: 1000px;
        background: url("22.png");
    }
</style>
<body>
    <div id="d1"></div>
    <div id="d2"></div>
    <div id="d3"></div>
</body>
```

### 边框

```css
border: 3px solid red;   /*width,style实线,color*/
border-radius: 50%;
```

### display属性

```css
/*能够让标签具有本身没有的属性和特征*/
none 隐藏 并且原来的位置也没了
inline
block
inline-block
visibility:hidden 只隐藏   位置还在
```

### 盒子模型

```css
margin      外边距
border      边框
padding     内边距
contennt    内容
boby标签默认自带8px的margin
margin:
    10 上下左右
    10 20 上下 左右
    10 20 30 上 左右 下
    10 20 30 40 上 右 下 左
padding:
    同上
```

### 浮动float

**只要是前期页面布局 一般都是用浮动来设计页面	能够让标签脱离正常的文档流漂浮到空中（距离用户更近）**

**浮动的元素没有块儿级和行内一说 标签多大浮动起来之后就占多大	解决浮动带来的影响  通用的解决方法**

```css
.clearfix:after{
            content: '';
            display: block;
            clear: both;
}
只要标签出现了塌陷的问题就给该塌陷的标签加一个clearfix属性即可
```

### 溢出属性

```css
overflow: scroll;  /*设置成上下滚动条的形式*/
overflow: auto;    /*自动*/
overflow: hidden;  /*内容会被修剪，并且其余内容是不可见的*/
```

### 定位

```css
/*浏览器是优先展示文本的*/
静态
    所有的标签默认都是静态的static 无法改变位置 position: static
相对定位（了解）
    相对于标签原来的位置叫移动relative position: relative 
    /*标签由static变成relative它的性质就从原来没有定位的标签变成了已经定位过的标签*/
绝对定位（常用）
    相对于已经定位过的父标签做移动（如果没有父标签，那么就以boby做参照） position: absolute
    /*当你不知道页面其他标签的位置和参数，只给了你一个父标签的参数，让你基于该标签做定位*/
    eg:小米网站购物车
固定定位（常用）
    相对于浏览器窗口固定在某个位置  position:fixed  /*写了fixed之后 定位就是根据浏览器窗口*/
    eg:右侧小广告
```

### 验证浮动和定位是否脱离文档流（原来的位置是否还保留）

```css
# 不脱离文档流
1.相对定位
# 脱离文档流
1.浮动
2.绝对定位
3.固定定位
```

### z-index模态框

```css
eg:百度登陆页面 其实是三层结构
    1.最底部是正常内容（z=0）  最远的
    2.黑色的透明区（z=99）     中间层
    3.白色的注册区域（z=100）  离用户最近
```

### 透明度opacity

```python
"""它不单单可以修改颜色的透明度还同时修改字体的透明度
rgba只能影响颜色
而opacity可以修改颜色和字体"""
```

