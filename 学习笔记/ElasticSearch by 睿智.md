## ElasticSearch by 睿智

## 操作ES的RESTful语法
### **请求方式**

GET 查询

POST 查询添加更新

PUT 添加/更新

DELETE 删除

### **Kibana快捷键操作**

ctrl i 自动补全

ctrl / 打开帮助文档

ctrl Enter 执行当前选中的请求

### GET请求：

`/_cat/nodes`：查看所有节点

`/_cat/health`：查看es 健康状况

`/_cat/master`：查看主节点

`/_cat/indices`：查看所有索引 相当于 show databases;

`/index`：查询索引信息 GET book 相当于查看 数据库表结构

`/index/type/doc_id`：查询指定的文档信息

注意:咱们用的是es7 直接使用type的话会给出警告信息咱们使用_doc代替type 比如查询指定文档信息GET book/_doc/1 查询 book 索引中 id 为1 的文档信息

```
# 删除索引
DELETE book

# 查看ES中的全部索引
GET _cat/indices

# 创建索引,重复执行会报错
PUT book

# 创建索引同时手动指定配置信息
PUT book2
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1
  }
}

# 查询索引详情的
GET book
# 查询指定的文档信息
GET book/_doc/1

# 查看所有索引 相当于 show databases
GET _cat/indices

# 删除索引
DELETE /book2
```

### POST请求：

```
# 添加数据的，如果索引不存在会自动创建索引
POST book/_doc/1
{
  "name":"吴承恩",
  "title":"西游记"
}

# 添加数据，自动生成ID
POST book/_doc/
{
  "name":"施耐庵",
  "title":"水浒传"
}

# 查看索引里的所有数据
POST book/_search

# 根据条件查询
POST book/_search
{
  "query": {
    "match": {
      "title": "西游记"
    }
  }
}

# 更新数据 book/_doc/id,在请求体中指定json字符串代表修改的具体信息，不是动态更新
POST book/_doc/k2v3HYEBfQIebKurLtEf
{
  "doc":{
    "title":"三国"
  }
}

# 动态更新语法
POST book/_update/2
{
  "doc":{
    "title":"西游记222"
  }
}
```

### PUT请求：

```
# 添加或修改文档,第一次是添加（同样 索引不存在 也会创建索引） 后面再执行是修改
PUT book/_doc/3
{
  "name":"曹雪芹",
  "title":"红楼梦222"
}
```

### DELETE请求

```
# 删除索引book中  id 为2 的文档
DELETE book/_doc/2
```

# ES中filed可以指定的类型

> 字符串类型：
>
> text：一把被用于全文检索。 将当前Field进行分词。
>
> keyword：当前Field不会被分词。

> 数值类型：
>
> long：取值范围为-9223372036854774808~922337203685477480(-2的63次方到2的63次方-1)，占用8个字节
>
> integer：取值范围为-2147483648~2147483647(-2的31次方到2的31次方-1)，占用4个字节
>
> short：取值范围为-32768~32767(-2的15次方到2的15次方-1)，占用2个字节
>
> byte：取值范围为-128~127(-2的7次方到2的7次方-1)，占用1个字节
>
> double：1.797693e+308~ 4.9000000e-324 (e+308表示是乘以10的308次方，e-324表示乘以10的负324次方)占用8个字节
>
> float：3.402823e+38 ~ 1.401298e-45(e+38表示是乘以10的38次方，e-45表示乘以10的负45次方)，占用4个字节
>
> half_float：精度比float小一半。
>
> scaled_float：根据一个long和scaled来表达一个浮点型，long-345，scaled-100 -> 3.45

> 布尔类型：
>
> boolean类型，表达true和false

> 二进制类型：
>
> binary类型暂时支持Base64 encode string

> 时间类型：
>
> date类型，针对时间类型指定具体的格式
>
> format 指定时间格式 yyyy-MM-dd

> 范围类型：
>
> long_range：赋值时，无需指定具体的内容，只需要存储一个范围即可，指定gt，lt，gte，lte
>
> integer_range：同上
>
> double_range：同上
>
> float_range：同上
>
> date_range：同上
>
> ip_range：同上

