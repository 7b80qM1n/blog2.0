---

id: frontEnd-jQuery1

title: jQuery
---

## 什么是jQuery

- jQuery是一个轻量级的、兼容多浏览器的JavaScript库。
- jQuery使用户能够更方便地处理HTML Document、Events、 实现动画效果、方便地进行Ajax交互,能够极大地简化JavaScript编程。它的宗旨就是:"Write less, do more.'

## jQuery的优势

- 一款轻量级的JS框架。jQuery核心js文件才几+kb, 不会影响页面加载速度。
- 丰富的DOM选择器jQuery的选择器用起来很方便，比如要找到某个DOM对象的相邻元素，JS可能要写好几行代码，而jQuery- -行代码就搞定了，再比如 要将一个表格的隔行变色，jQuery也是一行代码搞定。
- 链式表达式。jQuery的链式操作可以把多个操作写在一行代码里，更加简洁。
- 事件、样式、动画支持。jQuery还简化了js操作css的代码， 并且代码的可读性也比js要强。
- Ajax操作支持。jQuery简化了 AJAX操作,后端只需返回-个JSON格式的字符串就能完成与前端的通信。
- 跨浏览器兼容。jQuery基本兼容了现在主流的浏览器，不用再为浏览器的兼容问题而伤透脑筋。
- 插件扩展开发。jQuery有着 丰富的第三方的插件，例如:树形菜单、日期控件、图片切换插件、弹出窗口等等基本前端页面上的组件都有对应插件，并且用 jQuery插件做出来的 效果很炫，并且可以根据自己需要去改写和封装插件，简单实用。

## jQuery语法

```javascript
jQuery(选择器).action ( )
秉持着jQuery的宗旨 jQuery简写 $
jQuery() === $()
// jQuery与js代码对比
eg:将p标签内部的文本颜色改为红色
// 原生js代码操作标签
let pEle = document.getElementById('d1')
pEle.style.color = 'red' 
// jQuery操作标签
$('p').css('color','blue')
```

## 查找（CSS）

### 基本选择器

```javascript
// id选择器
$('#d1')
// class选择器
$('.c1')
// 标签选择器
$('span')
/* 一定要区分开（重点）*/
// jQuery 对象如何变成标签对象
$('#d1')[0]
// 标签对象如何变成jQuery对象
$(document.getElementById('d1'))
```

### 组合选择器/分组与嵌套

```javascript
$('div')
$('div.c1')    // 找到有c1 class类的div标签
$('div#d1')
$('#d1,.c1,p')  // 并列+混用
$('div span')   // 后代
$('div>span')   // 儿子
$('div+span')   // 毗邻
$('div~span')   // 弟弟
```

### 基本筛选器

```javascript
$('u1 li')
$('u1 li:first')        // 第一个
$('u1 li').first()      //同上 选择器封装了一下  
$('u1 li:last')         // 最后一个
$('u1 li').last()       //同上 选择器封装了一下  
$('u1 li:eq(index)')    // 索引等于index的那个元素
$('u1 li').eq(index)    //同上 选择器封装了一下  
$('u1 li:even')         // 匹配所有索引值为偶数的元素，从 0 开始计数
$('u1 li').even()        //同上 选择器封装了一下  
$('u1 li:odd')          // 匹配所有索引值为奇数的元素，从 0 开始计数
$('u1 li').odd()        //同上 选择器封装了一下  
$('u1 li:gt(index)')    // 匹配所有大于给定索引值的元素
$('u1 li').gt(index)     //同上 选择器封装了一下  
$('u1 li:lt(index)')    // 匹配所有小于给定索引值的元素
$('u1 li').lt(index)     //同上 选择器封装了一下  
$('u1 li:not(元素选择器)')   // 移除所有满足not条件的标签
$('u1 li').not(元素选择器)    //同上 选择器封装了一下  
$('u1 li:has(元素选择器)')  // 选取所有包含一个或多个标签在其内的标签(指的是从后代元素找)
$('u1 li').has(元素选择器)  //同上 选择器封装了一下  
```

### 属性选择器

```javascript
$('[username]')               //1.含有某个属性
$('[username="jqm"]')         // 2.含有某个属性并且有某个值
$('input[username]="jqm"]')   // 3.含有某个属性并且有某个值的某个标签
$('[type =="text"]')          //内置的属性也可以
```

