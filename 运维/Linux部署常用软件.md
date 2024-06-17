# Linux部署常用软件和命令

## 操作系统

服务：华为云

系统： CentOS7.9

## MySQL

[MySQL :: Download MySQL Community Server (Archived Versions)](https://downloads.mysql.com/archives/community/) 

选择你想要安装的包。

### **安装方式**

1. rpm 包安装：最为简单，但不灵活，适合初学者使用。
2. 二进制包（binary package）：也称归档包（archive），编译好的源码包，比 rpm 包更灵活。个人认为是安装多个服务最佳选择。
3. 源码包（source package）：最灵活，可根据需求编译安装功能，难易度最高。
4. docker 形式安装：其实是在容器中安装

### 安装

我下载使用的是 mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar 

链接： https://downloads.mysql.com/archives/get/p/23/file/mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar

```bash
#解压rom
tar xvf mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar
#安装依赖（需要依赖rpm -ivh mysql-community-devel-8.0.28-1.el7.x86_64.rpm，失败后可以试试）
yum install openssl-devel 

#按照顺序安装！
rpm -ivh mysql-community-common-8.0.28-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-plugins-8.0.28-1.el7.x86_64.rpm 
rpm -ivh mysql-community-libs-8.0.28-1.el7.x86_64.rpm
rpm -ivh mysql-community-devel-8.0.28-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-compat-8.0.28-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-8.0.28-1.el7.x86_64.rpm
rpm -ivh mysql-community-icu-data-files-8.0.28-1.el7.x86_64.rpm 
rpm -ivh mysql-community-server-8.0.28-1.el7.x86_64.rpm

#可以通过指令升级现有软件及系统内核
yum update
```

**经验： 一定要会看报错信息啊！！！**

我遇到的错大多都是没有依赖，根据指引直接yum下载就行

遇到部分error也可以百度出来

### 启动服务

```bash
#查看mysql状态
systemctl status mysqld  

#启动mysql
systemctl start mysqld

#开启自启
systemctl enable mysqld

#查看已启动的服务
netstat -tunlp

#查看密码
cat /var/log/mysqld.log                 				（不是你的！）我的临时密码：g7&r%DH6VUrI

#登录mysql(输入密码为了安全不会显示出来)
mysql -uroot -p

#修改密码（修改策略之前必须先修改一次密码,下边示例）
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Mi337256...';

# 设置密码策略
set global validate_password.policy=0;

#设置密码长度
set global validate_password.length=4;

#修改密码
ALTER USER 'username'@'localhost' IDENTIFIED BY 'you password';

#退出mysql
quit

```

### 远程连接

查看你的服务器是否将mysql的运行端口是否开放，在服务器安全组里查看并配置。

找不到的自行百度很好搜~

**MySQL开放权限**
为了方便我使用的是root用户实际情况root不应该开启远程连接。你可以再创建一个用户再进行分配权限。

查看所有用户的权限

```sql

select host, user, authentication_string, plugin from user;

```

授权root角色的所有权限并设置远程访问

```sql
GRANT ALL ON *.* TO 'root'@'%';
```

**如果提示**

![1713835469408](C:\Users\mi11\AppData\Local\Temp\1713835469408.png)

执行：

```sql
update user set host='%' where user='root'; 
```

**执行两次！**

```sql
GRANT ALL ON . TO 'root'@'%'; 
```

刷新权限

```sql

GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' IDENTIFIED BY 'Mi337256' WITH GRANT OPTION;

show grants for root@127.0.0.1;

flush privileges;
```

### 常用命令

```bash
# mysql登录密码
Mi337256
# 查看mysql状态
systemctl status mysqld               
# 创建用户
CREATE USER 'userMI'@'localhost' IDENTIFIED BY 'Mi337256';
# 设置用户权限
GRANT ALL PRIVILEGES ON *.* TO 'userMI'@'localhost' WITH GRANT OPTION;

```

## Nginx

### 安装

安装编译工具

```bash
yum -y install make zlib zlib-devel gcc-c++ libtool openssl openssl-devel
```

安装RCRE:

PCRE作用是让Nginx支持Rewrite功能。 

下载地址 http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz 

解压安装包

```bash
tar zxvf pcre-8.35.tar.gz
```

进入解压后的文件件

```bash
cd pcre-8.35
```

编译安装

~~~bash
#编译
./configure
#安装
make && make install
~~~

查看版本确认安装

~~~bash
pcre-config --version
~~~

下载Nginx安装包

Nginx官网：<http://nginx.org/> 

下载地址：<http://nginx.org/en/download.html> 

下载（推荐）：<http://nginx.org/download/nginx-1.22.1.tar.gz> 

解压安装包

~~~bash
#解压
tar -zxvf 文件名
#进入目录
cd 文件名
#编译并启用ssl
/configure --with-http_ss1_module --with-http_v2_module --with-stream
#安装
make && make install

~~~

### 配置环境变量

~~~bash
vim /etc/profile  

在最后一行增加

export PATH=$PATH:/usr/local/nginx/sbin

刷新配置文件

source /etc/profile

~~~

### 启动

~~~bash
nginx

查看运行的服务

netstat -ntlp

查看服务情况

ps -ef | grep nginx

~~~

## JDK

下载链接：[Java Downloads | Oracle 中国](https://www.oracle.com/cn/java/technologies/downloads/) 

安装你想要的版本，我安装的是 jdk-8u401-linux-x64.tar.gz  

### 安装

~~~bash
#解压jdk压缩包
tar -xvf jdk-8u401-linux-x64.tar.gz 
~~~

### 配置环境变量

~~~bash
编辑配置文件
vim /etc/profile

配置到文件最后一行
export PATH=$PATH:你解压后进入解压文件的bin目录路径
例：export PATH=$PATH:/apps/java/jdk1.8.0_401/bin
~~~



验证安装

~~~bash
java -version
~~~

## 宝塔Linux

宝塔是一个运维数据看板可以帮我们更便捷的安装和维护服务，在官网下载，有教程。

我使用的是华为云的服务器，可以直接切换镜像，没有下载教程。

安装好后记得打开防火墙或配置安全组开放8888端口，因为宝塔的可视化页面需要用到。

查看浏览路径和账号密码

~~~bash
/etc/init.d/bt default
~~~

复制初始代码登录不上的话试试，先修改密码后再登录。

~~~bash
bt 5
~~~

## 踩坑

**宝塔登录问题**

​	起因是第一次体验宝塔登录时，新用户送了一个月的ssl想着反正是免费送的就开了。然后第项目部署好后很长一段时间就没管过了。今天想访问部署新项目时发现登录不上去了,满脑子？？？

​	我对宝塔也不是很熟，只能疯狂百度，找了半天才找到这个原因。就是：开启了这个SSL。

​	宝塔Linux面板中有个【面板SSL】功能，能够让管理员通过https访问面板后台，使用加密传输你的面板操作数据。是个很不错的功能，非常建议大家打开。

​	但是很多新手不懂或者好奇，点开了误操作会导致无法登录后台了！非常尴尬~

**官方给出的方案，SSH登录服务器，以命令行方式运行一下命令（删除ssl配置信息并重启）**

```bash
rm -f /www/server/panel/data/ssl.pl && /etc/init.d/bt restart
```

## Docker

docker是一个容器服务技术，他主要提供以下服务

容器化：

容器就像一个小型的服务器，我们可以将我们的服务和服务所依赖的环境一起打包成一个容器，当我们运行这个容器时他会自动帮助我们运行容器里的服务。

快速部署，可移植：

我们的容器可以制作为一个镜像，放到远程的仓库。在需要使用时可以使用命令进行拉取，拉去下来就可以直接运行。

构建容器

给项目增加DockerFile文件，来定义构建的命令

前端：

~~~bash
//根据当前目录下的Dockerfile构建容器,name =  user-center-frontendv0.0.1 
docker build -t user-center-frontendv0.0.1 .
//运行容器
docker run -p 80:80 -d user-center-frontendv0.0.1 
~~~

后端：

~~~bash
//根据当前目录下的Dockerfile构建容器,name = friend-backendv0.0.1
docker build -t  friend-backendv0.0.1 .
//运行容器
docker run -p 8082:8082 -d  friend-backendv0.0.1

~~~



## 域名绑定

前端项目：

用户输入网址 => 域名解析服务器 => 服务器 => nginx找到对应文件 => 前端加载渲染

后端项目：

用户输入网址 => 域名解析服务器 => 服务器 => nginx接收请求  转发到后端项目


# SDK优化

目前请求地址写死在sdk常量中，

优化： 管理员维护接口信息时维护访问地址和