> 经纬度类型：
>
> geo_point：用来存储经纬度的：经度/纬度
>
> ip类型：
>
> ip：可以存储IPV4或者IPV6
>
> [其他的数据类型参考官网(opens new window)](https://www.elastic.co/guide/en/elasticsearch/reference/7.6/mapping-types.html)
>
> ```
> # 创建索引，指定数据结构
> PUT /book
> {
>   "settings": {
>     # 分片数
>     "number_of_shards": 5,
>     # 备份数
>     "number_of_replicas": 1
>   },
>   # 指定数据结构
>   "mappings": {
>     # 文档存储的Field
>     "properties": {
>       # Field属性名
>       "name": {
>     	# 类型
>         "type": "text",
>     	# 指定当前Field可以被作为查询的条件
>         "index": true ,
>     	# 是否需要额外存储
>         "store": false 
>       },
>       "author": {
>           # keyword 也算是字符串类型 
>         "type": "keyword"
>       },
>       "count": {
>         "type": "long"
>       },
>       "on-sale": {
>         "type": "date",
>          # 时间类型的格式化方式 
>         "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
>       },
>       "descr": {
>         "type": "text"
>       }
>     }
>   }
> }
> ```

# 文档的操作

> 文档在ES服务中的唯一标识，`_index`，`_type`，`_id`三个内容为组合，锁定一个文档，
>
> 操作是添加还是修改删除。

#### 新建文档

> 自动生成_id

```
# 添加文档，自动生成id，不推荐这种自动生成的id 
POST /book/_doc
{
  "name": "游山西村",
  "author": "陆游",
  "count": 100000,
  "on-sale": "2000-01-01",
  "descr": "山重水复疑无路，柳暗花明又一村"
}
```

> 手动指定_id

```
# 添加文档，手动指定id     推荐使用
PUT /book/_doc/1
{
  "name": "红楼梦",
  "author": "曹雪芹",
  "count": 10000000,
  "on-sale": "1985-01-01",
  "descr": "一个是阆苑仙葩，一个是美玉无瑕"
}
```



#### 修改文档

> doc覆盖式修改

```
# 修改文档   覆盖式修改  如果没有指定某个属性 这个属性会被覆盖掉  覆盖没了
PUT /book/_doc/1
{
  "name": "红楼梦",
  "author": "曹雪芹",
  "count": 4353453,
  "on-sale": "1985-01-01",
  "descr": "一个是阆苑仙葩，一个是美玉无瑕"
}
```

> update修改方式

```
# 修改文档，基于doc方式，不会覆盖之前的内容 指定哪一个属性 修改哪一个属性
POST book/_update/1
{
  "doc": {
    "descr":"一把辛酸泪，满纸荒唐言"
  }
}
```

#### 删除文档

> 根据id删除

```
# 根据id删除文档
DELETE book/_doc/1      # 删除id 为1 的文档
```

# ElasticSearch的各种查询

### term&terms查询(完全匹配查询不分词）

term的查询是代表完全匹配，搜索之前不会对你搜索的关键字进行分词，对你的关键字去文档分词库中去匹配内容 

 term 不对查询条件进行分词，field是text或者keyword 类型 分别是 对文档内容分词（text）和不分词(keyword) 

~~~
# 查询结果
{
  "took" : 2,    # 查询用了2毫秒
  "timed_out" : false,    # 是否超时  没有超时
  "_shards" : {    # 分片信息
    "total" : 3,   # 一共使用三个分片
    "successful" : 3,   # 成功了三个分片
    "skipped" : 0,    # 跳过
    "failed" : 0      # 失败
  },
  "hits" : {           # 查询命中
    "total" : {         # 总命中
      "value" : 2,      # 命中数
      "relation" : "eq"  # 查询关系
    },
    "max_score" : 0.6931472,    # 匹配分数   匹配度越高  分数越高
    "hits" : [
      {
        "_index" : "sms-logs-index",
        "_type" : "_doc",
        "_id" : "21",
        "_score" : 0.6931472,
        "_source" : {
          "corpName" : "途虎养车",
          "createDate" : 1607833538978,
          "fee" : 3,
          "ipAddr" : "10.126.2.9",
          "longCode" : "10690000988",
          "mobile" : "13800000000",
          "operatorId" : 1,
          "province" : "北京",
          "replyTotal" : 10,
          "sendDate" : 1607833538978,
          "smsContent" : "【途虎养车】亲爱的张三先生/女士，您在途虎购买的货品(单号TH123456)已 到指定安装店多日，现需与您确认订单的安装情况，请点击链接按实际情况选择（此链接有效期为72H）。您也可以登录途 虎APP进入“我的-待安装订单”进行预约安装。若您在服务过程中有任何疑问，请致电400-111-8868向途虎咨 询。",
          "state" : 0
        }
      },
      {
        "_index" : "sms-logs-index",
        "_type" : "_doc",
        "_id" : "23",
        "_score" : 0.6931472,
        "_source" : {
          "corpName" : "盒马鲜生",
          "createDate" : 1607833539131,
          "fee" : 5,
          "ipAddr" : "10.126.2.9",
          "longCode" : "10660000988",
          "mobile" : "13100000000",
          "operatorId" : 2,
          "province" : "北京",
          "replyTotal" : 15,
          "sendDate" : 1607833539131,
          "smsContent" : "【盒马】您尾号12345678的订单已开始配送，请在您指定的时间收货不要走开 哦~配送员：刘三，电话：13800000000",
          "state" : 0
        }
      }
    ]
  }
}
~~~



代码实现方式

~~~java
@Test
void testTerm() throws IOException {
    // 1、创建查询请求的对象
    SearchRequest searchRequest = new SearchRequest(index);
    // 2、查询条件构造器
    SearchSourceBuilder builder = new SearchSourceBuilder();
    // 3、设置查询条件
    builder.query(QueryBuilders.termQuery("province","北京"));
    searchRequest.source(builder);
    // 4、执行查询
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    // 5、获取查询结果
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        Map<String, Object> map = hit.getSourceAsMap();
        System.out.println(map);
    }
}
~~~

