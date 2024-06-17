# 1.MQ概述

MQ全称 Message Queue (消息队列) ,时在消息的传输过程中保存消息的容器，多用于分布式系统之间进行通信

# 广播 交换机 Fanout

**生产者把消息发送给交换机，交换机把该消息广播到绑定了该交换机的消息队列上**

广播的特点：

- 可以有多个队列
- 每个队列都要绑定到Exchange（交换机）
- 生产者发送的消息，只能发送到交换机，交换机来决定要发给哪个队列，生产者无法决定
- 交换机把消息发送给绑定过的所有队列
- 订阅队列的消费者都能拿到消息

```java
/**
* 生产者
*/
@Test
    void testFanoutExchange(){
        String exchange = "amq.fanout";
        String message = "hello,fanout";
        //参数1：交换机名称，参数2：消息队列名称，参数3：消息内容
        rabbitTemplate.convertAndSend(exchange,"",message);
        System.out.println("发送消息成功");
    }

-----------------------------------------------------------------


    /**
     * 消费者
     * 消息队列绑定交换机
     * @param message
     */
    @RabbitListener(bindings = @QueueBinding(value = @Queue(name = "fanout.queue1"),
    exchange = @Exchange(name = "amq.fanout",type = ExchangeTypes.FANOUT)))
    public void fanoutQueueListener01(String message) {
        System.out.println("消费者01接收到fanout.queue01的消息：" + message);
    }

    @RabbitListener(bindings = @QueueBinding(value = @Queue(name = "fanout.queue2"),
            exchange = @Exchange(name = "amq.fanout",type = ExchangeTypes.FANOUT)))
    public void fanoutQueueListener02(String message) {
        System.out.println("消费者02接收到fanout.queue01的消息：" + message);
    }
```

#  direct 交换机 定向

**生产者发送消息给direct交换机，通过指定的routingKey来指定选择消息队列从而实现定向**

direct模型下：

- 队列与交换机的绑定要指定一个 RoutingKey
- 消息的发送方在向 exchange 发送消息时，也必须指定消息的 RoutingKey。
- exchange 不再把消息交给每一个绑定的队列，而是根据消息的Routing Key进行判断，只有队列的Routingkey 与消息的 Routing key 完全一致，才会接收到消息

```java
/**
* 生产者
*/
@Test
    void testDirectExchange(){
        //参数1：交换机名称,参数2：routingKey自定义相当于唯一标识，参数3：消息内容
        rabbitTemplate.convertAndSend("amq.direct", "error", "Hello amq.direct error");
        rabbitTemplate.convertAndSend("amq.direct", "info", "Hello amq.direct info");
        rabbitTemplate.convertAndSend("amq.direct", "warning", "Hello amq.direct warning");
    }



   /**  
   	 * 消费者
     * direct 定向
     * @param message
     */

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "direct.queue01"),
            exchange = @Exchange(name = "amq.direct", type = ExchangeTypes.DIRECT),
            key = {"error", "info"}
    ))
    public void directQueueListener01(String message){
        System.out.println("消费者01接收到direct.queue01的消息：" + message);
    }


    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "direct.queue02"),
            exchange = @Exchange(name = "amq.direct", type = ExchangeTypes.DIRECT),
            key = {"error", "warning"}
    ))
    public void directQueueListener02(String message){
        System.out.println("消费者02接收到direct.queue02的消息：" + message);
    }
```

# topic交换机  通配符

**生产者发送消息到amp.topic交换机上也是根据toutingKey唯一值选择消息队列,不过可以使用通配符   #号代表多个单词，*号代表一个单词，多个单词之间打点分割 **

topic类型的Exchange与 direct 相比，都是可以根据 RoutingKey 把消息路由到不同的队列。只不过Topic类型Exchange 可以让队列在绑定Routing key 的时候使用**通配符**！ 

```java
  
//生产者
    @Test
    public void testTopicExchange() {
        //参数1：交换机名称,参数2：routingKey自定义相当于唯一标识，参数3：消息内容
        rabbitTemplate.convertAndSend("amq.topic", "beijing.news", "Hello amq.topic beijing.news");
        rabbitTemplate.convertAndSend("amq.topic", "beijing.video", "Hello amq.topic 			           beijing.video");
        rabbitTemplate.convertAndSend("amq.topic", "shanghai.news", "Hello amq.topic             		shanghai.news");
    }



	/**
	 * 消费者
     * topic 通配符
     * @param message
     */
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "topic.queue01"),
            exchange = @Exchange(name = "amq.topic", type = ExchangeTypes.TOPIC),
            key = "beijing.#"
    ))
    public void topicQueueListener01(String message){
        System.out.println("消费者01接收到topic.queue01的消息：" + message);
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "topic.queue02"),
            exchange = @Exchange(name = "amq.topic", type = ExchangeTypes.TOPIC),
            key = "#.news"
    ))
    public void topicQueueListener02(String message){
        System.out.println("消费者02接收到topic.queue02的消息：" + message);
    }
```

