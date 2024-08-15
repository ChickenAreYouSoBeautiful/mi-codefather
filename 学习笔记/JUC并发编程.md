# JUC并发编程
## 学习大纲

JUC学习框架

- JUC高并发编程内容
- JUC概念
- Lock接口
- 线程间通信
- 集合的线程安全
- Callable接口
- JUC三大辅助类
- CountDowLatch
- CyclicBarrier
- Semaphore
- 读写锁：ReentrantReadWriteLock
- 阻塞队列
- ThreadPoll线程池
- Fork/Join 框架
- CompletableFuture

## JUC概述

### JUC概述

JUC是`Java Util Concurrent`的简称，是Java 5及以后版本中新增的用于支持高并发编程的包。JUC提供了一些线程安全的集合类、原子类、锁、信号量、倒计数器、栅栏等用于并发编程的类和接口，以帮助Java开发者编写高效、安全、稳定的多线程程序。

在传统的Java多线程编程中，开发者使用synchronized关键字来保证线程的同步和协作，但是synchronized存在一些问题，比如**只能使用在方法或代码块中、一旦持有锁就无法被其他线程获取等**。JUC提供了更加灵活、功能更加强大的同步机制，如**Lock接口、Condition接口、Semaphore类、CountDownLatch类、CyclicBarrier类**等，可以更好地帮助开发者解决线程同步和协作的问题。

除此之外，JUC还提供了一些并发集合类和原子类，这些类可以在多线程环境下安全地进行操作，从而避免了多线程同时修改数据时的竞争问题，提高了并发编程的效率和稳定性。

总的来说，JUC提供了一组强大的并发编程工具，可以帮助Java开发者更好地利用多核CPU的优势，提高应用程序的并发性能，从而更好地满足现代应用对高并发处理的需求。

### JUC内容

JUC（Java Util Concurrent）是Java 5及以后版本中新增的用于支持高并发编程的包，其中包含了很多用于并发编程的类和接口，主要包括以下内容：

1. 并发集合类：JUC中提供了一些线程安全的集合类，如ConcurrentHashMap、CopyOnWriteArrayList、ConcurrentLinkedQueue等，这些类可以在多线程环境下安全地进行操作，从而避免了多线程同时修改数据时的竞争问题。
2. 原子类：JUC中提供了一些原子类，如AtomicInteger、AtomicLong、AtomicBoolean等，这些类可以保证在多线程环境下的原子性操作，避免了多线程同时修改数据时的竞争问题。
3. Lock接口：JUC中提供了一组Lock接口及其实现类，如ReentrantLock、ReentrantReadWriteLock等，Lock接口提供了比synchronized更加灵活的锁操作，可以更精确地控制线程的并发访问。
4. Condition接口：JUC中提供了Condition接口，可以与Lock接口配合使用，实现更加灵活的线程等待和唤醒操作。
5. Semaphore类：Semaphore是一种计数信号量，可以用来限制同时访问某个资源的线程数。
6. CountDownLatch类：CountDownLatch是一种倒计数器，可以用来实现等待多个线程完成后再执行某个操作。
7. CyclicBarrier类：CyclicBarrier是一种栅栏，可以用来等待多个线程都到达某个状态后再一起执行。

JUC提供的这些类和接口，可以帮助Java开发者更好地编写高效、安全、稳定的多线程程序，从而充分利用多核CPU的优势，提高应用程序的并发性能。

### 进程和线程

#### 进程

进程是计算即分配资源的最小单元，一个线程中包换多个进程，每个进程都有自己独立的内存空间和系统资源。

#### 线程

**线程是进程中的一个执行单元，是操作系统运算调度的最小单元**，在一个进程中，多个线程可以共享相同的内存空间和系统资源，可以方便地进行通信和数据共享。线程之间的切换开销较小，可以更加高效地实现并发任务 

由于进程之间的切换开销较大，所以多线程的应用比多进程的应用更加高效，可以更好地利用计算机的资源，提高应用程序的性能。同时，线程之间的共享内存和数据的操作需要进行同步和互斥，否则会出现数据竞争和死锁等问题，因此在多线程编程中需要注意线程的同步和互斥问题。

### 线程状态

创建

就绪

运行

阻塞

死亡

#### 线程状态枚举

1. NEW   创建
2. RUNNABLE   就绪
3. BLOCKED  阻塞
4. WAITING 等待
5. TIMED_WAITING   定时等待
6. TERMINATED  死亡

#### wait和sleep的区别

1. sleep 是 Thread 的静态方法，wait 是 Object 的方法，任何对象实例都能调用。
2. sleep 不会释放锁，它也不需要占用锁。wait 会释放锁，但调用它的前提是当前线程占有锁(即代码要在 synchronized 中)。 （在哪里睡就在那里醒来）
3. 它们都可以被 interrupted 方法中断。

### 并行和并发

#### 并发

同一时间多个线程访问同一个资源。

#### 并行

多个线程一起执行，之后再汇总。

### 管程

管程(monitor)是保证了同一时刻只有一个进程在管程内活动，即管程内定义的操作在同一时刻只被一个进程调用(由编译器实现)。但是这样并不能保证进程以设计的顺序执行。

JVM 中同步是基于进入和退出管程(monitor)对象实现的，每个对象都会有一个管程 (monitor)对象，管程(monitor)会随着 java 对象一同创建和销毁 执行线程首先要持有管程对象，然后才能执行方法，当方法完成之后会释放管程，方 法在执行时候会持有管程，其他线程无法再获取同一个管程。

在Java中管程就是一种锁机制。

### 用户线程和守护线程

#### 用户线程

它就是是我们平时用到的普通线程，自定义线程。

#### 守护线程

它运行在后台，是一种特殊的线程，比如垃圾回收，当主线程结束后,用户线程还在运行，JVM存活；如果没有用户线程，都是守护线程，JVM 结束 

~~~java
//设置守护线程
thread.setDaemon(true);
~~~

## Lock接口

### synchronized锁

synchronized是java种的关键字，是一种同步锁，他可以修饰类，代码块，方法

