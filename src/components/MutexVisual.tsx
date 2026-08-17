export default function MutexVisual() {
  return (
    <div className="mutex-visual" aria-label="뮤텍스 락 동작 애니메이션">
      <div className="process process-a">P1</div>
      <div className="process process-b">P2</div>
      <div className="lock-zone">
        <span className="lock-icon" aria-hidden="true">⌁</span>
        <strong>Critical Section</strong>
        <small>one process at a time</small>
      </div>
      <span className="signal signal-a" aria-hidden="true" />
      <span className="signal signal-b" aria-hidden="true" />
    </div>
  );
}
