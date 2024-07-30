<a name="mDCPL"></a>
# 概念
<a name="j7uzP"></a>
## 什么是RPC?
专业的定义：RPC(Remote Procedure Call)即远程调用过程，是一种计算机通讯协议，它允许程序在不同的计算机之间进行通信和交互，就像调用本地方法一样。
<a name="o8H6D"></a>
## 为什么需要RPC?
	回顾概念：RPC允许一个程序（服务消费方）像调用自己程序的方法一样调用远程方法，调用另一个程序（服务提供方）的接口，而且并不需要了解他底层的通讯和数据的传输细节等。这些都会由RPC框架帮你完成，使得开发者可以更轻松的完成调用远程服务。<br />	他可以像调用本地方法一样调用远程方法。当我们有两个系统分别为A和B，如果A系统需要用到B系统中的功能，首先A和B服务都是独立的，所以不能通过引入SDK来解决。这种情况B作为服务的提供方，需要暴露接口。服务的消费方A通过构建HTTP请求来进行访问。如果B服务需要调用更多的服务接口，每个服务方法都写一次HTTP请求，那么就会很麻烦。
<a name="jzjUX"></a>
# RPC框架实现思路
<a name="q3NwS"></a>
## 基本设计
消费者： 调用服务的服务。<br />提供者： 提供接口的服务。<br />web服务器： 提供者接收请求。 <br />请求处理： 根据参数调用不同的服务接口。<br />注册中心： 提供者，将提供的接口注册。消费者从注册中心获取。<br />代理对象： 提供者调用消费者的代理对象。<br />请求客户端： 发送请求。<br />![](https://cdn.nlark.com/yuque/0/2024/jpeg/32636653/1716275435941-ecfe0d4d-74d1-4a9e-89e9-c5056b0674a4.jpeg)<br />这就是一个简易版的RPC框架需要的模块。
<a name="D2mG9"></a>
## 创建模块
common - 用于存储实体类的Service接口<br />production -服务提供者，接口的提供者<br />consumer -服务消费者，调用其他服务。<br />rpcServer-easy -RPC框架简易版。<br />**common**<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1716275878385-f1228ec8-2628-4565-a82e-5e360e7092a3.png#averageHue=%23323c44&clientId=u760c1979-3775-4&from=paste&height=460&id=u02fb037f&originHeight=1012&originWidth=1904&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1351084&status=done&style=none&taskId=u3db631c0-e4e6-4520-b244-6e77bc44d30&title=&width=865.4545266963238)<br />**production**<br />** **![QQ截图20240521151944.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1716276044194-228a1ccb-fe8c-4ee6-afe7-9e6287aea4c0.png#averageHue=%23323d45&clientId=u760c1979-3775-4&from=paste&height=468&id=u8872c4bd&originHeight=1030&originWidth=1921&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1199770&status=done&style=none&taskId=u205b76fc-0b69-4195-9627-5f9a3847c82&title=&width=873.1817992561124)<br />**consumer**<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1716276160753-1bf4052e-6036-4217-a1c7-cb426e51d8ad.png#averageHue=%23303a43&clientId=u760c1979-3775-4&from=paste&height=468&id=ud5c82275&originHeight=1030&originWidth=1921&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1412525&status=done&style=none&taskId=u3717251e-9a24-4c05-b3b6-95764df9c7e&title=&width=873.1817992561124)<br />**rpcServer-easy**<br />model   -请求和响应类<br />proxy    -动态代理 和代理工程类<br />register -本地注册中心<br />serializer -序列化接口及实现<br />server  - web服务及vertx的web服务实现<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1716276205482-c210ece8-235b-4ffc-8288-9ceb2f75faef.png#averageHue=%23313b43&clientId=u760c1979-3775-4&from=paste&height=460&id=u9e1f04c2&originHeight=1012&originWidth=1904&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1389740&status=done&style=none&taskId=uc38afe49-f648-457d-a4a1-ac6a74aa232&title=&width=865.4545266963238)<br />运行梳理流程（可以配合debug更好理解）：<br />提供者开启服务配置handler，注册提供的服务<br />消费者消费，通过proxy工厂获取指定类的代理对象 。<br />代理对象构建参数序列化后通过HTTP请求访问提供者。<br />Vertx启动时配置的handler接收请求。<br />反序列化参数，根据参数通过反射调用方法，序列化后再返回响应结果。<br />代理对象反序列化响应结果，处理后返回。<br />消费者拿到处理后的响应结果。
<a name="iAZye"></a>
# 全局配置加载
在简易版RPC框架中我们的配置是写在代码里的，不便于使用。总不能在引入Rpc前还需要改源码中的配置,这样的话就过于麻烦了。
<a name="xDrhj"></a>
## 需求分析
需求：<br /> 我们需要Rpc框架可以读取引入RPC的模块的配置文件加载全局配置，用于替换硬编码。<br />可以通过读取配置文件的方式来实现。

1. 在使用Rpc服务模块的配置文件中写入依赖
2. RPC服务读取依赖并创建配置对象
3. 通过getConfig可以全局获取配置对象
<a name="A5oUx"></a>
## 开发实现

1. 增加配置文件对象
2. 增加加载配置文件到对象的工具类
3. 增加RpcApplication实现配置文件全局化（双检索单例）

完成之后就可以通过工具类或者RpcApplication中获取rpc相关的配置信息（配置一些动态的信息，如服务的地址，端口等等）
<a name="k6ba8"></a>
# 接口Mock
<a name="SHskm"></a>
## 需求分析
什么是Mock?<br />Rpc框架的核心功能是调用其他远程服务器，但我们在实际开发和测试过程中，有时无法直接访问真实的远程服务或者访问真实的远程服务会产生不可控的影响，比如服务不稳定等。<br />mock是指模拟对象，通常用于测试，便于我们跑通业务流程。<br />为什么支持mock?<br />虽然mock不是Rpc框架的核心能力，但他的开发成本并不高，而且给RPC框架支持mock后，开发者可以更轻松的调用接口，不依赖真实的远程服务。提高使用体验。
<a name="mMsTm"></a>
## 设计方案
模拟接口，只是为了测试是否可以调通，我们只需要根据调用方法的返回类型生成默认的返回值即可。
```java
private Object getDefaultValue(Class<?> returnType) {
        if (returnType.isPrimitive()) {
            if (returnType == int.class) {
                return 0;
            } else if (returnType == long.class) {
                return 0L;
            } else if (returnType == float.class) {
                return 0.0f;
            } else if (returnType == double.class) {
                return 0.0d;
            } else if (returnType == boolean.class) {
                return false;
            }
        }
        return null;
    }
```
<a name="NZMSQ"></a>
## 开发实现

1. 增加配置 isMock来控制是否开启模拟接口
2. 获取server代理时判断isMock, 如开启返回模拟接口代理，代理实现根据方法返回类型返回默认值。
3. 否则就是正常创建server代理。
<a name="qOPCg"></a>
# 序列化器和SPI机制
<a name="wFbBq"></a>
## 需求分析
java对象不能在网络中进行传递，需要借助序列化来完成传输，目前我们使用的时Jdk的系列化器。但对于一个完整的RPC框架还需要以下几点。

1. 有没有更好的序列化器
2. 是否可以让用户指定使用哪个序列化器
3. 是否可以让用户自定义序列化器然后使用
<a name="xjFv1"></a>
## 设计方案
依次分析三个问题的设计方案
<a name="ONV8u"></a>
### 序列化器实现方式
我们之前为了方便使用的时jdk自带的序列化器，但这个解决方案未必是最好的。有的序列化器可能是追求性能，也可能是序列化结果变小都是为了Rpc能更快请求的响应。
<a name="q2lDp"></a>
#### 主流的序列化器
主流的序列化器有JSON,Hessian,Kryo,protobuf等。<br />**优缺点对比**<br />1)JOSN<br />优点：