1. 修饰一个代码块，被修饰的代码块称为同步语句块，其作用的范围是大括号{} 括起来的代码，作用的对象是调用这个代码块的对象；
2. 修饰一个方法，被修饰的方法称为同步方法，其作用的范围是整个方法，作用 的对象是调用这个方法的对象；
3. 修改一个静态的方法，其作用的范围是整个静态方法，作用的对象是这个类的 所有对象；
4. 修改一个类，其作用的范围是 synchronized 后面括号括起来的部分，作用主 的对象是这个类的所有对象。

如果一个代码块被** synchronized 修饰了，当一个线程获取了对应的锁，并执行该代码块时，其他线程便只能一直等待，等待获取锁的线程释放锁**，而这里获取锁的线程释放锁只会有两种情况：

1. 获取锁的线程执行完了该代码块，然后线程释放对锁的占有
2. 线程执行发生异常，此时 JVM 会让线程**自动释放锁。**

那么如果这个获取锁的线程由于要等待 IO 或者其他原因（比如调用 sleep 方法）被阻塞了，但是又没有释放锁，其他线程便只能干巴巴地等待，试想一 下，这多么影响程序执行效率。 因此就需要有一种机制可以不让等待的线程一直无期限地等待下去（比如只等 待一定的时间或者能够响应中断），通过 Lock 就可以办到。**synchronized**会自动释放锁，Lock需要手动释放。

### 什么是Lock

Lock锁提供了更广泛的锁操作，它们允许更灵活的结构，可能具有不同的属性，Lock提供了比synchronized更多的功能。

#### Lock和synchronizd 区别

1. synchronized是java的关键字，Lock是一个接口
2. Lock需要手动添加和释放锁。而synchronized不需要。

#### lock方法

用于获取锁

~~~java
Lock lock = new 
lock.lock();
~~~

#### newCondition(条件线程唤醒)

Lock锁的newCondition可以获取到Condition对象，可以通过await让当前线程进行等待，signal唤醒另一个线程。



Lock 和 synchronized 有以下几点不同：

1. Lock 是一个接口，而 synchronized 是 Java 中的关键字，synchronized 是内 置的语言实现；
2. synchronized 在发生异常时，会自动释放线程占有的锁，因此不会导致死锁现 象发生；而 Lock 在发生异常时，如果没有主动通过 unLock()去释放锁，则很 可能造成死锁现象，因此使用 Lock 时需要在 finally 块中释放锁；
3. Lock 可以让等待锁的线程响应中断，而 synchronized 却不行，使用 synchronized 时，等待的线程会一直等待下去，不能够响应中断；
4. 通过 Lock 可以知道有没有成功获取锁，而 synchronized 却无法办到。
5. Lock 可以提高多个线程进行读操作的效率。 在性能上来说，如果竞争资源不激烈，两者的性能是差不多的，而当竞争资源 非常激烈时（即有大量线程同时竞争），此时 Lock 的性能要远远优于 synchronized。

## 线程间通信

线程间通信的模型有两种，共享内存和消息传递，以下方式都是基本于这两种方式实现的。

### 多线程编程步骤

创建资源类，在资源类中创建属性和操作方法 

在资源列中操作方法 

创建多个线程，调用资源类的操作方法 

防止**虚假唤醒问题**

例子：有两个线程，实现对一个初始值是0的变量的操作，一个线程对值 + 1 ，另一个线程对值 -1 

~~~java
package example;

/**
 * 线程间的通信
 * @author mi11
 * @version 1.0
 * @project guc
 * @description
 * @ClassName Share
 */
//创建资源类
public class Share {

    //初始值
    private  int number = 0;



    public synchronized  void increase() throws InterruptedException {
        if (number != 0){
            this.wait();
        }
        number++;
        System.out.println(Thread.currentThread().getName()+"::"+number);
        //通知
        this.notify();
    }

    public synchronized void decrease() throws InterruptedException {
        if (number == 0){
            this.wait();
        }

        number--;
        System.out.println(Thread.currentThread().getName()+"::"+number);
//        通知
        this.notify();
    }
}

class ThreadDemo{
    public static void main(String[] args) {
        Share share = new Share();

        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    try {
                        share.increase();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        },"加一").start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    try {
                        share.decrease();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        },"减一").start();
    }
}
~~~

### 线程间定制化通讯

按照指定线程顺序进行操作：启动三个线程A、B、C，A 线程打印 5 次，B 线程打印 10 次，C 线程打印 15 次，按照此顺序循环 10轮 

~~~java
package example;

import java.time.LocalDate;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description +
 * @ClassName ShareResource
 */
public class ShareResource {

    //标识
    private int flag = 1;

    private Lock lock = new ReentrantLock();

    private Condition c1 = lock.newCondition();
    private Condition c2 = lock.newCondition();
    private Condition c3 = lock.newCondition();