~~~java
# terms查询
POST /sms-logs-index/_search
{
  "query": {
    "terms": {
      "province": [
        "北京",
        "山西",
        "武汉"
      ]
    }
  }
}
~~~

java代码实现

~~~java
/**
 * Terms查询
 * @throws IOException
 */
@Test
void testTerms() throws IOException {
    // 1、创建查询请求的对象
    SearchRequest searchRequest = new SearchRequest(index);
    // 2、查询条件构造器
    SearchSourceBuilder builder = new SearchSourceBuilder();
    // 3、设置查询条件
    // ------------
    builder.query(QueryBuilders.termsQuery("province","北京","河南","山西"));
    // ------------
    searchRequest.source(builder);
    // 4、执行查询
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    // 5、获取查询结果
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        Map<String, Object> map = hit.getSourceAsMap();
        System.out.println(map);
    }
}
~~~

### match查询(可分词，自动转换类型）

match查询属于高层查询，他会根据你查询的字段类型不一样，采用不同的查询方式。

- 查询的是日期或者是数值的话，他会将你基于的字符串查询内容转换为日期或者数值对待。
- 如果查询的内容是一个不能被分词的内容（keyword），match查询不会对你指定的查询关键字进行分词。
- 如果查询的内容时一个可以被分词的内容（text），match会将你指定的查询内容根据一定的方式去分词，去分词库中匹配指定的内容。

match查询，实际底层就是多个term查询，将多个term查询的结果给你封装到了一起

#### match_all查询(查询所有）

```
# match_all查询
POST /sms-logs-index/_search
{
  "query": {
    "match_all": {}
  }
}
```

代码实现

```java
/**
 * MatchAll查询
 * @throws IOException
 */
@Test
void testMatchAll() throws IOException {
    // 1、创建查询请求的对象
    SearchRequest searchRequest = new SearchRequest(index);
    // 2、查询条件构造器
    SearchSourceBuilder builder = new SearchSourceBuilder();
    // 3、设置查询条件
    // ------------
    builder.query(QueryBuilders.matchAllQuery());
    builder.size(2);
    // ------------
    searchRequest.source(builder);
    // 4、执行查询
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    // 5、获取查询结果
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        Map<String, Object> map = hit.getSourceAsMap();
        System.out.println(map);
    }
}
```

#### match(指定一个过滤条件)

```
# match查询
POST /sms-logs-index/_search
{
  "query": {
    "match": {
      "smsContent": "收货安装" 
      }
  }
}
```

代码实现

