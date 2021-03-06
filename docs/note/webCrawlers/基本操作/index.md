---

id: Webcrawlers-basics1

title: 基本操作
---

## cookie的处理

- 手动处理

  cookie从抓包工具中捕获封装到headers中

- 自动处理

  session对象（发两次，第二次如果有cookie自动存）

  ```python
  import requests
  headers = {
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'
  }
  # 基于session自动处理cookie
  sess = requests.Session()
  
  # 该次请求只是为了捕获cookie存储到sess中
  sess.get(url='https://xueqiu.com/',headers=headers)
  url = 'https://xueqiu.com/v4/statuses/public_timeline_by_category.json?since_id=-1&max_id=20367942&count=15&category=-1'
  json_data = sess.get(url=url,headers=headers).json()
  print(json_data)
  ```


## 代理

- 代理服务器
- 进行请求转发
- 代理ip+post 作用到get、post方法的proxies=｛'http'：'ip:port'｝中
- 代理池（列表）

1. 构建一个代理池

   ```python
   url = '代理IP提取网址'
   page_text = requests.get(url=url,headers=headers).text
   tree = etree.HTML(page_text)
   ip_list = tree.xpath('//body//text()')
   for ip in ip_list:
       dic = {'https':ip}
       ips_list.append(dic)
   ```

2. 使用代理池操作

   ```python
   import random
   url = 'https://www.xicidaili.com/nn/%d'
   all_data = []
   for page in range(1,30):
       new_url = format(url%page)
       # proxies={'http':'ip:port'}
       page_text = requests.get(url=new_url,headers=headers,proxies=random.choice(ips_list)).text
       tree = etree.HTML(page_text)
       # 在xpath表达式中不可以出现tbody标签，否则会出问题
       tr_list = tree.xpath('//*[@id="ip_list"]//tr')[1:]
       for tr in tr_list:
           ip_addr = tr.xpath('./td[2]/text()')[0]
           all_data.append(ip_addr)
   print(len(all_data))
   ```


## 验证码的识别

超级鹰

```python
import requests
from hashlib import md5

class Chaojiying_Client(object):

    def __init__(self, username, password, soft_id):
        self.username = username
        password = password.encode('utf8')
        self.password = md5(password).hexdigest()
        self.soft_id = soft_id
        self.base_params = {
            'user': self.username,
            'pass2': self.password,
            'softid': self.soft_id,
        }
        self.headers = {
            'Connection': 'Keep-Alive',
            'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)',
        }

    def PostPic(self, im, codetype):
        """
        im: 图片字节
        codetype: 题目类型 参考 http://www.chaojiying.com/price.html
        """
        params = {
            'codetype': codetype,
        }
        params.update(self.base_params)
        files = {'userfile': ('ccc.jpg', im)}
        r = requests.post('http://upload.chaojiying.net/Upload/Processing.php', data=params, files=files,
                          headers=self.headers)
        return r.json()

    def ReportError(self, im_id):
        """
        im_id:报错题目的图片ID
        """
        params = {
            'id': im_id,
        }
        params.update(self.base_params)
        r = requests.post('http://upload.chaojiying.net/Upload/ReportError.php', data=params, headers=self.headers)
        return r.json()


if __name__ == '__main__':
    def get_text(imgPath, imgType):
        chaojiying = Chaojiying_Client('jianqingmin', 'jqmkfc039988', '910948')
        im = open(imgPath, 'rb').read()
        return chaojiying.PostPic(im, imgType)['pic_str']

```

## 模拟登陆

- 验证码的识别
- 动态请求参数
- cookie

## 单线程 + 多任务异步协程

- 协程

  如果一个函数的定义被asyic修饰后，则该函数调用后会返回一个协程对象

- 任务对象

  就是对协程对象的进一步封装，有回调

- 绑定回调

  task.add_done_callback(func):带参数func(tack):返回值task.result()  

- 事件循环对象

  时间循环对象是用来装载任务对象的。该对象被启动后，则会异步的处理调用其内部装载的每一个任务对象（将任务对象手动进行挂起操作）

- aynic，await

注意事项：在特殊函数内部不可以出现不支持异步模块的代码，否则会中断整个异步的效果

## aiohttp支持异步请求的模块
```python
import aiohttp
import asyncio
from lxml import etree

urls = [
    'http:127.0.0.1:500/test1',
    'http:127.0.0.1:500/test2',
    'http:127.0.0.1:500/test3',
]

# 特殊的函数：请求发送和响应数据的捕获
# 细节：在每一个堵塞操作的前面加上async,在每一个阻塞操作的前边加上await
async def get_request(url):
    with aiohttp.ClientSession() as s:
        # s.get(url, header=header, proxy='http://ip:post', params)
        with await s.get(url) as response:
            page_text = await response.text()  # read() 返回的是byte类型的数据
            return page_text

# 回调函数(数据解析+持久性存储写在这里)
def parse(task):
    page_text = task.result()
    tree = etree.HTML(page_text)
    parse_data = tree.xpath('//li/text()')
    print(parse_data)

tasks = []
for url in urls:
    c = get_request(url)
    task = asyncio.ensure_future(c)
    task.add_done_callback(parse)
    tasks.append(task)

loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))
```

