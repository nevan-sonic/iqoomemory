import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, drawFn) {
  // Create RGBA raw buffer
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate IDAT data
  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 implementation for PNG
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    for (let j = 0; j < 8; j++) {
      if ((crc ^ byte) & 1) {
        crc = (crc >>> 1) ^ 0xedb88320;
      } else {
        crc = crc >>> 1;
      }
      byte = byte >>> 1;
    }
  }
  return crc ^ -1;
}

// Drawing function for iQOO Icon:
// Dark background (#08090C) with rounded rectangle in electric yellow (#FFDE00) and 'Q' monogram
function drawIqooIcon(x, y, w, h) {
  const normX = (x / w) * 100;
  const normY = (y / h) * 100;

  // Background: Deep iQOO Dark #08090C
  let r = 8, g = 9, b = 12, a = 255;

  // Rounded squircle center container (from 12% to 88%)
  const cx = 50, cy = 50;
  const radius = 32;
  const dx = Math.abs(normX - cx);
  const dy = Math.abs(normY - cy);

  // Squircle formula (superellipse n=4)
  const dist = Math.pow(dx / radius, 4) + Math.pow(dy / radius, 4);

  if (dist <= 1.0) {
    // Fill with Electric Yellow #FFDE00
    r = 255;
    g = 222;
    b = 0;

    // Draw dark "Q" / "M" letter geometry inside
    const qdx = normX - 50;
    const qdy = normY - 48;
    const ringDist = Math.sqrt(qdx * qdx + qdy * qdy);

    // Outer ring of Q
    if (ringDist >= 10 && ringDist <= 19) {
      r = 8; g = 9; b = 12;
    }
    // Tail of Q
    if (normX >= 54 && normX <= 66 && normY >= 52 && normY <= 64 && Math.abs((normX - 54) - (normY - 52)) <= 3.5) {
      r = 8; g = 9; b = 12;
    }
  } else if (dist <= 1.15) {
    // Subtle border glow
    const alpha = (1.15 - dist) / 0.15;
    r = Math.round(8 + (255 - 8) * alpha * 0.4);
    g = Math.round(9 + (222 - 9) * alpha * 0.4);
    b = Math.round(12 + (0 - 12) * alpha * 0.4);
  }

  return [r, g, b, a];
}

const publicDir = path.resolve('public');

const png192 = createPng(192, 192, drawIqooIcon);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
console.log('✅ Generated public/icon-192.png (192x192)');

const png512 = createPng(512, 512, drawIqooIcon);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
console.log('✅ Generated public/icon-512.png (512x512)');

const pngApple = createPng(180, 180, drawIqooIcon);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);
console.log('✅ Generated public/apple-touch-icon.png (180x180)');
