import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SchedulingQueueLab from "@/components/labs/SchedulingQueueLab";
import TableOfContents from "@/components/TableOfContents";

export const metadata: Metadata = {
  title: "CPU 스케줄링",
  description: "CPU·입출력 버스트와 스케줄링 큐부터 선점 여부, 주요 CPU 스케줄링 알고리즘까지 정리합니다.",
};

export default function CpuSchedulingPage() {
  return (
    <div className="article-layout">
      <article className="article-shell">
        <Link className="back-link" href="/research">← Research</Link>
        <header className="article-header">
          <p className="page-kicker">Operating System</p>
          <h1>CPU 스케줄링</h1>
          <p>운영체제가 준비 상태의 프로세스 가운데 다음 실행 대상을 고르는 기준과 대표적인 스케줄링 알고리즘을 정리한다.</p>
          <div>
            <span>2026.08.20</span>
            <span>Process</span>
            <span>Interactive</span>
          </div>
        </header>

        <section className="article-section">
          <h2>먼저 알아둘 용어</h2>
          <dl className="term-list">
            <div><dt>CPU 스케줄링</dt><dd>운영체제가 프로세스에 CPU를 배분하는 방법</dd></div>
            <div><dt>CPU 스케줄링 알고리즘</dt><dd>CPU를 배분할 프로세스와 실행 순서를 결정하는 구체적인 절차</dd></div>
            <div><dt>CPU 스케줄러</dt><dd>스케줄링 알고리즘에 따라 준비 상태의 프로세스 중 하나를 선택하는 운영체제의 일부분</dd></div>
            <div><dt>CPU 활용률</dt><dd>전체 시간 중 CPU가 실제 작업을 처리한 시간의 비율</dd></div>
            <div><dt>CPU 버스트</dt><dd>프로세스가 CPU에서 명령을 연속으로 실행하는 구간</dd></div>
            <div><dt>입출력 버스트</dt><dd>프로세스가 입출력 작업의 완료를 기다리는 구간</dd></div>
            <div><dt>CPU 집중 프로세스</dt><dd>전체 작업에서 CPU 연산이 차지하는 비중이 높은 프로세스</dd></div>
            <div><dt>입출력 집중 프로세스</dt><dd>짧은 CPU 작업과 입출력 대기를 자주 반복하는 프로세스</dd></div>
            <div><dt>준비 큐</dt><dd>CPU를 할당받을 준비가 된 프로세스의 PCB가 대기하는 큐</dd></div>
            <div><dt>대기 큐</dt><dd>입출력 완료와 같은 특정 사건을 기다리는 프로세스의 PCB가 대기하는 큐</dd></div>
            <div><dt>선점형 스케줄링</dt><dd>운영체제가 실행 중인 프로세스로부터 CPU를 회수해 다른 프로세스에 할당할 수 있는 방식</dd></div>
            <div><dt>비선점형 스케줄링</dt><dd>프로세스가 종료되거나 스스로 대기 상태에 들어갈 때까지 CPU를 계속 사용하는 방식</dd></div>
            <div><dt>타임 슬라이스</dt><dd>한 프로세스가 한 번에 CPU를 사용할 수 있도록 정한 시간</dd></div>
          </dl>
          <aside className="article-callout">
            <strong>우선순위</strong>
            <p>운영체제는 프로세스의 중요도와 특성을 바탕으로 우선순위를 정해 PCB에 기록한다. 높은 우선순위의 프로세스에 CPU를 먼저 배분해 응답성과 CPU 활용률을 높일 수 있다.</p>
          </aside>
        </section>

        <section className="article-section">
          <h2>CPU 집중 · 입출력 집중 프로세스</h2>
          <p>대부분의 프로세스는 CPU 버스트와 입출력 버스트를 번갈아 거치며 실행 상태와 대기 상태를 오간다. CPU 집중 프로세스만 실행하면 입출력장치가 쉬고, 입출력 집중 프로세스만 실행하면 입출력을 기다리는 동안 CPU가 쉴 수 있다. 두 유형을 적절히 함께 실행해야 시스템 자원을 고르게 활용할 수 있다.</p>
          <div className="table-scroll">
            <table>
              <thead><tr><th>구분</th><th>일반적인 동작</th></tr></thead>
              <tbody>
                <tr><th>CPU 집중 프로세스</th><td>긴 CPU 작업 → 짧거나 드문 입출력</td></tr>
                <tr><th>입출력 집중 프로세스</th><td>짧은 CPU 작업 → 입출력 대기 → 짧은 CPU 작업</td></tr>
                <tr><th>단일 코어</th><td>한 순간에는 한 프로세스만 CPU에서 실행</td></tr>
                <tr><th>멀티코어</th><td>서로 다른 코어에서 여러 프로세스를 실제로 동시에 실행</td></tr>
              </tbody>
            </table>
          </div>
          <p>입출력 집중 프로세스는 CPU 버스트가 짧아 CPU를 빠르게 반납하고 곧바로 입출력장치를 사용한다. 그래서 일반적으로 CPU 집중 프로세스보다 높은 우선순위를 부여하면 CPU와 입출력장치가 동시에 일할 기회가 늘어난다.</p>
          <figure className="article-figure">
            <Image
              alt="CPU 집중 프로세스 또는 입출력 집중 프로세스만 배치했을 때 CPU와 입출력장치가 유휴 상태가 되는 과정"
              height={940}
              priority
              sizes="(max-width: 1100px) 100vw, 820px"
              src="/images/cpu-scheduling/cpu-io-utilization.png"
              width={1680}
            />
            <figcaption>한쪽 유형의 프로세스만 배치하면 일부 자원이 쉬면서 자원 활용률과 전체 처리량이 낮아진다.</figcaption>
          </figure>
        </section>

        <section className="article-section">
          <h2>스케줄링 큐</h2>
          <p>CPU를 사용하려는 프로세스는 준비 큐에서 기다린다. 운영체제는 기본적인 도착 순서뿐 아니라 실행 시간, 우선순위, 타임 슬라이스처럼 스케줄링 알고리즘이 요구하는 기준을 함께 고려해 다음 프로세스를 고른다.</p>
          <p>실행 중인 프로세스가 입출력을 요청하면 해당 장치의 대기 큐로 이동한다. 입출력이 끝나면 다시 준비 큐에 들어가 CPU 할당을 기다린다. 큐에는 프로세스 자체가 아니라 프로세스의 상태와 실행 문맥을 담은 PCB가 연결된다고 이해하면 된다.</p>
          <SchedulingQueueLab />
        </section>

        <section className="article-section">
          <h2>선점형과 비선점형 스케줄링</h2>
          <h3>선점형 스케줄링</h3>
          <p>운영체제가 실행 중인 프로세스로부터 CPU를 강제로 회수해 다른 프로세스에 할당할 수 있는 방식이다. 타이머 인터럽트로 타임 슬라이스의 만료를 감지하는 스케줄링은 대표적인 선점형 방식이다.</p>
          <h3>비선점형 스케줄링</h3>
          <p>CPU를 사용하는 프로세스가 종료되거나 입출력을 요청해 스스로 대기 상태에 들어갈 때까지 다른 프로세스가 끼어들 수 없는 방식이다.</p>
          <div className="table-scroll">
            <table>
              <thead><tr><th>구분</th><th>선점형</th><th>비선점형</th></tr></thead>
              <tbody>
                <tr><th>장점</th><td>하나의 프로세스가 CPU를 독점하는 것을 막고, 응답이 급한 작업에 빠르게 CPU를 배분할 수 있다.</td><td>문맥 교환 횟수가 적어 관련 오버헤드가 비교적 작다.</td></tr>
                <tr><th>단점</th><td>잦은 문맥 교환으로 오버헤드가 커질 수 있고 공유 자원의 동기화가 더 복잡해진다.</td><td>실행 시간이 긴 작업 뒤에 짧거나 급한 작업이 오래 기다릴 수 있다.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="article-section">
          <h2>CPU 스케줄링 알고리즘</h2>

          <h3>1. 선입 선처리 스케줄링</h3>
          <p>선입 선처리(FCFS, First-Come First-Served)는 준비 큐에 도착한 순서대로 CPU를 할당하는 비선점형 알고리즘이다. 구현이 단순하고 먼저 온 작업을 먼저 처리한다는 점에서 공평하지만, 실행 시간이 긴 프로세스가 앞에 있으면 짧은 프로세스들이 함께 오래 기다리는 <strong>호위 효과</strong>가 발생할 수 있다.</p>
          <figure className="article-figure article-diagram">
            <Image alt="도착한 순서대로 프로세스 A, B, C, D를 실행하는 선입 선처리 스케줄링" height={900} sizes="(max-width: 1100px) 100vw, 820px" src="/images/cpu-scheduling/fcfs.png" unoptimized width={1600} />
            <figcaption>실행 시간이 아니라 준비 큐에 들어온 순서가 CPU 할당 순서를 결정한다.</figcaption>
          </figure>

          <h3>2. 최단 작업 우선 스케줄링</h3>
          <p>최단 작업 우선(SJF, Shortest Job First)은 준비 큐의 프로세스 가운데 예상 CPU 버스트가 가장 짧은 프로세스를 먼저 실행하는 비선점형 알고리즘이다. CPU 버스트를 정확히 안다면 평균 대기 시간을 최소화할 수 있지만, 운영체제는 미래의 실행 시간을 알 수 없으므로 과거 실행 기록을 이용해 예측한다. 짧은 작업이 계속 들어오면 긴 작업이 실행되지 못하는 <strong>기아</strong>가 생길 수 있다.</p>
          <figure className="article-figure">
            <Image alt="도착 순서와 관계없이 실행 시간이 가장 짧은 프로세스 D를 선택하는 최단 작업 우선 스케줄링" height={512} sizes="(max-width: 1100px) 100vw, 820px" src="/images/cpu-scheduling/sjf.png" width={2112} />
            <figcaption>도착 순서가 늦어도 예상 실행 시간이 가장 짧은 프로세스를 우선한다.</figcaption>
          </figure>

          <h3>3. 라운드 로빈 스케줄링</h3>
          <p>라운드 로빈(Round Robin)은 준비 큐의 순서대로 CPU를 할당하되, 각 프로세스가 정해진 타임 슬라이스만큼만 실행하도록 제한하는 선점형 알고리즘이다. 시간 안에 끝나지 않은 프로세스는 준비 큐의 맨 뒤로 이동한다.</p>
          <p>타임 슬라이스가 너무 크면 FCFS와 비슷해져 응답성이 낮아지고, 너무 작으면 문맥 교환이 잦아져 실제 작업보다 전환 비용이 커질 수 있다. 따라서 응답 시간과 문맥 교환 비용 사이의 균형이 중요하다.</p>
          <figure className="article-figure article-diagram">
            <Image alt="타임 슬라이스 10밀리초 단위로 여러 프로세스를 순환 실행하는 라운드 로빈 스케줄링" height={900} sizes="(max-width: 1100px) 100vw, 820px" src="/images/cpu-scheduling/round-robin.png" unoptimized width={1600} />
            <figcaption>타임 슬라이스가 끝난 프로세스는 준비 큐의 뒤로 이동해 다음 차례를 기다린다.</figcaption>
          </figure>

          <h3>4. 최소 잔여 시간 우선 스케줄링</h3>
          <p>최소 잔여 시간 우선(SRTF, Shortest Remaining Time First)은 SJF의 선점형 형태다. 프로세스가 새로 도착하는 등 스케줄링이 필요한 시점마다 실행 중인 프로세스와 준비 큐의 프로세스가 가진 남은 시간을 비교한다. 새 프로세스의 남은 시간이 더 짧다면 현재 프로세스를 선점하고 새 프로세스를 실행한다.</p>
          <p>평균 대기 시간을 줄이는 데 유리하지만 남은 시간을 계속 추정해야 하며, 긴 작업은 반복해서 밀려 기아 상태에 빠질 수 있다.</p>
          <figure className="article-figure article-diagram">
            <Image alt="프로세스 A 실행 중 남은 시간이 더 짧은 프로세스 C가 도착해 CPU를 선점하는 최소 잔여 시간 우선 스케줄링" height={900} sizes="(max-width: 1100px) 100vw, 820px" src="/images/cpu-scheduling/srtf.png" unoptimized width={1600} />
            <figcaption>새로 도착한 C의 실행 시간이 A의 남은 시간보다 짧아 선점이 발생한다.</figcaption>
          </figure>

          <h3>5. 우선순위 스케줄링</h3>
          <p>우선순위 스케줄링은 각 프로세스에 부여된 우선순위를 비교해 가장 높은 프로세스부터 실행한다. 우선순위가 같은 프로세스끼리는 FCFS나 라운드 로빈을 적용할 수 있고, 운영체제 설계에 따라 선점형과 비선점형 모두 가능하다.</p>
          <p>높은 우선순위의 프로세스가 계속 들어오면 낮은 우선순위의 프로세스에 기아가 발생할 수 있다. 오래 기다린 프로세스의 우선순위를 점차 높이는 <strong>에이징</strong>으로 이를 완화한다. 그림에서는 숫자가 작을수록 우선순위가 높다.</p>
          <figure className="article-figure">
            <Image alt="우선순위 숫자가 가장 작은 프로세스 C를 선택하는 우선순위 스케줄링" height={512} sizes="(max-width: 1100px) 100vw, 820px" src="/images/cpu-scheduling/priority.png" width={2112} />
            <figcaption>우선순위의 숫자와 높낮이 관계는 운영체제마다 다르므로 정책을 함께 확인해야 한다.</figcaption>
          </figure>

          <h3>6. 다단계 큐 스케줄링</h3>
          <p>다단계 큐(Multilevel Queue)는 프로세스 유형이나 우선순위에 따라 준비 큐를 여러 개로 분리하는 방식이다. 시스템, 대화형, 배치 프로세스처럼 성격이 다른 작업을 서로 다른 큐에 넣고 각 큐에 라운드 로빈이나 FCFS 같은 별도의 알고리즘을 적용할 수 있다.</p>
          <p>큐 사이에도 고정 우선순위 또는 일정한 CPU 시간 비율을 적용한다. 전형적인 다단계 큐에서는 프로세스가 처음 배정된 큐에 계속 머물며, 큐 사이 이동을 허용해 동적으로 우선순위를 바꾸면 다단계 피드백 큐에 가까워진다.</p>
          <figure className="article-figure article-diagram">
            <Image alt="시스템, 대화형, 배치, 백그라운드 프로세스를 우선순위별 준비 큐로 분리한 다단계 큐 스케줄링" height={900} sizes="(max-width: 1100px) 100vw, 820px" src="/images/cpu-scheduling/multilevel-queue.png" unoptimized width={1600} />
            <figcaption>프로세스 유형별로 큐를 분리하고 각 큐의 목적에 맞는 스케줄링 알고리즘을 적용한다.</figcaption>
          </figure>

          <h3>7. 다단계 피드백 큐 스케줄링</h3>
          <p>다단계 피드백 큐(MLFQ, Multilevel Feedback Queue)는 프로세스가 큐 사이를 이동할 수 있게 해 우선순위를 동적으로 조정한다. 새 프로세스는 보통 높은 우선순위 큐에서 시작한다. 주어진 타임 슬라이스를 모두 사용한 CPU 집중 프로세스는 더 낮은 큐로 내려가고, 짧게 실행한 뒤 입출력을 요청하는 대화형 프로세스는 높은 우선순위를 유지한다.</p>
          <p>하위 큐에서 너무 오래 기다린 프로세스를 주기적으로 승격하면 기아를 방지할 수 있다. MLFQ는 실제 CPU 버스트 길이를 미리 알지 못해도 프로세스의 실행 행동을 관찰해 짧은 작업과 대화형 작업에 빠른 응답을 제공한다.</p>
          <figure className="article-figure article-diagram">
            <Image alt="서로 다른 타임 슬라이스를 가진 여러 큐 사이에서 프로세스가 강등되거나 승격되는 다단계 피드백 큐 스케줄링" height={900} sizes="(max-width: 1100px) 100vw, 820px" src="/images/cpu-scheduling/multilevel-feedback-queue.png" unoptimized width={1600} />
            <figcaption>CPU를 오래 쓰면 하위 큐로 강등하고, 오래 기다린 작업은 상위 큐로 승격해 우선순위를 조정한다.</figcaption>
          </figure>
        </section>

        <section className="article-section">
          <h2>한눈에 비교하기</h2>
          <div className="table-scroll">
            <table>
              <thead><tr><th>알고리즘</th><th>기본 형태</th><th>선택 기준</th><th>주의할 점</th></tr></thead>
              <tbody>
                <tr><th>FCFS</th><td>비선점형</td><td>도착 순서</td><td>호위 효과</td></tr>
                <tr><th>SJF</th><td>비선점형</td><td>가장 짧은 예상 CPU 버스트</td><td>실행 시간 예측, 기아</td></tr>
                <tr><th>라운드 로빈</th><td>선점형</td><td>도착 순서와 타임 슬라이스</td><td>타임 슬라이스 크기</td></tr>
                <tr><th>SRTF</th><td>선점형</td><td>가장 짧은 남은 시간</td><td>실행 시간 예측, 기아</td></tr>
                <tr><th>우선순위</th><td>둘 다 가능</td><td>프로세스 우선순위</td><td>기아, 에이징 필요</td></tr>
                <tr><th>다단계 큐</th><td>정책에 따라 다름</td><td>고정된 큐와 큐별 정책</td><td>낮은 큐의 기아</td></tr>
                <tr><th>다단계 피드백 큐</th><td>주로 선점형</td><td>실행 행동에 따른 동적 우선순위</td><td>정책과 매개변수 설계가 복잡함</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
      <TableOfContents />
    </div>
  );
}
