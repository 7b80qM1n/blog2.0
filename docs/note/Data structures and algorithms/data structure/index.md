---

id: Data structures and algorithms-data structure

title: 数据结构
---



## 栈

特性:先进后出

栈顶，栈底

![image-20210502134921426](https://gitee.com/JqM1n/biog-image/raw/master/20210502134922.png)

应用场景:

每个web浏览器都有一个返回按钮。当你浏览网页时，这些网页被防止在一个栈中(实际是网页的网址)。你现在查看的网页在顶部，你第一个查看的网页在底部。如果按'返回'按钮，将按相反的顺序浏览刚才的页面。

- Stack()创建一个空的新栈。它不需要参数，并返回一个空栈。
- push(item)将一个新项添加到栈的顶部。它需要item 做参数并不返回任何内容。
- pop()从栈中删除]顶部项。它不需要参数并返回item。栈被修改。
- peek()从栈返回]顶部项，但不会删除它。不需要参数。不修改栈。
- isEmpty()测试栈是否为空。不需要参数，并返回布尔值。
- size()返回栈中的item 数量。不需要参数，并返回一个整数。

模拟:

```python
class Stack():
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)
        return item

    def pop(self):
        return self.items.pop()

    def peek(self):
        return len(self.items) - 1

    def isEmpty(self):
        return self.items == []

    def size(self):
        return len(self.items)


stack = Stack()
print('添加元素', stack.push(1))
print('添加元素', stack.push(2))
print('栈顶元素下标:', stack.peek())
print('栈是否为空:', stack.isEmpty())
print('元素个数:', stack.size())
print('删除元素', stack.pop())
print('删除元素', stack.pop())

```

## 队列

特性:先进先出，只允许在一端进行插入操作，而在另一端进行删除操作的线性表

![image-20210502140035128](https://gitee.com/JqM1n/biog-image/raw/master/20210502140036.png)

应用场景:

队列在设计程序中用的非常频繁。比如用键盘进行各种字母或数字的输入，到显示器如记事本软件上的输出，其实就是对列的典型应用，假如你本来和女友聊天，想表达你是我的上帝，输入的是god，而屏幕上却显示出了dog发了出去，这真是要气死人了

- Queue()创建一个空的新队列。它不需要参数,并返回一个空队列。
- enqueue(item)将新项添加到队尾。它需要item 作为参数，并不返回任何内容。
- dequeue()从队首移除项。它不需要参数并返回item。队列被修改。
- isEmpty()查看队列是否为空。它不需要参数,并返回布尔值。
- size()返回队列中的项数。它不需要参数，并返回一个整数。

模拟:

```python
class Queue():
    def __init__(self):
        self.items = []

    def enqueue(self, item):
        self.items.insert(0, item)
        return item

    def dequeue(self):
        return self.items.pop()

    def isEmpty(self):
        return self.items == []

    def size(self):
        return len(self.items)


q = Queue()
print('添加一个元素', q.enqueue(1))
print('添加一个元素', q.enqueue(2))
print('添加一个元素', q.enqueue(3))
print('取一个元素', q.dequeue())
print('取一个元素', q.dequeue())
print('取一个元素', q.dequeue())

```



案例:烫手的山芋

烫手山芋游戏介绍:6个孩子围成一个圈，排列顺序孩子们自己指定。第一个孩子手里有一个烫手的山芋，需要在计时器计时1秒后将山芋传递给下一个孩子，依次类推。规则是，在计时器每计时7秒时，手里有山芋的孩子退出游戏。该游戏直到剩下一个孩子时结束，最后剩下的孩子获胜。请使用队列实现该游戏策略，排在第几个位置最终会获胜。

准则:手里有山芋的孩子永远排在队列的头部

![image-20210501180034924](https://gitee.com/JqM1n/biog-image/raw/master/20210501180042.png)

```python
kids = ['A', 'B', 'C', 'D', 'E', 'F']
queue = Queue()
for kid in kids:
    queue.enqueue(kid)
while queue.size() > 1:
    for i in range(6):
        kid = queue.dequeue()
        queue.enqueue(kid)
    queue.dequeue()
print('最后获胜者:', queue.dequeue())  # 最后获胜者: E
```



## 双端队列

同队列相比，有两个头部和尾部。可以在双端进行数据的插入和删除，提供了单数据结构中栈和队列的特性

- Deque()创建一个空的新deque。它不需要参数，并返回空的deque。
- addFront(item)将一个新项添加到deque 的首部。它需要item参数并不返回任何内容。
- addRear(item)将一个新项添加到deque 的尾部。它需要item参数并不返回任何内容。
- removeFront() 从 deque 中删除首项。它不需要参数并返回item。deque被修改。
- removeRear()从 deque 中删除尾项。它不需要参数并返回item。deque 被修改。
- isEmpty()测试 deque是否为空。它不需要参数，并返回布尔值。
- size()返回deque中的项数。它不需要参数，并返回一个整数。

```python
class Deque():
    def __init__(self):
        self.items = []

    def addFront(self, item):
        self.items.insert(0, item)

    def addRear(self, item):
        self.items.append(item)

    def removeFront(self):
        return self.items.pop()

    def removeRear(self):
        return self.items.pop(0)


d = Deque()

```

## 顺序表

 

