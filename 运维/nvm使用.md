# nvm使用

nvm是一个node.js的版本控制工具，当多个项目所需要的环境不同时可以帮助我们方便的切换node的版本。

~~~bash
nvm list available   #显示可下载版本的部分列表
nvm install latest   #安装最新版本 ( 安装时可以在上面看到 node.js 、 npm 相应的版本号 ，不建议安装最新版本)
nvm install 版本号    #安装指定的版本的 nodejs
nvm list 或 nvm ls	#查看目前已经安装的版本 （ 当前版本号前面没有 * ， 此时还没有使用任何一个版本，这时使用 node.js 时会报错 ）
nvm use     		#版本号 使用指定版本的 nodejs （ 这时会发现在启用的 node 版本前面有 * 标记，这时就可以使用 node.js ）


~~~

## nvm切换国内镜像

内镜像源, 在 [nvm](https://nvm.p6p.net/) 的安装路径下，找到 `settings.txt`文件，设置`node_mirror`与`npm_mirror`为国内镜像地址。下载就飞快了~~

在文件末尾加入：

### 阿里云镜像



```bash
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

### 腾讯云镜像



```bash
node_mirror: http://mirrors.cloud.tencent.com/npm/
npm_mirror: http://mirrors.cloud.tencent.com/nodejs-release/
```

命令行切换(注意：请切换国内镜像后再安装 node 版本，否则会很慢)

### 阿里云镜像



```bash
nvm npm_mirror https://npmmirror.com/mirrors/npm/
nvm node_mirror https://npmmirror.com/mirrors/node/
```

### 腾讯云镜像



```bash
nvm npm_mirror http://mirrors.cloud.tencent.com/npm/
nvm node_mirror http://mirrors.cloud.tencent.com/nodejs-release/
```

打开链接查看可以 node 版本：https://registry.npmmirror.com/binary.html?path=node/

## 卸载 / 删除

### 手动卸载

要手动删除 NVM，请执行以下操作：

首先，使用 `nvm unload` 从终端会话中移除 nvm 命令，并删除安装目录：

```bash
$ nvm_dir="${NVM_DIR:-~/.nvm}"
$ nvm unload
$ rm -rf "$nvm_dir"
```

编辑 `~/.bashrc`（或其他 shell 资源配置文件），并删除以下行：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[[ -r $NVM_DIR/bash_completion ]] && \. $NVM_DIR/bash_completion
```

通过以上步骤，你可以手动卸载 NVM。