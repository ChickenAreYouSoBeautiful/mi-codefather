# Github Action 自动部署项目
1): 在目录下创建.github/workflows目录并在目录下创建一个随意名称的.yml文件。例如 xx.yml

![image](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/common/image.70a7cc2qqz.jpg)

2): 增加配置
~~~yaml
name: 部署前端项目

# 只有master分支发生push主分支或pull_request(合并等)关闭后事件时，才会触发workflow
on:
  push:
    branches:
      # 你的主分支名
      - master
  pull_request:
    branches:
      # 你的主分支名
      - master
    types:
      - closed
jobs:
  build:
    # runs-on 指定job任务运行所需要的虚拟机环境(必填字段)
    runs-on: ubuntu-latest
    steps:
      # 获取源码
      - name: 迁出代码
        # 使用action库  actions/checkout获取源码
        uses: actions/checkout@v3

      # 安装Node10
      - name: 安装node.js
        # 使用action库  actions/setup-node安装node
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'

      # 安装依赖
      - name: 安装依赖
        run: npm install

      # 打包
      - name: 打包
        run: npm run docs:build

      # 上传华为云
      - name: 发布项目
        uses: easingthemes/ssh-deploy@main
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: "-rltgoDzv  -i --delete"
          SOURCE: ".vuepress/dist/"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_TARGET }}
          # 排除项
          EXCLUDE: "/dist/, /node_modules/"
~~~

3): 前往github的代码仓库内配置变量

![image](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/common/image.9nznmdfs8e.png)

- SSH_PRIVATE_KEY ：SSH登录密钥
- REMOTE_HOST：服务器IP地址，例如 127.0.0.1
- REMOTE_USER：连接服务器用户，例如 root
- REMOTE_TARGET：项目的资源目录，例如www/root/codefather

4)：配置完成后，推送到主分支或pull request 就会自动执行部署。