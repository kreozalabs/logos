import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.resolve(ROOT_DIR, "assets");
const STAGING_DIR = path.resolve(ROOT_DIR, ".zip-staging");
const ZIP_FILE = path.resolve(ROOT_DIR, "logos.zip");

function createZip() {
  if (fs.existsSync(ZIP_FILE)) {
    fs.unlinkSync(ZIP_FILE);
  }

  if (fs.existsSync(STAGING_DIR)) {
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  }

  const svgStagingDir = path.join(STAGING_DIR, "SVG");
  fs.mkdirSync(svgStagingDir, { recursive: true });

  const svgFiles = fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => f.endsWith(".svg"));

  if (svgFiles.length === 0) {
    console.warn("No SVG files found in assets directory.");
    return;
  }

  for (const file of svgFiles) {
    fs.copyFileSync(
      path.join(ASSETS_DIR, file),
      path.join(svgStagingDir, file)
    );
  }

  try {
    execSync(`cd "${STAGING_DIR}" && zip -r "${ZIP_FILE}" SVG`);
    console.log(
      `Successfully created ${ZIP_FILE} containing ${svgFiles.length} SVG assets in SVG/ folder.`
    );
  } catch (err) {
    console.error("Failed to create zip:", err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(STAGING_DIR)) {
      fs.rmSync(STAGING_DIR, { recursive: true, force: true });
    }
  }
}

createZip();
