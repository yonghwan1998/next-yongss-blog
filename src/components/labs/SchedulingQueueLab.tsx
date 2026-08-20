"use client";

import { useState } from "react";

type Device = "disk" | "printer";
type QueueState = "ready" | "waiting" | "running" | "done";
type WaitingQueues = Record<Device, number[]>;
type MotionRoute =
  | "ready-to-cpu"
  | "cpu-to-ready"
  | "cpu-to-disk"
  | "cpu-to-printer"
  | "disk-to-ready"
  | "printer-to-ready"
  | "cpu-to-done"
  | "add-ready"
  | "blocked";
type Motion = {
  sequence: number;
  route: MotionRoute;
  label: string;
  processId?: number;
  autoDispatchedId?: number;
};

const INITIAL_READY = [1, 2, 3, 4, 5];
const DEVICES: { id: Device; label: string; shortLabel: string }[] = [
  { id: "disk", label: "하드 디스크 대기 큐", shortLabel: "Disk" },
  { id: "printer", label: "프린터 대기 큐", shortLabel: "Printer" },
];

const initialWaiting = (): WaitingQueues => ({ disk: [], printer: [] });

export default function SchedulingQueueLab() {
  const [ready, setReady] = useState<number[]>([...INITIAL_READY]);
  const [running, setRunning] = useState<number | null>(null);
  const [waiting, setWaiting] = useState<WaitingQueues>(initialWaiting);
  const [done, setDone] = useState<number[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device>("disk");
  const [nextId, setNextId] = useState(6);
  const [motion, setMotion] = useState<Motion | null>(null);
  const [message, setMessage] = useState("준비 큐의 첫 프로세스를 CPU로 디스패치해 보세요.");

  const waitingCount = waiting.disk.length + waiting.printer.length;
  const selectedDeviceInfo = DEVICES.find((device) => device.id === selectedDevice)!;

  const playMotion = (next: Omit<Motion, "sequence">) => {
    setMotion((current) => ({ ...next, sequence: (current?.sequence ?? 0) + 1 }));
  };

  const showBlocked = (label: string, nextMessage: string) => {
    playMotion({ route: "blocked", label });
    setMessage(nextMessage);
  };

  const dispatch = () => {
    if (running !== null) {
      showBlocked("CPU 사용 중", `P${running}이 CPU를 사용 중입니다. 먼저 실행을 중단하거나 완료하세요.`);
      return;
    }

    const processId = ready[0];
    if (processId === undefined) {
      showBlocked("준비 큐가 비어 있음", "디스패치할 준비 상태 프로세스가 없습니다.");
      return;
    }

    playMotion({ route: "ready-to-cpu", processId, label: "DISPATCH" });
    setReady((items) => items.slice(1));
    setRunning(processId);
    setMessage(`준비 큐의 선두 P${processId}이 CPU를 할당받아 실행 상태가 됐습니다.`);
  };

  const interrupt = () => {
    if (running === null) {
      showBlocked("실행 중인 프로세스 없음", "타이머 인터럽트로 중단할 프로세스가 없습니다.");
      return;
    }

    const processId = running;
    playMotion({ route: "cpu-to-ready", processId, label: "TIMER INTERRUPT" });
    setRunning(null);
    setReady((items) => [...items, processId]);
    setMessage(`P${processId}의 타임 퀀텀이 끝나 준비 큐의 맨 뒤로 이동했습니다.`);
  };

  const requestIo = () => {
    if (running === null) {
      showBlocked("실행 중인 프로세스 없음", "I/O를 요청할 실행 상태 프로세스가 없습니다.");
      return;
    }

    const processId = running;
    const nextProcessId = ready[0];
    playMotion({
      route: `cpu-to-${selectedDevice}`,
      processId,
      autoDispatchedId: nextProcessId,
      label: `${selectedDeviceInfo.shortLabel} I/O 요청 · 자동 디스패치`,
    });
    setRunning(nextProcessId ?? null);
    if (nextProcessId !== undefined) setReady((items) => items.slice(1));
    setWaiting((queues) => ({ ...queues, [selectedDevice]: [...queues[selectedDevice], processId] }));
    setMessage(nextProcessId === undefined
      ? `P${processId}이 ${selectedDeviceInfo.label}로 이동했습니다. 준비 큐가 비어 CPU는 유휴 상태입니다.`
      : `P${processId}이 ${selectedDeviceInfo.label}로 이동하고, 준비 큐의 P${nextProcessId}이 자동 디스패치됐습니다.`);
  };

  const completeIo = () => {
    const processId = waiting[selectedDevice][0];
    if (processId === undefined) {
      showBlocked("선택한 대기 큐가 비어 있음", `${selectedDeviceInfo.label}에 완료할 I/O 작업이 없습니다.`);
      return;
    }

    playMotion({ route: `${selectedDevice}-to-ready`, processId, label: `${selectedDeviceInfo.shortLabel} I/O 완료` });
    setWaiting((queues) => ({ ...queues, [selectedDevice]: queues[selectedDevice].slice(1) }));
    setReady((items) => [...items, processId]);
    setMessage(`P${processId}의 I/O가 끝나 준비 큐의 맨 뒤로 복귀했습니다.`);
  };

  const completeCpu = () => {
    if (running === null) {
      showBlocked("실행 중인 프로세스 없음", "CPU 작업을 완료할 프로세스가 없습니다.");
      return;
    }

    const processId = running;
    playMotion({ route: "cpu-to-done", processId, label: "CPU 작업 완료" });
    setRunning(null);
    setDone((items) => [...items, processId]);
    setMessage(`P${processId}이 CPU 작업을 마치고 종료 상태가 됐습니다.`);
  };

  const addProcess = () => {
    playMotion({ route: "add-ready", processId: nextId, label: "새 프로세스 생성" });
    setReady((items) => [...items, nextId]);
    setNextId((id) => id + 1);
    setMessage(`P${nextId}을 준비 큐의 맨 뒤에 추가했습니다.`);
  };

  const reset = () => {
    setReady([...INITIAL_READY]);
    setRunning(null);
    setWaiting(initialWaiting());
    setDone([]);
    setSelectedDevice("disk");
    setNextId(6);
    setMotion(null);
    setMessage("준비 큐의 첫 프로세스를 CPU로 디스패치해 보세요.");
  };

  return (
    <section className="interactive-lab scheduling-lab" aria-labelledby="scheduling-queue-lab-title">
      <div className="lab-heading">
        <div><span>Interactive Lab</span><h3 id="scheduling-queue-lab-title">스케줄링 큐와 프로세스 상태 전이</h3></div>
        <button className="lab-button subtle" onClick={reset} type="button">초기화</button>
      </div>

      <div className="scheduling-summary" aria-label="현재 스케줄링 상태 요약">
        <SummaryItem label="준비" value={ready.length} />
        <SummaryItem label="실행" value={running === null ? 0 : 1} />
        <SummaryItem label="대기" value={waitingCount} />
        <SummaryItem label="종료" value={done.length} />
      </div>

      <div className="scheduling-board">
        {motion && (
          <div className={`schedule-motion-layer ${motion.route}`} key={motion.sequence} aria-hidden="true">
            <span className="lab-motion-caption">{motion.label}</span>
            {motion.processId !== undefined && <span className="lab-motion-badge primary-move">P{motion.processId}</span>}
            {motion.autoDispatchedId !== undefined && <span className="lab-motion-badge auto-dispatch">P{motion.autoDispatchedId}</span>}
          </div>
        )}

        <section className="schedule-stage schedule-ready" aria-labelledby="ready-queue-title">
          <div className="schedule-stage-heading">
            <div><span>READY</span><strong id="ready-queue-title">준비 큐</strong></div>
            <small>HEAD부터 FIFO 디스패치</small>
          </div>
          <QueueLane ids={ready} state="ready" emptyLabel="준비 중인 프로세스가 없습니다." />
        </section>

        <section className="schedule-stage schedule-waiting" aria-labelledby="waiting-queue-title">
          <div className="schedule-stage-heading">
            <div><span>WAITING</span><strong id="waiting-queue-title">장치별 대기 큐</strong></div>
            <small>I/O 완료 후 준비 큐로 복귀</small>
          </div>
          <div className="schedule-device-list">
            {DEVICES.map((device) => (
              <div className={`schedule-device-lane ${selectedDevice === device.id ? "selected" : ""}`} key={device.id}>
                <button aria-pressed={selectedDevice === device.id} className="schedule-device-picker" onClick={() => setSelectedDevice(device.id)} type="button">
                  <span>{device.shortLabel}</span><small>{device.label}</small>
                </button>
                <QueueLane ids={waiting[device.id]} state="waiting" emptyLabel="대기 없음" compact />
              </div>
            ))}
          </div>
        </section>

        <section className="schedule-stage schedule-cpu" aria-labelledby="cpu-title">
          <div className="schedule-stage-heading">
            <div><span>RUNNING</span><strong id="cpu-title">CPU</strong></div>
            <small>최대 1개</small>
          </div>
          <div className={`schedule-cpu-core ${running !== null ? "busy" : ""}`} key={running ?? "idle"}>
            <i aria-hidden="true" />
            <span>{running === null ? "IDLE" : "RUNNING"}</span>
            {running === null ? <small>실행 프로세스 없음</small> : <ProcessCard id={running} state="running" />}
          </div>
          <div className="schedule-completed">
            <div><span>TERMINATED</span><small>{done.length}개</small></div>
            <div className="schedule-completed-list">
              {done.length ? done.map((id) => <ProcessCard id={id} key={id} state="done" />) : <small>종료된 프로세스 없음</small>}
            </div>
          </div>
        </section>
      </div>

      <div className="scheduling-controls">
        <div className="schedule-control-group">
          <span>CPU 스케줄러</span>
          <div>
            <button className="lab-button primary" onClick={dispatch} type="button">디스패치</button>
            <button className="lab-button" onClick={interrupt} type="button">타이머 인터럽트</button>
            <button className="lab-button" onClick={completeCpu} type="button">CPU 작업 완료</button>
          </div>
        </div>
        <div className="schedule-control-group">
          <span>선택 장치 · {selectedDeviceInfo.shortLabel}</span>
          <div>
            <button className="lab-button" onClick={requestIo} type="button">실행 프로세스가 I/O 요청</button>
            <button className="lab-button" onClick={completeIo} type="button">I/O 완료</button>
            <button className="lab-button" onClick={addProcess} type="button">+ 프로세스 추가</button>
          </div>
        </div>
      </div>

      <p className="lab-message schedule-message" aria-live="polite"><span key={motion?.sequence ?? 0}>{message}</span></p>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return <div><span>{label}</span><strong key={value}>{value}</strong></div>;
}

function QueueLane({ ids, state, emptyLabel, compact = false }: { ids: number[]; state: QueueState; emptyLabel: string; compact?: boolean }) {
  const slotCount = Math.max(compact ? 4 : 6, ids.length);

  return (
    <div className={`schedule-queue-track ${compact ? "compact" : ""}`} aria-label={`${state} queue`}>
      {Array.from({ length: slotCount }, (_, index) => {
        const id = ids[index];
        return (
          <div className="schedule-queue-slot" key={id === undefined ? `empty-${index}` : `${state}-${id}`}>
            {id === undefined ? <span aria-hidden="true" /> : <ProcessCard id={id} state={state} />}
          </div>
        );
      })}
      {!ids.length && <small className="schedule-queue-empty">{emptyLabel}</small>}
    </div>
  );
}

function ProcessCard({ id, state }: { id: number; state: QueueState }) {
  return <div className={`schedule-pcb ${state}`} aria-label={`프로세스 P${id}, ${state}`}><b>P{id}</b><small>PCB</small></div>;
}
