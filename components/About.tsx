export default function About() {
  return (
    <section className="px-6 py-16 lg:px-8 border-t border-neutral-200">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold">About Rutherford Creative Media</h2>
        <p className="mt-4 leading-7 text-neutral-700">
          RCM is the studio of Barry and Griffin Rutherford. We blend storytelling, leadership, and practical AI to make ideas useful—across books, podcasts, and applied technology.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-medium">Barry Rutherford — Author & Global CEO (Ret.)</h3>
            <p className="mt-2 text-neutral-700">
              Barry led teams worldwide in packaging, supply chain, and M&amp;A. Now he channels that experience into writing, podcasting, and mentoring, with a focus on clear thinking and lived leadership.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Griffin Rutherford — AI Engineer & Builder</h3>
            <p className="mt-2 text-neutral-700">
              Grif (MS, Computer Science) ships practical AI implementations—vibe coding, automation, and getting real work done with modern AI tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}