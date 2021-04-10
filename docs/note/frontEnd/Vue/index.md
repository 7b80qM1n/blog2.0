---

id: frontEnd-Vue1

title: Vue
---

## vue简介

- 简化Dom操作
- 响应式数据驱动
- javaScript框架

## 起步

- 导入开发版本的Vue.js

  ```html
  <!-- 开发环境版本，包含了有帮助的命令行警告 -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  ```

- 创建Vue实例对象，设置el属性和data属性

  ````html
      <script>
          var app = new Vue({
              el: '#app',
              data: {
                  message: 'Hello Vue!'
              }
          })
      </script>
  ````

- 使用简洁的模板语法把数据渲染到页面上

  ```html
  <div id="app">
    {{ message }}
  </div>
  ```

## el：挂载点

- vue实例的作用范围是什么呢?
  Vue会管理el选项命中的元素及其内部的后代元素

- 是否可以使用其他的选择器?
  可以使用其他的选择器,但是建议使用ID选择器

- 是否可以设置其他的dom元素呢?
  可以使用其他的双标签,不能使用HTML和BODY

## data:数据对象

- Vue中用到的数据定义在data中
- data中可以写复杂类型的数据
- 渲染复杂类型数据时,遵守js的语法即可


```html
<body>
    <div id='app'>
        {{ message }}<br>{{ array.name}}<br>{{ list[0] }}
    </div>
    <script>
        var app = new Vue({
            el: '#app',
            data: {
                message: 'Hello Vue!',
                array:{name:'jqm'},
                list:['jqm']
            }
        })
    </script>
</body>
```

## 本地应用

### v-text

- v-text指令的作用是:设置标签的内容(textContent)

- 默认写法会替换全部内容,使用差值表达式{{}}可以替换指定内容

- 内部支持写表达式

### v-html

- v-html指令的作用是:设置元素的innerHTML

- 内容中有html结构会被解析为标签

- v-text指令无论内容是什么,只会解析为文本

### v-on基础

- v-on指令的作用是:为元素绑定事件

- 事件名不需要写on

- 指令可以简写为@

- 绑定的方法定义在methods属性中

- 方法内部通过**this**关键字可以访问定义在data中数据

  案例：计数器

  ```html
  <body>
      <div id='app'>
          <!-- 计数器功能区域-->
          <button @click='sub'>-</button>
          <span>{{ num }}</span>
          <button @click='add'>+</button>
      </div>
      <script>
          var app = new Vue({
              el: '#app',
              data: {
                  num: 1
              },
              methods: {
                  add: function () {
                      if (this.num < 10) {
                          this.num++;
                      }
                  },
                  sub: function () {
                      if (this.num > 1) {
                          this.num--;
                      }
                  }
              }
          })
      </script>
  </body>
  ```

### v-show指令

- v-show指令的作用是:根据真假切换元素的显示状态
- 原理是修改元素的display,实现显示隐藏
- 指令后面的内容,最终都会解析为布尔值
- 值为true元素显示,值为false元素隐藏

### v-if指令

- v-if指令的作用是:根据表达式的真假切换元素的显示状态
- 本质是通过操纵dom元素来切换显示状态
- 表达式的值为true,元素存在于dom树中,为false,从dom树中移除

### v-bind指令

- v-bind指令的作用是:为元素绑定属性
- 完整写法是v-bind:属性名
- 简写的话可以直接省略v-bind,只保留:属性名
- 需要动态的增删class建议使用对象的方式

```html
<style>
    .aaaaaA{
        border: 1px solid red;
    }
</style>
<body>
    <div id='app'>
<!--<img v-bind:src="imgSrc" alt="" v-bind:title='imgTitle+"可以直接加字符串或者其他"' v-bind:class='bbbbbB?"aaaaaA":""' @click='cccccC'>-->
        <img :src="imgSrc" alt="" :title='imgTitle+"可以直接加字符串或者其他"' :class='{aaaaaA:bbbbbB}' @click='cccccC'>
    </div>
    <script>
        var app = new Vue({
            el: '#app',
            data: {
                imgSrc:'https://www.itheima.com/images/logo.png',
                imgTitle:'图片标题',
                bbbbbB:false
            },
            methods: {
                cccccC:function(){
                    this.bbbbbB = !this.bbbbbB;
                }
            }
        })
    </script>
</body>
```

### v-for指令

- v-for指令的作用是:根据数据生成列表结构
- 数组经常和v-for结合使用
- 语法是( item,index ) in 数据
- item和index可以结合其他指令一起使用
- 数组长度的更新会同步到页面上,是响应式的

```html
<body>
    <div id='app'>
        <input type="button" value="bbbB里面加nb" @click='add'>
        <input type="button" value="删除bbbB数据" @click='sub'>
       <h2 v-for="(item,index) in aaaA">
           {{ index+1 }},ooooo×{{ item }}
       </h2>
       <h2 v-for="i in bbbB">
            ooooo×{{ i.name }}
       </h2>
    </div>
    <script>
        var app = new Vue({
            el: '#app',
            data: {
                aaaA:['100','200'],
                bbbB:[
                    {name:'jqm'},
                    {name:'Whh'}
                ]
            },
            methods:{
                add:function(){
                    this.bbbB.push({name:'nb'})
                },
                sub:function(){
                    this.bbbB.shift();
                }
            }
            })
    </script>
</body>
```

### v-on补充 传递自定义参数 &事件修饰符 

更多修饰符参考：https://cn.vuejs.org/v2/api/#v-on

- 事件绑定的方法写成函数调用的形式，可以传入自定义参数
- 定义方法时需要定义形参来接收传入的实参
- 事件的后面跟上.修饰符可以对事件进行限制
- .enter 可以限制触发的按键为回车
- 事件修饰符可以有多种

```html
<body>
    <div id='app'>
        <input type="button" value="button" @click='aaaA("参数1","参数2")'>  <!--可以携带参数-->
        <input type="text" @keyup.enter='aaaA(1,2)'>  <!--回车触发-->
    </div>
    <script>
        var app = new Vue({
            el: '#app',
            methods:{
                aaaA:function(p1,p2){
                    console.log(p1,p2)
                }
            }
            })
    </script>
</body>
```

### v-model

- v-model指令的作用是便捷的设置和获取表单元素的值

- 绑定的数据会和表单元素值相关联

- 绑定的数据**←→**表单元素的值

  ```html
  <body>
      <div id='app'>
          <input type="text" v-model='message' @keyup.enter="aaaaA">
          <button @click="bbbbB">秒啊</button>
          <h2>{{ message }}</h2>
      </div>
      <script>
          var app = new Vue({
              el: '#app',
              data:{
                  message:'oooooooooooo'
              },
              methods:{
                  aaaaA:function(){
                      alert(this.message)
                  },
                  bbbbB:function(){
                      this.message = '秒啊'
                  }
              }
              })
      </script>
  </body>
  ```

  ![image-20201108225518386](https://gitee.com/JqM1n/biog-image/raw/master/20201108225518.png)



