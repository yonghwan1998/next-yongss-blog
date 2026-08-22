import type { ReactNode } from "react";

type DeepResearchItem = {
  answer: ReactNode;
  question: string;
};

type DeepResearchProps = {
  items: readonly DeepResearchItem[];
};

export default function DeepResearch({ items }: DeepResearchProps) {
  return (
    <section className="article-section deep-research">
      <div className="deep-research-heading">
        <div>
          <p>Beyond the basics</p>
          <h2>Deep Research</h2>
        </div>
        <span aria-hidden="true">Q&amp;A</span>
      </div>
      <p className="deep-research-intro">본문에서 한 걸음 더 나아가 궁금할 만한 질문을 짧게 짚어본다.</p>
      <dl className="deep-research-list">
        {items.map((item, index) => (
          <div key={item.question}>
            <dt>
              <span aria-hidden="true">Q{String(index + 1).padStart(2, "0")}</span>
              {item.question}
            </dt>
            <dd>
              <span aria-hidden="true">A</span>
              <div>{item.answer}</div>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