# 手动ACK

要在消息消费之后才告诉 rabbitmq 这个消息消费了，而不是还没消费就确认。避免消息消费失败了但是消息已经被自动确认了，那么这个消息就相当于丢了即丢失消息

配置：

```yml
spring:
  rabbitmq:
    host: 192.168.100.60
    port: 5672
    virtual-host: /test
    username: test
    password: test
    listener:
      simple:
        prefetch: 1
        acknowledge-mode: manual #手动ack
```

具体实现：

```java
@RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "topic.queue02"),
            exchange = @Exchange(name = "amq.topic", type = ExchangeTypes.TOPIC),
            key = "#.news"
    ))
/**
 * 第一个参数消息
 */
    public void topicQueueListener02(String msg, Message message,Channel channel) throws IOException {
        System.out.println("消费者02接收到topic.queue02的消息：" + msg);
        channel.basicAck(message.getMessageProperties().getDeliveryTag(),false);
    }
```

# 消息可靠性

从生产者发送消息到交换机，交换机发送到消息队列，消息队列发送消息到消费者之间都可能出现问题，

**从生产者发送到交换机：** 可以用事务解决不过效率太低，也可以用confirm机制解决，配置后生产者发送消息后可以以回调的方式确定消息是否发送到交换机

**从交换机发送到消息队列:** 可以使用return机制，配置后当交换机发送消息到消息队列失败时会回调失败的方法

**从消息队列到消费者：** 可以使用手动ack告诉消息队列消费完成，消息队列就会将这条消费完成的消息进行移除

# 避免消息重复消费

当我们手动ack时网路中断等一系列原因导致手动ack失败，消息队列不知道该消息是否消费，就可能再次请求消费，导致了重复消费，重复消费也会给非幂等操作造成影响

**解决方案: **为了解决消息重复消费的问题，可以采用Redis，在消费者消费消息之前，现将消息的id放到Redis中，

id-0（正在执行业务）

id-1（执行业务成功）

如果ack失败，在RabbitMQ将消息交给其他的消费者时，先执行setnx，如果key已经存在，获取他的值，如果是0，当前消费者就什么都不做，如果是1，直接ack。

极端情况：第一个消费者在执行业务时，出现了死锁，在setnx的基础上，再给key设置一个生存时间。



#  TTL

Time to live 过期时间 设置消息的过期时间 有两种方式

1. 指定一条消息的过期时间
2. 给队列设置消息过期时间，队列中所有的消息都有同样的过期时间

细节： 过期时间 指的是 消息在 队列中的存活时间，所以 此时 为了看到效果 不用设置消费者监听队列 一直消费消息，如果 一直监听队列 消费消息的话 就看不到消息过期之后 消息从队列中消失的的效果了

# 死信队列

当消息成为Deadmessage后，可以被重新发送到另一个交换机，这个交换机就是DLX

当发生消息被消费者使用

1.basic.reject或basic.nack方法并且requeue参数值设置为false的方式进行消息确认(negatively acknowledged) 

2.消息由于消息有效期过期

3.消息由于队列超过其长度限制而被丢弃

注意，队列的有效期并不会导致其中消息过期

# 延迟队列

延时队列，首先，它是一种队列，队列意味着内部的元素是有序的，元素出队和入队是有方向性的，元素从一端进入，从另一端取出。

其次，延时队列，最重要的特性就体现在它的延时属性上，跟普通的队列不一样的是，普通队列中的元素总是等着希望被早点取出处理，而延时队列中的元素则是希望被在指定时间得到取出和处理，所以延时队列中的元素是都是带时间属性的，通常来说是需要被处理的消息或者任务。

简单来说，延时队列就是用来存放需要在指定时间被处理的元素的队列。

> **延迟队列的实现方式：**

1，利用TTL+死信队列

生产者生产一条延时消息，根据需要延时时间的不同，利用不同的routingkey将消息路由到不同的延时队列，每个队列都设置了不同的TTL属性，并绑定在同一个死信交换机中，消息过期后，根据routingkey的不同，又会被路由到不同的死信队列中，消费者只需要监听对应的死信队列进行处理即可。

2利用插件实现

#  MQ的应用场景

**异步处理**

**应用解耦**

**流量削峰**