    public void printFive(int loop){

        lock.lock();
        try {
            while (flag != 1){
                c1.await();
            }

            for (int i = 0; i < 5; i++) {
                System.out.println(Thread.currentThread().getName()+"循环值"+i+"弟"+loop+"次");
            }
            flag = 2;
            c2.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }


    public void printTen(int loop){

        lock.lock();
        try {
            while (flag != 2){
                c2.await();
            }

            for (int i = 0; i < 10; i++) {
                System.out.println(Thread.currentThread().getName()+"循环值"+i+"弟"+loop+"次");
            }
            flag = 3;
            c3.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }

    public void printFifteen(int loop){

        lock.lock();
        try {
            while (flag != 3){
                c3.await();
            }

            for (int i = 0; i < 15; i++) {
                System.out.println(Thread.currentThread().getName()+"循环值"+i+"弟"+loop+"次");
            }

            flag = 1;
            c1.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
}

class ShareResourceDemo{
    public static void main(String[] args) {
        ShareResource shareResource = new ShareResource();
        //循环次数
        int loop = 5;
        new Thread(() -> {
            for (int i = 0; i < loop; i++) {
                shareResource.printFive(i);
            }
        },"线程1").start();

        new Thread(() -> {
            for (int i = 0; i < loop; i++) {
                shareResource.printTen(i);
            }
        },"线程2").start();

        new Thread(() -> {
            for (int i = 0; i < loop; i++) {
                shareResource.printFifteen(i);
            }
        },"线程3").start();


    }
}
~~~

## 集合线程安全问题

由于ArrayList的add方法没有天添加synchronize关键字所以是线程不安全的，所以在多线程的执行add操作时会出现异常。

解决线程的并发修改异常有基本的三种

1. Vertor
2. Collections
3. CopyOnWriteArrayList

### Vertor 和 Collections

Vector 是矢量队列，它是 JDK1.0 版本添加的类。继承于 AbstractList，实现了 List, RandomAccess, Cloneable 这些接口。 Vector 继承了 AbstractList， 实现了List；所以，它是一个队列，支持相关的添加、删除、修改、遍历等功 能。 Vector 实现了 RandmoAccess 接口，即提供了随机访问功能。 RandmoAccess 是 java 中用来被 List 实现，为 List 提供快速访问功能的。在 Vector 中，我们即可以通过元素的序号快速获取元素对象；这就是快速随机访问。 Vector 实现了 Cloneable 接口，即实现 clone()函数。它能被克隆

和 ArrayList 不同，Vector 中的操作是线程安全的。

### CopyOnWriteArrayList

它相当于线程安全的 ArrayList。和 ArrayList 一样，它是个可变数组；但是和 ArrayList 不同的时，它具有以下特性：

1. 它最适合于具有以下特征的应用程序：List 大小通常保持很小，只读操作远多 于可变操作，需要在遍历期间防止线程间的冲突。
2. 它是线程安全的。
3. 因为通常需要复制整个基础数组，所以可变操作（add()、set() 和 remove() 等等）的开销很大。
4. 迭代器支持 hasNext(), next()等不可变操作，但不支持可变 remove()等操作。
5. 使用迭代器进行遍历的速度很快，并且不会与其他线程发生冲突。在构造迭代器时，迭代器依赖于不变的数组快照。

最主要的特点：

- 独占锁效率低：采用读写分离思想解决
- 写线程获取到锁，其他写线程阻塞

CopyOnWriteArrayList 的 复制思想：

当我们往一个容器添加元素的时候，不直接往当前容器添加，而是先将当前容器进行 Copy，**复制**出一个新的容器，然后新的容器里添加元素，添加完元素之后，再将原容器的引用指向新的容器（**合并**）。

这时候会抛出来一个新的问题，也就是数据不一致的问题。如果写线程还没来 得及写会内存，其他的线程就会读到了脏数据。 **这就是 CopyOnWriteArrayList 的思想和原理：就是拷贝一份。**

这样创建也不会出现线程安装问题。

原因分析(重点)：**动态数组与线程安全** 下面从“动态数组”和“线程安全”两个方面进一步对 CopyOnWriteArrayList 的原理进行说明。

**动态数组机制**

- 它内部有个“**volatile 数组**”(array)来保持数据。在“添加/修改/删除”数据 时，都会新建一个数组，并将更新后的数据拷贝到新建的数组中，最后再将该 数组赋值给“volatile 数组”, 这就是它叫做 CopyOnWriteArrayList 的原因
- 由于它在“添加/修改/删除”数据时，都会新建数组，所以涉及到修改数据的 操作，CopyOnWriteArrayList 效率很低；但是单单只是进行遍历查找的话， 效率比较高。

**线程安全机制**

- 通过 volatile 和互斥锁来实现的。
- 通过“volatile 数组”来保存数据的。一个线程读取 volatile 数组时，总能看 到其它线程对该 volatile 变量最后的写入；就这样，通过 volatile 提供了“读 取到的数据总是最新的”这个机制的保证。
- 通过互斥锁来保护数据。在“添加/修改/删除”数据时，会先“获取互斥锁”， 在修改完毕之后，先将数据更新到“volatile 数组”中，然后再“释放互斥锁”，就达到了保护数据的目的。

### HashSet 和 HashMap解决线程不安全

#### set集合

~~~java
Set<String> arrayList = new CopyOnWriteArraySet<String>();
~~~

#### Map集合

~~~java
Map<String, String> hashMap = new ConcurrentHashMap<>();
~~~

1. 线程安全与线程不安全集合：集合类型中存在线程安全与线程不安全的两种,

   常见例如: ArrayList ----- Vector HashMap -----HashTable 但是以上都是通过 synchronized 关键字实现，**效率较低**

2. Collections 构建的线程安全集合

3. `java.util.concurrent `并发包下 CopyOnWriteArrayList CopyOnWriteArraySet 类型,通过动态数组与线程安 全个方面保证线程安全

## 多线程锁

**一个对象里面如果有多个 synchronized 方法，某一个时刻内，只要一个线程去调用其中的 一个 synchronized 方法， 其它的线程都只能等待，换句话说，某一个时刻内，只能有唯一一个线程去访问这些 synchronized 方法。**

锁的是当前对象 this，被锁定后，其它的线程都不能进入到当前对象的其它的 synchronized 方法

加个普通方法后发现和同步锁无关，换成两个对象后，不是同一把锁了，情况立刻变化。

synchronized 实现同步的基础：Java 中的每一个对象都可以作为锁。 具体表现为以下 3 种形式。

1. 对于普通同步方法，锁是当前实例对象（this）
2. 对于静态同步方法，锁是当前类的 Class 对象。
3. 对于同步方法块，锁是 Synchonized 括号里配置的对象

> 当一个线程试图访问同步代码块时，它首先必须得到锁，退出或抛出异常时必须释放锁。 也就是说如果一个实例对象的非静态同步方法获取锁后，该实例对象的其他非静态同步方 法必须等待获取锁的方法释放锁后才能获取锁， 可是别的实例对象的非静态同步方法因为跟该实例对象的非静态同步方法用的是不同的锁， 所以不需要等待该实例对象已获取到锁的非静态同步方法释放锁就可以获取他们自己的锁。

所有的**静态同步方法用的也是同一把锁——类对象本身**，这两把锁是两个不同的对象，所以静态同步方法与非静态同步方法之间是不会有竞态条件的。

但是**一旦一个静态同步方法获取锁后，其他的静态同步方法都必须等待该方法释放锁后才 能获取锁**，而不管是同一个实例对象的静态同步方法之间，还是不同的实例对象的静态同 步方法之间，只要它们同一个类的实例对象！

~~~markdown
在多线程编程中，为了避免多个线程同时访问共享资源导致的数据不一致或错误，我们可以使用锁来进行同步机制。

锁是一种用于控制并发访问的机制，它可以保证在任意时刻只有一个线程可以访问被锁定的资源，
其他线程必须等待锁的释放后才能访问该资源。

常见的锁有互斥锁、信号量、读写锁等。

互斥锁是最基本的锁，它要求同一时刻只有一个线程可以访问被锁定的资源，
其他线程必须等待锁的释放后才能访问该资源。

信号量是一种比互斥锁更加灵活的锁，它可以支持多个线程并发访问资源，但需要满足一定的条件才能获得锁。
例如，如果信号量的值为0，则只有等待的线程可以获得锁，其他线程必须等待。

读写锁是一种可以同时读取和写入共享资源的锁，它允许多个线程同时读取共享资源，但写入时必须获得锁。

总之，锁是一种重要的同步机制，可以帮助我们在多线程编程中避免数据不一致或错误。

~~~

### 公平锁和非公平锁

公平锁和非公平锁的主要区别在于线程获取锁的顺序和公平性，公平锁保证了线程按照申请锁的顺序获取锁，公平性号，但可能会导致线程等待时间较长；而非公平锁则允许某些线程相对于其他线程具有更高获取锁的机会，整体效率较高。但可能会产生饥饿现象

### 可重入锁

synchronized和Lock都是可重入锁，获取一次锁之后就可以自由进出，因为他是这把锁的拥有者，因此有权利再次获取这把锁。如果是不可重入锁，第二次获取时就会将自己也拦住。

~~~java
package example;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description
 * @ClassName EnableInLock
 */
public class EnableInLock {
    public static void main(String[] args) {
        Object o = new Object();
        new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (o){
                    System.out.println("外层");
                    synchronized (o){
                        System.out.println("中层");
                        synchronized (o){
                            System.out.println("内层");
                        }
                    }
                }
            }
        }).start();

    }
}
~~~

### 死锁

#### 什么是死锁

两个及以上线程在执行过程中，因争夺资源造成一种相互等待的现象，如没有外力干涉会一直阻塞。

线程A和线程B同时访问同一个资源，访问这个资源需要持有锁A和锁B。当线程A持有锁A试图获取锁B，线程B持有锁B试图获取线程A时，锁B在线程B手中线程A获取不到就会一直阻塞尝试获取，锁A同理。互相阻塞就会产生死锁。

#### 产生死锁的原因

1. 系统资源不足
2. 进程运行推进顺序不当
3. 资源分配不当

~~~java
//排查
//查看进程号
jps   
jstack 进程号
~~~

## Callable接口

创建线程的方法，有继承Thread类，实现Runnable接口。但是缺少一项功能，当run方法执行完任务后无法使线程返回结果，为了支持此功能，java提供了Callable接口。

Callable接口特点：

- 为了实现 Runnable，需要实现不返回任何内容的 run())方法，而对于 Callable，需要实现在完成时返回结果的 cal()方法。
- call() 方法可以引发异常，而 run() 则不能。
- 为实现 Callable 而必须重写 call()方法
- 不能直接替换 runnable，因为 Thread 类的构造方法根本没有 Callable

