## API开放平台使用说明

网站地址：http://120.46.54.54:9002/

### 项目介绍

MiApi开放平台是一个基于后端SpringBoot + 前端Ant design pro脚手架搭建的Api开放平台，用户可以在线调用测试接口或者通过mi币来调用开放的接口，快速集成接口功能。

### 如何使用

快速引入miapi-client-sdk调用MiApi开放平台接口的接口

### SDK调用demo

Github地址 https://github.com/ChickenAreYouSoBeautiful/Mi-Api-SDK-Demo

## 快速启动

1）引入依赖

~~~xml
<dependency>
    <groupId>io.github.chickenareyousobeautiful</groupId>
    <artifactId>miapi_client_sdk</artifactId>
    <version>0.0.1</version>
</dependency>
~~~

2）获取AccessKey和SecretKey

登录MiApi开放平台，注册后会分配一个唯一的AccessKey和SecrteKey。 访问个人中心复制AccessKey和SecrteKey。

![image](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/MI-API-SDK-Demo/image.13ln0lrga5.png)

3）配置AccessKey和SecrteKey

在你的application中配置

yml方式：

~~~yml
miapi:
  client:
    access-key: you-AccessKey
    secret-key: you-SecrteKey
~~~

properties方式：

~~~properties
miapi.client.access-key=you-AccessKey
miapi.client.secret-key=you-SecrteKey
~~~

3)如何使用？

配置好AccessKey和SecrteKey后，引入SDK包中的MIApiClient包就可以直接调用接口。

~~~java

/**
 * @author mi11
 * @version 1.0
 * @project MiApi-SDK-Demo
 * @description 测试SDK调用
 * @ClassName InvokeSdkController
 */
@RestController
@RequestMapping("/invoke")
public class InvokeSdkController {


    @Resource
    private MiApiClient miApiClient;

    /**
     *  获取名称
     * @param getNameRequest 名称
     * @return 响应
     */
    @GetMapping("/name")
    public BaseResponse<?> getName(GetNameRequest getNameRequest){

        return miApiClient.getName(getNameRequest);
    }


    /**
     * 根据ip获取ip信息
     * @param request request
     * @return 响应
     */
    @GetMapping("/ip")
    public BaseResponse<?> ipInfo(HttpServletRequest request){
        IpRequest ipRequest = new IpRequest();
        ipRequest.setIp("127.0.0.1");
        if (request != null){
            ipRequest.setIp(request.getRemoteAddr());
        }
        return miApiClient.ipInfo(ipRequest);
    }

    /**
     * 和AI一起讨论诗词歌赋
     * @param aiMessageRequest 参数对象
     * @return 响应
     */
    @PostMapping("/aiMessage")
    public BaseResponse<?> aiMessage(AiMessageRequest aiMessageRequest){
        return miApiClient.aiMessage(aiMessageRequest);
    }

    /**
     *  根据指定匹配字符串在字符串列表中，获取最相似的limit个字符串
     * @param getSimilarityRequest 参数对象
     * @return 响应
     */
    @PostMapping("/getSimilarity")
    public BaseResponse<?> getSimilarity(GetSimilarityRequest getSimilarityRequest){
        return miApiClient.getSimilarity(getSimilarityRequest);
    }
}
~~~

自行构建MiApiClient

~~~java
/**
     * 和AI一起讨论诗词歌赋
     * @param aiMessageRequest 参数对象
     * @param accessKey         accessKey
     * @param secretKey         secretKey
     * @param host              访问地址
     * @return 响应
     */
    @PostMapping("/newAiMessage")
    public BaseResponse<?> newAiMessage(AiMessageRequest aiMessageRequest,String accessKey,String secretKey,String host){
        MiApiClient miApiClient = newMiApiClient(accessKey,secretKey,host);
        return miApiClient.aiMessage(aiMessageRequest);
    }

    private MiApiClient newMiApiClient(String accessKey,String secretKey,String host){
	    //配置accessKey和secretKey
        MiApiClient miApiClient = new MiApiClient(accessKey, secretKey);
        AppServiceImpl appService = new AppServiceImpl();
        //设置服务请求地址
        appService.setHost(host);
        appService.setMiApiClient(miApiClient);
        //配置进策略环境
        BaseContext baseContext = new BaseContext();
        baseContext.setAppService(appService);
        //将环境放入MiApiClient后返回
        miApiClient.setBaseContext(baseContext);
        return miApiClient;
    }
~~~
