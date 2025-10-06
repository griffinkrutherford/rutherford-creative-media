export default function Footer() {
  return (
    <footer className="px-6 py-10 lg:px-8 border-t border-neutral-200">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-neutral-600">
          © 2025 Rutherford Creative Media — All Rights Reserved.
        </div>
        <a href="mailto:info@rutherfordcreativemedia.com" className="text-sm underline underline-offset-2">
          info@rutherfordcreativemedia.com
        </a>
      </div>
    </footer>
  );
}