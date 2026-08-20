"use client";

import { useState } from "react";

type ProcessState = "ready" | "waiting" | "running" | "done";
type Process = { id: number; state: ProcessState };
type MotionType = "enter" | "queue" | "handoff" | "release" | "add" | "blocked";
type Motion = {
  sequence: number;
  type: MotionType;
  id?: number;
  releasedId?: number;
  label: string;
};

const initialProcesses = (): Process[] => [1, 2, 3].map((id) => ({ id, state: "ready" }));

export default function MutexLab() {
  const [processes, setProcesses] = useState(initialProcesses);
  const [owner, setOwner] = useState<number | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [nextId, setNextId] = useState(4);
  const [message, setMessage] = useState("P1이 락을 획득하도록 눌러보세요.");
  const [motion, setMotion] = useState<Motion | null>(null);

  const playMotion = (next: Omit<Motion, "sequence">) => {
    setMotion((current) => ({ ...next, sequence: (current?.sequence ?? 0) + 1 }));
  };

  const acquire = () => {
    const target = processes.find((process) => process.state === "ready");
    if (!target) {
      playMotion({ type: "blocked", label: "진입할 프로세스 없음" });
      setMessage("새 프로세스를 추가하거나 현재 락을 해제하세요.");
      return;
    }

    if (owner === null) {
      playMotion({ type: "enter", id: target.id, label: "LOCK 획득" });
      setOwner(target.id);
      setProcesses((items) => items.map((item) => item.id === target.id ? { ...item, state: "running" } : item));
      setMessage(`P${target.id}이 락을 획득해 임계 구역에 진입했습니다.`);
      return;
    }

    playMotion({ type: "queue", id: target.id, label: "FIFO 대기열로" });
    setQueue((items) => [...items, target.id]);
    setProcesses((items) => items.map((item) => item.id === target.id ? { ...item, state: "waiting" } : item));
    setMessage(`P${target.id}은 P${owner}이 락을 해제할 때까지 기다립니다.`);
  };

  const release = () => {
    if (owner === null) {
      playMotion({ type: "blocked", label: "반환할 LOCK 없음" });
      setMessage("현재 획득된 락이 없습니다.");
      return;
    }

    const previousOwner = owner;
    const nextOwner = queue[0] ?? null;
    playMotion(nextOwner === null
      ? { type: "release", id: previousOwner, label: "LOCK 반환" }
      : { type: "handoff", id: nextOwner, releasedId: previousOwner, label: "LOCK 전달" });
    setQueue((items) => items.slice(1));
    setOwner(nextOwner);
    setProcesses((items) => items.map((item) => {
      if (item.id === previousOwner) return { ...item, state: "done" };
      if (item.id === nextOwner) return { ...item, state: "running" };
      return item;
    }));
    setMessage(nextOwner === null ? "락이 해제되어 다시 사용할 수 있습니다." : `FIFO 순서에 따라 P${nextOwner}이 락을 넘겨받았습니다.`);
  };

  const addProcess = () => {
    playMotion({ type: "add", id: nextId, label: "준비 상태에 추가" });
    setProcesses((items) => [...items, { id: nextId, state: "ready" }]);
    setNextId((id) => id + 1);
    setMessage(`P${nextId}을 준비 큐에 추가했습니다.`);
  };

  const reset = () => {
    setProcesses(initialProcesses());
    setOwner(null);
    setQueue([]);
    setNextId(4);
    setMotion(null);
    setMessage("P1이 락을 획득하도록 눌러보세요.");
  };

  return (
    <section className="interactive-lab" aria-labelledby="mutex-lab-title">
      <div className="lab-heading">
        <div><span>Interactive Lab</span><h3 id="mutex-lab-title">하나의 열쇠, 하나의 소유자</h3></div>
        <button className="lab-button subtle" onClick={reset} type="button">초기화</button>
      </div>
      <div className="lab-workspace">
        {motion && (
          <div className={`lab-motion-layer mutex-motion ${motion.type}`} key={motion.sequence} aria-hidden="true">
            <span className="lab-motion-caption">{motion.label}</span>
            {motion.id !== undefined && <span className="lab-motion-badge incoming">P{motion.id}</span>}
            {motion.releasedId !== undefined && <span className="lab-motion-badge outgoing">P{motion.releasedId}</span>}
          </div>
        )}
        <div className="lab-zone">
          <div className="lab-zone-title"><span>Ready / Waiting</span><span>대기 {queue.length}</span></div>
          <div className="lab-task-list">
            {processes.filter((item) => item.state !== "running" && item.state !== "done").map((item) => <Task key={`${item.id}-${item.state}`} process={item} />)}
            {!processes.some((item) => item.state !== "running" && item.state !== "done") && <p className="lab-empty">준비 중인 프로세스가 없습니다.</p>}
          </div>
          <div className="lab-queue"><span>FIFO Queue</span><div>{queue.length ? queue.map((id) => <b key={id}>P{id}</b>) : <small>비어 있음</small>}</div></div>
        </div>
        <div className="lab-resource">
          <div className={`lab-lock ${owner === null ? "open" : ""} ${motion && ["enter", "handoff", "release"].includes(motion.type) ? "changing" : ""}`}><span /><b key={motion?.sequence ?? 0}>{owner === null ? "열림" : "잠김"}</b></div>
          <strong>공유 자원</strong><small>{owner === null ? "소유자 없음" : `소유자 P${owner}`}</small>
        </div>
        <div className="lab-zone critical">
          <div className="lab-zone-title"><span>Critical Section</span><span>최대 1개</span></div>
          <div className="lab-task-list">
            {owner !== null ? <Task process={{ id: owner, state: "running" }} /> : <p className="lab-empty">비어 있음</p>}
          </div>
        </div>
      </div>
      <div className="lab-controls">
        <button className="lab-button primary" onClick={acquire} type="button">락 획득 시도</button>
        <button className="lab-button" onClick={release} type="button">락 해제</button>
        <button className="lab-button" onClick={addProcess} type="button">+ 프로세스 추가</button>
      </div>
      <p className="lab-message" aria-live="polite"><span key={motion?.sequence ?? 0}>{message}</span></p>
    </section>
  );
}

function Task({ process }: { process: Process }) {
  const labels: Record<ProcessState, string> = { ready: "준비", waiting: "대기", running: "실행 중", done: "완료" };
  return <div className={`lab-task ${process.state}`}><b>P{process.id}</b><span>프로세스 P{process.id}</span><small>{labels[process.state]}</small></div>;
}
