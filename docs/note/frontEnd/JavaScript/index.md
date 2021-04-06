---

id: javaScript01

title: javaScript
---



## js简介

```javascript
js注释
// 单行注释
/*多行注释*/
js的两种引入方式
    //script内部书写
    //script src属性引入外部js文件
js也是一门面向对象的编程语言
js/python是一门拥有动态类型的语言
name = 'jqm'
name = 123
name = [1,2,3]
// name可以指向任意的数据类型 但是有一些语言中 变量名只能指向一种后续不能更改
```

## 语法相关

### js变量&常量

```javascript
//变量
命名规范：变量名只能是 数字 字母 下划线 $  建议使用驼峰式命名 eg: theUserName
在js中首次声明变量需要私用关键字
    var声明的都是全局 5.1版本及之前
    let可以区分全局和局部   6.0版本新出的
//常量
在js中是有真正意义上的常量的
    connst pi =3.14
    pi = 3.44  # 报错
```

### 数值类型(number)

```javascript
var a = 11;
let b = 11.11;   //都是数字 没有浮点型 
查看数据类型
    typeof a;
    // 特殊的NaN数值类型 表示的意思是"不是一个数字0 NOT A NUMBER"
类型转换
parseInt()     //转整型
parseFloat()   //转浮点型
```

### 字符类型（string）

```javascript
var a = 'jqm'
// 模版字符串 定义多行文本
var s3 = `
41515153
3132132
313153
`
// 模版字符串 格式化字符串 书写${}会自动去前面找大括号里面的变量名对应的值 如果没有定义直接报错
var name = 'jqm'
var age = 18
var s4 = `
    my name is ${name} age ${age}
    `
s4  // "my name is jqm age 18"
// 字符串拼接 
    //python 中推荐join做拼接
    //javaScript 中推荐+做拼接
```

### 常用方法

| python     | javaScript         | 说明                                          |
| :--------: | :----------------: | :-------------------------------------------: |
| len()      | .length            | 长度                                          |
| .strip()   | .trim()            | 去除左右空白，不能加括号去除指定的内容        |
| .join()    | .concat(value,...) | 拼接 (js不是字符串也可以直接拼)               |
| []索引取值 | .slice()           | 索引,切片                                     |
| .lower()   | .toLowerCase()     | 小写                                          |
| .upper()   | .toUpperCase()     | 大写                                          |
| .split()   | .split()           | 切割 (js第二个参数是获取切割之后的元素的个数) |
| .append()  | .push()            | 列表添加值                                    |

### 布尔值  

```javascript
/*
python中的布尔值是首字母大写的
javaScript中的布尔值就全小写的
布尔值的False有哪些  空字符串 0 null undefined NaN
```

#### null与undefined

```javascript
null
    表示值为空 一般都是指定或者晴空一个变量时使用
    name = 'jqm'
    name = null
undefinned
    表示声明了一个变量 但是没有做初始化操作
    函数没有指明返回值的时候 返回的也是undefinned
```