- 可读性高，便于人类理解和调试
- 跨语言支持广泛

缺点：

- 序列化后数据量较大，因为JSON使用文本格式存储数据结构，需要各位的字符表示键，值和数据结构
- 不能很好的处理复杂的数据结构和循环引用，可能会导致性能下降或序列化失败。

2)Hessian<br />优点：

- 二进制序列化，序列化后的数据量小，网络传输效率高。
- 支持跨语言，适用于分布式系统中的服务调用。

缺点：

- 性能较Json略低，因为需要将对象转为二进制格式。
- 对象必须实现Serializable接口，限制了可序列化的对象范围。

3）Kryo<br />优点:

- 高性能，序列化和反序列化速度块。
- 支持循环引用和自定义序列化器，适用于复杂的对象结构。
- 无需实现Serializable接口，可以·序列化任意对象。

缺点：

- 不跨语言，只适用于java
- 对象的序列化格式不够友好，不易读懂和调试。

4)Protobuf:<br />优点：

- 高效的二进制序列化，序列化数据量小
- 跨语言支持，并提供了多种语言的实现库。
- 支持版本化和兼容性好。

缺点：

- 配置对象复杂，需要定义数据结构格式
- 对象他序列化不易懂，不便于调试。
<a name="xKwUQ"></a>
### 动态使用序列化器