```java
/**
 * Match查询
 * @throws IOException
 */
@Test
void testMatch() throws IOException {
    // 1、创建查询请求的对象
    SearchRequest searchRequest = new SearchRequest(index);
    // 2、查询条件构造器
    SearchSourceBuilder builder = new SearchSourceBuilder();
    // 3、设置查询条件
    // ------------
    builder.query(QueryBuilders.matchQuery("smsContent","收货安装"));
    // ------------
    searchRequest.source(builder);
    // 4、执行查询
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    // 5、获取查询结果
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        Map<String, Object> map = hit.getSourceAsMap();
        System.out.println(map);
    }
}
```

#### 布尔match查询（基于一个Field匹配的内容，采用and或者or的方式连接）

```
POST /sms-logs-index/_search
{
  "query": {
    "match": {
      "smsContent": {
        "query": "中国 健康",
        "operator": "and"      # 内容既包含中国也包含健康
      }
    }
  }
}
```

#### multi_match(一个text查多个filed)

match针对一个field做检索，multi_match针对多个field进行检索，多个field对应一个text。 

```
# multi_match 查询,多个field只要有查询的关键字就能查到
POST /sms-logs-index/_search
{
  "query": {
    "multi_match": {
      "query": "北京",					# 指定text
      "fields": ["province","smsContent"]    # 指定field们
    }
  }
}
```

#### ids查询（根据多个id查询）

```
# ids查询
POST /sms-logs-index/_search
{
  "query": {
    "ids": {
      "values": ["1","2","3"]
    }
  }
}
```

代码实现

```java
/**
 * IdsQuery查询
 * @throws IOException
 */
@Test
void testIdsQuery() throws IOException {
    // 1、创建查询请求的对象
    SearchRequest searchRequest = new SearchRequest(index);
    // 2、查询条件构造器
    SearchSourceBuilder builder = new SearchSourceBuilder();
    // 3、设置查询条件
    // ------------
    builder.query(QueryBuilders.idsQuery().addIds("21","22","23"));
    // ------------
    searchRequest.source(builder);
    // 4、执行查询
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    // 5、获取查询结果
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        Map<String, Object> map = hit.getSourceAsMap();
        System.out.println(map);
    }
}
```

####  prefix前置查询

前缀查询，可以通过一个关键字去指定一个Field的前缀，从而查询到指定的文档。

针对keyword类型，可以进行前缀查询

```
#prefix 查询
POST /sms-logs-index/_search
{
  "query": {
    "prefix": {
      "corpName": {
        "value": "途虎"
      }
    }
  }
}
```

#### fuzzy模糊查询

模糊查询，我们输入字符的大概（比如 出现错别字），ES就可以去根据输入的内容大概去匹配一下结果。 

```
# fuzzy查询
POST /sms-logs-index/_search
{
  "query": {
    "fuzzy": {
      "corpName": {
        "value": "盒马先生",
        "prefix_length": 2	# 指定前面几个字符是不允许出现错误的
      }
    }
  }
}
```

#### wildcard通配符查询

通配查询，和MySQL中的like是一个套路，可以在查询时，在字符串中指定通配符*和占位符？

*号匹配多个字符 ?匹配一个字符

```
# wildcard 查询
POST /sms-logs-index/_search
{
  "query": {
    "wildcard": {
      "corpName": {
        "value": "中国*"    # 可以使用*和？指定通配符和占位符
      }
    }
  }
}
```

####  range范围查询

范围查询，只针对数值类型，对某一个Field进行大于或者小于的范围指定

可以使用 gt：> gte：>= lt：< lte：<=

```
# range查询
POST /sms-logs-index/_search
{
  "query": {
    "range": {
      "fee": {
        "gt": 5,
        "lte": 10
      }
    }
  }
}
```

#### regexp正则匹配查询

正则查询，通过你编写的正则表达式去匹配内容。 

```
# regexp 查询
POST /sms-logs-index/_search
{
  "query": {
    "regexp": {
      "mobile": "180[0-9]{8}"    # 编写正则
    }
  }
}
```

#### 深分页scroll

**执行scroll查询，返回第一页数据，并且将文档id信息存放在ES上下文中，指定生存时间1m**

```
POST /sms-logs-index/_search?scroll=1m
{
    "query": {
        "match_all": {}
     },
    "size": 2,
    "sort": [ # 排序      默认是根据id字段排序
        {
         "fee": { # 自定义排序字段   也可以指定多个字段排序，比如 fee一样时，按照另一个字段排序
           "order": "desc"    
         }
    	}
    ]
}
```

