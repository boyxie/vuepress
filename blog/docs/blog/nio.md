---
title: java的NIO的一点总结
date: '2018-12-18 12:12:12'
tag: ['java', 'nio']
meta:
  -
    name: description
    content: null
  -
    name: keywords
    content: null
---
## 总结一点看完其他文章后的自己理解!
<!-- more -->

### 基础知识
1、Buffer 指的内存中的一块连续地址，用于存取数据，java里面对每个基本类型都有一个实现，常用的就是ByteBuffer
Buffer 的三个重要参数capacity（容量）、position（读写位置，通过flip转换）、limit（写模式的最大可写值，读模式的最大可读值）
使用示列：
```java
    int num = channel.read(buf); //读取通道内的数据到buf中
    int num = channel.write(buf); //读buf数据到通道内发送出去
    new String(buffer.array()).trim(); //读取内存中的数据到string对象中
```

2、Channel 通道，用于传输数据，类似于IO的流，具体方法实现跟平台相关
FileChannel：文件通道，用于文件读写；DatagramChannel：UDP连接的读写
SocketChannel：TCP连接的客户端读写，或者只是单纯的TCP通道；ServerSocketChannel：TCP连接的服务端读写

SocketChannel.open():打开一个通道，具体实现跟平台有关；
SocketChannel.connect(address):根据地址参数发起连接；
ServerSocketChannel.open():打开一个通道，具体实现跟平台有关；
ServerSocketChannel.bind(address):监听地址里的端口；
SocketChannel = ServerSocketChannel.accept():监听端口里的连接，如果有连接，返回一个SocketChannel
ServerSocketChannel不处理数据，不负责读写，一旦接受到请求，实例化一个SocketChannel后继续监听连接事件

3、Selector 非阻塞方法，多路复用的实现，用户一个线程管理多个Channel
Selector.open()：打开一个Selector选择器
channel.configureBlocking(false)；将channel设置为非阻塞模式，因为selector只有非阻塞下才能发挥作用
SelectionKey key = channel.register(selector,SelectionKey.OP_READ)；将channel注册到selector上，key包含了channel和selector信息
selector.select():将上一次select之后准备好的channel对应的SelectionKey复制到set中，如果没有就阻塞

###阻塞和非阻塞
```java
//服务端
    public static void main(String[] args) throws IOException {
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.socket().bind(new InetSocketAddress(8080));
        while (true) {
            //连接后不一定直接能读
            SocketChannel channel = serverSocketChannel.accept();
            ByteBuffer buffer = ByteBuffer.allocate(100);
            int num;
            // 每个连接新起一个线程或者放入线程池
            if((num = channel.read(buffer)) > 0) {
                buffer.flip();
                System.out.println(num);
                //取出字节放入新的数组，如果直接调用buffer.array()方法会解析分配的全部字节
                byte[] bytes = new byte[num];
                buffer.get(bytes);
                String msg = new String(bytes, "UTF-8");
                System.out.println(msg);
                channel.write(ByteBuffer.wrap(("server send to " + msg).getBytes()));
                buffer.clear();
            }
        }

    }
```
```java
//客户端
    public static void main(String[] args) throws IOException {
        SocketChannel channel = SocketChannel.open(new InetSocketAddress(8080));
        channel.write(ByteBuffer.wrap("hello my name is ok".getBytes()));
        ByteBuffer buffer = ByteBuffer.allocate(10);
        int num;
        //读写的时候会涉及解包，拆包，粘包等处理
        while ((num = channel.read(buffer)) > 0) {
            buffer.flip();
            System.out.println(num);
            String msg = new String(buffer.array(), "UTF-8");
            System.out.println(msg);
            buffer.clear();
        }
    }
```

非阻塞的时候就要用到selector，selector的底层实现历史：
select(1024数量限制)，poll（无限制），问题是需要自己轮询查询具体的通道，时间复杂度O(m)
epoll 返回已经准备好的通道，相对于全部通道，这个数量一般不会太多？
epoll 监听的所有socket连接在一个epoll对象关联的红黑树中，当有新的连接来时，
会把他加入树中并指向该连接的事件列表，如果该连接有事件便调用该epoll的callback方法，通知epoll

还有FreeBSD的kqueue和Solaris的dev/poll都是类似，Windows的IOCP的真正的异步


