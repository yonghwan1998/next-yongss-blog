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

const semaphorePseudoCode = `wait() {
    S--;
    if (S < 0) {
        sleep();
    }
}

signal() {
    S++;
    if (S <= 0) {
        wakeup(process);
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
          <div><dt>뮤텍스 락</dt><dd>동시에 접근해서는 안 되는 자원에 동시 접근이 불가능하도록 상호 배제를 보장하는 동기화 도구</dd></div>
          <div><dt>세마포</dt><dd>뮤텍스와 유사하지만 여러 개의 프로세스 또는 스레드가 한정된 수의 자원을 이용할 때 사용하는 동기화 도구</dd></div>
          <div><dt>모니터</dt><dd>공유 자원과 그 공유 자원을 다루는 함수 또는 인터페이스로 구성된 동기화 도구</dd></div>
          <div><dt>스레드 안전</dt><dd>멀티스레드 환경에서 동시 접근이 발생해도 실행에 문제가 없는 상태</dd></div>
        </dl>
        <aside className="article-callout"><strong>동기화가 필요한 이유</strong><p>프로세스 또는 스레드가 공유 메모리 등의 자원에 동시에 접근하면 예상하지 못한 결과가 발생할 수 있다. 임계 구역에 대한 접근을 제어해 공유 자원의 일관성을 보장해야 한다.</p></aside>
      </section>

      <section className="article-section">
        <h2>레이스 컨디션</h2>
        <p>둘 이상의 실행 흐름이 동시에 임계 구역의 코드를 실행하면 명령의 실제 실행 순서에 따라 결과가 달라진다. 이 상황을 레이스 컨디션이라고 하며, 공유 자원의 일관성이 손상될 수 있다.</p>
        <figure className="article-figure">
          <Image alt="두 프로세스가 공유 자원의 값을 동시에 읽고 쓰면서 값 유실이 발생하는 레이스 컨디션 과정" height={768} priority src="/images/race-condition.png" width={1408} />
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
        <p>뮤텍스(MUTual EXclusion)는 자원이 하나일 때 사용하는 동기화 도구다. 하나의 임계 구역에 한 번에 하나의 실행 흐름만 진입하도록 상호 배제를 보장한다.</p>
        <ul><li>임계 구역에 접근하려면 반드시 락을 획득해야 한다.</li><li>이미 다른 실행 흐름이 락을 가지고 있다면 락이 해제될 때까지 기다린다.</li><li>임계 구역의 작업이 끝나면 반드시 락을 해제해야 한다.</li><li>예외가 발생해도 락이 해제되도록 일반적으로 <code>finally</code> 블록을 사용한다.</li></ul>
        <pre><code>{mutexPseudoCode}</code></pre>
        <pre><code>{mutexCode}</code></pre>
        <MutexLab />
      </section>

      <section className="article-section">
        <h2>세마포</h2>
        <p>세마포는 자원이 하나 이상일 때 사용하는 동기화 도구다. 뮤텍스와 비슷하지만 여러 프로세스나 스레드가 한정된 수의 공유 자원을 이용할 때 적합하다.</p>
        <ul><li>사용 가능한 공유 자원의 개수를 내부 카운터 <code>S</code>로 관리한다.</li><li>카운터 값은 임계 구역에 동시에 진입할 수 있는 실행 흐름의 최대 개수와 연결된다.</li><li><code>wait()</code> 또는 P 연산은 카운터를 감소시키고, 자원이 없으면 호출한 실행 흐름을 대기시킨다.</li><li><code>signal()</code> 또는 V 연산은 카운터를 증가시키고, 기다리는 실행 흐름이 있으면 깨운다.</li></ul>
        <pre><code>{semaphorePseudoCode}</code></pre>
        <pre><code>{semaphoreCode}</code></pre>
        <SemaphoreLab />
      </section>

      <section className="article-section">
        <h2>모니터</h2>
        <p>모니터는 공유 자원과 그 자원을 다루는 함수 또는 인터페이스를 하나로 묶은 고수준 동기화 도구다. 세마포보다 사용하기 쉽게 만들어진 도구로 이해할 수 있다. 개발자가 락 획득과 해제를 직접 관리하는 뮤텍스보다 동기화 로직을 구조적으로 안전하게 캡슐화한다.</p>
        <div className="table-scroll"><table><thead><tr><th>구분</th><th>뮤텍스</th><th>모니터</th></tr></thead><tbody>
          <tr><th>개념</th><td>락 기반 저수준 메커니즘</td><td>언어가 제공하는 고수준 구조</td></tr>
          <tr><th>관리</th><td>개발자가 직접 획득·해제</td><td>컴파일러와 언어가 자동 관리</td></tr>
          <tr><th>안정성</th><td>해제 누락 시 데드락 위험</td><td>자동 관리로 구조적 안전성 확보</td></tr>
          <tr><th>코드 가독성</th><td>락 코드 때문에 비즈니스 로직이 복잡해질 수 있음</td><td>데이터와 동기화 로직이 캡슐화되어 비교적 간결함</td></tr>
          <tr><th>조건 동기화</th><td>조건 변수를 생성해 직접 구현</td><td>모니터 내부 대기 큐로 제어</td></tr>
          <tr><th>주요 활용</th><td>C/C++ 시스템 프로그래밍</td><td>Java synchronized, C# 등 언어 수준 객체</td></tr>
        </tbody></table></div>
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
