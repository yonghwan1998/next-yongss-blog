import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MutexLab from "@/components/labs/MutexLab";
import SemaphoreLab from "@/components/labs/SemaphoreLab";
import TableOfContents from "@/components/TableOfContents";

export const metadata: Metadata = { title: "동기화와 교착 상태", description: "레이스 컨디션, 동기화 도구와 교착 상태의 원리 및 해결 방법을 정리합니다." };

const raceCode = `public class Race {
    static int sharedData = 0;

    public static void main(String[] args) throws InterruptedException {
        Thread thread1 = new Thread(() -> {
            for (int i = 0; i < 100000; i++) sharedData++;
        });
        Thread thread2 = new Thread(() -> {
            for (int i = 0; i < 100000; i++) sharedData--;
        });

        thread1.start();
        thread2.start();
        thread1.join();
        thread2.join();
        System.out.println("Final value: " + sharedData);
    }
}`;

const mutexCode = `static Lock lock = new ReentrantLock();

lock.lock();             // 락 획득
try {
    sharedData++;        // 임계 구역
} finally {
    lock.unlock();       // 락 해제
}`;

const mutexPseudoCode = `lock.acquire()
// 임계 구역
lock.release()`;

const semaphoreCode = `static Semaphore semaphore = new Semaphore(3);

semaphore.acquire();     // wait(): 허가증 획득
try {
    useSharedResource();
} finally {
    semaphore.release(); // signal(): 허가증 반환
}`;

const semaphorePseudoCode = `wait() {                 // 전체를 원자적으로 실행
    S--;
    if (S < 0) {
        enqueue(current);
        block(current);
    }
}

signal() {               // 전체를 원자적으로 실행
    S++;
    if (S <= 0) {
        wakeup(dequeue());
    }
}`;

