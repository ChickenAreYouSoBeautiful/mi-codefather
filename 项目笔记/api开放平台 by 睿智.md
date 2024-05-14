# API开放平台 by 睿智

# 项目代码地址
## 前端代码仓库
[http://gitlab.code-nav.cn/mi11/miapi-frontend.git](http://gitlab.code-nav.cn/mi11/miapi-frontend.git)
## 后端代码仓库
[http://gitlab.code-nav.cn/mi11/miapi-backend.git](http://gitlab.code-nav.cn/mi11/miapi-backend.git)
# 项目介绍
api开放平台是一个可以开放式的接口调度平台，可以让客户已最少的代码来调用我们系统提供的功能。
系统管理员可以通过后台管理系统对接口进行管理和通过可视化界面分析接口情况
用户可以开通并访问接口并计算接口的访问次数。
# 需求分析
管理员可以查看接口，上线接口，下线接口，修改接口。
可以通过可视化页面来统计接口的调用次数
用户可以查看，开通，调用开放的接口。
**要求：**

1. 防止攻击
2. 不能随便调用
3. 流量保护不能无线刷
4. 统计调用次数
5. 计费
6. api接入
#  业务流程
**大体模块：**
系统管理员管理接口的服务
管理员查看接口调用次数统计的服务
提供访问接口实现的服务
用户开通/调试文档并访问的服务
sdk通过给用户的包用于快速集成
![](https://cdn.nlark.com/yuque/0/2024/jpeg/32636653/1709631741370-807b66dc-8b30-4434-82ab-96bac773124a.jpeg)
# 技术栈 todo
## 前端
ant desgin pro-cli   3.3.0
umi4
umi Request
## 后端
SpringBoot
mybatis
mysql
redis
Dubbo
SPRING Gateway
# 项目初始化
## 前端项目初始化
阅读 [ant desgin pro 文档 ](https://pro.ant.design/zh-CN/docs/getting-started/) 下载代码
注：按照官网命令直接运行会跳过umi版本的选择使用最新版本的umi
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1709689117268-db3cf418-26c6-4cba-b8c2-252bd51b2fec.png#averageHue=%23fefefd&clientId=u3295a937-3f7e-4&from=paste&height=292&id=uc1f73818&originHeight=365&originWidth=1360&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=39116&status=done&style=none&taskId=uda11c748-5757-4318-860f-b98a1038c9d&title=&width=1088)
** 删除国际化**
运行命令删除国际化 ，我遇到的报错：根据提示删除src/components/index下引用的组件就可以了
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1709689273785-938c4c64-8c99-4752-9417-933ca6e420b9.png#averageHue=%23688357&clientId=u3295a937-3f7e-4&from=paste&height=810&id=u900c9ad2&originHeight=1012&originWidth=1904&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=264185&status=done&style=none&taskId=u4fd7126c-ff41-43a2-a8bd-f25dbc090e5&title=&width=1523.2)
正常删除一些测试类多余的文件，正常启动（初始化完成）
## 后端项目初始化
访问gitlab拉去springboot-init初始化后端项目。
删除.git 文件 
替换项目名称
修改数据库配置
连接数据库，使用脚本创建库表。
启动项目，访问api文档成功（项目初始化完成）
# 数据库设计
## 接口信息表
```sql

-- 接口信息表
create table if not exists interface_info
(
    id         bigint auto_increment comment 'id' primary key,
    name        varchar(512)                       null comment '接口名称',
    description  varchar(512)                       null comment '接口描述',
    url    text                                      null comment '接口路径',
    requestHeader    text                                      null comment '请求头',
    responseHeader    text                                      null comment '响应头',
    method    varchar(128)                           null comment '请求方法',
    status    int      default 0                 not null comment '接口状态（0-上线，1-下线）',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_userId (userId)
) comment '接口信息表' collate = utf8mb4_unicode_ci;
```
# 接口信息基础功能开发
先把初始化好的后端模板代码精简一下，删除不需要的代码。
复制代码修改快速实现接口crud基础功能的开发，运行项目进行测试.
**测试时注意：**
使用文档测试，这些默认值会带到后端，校验只是判空就会携带参数查询数据库导致查不出数据
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1709712012860-eee78ebc-3f15-487d-a8d2-1758496a70ae.png#averageHue=%23fcfafa&clientId=u3295a937-3f7e-4&from=paste&height=456&id=ua5f2f11c&originHeight=570&originWidth=1376&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=57358&status=done&style=none&taskId=ufcd5c3d7-1110-41a4-95eb-1c77c7ebc00&title=&width=1100.8)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1709715253140-31d82d7a-cee5-4b57-b0a0-d029318a4820.png#averageHue=%23303a43&clientId=u3295a937-3f7e-4&from=paste&height=824&id=u747afb4c&originHeight=1030&originWidth=1921&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=1636298&status=done&style=none&taskId=u78288927-31ff-4739-b359-7f6d977ce5b&title=&width=1536.8)
编写前端配置requestConfig中的baseURL(后端访问路径) ,和withcredentials(携带cookie)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1709862802084-ee706039-0d0b-48c4-ba37-93475d24a8ad.png#averageHue=%235c6d51&clientId=ue7dd8913-8b2c-4&from=paste&height=810&id=vq16b&originHeight=1012&originWidth=1904&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=226676&status=done&style=none&taskId=u5308638d-6a61-4aa0-96ad-c76fb196cfc&title=&width=1523.2)
修改登录访问接口为我们自己后端的接口登录成功后将数据放入全局状态initialState中。
修改app.tsx中getInitialState将接口替换成我们自己的，然后再将获取到的数据放入全局状态中，并且修改应用当前用户的变量名
修改access里面获取当前用户的变量名,修改校验admin用户的逻辑
登录成功后页面左侧菜单栏消失经排查后：给router.ts文件里定义的路由信息加上名称就可以显示出来了
左下角头像显示和退出登录只需修改AvatarDropDown中将登录用户变量修改成我们自己设置的。
修改列表页面的columns中定义的列信息，修改request属性将值替换成我们访问后端的方法。
**新增和修改页面**
创建两个Model设置它们的属性和方法根据状态控制它们的展示和关闭，和调用后端接口（跟着鱼皮做到没报什么错,一些类型错误看着调整（也不影响运行））
## todo
下载下来时的类型也报这个   **不影响运行！**
ts类型报错：提示让我将每一个对象的每个属性都设置一遍类型。（找了半天没找到解决方案，any 或者不设置类型就不报）
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1709865404491-d4748d63-9693-4d4d-ab26-1ef92a10aaa4.png#averageHue=%234c504f&clientId=ue7dd8913-8b2c-4&from=paste&height=810&id=u20dbfb2b&originHeight=1012&originWidth=1904&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=263955&status=done&style=none&taskId=udbf31f27-df09-4fbe-bc15-745adcb3efa&title=&width=1523.2)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1709868735248-6a88d69b-95f4-4809-ab48-854bec9df250.png#averageHue=%23f5f5f5&clientId=u7c0d16e3-d693-4&from=paste&height=1653&id=u38513dcb&originHeight=2066&originWidth=3842&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=965739&status=done&style=none&taskId=u8a414967-d472-4d52-acfd-029019f2392&title=&width=3073.6)
## 模拟用户调用接口
使用hutool工具库通过http调用我们后端的接口可以访问
调试成功后迎来第一个问题？
**： 接口如果这样开放谁来调用，都不清楚，而且及不安全如果有用户恶意攻击会导致网站不能正常运行影响到其他用户**
解决：可以使用比较灵活的API签名认证来进行校验，类似与用户名密码的登录但签名认证是无状态的每次请求时必须携带。
### API签名认证
首先给用户表新增字段 ak 和 sk
参数1  accessKey    为了方便简称（ak）
参数2  secretKey      为了方便简称（sk）
为了安全下性考虑，ak和sk肯定不能进行明文传输，需要经过特殊的加密逻辑，目前有一下加密方式。
对称加密： 可以加密也可以解密       
非对称加密： 公钥加密私钥机密或者私钥加密公钥解密  
单向加密：这个加密是不可逆的，一但加密是无法直接解密的.   （实现算法有 md5，shell 1）
三种加密方式的加密力度都不同  ： 单向加密 > 非对称加密 > 对称加密
参数3  sign  
通过签名加密算法加密的值，客户端这边进行加密，服务端也需要有同样的值加密，它们加密后的值相同就证明加密前的值也相同
需要注意：

1. ak和sk不能通前端直接明文传输，用户可以通过调试器轻松获取到有安全隐患，使用前端加密后再传递到后方也会有相同的隐患，所以不能完全信任前端的加密。
2. 调用第三方平台的api也最好不要在前端直接调用，攻击者有可能会通过源代码找出我们的调用第三方的api的调用信息有极大的安全隐患，一般来说将调用第三方api的操作放到后端还是较为安全的。
3. 后端通过加密后的ak和sk访问就真的安全了吗？ 

	果用户使用代理的话，我们的请求也会走代理的网络，如果有有人拦截或重放了我们的请求也是能获得我	       们的访问的签名，然后别人可能就会拿着拦截到的签名访问也是不安全的。
所以要再加一个参数：
参数4body
用户传递的参数
防止重放
参数5 nonce  临时随机数
每次请求时都携带一个临时的随机数用过一次之后一段时间内就不能够再次使用，服务端需要存储使用过的随机数，所以通常是配合一个参数时间戳来使用
参数6 timestamp
时间戳一般配合临时随机数使用，他可以控制在一段时间内临时随机数有效，如过了五分钟后将随机数从列表中淘汰掉，对比当前的时间戳过了五分钟是无权限
》这些参数是标准的API签名认证所需要的基本参数，同时API签名认证也是十分灵活的可以根据场景增加校验参数，自由DIY,如双方约定加一个盐值，或者加上客户的信息等等。。
## 开发方便快速使用的sdk
写到这里，发现服务端的代码还是比较多和繁琐的，需要自己构建参数和实现签名和随机数时间戳的生成。为了方便调用者可以快速的使用我们的接口。所以需要开发一个client的sdk,用户只需要配置自己的ak和sk就可以自动生成clent调用我们的代码。
**开发sdk**
初始化一个新项目，利用idea可视化页面创建项目时jdk最低只能选择17可以通过创建好在修改版本或者替换server URL为：[https://start.aliyun.com](https://start.aliyun.com) 来解决。
引入依赖：
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-configuration-processor</artifactId>
  <optional>true</optional>
</dependency>
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <optional>true</optional>
</dependency>
```
创建ClientConfig
```java
package com.mi.miapi_client_sdk;

import com.mi.miapi_client_sdk.client.MiApiClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * @author mi11
 * @version 1.0
 * @project miapi_client_sdk
 * @description clent配置类
 * @ClassName MiApiClientConfig
 */
@Configuration
@ConfigurationProperties(prefix = "miapi.client")
@Data
@ComponentScan
public class MiApiClientConfig {

    private String  accessKey;

    private String  secretKey;


    @Bean
    public MiApiClient miApiClient(){
        return new MiApiClient(accessKey,accessKey);
    }
}

```
在resource目录下新建META-INF目录，在该目录下编写配置文件spring.factories配置需要需要代码提示的配置类（实现用户引入依赖后编写yml/propertise时的代码提示）
```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.mi.miapi_client_sdk.MiApiClientConfig

```
到这里一个简单的sdk就编写完成了，利用maven的可视化命令 install 将依赖下载到本地就可以引入进行测试了，如果别人要用可以把jar包发给他或者上传到maven总仓库。


## 发布/下线接口
发布接口
业务逻辑：

1. 检验参数，不为空且有效
2. 校验是否是管理员
3. 是否可以调用
4. 修改状态

下线接口

1. 检验参数，不为空且有效
2. 校验是否是管理员
3. 修改状态

利用组件编辑接口文档信息页和接口详情页
**在线调用**
编写后端方法模拟调用成功展示
**todo （写之前想法，待验证）**
展示调用结果格式化json格式
由于参数不是固定的可以通过接口请求方法，展示不同的调用方式
由于参数不固定使用for循环接口信息中的参数生成输入框
后端接收时拿到转为json的表单数据并再转为Map ，
调用远方时如果时post请求时，无法确定参数对象的类型（如Idrequest等）？
# 统计次数功能
业务逻辑
用户再调用接口时统计次数，当调用接口成功进行统计
用户 =》 接口 多对多
创建用户接口统计表
```sql
create table if not exists user_interface_count
(
    id           bigint auto_increment comment 'id' primary key,
    userId       bigint                             not null comment '用户 id',
    interfaceId  bigint                             not null comment '用户 id',
    count        bigint                             not null comment '调用次数',
    residueCount bigint                             not null comment '剩余次数',
    createTime   datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint  default 0                 not null comment '是否删除'
) comment '用户调用接口统计' collate = utf8mb4_unicode_ci;
```
在调用接口之后我们需要对调用接口次数进行统计，调用次数+1，剩余次数-1
这样的话我们可以单独把这段统计的逻辑拆出来，因为我们有很多的接口它们都需要进行统计。如果每个方法都再写一边会十分麻烦。
解决方案:
抽离出来单体的方法
spring的aop在执行完这个方法之后做一下统计
servlet的过滤器和拦截器
这种情况可以使用aop来进行操作，但是由于我们的项目并不是一个单机的服务，如果要使用aop的话就要让每一个写接口的类都引入aop和写一些代码。
所以我们需要找一个对于分布式情况下能统一做一些事情的技术。
![](https://cdn.nlark.com/yuque/0/2024/jpeg/32636653/1711896281873-1a0dd464-45bb-4ae8-86d3-af8c18366b7b.jpeg)
**todo:**
对应统计次数，还需要提前给用户分配调用次数
# 网关
## 什么是网关?
网关就是对请求做一些统一的处理，例如火车/地铁站的检票，图书馆借书等。
## 网关可以做什么？

1. 路由  
2. 负载均衡 
3. 统一鉴权
4. 统一业务逻辑
5. 访问控制     （黑白名单）
6. 发布控制  （灰度发布，可以利用权重让部分用户体验新版本，没有问题后慢慢调整权重最后替换）
7. 跨域
	. 接口保护 (可以隐藏我们后端接口的真实地址)	

a.  接口限流
b. 熔断降级
c. 超时重试

9. 流量染色（请求经过网关携带表示，知道请求从哪里来。traceId）
10. 统一日志
11. 统一文档  

接下来会学习并使用springBoot GateWay 来实现功能
## 网关的分类
全局网关（接入层网关）： 负载均衡，请求日志，不与业务逻辑绑定
业务网关（微服务网关）： 会有业务逻辑，将请求转发到不同的项目接口或服务等
## 网关选型介绍：
[https://zhuanlan.zhihu.com/p/500587132](https://zhuanlan.zhihu.com/p/500587132)
## SpringCloudGateway
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1711895899013-24332be7-2566-4011-b67e-14805b50fd8d.png#averageHue=%23f9f9f9&clientId=uf9b566e4-0b5f-4&from=paste&height=645&id=u115dae89&originHeight=806&originWidth=907&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=75613&status=done&style=none&taskId=uc193ce03-e8e6-4df5-a870-084442db227&title=&width=725.6)
这个是springGateway的工作流程图，最上方是我们的客户端发送请求到handlerMapping通过路由匹配我们的路径发送到webHandler，在这里可以设置过滤器对响应前和响应后的数据做处理。调用最后的具体服务

### 如何使用
根据官方文档提示
代码配置      灵活度高,可以自己div断言和filter
配置文件      便捷方便，利于规范
gateway也有许多的默认规则，威力方便我们使用配置文件的方式进行开发
官方给出了两中yml的配置方式，简洁版和展开版区别就是把参数配置展开了
```yaml
# 简洁
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: https://example.org
        predicates:
        - Cookie=mycookie,mycookievalue
        
#展开版 
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: https://example.org
        predicates:
        - name: Cookie
          args:
            name: mycookie
            regexp: mycookievalue
```
### predicate(断言)
之前在描述gateway工作流程时 ，是通过HandlerMapping的对比就是考断言来完成的。
**The After Route Predicate Factory**
```yaml
# 在配置日期之前访问的话路由到uri指定的网址
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: https://example.org
        predicates:
        - After=2017-01-20T17:42:47.789-07:00[America/Denver]
```
**The Before Route Predicate Factory**
```yaml
# 在配置日期之后访问的话路由到uri指定的网址
spring:
  cloud:
    gateway:
      routes:
      - id: before_route
        uri: https://example.org
        predicates:
        - Before=2017-01-20T17:42:47.789-07:00[America/Denver]
```
**The Between Route Predicate Factory**
```yaml
# 在配置日期之间访问的话路由到uri指定的网址
spring:
  cloud:
    gateway:
      routes:
      - id: between_route
        uri: https://example.org
        predicates:
        - Between=2017-01-20T17:42:47.789-07:00[America/Denver], 2017-01-21T17:42:47.789-07:00[America/Denver]
```
**The Cookie Route Predicate Factory**
```yaml
# 判断请求携带了cookie中有name为chocolate，value为ch.p路由到uri的网址
spring:
  cloud:
    gateway:
      routes:
      - id: cookie_route
        uri: https://example.org
        predicates:
        - Cookie=chocolate, ch.p
```
**The Header Route Predicate Factory**
```yaml
# 判断请求携带了header中有name为Request-Id，value为\d+路由到uri的网址
spring:
  cloud:
    gateway:
      routes:
      - id: header_route
        uri: https://example.org
        predicates:
        - Header=X-Request-Id, \d+
```
**The Host Route Predicate Factory**
```yaml
# 判断请求的地址为Host配置的时路由到uri的地址 (**代表通配符)
spring:
  cloud:
    gateway:
      routes:
      - id: host_route
        uri: https://example.org
        predicates:
        - Host=**.somehost.org,**.anotherhost.org
```
**The Method Route Predicate Factory**
```yaml
# 判断请求方式为Method配置的时路由到uri的网址
spring:
  cloud:
    gateway:
      routes:
      - id: method_route
        uri: https://example.org
        predicates:
        - Method=GET,POST
```
**The Path Route Predicate Factory**
```yaml
# 判断请求地址为Path配置的时路由到uri的网址
spring:
  cloud:
    gateway:
      routes:
      - id: path_route
        uri: https://example.org
        predicates:
        - Path=/red/{segment},/blue/{segment}
```
**The Query Route Predicate Factory**
```yaml
# 判断请求参数为Query配置的时路由到uri的网址
spring:
  cloud:
    gateway:
      routes:
      - id: query_route
        uri: https://example.org
        predicates:
        - Query=green
```
**The Weight Route Predicate Factory**
```yaml
# 如果请求适配多个规则会根据它们的组和权重来进行分配，下列例子中匹配时百分之八十会进入第一个。
spring:
  cloud:
    gateway:
      routes:
      - id: weight_high
        uri: https://weighthigh.org
        predicates:
        - Weight=group1, 8
      - id: weight_low
        uri: https://weightlow.org
        predicates:
        - Weight=group1, 2
```
### Filter Factory
**AddRequestHeader GatewayFilter factory**
```yaml
# 请求匹配规则后增加请求头AddRequestHeader
spring:
  cloud:
    gateway:
      routes:
      - id: add_request_header_route
        uri: https://example.org
        filters:
        - AddRequestHeader=X-Request-red, blue
```

1. 添加请求参数
2. 添加响应头
3. 降级
4. 限流
5. 重试

理解：
网关就像一个快递中转站，路由根据对比请求，将快件分配到不同的地址。并可以统一做一些处理，如打上标签等。
## 具体实现
**需要用到的特性**

1. 路由   （请求转发）
2. ~~负载均衡~~   （需要搭配注册中心使用，暂时不需要）
3. 统一鉴权   
4. 统一业务逻辑
5. 访问控制     （黑白名单）
6. ~~发布控制  （灰度发布，可以利用权重让部分用户体验新版本，没有问题后慢慢调整权重最后替换）~~
7. 跨域
	. ~~接口保护 (可以隐藏我们后端接口的真实地址)	~~

a.  接口限流
b. 熔断降级
c. 超时重试

9. 流量染色（请求经过网关携带表示，知道请求从哪里来。traceId）
10. 统一日志   
11. 统一文档    (使用knife4j整合就可以)

**网关的业务流程：**

1. 用户请求到网关  √ 
2. 将请求转发到对应服务  √
3. 统一打印请求信息的日志 √
4. 判断黑白名单  √
5. 统一鉴权 
6. 判断接口是否存在，调用接口 
7. 统一统计调用次数 √
8. 打印响应日志  √

实现业务流程中统一统计调用次数和打印响应日志需在请求响应之后操作，经过测试虽说exchange中可以拿到响应对象。但由于请求是异步的拿不到完成的响应结果。
解决:  参考文章[https://blog.csdn.net/qq_19636353/article/details/126759522](https://blog.csdn.net/qq_19636353/article/details/126759522)
理解：servletHttpResponseDecorator对reponse做一个增强,重写writeWith再里面可以拿到完整的响应对象，可以在里面实现请求响应后做一些操作。 使用的是设计模式里面的装饰着模式可以给方法添加一些新的功能。
在网关的业务逻辑里，如统计调用次数，和鉴权的一些逻辑需要对数据库进行操作，但是网关项目比较简洁，并没有引入一些操作数据库的依赖，而且我们再backend项目中已经写了调用的方法。要想调用数据库现在有一下的方法：

1. 将操作数据库的依赖和代码复制过来，（不便于维护）
2. 将backend项目打成jar包引入       （增加项目代码冗余）
	. backend项目暴露接口，使用HttpClinet请求  	（调用需要些http请求，拆包解包，七层封装）
4. 使用RPC框架进行实现       （效果是像调用本地方法一样调用远程方法）

**http和rpc的区别**
目前理解：底层使用协议可能不同，rpc可以直接从应用层调用，使用原生的tcp/ip
![](https://cdn.nlark.com/yuque/0/2024/jpeg/32636653/1712158730518-bf5df7a3-7fbc-4db8-a8cc-66a4f3d21457.jpeg)
## DUBBO
dubbo是一rpc的一种实现，底层使用的是triple协议
### 如何使用？
看官方文档 [https://cn.dubbo.apache.org/](https://cn.dubbo.apache.org/) 
项目中使用依赖：
**注意：记录**本项目使用依赖，学习请看官方文档
使用nacos注册中心：[https://nacos.io/](https://nacos.io/)
```xml
 <properties>
        <java.version>1.8</java.version>
        <dubbo.version>3.2.0</dubbo.version>
    </properties>
<!-- spring boot starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>


        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-spring-boot-starter</artifactId>
            <version>${dubbo.version}</version>
        </dependency>

        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-client</artifactId>
            <version>2.1.0</version>
        </dependency>



        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-bom</artifactId>
            <version>${dubbo.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
```
配置文件
```yaml
dubbo:
  application:
    name: miapi_backend
  protocol:
    name: dubbo
    port: -1
  registry:
    address: nacos://localhost:8848
    id: nacos
```
根据官方文档调通流程，继续编写业务逻辑
### 网关逻辑梳理
查询数据库获取secretKey进行鉴权
查询数据库判断接口是否存在,并且还有调用次数
查询数据库调用invoke方法
# 接口分析
业务逻辑
分析接口的调用占比排行，调用占比高优先显示，接收传递参数，不传递默认3条，最大10条

1. 查询所有接口调用信息，并根据接口进行分组

select interfaceId,count form user_interface_count where status = 0 group by interfaceId
# TODO 



1. **登录两次才会跳转页面  √**

原因在setInitState后直接跳转页面的话会导致状态设置不上，（修改后代码）
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1710321823177-1f6754fb-5a21-4c46-99f7-c59aee95f60d.png#averageHue=%232f2d2c&clientId=u40dc49de-188a-4&from=paste&height=137&id=ucdbdaf45&originHeight=274&originWidth=1043&originalType=binary&ratio=2&rotation=0&showTitle=false&size=56589&status=done&style=none&taskId=ucc6464cb-bd0c-46d6-b2ec-4055e95940d&title=&width=521.5)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1710321860570-0d8515a8-b5f6-4ee2-a350-1477ac8e4ab4.png#averageHue=%232c2b2b&clientId=u40dc49de-188a-4&from=paste&height=202&id=ucec496c6&originHeight=404&originWidth=902&originalType=binary&ratio=2&rotation=0&showTitle=false&size=38711&status=done&style=none&taskId=uceb87770-ed23-419d-9969-aac294d3036&title=&width=451)
app.tsx文件中判断登录用户，取值时娶不到就会自动再跳转到登录页
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1710321913389-2a4f6d6d-1383-4a4b-94cd-cf2aa5a94498.png#averageHue=%232d2c2c&clientId=u40dc49de-188a-4&from=paste&height=88&id=ud5f91739&originHeight=176&originWidth=1040&originalType=binary&ratio=2&rotation=0&showTitle=false&size=26495&status=done&style=none&taskId=uf5866110-3289-4417-b1bc-4b17fec2286&title=&width=520)

2. **增加接口计算文本相似度  √**

改造伙伴匹配中心的编辑距离算法实现

3. **将sdk发布到maven远程仓库。**
4. **在线调用invoke方法复用  √**

根据接口id找到接口路径，通过sdk匹配策略实现
根据星球也看到了不一样的解法： 
1.使用策略模式
![](https://cdn.nlark.com/yuque/0/2024/jpeg/32636653/1713229475173-061495ec-5ed8-4c78-acc8-d5e4d17ed0b2.jpeg)
2.接口信息表新增请求方法名的列，通过反射apiClient对象。根据方法名找到方法进行调用。
可以实现功能上述功能，但扩展让其他开发者提供接口的话，只能维护apiClinet，服务路径也要在类中再定义
新增接口
1.接口项目实现接口  
2.sdk新增接口路径（修改时这里也要修改，根据接口路径找策略）并配置策略实现调用
3.接口管理新增接口信息

5. **签名校验实现nonce随机数校验  √**

引入redis解决，

6. **网关自定义返回响应 √**

可以直接构建response响应信息，进行返回

7. **前端根据请求参数类型生成对应的请求参数**
## 新增开放接口流程

1. 编写模拟接口，并测试可以调通
2. 更新sdk,根据路径配置策略
3. 管理员在接口管理页面新增该接口信息
### 签到逻辑
给用户新增mi币字段，签到一次给50个（连续签到每天多10个,最多叠到100）上限1000.
选型
使用redis的hash接口 （理由：可扩展性高，用户基数不大）
用户id => { "日期"：{ time: "签到时间" ,status: "签到状态"，miCurrency: "mi币数量"} }
流程分析

1. 新增字段mi币字段
2. 判断是否已经签到  
3. 计算要增加的mi币
4. 向redis里增加签到信息
5. 签到成功，用户增加相应mi币

给接口增加每次调用消耗的mi币字段，当剩余次数不足时扣除响应mi币
## 接口消费mi币
修改之前判断接口是否存在逻辑，当剩余接口数量大于0或者用户mi币减去调用接口要消耗的mi币大于0时才可调用接口。
统计次数时判断有剩余次数的优先使用剩余次数，没有剩余次数扣除相应积分
# 踩坑
Api开放平台项目，将模拟接口和sdk移动到backend下后项目文件存在但是一直报红
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1711982320881-07f38237-872b-4f70-990c-c832ac9f167d.png#averageHue=%23323d45&clientId=u987a0ddb-52e5-4&from=paste&height=817&id=u61b829f7&originHeight=1021&originWidth=1920&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=1590820&status=done&style=none&taskId=u9ff828b4-552f-469c-b0bb-db8e55b7be1&title=&width=1536)
解决：
是因为我们移动后.idea的配置没更新过来，我们找到项目根目录找到.idea将其删除。再重新打开会自动再生成一个就可以了。
如果还是不行点击file再刷新一下缓存

**开发sdk测试调用错误**
报错信息： Error creating bean with name 'com.example.miapi_interface.MiApiInterfaceApplicationTests': Injection of resource dependencies failed; nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'com.mi.miapi_client_sdk.client.MiApiClient' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {@javax.annotation.Resource(shareable=true, lookup=, name=, description=, authenticationType=CONTAINER, type=class java.lang.Object, mappedName=)}
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1711528246658-4c0dba83-28f5-49a3-bfb1-b1588368a915.png#averageHue=%232c343d&clientId=ube521bae-d6e9-4&from=paste&height=368&id=OT1Sk&originHeight=735&originWidth=1674&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1056078&status=done&style=none&taskId=u2cd3e6b7-9389-4b7a-b1ab-161b4b74a53&title=&width=837)
经过排查修改，是由于编写sdk代码时我粗心将减号写成了下滑线改过来就可以了。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1711528310797-5371ad88-df49-487e-b581-2583fd295a75.png#averageHue=%23334049&clientId=ube521bae-d6e9-4&from=paste&height=63&id=fofxN&originHeight=125&originWidth=511&originalType=binary&ratio=2&rotation=0&showTitle=false&size=53512&status=done&style=none&taskId=uc04bf2f0-2460-4e1c-8083-05fd3bb459d&title=&width=255.5)

## 网关全局过滤器执行两次
原因： 因为全局过滤器我注册了两次，我使用了@Componet和@Bean注解，它们都会注册一次全局过滤器，所以会执行两遍
解决： 删掉一个就好。
# API开放平台小结
通过这个项目还是学到了不少东西，也意识到了自己的不足。我是培训班速成的，做下来之后发现自己基础较差。搞完这个项目打算先补补基础。只有认识到自己的不足才能改进。

项目的流程已经跑通，后面也会继续增加接口和优化项目。 

已完成扩展：

1. 鉴权失败后自定义统一响应
2. 复用后端invoke在线调用接口。
3. 签到获取mi币，调用接口消耗mi币

学到的东西：

1. 学习画图能力，可以根据业务流程画简单的流程图帮助自己理解（在看别人的代码时，下次自己做项目时试着画画）
2. 增加阅读官方文档的经验。
3.  理解api签名认证相关知识，可以理解为无状态的登录，主要作用就是进行鉴权而且有很好的扩展性。每次请求接口时必须携带要求的签名等信息进行鉴权。
4. 了解aop,他可以在我们代码执行之前或者之后执行一段逻辑，如api鉴权等一些重复的逻辑就可以使用aop实现。
5. 网关的应用，网关主要做路由转发和很多需要统一处理的事情，好处就是保护接口，统一处理。相比于aop他是基于多个服务的。
6. RPC的理解和Dubbo（RPC实现）的应用，他主要的功能是让我们以调用本地方法的方式去调用远程的方法。
7. 通过扩展在线调用复用invoke方法，熟悉反射的基本应用，通过参考星球伙伴代码，使用策略模式实现。
8. 通过扩展签到功能了解了redis的hash数据结构，实现了签到和连续签到获取mi币。


发现的问题及我的解决方案：

1. 在查阅文档时，尤其是英文文档是看到是一脸懵，看的一知半解，怀疑我自己是不是理解能力有问题。

解决： 菜就多练，背背单词，看的多了应该会好些吧。（背单词有方法的话，拜托赐教一下）

2. 在跟完鱼皮哥项目时，对于扩展想法很少，而且考虑问题没有很全面，容易钻牛角尖，搞半天才发现不行

解决： 菜就多练了，多看多写

3. 没有调研的意识，我做项目时只在我了解的技术里进行选择，但其实可能有更合适的解决方案我不知道。

解决：做一个功能前自己没有好的想法可以到网上搜一下解决方案，选一个合适的就行。

4. 效率比较慢（是只有我白天没精神，坐久就瞌睡，就睡觉前精神些吗）

解决：目前就是听歌，虽然也会影响效率但我能保持清醒，大家有好的解决方案吗？
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1713494763214-f98ba3ec-07fd-402c-8ec6-99eb8a41b001.png#averageHue=%23f8f8f7&clientId=u0527c524-fcdd-4&from=paste&height=1033&id=u801d8745&originHeight=2066&originWidth=3842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=869402&status=done&style=none&taskId=uf2d191c6-b2da-4052-a85c-4683c3fe4e4&title=&width=1921)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1713494801344-e59d2035-6f16-4748-bfd4-f2281d4de8f1.png#averageHue=%23f6f6f6&clientId=u0527c524-fcdd-4&from=paste&height=1033&id=ue327af0e&originHeight=2066&originWidth=3842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1048170&status=done&style=none&taskId=ua4f8b842-60f4-49da-91c8-6722fb0147e&title=&width=1921)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1713497190940-ad03bc8b-48ae-4255-83b3-3118e2ac743b.png#averageHue=%23f5f5f5&clientId=u0527c524-fcdd-4&from=paste&height=1033&id=ub24775da&originHeight=2066&originWidth=3842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=944514&status=done&style=none&taskId=u7df6d84f-8f4d-40de-bd1a-a3f69c0170c&title=&width=1921)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1713497204968-f510dd63-7ccb-409e-926d-5cb20cddd7f7.png#averageHue=%23f7f7f7&clientId=u0527c524-fcdd-4&from=paste&height=1033&id=ua2f50791&originHeight=2066&originWidth=3842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1024138&status=done&style=none&taskId=u75b22b76-b359-4a69-875c-707d9ba1041&title=&width=1921)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32636653/1713497314926-756fb500-01bc-442e-a6a2-7f3c5a37bd84.png#averageHue=%23f6f6f6&clientId=u0527c524-fcdd-4&from=paste&height=1033&id=u3d454b93&originHeight=2066&originWidth=3842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=976311&status=done&style=none&taskId=u253868f6-c3c1-4b21-9957-c19f9f2b1d1&title=&width=1921)

# 项目部署
## 多环境
多环境是指一套代码在不同的阶段所需要的环境不同需要根据实际情况进行调整配置。
**多环境分类为：**

1. 本地开发环境   （本机运行，开发）
2. 测试环境    （测试，运维，产品，调试使用）
3. 预发布环境   （内测，和正式库一样测试发现bug）
4. 正式环境  （用户使用的正式环境）非必要不修改。
5. 沙箱环境 （实验环境）

每个环境的作用不一样，所需要的配置也不一样。多环境就可以让每个环境互不影响根据需求做合理的配置
### 前端多环境
前端项目在我们本地运行请求的是我们本地的后端地址，如果要发布的换需要调整请求地址
使用umi框架，运行时会传入process.env.NODE_ENV 变量，他的值就是当前的运行环境，development | production 分别为测试环境和正式环境。

- **运行方式**

开发环境 ： npm run start
线上环境：  npm run build
不同的环境所需要的配置是不同的，umi的配置文件是config，可以在配置文件添加相应环境名称后缀来区分环境。参考文章[https://umijs.org/zh-CN/docs/deployment](https://umijs.org/zh-CN/docs/deployment)

-  **项目配置**

开发环境： config.dev.ts
正式环境： config.prod.ts
公共环境： config.ts
### 后端多环境
springboot 的配置文件 是application.yml 也是可以通过增加环境后缀来区别的。
也可以在启动项目时传入环境变量
```java
java -jar 项目jar包  --spring。profiles。active=prod
```
后端项目不同环境下需要调整的就是用到的依赖，库，连接地址和jvm参数

- 数据库地址
- 缓存地址
- 项目端口
- 服务配置等等
## 原始部署
### 前端
可以使用nignx ,tomcat 等web服务器部署
### 后端
使用springboot 运行jar包部署。

