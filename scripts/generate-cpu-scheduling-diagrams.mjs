import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = path.join(ROOT, "public", "images", "cpu-scheduling");

const WIDTH = 1600;
const HEIGHT = 900;

const colors = {
  ink: "#20302d",
  muted: "#65716e",
  border: "#aeb9b5",
  grid: "#e9eeeb",
  paper: "#fbfcfa",
  panel: "#f4f7f3",
  green: "#77945d",
  greenDark: "#557441",
  greenSoft: "#e8f0df",
  teal: "#4e8582",
  tealSoft: "#dceceb",
  blue: "#5f84ad",
  blueSoft: "#e3ebf5",
  amber: "#bd8a39",
  amberSoft: "#f6ead4",
  red: "#b85d58",
  redSoft: "#f6e1df",
  violet: "#7a6b9d",
  violetSoft: "#ece8f4",
};

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function baseSvg({ title, subtitle, body }) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="${colors.grid}" stroke-width="1"/>
        </pattern>
        <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L12,6 L0,12 z" fill="context-stroke"/>
        </marker>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#20302d" flood-opacity="0.10"/>
        </filter>
      </defs>
      <rect width="1600" height="900" fill="${colors.paper}"/>
      <rect width="1600" height="900" fill="url(#grid)" opacity="0.55"/>
      <text x="800" y="72" text-anchor="middle" class="title">${escapeXml(title)}</text>
      <text x="800" y="118" text-anchor="middle" class="subtitle">${escapeXml(subtitle)}</text>
      ${body}
      <style>
        text { font-family: "Malgun Gothic", "Noto Sans KR", Arial, sans-serif; fill: ${colors.ink}; }
        .title { font-size: 48px; font-weight: 800; letter-spacing: -1.5px; }
        .subtitle { font-size: 24px; font-weight: 500; fill: ${colors.muted}; }
        .section { font-size: 34px; font-weight: 800; }
        .label { font-size: 28px; font-weight: 700; }
        .body { font-size: 26px; font-weight: 500; }
        .small { font-size: 22px; font-weight: 500; fill: ${colors.muted}; }
        .tiny { font-size: 20px; font-weight: 600; fill: ${colors.muted}; }
        .white { fill: #ffffff; }
      </style>
    </svg>`;
}

function roundedRect(x, y, width, height, { fill = colors.paper, stroke = colors.border, radius = 18, strokeWidth = 2, shadow = false } = {}) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${shadow ? ' filter="url(#shadow)"' : ""}/>`;
}

