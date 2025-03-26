# Docker
## 简介
Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器或 Windows 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。
## 安装
### Ubuntu
```shell
sudo apt-get update
sudo apt-get install docker.io
```
### CentOS
```shell
sudo yum install docker
```
## 常用命令
### 镜像
```shell
docker images # 查看本地镜像
docker search <image> # 搜索镜像
docker pull <image> # 拉取镜像
docker rmi <image> # 删除镜像
```
### 容器
```shell
docker run <image> # 运行容器
docker ps # 查看运行中的容器
docker ps -a # 查看所有容器
docker stop <container> # 停止容器
docker start <container> # 启动容器
docker restart <container> # 重启容器
docker rm <container> # 删除容器
docker exec -it <container> /bin/bash # 进入容器
```
### 网络
```shell
docker network create <network> # 创建网络
docker network ls # 查看网络
docker network inspect <network> # 查看网络详情
docker network rm <network> # 删除网络
```
### 数据卷
```shell
docker volume create <volume> # 创建数据卷
docker volume ls # 查看数据卷
docker volume inspect <volume> # 查看数据卷详情
docker volume rm <volume> # 删除数据卷
```
### 容器日志
```shell
docker logs <container> # 查看容器日志
```
### 容器端口映射
```shell
docker run -p <host_port>:<container_port> <image> # 容器端口映射
```
### 容器环境变量
```shell
docker run -e <key>=<value> <image> # 容器环境变量
```
### 容器挂载数据卷
```shell
docker run -v <host_path>:<container_path> <image> # 容器挂载数据卷
```
## Dockerfile
Dockerfile 是一个文本文件，其中包含了一系列的指令，用于构建 Docker 镜像。Dockerfile 中的指令按照顺序执行，每一条指令都会创建一个新的镜像层，并提交到镜像历史中。Dockerfile 中的常用指令包括：
- FROM：指定基础镜像
- RUN：执行命令
- CMD：容器启动时执行的命令
- ENTRYPOINT：容器启动时执行的命令
- ENV：设置环境变量
- ADD：复制文件到容器
- COPY：复制文件到容器
- VOLUME：创建数据卷
- EXPOSE：暴露端口
- WORKDIR：设置工作目录
- USER：设置用户
- ARG：定义参数
### 示例
```dockerfile
FROM ubuntu:latest
RUN apt-get update && apt-get install -y nginx
CMD ["nginx", "-g", "daemon off;"]
```
## Docker Compose
Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。使用 Docker Compose，你可以使用 YAML 文件来定义你的应用程序的服务，然后使用一个命令来启动和停止所有服务。Docker Compose 的常用命令包括：
- up：启动所有服务
- down：停止并删除所有服务
- ps：查看所有服务
- logs：查看所有服务的日志
- exec：在服务中执行命令
- scale：设置服务的副本数
- stop：停止服务
- start：启动服务
- restart：重启服务
- rm：删除服务
- pull：拉取服务镜像
- build：构建服务镜像
- create：创建服务
- run：运行服务
- kill：杀死服务
- pause：暂停服务
- unpause：取消暂停服务
- top：查看服务进程
### 示例
```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
    environment:
      FLASK_ENV: development
  redis:
    image: "redis:alpine"
```