type WorkTileProps = {
  title: string;
  imgSrc: string;      // e.g. "/images/under-false-promise.jpg"
  imgAlt?: string;
  teaser: string;
  href: string;        // e.g. internal "/creative-works/under-false-promise" or external Notion URL
  external?: boolean;  // true if linking to Notion or another site
};

export default function WorkTile({
  title,
  imgSrc,
  imgAlt = "",
  teaser,
  href,
  external = false,
}: WorkTileProps) {
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a
      href={href}
      {...linkProps}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200 hover:shadow-sm transition"
    >
      {/* Image */}
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={imgSrc}
          alt={imgAlt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Text block */}
      <div className="p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-neutral-700">{teaser}</p>
        <div className="mt-4 text-xs text-neutral-500 group-hover:text-neutral-700">
          {external ? "Read more ↗" : "Read more →"}
        </div>
      </div>
    </a>
  );
}