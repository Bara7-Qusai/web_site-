export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "start",
  tone = "dark",
  id,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
  id?: string;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow ${tone === "light" ? "!text-leaf-400" : ""}`}>{eyebrow}</p>}
      <h2 id={id} className={`mt-3 text-3xl font-bold leading-tight sm:text-4xl ${tone === "light" ? "text-white" : "text-forest-900"}`}>
        {title}
      </h2>
      {text && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${tone === "light" ? "text-white/75" : "text-ink-700"}`}>{text}</p>}
    </div>
  );
}