**根据scroll查询下一页数据**

```
POST /_search/scroll
{
"scroll_id": "<根据上面第一步得到的scorll_id去指定>",
"scroll": "<scorll信息的生存时间>" 
# 第二次查询 要重新指定上下文存活时间  要不然第二次查询之后  上下文就没了
}
```

#### delete-by-query(根据查询条件删除)

根据term，match等查询方式去删除大量的文档 

```
# delete-by-query
POST /sms-logs-index/_delete_by_query
{
  "query": {
    "range": {
      "fee": {
        "lt": 4
      }
    }
  }
}
```

```java
// Java代码实现
@Test
public void deleteByQuery() throws IOException {
    //1. 创建DeleteByQueryRequest
    DeleteByQueryRequest request = new DeleteByQueryRequest(index);
    
    //2. 指定检索的条件 和SearchRequest指定Query的方式不一样
    request.setQuery(QueryBuilders.rangeQuery("fee").lt(4));

    //3. 执行删除
    BulkByScrollResponse resp = client.deleteByQuery(request, RequestOptions.DEFAULT);

    //4. 输出返回结果
    System.out.println(resp.toString());

}
```

## 复合查询

#### bool查询

复合过滤器，将你的多个查询条件，以一定的逻辑组合在一起。

- must： 所有的条件，用must组合在一起，表示And的意思
- must_not：将must_not中的条件，全部都不能匹配，标识Not的意思
- should：所有的条件，用should组合在一起，表示Or的意思

must 提交必须同时满足 and

should 任意条件复合即可 or

must_not 取反 not

```j
# 查询省份为武汉或者北京
# 运营商不是联通
# smsContent中包含中国和平安
# bool查询
POST sms-logs-index/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "province": {
              "value": "武汉"
            }
          }
        },
        {
          "term": {
            "province": {
              "value": "北京"
            }
          }
        }
      ],
      "must_not": [
        {
          "term": {
            "operatorId": {
              "value": "2"
            }
          }
        }
      ],
      "must": [
        {
          "match": {
            "smsContent": "中国"
          }
        },
        {
          "match": {
            "smsContent": "平安"
          }
        }
      ]
    }
  }
}
```

```java
// Java代码实现Bool查询
@Test
void testBool() throws IOException {
    // 1、创建查询请求的对象
    SearchRequest searchRequest = new SearchRequest(index);
    // 2、查询条件构造器
    SearchSourceBuilder builder = new SearchSourceBuilder();
    // 3、设置查询条件
    // ------------
    BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
    // 查询省份为武汉或者北京
    boolQueryBuilder.should(QueryBuilders.termQuery("province","武汉"));
    boolQueryBuilder.should(QueryBuilders.termQuery("province","北京"));
    // 运营商不是联通
    boolQueryBuilder.mustNot(QueryBuilders.termQuery("operatorId",2));
    // smsContent中包含中国和平安
    boolQueryBuilder.must(QueryBuilders.matchQuery("smsContent","中国"));
    boolQueryBuilder.must(QueryBuilders.matchQuery("smsContent","平安"));
    builder.query(boolQueryBuilder);
    // ------------
    searchRequest.source(builder);
    // 4、执行查询
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    // 5、获取查询结果
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        Map<String, Object> map = hit.getSourceAsMap();
        System.out.println(map);
    }
}
```

#### boosting查询(根据分数控制排序）

boosting查询可以帮助我们去影响查询后的score。

- positive：只有匹配上positive的查询的内容，才会被放到返回的结果集中。
- negative：如果匹配上和positive并且也匹配上了negative，就可以降低这样的文档score。
- negative_boost：指定系数，必须小于1.0

关于查询时，分数是如何计算的：

- 搜索的关键字在文档中出现的频次越高，分数就越高

- 指定的文档内容越短，分数就越高

- 我们在搜索时，指定的关键字也会被分词，这个被分词的内容，被分词库匹配的个数越多，分数越高

  ```
  # boosting查询  收货安装
  POST /sms-logs-index/_search
  {
    "query": {
      "boosting": {
        "positive": {
          "match": {
            "smsContent": "收货安装"
          }
        },
        "negative": {
          "match": {
            "smsContent": "王五"
          }
        },
        "negative_boost": 0.5
      }
    }
  }
  ```

