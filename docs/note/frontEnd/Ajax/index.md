---

id: frontEnd-Ajax1

title: Ajax-基于jquery
---

## ajax简介

- ajax不是新的编程语言，而是一种使用现有标准的新方法
- ajax最大的优点是在不重新加载整个页面的情况下，可以与服务器交换数据并更新部分网页内容。（这一特点给用户的感受就是在不知不觉中完成请求和响应过程）
- 异步提交
- 局部刷新

## ajax基本语法

```javascript
// 朝后端发送ajax请求
$.ajax({
    // 1.指定朝哪个后端发送ajax请求
    url:'', // 默认就是朝当前地址提交
    // 2.请求方式
    type:'post', // 默认就是get请求
    // 3.数据
    data:{}
    // 4.回调函数 当后端给你返回结果的时候会自动触发 args接收后端发来的数据
    success:function(args){
        console.log(args)
    } 
})
'当你在利用ajax进行前后端交互的时候 后端无论返回什么都只会被回调函数接受 从而不影响浏览器页面'
'当后端是以HttpResponse返回的json格式的数据 默认是不会自动反序列化的'
'1.自己手动JSON.parse()'
'2.配置dataType参数'
以防万一 后端用JsonResponse
```

## 前后端传输的编码格式（contenType）

可以朝后端发送post请求的方式

1. form表单
2. ajax请求

前后端传输数据的编码格式

1. `urlencoded`
2. `formdata`
3. `json/application`

form表单

- 默认的数据编码格式是`urlencoded`
- django后端针对符合`urlencoded`编码格式的数据都会自动帮你解析封装到`request.POST`中（包括文件）
- 如果你把编码格式改成`formdata`,那么针对普通的键值对还是解析到`request.POST`中 文件解析到`request.FILES`中
- form表单是没有办法发送`json`格式数据的

ajax

- 默认的数据编码格式也是`urlencoded`
- django后端针对符合`urlencoded`编码格式的数据都会自动帮你解析封装到`request.POST`中（包括文件）

## ajax发送json格式数据

前后端传输数据的时候一定要确保编码格式跟数据真正的格式是一致的 

django针对`json`格式的数据 不会做任何的处理

1. 一定要处理成json格式 
2. 其次要指定编码格式

```javascript
<script>
$.ajax({
    url:'', // 默认就是朝当前地址提交
    type:'post', // 默认就是get请求
    data:JSON.stringify{'username':'jqm'},  // 处理成json格式
    contentType:'application/json',  //  指定编码格式
    success:function(args){
        console.log(args)
    } 
})
</script>
```

然后在后端要自己手动去解析     解码+序列化

- 第一种方法

  ```python
  json_bytes = request.body
  json_str = json_bytes.decode('utf-8')
  json_dict = json.loads(json_str)
  ```

- 第二种 json.loads括号内如果传入了一个二进制格式的数据那么内部会自动解码再反序列化

     ```python
  json_dict = json.loads(json_bytes)  # {'username':'jqm'} <class 'dict'>
  ```

  