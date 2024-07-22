# guava-retrying实现重试机制

引入jar包

~~~xml
 <dependency>
            <groupId>com.github.rholder</groupId>
            <artifactId>guava-retrying</artifactId>
            <version>2.0.0</version>
 </dependency>
~~~

假如我们要访问一个dps限制的很低的第三方接口，如果调用失败需要一次在失败的10s，20s，30s进行降频重试，如果我们自己实现，需要定义计数器，计算休眠时间，考虑异常处理异步等情况。如果业务上多个地方需要重试还要反复编写类似代码。guava-retrying为我们封装了一套通用的重试方法。

用retrying实现，相对于自己实现的优点如下。

1. 对代码的侵入性更小
2. 更直观，方便改动
3. 可复用重试器至多个任务

## RetryerBulider方法介绍

RetryerBuild 用于构造重试器，决定着重试的行为。

![image](https://ChickenAreYouSoBeautiful.github.io/picx-images-hosting/common/image.6m3sncn0du.jpg)

通过newBulider的方法获取RetryerBuilder的示例，通过build方法构造Retryer:

通过以下的方法来改变重试器的行为。

### 重试条件

1. 根据执行结果判断是否重试 retryIfResult 

~~~java
RetryerBuilder<V> retryIfResult(@Nonnull Predicate<V> resultPredicate)
~~~

2. 发生异常时重试 

~~~java
// 发生任何异常都重试
retryIfException()
// 发生 Runtime 异常都重试
RetryerBuilder<V> retryIfRuntimeException()
// 发生指定 type 异常时重试
RetryerBuilder<V> retryIfExceptionOfType(@Nonnull Class<? extends Throwable> exceptionClass)
// 匹配到指定类型异常时重试
RetryerBuilder<V> retryIfException(@Nonnull Predicate<Throwable> exceptionPredicate)
~~~

### 等待策略

等待策略可以控制重试的时间间隔，通过withWaitStrategy方法注册等待策略

~~~java
RetryerBuilder<V> withWaitStrategy(@Nonnull WaitStrategy waitStrategy) throws IllegalStateException
~~~

WaitStrategy 是等待策略接口，可通过 WaitStrategies 的方法生成该接口的策略实现类，共有7种策略： 

1. FixedWaitStrategy：固定等待时长策略，比如每次重试等待5s

~~~java
// 参数：等待时间，时间单位
WaitStrategy fixedWait(long sleepTime, @Nonnull TimeUnit timeUnit) throws IllegalStateException
~~~

2. RandomWaitStrategy：随机等待时长策略，每次重试等待指定区间的随机时长 

~~~java
// 参数：随机上限，时间单位
WaitStrategy randomWait(long maximumTime, @Nonnull TimeUnit timeUnit)
// 参数：随机下限，下限时间单位，随机上限，上限时间单位
WaitStrategy randomWait(long minimumTime,
                        @Nonnull TimeUnit minimumTimeUnit,
                        long maximumTime,
                        @Nonnull TimeUnit maximumTimeUnit)
~~~

3. IncrementingWaitStrategy：递增等待时长策略，指定初始等待值，然后重试间隔随次数等差递增，比如依次等待10s、30s、60s（递增值为10） 

~~~java
// 参数：初始等待时长，初始值时间单位，递增值，递增值时间单位
WaitStrategy incrementingWait(long initialSleepTime,
                              @Nonnull TimeUnit initialSleepTimeUnit,
                              long increment,
                              @Nonnull TimeUnit incrementTimeUnit)
~~~

4. ExponentialWaitStrategy：指数等待时长策略，指定初始值，然后每次重试间隔乘2（即间隔为2的幂次方），如依次等待 2s、6s、14s。可以设置最大等待时长，达到最大值后每次重试将等待最大时长。 

~~~java
// 无参数（默认初始值为1）
WaitStrategy exponentialWait()
// 参数：最大等待时长，最大等待时间单位（默认初始值为1）
WaitStrategy exponentialWait(long maximumTime, @Nonnull TimeUnit maximumTimeUnit)
// 参数：初始值，最大等待时长，最大等待时间单位
WaitStrategy exponentialWait(long multiplier, long maximumTime, @Nonnull TimeUnit maximumTimeUnit)
~~~

5. FibonacciWaitStrategy ：斐波那契等待时长策略，类似指数等待时长策略，间隔时长为斐波那契数列。 

~~~java
// 无参数（默认初始值为1）
WaitStrategy fibonacciWait()
// 参数：最大等待时长，最大等待时间单位（默认初始值为1）
WaitStrategy fibonacciWait(long maximumTime, @Nonnull TimeUnit maximumTimeUnit)
// 参数：最大等待时长，最大等待时间单位（默认初始值为1）
WaitStrategy fibonacciWait(long multiplier, long maximumTime, @Nonnull TimeUnit maximumTimeUnit)
~~~

6. ExceptionWaitStrategy：异常时长等待策略，根据出现的异常类型决定等待的时长 

~~~java
// 参数：异常类型，计算等待时长的函数
<T extends Throwable> WaitStrategy exceptionWait(@Nonnull Class<T> exceptionClass,
                                                 @Nonnull Function<T, Long> function)
~~~

7. CompositeWaitStrategy ：复合时长等待策略，可以组合多个等待策略，基本可以满足所有等待时长的需求 

~~~java
// 参数：等待策略数组
WaitStrategy join(WaitStrategy... waitStrategies)
~~~

### 阻塞策略

阻塞策略控制当前重试结束至下次重试开始前的行为，通过 withBlockStrategy 方法注册阻塞策略： 

~~~java
RetryerBuilder<V> withBlockStrategy(@Nonnull BlockStrategy blockStrategy) throws IllegalStateException
~~~

BlockStrategy 是等待策略接口，可通过 BlockStrategies 的方法生成实现类，默认只提供一种策略 ThreadSleepStrategy： 

~~~java
@Immutable
private static class ThreadSleepStrategy implements BlockStrategy {
 
      @Override
      public void block(long sleepTime) throws InterruptedException {
            Thread.sleep(sleepTime);
      }
}
~~~

睡眠，纯阻塞

### 停止策略

停止策略决定了何时停止重试，比如限制次数、时间等，通过 withStopStrategy 方法注册等待策略： 

~~~java
RetryerBuilder<V> withStopStrategy(@Nonnull StopStrategy stopStrategy) throws IllegalStateException
~~~

可通过 StopStrategies 的方法生成 StopStrategy 接口的策略实现类，共有3种策略： 

1. NeverStopStrategy：永不停止，直到重试成功
2. StopAfterAttemptStrategy：指定最多重试次数，超过次数抛出 RetryException 异常
3. StopAfterDelayStrategy：指定最长重试时间，超时则中断当前任务执行且不再重试，并抛出 RetryException 异常

### 超时限制

通过 withAttemptTimeLimiter 方法为任务添加单次执行时间限制，超时则中断执行，继续重试。 

~~~java
RetryerBuilder<V> withAttemptTimeLimiter(@Nonnull AttemptTimeLimiter<V> attemptTimeLimiter)
~~~

默认提供了两种 AttemptTimeLimiter：

1. NoAttemptTimeLimit：不限制执行时间
2. FixedAttemptTimeLimit：限制执行时间为固定值

### 监听器

可以通过 withRetryListener 方法为重试器注册***，每次重试结束后，会按注册顺序依次回调 Listener 的 onRetry 方法，可在其中获取到当前执行的信息，比如重试次数等。

示例代码如下：

~~~java
import com.github.rholder.retry.Attempt;
import com.github.rholder.retry.RetryListener;
 
public class MyRetryListener<T> implements RetryListener {
 
    @Override
    public <T> void onRetry(Attempt<T> attempt) {
        // 第几次重试,(注意:第一次重试其实是第一次调用)
        System.out.print("[retry]time=" + attempt.getAttemptNumber());
 
        // 距离第一次重试的延迟
        System.out.print(",delay=" + attempt.getDelaySinceFirstAttempt());
 
        // 重试结果: 是异常终止, 还是正常返回
        System.out.print(",hasException=" + attempt.hasException());
        System.out.print(",hasResult=" + attempt.hasResult());
 
        // 是什么原因导致异常
        if (attempt.hasException()) {
            System.out.print(",causeBy=" + attempt.getExceptionCause().toString());
        } else {
            // 正常返回时的结果
            System.out.print(",result=" + attempt.getResult());
        }
    }
}
~~~

## 执行

执行是通过call方法来执行，打开call方法

~~~java
 public V call(Callable<V> callable) throws ExecutionException, RetryException {
        long startTime = System.nanoTime();//记录开始时间
        int attemptNumber = 1; //初始化重试次数

        while(true) {
            Object attempt;
            try {
                V result = this.attemptTimeLimiter.call(callable); //执行callable方法，获取attempt对象
                attempt = new Retryer.ResultAttempt(result, (long)attemptNumber, TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime));
            } catch (Throwable var9) {
                attempt = new Retryer.ExceptionAttempt(var9, (long)attemptNumber, TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime));
            }

            Iterator i$ = this.listeners.iterator();

            while(i$.hasNext()) { //执行我们配置的监听器，重试之后做些什么
                RetryListener listener = (RetryListener)i$.next();
                listener.onRetry((Attempt)attempt);
            }

            if (!this.rejectionPredicate.apply(attempt)) { //返回执行callable出现异常的attempt
                return ((Attempt)attempt).get();
            }

            if (this.stopStrategy.shouldStop((Attempt)attempt)) { //根据停止策略，是否重试
                throw new RetryException(attemptNumber, (Attempt)attempt);
            }
		   //等待策略计算休眠时间
            long sleepTime = this.waitStrategy.computeSleepTime((Attempt)attempt);

            try {
                //阻塞策略执行休眠
                this.blockStrategy.block(sleepTime);
            } catch (InterruptedException var10) {
                Thread.currentThread().interrupt();
                throw new RetryException(attemptNumber, (Attempt)attempt);
            }

            ++attemptNumber;
        }
    }
~~~