```java
// Java实现Boosting查询
@Test
public void BoostingQuery() throws IOException {
    //1. 创建SearchRequest
    SearchRequest request = new SearchRequest(index);
    request.types(type);

    //2. 指定查询条件
    SearchSourceBuilder builder = new SearchSourceBuilder();
    BoostingQueryBuilder boostingQuery = QueryBuilders.boostingQuery(
            QueryBuilders.matchQuery("smsContent", "收货安装"),
            QueryBuilders.matchQuery("smsContent", "王五")
    ).negativeBoost(0.5f);

    builder.query(boostingQuery);
    request.source(builder);

    //3. 执行查询
    SearchResponse resp = client.search(request, RequestOptions.DEFAULT);

    //4. 输出结果
    for (SearchHit hit : resp.getHits().getHits()) {
        System.out.println(hit.getSourceAsMap());
    }
}
```

#### filter过滤查询

query，根据你的查询条件，去计算文档的匹配度得到一个分数，并且根据分数进行排序，不会做缓存的。

filter，根据你的查询条件去查询文档，不去计算分数，而且filter会对经常被过滤的数据进行缓存。

```
# filter查询
POST /sms-logs-index/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "corpName": "盒马鲜生"
          }
        },
        {
          "range": {
            "fee": {
              "lte": 4
            }
          }
        }
      ]
    }
  }
}
```

```java
// Java实现filter操作
@Test
public void filter() throws IOException {
    //1. SearchRequest
    SearchRequest request = new SearchRequest(index);
    request.types(type);

    //2. 查询条件
    SearchSourceBuilder builder = new SearchSourceBuilder();
    BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
    boolQuery.filter(QueryBuilders.termQuery("corpName","盒马鲜生"));
    boolQuery.filter(QueryBuilders.rangeQuery("fee").lte(5));

    builder.query(boolQuery);
    request.source(builder);

    //3. 执行查询
    SearchResponse resp = client.search(request, RequestOptions.DEFAULT);

    //4. 输出结果
    for (SearchHit hit : resp.getHits().getHits()) {
        System.out.println(hit.getSourceAsMap());
    }


}
```

### 高亮查询

高亮查询就是你用户输入的关键字，以一定的特殊样式展示给用户，让用户知道为什么这个结果被检索出来。

高亮展示的数据，本身就是文档中的一个Field，单独将Field以highlight的形式返回给你。

ES提供了一个highlight属性，和query同级别的。

- fragment_size：指定高亮数据展示多少个字符回来。默认100个

- pre_tags：指定前缀标签，举个栗子< font color="red" >

- post_tags：指定后缀标签，举个栗子< /font >

- fields：指定哪几个Field以高亮形式返回

  ```
  # highlight查询
  POST /sms-logs-index/_search
  {
    "query": {
      "match": {
        "smsContent": "盒马"
      }
    },
    "highlight": {
      "fields": {
        "smsContent": {}
      },
      "pre_tags": "<font color='red'>",
      "post_tags": "</font>",
      "fragment_size": 10
    }
  }
  ```

```java
// Java实现高亮查询
@Test
public void highLightQuery() throws IOException {
    //1. SearchRequest
    SearchRequest request = new SearchRequest(index);
    
    //2. 指定查询条件（高亮）
    SearchSourceBuilder builder = new SearchSourceBuilder();
    //2.1 指定查询条件
    builder.query(QueryBuilders.matchQuery("smsContent","盒马"));
    //2.2 指定高亮
    HighlightBuilder highlightBuilder = new HighlightBuilder();
    highlightBuilder.field("smsContent",10)
            .preTags("<font color='red'>")
            .postTags("</font>");
    builder.highlighter(highlightBuilder);

    request.source(builder);

    //3. 执行查询
    SearchResponse resp = client.search(request, RequestOptions.DEFAULT);

    //4. 获取高亮数据，输出
    for (SearchHit hit : resp.getHits().getHits()) {
        System.out.println(hit.getHighlightFields().get("smsContent"));
    }
}
```

### 聚合查询

aggregations :提供了从数据中分组和提取数据的能力，最简单的聚合方法大致等于SQL GROUP BY 和 SQL 聚合函数。在ES中可以执行搜索返回hits(命中结果)，并且同时返回聚合结果，把一个响应中所有hits (命中结果)分隔开的能力，这是非常强大且有效的 ，可以执行多个查询和聚合，并且在一次使用中得到各自的返回结果，使用一次简洁和简化的API来避免网络往返。

