export default function Hero() {
  return (
    <section className="relative isolate px-6 pt-24 pb-20 sm:pt-28 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Rutherford Creative Media
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Where storytelling, leadership, and practical AI meet.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="/projects" className="rounded-xl px-5 py-3 text-sm font-medium border border-neutral-300 hover:bg-neutral-50">
            Explore Projects
          </a>
          <a href="/about" className="rounded-xl px-5 py-3 text-sm font-medium bg-black text-white hover:bg-neutral-900">
            About Us
          </a>
        </div>
      </div>
    </section>
  );
}