### 表单筛选器

```javascript
/* 使用于所有的form表单  */ 
$('input[type=="text"]')        // 找到input标签中含有type属性值为text的
$('input[type=="password"]')    // 找到input标签中含有type属性值为password的
$(':text')    // 等价于1    找到标签中含有type属性值为text的
$(':password')  // 等价于2
// 特殊情况 
$(':checked')       // 拿到默认选择的checkbox和option
$('input:checked')  // 在书写表单筛选器的时候 如果前面可以加限制条件 最好加一个
// eg....
:file        // 找到所有文件
:radio       // 找到所有单选
:checkbox    // 找到所有多选
:submit     // 找到所有 用来触发form表单 提交 数据的动作
:reset      // 找到所有重置内容按钮
:button     // 找到所有的按钮
...
// 还有表单对象属性...都适用的
:enabled
:disabled        // 禁用
:chacked         // 找到所有radio单选中的默认选中 有BUG 会把select的单选也拿到
:selected        // 找到所有select单选中的 默认选中
```

### 筛选器方法

```javascript
$('#d1').next()   // 同级别下一个
$('#d1').nextAll()  // 同级别下所有
$('#d1').nextUntil('.c1')  // 同级别下所有 直到.c1停 不包括最后一个 顾头不顾尾
$('.c1').prev()   // 上一个
$('.c1').prevAll()  //.c1上面所有
$('.c1').prevUntil('#d2')  //.c1上面所有 直到#d2停 不包括最后一个 顾头不顾尾
$('#d3').parent()  // 第一级父标签
$('#d3').parents()  // 拿到所有父标签
$('#d3').parentsUntil('body')  // 拿到所有父标签 直到body停 不包括body 顾头不顾尾
$('#d2').children()    // 儿子们  返回被选元素的所有直接子元素
$('#d2').siblings()    // 同级别上下所有
$('div p') === $('div').find('p')
```

## 操作(JavaScript)

```javascript
// eg:css操作  一行代码将第一个p标签变成绿色第二个标签变成蓝色第三个标签变成粉色
<p>jqm</p> 
<p>whh</p>
<p>cwh</p>
$('p').first().css('color','green').next().css('color','blue').next().css('color','pink')
// jQuery的链式操作 使用jQuery可以做到一行代码操作很多标签
// jQuery对西乡调用jQuery方法之后返回的还是当前jQuery对象 也就可以继续调用其他方法
/* 原理大概就像是python中的类对象在最后把自己返回了出去 所以可以继续调用 */
        class Myclass(object):
            def func1(self):
                print('func1')
                return self
            def func2(self):
                print('func2')
                return self
        obj = Myclass()
        obj.func1().func2()
// 位置操作
offset()
position()
scrollTop()  // 需要了解
    $(window).scrollTop()  // 不加参数就是获取 当前页面滚轮的位置
    $(window).scrollTop(500)// 加了参数就是设置 当前页面滚轮的位置
// 尺寸操作
$('p').height()  // 文本
$('p').width()   
$('p').innerHeight()  // 文本+padding（内边距）
$('p').innerWidth()
$('p').outerHeight()  // 文本+padding+border
// 获取值操作
$('#d1').val()   // 不加参数就是获取 
$('#d1').val('修改的值')  // 加了参数就是设置
/* 获取用户上传的文件数据  */ 
$('#d2')[0].files[0]   // 牢记两个对象之间的转换 
/* 在用变量存储对象的时候 js中推荐使用xxxEle  jQuery中推荐使用$xxxEle  */ 
let $pEle = $('p')   //先存储变量
$pEle.attr('id')  // 获取属性  没有返回 undefined
$pEle.attr('class','c1')  // 设置属性
$pEle.removeAttr('password')  // 删除属性
// ↑↑↑↑ 用于标签上 有的 能够看到的 属性和自定义属性 用attr  
// ↓↓↓↓ 对于返回布尔值比如checkbox radio option是否被选中用prop  
// * 专门提供给选择按钮的  */
$('#d2').prop('checked')    // 查看是否被选上
$('#d3').prop('checked'，true)    // 让这个按钮被选上
// 文本操作
$('div').text()  // 不加参数就是获取 获取标签内部的所有文本内容
$('div').text('修改的内容')  // 加了参数就是设置 和DOM操作一样  输入什么就是什么
$('div').html()  // 不加参数就是获取  获取标签内部的所有文本和标签
$('div').html('<h1>修改的内容</h1>')   // 加了参数就是设置 和DOM操作一样 识别html 
// 文档处理
let $pEle = $('<p>')
$('#d1').append($pEle)      // 内部尾部追加
$pEle.appendTo($('#d1'))    // ↑↑↑两者等价
$('#d1').prepend($pEle)     // 内部头部追加
$pEle.prependTo($('#d1'))   // ↑↑↑两者等价
$('#d2').after($pEle)       // 放在某个标签后面
$pEle.insertAfter($('#d2'))
$('#d2').before($pEle)      // 放在某个标签前面
$pEle.insertBefore($('#d2'))
$('#d1').remove()           // 将标签从DOM树中删除
$('#d1').empty()            // 清空标签内部所有的内容
```