## selenium模块在爬虫中的使用

概念：是一个基于浏览器自动化的模块。

爬虫之间的关联：（之前用requests需要先判断网站是否是动态加载的，所见非即可得）

便捷的捕获到动态加载到的数据。（所见即可得） 

### 实现模拟登陆

环境安装：

```python
pip install selenium
```

准备好某一款浏览器的驱动程序 

```python
驱动下载地址：http://chromedriver.storage.googleapis.com/index.html
版本映射表：https://blog.csdn.net/huilan_same/article/details/51896672
```

基本使用

```python
from selenium import webdriver
bro = webdriver.Chrome(executable_path='chromedriver.exe')
bro.get('https://www.jd.com/')
# 进行标签定位
search_input = bro.find_element_by_id('key')
search_input.send_keys('小米笔记本')

btn = bro.find_element_by_xpath('//*[@id="search"]/div/div[2]/button')
btn.click()

# 执行js
bro.execute_script('window.scrollTo(0,document.body.scrollHeight)')

# 拿到当前页面文本
page_text = bro.page_source
print(page_text)

bro.quit()
```

爬取动态加载的数据

```python
from selenium import webdriver
from lxml import etree
bro = webdriver.Chrome(executable_path='chromedriver.exe')
bro.get('http://scxk.nmpa.gov.cn:81/xk/')

# 拿到当前页面文本
page_text = bro.page_source
page_text_list = [page_text]

for i in range(3):
    bro.find_element_by_id('pageIto_next').click()
    page_text_list.append(bro.page_source)

for page_text in page_text_list:
    tree = etree.HTML(page_text)
    li_list = tree.xpath('//ul[@id="gzlist"]/li')
    for li in li_list:
        title = li.xpath('./dl/@title')[0]
        num = li.xpath('./ol/@title')[0]
        print(title + ':' + num)

bro.quit()
```

动作链

- 一系列连续的动作

  在实现标签定位时，如果发现定位的标签是存在于iframe标签之中的，则在定位时必须执行一个固定的操作：bro.switch_to.frame('id')

  12306模拟登录

  ```python
  from selenium import webdriver
  from selenium.webdriver import ActionChains
  from PIL import Image
  from CJY import Chaojiying_Client
  from time import sleep
  
  bro = webdriver.Chrome(executable_path='chromedriver.exe')
  bro.get('https://kyfw.12306.cn/otn/login/init')
  # 整体截图
  bro.save_screenshot('main.png')
  # 定位到验证码
  code_img_tag = bro.find_element_by_xpath('//*[@id="loginForm"]/div/ul[2]/li[4]/div/div/div[3]/img')
  # 左下角坐标x,y {'x': 256, 'y': 274}
  location = code_img_tag.location
  # 高度宽度 {'height': 190, 'width': 293}
  size = code_img_tag.size
  # 裁剪的区域范围 (256, 274, 549, 464)
  rangle = (
      int(location['x']), int(location['y']), int(location['x'] + size['width']), int(location['y'] + size['height']))
  
  # 读取整张页面的图片
  i = Image.open('main.png')
  # 裁剪
  frame = i.crop(rangle)
  # 保存验证码图片
  sleep(1)
  frame.save('code.png')
  
  
  # 使用超级鹰识别
  def get_text(imgPath, imgType):
      chaojiying = Chaojiying_Client('jianqingmin', 'jqmkfc039988', '910948')
      im = open(imgPath, 'rb').read()
      return chaojiying.PostPic(im, imgType)['pic_str']
  
  result = get_text('code.png', 9004)
  
  # 格式化成[[],[]]
  all_list = []
  if '|' in result:
      list_1 = result.split('|')
      count_1 = len(list_1)
      for i in range(count_1):
          xy_list = []
          x = int(list_1[i].split(',')[0])
          y = int(list_1[i].split(',')[1])
          xy_list.append(x)
          xy_list.append(y)
          all_list.append(xy_list)
  else:
      x = int(result.split(',')[0])
      y = int(result.split(',')[1])
      xy_list = []
      xy_list.append(x)
      xy_list.append(y)
      all_list.append(xy_list)
  
  # 动作链 点击验证码
  acition = ActionChains(bro)
  for a in all_list:
      x = a[0]
      y = a[1]
      acition.move_to_element_with_offset(code_img_tag, x, y).click().perform()
      sleep(1)
  acition.release()
  ```

  无头浏览器的操作，无可视化界面的浏览器

  ```python
  from selenium import webdriver
  from selenium.webdriver.chrome.options import Options
  
  chrome_options = Options()
  chrome_options.add_argument('--headless')
  chrome_options.add_argument('--disable-gou')
  
  driver = webdriver.Chrome('chromedriver.exe', chrome_options=chrome_options)
  driver.get('https://kyfw.12306.cn/otn/login/init')
  ```

  如何规避selenium被检测 【已失效】

  ```python
  from selenium import webdriver
  from selenium.webdriver import ChromeOptions
  
  options = ChromeOptions()
  options.add_experimental_option('excludeSwitches', ['enable-automation'])
  
  driver = webdriver.Chrome('chromedriver.exe', options=options)
  driver.get('https://www.taobao.com/')
  ```

  

