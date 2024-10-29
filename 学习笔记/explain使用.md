# 如何用好explain

 	想要用好explain就需要先明白他查出来每个参数的含义，下面就为大家介绍一下

## 主要的属性

### 1） 	id

查询中每个SELECT 字句的标识符。简单查询通常为1，复杂查询（如包含子查询或`UNION`）的id会有多个

### 2） select_type

描述查询的类型。比如简单查询为 `SIMPLE`，子查询显示为 `SUBQUERY`，`UNION`中的第二个和后续查询显示为 `UNION`

### 3）table 

表名

### 4）partitions

标识查询涉及到的分区。

### 5）tyoe		(重点)

表示访问的类型，这里也可以看出你的SQL性能。可能的值从最好到最差包括：`system`,`const`,`eq_ref`,`ref`,`range`,`index`,`ALL`。其中`ALL`代表全表扫描，效率最低。

- system:

  表示查询的表只有一行（系统表）。不常见

- const

  表示查询的表最多只有一行匹配结果，这通常发生在查询条件是主键或者唯一索引的情况

- eq-ref:

  表示对于每次来自前一张表的行，MYSQL只会访问一次这个表。通常发生在连接查询中使用主键或唯一索引的情况下

  ~~~sql
  explain select * from users join userInfo on users.id = userInfo.id;
  ~~~

- ref:

  表示当前执行语句sql使用的查询条件索引是非唯一的（如普通索引）

  ~~~sql
  explain select * from users where name = "张三";
  ~~~

- range:

  表示MySQL会扫描表的一部分而不是所有行，范围扫描通常出现在使用索引范围查询中（如`BERWEEN`,`<`,`>`,`<=`,`>=`）。

  ~~~sql
  explain select * from users where age BETWEEN 18 AND 35;
  ~~~

- index:

  表示MySQL会扫描索引中的所有行，而不是表中的所有行，即使索引列的值覆盖查询，也需要扫描整个索引

  ~~~sql
  explain select name from users 
  ~~~

- all:

  表示MySQL需要扫描表中的所有行，即全表扫描，通常出现在没有使用索引的情况下

  ~~~sql
  explain select * from users
  ~~~

### 6） possible_keys

表示可能用到的索引列表

### 7）key

实际用到的索引，没有索引为NULL

### 8）key_len

表示使用索引的长度。该值是根据索引的定义和查询条件计算的。

### 9）rows

MySQL会估计为了查到所需的行，需要读取的行数，该值是估算，不是精确值

### 10） filtered

显示查询条件过滤掉行的百分比。高百分比表示查询条件的选择性好

### 11） Extra

额外信息，如 Using index(表示覆盖索引)，Using where(表示使用WHERE条件进行过滤)，Using temporary(表示使用临时表),Using filesort(表示需要额外的排序步骤)