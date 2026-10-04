export default function SectionHeading({ eyebrow, title, text, action }) {
  return <div className="section-heading-row"><div className="section-heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</div>{action}</div>;
}
