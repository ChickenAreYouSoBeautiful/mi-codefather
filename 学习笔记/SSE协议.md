## 什么是响应式编程？

响应式编程是一种编程范式，他专注于 **异步数据流** 和 **变化传播** 。程序逻辑建立在数据流的变化之上。

核心概念：

	1. 数据流：响应式编程中，数据以流（Steams）的形式存在。
	1. 异步处理：响应式编程时异步的，不会阻塞主线程。
	1. 变化传播：当数据源发生变化时，响应式编程会自动将数据推送到订阅这些数据的地方，不需要显示调用。

## 什么是RxJava？

RxJava是一个基于事件驱动的，利用可观测序列来实现异步编程的类库，是响应式编程在Java语言上的实现。

1. 事件驱动：事件可以是任何事情，如用户的点击操作，网络请求，文件读写等。
2. 可观测序列：可观测序列是指一系列按照时间顺序发出的数据项。可以被观察和处理。

## SSE(服务端推送)

### 基本概念

服务器发送事件，是一种用于从服务器到客户端 单向，实时数据传输技术，基于HTTP协议实现。

特点：

1. 单向通信：只支持服务器向客户端的单向通信
2. 文本格式：使用 **纯文本格式** 传输数据，使用HTTP响应的`text/event-stream` MIME类型。
3. 保持连接：通过保持一个持久的HTTP连接，实现服务器向客户端推送更新。
4. 自动重连：连接如果终端，浏览器会自动尝试重新连接。

### SSE数据格式

SSE数据流格式非常简单，每个事件使用`data`字段，事件以两个换行符结束，还可以使用`id`来标识事件，并且`retry`字段可以设置重新连接的时间间隔。

todo:示例

### SSE实现

#### SpringBoot实现

~~~java

    @GetMapping("/join")
    public SseEmitter join(Long userId){
        SseEmitter sseEmitter = new SseEmitter(0); //设置超时时间，0永不超时
        sseEmitter.onCompletion(() -> {
            SSECache.removeSseEmitter(accessKey);
            log.info("sseEmitter 完成");
        });

        sseEmitter.onTimeout(() -> {
            SSECache.removeSseEmitter(accessKey);
            log.info("sseEmitter 超时");
        });

        sseEmitter.onError((e) -> {
            SSECache.removeSseEmitter(accessKey);
            log.error("sseEmitter 异常：{}", e.getMessage());
        });
        return sseEmitter;
    }
~~~

#### Web前端 

```javascript
// 创建 SSE 请求
const eventSource = new EventSource(
  "http://localhost:8080/sse"
);
// 接收消息
eventSource.onmessage = function (event) {
  console.log(event.data);
};
// 生成结束，关闭连接
eventSource.onerror = function (event) {
  if (event.eventPhase === EventSource.CLOSED) {
    eventSource.close();
  }
};

```

#### OkHttp实现发送SSE，Post请求

```java
public void testSSe(){
        String sseUrl = "http://localhost:8088/sse";
        HashMap<String, Object> formData = new HashMap<>();
        formData.put("param", "param");
        RequestBody requestBody = RequestBody.create(JSONUtil.toJsonStr(formData), MediaType.parse("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(sseUrl)
                .post(requestBody)
                .headers(Headers.of(this.getHeaderMap()))
                .build();

        //发送请求，并进行监听
        EventSource.Factory factory = EventSources.createFactory(okHttpClient);
        CompletableFuture.runAsync(()-> factory.newEventSource(request, new EventSourceListener() {
            @Override
            public void onEvent(@NotNull EventSource eventSource, @Nullable String id, @Nullable String type, String data) {
                log.info("获取数据:{}",data);

            }

            @Override
            public void onClosed(@NotNull EventSource eventSource) {

                log.info("对话完成");
            }

            @Override
            public void onFailure(@NotNull EventSource eventSource, @Nullable Throwable t, @Nullable Response response) {
                log.error("对话异常");
            }
        }));

    }
```