function line(x1, y1, x2, y2, { stroke = colors.teal, width = 4, arrow = false, dash = "" } = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${arrow ? ' marker-end="url(#arrow)"' : ""}${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

function polyline(points, { stroke = colors.teal, width = 4, arrow = false, dash = "", fill = "none" } = {}) {
  return `<polyline points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${arrow ? ' marker-end="url(#arrow)"' : ""}${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

function centeredText(x, y, text, className = "body") {
  return `<text x="${x}" y="${y}" text-anchor="middle" class="${className}">${escapeXml(text)}</text>`;
}

function processCard({ x, y, width, height, id, lines, fill = colors.tealSoft, stroke = colors.teal, badge }) {
  const lineGap = 31;
  const firstLineY = y + 88;
  return `
    ${roundedRect(x, y, width, height, { fill, stroke, radius: 20, strokeWidth: 3, shadow: true })}
    ${badge ? `<rect x="${x + 18}" y="${y - 17}" width="${badge.length * 14 + 34}" height="34" rx="17" fill="${stroke}"/>${centeredText(x + 35 + badge.length * 7, y + 6, badge, "tiny white")}` : ""}
    ${centeredText(x + width / 2, y + 65, `프로세스 ${id}`, "section")}
    ${lines.map((text, index) => centeredText(x + width / 2, firstLineY + index * lineGap, text, index === 0 ? "body" : "small")).join("")}`;
}

function gantt({ x, y, width, height, segments, total }) {
  const palette = {
    A: [colors.blue, colors.blueSoft],
    B: [colors.green, colors.greenSoft],
    C: [colors.amber, colors.amberSoft],
    D: [colors.red, colors.redSoft],
  };
  let current = 0;
  let body = roundedRect(x, y, width, height, { fill: colors.paper, stroke: colors.border, radius: 12, strokeWidth: 2 });
  for (const segment of segments) {
    const startX = x + (current / total) * width;
    const segmentWidth = (segment.duration / total) * width;
    const [stroke, fill] = palette[segment.id] ?? [colors.teal, colors.tealSoft];
    body += `<rect x="${startX}" y="${y}" width="${segmentWidth}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    body += centeredText(startX + segmentWidth / 2, y + height / 2 + 9, segment.label ?? segment.id, "label");
    body += `<text x="${startX}" y="${y + height + 32}" text-anchor="middle" class="small">${current}</text>`;
    current += segment.duration;
  }
  body += `<text x="${x + width}" y="${y + height + 32}" text-anchor="middle" class="small">${total}ms</text>`;
  return body;
}

function cpuBlock(x, y, size = 180) {
  return `
    ${roundedRect(x, y, size, size, { fill: colors.ink, stroke: colors.ink, radius: 30, strokeWidth: 3, shadow: true })}
    ${centeredText(x + size / 2, y + size / 2 + 13, "CPU", "title white")}`;
}

function fcfsDiagram() {
  const cards = [
    { id: "A", arrival: 0, burst: 30, fill: colors.blueSoft, stroke: colors.blue },
    { id: "B", arrival: 5, burst: 15, fill: colors.greenSoft, stroke: colors.green },
    { id: "C", arrival: 10, burst: 25, fill: colors.amberSoft, stroke: colors.amber },
    { id: "D", arrival: 15, burst: 10, fill: colors.redSoft, stroke: colors.red },
  ];
  const cardWidth = 250;
  const gap = 28;
  const startX = 355;
  const cardsBody = cards.map((card, index) => processCard({
    x: startX + index * (cardWidth + gap), y: 220, width: cardWidth, height: 205,
    id: card.id,
    lines: [`도착 ${card.arrival}ms`, `CPU 버스트 ${card.burst}ms`],
    fill: card.fill, stroke: card.stroke,
    badge: index === 0 ? "HEAD · 다음 실행" : index === cards.length - 1 ? "TAIL" : undefined,
  })).join("");

  const execution = [
    { id: "A", duration: 30 },
    { id: "B", duration: 15 },
    { id: "C", duration: 25 },
    { id: "D", duration: 10 },
  ];

  return baseSvg({
    title: "선입 선처리 스케줄링 (FCFS)",
    subtitle: "준비 큐에 도착한 순서대로 실행하는 비선점형 알고리즘",
    body: `
      ${centeredText(800, 177, "준비 큐 · HEAD가 CPU에 가장 가깝다", "section")}
      ${cpuBlock(75, 235, 170)}
      ${line(345, 323, 260, 323, { stroke: colors.teal, width: 6, arrow: true })}
      ${cardsBody}
      ${centeredText(800, 480, "도착 순서: A → B → C → D", "label")}
      ${centeredText(800, 548, "실행 순서와 완료 시점", "section")}
      ${gantt({ x: 120, y: 590, width: 1360, height: 112, segments: execution, total: 80 })}
      ${roundedRect(390, 770, 820, 70, { fill: colors.greenSoft, stroke: colors.green, radius: 18, strokeWidth: 2 })}
      ${centeredText(800, 815, "A가 종료될 때까지 B·C·D는 CPU를 선점할 수 없다", "body")}
    `,
  });
}

function roundRobinDiagram() {
  const bursts = [
    ["A", "25ms", colors.blueSoft, colors.blue],
    ["B", "10ms", colors.greenSoft, colors.green],
    ["C", "15ms", colors.amberSoft, colors.amber],
    ["D", "30ms", colors.redSoft, colors.red],
  ];
  const cards = bursts.map(([id, burst, fill, stroke], index) => `
    ${roundedRect(160 + index * 325, 210, 275, 128, { fill, stroke, radius: 18, strokeWidth: 3, shadow: true })}
    ${centeredText(297 + index * 325, 258, `프로세스 ${id}`, "section")}
    ${centeredText(297 + index * 325, 307, `CPU 버스트 ${burst}`, "body")}
  `).join("");
  const segments = [
    { id: "A", duration: 10, label: "A 10" },
    { id: "B", duration: 10, label: "B 완료" },
    { id: "C", duration: 10, label: "C 10" },
    { id: "D", duration: 10, label: "D 10" },
    { id: "A", duration: 10, label: "A 10" },
    { id: "C", duration: 5, label: "C 완료" },
    { id: "D", duration: 10, label: "D 10" },
    { id: "A", duration: 5, label: "A 완료" },
    { id: "D", duration: 10, label: "D 완료" },
  ];
  return baseSvg({
    title: "라운드 로빈 스케줄링",
    subtitle: "타임 슬라이스 10ms · 모든 프로세스는 t=0에 도착",
    body: `
      ${centeredText(800, 170, "초기 준비 큐 · A → B → C → D", "section")}
      ${cards}
      ${roundedRect(375, 385, 850, 76, { fill: colors.tealSoft, stroke: colors.teal, radius: 18, strokeWidth: 2 })}
      ${centeredText(800, 433, "10ms 안에 끝나지 않으면 남은 작업을 가지고 준비 큐의 뒤로 이동", "body")}
      ${centeredText(800, 525, "CPU 실행 순서", "section")}
      ${gantt({ x: 100, y: 565, width: 1400, height: 112, segments, total: 80 })}
      ${roundedRect(275, 762, 1050, 76, { fill: colors.panel, stroke: colors.border, radius: 18, strokeWidth: 2 })}
      ${centeredText(800, 810, "완료 순서: B(20ms) → C(55ms) → A(70ms) → D(80ms)", "label")}
    `,
  });
}

function srtfDiagram() {
  const inputs = [
    ["A", "0ms", "10ms", colors.blueSoft, colors.blue],
    ["C", "3ms", "3ms", colors.amberSoft, colors.amber],
    ["B", "4ms", "5ms", colors.greenSoft, colors.green],
  ];
  const tableRows = inputs.map(([id, arrival, burst, fill, stroke], index) => `
    <rect x="120" y="${243 + index * 76}" width="470" height="76" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    ${centeredText(190, 292 + index * 76, id, "section")}
    ${centeredText(345, 292 + index * 76, arrival, "body")}
    ${centeredText(510, 292 + index * 76, burst, "body")}
  `).join("");
  const segments = [
    { id: "A", duration: 3, label: "A" },
    { id: "C", duration: 3, label: "C 완료" },
    { id: "B", duration: 5, label: "B 완료" },
    { id: "A", duration: 7, label: "A 완료" },
  ];
  return baseSvg({
    title: "최소 잔여 시간 우선 스케줄링 (SRTF)",
    subtitle: "새 프로세스 도착 시 남은 시간이 더 짧으면 현재 프로세스를 선점",
    body: `
      ${centeredText(355, 185, "프로세스 입력", "section")}
      <rect x="120" y="203" width="470" height="40" rx="10" fill="${colors.ink}"/>
      ${centeredText(190, 232, "프로세스", "tiny white")}
      ${centeredText(345, 232, "도착 시간", "tiny white")}
      ${centeredText(510, 232, "CPU 버스트", "tiny white")}
      ${tableRows}

      ${roundedRect(680, 205, 790, 270, { fill: colors.paper, stroke: colors.teal, radius: 24, strokeWidth: 3, shadow: true })}
      ${centeredText(1075, 260, "t=3에서 선점 발생", "section")}
      ${centeredText(1075, 315, "A: 3ms 실행 → 남은 시간 7ms", "body")}
      ${centeredText(1075, 360, "C: 새로 도착 → 실행 시간 3ms", "body")}
      ${line(860, 405, 1270, 405, { stroke: colors.red, width: 5, arrow: true })}
      ${centeredText(1075, 448, "3ms < 7ms 이므로 C가 A를 선점", "label")}

      ${centeredText(800, 550, "CPU 실행 순서", "section")}
      ${gantt({ x: 120, y: 588, width: 1360, height: 112, segments, total: 18 })}
      ${roundedRect(290, 772, 1020, 70, { fill: colors.redSoft, stroke: colors.red, radius: 18, strokeWidth: 2 })}
      ${centeredText(800, 817, "C가 끝난 뒤 B(5ms)를 실행하고, 마지막으로 A의 남은 7ms를 처리", "body")}
    `,
  });
}

function multilevelQueueDiagram() {
  const queues = [
    { id: "Q1", title: "시스템 프로세스", policy: "Round Robin · 8ms", examples: "커널 작업 · 장치 관리", fill: colors.redSoft, stroke: colors.red },
    { id: "Q2", title: "대화형 프로세스", policy: "Round Robin · 16ms", examples: "터미널 · 사용자 입력", fill: colors.amberSoft, stroke: colors.amber },
    { id: "Q3", title: "배치 프로세스", policy: "FCFS", examples: "대규모 계산 · 일괄 처리", fill: colors.greenSoft, stroke: colors.green },
    { id: "Q4", title: "백그라운드 프로세스", policy: "FCFS", examples: "낮은 우선순위 작업", fill: colors.blueSoft, stroke: colors.blue },
  ];
  const queueBlocks = queues.map((queue, index) => {
    const y = 190 + index * 154;
    return `
      ${roundedRect(130, y, 930, 120, { fill: queue.fill, stroke: queue.stroke, radius: 20, strokeWidth: 3, shadow: true })}
      <rect x="130" y="${y}" width="120" height="120" rx="20" fill="${queue.stroke}"/>
      ${centeredText(190, y + 72, queue.id, "section white")}
      <text x="285" y="${y + 47}" class="section">${escapeXml(queue.title)}</text>
      <text x="285" y="${y + 84}" class="body">큐 내부 정책: ${escapeXml(queue.policy)}</text>
      <text x="720" y="${y + 84}" class="small">${escapeXml(queue.examples)}</text>
      ${line(1070, y + 60, 1235, 390, { stroke: queue.stroke, width: 4, arrow: true })}
    `;
  }).join("");
  return baseSvg({
    title: "다단계 큐 스케줄링 (Multilevel Queue)",
    subtitle: "프로세스 유형별로 고정된 준비 큐를 사용하고 큐마다 다른 정책을 적용",
    body: `
      ${centeredText(600, 160, "고정된 준비 큐", "section")}
      ${queueBlocks}
      ${cpuBlock(1250, 300, 220)}
      ${centeredText(1360, 560, "큐 사이 정책", "section")}
      ${centeredText(1360, 602, "고정 우선순위", "body")}
      ${centeredText(1360, 637, "Q1 > Q2 > Q3 > Q4", "label")}
      ${centeredText(1360, 678, "또는 CPU 시간 비율 배분", "small")}
      ${roundedRect(260, 825, 1080, 58, { fill: colors.panel, stroke: colors.border, radius: 18, strokeWidth: 2 })}
      ${centeredText(800, 863, "핵심: 전형적인 다단계 큐에서는 프로세스가 처음 배정된 큐를 이동하지 않는다", "label")}
    `,
  });
}

function mlfqDiagram() {
  const queue = ({ y, id, title, policy, fill, stroke, items }) => `
    ${roundedRect(170, y, 730, 150, { fill, stroke, radius: 22, strokeWidth: 3, shadow: true })}
    <rect x="170" y="${y}" width="130" height="150" rx="22" fill="${stroke}"/>
    ${centeredText(235, y + 65, id, "section white")}
    ${centeredText(235, y + 102, title, "tiny white")}
    <text x="335" y="${y + 51}" class="section">${escapeXml(policy)}</text>
    <text x="335" y="${y + 91}" class="body">${escapeXml(items)}</text>
    <text x="335" y="${y + 125}" class="small">우선순위 ${id === "Q0" ? "높음" : id === "Q1" ? "중간" : "낮음"}</text>
  `;
  return baseSvg({
    title: "다단계 피드백 큐 스케줄링 (MLFQ)",
    subtitle: "실행 행동에 따라 프로세스가 큐 사이를 이동하며 우선순위가 동적으로 변한다",
    body: `
      ${queue({ y: 190, id: "Q0", title: "상위", policy: "Round Robin · 8ms", items: "새 프로세스 P1 · P2", fill: colors.redSoft, stroke: colors.red })}
      ${queue({ y: 405, id: "Q1", title: "중간", policy: "Round Robin · 16ms", items: "Q0의 타임 슬라이스를 모두 사용한 작업", fill: colors.amberSoft, stroke: colors.amber })}
      ${queue({ y: 620, id: "Q2", title: "하위", policy: "FCFS", items: "CPU를 오래 사용하는 작업", fill: colors.blueSoft, stroke: colors.blue })}

      ${line(535, 350, 535, 395, { stroke: colors.red, width: 5, arrow: true })}
      ${centeredText(745, 385, "8ms 모두 사용 → Q1으로 강등", "body")}
      ${line(535, 565, 535, 610, { stroke: colors.amber, width: 5, arrow: true })}
      ${centeredText(755, 600, "16ms 모두 사용 → Q2로 강등", "body")}

      ${polyline("910,740 980,740 980,255 920,255", { stroke: colors.greenDark, width: 5, arrow: true, dash: "12 9" })}
      ${centeredText(1210, 692, "주기적 우선순위 부스트", "label")}
      ${centeredText(1210, 730, "오래 기다린 작업을 Q0으로 승격", "body")}

      ${cpuBlock(1210, 285, 220)}
      ${line(910, 265, 1195, 350, { stroke: colors.red, width: 4, arrow: true })}
      ${line(910, 480, 1195, 390, { stroke: colors.amber, width: 4, arrow: true })}
      ${line(910, 695, 1195, 430, { stroke: colors.blue, width: 4, arrow: true })}
      ${roundedRect(1065, 515, 410, 112, { fill: colors.greenSoft, stroke: colors.green, radius: 18, strokeWidth: 2 })}
      ${centeredText(1270, 558, "I/O를 일찍 요청한 작업", "label")}
      ${centeredText(1270, 594, "현재 우선순위를 유지", "body")}
      ${roundedRect(160, 835, 1280, 48, { fill: colors.panel, stroke: colors.border, radius: 16, strokeWidth: 2 })}
      ${centeredText(800, 868, "새 작업은 Q0에서 시작 · CPU를 오래 쓰면 강등 · 오래 기다리면 승격", "label")}
    `,
  });
}

const diagrams = [
  ["fcfs.png", fcfsDiagram()],
  ["round-robin.png", roundRobinDiagram()],
  ["srtf.png", srtfDiagram()],
  ["multilevel-queue.png", multilevelQueueDiagram()],
  ["multilevel-feedback-queue.png", mlfqDiagram()],
];

for (const [filename, svg] of diagrams) {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: false })
    .toFile(path.join(OUTPUT_DIR, filename));
  console.log(`generated ${filename}`);
}
