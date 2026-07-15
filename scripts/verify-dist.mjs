import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

const root = process.cwd();
const requiredPages = [
  "index.html",
  "experience/index.html",
  "art/index.html",
  "projects/index.html",
  "projects/selected-projects/index.html",
  "about/index.html",
];

function literalFromCodes(codes) {
  return String.fromCharCode(...codes);
}

function escapedLiteral(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const privateAddressPattern = new RegExp(
  `${escapedLiteral(literalFromCodes([49, 56, 57, 50]))}\\s+${escapedLiteral(literalFromCodes([66, 101, 101, 99, 104, 119, 111, 111, 100]))}`,
  "i",
);
const privatePhonePattern = new RegExp(
  [
    literalFromCodes([54, 49, 50]),
    literalFromCodes([54, 49, 53]),
    literalFromCodes([49, 52, 52, 50]),
  ]
    .map(escapedLiteral)
    .join("[\\s().-]*"),
);
const personalEmailPattern = new RegExp(
  escapedLiteral(literalFromCodes([119, 97, 108, 108, 121, 115, 97, 110, 100, 115, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109])),
  "i",
);
const studentEmailPattern = new RegExp(
  escapedLiteral(literalFromCodes([115, 97, 110, 100, 115, 50, 50, 52, 64, 117, 109, 110, 46, 101, 100, 117])),
  "i",
);

const forbiddenPatterns = [
  { name: "street address", pattern: privateAddressPattern },
  { name: "phone number", pattern: privatePhonePattern },
  { name: "personal email", pattern: personalEmailPattern },
  { name: "student email", pattern: studentEmailPattern },
  { name: "mailto link", pattern: new RegExp(escapedLiteral(literalFromCodes([109, 97, 105, 108, 116, 111, 58])), "i") },
];
const requiredTextByPage = {
  "index.html": ["Walter Sands", "Experience", "Art", "Projects", "About", "LinkedIn"],
  "experience/index.html": ["Drawing in the Flow", "Interactive Visualization Lab"],
  "art/index.html": ["Still Lifes", "Outdoor / Plein Air"],
  "projects/index.html": ["Selected Projects"],
  "projects/selected-projects/index.html": ["Selected Projects", "intentionally ready"],
};

function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return collectFiles(path);
    if (path.endsWith(".html")) return [path];
    return [];
  });
}

function htmlToNormalizedText(html) {
  return html
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, " ")
    .replace(/<\/?(?:address|article|aside|blockquote|br|div|footer|h[1-6]|header|li|main|p|section|tr|ul)\b[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code.slice(0, 1).toLowerCase() === "x" ? code.slice(1) : code, code.slice(0, 1).toLowerCase() === "x" ? 16 : 10)))
    .replace(/&(nbsp|amp|lt|gt|quot|apos);/gi, " ")
    .replace(/\s+/g, " ");
}

function findForbiddenFailures(text) {
  return forbiddenPatterns
    .filter((rule) => rule.pattern.test(text))
    .map((rule) => `Forbidden ${rule.name} found in dist`);
}

function verifyDist(workspaceRoot, { checkRequiredPages = true } = {}) {
  const dist = join(workspaceRoot, "dist");
  const failures = [];
  if (checkRequiredPages) {
    for (const page of requiredPages) {
      if (!existsSync(join(dist, page))) failures.push(`Missing dist page: ${page}`);
    }
  }

  const files = collectFiles(dist);
  const rawHtml = files.map((file) => readFileSync(file, "utf8")).join("\n");
  const normalizedText = files.map((file) => htmlToNormalizedText(readFileSync(file, "utf8"))).join(" ");
  failures.push(...findForbiddenFailures(rawHtml));
  failures.push(...findForbiddenFailures(normalizedText));

  if (checkRequiredPages) {
    for (const [page, requiredText] of Object.entries(requiredTextByPage)) {
      const pagePath = join(dist, page);
      if (!existsSync(pagePath)) continue;
      const pageText = readFileSync(pagePath, "utf8");
      for (const text of requiredText) {
        if (!pageText.includes(text)) failures.push(`Missing required text in ${page}: ${text}`);
      }
    }
  }
  return { failures, files };
}

function runSelfTest() {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "privacy-dist-"));
  const fixtureDist = join(fixtureRoot, "dist");
  const page = join(fixtureDist, "index.html");
  const area = literalFromCodes([54, 49, 50]);
  const prefix = literalFromCodes([54, 49, 53]);
  const line = literalFromCodes([49, 52, 52, 50]);
  try {
    mkdirSync(fixtureDist);
    writeFileSync(page, `(${area}) ${prefix}-${line}`);
    if (!verifyDist(fixtureRoot, { checkRequiredPages: false }).failures.length) {
      throw new Error("parenthesized phone fixture was not rejected");
    }
    writeFileSync(page, [...area, ...prefix, ...line].map((digit) => `<span>${digit}</span>`).join(""));
    if (!verifyDist(fixtureRoot, { checkRequiredPages: false }).failures.length) {
      throw new Error("element-split phone fixture was not rejected");
    }
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
  console.log("Dist verifier regression checks passed");
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
} else {
  const { failures, files } = verifyDist(root);
  if (failures.length > 0) {
    console.error("Dist verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    if (files.length > 0) {
      console.error("Scanned HTML files:");
      for (const file of files) console.error(`- ${relative(root, file)}`);
    }
    process.exit(1);
  }
  console.log("Dist verification passed");
}
