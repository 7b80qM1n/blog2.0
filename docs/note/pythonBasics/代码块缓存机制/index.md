---

id: pythonBasics-01

title: 代码块缓存机制
---

## 同一个代码块

前提条件：在同一个代码块内。

机制内容：Python在执行同一个代码块的初始化对象的命令时，会检查是否其值是否已经存在，如果存在，会将其重用。换句话说：执行同一个代码块时，遇到初始化对象的命令时，他会将初始化的这个变量与值存储在一个字典中，在遇到新的变量时，会先在字典中查询记录，如果有同样的记录那么它会重复使用这个字典中的之前的这个值。所以在你给出的例子中，文件执行时（同一个代码块）会把i1、i2两个变量指向同一个对象，满足缓存机制则他们在内存中只存在一个，即：id相同。

适用对象： int（float），str，bool。

对象的具体细则：（了解）所有的数字，bool，几乎所有的字符串。

## 在不同一个代码块内（小数据池）

前提条件：在同一个代码块内。

机制内容：Python自动将-5~256的整数进行了缓存，当你将这些整数赋值给变量时，并不会重新创建对象，而是使用已经创建好的缓存对象。python会将一定规则的字符串在字符串驻留池中，创建一份，当你将这些字符串赋值给变量时，并不会重新创建对象， 而是使用在字符串驻留池中创建好的对象。

　　其实，无论是缓存还是字符串驻留池，都是python做的一个优化，就是将~5-256的整数，和一定规则的字符串，放在一个‘池’（容器，或者字典）中，无论程序中那些变量指向这些范围内的整数或者字符串，那么他直接在这个‘池’中引用，言外之意，就是内存中之创建一个。

适用对象： int（float），str，bool。

对象的具体细则：（了解）-5~256数字，bool，满足规定的字符串。

## 总结

同一个代码块下适用一个缓存机制（字符串驻留机制）

不同的代码块下适用另一个缓存机制（小数据池）小数据池：数字的范围是-5~256

缓存机制的特点：提升性能，节省内存