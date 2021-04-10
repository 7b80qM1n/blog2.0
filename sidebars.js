/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  resources: {
    // 简介: ["路径/id"],
    网络基础:[
              "resources/Networking Essentials/TCP/NetworkingEssentials-01",
              "resources/Networking Essentials/如何选择TCP还是UDP？/NetworkingEssentials-02",
              "resources/Networking Essentials/BGP/NetworkingEssentials-03",
              "resources/Networking Essentials/SDWAN/NetworkingEssentials-04",
              "resources/Networking Essentials/ping的过程/NetworkingEssentials-05",
    ],

    网络编程:[
      // "resources/socket/网络架构及其演变过程/socket01",
              // "resources/socket/OSI七层协议/socket02",
              // "resources/socket/TCP协议的三次握手和四次挥手/socket03",
              // "resources/socket/基于TCP协议的socket套接字编程/socket04",
              // "resources/socket/Socket抽象层/socket05",
              "resources/socket/模拟ssh远程执行命令/socket06",
              "resources/socket/粘包问题/socket07",
              "resources/socket/解决粘包问题/socket08",
              "resources/socket/基于UDP协议的socket套接字编程/socket09",
              "resources/socket/基于socketserver实现并发的socket套接字编程/socket10",
    ],

    并发编程:["resources/Concurrent programming/进程/Concurrent01",
              "resources/Concurrent programming/线程/Concurrent02",
              "resources/Concurrent programming/协程/Concurrent03",
      
    ],
  },
  note:{
    杂七杂八:["note/Assorted/pycharm/pythonBackend-Assorted-1",
              "note/Assorted/优化/pythonBackend-Assorted-2",
              "note/Assorted/面试题整理/pythonBackend-Assorted-3",
              "note/Assorted/py与pyc文件区别/modules06",
              "note/Assorted/虚拟环境搭建/Assorted-virtualenv1",
              "note/Assorted/配置pip安装源/Assorted-pip1",
              "note/Assorted/git整理/Assorted-git整理",
    ],
    py基础:["note/pythonBasics/代码块缓存机制/pythonBasics-01",
              "note/pythonBasics/str常用操作/pythonBasics-str1",
              "note/pythonBasics/列表常用操作/pythonBasics-list1",
              "note/pythonBasics/字典常用操作/pythonBasics-dict1",
              "note/pythonBasics/函数/pythonBasics-function1",
              "note/pythonBasics/迭代器和生成器/pythonBasics-Iterableobject1",
              "note/pythonBasics/名称空间/pythonBasics-Namespacing1",
              "note/pythonBasics/闭包+装饰器/pythonBasics-decorator1",
              

    ],
    常用模块:["note/Commonly used modules/open文件操作/modules01",
              "note/Commonly used modules/json模块/modules02",
              "note/Commonly used modules/sys模块/modules03",
              "note/Commonly used modules/异常处理/modules04",
              "note/Commonly used modules/os文件目录/modules05",
              
    ],
    前端:["note/frontEnd/http/http01",
          "note/frontEnd/HTML/HTML01",
          "note/frontEnd/CSS/css01",
          "note/frontEnd/JavaScript/javaScript01",
          "note/frontEnd/jQuery/frontEnd-jQuery1",
          "note/frontEnd/Ajax/frontEnd-Ajax1",
          "note/frontEnd/Vue/frontEnd-Vue1",

    ],
    django:["note/pythonBackend/python三大框架/pythonBackend-1",
            "note/pythonBackend/django初识/pythonBackend-django01",
            "note/pythonBackend/django生命周期/pythonBackend-django02",
            "note/pythonBackend/DjangoRestFramework/pythonBackend-django03",
            "note/pythonBackend/DRF目录重构/pythonBackend-django04",
            "note/pythonBackend/Celery异步任务框架/pythonBackend-django05",
    ],
    Liunx:["note/linux/初识/linux-introduce1",
            "note/linux/基本指令/linux-basic1",
            "note/linux/redis/linux-redis1",
            "note/linux/nginx/linux-nginx1",
            "note/linux/docker/linux-docker1",
            "note/linux/部署环境准备/linux-deploy1",
    ],
    爬虫:["note/webCrawlers/基本操作/Webcrawlers-basics1",

    ],
  },
};
