// Script para gerar assets placeholder para o Expo
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Função para criar um PNG simples com cor sólida
function createPNG(width, height, r, g, b) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(2, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  
  // IDAT chunk
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      rawData.push(r, g, b);
    }
  }
  const compressed = zlib.deflateSync(Buffer.from(rawData), { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  
  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const crcData = Buffer.concat([typeBuffer, data]);
  const crcValue = crc32(crcData);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crcValue, 0);
  
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256);
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  
  for (let i = 0; i < buf.length; i++) {
    crc = (table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)) >>> 0;
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const assetsDir = path.join(__dirname, 'assets');

// Cores
const purple = { r: 98, g: 0, b: 238 };   // #6200ee
const white = { r: 255, g: 255, b: 255 }; // #ffffff

// Criar os assets
console.log('Gerando assets...');

// icon.png - 1024x1024
fs.writeFileSync(
  path.join(assetsDir, 'icon.png'),
  createPNG(1024, 1024, purple.r, purple.g, purple.b)
);
console.log('✓ icon.png (1024x1024)');

// adaptive-icon.png - 1024x1024
fs.writeFileSync(
  path.join(assetsDir, 'adaptive-icon.png'),
  createPNG(1024, 1024, purple.r, purple.g, purple.b)
);
console.log('✓ adaptive-icon.png (1024x1024)');

// splash.png - 1284x2778 (tamanho recomendado)
fs.writeFileSync(
  path.join(assetsDir, 'splash.png'),
  createPNG(1284, 2778, purple.r, purple.g, purple.b)
);
console.log('✓ splash.png (1284x2778)');

// favicon.png - 48x48
fs.writeFileSync(
  path.join(assetsDir, 'favicon.png'),
  createPNG(48, 48, purple.r, purple.g, purple.b)
);
console.log('✓ favicon.png (48x48)');

// notification-icon.png - 96x96
fs.writeFileSync(
  path.join(assetsDir, 'notification-icon.png'),
  createPNG(96, 96, white.r, white.g, white.b)
);
console.log('✓ notification-icon.png (96x96)');

console.log('\n✅ Todos os assets foram gerados com sucesso!');