ES的聚合查询和MySQL的聚合查询类似，ES的聚合查询相比MySQL要强大的多，ES提供的统计数据的方式多种多样。

```
# ES聚合查询的RESTful语法
POST /index/_search
{
    "aggs": {
        "名字（agg）": {   # 名字 自定义 只会影响返回结果的名字
            "agg_type": {    # es 给咱们提供的聚合类型   咱们直接使用即可 
                "属性": "值"
            }
        }
    }
  }
```

####  去重计数查询

去重计数，即Cardinality，第一步先将返回的文档中的一个指定的field进行去重，统计一共有多少条 

```
# 去重计数查询 北京 上海 武汉 山西
# 这些记录中 一共出现了几个省份
POST /sms-logs-index/_search
{
  "aggs": {
    "agg": {
      "cardinality": {
        "field": "province"     # 按照 field 进行去重
      }
    }
  }
}
```

```java
//  Java代码实现去重计数查询
@Test
public void cardinality() throws IOException {
    //1. 创建SearchRequest
    SearchRequest request = new SearchRequest(index);
    request.types(type);

    //2. 指定使用的聚合查询方式
    SearchSourceBuilder builder = new SearchSourceBuilder();
    builder.aggregation(AggregationBuilders.cardinality("agg").field("province"));

    request.source(builder);

    //3. 执行查询
    SearchResponse resp = client.search(request, RequestOptions.DEFAULT);

    //4. 获取返回结果
    Cardinality agg = resp.getAggregations().get("agg");
    long value = agg.getValue();
    System.out.println(value);
}
```

#### 范围统计

> 统计一定范围内出现的文档个数，比如，针对某一个Field的值在 0~100,100~200,200~300之间文档出现的个数分别是多少。
>
> 范围统计可以针对普通的数值，针对时间类型，针对ip类型都可以做相应的统计。
>
> range，date_range，ip_range

> 数值统计:
>
> from: 包含当前值
>
> to: 不包含当前值

```
# 数值方式范围统计
POST /sms-logs-index/_search
{
  "aggs": {
    "agg": {
      "range": {
        "field": "fee",
        "ranges": [
          {
            "to": 5        # 没有等于的效果
          },
          {
            "from": 5,    # from有包含当前值的意思    有等于的效果 
            "to": 10
          },
          {
            "from": 10
          }
        ]
      }
    }
  }
}
```

```
# 时间方式范围统计
POST /sms-logs-index/_search
{
  "aggs": {
    "agg": {
      "date_range": {
        "field": "createDate",
        "format": "yyyy", 
        "ranges": [
          {
            "to": 2000
          },
          {
            "from": 2000
          }
        ]
      }
    }
  }
}
```

> ip统计方式

```
# ip方式 范围统计
POST /sms-logs-index/_search
{
  "aggs": {
    "agg": {
      "ip_range": {
        "field": "ipAddr",
        "ranges": [
          {
            "to": "10.126.2.9"
          },
          {
            "from": "10.126.2.9"
          }
        ]
      }
    }
  }
}
```

```java
// Java实现数值 范围统计
@Test
public void range() throws IOException {
    //1. 创建SearchRequest
    SearchRequest request = new SearchRequest(index);
   

    //2. 指定使用的聚合查询方式
    SearchSourceBuilder builder = new SearchSourceBuilder();
    //---------------------------------------------
    builder.aggregation(AggregationBuilders.range("agg").field("fee")
                                        .addUnboundedTo(5)
                                        .addRange(5,10)
                                        .addUnboundedFrom(10));
    //---------------------------------------------
    request.source(builder);

    //3. 执行查询
    SearchResponse resp = client.search(request, RequestOptions.DEFAULT);

    //4. 获取返回结果
    Range agg = resp.getAggregations().get("agg");
    for (Range.Bucket bucket : agg.getBuckets()) {
        String key = bucket.getKeyAsString();
        Object from = bucket.getFrom();
        Object to = bucket.getTo();
        long docCount = bucket.getDocCount();
        System.out.println(String.format("key：%s，from：%s，to：%s，docCount：%s",key,from,to,docCount));
    }
}
```

#### 统计聚合查询

