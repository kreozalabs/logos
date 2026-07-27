import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import { Resvg } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.resolve(ROOT_DIR, "assets");
const ZIP_FILE = path.resolve(ROOT_DIR, "logos.zip");

// Icon resolution specs for PWAs, Mobile apps (iOS/Android), and Desktop apps (macOS, Windows, Linux)
const ICON_RESOLUTIONS = [
  16, 24, 32, 48, 64, 96, 128, 180, 192, 256, 512, 1024,
];

// Wordmark width scale specs for responsive web/desktop/print use
const WORDMARK_WIDTHS = [200, 400, 800, 1200, 2400];

function calculateCrc32(buffer) {
  if (typeof zlib.crc32 === "function") {
    return zlib.crc32(buffer);
  }
  let crc = -1;
  for (let i = 0; i < buffer.length; i++) {
    let c = (crc ^ buffer[i]) & 0xff;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ -1) >>> 0;
}

function createZipBuffer(files) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const file of files) {
    const fileNameBuf = Buffer.from(file.name, "utf-8");
    const uncompressedData = file.data;
    const compressedData = zlib.deflateRawSync(uncompressedData);
    const crc = calculateCrc32(uncompressedData);

    // Local Header (30 bytes + fileNameBuf.length)
    const localHeader = Buffer.alloc(30 + fileNameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedData.length, 18);
    localHeader.writeUInt32LE(uncompressedData.length, 22);
    localHeader.writeUInt16LE(fileNameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    fileNameBuf.copy(localHeader, 30);

    localHeaders.push(localHeader, compressedData);

    // Central Directory Header (46 bytes + fileNameBuf.length)
    const centralHeader = Buffer.alloc(46 + fileNameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedData.length, 20);
    centralHeader.writeUInt32LE(uncompressedData.length, 24);
    centralHeader.writeUInt16LE(fileNameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    fileNameBuf.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);

    offset += localHeader.length + compressedData.length;
  }

  const centralDirectoryOffset = offset;
  let centralDirectorySize = 0;
  for (const ch of centralHeaders) {
    centralDirectorySize += ch.length;
  }

  // End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirectorySize, 12);
  eocd.writeUInt32LE(centralDirectoryOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

function renderPng(svgBuffer, width) {
  const resvg = new Resvg(svgBuffer, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

async function createZip() {
  if (fs.existsSync(ZIP_FILE)) {
    fs.unlinkSync(ZIP_FILE);
  }

  const svgFiles = fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => f.endsWith(".svg") && !f.startsWith("git-hub")); // FIXME: Remove hard-coded 'git-hub' value

  if (svgFiles.length === 0) {
    console.warn("No SVG files found in assets directory.");
    return;
  }

  const filesToZip = [];

  // 1. Package SVG files into SVG/
  for (const file of svgFiles) {
    const filePath = path.join(ASSETS_DIR, file);
    const svgBuffer = fs.readFileSync(filePath);
    filesToZip.push({
      name: `SVG/${file}`,
      data: svgBuffer,
    });
  }

  // 2. Render PNG assets across resolutions
  console.log("Generating multi-platform PNG assets...");
  for (const file of svgFiles) {
    const filePath = path.join(ASSETS_DIR, file);
    const svgBuffer = fs.readFileSync(filePath);
    const baseName = path.parse(file).name;
    const isWordmark = baseName.includes("wordmark");

    if (isWordmark) {
      // High-res master (2400px width)
      const masterPng = renderPng(svgBuffer, 2400);
      filesToZip.push({
        name: `PNG/high-res/${baseName}.png`,
        data: masterPng,
      });

      // Width scale resolutions
      for (const w of WORDMARK_WIDTHS) {
        const pngBuf = renderPng(svgBuffer, w);
        filesToZip.push({
          name: `PNG/wordmark/${w}px/${baseName}.png`,
          data: pngBuf,
        });
      }
    } else {
      // Square icons (logo, logo-light, git-hub)
      // High-res master (1024x1024)
      const masterPng = renderPng(svgBuffer, 1024);
      filesToZip.push({
        name: `PNG/high-res/${baseName}.png`,
        data: masterPng,
      });

      // App Icons grid (Mobile, Desktop, Linux, Windows, macOS)
      for (const size of ICON_RESOLUTIONS) {
        const pngBuf = renderPng(svgBuffer, size);
        filesToZip.push({
          name: `PNG/app-icons/${size}x${size}/${baseName}.png`,
          data: pngBuf,
        });
      }

      // PWA & Web convenience shortcuts
      const fav16 = renderPng(svgBuffer, 16);
      const fav32 = renderPng(svgBuffer, 32);
      const apple180 = renderPng(svgBuffer, 180);
      const pwa192 = renderPng(svgBuffer, 192);
      const pwa512 = renderPng(svgBuffer, 512);

      filesToZip.push(
        { name: `PNG/pwa-and-web/${baseName}-16x16.png`, data: fav16 },
        { name: `PNG/pwa-and-web/${baseName}-32x32.png`, data: fav32 },
        {
          name: `PNG/pwa-and-web/${baseName}-apple-touch-180x180.png`,
          data: apple180,
        },
        { name: `PNG/pwa-and-web/${baseName}-pwa-192x192.png`, data: pwa192 },
        { name: `PNG/pwa-and-web/${baseName}-pwa-512x512.png`, data: pwa512 },
      );
    }
  }

  try {
    const zipBuffer = createZipBuffer(filesToZip);
    fs.writeFileSync(ZIP_FILE, zipBuffer);
    console.log(
      `Successfully created ${ZIP_FILE} containing ${filesToZip.length} total assets (SVG & PNG for PWA, Mobile, Desktop, Web).`,
    );
  } catch (err) {
    console.error("Failed to create zip:", err.message);
    process.exit(1);
  }
}

createZip();