1. 使用Map维护序列化器。
2. 通过配置来动态指定序列化器
<a name="JdkO0"></a>
### 自定义序列化器
当开发者不想使用我们现有的序列化器，该如何做呢？<br />思路：Rpc框架只要能读取到用户自定义序列化器的位置时，就可以加载这个类，作为Serializable接口。<br />如何实现？<br />JAVA中的SPI机制<br />什么是SPI机制（JAVA重要特性）？<br />SPI机制可以通过读取特定的配置文件将自己的实现注册到系统中，然后系统通过反射机制动态的加载实现。而不需要修改原有的框架代码，就可以实现系统的解耦极大的增加了扩展性。<br />如何实现？<br />分为系统实现和自定义实现。<br />系统实现：

1. 在resource中的MATE_INF下新建一个名称能为要实现接口的路径的文件
2. 文件中写入类的**完整路径**
3. 使用系统内置的Serializableload.load（）来实现。

自定义实现：<br />系统实现SPI虽然简单，但如果我们想定制多个不同的接口实习，就没办法在框架中指定使用哪一个。

所以我们需要自定义SPI机制的实现，只要能够根据配置加载到实现类即可。
<a name="PWOBx"></a>
## 开发实现
<a name="vaS8J"></a>
### 1) 多种序列化器的实现
实现了josn,Hessian,Kryo主流的序列化方式，建议参考代码。<br />todo// github地址
<a name="QlDlw"></a>
### 2)动态使用序列化器

1. Rpc框架利用工厂和单例模式来维护key和序列化器的映射关系
2. 在配置文件中新增serializer用于指定要使用序列化器的key
3. 修改代码中的硬编码，通过配置里的key获取序列化器，并使用。
<a name="suAUd"></a>
### 3）自定义序列化器

1. 在resource/MATE_INF/rpc/custom创建配置文件，写入序列话名称 =》 序列换实现的全路径
2. 编写SpiLoader（主要作用就是加载配置文件，和获取实例）
   - 用Map来缓存已经加载的键名 =》 实例
   - 加载配置文件获取到 键名 =》 实例 信息缓存到Map中
   - 定义获取实例的方法，根据用户传入的key和接口从Map中获取类的实现。通过反射创建一个实例并维护到缓存对象中，下次就不必创建实例直接返回。
- 改造SerializerFactory，从SpiLoader的getInstance获取Serializer实现。

使用

