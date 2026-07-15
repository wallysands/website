import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

const root = process.cwd();
const requiredLinkedIn = "https://www.linkedin.com/in/walter-sands-b200048b/";
const textFilePattern = /\.(astro|css|csv|html|js|json|md|mjs|svg|ts|tsx|txt|webmanifest|xml|yml|yaml)$/i;
const expectedArtAssets = [
  "public/art/stilllife/beach-gear.jpg",
  "public/art/stilllife/bowl_fruit_brushes.jpg",
  "public/art/stilllife/cabinet.jpg",
  "public/art/stilllife/light_on_oils_and_bagel.jpg",
  "public/art/outdoor/backyard.jpg",
  "public/art/outdoor/backyard2.jpg",
  "public/art/outdoor/path.jpg",
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

function isCoveredSourceFile(file) {
  if (!textFilePattern.test(file)) return false;
  return (
    file === "README.md" ||
    !file.includes("/") ||
    /^(\.github|scripts|src|public)\//.test(file) ||
    /^docs\/superpowers\/(specs|plans)\//.test(file)
  );
}

function trackedSourceFiles(workspaceRoot) {
  const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
    cwd: workspaceRoot,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean)
    .filter(isCoveredSourceFile);
  return trackedFiles.map((file) => join(workspaceRoot, file));
}

function findForbiddenFailures(text, suffix = "") {
  return forbiddenPatterns
    .filter((rule) => rule.pattern.test(text))
    .map((rule) => `Forbidden ${rule.name} found${suffix}`);
}

function verifySource(workspaceRoot, { files = trackedSourceFiles(workspaceRoot), checkStructure = true } = {}) {
  const failures = [];
  const existingFiles = files.filter((file) => existsSync(file));
  const allText = existingFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  failures.push(...findForbiddenFailures(allText));

  if (!checkStructure) return { failures, files };

  const siteFile = join(workspaceRoot, "src/data/site.ts");
  if (!existsSync(siteFile)) {
    failures.push("Missing src/data/site.ts");
  } else {
    const siteText = readFileSync(siteFile, "utf8");
    if (!siteText.includes(requiredLinkedIn)) {
      failures.push("Missing required LinkedIn profile URL in src/data/site.ts");
    }
    for (const label of ["Home", "Experience", "Art", "Projects", "About", "LinkedIn"]) {
      if (!siteText.includes(label)) failures.push(`Missing nav label: ${label}`);
    }
  }

  const requiredFiles = [
    "src/layouts/BaseLayout.astro",
    "src/components/SiteNav.astro",
    "src/components/PageHeader.astro",
    "src/components/FeatureCard.astro",
    "src/styles/global.css",
  ];
  for (const requiredFile of requiredFiles) {
    if (!existsSync(join(workspaceRoot, requiredFile))) failures.push(`Missing ${requiredFile}`);
  }

  const contentFiles = [
    "src/content.config.ts",
    "src/content/projects/selected-projects.md",
    "src/components/GallerySection.astro",
  ];
  for (const contentFile of contentFiles) {
    if (!existsSync(join(workspaceRoot, contentFile))) failures.push(`Missing ${contentFile}`);
  }

  for (const requiredText of ["Still Lifes", "Outdoor / Plein Air", "selected projects"]) {
    if (!allText.includes(requiredText)) failures.push(`Missing content phrase: ${requiredText}`);
  }

  for (const asset of expectedArtAssets) {
    if (!existsSync(join(workspaceRoot, asset))) failures.push(`Missing art asset: ${asset}`);
  }

  const artContentDir = join(workspaceRoot, "src/content/art");
  const artContentFiles = existsSync(artContentDir) ? readdirSync(artContentDir).filter((file) => file.endsWith(".md")) : [];
  if (artContentFiles.length !== expectedArtAssets.length) {
    failures.push(`Expected ${expectedArtAssets.length} art content entries, found ${artContentFiles.length}`);
  }

  const artContentText = artContentFiles.map((file) => readFileSync(join(artContentDir, file), "utf8")).join("\n");
  if (!artContentText.includes('medium: "Charcoal"')) failures.push("Missing Charcoal medium in art content");
  if (!artContentText.includes('title: "Beach Gear"')) failures.push("Missing Beach Gear art title");
  if (artContentText.includes("Beach Stuff") || artContentText.includes("beachstuff")) failures.push("Art content still references Beach Stuff");
  if (artContentText.includes('status: "planned"')) failures.push("Art content still includes planned placeholder status");

  return { failures, files };
}

function runSelfTest() {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "privacy-source-"));
  const phone = `(${literalFromCodes([54, 49, 50])}) ${literalFromCodes([54, 49, 53])}-${literalFromCodes([49, 52, 52, 50])}`;
  try {
    const readme = join(fixtureRoot, "README.md");
    const scriptDir = join(fixtureRoot, "scripts");
    const script = join(scriptDir, "fixture.mjs");
    writeFileSync(readme, phone);
    if (!verifySource(fixtureRoot, { files: [readme], checkStructure: false }).failures.length) {
      throw new Error("README fixture was not rejected");
    }
    mkdirSync(scriptDir);
    writeFileSync(script, phone);
    if (!verifySource(fixtureRoot, { files: [script], checkStructure: false }).failures.length) {
      throw new Error("scripts fixture was not rejected");
    }
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
  console.log("Source verifier regression checks passed");
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
} else {
  const { failures, files } = verifySource(root);
  if (failures.length > 0) {
    console.error("Source verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    if (files.length > 0) {
      console.error("Scanned files:");
      for (const file of files) console.error(`- ${relative(root, file)}`);
    }
    process.exit(1);
  }
  console.log("Source verification passed");
}
