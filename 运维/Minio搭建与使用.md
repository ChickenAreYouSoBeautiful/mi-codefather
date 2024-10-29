# MinIO的搭建与使用

## MinIO

MinIO是基于Go语言开发的高性能分布式存储系统，客户端指出Java，Net，Python，Javascript，Golong语言。

MinIO的主要目标是作为私有云对象存储的标准化方案，非常适用于存储大容量非结构化的数据，例如，图片，视频，日志文件，备份数据，容器和虚拟机镜像等，文件可以是任意大小，从几KB到5T。

本文将介绍Docker快速搭建一个MinIO服务。

## 使用Docker部署MinIO服务

官方文档：

[单节点单硬盘部署MinIO — MinIO中文文档 | MinIO Container中文文档](https://www.minio.org.cn/docs/minio/container/operations/install-deploy-manage/deploy-minio-single-node-single-drive.html) 

注：命令前的`$`符号只是表示为一行命令,执行时不要携带

下载镜像：

~~~bash
$ docker pull quay.io/minio/minio
~~~

创建数据卷目录，提升权限

~~~bash
$ mkdir -p /minio/data
$ chmod -R 777 /minio/data
~~~

使用镜像创建容器

~~~bash
$ docker run -p 9000:9000 -p 9001:9001 \
-d --restart=always \
-e "MINIO_ACCESS_KEY=admin" \
-e "MINIO_SECRET_KEY=password" \
-v /minio/data:/data \
-v /minio/config:/root/.minio \
quay.io/minio/minio server \
/data \
--console-address ":9001" 

~~~

参数说明：

- `-p 9000:9000 -p 9001:9001`: 这些选项将容器内的端口映射到宿主机的端口。`-p 9000:9000` 将容器的 9000 端口映射到宿主机的 9000 端口，用于 MinIO 的 API 服务。`-p 9001:9001` 将容器的 9001 端口映射到宿主机的 9001 端口，用于 MinIO 的控制台访问。
- `-d`: 表示容器将以“分离模式”（detached mode）运行，即在后台运行。
- `--restart=always`: 这个选项设置容器的重启策略为“总是重启”。这意味着如果容器因为任何原因停止（除了被明确停止或 Docker 本身停止），它会自动重新启动。
- `-e "MINIO_ACCESS_KEY=admin"`: 设置环境变量 `MINIO_ACCESS_KEY`，这是 MinIO 服务器的访问密钥（Access Key）。在这个例子中，它被设置为 `admin`。
- `-e "MINIO_SECRET_KEY=password"`: 设置环境变量 `MINIO_SECRET_KEY`，这是 MinIO 服务器的秘密密钥（Secret Key）。在这个例子中，它被设置为 `password`。这两个密钥用于认证 API 请求。
- `-v /minio/data:/data`: 这将宿主机的 `/minio/data` 目录挂载到容器内的 `/data` 目录。MinIO 将在这个目录中存储数据。注意，这里与原始命令中的 `/data/minio` 有所不同。
- `-v /minio/config:/root/.minio`: 这将宿主机的 `/minio/config` 目录挂载到容器内的 `/root/.minio` 目录。MinIO 可能会在这个目录中存储配置信息。这通常不是必需的，除非你有特定的配置需要持久化。
- `quay.io/minio/minio`: 这是 MinIO Docker 镜像的仓库地址和名称。在这个例子中，它位于 Quay.io 仓库中。
- `server /data --console-address ":9001"`: 这是传递给 MinIO 服务器的命令和参数。`server` 命令启动 MinIO 服务器，`/data` 指定数据目录（这里应该与 `-v` 选项中的容器内路径一致），`--console-address ":9001"` 指定控制台服务的监听地址和端口。

查看容器运行状态：

~~~bash
$ docker ps
~~~

访问主机下的9001端口 例如 http://localhost:9001，就可以进入MinIO的控制台了。

## 使用Java客户端访问Minio