1. 在custom文件中写入键值 =》 实例（实现的路径）
2. 在application中给serializer设置未要使用实例的键值。
<a name="SpXXf"></a>
# 基本注册中心实现
<a name="Ay0rm"></a>
## 需求分析
rpc框架的其中一个核心模块就是注册中心，目的是帮助消费者获取提供者的调用地址，从而达到不许要硬编码到项目中。<br />在之前我们使用concurrentHashMap来作为本地缓存。<br />![](https://cdn.nlark.com/yuque/0/2024/jpeg/32636653/1717116005784-e865dee7-88b2-4613-9e77-8e34fffaa1a9.jpeg)
<a name="hXpCY"></a>
## 设计方案
注册·中心核心能力<br />我们先明确注册中心的几个核心能力：

1. 数据分布式存储
2. 服务注册
3. 服务发现
4. 心跳检测
5. 服务注销

通过技术选型确定使用etcd作为默认的存储服务，原因：他是go语言实现的性能更高，他支持事务，并且底层使用了Raft算法，保证了他的数据一致性。<br />定义registerConfig，用户存储注册中心的信息，如注册中心名称，地址，端口等。<br />定义serverMetaInfo，用于存储服务的信息，如服务名，地址，端口，版本等。<br />定义Register接口，和EtcdRegister实现类，实现服务注册，服务发现，服务注销等操作

<a name="OSajZ"></a>
## 自定义协议
<a name="x34IJ"></a>
### 网络传输
为什么需要？<br /> 	用更少的空间来传递需要的信息。目前使用的是http协议，他是应用层协议，他的请求头和信息较多空间占的大，并且请求和响应是都会经过七层封装，都会影响数据传输的速度。所以我们可以考虑使用TCP，他是底层传输层的协议性能是要比应用层的高些，并可以有更多的自主设计空间，
<a name="ll4CF"></a>
### 消息结构
请求头<br />{<br />  	魔数： 安全校验，防止服务器处理非框架发出请求。<br />版本号： 控制版本，保持一致性<br />序列化器： 告诉客户端和服务端如何解析数据<br />状态： 请求成功/失败，响应失败<br />类型： 请求类型，类似get/post<br />id： 来标识唯一id,利于追踪排查问题。<br />}<br />请求体
```java
package com.mi.rpcServer.protocol;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author mi11
 * @version 1.0
 * @project rpcServer-core
 * @description 协议消息
 * @ClassName ProtocolMessage
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public  class ProtocolMessage<T> {

    /**
     * 请求头
     */
    private Header header;

    /**
     * 消息体（请求响应对象）
     */
    private T body;

    @Data
    public static class Header {

        /**
         * id唯一标识
         */
        private long id;

        /**
         * 魔数
         */
        private byte magic;

        /**
         * 协议版本
         */
        private byte version;

        /**
         * 请求状态
         */
        private byte status;

        /**
         * 请求类型
         */
        private byte type;

        /**
         * 序列化器
         */
        private byte serializer;

        /**
         * body长度
         */
        private int bodyLength;

    }
}

```
Vertx提供了Tcp的连接方式。
<a name="fXf6V"></a>
## 编码解码
Vertx的Tcp接收的是Buffer对象，所以我们需要编码/解码，也就是把java对象转为Buffer/把Buffer转为java对象
```java
package com.mi.rpcServer.protocol;

import com.mi.rpcServer.model.RpcRequest;
import com.mi.rpcServer.model.RpcResponse;
import com.mi.rpcServer.serializer.Serializer;
import com.mi.rpcServer.serializer.SerializerFactory;
import io.vertx.core.buffer.Buffer;

import java.io.IOException;

/**
 * @author mi11
 * @version 1.0
 * @project rpcServer-core
 * @description 协议编码
 * @ClassName ProtocolMessageCode
 */
public class ProtocolMessageCode {

    /**
     * 编码
     * @param protocolMessage 对象
     * @param <T>  泛型
     * @return buffer对象
     * @throws IOException 序列化异常
     */
    public static <T> Buffer encode(ProtocolMessage<T> protocolMessage) throws IOException {
        if (protocolMessage == null){
            return Buffer.buffer();
        }
        //拼接
        ProtocolMessage.Header header = protocolMessage.getHeader();
        Buffer buffer = Buffer.buffer();
        buffer.appendLong(header.getId());
        buffer.appendByte(header.getMagic());
        buffer.appendByte(header.getVersion());
        buffer.appendByte(header.getStatus());
        buffer.appendByte(header.getType());
        buffer.appendByte(header.getSerializer());
        byte serializer = header.getSerializer();
        ProtocolSerializerEnum serializerEnum = ProtocolSerializerEnum.getSerializerKey(serializer);
        if (serializerEnum == null ){
            throw new RuntimeException("序列化器不存在!");
        }
        Serializer serializers = SerializerFactory.getSerializer(serializerEnum.getSerializerValue());
        byte[] body = serializers.serialize(protocolMessage.getBody());
        buffer.appendInt(body.length);
        buffer.appendBytes(body);
        return buffer;

    }

    /**
     * 解码
     * @param buffer buffer对象
     * @return 对象
     * @throws IOException 反序列化异常
     */
    public static  ProtocolMessage<?> decode(Buffer buffer) throws IOException {
        ProtocolMessage.Header header = new ProtocolMessage.Header();
        //读取  getLong，long占用8个字节，参数0，从下标为0开始读，读的就算0~7。
        header.setId(buffer.getLong(0));
        byte magic = buffer.getByte(8);
        if (ProtocolConstant.MAGIC != magic){
            throw new RuntimeException("消息 magic 非法！");
        }
        header.setMagic(magic);
        header.setVersion(buffer.getByte(9));
        header.setStatus(buffer.getByte(10));
        header.setType(buffer.getByte(11));
        header.setSerializer(buffer.getByte(12));
        header.setBodyLength(buffer.getInt(13));
        byte[] body = buffer.getBytes(17, 17 + header.getBodyLength());
        ProtocolSerializerEnum serializerEnum = ProtocolSerializerEnum.getSerializerValue(header.getSerializer());
        if (serializerEnum == null){
            throw new RuntimeException("序列化器不存在！");
        }
        Serializer serializer = SerializerFactory.getSerializer(serializerEnum.getSerializerValue());
        if (serializer == null){
            throw new RuntimeException("未找到指定序列化器！");
        }

        ProtocolTypeEnum typeEnum = ProtocolTypeEnum.getTypeValue(header.getType());
       if (typeEnum == null){
           throw new RuntimeException("序列化的消息类型不存在");
       }
        switch (typeEnum){
            case REQUEST:
                RpcRequest request = serializer.deserialize(body, RpcRequest.class);
                return new ProtocolMessage<>(header,request);
            case RESPONSE:
                RpcResponse response = serializer.deserialize(body, RpcResponse.class);
                return new ProtocolMessage<>(header,response);
            case HEART_BEAT:
            case OTHERS:
            default:
                throw new RuntimeException("暂时不支持处理该消息类型");
        }
    }
}

```
请求处理/请求发送<br />![](https://cdn.nlark.com/yuque/0/2024/jpeg/32636653/1721292731082-11fe0099-2d1d-4a9d-ab04-cb97ee7bcbb3.jpeg)
<a name="X335q"></a>
## 粘包/半包
粘包,就是发送方发送的多个数据包被接收方合并为一个数据包，导致接收方无法正确的区分每个数据包的边界。<br />半包，就算发送方发送的数据包较大被分成多个片段传输或网络波动导致接收方接收的数据并不完整。<br />解决： 半包我们可以定义一个长度，如长度不满足的化就先不读等下一次再读。粘包是只读取指定长度的数据，过长的数据我们留到下一次再读。<br />现在我们的header长度可以固定，但是消息体长度是不固定的。那么我们可以分成两次读取，第一次先读取固定的header,第二次根据header中存储的bodyLength读取Body,最后重置一下。就能读取到一次完成的数据了
```java
package com.mi.rpcServer.server.tcp;

import com.mi.rpcServer.protocol.ProtocolConstant;
import io.vertx.core.Handler;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.parsetools.RecordParser;


/**
 * @author mi11
 * @version 1.0
 * @project rpcServer-core
 * @description 对recordParser原有能力增强解决粘包半包问题
 * @ClassName TcpBufferHandlerWrapper
 */
public class TcpBufferHandlerWrapper  implements Handler<Buffer> {

     private final RecordParser recordParser;

    public TcpBufferHandlerWrapper(Handler<Buffer> handlerBuffer) {
        recordParser = initRecordParser(handlerBuffer);
    }

    @Override
    public void handle(Buffer event) {
        recordParser.handle(event);
    }

    public RecordParser initRecordParser(Handler<Buffer> bufferHandler){
        RecordParser recordParser = RecordParser.newFixed(ProtocolConstant.MESSAGE_HEADER_LENGTH);

        recordParser.setOutput(new Handler<Buffer>() {

            int size = -1;

            private Buffer resBuffer = Buffer.buffer();

            @Override
            public void handle(Buffer event) {
                if (size == -1) {
                    //拼接header
                     size = event.getInt(13);
                     recordParser.fixedSizeMode(size);
                     resBuffer.appendBuffer(event);
                }else {
                    //拼接body
                    resBuffer.appendBuffer(event);
                    bufferHandler.handle(resBuffer);
                    //重置
                    recordParser.fixedSizeMode(ProtocolConstant.MESSAGE_HEADER_LENGTH);
                    size = -1;
                    resBuffer = Buffer.buffer();
                }
            }
        });
        return recordParser;
    }
}

```
<a name="avyRr"></a>
## 负载均衡
当我们系统请求过多时，单台机器无法承受压力。就会去部署多个服务提供者来提供服务，缓解压力。那我们又如何保证请求去按照我们的想法去请求不同的服务提供者呢？<br />常见的有nginx(七层协议负载均衡)
<a name="zvEWD"></a>
### 常见的负载均衡算法
负载均衡就是按照我们的想法，将请求转发到不同的服务器上。按照什么策略选择什么资源，所以主要学习的是他的算法。<br />轮询 : 循环选择服务<br />加权轮询： 循环选择服务，并根据权重增加循环几率<br />随机 ： 随机选择服务<br />加权随机 : 随机选择服务,并根据权重增加随机几率<br />一致性hash ：维护一个hash环，将服务作为一个节点放到这个环里，通过计算hash值来取hash环中大于或等于hash环中的值。适用于长连接的情况。<br />轮询
```java
package com.mi.rpcServer.loadbalancer.impl;

import com.mi.rpcServer.loadbalancer.LoadBalancer;
import com.mi.rpcServer.model.ServerMetaInfo;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author mi11
 * @version 1.0
 * @project rpcServer-core
 * @description 轮询
 * @ClassName RoundRobinLoadBalancer
 */
public class RoundRobinLoadBalancer implements LoadBalancer {

    /**
     * 当前轮询下标
     */
    private final AtomicInteger currentIndex = new AtomicInteger(0);

    @Override
    public ServerMetaInfo selectServer(Map<String, Object> requestParams, List<ServerMetaInfo> serverMetaInfos) {
        if (serverMetaInfos.isEmpty()) {
            return  null;
        }
        int size = serverMetaInfos.size();
        if (size == 1){
            return serverMetaInfos.get(0);
        }
        //取模算法轮询
        //getAndIncrement()获取当前值之后，在当前值的基础上加1
        int index = currentIndex.getAndIncrement() % size;
        return serverMetaInfos.get(index);
    }
}

```
随机
```java
package com.mi.rpcServer.loadbalancer.impl;

import com.mi.rpcServer.loadbalancer.LoadBalancer;
import com.mi.rpcServer.model.ServerMetaInfo;

import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * @author mi11
 * @version 1.0
 * @project rpcServer-core
 * @description 随机负载均衡
 * @ClassName RandomLoadBalancer
 */
public class RandomLoadBalancer implements LoadBalancer {

    private  final Random random = new Random();

    @Override
    public ServerMetaInfo selectServer(Map<String, Object> requestParams, List<ServerMetaInfo> serverMetaInfos) {
        if (serverMetaInfos.isEmpty()){
            return null;
        }
        int size = serverMetaInfos.size();
        if (size == 1){
            return serverMetaInfos.get(0);
        }

        return serverMetaInfos.get(random.nextInt(size));
    }
}

```
一致性hash
```java
package com.mi.rpcServer.loadbalancer.impl;

import com.mi.rpcServer.loadbalancer.LoadBalancer;
import com.mi.rpcServer.model.ServerMetaInfo;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * @author mi11
 * @version 1.0
 * @project rpcServer-core
 * @description 一致性hash负载均很器
 * @ClassName ConsistentHashLoadBalancer
 */
public class ConsistentHashLoadBalancer implements LoadBalancer {
    /**
     * 一致性hash环，存放虚拟节点
     */
    private final TreeMap<Integer,ServerMetaInfo> virtualNodes = new TreeMap<>();

    /**
     * 虚拟节点数
     */
    private static final int VIRTUAL_NODE_SIZE = 100;

    @Override
    public ServerMetaInfo selectServer(Map<String, Object> requestParams, List<ServerMetaInfo> serverMetaInfos) {
        if (serverMetaInfos.isEmpty()) {
            return  null;
        }

        for (ServerMetaInfo serverMetaInfo : serverMetaInfos) {
            for (int i = 0; i < VIRTUAL_NODE_SIZE; i++) {
                int hash = getHash(serverMetaInfo.getServiceAddress() + "#" + i);
                virtualNodes.put(hash, serverMetaInfo);
            }
        }
        //获取调用请求的hash值
        int hash = getHash(requestParams);
        //选择最接近且大于等于调用请求的hash值虚拟节点

        Map.Entry<Integer, ServerMetaInfo> entry = virtualNodes.ceilingEntry(hash);
        if (entry == null){
            entry = virtualNodes.firstEntry();
        }

        return entry.getValue();
    }

    /**
     * hash算法
     * @param key key
     * @return hash值
     */
    private int getHash(Object key){
        return key.hashCode();
    }
}

```
利用SPI支持指定和扩展负均衡器。
<a name="TMzE4"></a>
## 异常重试机制
调用远程服务可能会出现网络波动或服务提供者重启的临时问题，导致请求失败。为了系统的可用性，我们希望系统有自己重试的功能。
<a name="TQiNS"></a>
### 重试机制
重试的意思就是，请求失败重新再来。<br />**设计重试机制我们要明确以下几点。**

1. 什么时候，什么条件下重试？
2. 重试时间，（确定下一次重试时间，间隔）
3. 什么时候，什么条件下停止重试
4. 重试后要做什么。
<a name="y72Gr"></a>
#### 重试条件
当我们请求远程服务器异常时。
<a name="zC54I"></a>
#### 重试时间
常见的有<br />1.间隔重试：比如固定间隔三秒重试一次<br />2.指数退避重试：比如第一次重试为1秒，第二次为3秒（增加两秒），第四次为7秒（增减四秒），以此类推<br />3.随机延迟重试：在每次重试前适用随机的时间间隔，避免请求的同时发生<br />4.可变延迟重试：根据前重试的情况来动态调整下一次重试的时间间隔<br />因为没有特殊需求，我们配置了固定间隔重试。
<a name="Okl0G"></a>
#### 停止重试
停止重试的策略常见的有<br />1.最大重试次数： 重试测试达到配置的最大重试次数<br />2.超时停止：请求超过配置的超时时间，停止重试<br />由于我们目前的场景是rpc客户端调用，服务提供者的接口，接口的情况我们是不清楚的，所以我们先择最大重试次数作为停止重试的策略
<a name="Z20JM"></a>
#### 重试工作
重试之后我们要做到事情。<br />如果接口不行可以<br />1.发出告警信息，让开发人员介入<br />2.降级，去调用别的接口，或执行其他操作
<a name="OCgbU"></a>
### 实现
利用retrying_guava包，这个包里面已经封装重试的操作，引入后可以很方便的实现重试
```java
package com.mi.rpcServer.retry.impl;

import cn.hutool.json.JSONUtil;
import com.github.rholder.retry.*;
import com.mi.rpcServer.model.RpcResponse;
import com.mi.rpcServer.retry.RetryStrategy;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

/**
 * @author mi11
 * @version 1.0
 * @project rpcServer-core
 * @description 固定重试策略
 * @ClassName FixedRetryStrategy
 */
@Slf4j
public class FixedRetryStrategy implements RetryStrategy {

    @Override
    public RpcResponse doRetry(Callable<RpcResponse> callable) throws Exception {
    
        RetryerBuilder<RpcResponse> retryerBuilder = RetryerBuilder.<RpcResponse>newBuilder();
        //当抛出Exception异常时，执行重试操作
        Retryer<RpcResponse> build = retryerBuilder.retryIfExceptionOfType(Exception.class)
        //间隔三秒重试
        .withWaitStrategy(WaitStrategies.fixedWait(3000, TimeUnit.MILLISECONDS))
        //最多重试三次
                .withStopStrategy(StopStrategies.stopAfterAttempt(3))
        //重试时打印信息
                .withRetryListener(new RetryListener() {
                    @Override
                    public <V> void onRetry(Attempt<V> attempt) {
                        log.error(JSONUtil.toJsonStr(attempt.getResult()));
                        log.error("第{}次重试", attempt.getAttemptNumber());
                    }
                }).build();
        //执行方法
        return build.call(callable);
    }
}

```
使用时将我们的方法作为参数传递过来callable
<a name="bqnz6"></a>
## 容错机制
容错机制指的是当系统出现故障时，可以通过策略保证系统稳定运行，从而提高系统的可靠性和健壮性。
<a name="OfWrj"></a>
### 容错策略
常用的容错策略有以下几种

1. 故障转移 ：调用异常之后，去切换其他的节点再进行调用
2. 失败自动修复：调用异常之后，请求别的接口，或服务，通过其他方法恢复功能，理解为降级
3. 静默处理：调用接口异常后，正常返回响应对象，不做处理。
4. 快速失败：当接口异常后，直接抛出异常，交给调用方处理。
<a name="QFPFJ"></a>
### 容错实现方式
容错是一个比较广泛的概念<br />如：

1. 重试：重试本质上也是一种容错的降级策略，系统错误后再试一次
2. 降级：系统错误时，调用其他更稳定的操作，作为一个兜底。这种方式本质是牺牲一定量的服务质量，也要帮正系统的部分功能可用，保证基本功能的需求。
3. 限流：系统访问压力大时，可能会出现部分错误。可以使用限流限制请求频率保证系统的可用性
4. 熔断： 系统出现异常和故障时，暂时中断对该服务的请求，执行其他操作，便面连锁异常
5. 超时控制：如果请求长时间没处理完成，就进行终端，防止阻塞和资源占用

在实际项目中根据对系统可靠性的需求，我们通常会结合多种策略和实现方式实现容错机制
<a name="AaaEI"></a>
### 实现

1. 快速失败
2. 静默处理

![](https://cdn.nlark.com/yuque/0/2024/jpeg/32636653/1721878416454-32fd9a95-1ed2-48c4-8a1a-97ba21e05679.jpeg)
<a name="XKLq7"></a>
## 扩展

1. 自定义异常，服务端出现异常返回给客户端进行打印输出
2. 全局自动化配置，支持yml,yaml等不同格式的配置文件。

通过定义后缀名单，循环尝试读取，读取失败跳过循环。
<a name="dZmLC"></a>
## todo
优化服务端异常处理，（测试重试机制，服务端方法异常时，客户端不知情）



<a name="HXSTX"></a>
## 踩坑日志
莫名奇妙的错误，debug找了半天发现是因为端口冲突了，因为我的etcd可视化占的是8080端口，我提供者服务配置的也是8080端口，导致消费者请求到etcd可视化页面上，响应后解析报错<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1719816186241-f2c9d616-e78d-4614-9dcd-2dc063d1ae4f.png#averageHue=%232c3643&clientId=u854236df-d94a-4&from=paste&height=167&id=u5fff150c&originHeight=334&originWidth=1550&originalType=binary&ratio=2&rotation=0&showTitle=false&size=489131&status=done&style=none&taskId=uc58c23ba-f8d2-4b3b-9eb0-46637236190&title=&width=775)

RpcConfig是通过RpcApplication构建的单例对象。RpcProviderBootstrap在注册时使用的是注解标注属性的类型座位serverName和注解传入的serverVersion。在从注册中心获取列表时用的是Rpconfig中的serverName和version。所以获取不到值。可以通过method获取类的名称座位serverName去注册中心查询。

