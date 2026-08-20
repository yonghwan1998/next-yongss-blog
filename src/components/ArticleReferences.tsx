type ArticleReference = {
  description: string;
  href: string;
  source: string;
  title: string;
};

type ArticleReferencesProps = {
  imageDisclosure?: string;
  references: readonly ArticleReference[];
};

export default function ArticleReferences({ imageDisclosure, references }: ArticleReferencesProps) {
  return (
    <section className="article-section article-references">
      <h2>참고 자료</h2>
      <p className="article-references-intro">글의 개념과 용어를 검토할 때 참고한 원문 자료다.</p>
      <ol className="article-reference-list">
        {references.map((reference) => (
          <li key={reference.href}>
            <a href={reference.href} rel="noopener noreferrer" target="_blank">
              <span>
                <small>{reference.source}</small>
                <strong>{reference.title}</strong>
              </span>
              <i aria-hidden="true">↗</i>
            </a>
            <p>{reference.description}</p>
          </li>
        ))}
      </ol>
      {imageDisclosure ? (
        <aside className="article-disclosure">
          <strong>이미지 제작 안내</strong>
          <p>{imageDisclosure}</p>
        </aside>
      ) : null}
    </section>
  );
}