![img](https://gitee.com/JqM1n/biog-image/raw/master/20210406191528.png)

### 数组

```javascript
数组 (类似于python里面的列表) []
var l = [1,2,3,4]
l[-1]  // 索引不可以负数
// forEach
l.forEach(function(value){console.log(value)},l) // console.log打印
l.forEach(function(value,index){console.log(value,index)},l)   // index 索引值
l.forEach(function(value,index,arr){console.log(value,index,arr)},l) // arr数据来源
// split
l.split(0,1) //删除 第一个参数是起始位置 第二个是删除的个数 返回剩下的
l.split(0,1,5) // 先把前两个参数指定的内容删除 然后添加第三个参数的内容
l.split(0,1,[111,222,333])  // 返回" [Array(3), 2, 3, 4]
// map 和forEach 差不多 语义不同
```

### 运算符

```javascript
// 算术运算符
var x = 10;   
var r1 = x++;    // +号在后面先做赋值再自增 所以r1 = 10
var r2 = ++x;    // +号在前面先自增再赋值  上一步r1自增后变成11 所以r2是11+1=12
    ++表示自增1 类似于 += 1
// 比较运算符
1 == '1'   // ture 在javaScript中内部自动转换成相同的数据类型比较了  ==: 弱等于
1 === '1'  // false 内部不做类型转换   ===:强等于
// 逻辑运算符
python中 and or not   and两边真为真  返回 y 的计算值
javaScript 中 && || !
5 && '5' // '5' 如果 x 为 False，x and y 返回 False，否则它返回 y 的计算值。
0 || 1  // 0是false 所以取后边  如果 x 是非 0，它返回 x 的值
!5 && '5' // !5false 返回!5
```

### 流程控制

#### if判断

```javascript
if else for while ...
// if判断
var age = 28;
// if(条件){条件成立之后指向的代码块}
if(age>18){
    console.log('如果符合打印内容1')
}else if(age<24){
    console.log('如果符合打印内容2')
}else(
    console.log('否则打印内容3')
)
```

#### switch语法

```javascript
// 提前列举好可能出现的条件和解决方式
var num = 1;
switch(num){
    case 0:
        console.log('0')
    break;
    case 1:
        console.log('1')
    break;
    case 2:
        console.log('2')
    break;
    default:
        console.log('条件都没有匹配上 默认走的流程')
}
```

### for循环

```javascript
for(起始条件;循环条件;每次循环的操作){
    console.log(i)
}
// 循环打印出数组里面的每一个元素
var l1 = [11,22,33,44,55]
for(let i=0;i<l1.lenth;i++){
    console.log(l1[i])
}

// while循环
var i = 0
while(i<10){
    console.log(i)
    i++;
}

// 三元运算符
    python: res = 1 if 1>2 else 3
javaScript: res = 1>2?1:3  //条件成立取问号后面的值 不成立取冒号后面的值
```

### 函数

```javascript
    python: def
javaScript: function
// 格式
function 函数名(形参1,形参2,形参3...){函数体代码}
//无参函数
function func1(){
    console.log('hello world')
}
func1()   // 调用 加括号调用
//有参函数
function func2(a,b){
    console.log(a,b)
}
func2(a,b)   //参数如果传多了传少了都没关系
//关键字arguments
function func3(a,b){
    console.log(arguments)  // 能够获取到函数接受到的所有参数
    console.log(a,b)
} 
function func2(a,b){
    if(arguments.lenth<2){
        console.log('传少了')
    }else if (arguments.lenth>2){
        console.log('传多了')
    }else{
        console.log('正常执行')
    }
}
//函数的返回值
return    // 不支持解压赋值
//箭头函数（了解一下） 类似于匿名函数
var func1 = v => v;   // 箭头左边是形参 右边是返回值
等价于
var func1 = function(v){
    return v
}
```

### 自定义对象

```javascript
// 可以看成是我们python中的字典 但是javaScript中的自定义对象要比python里面的字典操作更方便
// 创建自定义对象{}
//第一种
var d = {'name':'jqm','age':18}
d['name']
'jqm'
d.age   //取值方便
18
for(let i in d){
    consolelog(i,d[i])}  // 支持for循环 暴露给外界可以直接获取的也是键
//第二种 关键字new
var d1 = new Object()
d1.name = 'jqm'
{name:'jqm'}
d2['age'] = 18
{name:'jqm','age':18}
```

### Date对象(时间）

```javascript
let d3 = new Date()
Tue Aug 25 2020 13:58:25 GMT+0800 (中国标准时间)
d3.toLocaleString()
"2020/8/25 下午1:58:25"
// 时间对象的具体方法
d3.getDate()      // 获取日
d3.getDay()       // 获取星期
d3.getMonth()     // 获取月份(0-11)
d3.getFullyear()  // 获取完整的年份
d3.getHours()    // 获取小时
d3.getMinutes()  // 获取分钟
d3.getSeconds()  // 获取秒
d3.getMilliseconds()  // 获取毫秒
d3.getTime()     // 时间戳
```

### JSON对象

```css
python中：
    dumps              序列化
    loads              反序列化
javaScript中：
    JSON.stringify()   序列化
    JSON.parse()       反序列化
```

### RegExp对象

```javascript
在python中如果需要使用正则 需要你使用re模块
在javaScript中则需要你创建正则对象
// 第一种 麻烦
let r1 = new RegExp('正则表达式')
// 第二种 推荐
let r1 = /正则表达式/   // 什么都不写默认匹配undefined
// 获取字符串中所有的k
bR = 'jqmkfckfc'
bR.match(/k/)     // 拿到一个就停止了
 bR.match(/k/g)  // 全局匹配 g就表示全局模式 全局模式下有一个lastIdex属性 
```

## 操作相关 BOM与DOM操作

```css
BOM 浏览器对象模型   Browser Object Model
    js代码操作浏览器
DOM 文档对象模型     Document Object Model
    js代码操作标签
```

### BOM操作

```javascript
window 对象
/* window对象指代的就是浏览器窗口*/ 
window.innerHeight   // 获取浏览器窗口的高度
window.innerWidch    // 获取浏览器窗口的宽度
window.open('www.baidu.com','','height=400px,width=400px,top=400px,left=400px')
// 第一个参数就是新建打开的网址 第二个参数空 第三个参数新建的窗口大小和高度
window.close()  // 关闭当前页面
```

#### window子对象

```javascript
window.navigator.appName     // 获取当前浏览器名字
window.navigator.appVersion  // 获取当前你浏览器的版本
window.navigator.userAgent   // 获取当前浏览器标识 **
window.navigator.platform    // 获取当前浏览器平台 eg：windows/mac、linux
```

#### history对象（掌握）

```javascript
window.history.back()      // 回退到上一页
window.history.forward()   // 前进到下一页
window.location   // 获取有关当前 URL 的信息。
window.location.href  // 获取当前页面的网址
window.location.href='www.baidu.com'  // 跳转到指定的url
window.location.reload()      // 刷新方法
```

#### 弹出框

```javascript
/*   警告框  */
alert('警告内容')
/*   确认框  */
confirm('确认内容')  // 会有 取消 和 确认 两个选择
/*   提示框  */
prompt('提示内容','输入框默认的内容')  // 提示内容下面会有个输入框给用户输入
```

#### 计时器相关

```javascript
1.过一段时间之后触发（一次）
2.每隔一段时间触发一次（循环）
<script>
    function func1(){
        alert(123)
    }
    let t = setTimeout(func1,3000)  // 毫秒为单位 3秒后自动执行func1函数
    
    clearTimeout(t)   // 取消定时任务 如果要清除任务 需要在使用前用变量指代定时任务
/*  2  */
   function func2(){
       alert(123)
   }
   function show(){
       let t = setInterval(func2,3000)  // 每隔3秒执行一次
       function inner(){
           clearInterval(t)    // 取消定时任务
       }
       setTimeout(inner,9000)  // 9秒之后触发
   }
   show()
```

### DOM操作

#### 直接查找（掌握）

```javascript
/*  id查找   */
document.getElementById('d1')    // 返回标签对象
<div id='d1'>...</div>

/*  类查找   */
document.getElementsByClassName('c1')  // 返回的是数组
HTMLCollection [div.c1]0: div.c1length: 1__proto__: HTMLCollectio

/*  标签查找 */
document.getElementsByTagName('div')  // 返回的是数组
HTMLCollection(2) [div#d1, div.c1, d1: div#d1]

/*  可赋值变量 方便使用  */   
// 当你用变量名指代标签对象的时候 变量名推荐你书写成xxxEle格式
let divEle = document.getElementsByTagName('div')[0]
```

#### 间接查找

```javascript
let pEle = document.getElementsByClassName('c1')[0]    // 注意看是否需要索引取值
pEle.parentElement     // 拿父节点
pEle.children     // 获取所有的子标签
pEle.children[0]
pEle.nextElementSibling       // 同级别下面第一个
pEle.previousElementSibling   // 同级别上面第一个
```

#### 节点操作

```javascript
/* 设置标签属性 */ 
let imgEle = document.createElement('img')     // 创建标签
imgEle.setAttribute('src','这是张图片.png')     // 自定义设置属性
imgEle.setAttribute('username','jqm')          // 自定义设置属性
<img src= '这是张图片.png' username = 'jqm' >   
/* eg:将上面的标签添加到某个div下 */ 
let divEle = document.getElementById('d1')   // 找到这个div对象并赋值给变量
divEle.appendChild(imgEle)                   // 标签内部添加元素(尾部添加)
/* 设置标签文本 */ 
let aEle = document.createElement('a')        // 同上 创建一个标签先
aEle.innerText = '这里输入需要设置的标签文本内容'  // 自定义设置标签文本
/* eg:将上面的标签添加到某个div内部,p标签上面  */ 
let divEle = document.getElementById('d1')    // 找到这个div对象并赋值给变量
let pEle = document.getElementById('d2')      // 找到这个div对象并赋值给变量
divEle.insertBefore(aEle,pEle)     // 把第一个参数放进divEle里面,pEle前面
/* 额外补充 */
removeChild()     // 移除末尾
getAttribute()     // 获取属性
removeAttribute()   // 移除属性

/*** innerText和innerHTML ***/
divEle.innerText  // 获取标签内部所有的文本
divEle.innerHTML  // 获取标签内部所有的文本和标签
divEle.innerText = '<h1>hhhhhhhhhh</h1>'   // 不识别html标签  输入什么就是什么
divEle.innerHTML = '<h1>hhhhhhhhhh</h1>'   // 识别html标签 
```

#### 获取值操作

```javascript
/* 获取用户数据之标签内部的数据  */ 
let inputEle = document.getElementById('d1')   // 老规矩 查找 赋值
inputEle.value   // 获取inout框用户输入的数据
/* 获取用户上传的文件数据  */ 
let fileEle = document.getElementById('d2')   // 老规矩 查找 赋值
fileEle.files   // 拿到的是一个数组
fileEle.files[0]   // 获取文件数据
```

#### class、css操作

```javascript
/*  class */ 
let divEle = document.getElementById('d1')    // 老规矩 查找 赋值
divEle.classList   // 获取标签所有的类属性
DOMTokenList(2) ["c1", "c2", value: "c1 c2"]
divEle.classList.remove('c2')    // 移除某个类属性
divEle.classList.add('c3')       // 添加类属性
divEle.classList.contains('c1')  // 验证是否包含某个类属性 ture/false
divEle.classList.toggle('c2')    // 验证有无 有则删除 无则添加  开关灯事例
/* css */   // DOM操作标签样式 统一先用style起手 
let pEle = document.getElementsByTagName('p')[0]  // 老规矩 查找 赋值
pEle.style.color = 'red'  // 改颜色 
// 会将css中的横杆或者下划线去掉 然后将后面的单词变大写 eg：font-size  -->  fontSize
```

#### 事件

```javascript
/* 达到某个事先设定的条件 自动触发的动作  */ 
// 绑定事件的两种方式
<body>
    <button onclick = 'func1()'>按钮2</button>
    <button id = 'd1'>按钮2</button>
<script>
    // 第一种绑定事件的方式
    function func1(){
        alert('这是一个警告框1')
    }
    // 第二种绑定事件的方式
    let btnEle = document.getElementById('d1')
    btnEle.onclick = function(){
        alert('这是一个警告框2')
    }
</script>  // script标签既可以放在head内也可以放在body内 一般是在body最底部
</body>
```

#### 开关灯案例

```javascript
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        .c1{
            width: 400px;
            height: 400px;
            border-radius: 50%;
        }
        .bg_off{
            background-color: darkgray;
        }
        .bg_open{
            background-color: orange;
        }
    </style>
</head>
<body>
   <div id = 'd1' class = 'c1 bg_off bg_open'></div>
   <button id = 'd2'>比如这是一个开关按钮</button>
<script>
    let btnEle = document.getElementById('d2')
    let divEle = document.getElementById('d1')
    btnEle.onclick = function () {  // 绑定点击事件
        // 动态的修改div标签的类属性
        divEle.classList.toggle('bg_open')
    }
</script>
</body>
```

#### input框获取焦点失去焦点案例

```javascript
<body>
   <input type = 'text' value = '默认内容' id = 'd1'></input>
<script>
    let iEle = document.getElementById('d1')
    iEle.onfocus = function () {
        // 将input框内部值去除  等号就是赋值
        iEle.value = ''
    }
    // 失去焦点事件
    iEle.onblur = function () {
        // 给input框输入新的值
        iEle.value = '新的内容'
    }
</script>
</body>
```

#### 实时展示当前时间案例

```javascript
<body>
<input type="text" id = 'd1' style = 'display: block; height: 50px; width: 200px'>
<button id = 'd2'>开始</button>
<button id = 'd3'>结束</button>
<script>
    // 先定义一个全局变量存储定时器的变量
    let t = null
    let inputEle = document.getElementById('d1')
    let startBthEle = document.getElementById('d2')
    let endBthEle = document.getElementById('d3')
    // 1 访问页面之后 将访问的时间展示到input中
    // 2 动态展示当前时间
    // 3 页面上加两个按钮 一个开始 一个结束
    function showTime() {
        let currentTime = new Date();
        inputEle.value = currentTime.toLocaleString()  // 转成当地的时间
    }
    startBthEle.onclick = function () {
        // 限制定时器只能开一个
        if(!t){
            t = setInterval(showTime,1000) // 每点击一次就会开设一个定时器 而t指代最后一个
        }
    }
    endBthEle.onclick = function () {
        clearInterval(t) // 清除定时器
        // 还应该将t重置为空
        t = null
    }
</script>
</body>
```