## 事件

```javascript
<body>
<button id = 'd1'>按钮1</button>
<button id = 'd2'>按钮2</button>
<script>
// 第一种
    $('#d1').click(function(){
        alert('这是一个警告框1')
    })
// 第二种(这种更加强大 还支持事件委托)
    $('#d2').on('click',function(){
        alert('这是一个警告框2')
    })
</script>
</body>
// 克隆事件
    clone()  // 默认情况下只克隆标签和文本不克隆事件
        clone(true)  // 都克隆
// 返回顶部
    $(window).scroll(function(){})
// hover事件
    $('#d1').hover(
        function(){}   // 鼠标指针悬停
        function(){}   // 鼠标指针移开
        )   
// input框实时监控输入内容事件
    $('#d1').on('input',function(){})
// 键盘按键事件
    $(window).keydown(function(event){
        event.keyCode
        })
    $(window).keyup(function(){})
```

### 阻止后续事件的执行

```javascript
<body>
<form action="">
    <span id="d1" style="color: orange"></span>
    <input type="submit" id = 'd2'>
</form>
<script>
    $('#d2').click(function(e){
        $('#d1').text('看得到我吗?')
        // 方式1
        return false
        // 方式2
        e.preventDefault()
    })
</script>
</body>
```

### 阻止事件冒泡

```javascript
<body>
<div id = 'd1'>div
    <p id = 'd2'>p
        <span id="d3">span</span>
    </p>
</div>
<script>
    $('#d1').click(function(e){
        alert('div')})
    $('#d2').click(function(e){
        alert('p')})
    $('#d3').click(function(e){
        alert('span')
        // 阻止事件冒泡的方式1
        return false
        // 阻止事件冒泡的方式2
        e.stopPropagation()
    })
</script>
</body>
```

### 委托事件

```javascript
<body>
<button>屠龙宝刀，点击即送</button>
<script>
    // 给页面上所有的button标签绑定点击事件
    // $('button').click(function(){
    //     alert('屠龙宝刀*1')    // 无法影响到动态创建的标签
    // })
    $('body').on('click','button',function () {
        alert('屠龙宝刀*1')      // 将指定的范围内将事件委托给某个标签 无论该标签是事先写好的还是后面动态创建的
    })
</script>
</body>
```

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210410102509.png)

### each方法

```javascript
<body>
<div>1</div>
<div>2</div>
<div>3</div>
</body>
/* 有了each之后 就无须自己写for循环了 用它更加的方便  */ 
// 第一种
$('div').each(function(index){console.log(index)})   // 第一个参数索引 
0
1
2
$('div').each(function(index,obj){console.log(index,obj)})  // 第二个参数标签对象
0   <div>1</div>
1   <div>2</div>
2   <div>3</div>
// 第二种
$.each([11,22,33],function(index,obj){console.log(index,obj)}) 
0   11
1   22
2   33
```

### data方法

```javascript
/* 能够让标签帮我们存储数据 并且用户肉眼看不见  */ 
$('div').data('info','xxx')    
$('div').first().data('info')  // 获取第一个info的值
$('div').first().removeData('info') // 删除第一个info的值
```

### addClass() 方法

```javascript
$("button").click(function(){
    $("p:first").addClass("intro");
});
```