### Future接口

当 call() 方法完成时，结果必须存储在主线程已知的对象中，以便主线程可以知道该线程返回的结果。为此，可以使用 Future 对象。

将 Future 视为保存结果的对象，它可能暂时不保存结果，一旦Callable 返回将会进行保存。Future 基本上是**主线程可以跟踪进度以及得到其他线程的结果的一种方式**。要实现此接口，必须重写 5 种方法，这里列出了重要的方法，如下:

1. public boolean cancel（boolean mayInterrupt）：用于停止任务。如果尚未启动，它将停止任务。如果已启动，则仅在 mayInterrupt 为 true 时才会中断任务。
2. public Object get() 抛出 InterruptedException，ExecutionException： 用于获取任务的结果。如果任务完成，它将立即返回结果，否则将等待任务完成，然后返回结果。
3. public boolean isDone() ：如果任务完成，则返回 true，否则返回 false

可以看到 Callable 和 Future 做两件事，Callable 与 Runnable 类似，因为它封装了要在另一个线程上运行的任务，而 Future 用于存储从另一个线程获得的结果。实际上，future 也可以与 Runnable 一起使用。

### FutureTask

Java 库具有具体的 FutureTask 类型，该类型实现 Runnable 和 Future，并方便地将两种功能组合在一起。 可以通过为其构造函数提供 Callable 来创建 FutureTask。然后，将 FutureTask 对象提供给 Thread 的构造函数以创建 Thread 对象。因此，间接地使用 Callable 创建线程。

### 核心原理:(重点)

1. 在主线程中需要执行比较耗时的操作时，但又不想阻塞主线程时，可以把这些任务交给 Future 对象在后台完成
2. 当主线程将来需要时，就可以通过 Future 对象获得后台任务的计算结果或者执行状态，
3. 一般 FutureTask 多用于耗时的计算，**主线程可以在完成自己的任务后，再去获取结果**
4. 仅在计算完成时才能检索结果；如果计算尚未完成，则阻塞 get 方法，一旦计算完成，就不能再重新开始或取消计算
5. get 方法获取结果只有在计算完成时获取，否则会一直阻塞直到任务转入完成状态，然后会返回结果或者抛出异常
6. get **只计算一次，因此 get 方法放到最后**。

~~~java
package example;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description
 * @ClassName CallableDemo
 */
public class CallableDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        new Thread(new RunnableThread(),"runnable").start();
        FutureTask<Integer> integerFuture = new FutureTask<Integer>(new CallableThread());
        FutureTask<Integer> integerFutureTask = new FutureTask<>(() -> {
            System.out.println(Thread.currentThread().getName() + "进入callable");
            return 456;
        });
        new Thread(integerFuture,"f1").start();
        new Thread(integerFutureTask,"f2").start();

        while (!integerFuture.isDone()){
            System.out.println("...");
        }

        System.out.println(integerFuture.get());
        System.out.println(integerFutureTask.get());
        System.out.println(Thread.currentThread().getName()+"结束");
    }
}

class RunnableThread implements Runnable{

    @Override
    public void run() {

    }
}

class CallableThread implements Callable{

    @Override
    public Object call() throws Exception {
        System.out.println(Thread.currentThread().getName()+"进入callable");
        return 123;
    }
}

~~~

## JUC三大辅助类