他可以帮你查询指定Field的最大值，最小值，平均值，平方和等

使用：extended_stats

```
# 统计聚合查询
POST /sms-logs-index/_search
{
  "aggs": {
    "agg": {
      "extended_stats": {
        "field": "fee"
      }
    }
  }
}
```

```java
// Java实现统计聚合查询
@Test
public void extendedStats() throws IOException {
    //1. 创建SearchRequest
    SearchRequest request = new SearchRequest(index);
    request.types(type);

    //2. 指定使用的聚合查询方式
    SearchSourceBuilder builder = new SearchSourceBuilder();
    //---------------------------------------------
    builder.aggregation(AggregationBuilders.extendedStats("agg").field("fee"));
    //---------------------------------------------
    request.source(builder);

    //3. 执行查询
    SearchResponse resp = client.search(request, RequestOptions.DEFAULT);

    //4. 获取返回结果
    ExtendedStats agg = resp.getAggregations().get("agg");
    double max = agg.getMax();
    double min = agg.getMin();
    System.out.println("fee的最大值为：" + max + "，最小值为：" + min);
```

#### terms查询

~~~java

POST bank/_search
{
  "query": {
    "match": {
      "address": "mill"
    }
  }, 
  "aggs": {
    "agg": {
      "terms": {
        "field": "age",
        "size": 10
      }
    }
  }
}

//结果
aggregations" : {
    "agg" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : 38,
          "doc_count" : 2
        },
        {
          "key" : 28,
          "doc_count" : 1
        },
        {
          "key" : 32,
          "doc_count" : 1
        }
      ]
    }
  }
~~~



### 地图经纬度查询

ES中提供了一个数据类型 geo_point，这个类型就是用来存储经纬度的。

创建一个带geo_point类型的索引，并添加测试数据 [坐标拾取](http://api.map.baidu.com/lbsapi/getpoint/index.html)

语法                                                     说明

| geo_distance     | 直线距离检索方式                                 |
| ---------------- | ------------------------------------------------ |
| geo_bounding_box | 以两个点确定一个矩形，获取在矩形内的全部数据     |
| geo_polygon      | 以多个点，确定一个多边形，获取多边形内的全部数据 |

直线距离检索方式

```
# geo_distance 直线距离检索
POST map/_search
{
  "query": {
    "geo_distance": {
      "location": {			# 确定一个点
        "lon": 113.672455,	# 确定半径默认为米，可以通过unit来指定
        "lat": 34.758619	# 指定形状为圆形
      },
      "distance": 2000,
      "distance_type": "arc"
    }
  }
}


====================================================================================

# 两个点[左上角/右下角]确定一个矩形，查找内部的数据
POST map/_search
{
  "query": {
    "geo_bounding_box": {
      "location": {
        "top_left": {
          "lon": 113.616689,
          "lat": 34.768405
        },
        "bottom_right": {
          "lon": 113.695452,
          "lat": 34.768167
        }
      }
    }
  }
}


/====================================================

# geo_polygon

# 多边形
POST map/_search
{
  "query": {
    "geo_polygon": {
      "location": {
        "points": [
          {
            "lon": 113.624306,
            "lat": 34.778486
          },
          {
            "lon": 113.616976,
            "lat": 34.768286
          },
          {
            "lon": 113.675186,
            "lat": 34.747645
          },
          {
            "lon": 113.687834,
            "lat": 34.78406
          }
        ]
      }
    }
  }
}
```

```java
// 基于Java实现geo_polygon查询
@Test
void testGeo() throws IOException {
    // 1、创建查询请求的对象
    SearchRequest searchRequest = new SearchRequest("map");
    // 2、查询条件构造器
    SearchSourceBuilder builder = new SearchSourceBuilder();
    // 3、设置查询条件
    // ------------
    List<GeoPoint> points = new ArrayList<>();
    points.add(new GeoPoint(34.778486,113.624306));
    points.add(new GeoPoint(34.768286,113.616976));
    points.add(new GeoPoint(34.747645,113.675186));
    points.add(new GeoPoint(34.78406,113.687834));
    builder.query(QueryBuilders.geoPolygonQuery("location",points));
    // ------------
    searchRequest.source(builder);
    // 4、执行查询
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    // 5、获取查询结果
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        Map<String, Object> map = hit.getSourceAsMap();
        System.out.println(map);
    }
}
```

