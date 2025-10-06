type Card = { title: string; desc: string; href: string; outbound?: boolean; };

const cards: Card[] = [
  {
    title: "Malestrum",
    desc: "A media platform exploring Gen Z, masculinity, and cultural change—podcasts, essays, and conversation.",
    href: "https://malestrum.com",
    outbound: true,
  },
  {
    title: "R&C Consulting",
    desc: "Practical AI strategy and implementations: vibe coding, workflow automation, and decision support.",
    href: "/rc-consulting"
  },
  {
    title: "Creative Works",
    desc: "A Tactical Life (SATL), short stories, and mixed-media projects at the intersection of craft and technology.",
    href: "/creative-works"
  },
];

export default function Projects() {
  return (
    <section className="px-6 py-16 lg:px-8 border-t border-neutral-200">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              {...(c.outbound ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group rounded-2xl border border-neutral-200 p-5 hover:shadow-sm transition"
            >
              <div className="text-base font-medium">{c.title}</div>
              <p className="mt-2 text-sm text-neutral-700">{c.desc}</p>
              <div className="mt-4 text-xs text-neutral-500 group-hover:text-neutral-700">
                {c.outbound ? "Visit site ↗" : "Learn more →"}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}