### 减少计数CountDownLatch

CountDownLatch 类可以设置一个计数器，然后通过countDown方法来进行减一的操作。使用await 方法等待技术器不大于0时，await 等待的线程将被唤醒继续执行程序。

例子： 10个同学陆续离开教室后，最后值日的同学才能关门。

~~~java
package example;

import java.util.concurrent.CountDownLatch;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description 减少计数
 * @ClassName CountDownLatchDemo
 */
public class CountDownLatchDemo {

    public static void main(String[] args) throws InterruptedException {

        CountDownLatch countDownLatch = new CountDownLatch(10);

        for (int i = 1; i <= 10; i++) {
            new Thread(() ->{
                System.out.println(Thread.currentThread().getName()+"学生离开了教室");
                //计数-1
                countDownLatch.countDown();
            },String.valueOf(i)).start();
        }
        countDownLatch.await();
        System.out.println("值日生离开关闭了教室");
    }
}
~~~

### 循环栅栏CyclicBarrier

CyclicBarrier 的构造方法第一个参数是障碍数，第二个参数是到达参数一配置的障碍数之后执行的回调函数。使用await 方法会使障碍数加一。

```java
package example;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description 循环栅栏
 * @ClassName CyclicBarrierDemo
 */
public class CyclicBarrierDemo {

    public static void main(String[] args) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7, () -> {
            System.out.println("集齐七个龙珠，你无敌了。");
        });

        for (int i = 1; i <= 7; i++) {
            new Thread(()->{
                try {
                    System.out.println(Thread.currentThread().getName()+"星龙珠，已找到");
                    cyclicBarrier.await();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            },String.valueOf(i)).start();
        }
    }
}
```

### 信号灯 Semaphore

Semaphore 类的构造方法第一个参数为最大信号量，类似于令牌通，获取令牌后才能接着往下走。利用acquire获取通行证，获取之后其他线程阻塞，rekease 方法释放之后，其他线程才可继续去获取。

例子： 六辆汽车抢占三个车位。

~~~java
package example;

import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description 信号量
 * @ClassName SeamphoreDemo
 */
public class SemaphoreDemo {
    public static void main(String[] args)   {
        //三个车位
        Semaphore semaphore = new Semaphore(3);
        //模拟六量车
        for (int i = 1; i <= 6; i++) {

            new Thread(()->{
                try {
                    //抢占
                    semaphore.acquire();

                    System.out.println(Thread.currentThread().getName()+"号车抢占到了车位");
                    //停车等待
                    TimeUnit.SECONDS.sleep(new Random().nextInt(5));

                    System.out.println(Thread.currentThread().getName()+"离开了车位");

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    System.out.println(Thread.currentThread().getName()+"释放了车位");
                    //释放
                    semaphore.release();
                }
            },String.valueOf(i)).start();

        }
    }
}

~~~

## 读写锁

### 读写锁介绍

一个资源可以被多个线程访问，但不能同时被读写线程访问，读写互斥，读读共享

有这样一个场景：对共享资源的读和写的操作，多个线程同时读取一个资源没有问题，所以应该允许多个线程进行读取。但一个线程想去写这些共享资源，就不能允许其他线程读或者写了。

javab并发包里提供了读写锁，ReentrantReadWirteLock，他有两个锁，一个读锁称为共享锁，一个写锁称为排他锁。

### 读写锁案例实现

模拟缓存：

~~~java
package example;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * 读写锁
 *
 * @author mi11
 * @version 1.0
 * @project guc
 * @description
 * @ClassName ReentrantReadWriteLockDemo
 */
public class ReentrantReadWriteLockDemo {

    private volatile Map<String, Object> map = new HashMap<>();

    private ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    /**
     * 读取
     * @param key
     */
    public void readMap(String key) {
        readWriteLock.readLock().lock();
        try {
            System.out.println("读取key:" + key);
            TimeUnit.MILLISECONDS.sleep(300);
            Object val = map.get(key);
            System.out.println(val.toString());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.readLock().unlock();
        }

    }

    /**
     * 写入
     * @param key
     * @param value
     */
    public void writeMap(String key,Integer value) {
        readWriteLock.writeLock().lock();
        try {
            System.out.println("写入key:" + key);
            TimeUnit.MILLISECONDS.sleep(300);
             map.put(key,value);
            System.out.println(value.toString());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.writeLock().unlock();
        }

    }

    public static void main(String[] args) {
        ReentrantReadWriteLockDemo readWriteLockDemo = new ReentrantReadWriteLockDemo();

        for (int i = 0; i < 5; i++) {
             int number = i;
            new Thread(() ->{
                readWriteLockDemo.writeMap(String.valueOf(number),number);
            },String.valueOf(i)).start();
        }

        for (int i = 0; i < 5; i++) {
            int number = i;
            new Thread(() ->{
                readWriteLockDemo.readMap(String.valueOf(number));
            },String.valueOf(i)).start();
        }

    }


}
~~~

### 读写锁降级

锁降级是指将当前吃药锁的等级从高级降低到低级别，通常情况下我们会在业务处理代码中加锁，为了避免死锁和性能问题。有时需要在代码执行期间进行锁降级。

锁降级的主要目的是在持有高等级锁时不需要获取低等级锁就可以执行持有低等级锁才能执行的操作，不需要释放高级所后再去获取低级锁执行操作。

锁降级操作一般有以下几个步骤：

1. 获取高级别锁
2. 执行高级别锁才能执行的逻辑
3. 获取低级别锁
4. 释放高级别锁
5. 使用低级别锁
6. 释放低级别锁

总的来说，锁降级可以避免程序在执行期间频繁的获取和释放锁，提高并发性能和降低死锁等问题的发生。

大致流程： 获取写锁 -> 获取读锁 -> 释放写锁 -> 释放读锁 

~~~java
package example;

import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description
 * @ClassName LowerLockDemo
 */
public class LowerLockDemo {
    public static void main(String[] args) {
        ReentrantReadWriteLock reentrantReadWriteLock = new ReentrantReadWriteLock();
        ReentrantReadWriteLock.ReadLock readLock = reentrantReadWriteLock.readLock();
        ReentrantReadWriteLock.WriteLock writeLock = reentrantReadWriteLock.writeLock();
        writeLock.lock();
        System.out.println("高级锁写锁");
        readLock.lock();
        System.out.println("低级锁读锁");
        writeLock.unlock();
        readLock.unlock();

    }
}
~~~

