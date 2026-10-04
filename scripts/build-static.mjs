/**
 * Builds a static HTML/CSS/JS version of the site into `out/` and zips it.
 *
 *   npm run build:static
 *
 * Server-only parts are left out of the static build:
 *   - src/proxy.ts (language redirect)  → replaced by out/index.html, which picks /ar/ or /en/
 *   - src/app/api (inquiry endpoint)    → set NEXT_PUBLIC_INQUIRY_ENDPOINT (e.g. Formspree)
 * The build runs in a temporary copy, so the working tree is never modified.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(".");
// Inside the project so packages resolve from ../node_modules (Turbopack rejects symlinks out of its root).
const work = join(root, ".static-build");
const skip = new Set(["node_modules", ".next", "out", ".git", ".static-build"]);

try {
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work);
  for (const entry of readdirSync(root)) {
    if (!skip.has(entry) && !entry.endsWith(".zip")) cpSync(join(root, entry), join(work, entry), { recursive: true });
  }
  rmSync(join(work, "src/proxy.ts"), { force: true });
  rmSync(join(work, "src/app/api"), { recursive: true, force: true });

  execSync("npx next build", { cwd: work, stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1", STATIC_TURBOPACK_ROOT: root } });

  const out = join(work, "out");
  writeFileSync(
    join(out, "index.html"),
    `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>الكنوز للحلول الزراعية · Al-Kunooz Agricultural Solutions</title>
<link rel="alternate" hreflang="ar" href="ar/">
<link rel="alternate" hreflang="en" href="en/">
<script>
  // Remember the visitor's choice, else follow the browser language (Arabic by default).
  var c = document.cookie.match(/(?:^|; )NEXT_LOCALE=(ar|en)/);
  var l = c ? c[1] : ((navigator.language || "ar").toLowerCase().indexOf("en") === 0 ? "en" : "ar");
  location.replace(l + "/" + location.search + location.hash);
</script>
<noscript><meta http-equiv="refresh" content="0; url=ar/"></noscript>
<style>body{font-family:system-ui,sans-serif;background:#115230;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#86b95f}</style>
</head>
<body><p><a href="ar/">العربية</a> · <a href="en/">English</a></p></body>
</html>
`,
  );

  rmSync(join(root, "out"), { recursive: true, force: true });
  cpSync(out, join(root, "out"), { recursive: true });
  if (existsSync(join(root, "al-kunooz-static-site.zip"))) rmSync(join(root, "al-kunooz-static-site.zip"));
  execSync(`cd out && zip -qr ../al-kunooz-static-site.zip .`, { cwd: root, stdio: "inherit" });
  console.log("\n✓ Static site written to out/ and al-kunooz-static-site.zip");
} finally {
  rmSync(work, { recursive: true, force: true });
}