export default function SynchronizationAndDeadlockPage() {
  return (
    <div className="article-layout">
      <article className="article-shell">
      <Link className="back-link" href="/research">← Research</Link>
      <header className="article-header">
        <p className="page-kicker">Operating System</p>
        <h1>동기화와 교착 상태</h1>
        <p>공유 자원의 일관성을 지키는 방법과, 잘못된 자원 대기가 시스템을 멈추게 하는 과정을 정리한다.</p>
        <div><span>2026.08.17</span><span>Concurrency</span><span>Interactive</span></div>
      </header>

      <section className="article-section">
        <h2>먼저 알아둘 용어</h2>
        <dl className="term-list">
          <div><dt>공유 자원</dt><dd>여러 프로세스 또는 스레드가 함께 사용하는 자원</dd></div>
          <div><dt>임계 구역</dt><dd>공유 자원에 접근하는 코드 중 여러 프로세스 또는 스레드가 동시에 실행하면 문제가 발생할 수 있는 코드 영역</dd></div>
          <div><dt>레이스 컨디션</dt><dd>프로세스 또는 스레드가 공유 자원에 동시에 접근하고, 실행 순서에 따라 결과가 달라질 수 있는 상황</dd></div>
          <div><dt>뮤텍스 락</dt><dd>락의 소유권을 바탕으로 한 번에 하나의 실행 흐름만 임계 구역에 진입하도록 보장하는 동기화 도구</dd></div>
          <div><dt>세마포</dt><dd>정수형 카운터로 사용 가능한 허가증(permit)의 수를 관리해 동시 접근 수나 실행 순서를 제어하는 동기화 도구</dd></div>
          <div><dt>모니터</dt><dd>공유 상태와 연산, 상호 배제, 조건 변수를 하나로 캡슐화한 고수준 동기화 추상화</dd></div>
          <div><dt>스레드 안전</dt><dd>여러 스레드가 동시에 사용해도 명세된 결과와 공유 상태의 불변 조건이 유지되는 성질</dd></div>
        </dl>
        <aside className="article-callout"><strong>동기화가 필요한 이유</strong><p>프로세스 또는 스레드가 공유 메모리 등의 자원에 동시에 접근하면 예상하지 못한 결과가 발생할 수 있다. 임계 구역에 대한 접근을 제어해 공유 자원의 일관성을 보장해야 한다.</p></aside>
      </section>

      <section className="article-section">
        <h2>레이스 컨디션</h2>
        <p>둘 이상의 실행 흐름이 동시에 임계 구역의 코드를 실행하면 명령의 실제 실행 순서에 따라 결과가 달라진다. 이 상황을 레이스 컨디션이라고 하며, 공유 자원의 일관성이 손상될 수 있다.</p>
        <figure className="article-figure">
          <Image alt="두 프로세스가 공유 자원의 값을 동시에 읽고 쓰면서 값 유실이 발생하는 레이스 컨디션 과정" height={768} priority src="/images/synchronization-and-deadlock/race-condition.png" width={1408} />
          <figcaption>두 프로세스가 값 10을 동시에 읽은 뒤 각각 11을 쓰면 한 번의 증가가 유실된다.</figcaption>
        </figure>
        <pre><code>{raceCode}</code></pre>
        <p>두 스레드는 같은 공유 데이터를 각각 100,000번 증가시키고 감소시킨다. 논리적으로는 최종 값이 0이어야 하지만 <code>sharedData++</code>와 <code>sharedData--</code>는 하나의 원자적 연산이 아니다. 값을 읽고, 계산하고, 다시 쓰는 과정이 서로 섞이면 기대한 0이 아닌 값이 남을 수 있다.</p>
        <p>따라서 둘 이상의 프로세스나 스레드가 임계 구역에 진입하려 한다면, 하나의 작업이 끝날 때까지 다른 실행 흐름을 기다리게 해야 한다. 레이스 컨디션을 방지하면서 임계 구역을 관리하기 위해 동기화가 필요하다.</p>
      </section>

      <section className="article-section">
        <h2>동기화</h2>
        <p>동기화는 다음 두 조건을 지키며 프로세스와 스레드를 실행하는 것이다.</p>
        <ol><li><strong>실행 순서 제어:</strong> 프로세스와 스레드를 올바른 순서로 실행한다. 예를 들어 Thread A가 데이터를 생성하고 Thread B가 그 데이터를 사용한다면 반드시 A 다음에 B가 실행되어야 한다.</li><li><strong>상호 배제:</strong> 동시에 접근해서는 안 되는 자원에는 하나의 프로세스 또는 스레드만 접근하도록 제한한다.</li></ol>
      </section>

      <section className="article-section">
        <h2>뮤텍스 락</h2>
        <p>뮤텍스(mutex, mutual exclusion)는 보호 대상의 개수와 관계없이 하나의 임계 구역에 한 번에 하나의 실행 흐름만 진입하도록 상호 배제를 보장한다. 핵심은 락을 획득한 실행 흐름이 소유자가 되고, 그 소유자만 락을 해제할 수 있다는 점이다.</p>
        <ul><li>임계 구역에 접근하려면 반드시 락을 획득해야 한다.</li><li>이미 다른 실행 흐름이 락을 가지고 있다면 락이 해제될 때까지 기다린다.</li><li>락을 획득한 소유자만 해당 락을 해제해야 한다.</li><li>임계 구역의 작업이 끝나면 반드시 락을 해제해야 한다.</li><li>예외가 발생해도 락이 해제되도록 일반적으로 <code>finally</code> 블록을 사용한다.</li></ul>
        <pre><code>{mutexPseudoCode}</code></pre>
        <pre><code>{mutexCode}</code></pre>
        <MutexLab />
      </section>

      <section className="article-section">
        <h2>세마포</h2>
        <p>세마포는 정수형 카운터로 사용 가능한 허가증의 수를 관리한다. 여러 개의 허가증으로 동시 접근 수를 제한할 수도 있고, 허가증이 하나뿐인 이진 세마포로 상호 배제를 구현할 수도 있다. 다만 뮤텍스와 달리 소유권 개념이 없어 허가증을 획득한 실행 흐름과 반환하는 실행 흐름이 반드시 같을 필요는 없다.</p>
        <ul><li><strong>카운팅 세마포:</strong> 둘 이상의 허가증을 두고 자원 풀이나 동시 실행 수를 제한한다.</li><li><strong>이진 세마포:</strong> 허가증을 0과 1로 제한해 상호 배제나 실행 순서 제어에 사용한다.</li><li><code>wait()</code> 또는 P 연산은 허가증을 하나 획득한다. 사용할 허가증이 없으면 호출한 실행 흐름을 대기시킨다.</li><li><code>signal()</code> 또는 V 연산은 허가증을 하나 반환하고, 기다리는 실행 흐름이 있으면 하나를 깨운다.</li><li>카운터 검사와 변경, 대기 큐 이동이 중간에 끼어들 수 없는 하나의 원자적 연산으로 실행되어야 한다.</li></ul>
        <p>아래 의사 코드에서 카운터 <code>S</code>가 음수라면 그 절댓값은 기다리는 실행 흐름의 수를 나타낸다. 실제 구현에서는 카운터 변경과 대기·깨우기 전환을 원자적으로 처리해 신호 유실을 막는다.</p>
        <pre><code>{semaphorePseudoCode}</code></pre>
        <pre><code>{semaphoreCode}</code></pre>
        <SemaphoreLab />
      </section>

      <section className="article-section">
        <h2>모니터</h2>
        <p>모니터는 공유 상태와 그 상태를 다루는 연산을 하나로 묶고, 한 번에 하나의 실행 흐름만 모니터 내부 연산을 수행하도록 보장하는 고수준 동기화 추상화다. 언어나 런타임이 모니터 진입과 이탈을 구조적으로 관리하므로 명시적인 락 해제를 빠뜨릴 가능성을 줄일 수 있다.</p>
        <p>모니터는 단순한 상호 배제뿐 아니라 조건 변수 또는 대기 집합을 이용한 조건 동기화도 제공한다. 실행 조건이 충족되지 않은 흐름이 <code>wait()</code>를 호출하면 모니터 락을 놓고 대기하며, 알림을 받아 깨어난 뒤에는 락을 다시 획득해야 실행을 계속할 수 있다.</p>
        <div className="table-scroll"><table><thead><tr><th>구분</th><th>뮤텍스</th><th>모니터</th></tr></thead><tbody>
          <tr><th>추상화 수준</th><td>락 획득과 해제를 직접 다루는 동기화 기본 요소</td><td>공유 상태·연산·동기화 정책을 묶은 고수준 구조</td></tr>
          <tr><th>진입과 이탈</th><td>개발자가 정해진 위치에서 명시적으로 획득·해제</td><td>동기화된 메서드나 블록의 진입·종료와 함께 구조적으로 처리</td></tr>
          <tr><th>조건 동기화</th><td>조건 변수 등의 도구를 별도로 결합</td><td>조건 변수나 대기 집합을 내부에 포함</td></tr>
          <tr><th>오류 가능성</th><td>락 해제 누락이나 잘못된 소유자 해제를 주의</td><td>해제 누락은 줄지만 잘못된 락 순서로 인한 교착 상태는 여전히 가능</td></tr>
          <tr><th>대표적인 예</th><td>POSIX mutex, Java <code>ReentrantLock</code></td><td>Java <code>synchronized</code>, C# <code>lock</code>·<code>Monitor</code></td></tr>
        </tbody></table></div>
        <aside className="article-callout"><strong>세 도구의 핵심 차이</strong><p>뮤텍스는 하나의 소유자가 임계 구역을 보호하고, 세마포는 소유자 없이 허가증 수를 관리한다. 모니터는 상호 배제와 조건 동기화를 공유 상태 및 연산과 함께 구조적으로 캡슐화한다.</p></aside>
      </section>

      <section className="article-section">
        <h2>스레드 안전</h2>
        <p>스레드 안전(thread safety)은 멀티스레드 환경에서 어떤 변수, 함수 또는 객체에 동시 접근이 이루어져도 실행에 문제가 없는 상태를 뜻한다. 공유되는 가변 상태를 올바르게 동기화하거나, 불변 객체와 원자적 연산을 사용하거나, 스레드별로 상태를 분리하는 등의 방법으로 보장할 수 있다.</p>
      </section>

      <section className="article-section">
        <h2>교착 상태</h2>
        <p>교착 상태는 일어나지 않을 사건을 기다리며 프로세스의 진행이 멈춰 버리는 현상이다. 다음 네 가지 필요 조건이 모두 성립할 때 교착 상태가 발생할 수 있다.</p>
        <div className="condition-grid">
          <article><b>01</b><h3>상호 배제</h3><p>한 프로세스가 사용하는 자원을 다른 프로세스가 동시에 사용할 수 없다.</p></article>
          <article><b>02</b><h3>점유와 대기</h3><p>프로세스가 어떤 자원을 할당받아 점유한 상태에서 다른 자원이 할당되기를 기다린다.</p></article>
          <article><b>03</b><h3>비선점</h3><p>해당 자원을 사용하는 프로세스의 작업이 끝나기 전에는 다른 프로세스가 자원을 강제로 빼앗을 수 없다.</p></article>
          <article><b>04</b><h3>원형 대기</h3><p>각 프로세스가 서로 점유한 자원을 할당받기 위해 원의 형태로 기다린다.</p></article>
        </div>
      </section>

      <section className="article-section">
        <h2>교착 상태 해결 방법</h2>
        <h3>1. 교착 상태 예방</h3>
        <p>교착 상태 발생에 필요한 네 가지 조건 중 하나 이상이 성립하지 않도록 시스템을 설계한다.</p>
        <div className="solution-list">
          <article><h4>상호 배제 제거</h4><p>가능한 경우 자원을 여러 프로세스가 동시에 사용할 수 있도록 만든다. 하지만 프린터처럼 본질적으로 공유가 불가능한 자원도 있으므로 항상 적용할 수 있는 방법은 아니다.</p></article>
          <article><h4>점유와 대기 제거</h4><p>프로세스가 필요한 모든 자원을 한 번에 요청하게 한다. 일부 자원을 가진 채 다른 자원을 기다리는 상황을 만들지 않는다.</p><pre><code>{`기존: Resource A 획득 → Resource B 요청\n변경: Resource A + Resource B를 한 번에 요청`}</code></pre></article>
          <article><h4>비선점 제거</h4><p>필요한 경우 프로세스가 보유한 자원을 시스템이 강제로 회수할 수 있도록 한다.</p></article>
          <article><h4>원형 대기 제거</h4><p>자원에 일정한 순서를 부여하고 모든 프로세스가 항상 정해진 순서대로 자원을 요청하게 한다.</p><pre><code>{`Thread 1: A → B\nThread 2: A → B\n\n모든 스레드가 같은 순서로만 락을 획득`}</code></pre></article>
        </div>
        <h3>2. 교착 상태 회피</h3>
        <p>교착 상태의 가능성을 완전히 제거하는 대신 시스템이 교착 상태에 빠지지 않는 안전한 상태를 유지하도록 자원을 신중하게 할당한다.</p>
        <h4>은행원 알고리즘</h4>
        <p>은행이 모든 고객의 최대 요구 금액을 고려해 파산하지 않을 정도로만 돈을 빌려주는 것에서 이름이 유래했다. 자원을 할당한 이후에도 시스템의 모든 프로세스가 종료될 수 있을 때만 요청을 승인한다.</p>
        <div className="article-flow"><span>자원 할당 가정</span><i>→</i><span>모든 프로세스 종료 가능?</span><i>→</i><span>YES: 할당 · NO: 보류</span></div>
        <h3>3. 교착 상태 검출 후 회복</h3>
        <p>교착 상태가 발생하는 것을 허용하고 주기적으로 발생 여부를 검사한 뒤, 교착 상태가 검출되면 시스템을 회복한다.</p>
        <ul><li><strong>프로세스 강제 종료:</strong> 교착 상태에 빠진 프로세스 일부 또는 전체를 종료하고, 해당 프로세스가 점유하던 자원을 반환한다.</li><li><strong>자원 선점:</strong> 특정 프로세스로부터 자원을 강제로 빼앗아 다른 프로세스에 할당한다. 필요하다면 선점된 프로세스를 이전 상태로 되돌린 뒤 다시 실행한다.</li></ul>
      </section>
      </article>
      <TableOfContents />
    </div>
  );
}
