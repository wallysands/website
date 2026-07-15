import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

const root = process.cwd();
const requiredPages = [
  "index.html",
  "experience/index.html",
  "publications/index.html",
  "art/index.html",
  "projects/index.html",
  "projects/jello-jump/index.html",
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
const deployedBase = "/website/";
const baseWithoutLeadingSlash = deployedBase.replace(/^\//, "");
const rootInternalHrefPattern = new RegExp(`href="/(?!(?:${escapedLiteral(baseWithoutLeadingSlash)}|#|$))[^"]*"`, "g");
const requiredTextByPage = {
  "index.html": ["Walter Sands", "Experience", "Publications", "Art", "Projects", "About", "LinkedIn"],
  "experience/index.html": [
    "Interactive Visualization Lab",
    "section-jump-nav",
    'href="#education"',
    'href="#industry-experience"',
    "Education",
    "Industry Experience",
  ],
  "publications/index.html": ["Publications", "Drawing in the Flow", "IEEE VIS 2025", "10.1109/VIS60296.2025.00067"],
  "art/index.html": [
    "Artistic Studies",
    "section-jump-nav",
    "Still Lifes",
    "Outdoor / Plein Air",
    'href="#still-lifes"',
    'href="#outdoor-plein-air"',
    "Charcoal",
    "Beach Gear",
    "gallery-masonry",
    "art-lightbox",
  ],
  "projects/index.html": ["Selected projects", "Jello Jump", "OpenGL"],
  "projects/jello-jump/index.html": [
    "Jello Jump",
    "squash and stretch",
    "time-based animation",
    "OpenGL",
    "SDL3",
    "Affine transformation sketches",
    "<video",
    "/website/projects/jello-jump/game-with-audio-and-closer-camera.mp4",
    "/website/projects/jello-jump/player-texture.jpg",
    "/website/projects/jello-jump/jump-stretch-squash.png",
    "/website/projects/jello-jump/diagonal-stretching.png",
    "/website/projects/jello-jump/wall-impact.png",
  ],
};
const forbiddenTextByPage = {
  "experience/index.html": ["Drawing in the Flow", "<h2>Skills</h2>", "skill-grid", "Used:"],
  "projects/index.html": ["notion.com"],
  "projects/jello-jump/index.html": ["notion.com", "A tile map loaded from", "jello-jump-walkthrough.mp4", "affine-vertical.png", "affine-diagonal.png", "affine-wall-impact.png"],
};
const requiredArtImages = [
  "/website/art/stilllife/beach-gear.jpg",
  "/website/art/stilllife/bowl_fruit_brushes.jpg",
  "/website/art/stilllife/cabinet.jpg",
  "/website/art/stilllife/light_on_oils_and_bagel.jpg",
  "/website/art/outdoor/backyard.jpg",
  "/website/art/outdoor/backyard2.jpg",
  "/website/art/outdoor/path.jpg",
];
const requiredFullArtImages = [
  "/website/art/full/stilllife/beach-gear.jpg",
  "/website/art/full/stilllife/bowl_fruit_brushes.jpg",
  "/website/art/full/stilllife/cabinet.jpg",
  "/website/art/full/stilllife/light_on_oils_and_bagel.jpg",
  "/website/art/full/outdoor/backyard.jpg",
  "/website/art/full/outdoor/backyard2.jpg",
  "/website/art/full/outdoor/path.jpg",
];
const requiredPublicationImages = [
  "/website/publications/drawing-in-the-flow-teaser.png",
];

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

function findRootInternalLinkFailures(html) {
  return [...html.matchAll(rootInternalHrefPattern)].map((match) => `Root-relative internal link escapes ${deployedBase}: ${match[0]}`);
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
  failures.push(...findRootInternalLinkFailures(rawHtml));

  if (checkRequiredPages) {
    for (const [page, requiredText] of Object.entries(requiredTextByPage)) {
      const pagePath = join(dist, page);
      if (!existsSync(pagePath)) continue;
      const pageText = readFileSync(pagePath, "utf8");
      for (const text of requiredText) {
        if (!pageText.includes(text)) failures.push(`Missing required text in ${page}: ${text}`);
      }
    }
    for (const [page, forbiddenText] of Object.entries(forbiddenTextByPage)) {
      const pagePath = join(dist, page);
      if (!existsSync(pagePath)) continue;
      const pageText = readFileSync(pagePath, "utf8");
      for (const text of forbiddenText) {
        if (pageText.includes(text)) failures.push(`Forbidden text in ${page}: ${text}`);
      }
    }
    const artHtmlPath = join(dist, "art/index.html");
    if (existsSync(artHtmlPath)) {
      const artHtml = readFileSync(artHtmlPath, "utf8");
      for (const image of requiredArtImages) {
        if (!artHtml.includes(image)) failures.push(`Missing art image in dist: ${image}`);
      }
      for (const image of requiredFullArtImages) {
        if (!artHtml.includes(image)) failures.push(`Missing full-resolution art image in dist: ${image}`);
      }
      if (artHtml.includes("Images to be added")) failures.push("Art page still includes placeholder copy");
      if (artHtml.includes("Beach Stuff") || artHtml.includes("beachstuff")) failures.push("Art page still references Beach Stuff");
    }
    const publicationsHtmlPath = join(dist, "publications/index.html");
    if (existsSync(publicationsHtmlPath)) {
      const publicationsHtml = readFileSync(publicationsHtmlPath, "utf8");
      for (const image of requiredPublicationImages) {
        if (!publicationsHtml.includes(image)) failures.push(`Missing publication image in dist: ${image}`);
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
    writeFileSync(page, `<a href="/experience/">Experience</a>`);
    if (!verifyDist(fixtureRoot, { checkRequiredPages: false }).failures.some((failure) => failure.includes("Root-relative internal link"))) {
      throw new Error("root-relative internal link fixture was not rejected");
    }
    writeFileSync(page, `<a href="${deployedBase}experience/">Experience</a>`);
    if (verifyDist(fixtureRoot, { checkRequiredPages: false }).failures.length) {
      throw new Error("base-prefixed internal link fixture was rejected");
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
