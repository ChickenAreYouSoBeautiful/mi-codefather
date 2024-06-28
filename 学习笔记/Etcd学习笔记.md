# Etcd学习笔记

## 简介

​	Etcd是一个Go语言实现的，开源的，分布式键值存储系统，它主要用于分布式系统的服务发现，配置管理和分布式锁的场景。由于Etcd是Go语言实现，所以他的性能也是比较高的，除了性能Etcd还采用了Raft一致性算法来保证数据的一致性和可靠性。并且Etcd入门成本极低。只要学过Redis，Zookeeper或对象存储种的一个，就能够很快理解并投入实战。

## Etcd的数据结构

Etcd在其数据模型和组织结构上更接近于对象存储，它使用层次化的键值来存储数据，支持类似于文件系统的层次结构，能灵活的单key查询，按前缀查询，按范围查询。

**核心数据结构**

1) Key （键）： Etcd种的基本单元，类似于文件名，每个键都唯一标识一个值，并且可以包含子键，形成类似于路径的层次感

2) Value （值）：与键关联的数据，可以是任意类型，通常是字符串类型。

**特性**

1）Lease（租约）：用于对键值设置TTL超时时间，当租约过期时，相关的键值对将被自动删除。

1）Watch（监听）：可以监听指定键的变化，当键的值发生变化时，会出发相应通知。

**数据一致性**

从表层来说，Etcd支持事务操作，能够保证数据一致性。

从底层来说，Etcd使用Raft一致性算法来保证数据的一致性。

​	具体来说，Raft算法通过选举机制选举一个领导者节点，领导者负责接收客户端的写请求，并将写请求复制到其他节点上。当客户端发送写请求时，领导者节点会将写操作记录到自己的日志中，并将写操作的日志条目分发给其他分节点，其他节点接收后也将其写在自己的日志中。当大多数节点都写入到自己的日志中，改日志条目就被视为已提交，之后领导者节点发送成功响应给客户端，成功之后，写操作被视为已提交，从而保证数据的一致性。

​	如果领导者节点失去联系，Raft算法也会再其他节点中重新选举一个领导者节点，从而保证系统的可用性和一致性。

## 下载Etcd

从Github下载：  [Release v3.5.14 · etcd-io/etcd (github.com)](https://github.com/etcd-io/etcd/releases/tag/v3.5.14) 

找到自己的系统版本下载即可。

**安装完成之后会有三个脚本**

1）etcd：etcd服务本身

2）etcdctl：客户端用于操作etcd

3）etcdutl：备份恢复工具

**Etcd可视化工具**

推荐：安装方便，学习成本低。

EtcdKeeper:  [evildecay/etcdkeeper: web ui client for etcd (github.com)](https://github.com/evildecay/etcdkeeper?tab=readme-ov-file) 

![image](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/common/image.6f0jsmy5s7.png)

安装之后默认8080端口启动

![image](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/common/image.1zi4ndmy2c.jpg)

## Etcd java 客户端

所谓客服端就是操作Etcd的工具

etcd主流的java客户端是jetcd: [etcd-io/jetcd: etcd java client (github.com)](https://github.com/etcd-io/jetcd) 

注意jdk版本要大于11

## Demo

1)：项目中引入jetcd

~~~xml
 <!-- jetcd -->
            <dependency>
                <groupId>io.etcd</groupId>
                <artifactId>jetcd-core</artifactId>
                <version>${jetcd-version}</version>
            </dependency>
~~~

2)：官方文档的示例

~~~java

/**
 * @author mi11
 * @version 1.0
 * @project jetcd-demo
 * @description
 * @ClassName EtcdRegistry
 */
public class EtcdRegistry {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // create client using endpoints
        Client client = Client.builder().endpoints("http://localhost:2379").build();

        KV kvClient = client.getKVClient();
        ByteSequence key = ByteSequence.from("test_key".getBytes());
        ByteSequence value = ByteSequence.from("test_value".getBytes());

// put the key-value
        kvClient.put(key, value).get();

// get the CompletableFuture
        CompletableFuture<GetResponse> getFuture = kvClient.get(key);

// get the value from CompletableFuture
        GetResponse response = getFuture.get();

// delete the key
        kvClient.delete(key).get();

    }
}

~~~

上述代码中，我们利用KvClient来操作etcd的写入和读取数据，除了KvClient客户端外，还提供了很多其他的客户端

![image](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/common/image.2h86c0216a.jpg)

1）KvClient：用于对etcd中的键值进行操作，可以通过该客户端进行设置，获取，删除值和列出目录等操作。

2）leaseClient：用于管理etcd的租约机制，为键值对分配生存时间，并在租约到期之后自动删除相关键值对。通过leaseClient可以创建，获取，续约和撤销租约。

3）watchClient：用于监视etcd中键的变化，并在键的值发生变化时接收通知。

4）clusterClient：用于与etcd集群进行交互，包括添加、移除、列出成员、设置选举、获取集群的健康状态、获取成
员列表信息等操作。

5）authClient：用于管理etcd的身份验证和授权。通过authClient可以添加、删除、列出用户、角色等身份信息，以
及授予或撤销用户或角色的权限。

6）maintenanceClient：用于执行etcd的维护操作，如健康检查、数据库备份、成员维护、数据库快照、数据库压缩
等。

7）lockClient：于实现分布式锁功能，通过lockClient可以在etcd上创建、获取、释放锁，能够轻松实现并发控
制。

8）electionClient：用于实现分布式选举功能，可以在etcd上创建选举、提交选票、监视选举结果等。