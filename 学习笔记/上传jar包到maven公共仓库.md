# 上传jar包到maven公共仓库

**参考官方文档**

[Register to Publish Via the Central Portal - Documentation (sonatype.org)](https://central.sonatype.org/register/central-portal/#prerequisites) 

## 生成用户Token名称和密码

打开网址：

https://central.sonatype.com/

Sign in 登录（推荐github授权登录，比较方便）

点击个人头像下拉列表中View Account 进入创建token页面生成token，点击生成后一分钟后会自动关闭页面，需要及时复制下来。

例如：

<server>
	<id>${server}</id>
	<username>PjuxZmUv</username>
	<password>InGwB3PvIK1ja5MXnL15cbSQN3qaJEOZUhWf74hQrymN</password>
</server>

## 创建GPG密钥

确保您已经安装了GPG工具。如果没有，请访问[GnuPG官方网站](https://gnupg.org/download/)下载并安装。 

推荐下载

![image](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/上传jar包到maven仓库/image.8vmrqckowz.jpg)

使用可视化工具或使用命令行生成

命令行生成密钥（到bin目录下执行命令）

​	生成时会让你指定key，邮箱地址，**密码**需要记录下来，后面会用到。

```bash
gpg --gen-key
```

查看密钥

```bash
gpg --list-keys
```

将公钥上传到公钥服务器上

~~~bash
gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID
~~~

根据密钥

生成GPG密钥密码：Mi337256

设置maven的settings配置

## 配置maven

​	配置maven的settings.xml配置文件（文件位置在conf目录下）。

修改：

~~~xml
<server>
    <id>ossrh</id>
    <username>上边生成的token名称</username>
    <password>上边生成的token密码</password>
</server>
~~~

## 配置pom.xml

~~~xml
 <properties>
        <java.version>1.8</java.version>
        <projectUrl>https://github.com/xxx/xxx.git</projectUrl><!--配置GitHub项目地址 -->
        <serverId>ossrh</serverId><!-- 服务id 也就是setting.xml中的servers.server.id -->
 </properties>

 <!--以下部分内容不需要修改，直接复制咱贴即可-->
    <url>${projectUrl}</url>
    <licenses>
        <license>
            <name>The Apache Software License, Version 2.0</name>
            <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
            <distribution>repo,manual</distribution>
        </license>
    </licenses>
    <scm>
        <!-- 采用projectUrl变量代替这个值，方便给重复利用这个配置，也就是上面的标签替换一下值就行 -->
        <developerConnection>${projectUrl}</developerConnection>
        <connection>${projectUrl}</connection>
        <url>${projectUrl}</url>
    </scm>
    <distributionManagement>
        <snapshotRepository>
            <!--这个id和settings.xml中servers.server.id要相同，因为上传jar需要登录才有权限-->
            <id>${serverId}</id>
            <name>OSS Snapshots Repository</name>
            <url>https://s01.oss.sonatype.org/content/repositories/snapshots/</url>
        </snapshotRepository>
        <repository>
            <!--这个id和settings.xml中servers.server.id要相同，因为上传jar需要登录才有权限-->
            <id>${serverId}</id>
            <name>OSS Staging Repository</name>
            <url>https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/</url>
        </repository>
    </distributionManagement>

    <!--填入开发者信息，姓名、邮箱、项目地址-->
    <developers>
        <developer>
            <name>xxx</name>
            <email>xxx@qq.com</email>
            <roles>
                <role>Developer</role>
            </roles>
            <url>${projectUrl}</url>
            <!--			<timezone>+8</timezone>-->
        </developer>
    </developers>



<build>
        <plugins>
            <!-- 编译插件，设置源码以及编译的jdk版本 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>8</source>
                    <target>8</target>
                </configuration>
            </plugin>
            <!--打包源码的插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>2.2.1</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>2.9.1</version>
                <configuration>
                    <!-- 忽略生成文档中的错误 -->
                    <additionalparam>-Xdoclint:none</additionalparam>
                    <aggregate>true</aggregate>
                    <charset>UTF-8</charset><!-- utf-8读取文件 -->
                    <encoding>UTF-8</encoding><!-- utf-8进行编码代码 -->
                    <docencoding>UTF-8</docencoding><!-- utf-8进行编码文档 -->
                </configuration>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!--公钥私钥插件，也就是上传需要进行验证用户名和密码过程中需要用到的插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>1.5</version>
                <executions>
                    <execution>
                        <id>sign-artifacts</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!--部署插件-->
            <plugin>
                <groupId>org.sonatype.central</groupId>
                <artifactId>central-publishing-maven-plugin</artifactId>
                <version>0.4.0</version>
                <extensions>true</extensions>
                <configuration>
                    <publishingServerId>${serverId}</publishingServerId>
                    <tokenAuth>true</tokenAuth>
                    <autoPublish>false</autoPublish>
                </configuration>
            </plugin>
        </plugins>
    </build>
~~~

## 部署

执行命令

~~~bash
mvn deploy
~~~

执行成功后访问maven中央仓库：https://central.sonatype.com/

点击访问publish查看部署状态并publish 

成功后就可以引入maven坐标就可以远程下载了。



## 遇到的问题

### 插件爆红

解决1 ：手动下载依赖

mvn dependency:get -DrepoUrl=http://repo.maven.apache.org/maven2/ -Dartifact="org.sonatype.plugins:nexus-staging-maven-plugin:1.6.7"

解决2： 更新依赖，视网速情况5-10min
![1718346177752](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/上传jar包到maven仓库/1718346177752.6bgxdpone7.jpg)

### 执行mvn deploy 报错 401

1. 检查pom和settings中配置的serverId是否一致。

2. 生成的用户token是否有效。（不确定建议清理token后，重新生成配置。）

   ![1718347731326](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/上传jar包到maven仓库/1718347731326.6pnd4kxnrr.jpg)