读锁不能升级为写锁，低级锁不能升级成高级锁。因为当线程获取读锁时，可能有其他线程同时持有此锁，因此不能把获取读锁的线程升级为写锁。而对于获得写锁的线程他一定独占了读写锁，因此可以继续让它获取读锁.，当它同时获取了写锁和读锁后，还可以先释放写锁继续持有读锁，这样一个写锁就降级为了读锁。

### 悲观锁

悲观锁是一种保守的锁策略，其核心思想是在访问共享资源时，可能会有其他线程会对资源进行修改，因此采取加锁的方式阻止其他线程的干扰。常见的实现方式是synchronized关键字或ReentrantLock等锁对象。

当一个线程进行操作时会先上锁，阻塞别的线程，知道锁释放后，其他线程才可以继续操作，抢锁进行操作。

**悲观锁的优点**

1. 可以保证并发访问的安全性，避免数据的脏读，幻读等问题。
2. 悲观锁使用于写操作多，读操作少的场景，可以减少写冲突的发生，提高性能并发。

**悲观锁的缺点**

1. 悲观锁会在访问共享资源时，阻塞其他线程的访问，降低并发性能。
2. 不支持并发操作，只能一个人一个人的进行操作，导致效率性能降低。
3. 悲观锁对性能的影响和加锁的范围有关。
4. 如果悲观锁的加锁粒度太小，会导致线程频繁加锁释放，从而造成性能瓶颈

总的来说，悲观锁虽然能保证并发访问安全，但是会导致性能的下降，需要权衡后使用。

### 乐观锁

乐观锁是一种乐观的锁策略，其核心思想是在访问共享资源时假设不会发生冲突，因此不会阻塞其他线程的访问，而是在更新共享资源时检查是是否有其他线程对资源进行修改。常见的实现方式有版本号机制和CAS（Compare And Swap ）比较并交换，CAS是乐观锁实现的一种机制。

- CAS它在更新数据时不会先加锁，而是比较原值，如果值没有被修改，就更新数据。这种方式在并发不高的情况下，性能会比使用锁更好。

**乐观锁的优点**

1. 读操作多，写操作少的场景下，乐观锁可以提高并发性能。
2. 乐观锁不会阻塞其他线程，避免加锁和释放的开销
3. 乐观锁实现成本更低。

**乐观锁缺点**

1. 乐观锁并不能保证并发的安全性，存在数据冲突问题，丢失问题；
2. 乐观锁的实现方式需要在更新共享资源时检查是否有其他线程进行干扰，如果存在干扰需要进行重试。
3. 乐观锁不适用于写操作频发的场景。

总的来说，乐观锁适用于读操作多，写操作少的场景，但在一些高并发写操作时可能会出现数据冲突。

### 表锁和行锁

表锁是指对整个表进行加锁，当一个事务访问某个表时，会对整个表进行加锁，其他事务就无法对表进行增，删，改操作。

优点：实现简单，对于一些只读的表可以提高并发性能。

缺点：并发性能较低，会对整个表进行加锁，影响其他事务的操作。



行锁是指对表中的一行或多行进行加锁，当对一个事务访问访问某一个表时，只对要访问的行进行加锁1，其他行不受影响。

优点： 并发性能高，只对需要访问的行加锁，不会影响其他事务的操作。

缺点:  实现复杂，需要保证行级锁的粒度不会过细，否则会降低并发性能，可能会出现死锁状态。



在实际应用中，如果只有读操作，可以采用表锁提高并发性能；如果有较多的写操作，应该采用行锁来避免数据冲突。

##  阻塞队列

### BlockingQueue 简介

阻塞队列，首先它是一个队列（先进先出），通过一个共享的队列，可以使得数据由队列的一端输入，从另一端输出；

- 当队列是空的，从队列中获取元素的操作会被阻塞
- 当队列是满的，从队列中添加元素的操作会被阻塞
- 试图从空的队列中获取元素会被阻塞，直到队列被插入新的元素
- 试图从满的队列中插入元素会被阻塞，直到队列中的元素被移除一个或多个

常用的队列：

- 先进先出： 先插入的队列的元素也最先出队列，类似于排队的功能
- 后进先出： 后插入的队列元素先出队列，类似于栈

AQS使用一个内部的FIFO队列来管理阻塞的线程。当一个线程如果没有获取到锁或没有达到需要的条件，它会被放入到队列中进行等待，直到它的状态变为可获取。

AQS（AbstractQueuedSynchronizer）在维护阻塞队列方面起着核心作用。当线程尝试获取锁但失败时，AQS会将这些线程封装成节点并加入到阻塞队列中。这个阻塞队列是一个双向队列，用于暂时存放获取不到锁的线程。

#### 多线程阻塞

在多线程领域，在某些情况下会挂起线程（即阻塞），一旦条件满足，被挂起的线程又会被自动唤醒

使用BlockingQueue的好处就是我们不需要关心什么时候阻塞什么时候唤醒线程，因为BlockIngQueue都帮助我们实现了。

多线程环境中，通过队列可以很方便的实现数据的共享，比如生产者和消费者，生产者需要把需要共享的数据放入队列里，消费者去队列里取到生产者提供的共享数据进行消费。

- 当队列中没有数据时，消费者线程挂起，直到有数据放入到队列中。
- 当队列中被填满数据时，生产者线程挂起，直到队列中数据被消费。

###  BlockingQueue 实现类

#### ArrayBlockingQueue(常用)

- 由数组结构组成的有界阻塞队列

#### LinkedBlockingQueue(常用)

- 由链表结构组成的有界阻塞队列，大小默认为Integer,MAX_VALUE

#### DelayQueue

- 使用优先级队列实现的延迟无界阻塞队列

#### PriorityBlockingQueue

基于优先级的阻塞队列（优先级的判断通过构造函数传入的 Compator 对象来 决定），但需要注意的是 PriorityBlockingQueue 并不会阻塞数据生产者，而只会在没有可消费的数据时，阻塞数据的消费者。 因此使用的时候要特别注意，生产者生产数据的速度绝对不能快于消费者消费 数据的速度，否则时间一长，会最终耗尽所有的可用堆内存空间。

