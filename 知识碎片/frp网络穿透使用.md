# frp网络穿透使用

项目地址：[frp项目地址](https://github.com/fatedier/frp)

官方使用文档：[frp使用文档](https://gofrp.org/zh-cn/)

推荐先看官方文档的安装和快速入门

版本： 0.61.1

## 基本概念

frp是通过客户端和服务端配合使用，下载后解压会得到`frpc`和`frps`的启动脚本和`.toml`结尾的配置文件。

![18856a27-3c0e-4690-8c01-dd780e56df68](https://cdn.jsdelivr.net/gh/ChickenAreYouSoBeautiful/ruizhi-cloud-imgs/document/18856a27-3c0e-4690-8c01-dd780e56df68.png)

**被映射 == 本地电脑  ，映射 ==  服务器**

在被映射的电脑上运行frpc，在映射的电脑上运行frps。

配置文件参考官方使用文档，下面给出基本示例

## 配置示例

**frpc.toml**

```toml
serverAddr = "120.46.54.54"   
serverPort = 7000      	      
auth.token = "aaa"		
# 端口映射，可写多个映射多端口
[[proxies]]         #映射 120.46.54.54:8085  -->  127.0.0.1:8000
name = "xxx"     # name 随便
type = "tcp"  	 # 映射类型，参考官方文档
localPort = 8000  # 本地端口
localIP = "127.0.0.1"  #本地ip
remotePort = 8085  	 #映射端口
 
[[proxies]]   #映射 120.46.54.54:8082  -->  127.0.0.1:8082
name = "xxx"
type = "tcp"
localPort = 8082
localIP = "127.0.0.1"
remotePort = 8082
```

**frps.toml**

```toml
# frp服务端监听端口
bindPort = 7000
vhostHTTPPort = 8081

# 客户端需要配置对应的token才允许映射
auth.token = "aaa"

#仅允许服务器上的指定端口/端口范围 避免滥用端口
allowPorts = [
  # 范围指定
  { start = 8081, end = 8085},
  # 单独指定
  { single = 8101i},
]

# 默认为 127.0.0.1，如果需要公网访问，需要修改为 0.0.0.0。
webServer.addr = "0.0.0.0"
webServer.port = 7500
# dashboard 用户名密码，可选，默认为空
webServer.user = "admin"
webServer.password = "admin"
```

## 运行

启动命令

```shell
.\frps -c frps.toml
```

我这边是将frps设置为linux的系统服务。

启动命令：

```shell
systemctl start frps.service
```

设置为linux系统服务

```bash
vim /etc/systemd/system/frps.service
```

写入配置：

**注意ExecStart其实还是运行的.\frps -c frps.toml。 所以需要替换为你们自己的安装路径**

```shell
[Unit]
Description=Frps Server
After=network.target

[Service]
Type=simple
ExecStart=/root/apps/frps/frp_0.61.1_linux_amd64/frps -c /root/apps/frps/frp_0.61.1_linux_amd64/frps.toml
Restart=always
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

