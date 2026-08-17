"use client";

import { useState } from "react";

type TaskState = "ready" | "waiting" | "running" | "done";
type TaskItem = { id: number; state: TaskState };
const CAPACITY = 3;
const initialTasks = (): TaskItem[] => [1, 2, 3, 4, 5].map((id) => ({ id, state: "ready" }));

export default function SemaphoreLab() {
  const [tasks, setTasks] = useState(initialTasks);
  const [running, setRunning] = useState<number[]>([]);
  const [queue, setQueue] = useState<number[]>([]);
  const [nextId, setNextId] = useState(6);
  const [message, setMessage] = useState("허가증이 있는 동안 여러 태스크가 동시에 진입할 수 있습니다.");
  const permits = CAPACITY - running.length;

  const wait = () => {
    const target = tasks.find((task) => task.state === "ready");
    if (!target) {
      setMessage("새 태스크를 추가하거나 허가증을 반환하세요.");
      return;
    }
    if (running.length < CAPACITY) {
      setRunning((items) => [...items, target.id]);
      setTasks((items) => items.map((item) => item.id === target.id ? { ...item, state: "running" } : item));
      setMessage(`T${target.id}이 허가증을 획득했습니다. 남은 허가증은 ${permits - 1}개입니다.`);
      return;
    }
    setQueue((items) => [...items, target.id]);
    setTasks((items) => items.map((item) => item.id === target.id ? { ...item, state: "waiting" } : item));
    setMessage(`허가증이 없어 T${target.id}은 대기 큐로 이동했습니다.`);
  };

  const signal = () => {
    const released = running[0];
    if (released === undefined) {
      setMessage("반환할 허가증이 없습니다.");
      return;
    }
    const next = queue[0];
    setRunning((items) => next === undefined ? items.slice(1) : [...items.slice(1), next]);
    setQueue((items) => items.slice(1));
    setTasks((items) => items.map((item) => {
      if (item.id === released) return { ...item, state: "done" };
      if (item.id === next) return { ...item, state: "running" };
      return item;
    }));
    setMessage(next === undefined ? `T${released}이 허가증을 반환했습니다.` : `T${released}이 반환한 허가증을 T${next}이 넘겨받았습니다.`);
  };

  const addTask = () => {
    setTasks((items) => [...items, { id: nextId, state: "ready" }]);
    setNextId((id) => id + 1);
    setMessage(`T${nextId}을 준비 큐에 추가했습니다.`);
  };

  const reset = () => {
    setTasks(initialTasks()); setRunning([]); setQueue([]); setNextId(6);
    setMessage("허가증이 있는 동안 여러 태스크가 동시에 진입할 수 있습니다.");
  };

  return (
    <section className="interactive-lab semaphore-lab" aria-labelledby="semaphore-lab-title">
      <div className="lab-heading">
        <div><span>Interactive Lab</span><h3 id="semaphore-lab-title">여러 허가증, 제한된 동시 접근</h3></div>
        <button className="lab-button subtle" onClick={reset} type="button">초기화</button>
      </div>
      <div className="permit-summary"><span>현재 카운터</span><strong>{permits}</strong><small> / {CAPACITY}</small></div>
      <div className="permit-slots">{Array.from({ length: CAPACITY }, (_, index) => <div className={running[index] ? "used" : ""} key={index}>{running[index] ? `T${running[index]} 사용 중` : "사용 가능"}</div>)}</div>
      <div className="lab-workspace semaphore-workspace">
        <div className="lab-zone">
          <div className="lab-zone-title"><span>Ready / Waiting</span><span>대기 {queue.length}</span></div>
          <div className="lab-task-list">{tasks.filter((item) => item.state === "ready" || item.state === "waiting").map((item) => <Task key={item.id} task={item} />)}</div>
          <div className="lab-queue"><span>FIFO Queue</span><div>{queue.length ? queue.map((id) => <b key={id}>T{id}</b>) : <small>비어 있음</small>}</div></div>
        </div>
        <div className="lab-zone critical">
          <div className="lab-zone-title"><span>Running</span><span>최대 {CAPACITY}개</span></div>
          <div className="lab-task-list">{running.length ? running.map((id) => <Task key={id} task={{ id, state: "running" }} />) : <p className="lab-empty">실행 중인 태스크가 없습니다.</p>}</div>
        </div>
      </div>
      <div className="lab-controls">
        <button className="lab-button primary" onClick={wait} type="button">P · wait()</button>
        <button className="lab-button" onClick={signal} type="button">V · signal()</button>
        <button className="lab-button" onClick={addTask} type="button">+ 태스크 추가</button>
      </div>
      <p className="lab-message" aria-live="polite">{message}</p>
    </section>
  );
}

function Task({ task }: { task: TaskItem }) {
  const labels: Record<TaskState, string> = { ready: "준비", waiting: "대기", running: "실행 중", done: "완료" };
  return <div className={`lab-task ${task.state}`}><b>T{task.id}</b><span>태스크 T{task.id}</span><small>{labels[task.state]}</small></div>;
}