在实现 PriorityBlockingQueue 时，内部控制线程同步的锁采用的是公平锁

- 支持优先级排序的无界阻塞队列

#### SynchronousQueue

- 不存储元素的阻塞队列，也即单个元素的队列

#### LinkedTransferQueue

- 由链表组成的无界阻塞队列

#### LinkedBlockingDeque

- 由链表组成的双向阻塞队列

### BlockingQueue核心方法

#### 放入数据

- `offer(anObject)`：表示如果可能的话，将 anObject 加到 BlockingQueue 里，即 如果 BlockingQueue 可以容纳,则返回 true,否则返回 false.（本方法不阻塞当 前执行方法的线程）
- `offer(E o, long timeout, TimeUnit unit)`：可以设定等待的时间，如果在指定 的时间内，还不能往队列中加入 BlockingQueue，则返回失败
- `put(anObject)`：把 anObject 加到 BlockingQueue 里，如果 BlockQueue 没有空间,则调用此方法的线程被阻断直到 BlockingQueue 里面有空间再继续

#### 获取数据

- `poll(time)`：取走 BlockingQueue 里排在首位的对象,若不能立即取出,则可以等 time 参数规定的时间,取不到时返回 null
- `poll(long timeout, TimeUnit unit)`：从 BlockingQueue 取出一个队首的对象， 如果在指定时间内，队列一旦有数据可取，则立即返回队列中的数据。否则知 道时间超时还没有数据可取，返回失败。
- `take()`：取走 BlockingQueue 里排在首位的对象,若 BlockingQueue 为空,阻断 进入等待状态直到 BlockingQueue 有新的数据被加入;
- `drainTo()`：一次性从 BlockingQueue 获取所有可用的数据对象（还可以指定 获取数据的个数），通过该方法，可以提升获取数据效率；不需要多次分批加 锁或释放锁。

~~~java
package example;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description 阻塞队列常用方法
 * @ClassName BlockingQueueDemo
 */
public class BlockingQueueDemo {
    public static void main(String[] args) throws InterruptedException {
        ArrayBlockingQueue<String> blockingQueue = new ArrayBlockingQueue<>(2);
//         第一组
        System.out.println(blockingQueue.add("a"));
        System.out.println(blockingQueue.add("cc"));
        System.out.println(blockingQueue.element());  // 查看第一个元素添加是否成功
// System.out.println(blockingQueue.add("b")); // 超出容量，报错
        System.out.println(blockingQueue.remove());
        System.out.println(blockingQueue.remove());          
        System.out.println(blockingQueue.remove());// 报错
// 第二组
        System.out.println(blockingQueue.offer("c"));
        System.out.println(blockingQueue.offer("2"));
        System.out.println(blockingQueue.offer("3")); // false
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());// null

// 第三组
        blockingQueue.put("dd1");
        blockingQueue.put("dd2");
//        blockingQueue.put("dd3");// 阻塞
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());// 阻塞
/
//第四组
        System.out.println(blockingQueue.offer("a"));
        System.out.println(blockingQueue.offer("cc"));
        blockingQueue.offer("asdc", 3L, TimeUnit.SECONDS);// 超过三秒自动结束


    }
}
~~~



## 线程池

### 线程池的简介与架构

线程池是用于维护和管理线程的，可以在需要时动态的创建和回收线程，从而避免了线程的创建和销毁的开销，提高了线程的复用性。

线程池通常包括以下几个组件：

1. 任务队列：用于存放等待执行的任务。
2. 线程池管理器： 用于管理线程池
3. 线程工厂：用于创建线程池
4. 线程池执行器：用于提交任务到线程池中执行

线程池的优点：

1. 降低创建和销毁线程的开销，提高复用性和并发性能
2. 可以控制并发线程数量，避免因过多线程导致系统负载过高或资源耗尽等问题
3. 提供线程的可管理性,包括线程的监控，统计和异常处理。

线程池的缺点：需要注意参数的配置,避免过度使用线程池导致系统崩溃。

### 线程池使用方式 

> 线程池可以通过调整线程池的大小、任务队列的大小、拒绝策略等参数来优化线程池的性能。同时，在使用线程池的过程中需要注意线程池的并发度和资源使用情况，避免因过度使用线程池导致系统崩溃或性能下降。

三种线程：

- 一池N线程： newFixedThreadPool
- 一池一线程： newSingleThreadExecutor   
- 一池可扩容线程： newCachedThreadPool  

底层都是用来ThreadPoolExecutor

#### 一池多线程 newFixedThreadPool(常用)

~~~java
package example;

import javax.script.ScriptException;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description 一池N线程
 * @ClassName NewFixedThreadPoolDemo
 */
public class NewFixedThreadPoolDemo {

    //创建线程池
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    public static void main(String[] args) {
        NewFixedThreadPoolDemo newFixedThreadPoolDemo = new NewFixedThreadPoolDemo();
        newFixedThreadPoolDemo.call();
    }

    public void calls(){
        //execute提交任务
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName()+"执行任务...");
            }
        });
//        submit提交任务
        executorService.submit(new Callable<String>() {
            @Override
            public String call() throws Exception {
                System.out.println(Thread.currentThread().getName()+"执行任务...");
                return "test";
            }
        });
        //关闭线程池
        executorService.shutdown();
    }
}
~~~

**特点**

1. 线程种的线程处于一定的量，可以很好的控制线程的并发量
2. 线程可以重复使用，在显示关闭之前，都将一直存在
3. 超出一定量的线程被提交时需要在队列中等待。

适用于可预测线程数量的业务中，或服务器负载较重，对线程数有严格限制的场景

#### newCachedThreadPool(常用)

- 创建 一个可缓存线程池，如果线程长度超过处理需要，可灵活回收空 闲线程，若无可回收，则新建线程
- 可扩容线程池大小。

特点

- 线程池中数量没有固定，可达到最大值（Interger. MAX_VALUE）
- 线程池中的线程可进行缓存重复利用和回收（回收默认时间为 1 分钟）
- 当线程池中，没有可用线程，会重新创建一个线程

#### newSingleThreadExecutor

- 创建一个使用单个 worker 线程的 Executor，以无界队列方式来运行该线程。
- 一池一线程

