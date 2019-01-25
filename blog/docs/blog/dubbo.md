---
title: Dubbo官方文档总结
date: '2019-01-18 10:10:10'
tag: ['Dubbo', '源码']
meta:
  -
    name: description
    content: null
  -
    name: keywords
    content: null
---
<!-- more -->
## Dubbo的运行机制
Dubbo是基于java的SPI机制扩展后运行的，新增了容错、懒加载、IOC和AOP等功能，提高可扩展性。  
关于java的SPI机制：是将指定接口，通过java的类加载机制去加载指定文件中的实现类，来实现第三方的扩展（比如jdbc）。
对于类加载机制，可以参考这篇文章[真正理解线程上下文类加载器](https://blog.csdn.net/yangcheng33/article/details/52631940)

### 初始化
如果使用spring的话，服务提供端通过注册spring的上下文刷新事件启动ServiceBean的export方法，进行的配置的初始化，服务接口代理类的生成。
初始化主要是:检查配置是否正确-->添加默认配置-->解析完配置生成URL对象-->初始化Invoker(创建Wrapper包装类并实例化返回)-->根据协议类型生成Exporter导出对象-->启动RPC通信框架(默认netty)-->
如果导出远程服务(如zookeeper)初始化注册中心-->根据注册信息注册服务者信息并监听-->等待消费者调用代理类的方法  

如果是消费者端的话，通过ReferenceBean重写了FactoryBean的getObject方法，进行的配置的初始化，引用接口代理类的生成。  
初始化主要是:检查配置是否正确-->添加默认配置-->获取注册Registry服务类型(如zookeeper)-->构建URL-->根据协议类型(默认dubbo)初始化Invoker-->
如果是远程服务需要启动RPC通信框架(默认netty)-->根据注册信息注册消费者信息并监听-->根据Invoker生成服务接口的代理类-->消费者调用代理类的方法  

以上是主链，还有监控、其他过滤器上授权等附件功能都是通过Wrapper（基于 ProtocolFilterWrapper、ProtocolListenerWrapper）类封装后 Filter 拦截实现
备注：Invoker与Exporter底层通过RPC相互通信
<img src="http://dubbo.apache.org/docs/zh-cn/dev/sources/images/dubbo_rpc_invoke.jpg" alt="Dubbo"/>  
### 框架设计
<img src="http://dubbo.apache.org/docs/zh-cn/dev/sources/images/dubbo-framework.jpg" alt="Dubbo"/>  
在 RPC 中，Protocol 是核心层，也就是只要有 Protocol + Invoker + Exporter 就可以完成非透明的 RPC 调用，然后在 Invoker 的主过程上 Filter 拦截点。  

### 调用链
<img src="http://dubbo.apache.org/docs/zh-cn/dev/sources/images/dubbo-extension.jpg" alt="Dubbo"/>  

### RPC调用过程分析（未完成）

参考文章：  
[Dubbo官方文档](http://dubbo.apache.org/zh-cn/docs/user/quick-start.html)  
[很详细的JUC源码解析](https://javadoop.com/)  



