# xxl-job使用

官网地址：https://www.xuxueli.com/xxl-job

**注意低版本慎用，低版本和高版本的差别较大并官方文档没有低版本教程。**

使用版本：2.5.0

## 概念

XXL-JOB是一个分布式任务调度平台，下载源码后分三个模块：

![image-20250311114946199](https://cdn.jsdelivr.net/gh/ChickenAreYouSoBeautiful/ruizhi-cloud-imgs/document/image-20250311114946199.png)

admin模块： xxl-job的调度中心

core模块：核心依赖

samples模块：示例

![image-20250311120224758](https://cdn.jsdelivr.net/gh/ChickenAreYouSoBeautiful/ruizhi-cloud-imgs/document/image-20250311120224758.png)

## 示例代码

[xxl-job: 一个分布式任务调度平台，其核心设计目标是开发迅速、学习简单、轻量级、易扩展。现已开放源代码并接入多家公司线上产品线，开箱即用。 - Gitee.com](https://gitee.com/xuxueli0323/xxl-job/tree/2.5.0/)



## 通过程序访问调度中心

```java
@Bean
public XxlJobManager xxlJobManager() {
    XxlJobManager xxlJobManager = new XxlJobManager();
    if (xxlJobManager.getCookie()) {
        xxlJobManager.setBaseUrl(adminAddresses);
    }
    return xxlJobManager;
}
```

```java
public class XxlJobManager {
    private static final Logger log = LoggerFactory.getLogger(XxlJobManager.class);
    private String cookie = "";


    private final OkHttpClient client = new OkHttpClient();

    public String getCookie() {
        return cookie;
    }

    public void setCookie(String cookie) {
        this.cookie = cookie;
    }

    public OkHttpClient getClient() {
        return client;
    }

    /**
     * 查询现有的任务（可以关注这个整个调用链，可以自己模仿着写其他的拓展接口）
     *
     * @param url
     * @param requestInfo
     * @return
     * @throws IOException
     */
    public JSONObject pageList(String url, JSONObject requestInfo) throws IOException {
        String path = "/xxl-job-admin/jobinfo/pageList";
        String targetUrl = url + path;
        RequestBody body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                requestInfo.toString()
        );

        Request request = new Request.Builder()
                .url(targetUrl)
                .addHeader("cookie", cookie)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            String responseData = response.body().string();
            JSONObject result = new JSONObject(Boolean.parseBoolean(responseData));
            System.out.println(result);
            return result;
        }
    }

    /**
     * 新增/编辑任务
     *
     * @param url
     * @param requestInfo
     * @return
     * @throws IOException
     */
    public JSONObject addJob(String url, JSONObject requestInfo) throws IOException {
        String path = "/xxl-job-admin/jobinfo/add";
        String targetUrl = url + path;
        FormBody.Builder builder =  new FormBody.Builder();
        requestInfo.forEach((key, value) -> builder.add(key, value.toString()));
        RequestBody body = builder.build();
        Request request = new Request.Builder()
                .url(targetUrl)
                .addHeader("cookie", cookie)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            String responseData = response.body().string();
            JSONObject result = JSONObject.parseObject(responseData);
            if (!result.getString("code").equals("200")){
                log.error("新增/编辑任务失败，原因：{}", result.getString("msg"));
                return null;
            }
            return result;
        }
    }

    /**
     * 删除任务
     *
     * @param url
     * @param id
     * @return
     * @throws IOException
     */
    public JSONObject deleteJob(String url, int id) throws IOException {
        String path = "/xxl-job-admin/jobinfo/delete?id=" + id;
        return doGet(url, path);
    }

    /**
     * 开始任务
     *
     * @param url
     * @param id
     * @return
     * @throws IOException
     */
    public JSONObject startJob(String url, int id) throws IOException {
        String path = "/xxl-job-admin/jobinfo/start?id=" + id;
        return doGet(url, path);
    }

    /**
     * 停止任务
     *
     * @param url
     * @param id
     * @return
     * @throws IOException
     */
    public JSONObject stopJob(String url, int id) throws IOException {
        String path = "/xxl-job-admin/jobinfo/stop?id=" + id;
        return doGet(url, path);
    }

    public JSONObject doGet(String url, String path) throws IOException {
        String targetUrl = url + path;

        Request request = new Request.Builder()
                .url(targetUrl)
                .addHeader("cookie", cookie)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            String responseData = response.body().string();
            return new JSONObject(Boolean.parseBoolean(responseData));
        }
    }

    public JSONObject getJsonObject(String url, JSONObject result) throws IOException {
        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) return null;

            String responseData = response.body().string();
            return new JSONObject(Boolean.parseBoolean(responseData));
        }
    }

    /**
     * 登录
     *
     * @param url
     * @param userName
     * @param password
     * @return
     * @throws IOException
     */

    public String login(String url, String userName, String password) throws IOException {
        String path = "/xxl-job-admin/login";
        String targetUrl = url + path;
        FormBody formBody = new FormBody.Builder()
                .add("userName", userName)
                .add("password", password)
                .add("ifRemember", "no").build();
        Request request = new Request.Builder()
                .url(targetUrl)
                .post(formBody)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) return "";

            // 获取Cookie
            String cookie = response.header("Set-Cookie");
            return cookie != null ? cookie : "";
        }
    }
}
```

## 定时任务接收参数定义

```java
 @XxlJob("sendEmail")
 public void sendEmail(String... params) throws Exception {
     //传递参数以,分割
 }

```