##### 特点

- 线程池中最多执行 1 个线程，之后提交的线程活动将会排在队列中以此执行

场景: 适用于需要保证顺序执行各个任务，并且在任意时间点，不会同时有多个 线程的场景

### 线程池的七个参数

1. corePoolSize 核心线程数
2. maxmumPoolSize 最大线程数
3. keepAliveTime 非核心线程存活时间
4. unit 时间单位
5. threadFactory 线程工厂
6. workQueue 任务队列
7. handler 要处理的拒绝策略

线程池中有三个参数，可以触发拒绝策略的。

1. 核心线程数
2. 最大线程数
3. 任务队列

当任务队列被塞满时，线程池就会扩充线程到达最大线程数，如果这时还有任务进来就会触发拒绝策略。

#### 拒绝策略

1. CallerRunsPolicy：当触发拒绝策略，只要线程池没有关闭的话，则**使用调用线程直接运行任务**。一般并发比较小，性能要求不高，不允许失败。但是，由于调用者自己运行任务，如果任务提交速度过快，可能导致程序阻塞，性能效率上必然的损失较大 。
2. AbortPolicy：直接丢弃任务，并抛出拒绝执行 RejectedExecutionException 异常 信息。**线程池默认的拒绝策略**。必须处理好抛出的异常，否则会打断当前的执 行流程，影响后续的任务执行。
3. DiscardPolicy： 直接丢弃，没有任何响应不做任何处理也不抛出异常。
4. DiscardOldestPolicy: 当触发拒绝策略，只要线程池没有关闭的话，丢弃阻塞队列 workQueue 中最老的等待最久的一个任务，并将新任务加入。

#### 自定义线程池

开发中，一般都是自定义线程池的方式来创建线程，可以更明确线程池的运行规则，规避风险。

~~~java
package example;

import java.util.concurrent.*;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description
 * @ClassName ThreadPoolExecutorDemo
 */
public class ThreadPoolExecutorDemo {
    public static void main(String[] args) {
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
                2,
                5,
                10,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy()
        );

        try {
            for (int i = 0; i < 10; i++) {
                threadPoolExecutor.execute(() -> {
                    System.out.println(Thread.currentThread().getName() + "办理业务");
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            threadPoolExecutor.shutdown();
        }
    }

}
~~~

## Fork/Join

它可以将一个大的任务拆分成多个子任务进行并行处理，最后将子任务结果合并成最后的计算结果，并进行输出。

- Fork：把一个复杂任务进行分拆，大事化小
- Join：把分拆任务的结果进行合并
- 本质上就是一个递归算法

### 任务处理

1. 任务分割：首先 Fork/Join 框架需要把大的任务分割成足够小的子任务，如果子任务比较大的话还要对子任务进行继续分割
2. 执行任务并合并结果：分割的子任务分别放到双端队列里，然后几个启动线程 分别从双端队列里获取任务执行。
3. 子任务执行完的结果都放在另外一个队列里， 启动一个线程从队列里取数据，然后合并这些数据。

### Fork方法

#### 原理：

> 当我们调用 ForkJoinTask 的 fork 方法时，程序会把任务放在 ForkJoinWorkerThread 的 pushTask 的 workQueue 中，异步地 执行这个任务，然后立即返回结果

### Join 方法

> Join 方法的主要作用是阻塞当前线程并等待获取结果。

已完成（NORMAL）、被取消（CANCELLED）、信号（SIGNAL）和出 现异常（EXCEPTIONAL）

- 如果任务状态是已完成，则直接返回任务结果
- 如果任务状态是被取消，则直接抛出 CancellationException
- 如果任务状态是抛出异常，则直接抛出对应的异常

示例： 1+2+3...+100

~~~java
package example;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.RecursiveTask;

class MyTask extends RecursiveTask<Integer> {

    // 拆分的插值不能超过10
    private static final Integer VALUE = 10;
    private int left;//拆分的开始值
    private int right;//拆分的结束值
    private int result;

    public MyTask(int left, int right) {
        this.left = left;
        this.right = right;
    }

    @Override
    protected Integer compute() {
        // 判断差值
        if ((right - left) <= 10) {
            for (int i = left; i <= right; i++) {
                result += i;
            }
        } else {
            // 进一步拆分 二分法的思想
            int middle = (left + right) / 2;
            // 左拆分
            MyTask leftTask = new MyTask(left, middle);
            // 右拆分
            MyTask rightTask = new MyTask(middle + 1, right);

            leftTask.fork();
            rightTask.fork();
            // 合并
            result = leftTask.join() + rightTask.join();
        }
        return result;
    }
}

public class SumDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //初始化对象
        MyTask myTask = new MyTask(50, 100);
        //创建一个分支合并池对象
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        //提交定义好的拆分任务
        ForkJoinTask<Integer> submit = forkJoinPool.submit(myTask);
        Integer integer = submit.get();
        System.out.println(integer);
        // 关闭
        forkJoinPool.shutdown();
    }
}
~~~

## CompletableFuture异步回调

使用CompletableFuture可以将耗时的操作异步执行，不会阻塞主线程，从而提高程序性能和响应速度。

它还可以通过回调函数来处理返回结果或异常.

~~~java
package example;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * @author mi11
 * @version 1.0
 * @project guc
 * @description
 * @ClassName CompletableFutureDemo
 */
public class CompletableFutureDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<Void> runAsync = CompletableFuture.runAsync(new Runnable() {
            @Override
            public void run() {
                System.out.println("没有返回值");
            }
        });
        runAsync.get();

        CompletableFuture<Integer> supplyAsync = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                return 1 + 2;
            }
        });
        Integer integer = supplyAsync.get();
        System.out.println(integer);
        //处理结果或异常
        supplyAsync.whenComplete(new BiConsumer<Integer, Throwable>() {
            @Override
            public void accept(Integer integer, Throwable throwable) {
                System.out.println(integer);

            }
        }).get();

        //计算结果
        supplyAsync.thenAccept(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) {
                System.out.println(integer);
            }
        }).get();
        //计算异常
        supplyAsync.exceptionally(new Function<Throwable, Integer>() {
            @Override
            public Integer apply(Throwable throwable) {
                return null;
            }
        }).get();
    }
}
~~~



