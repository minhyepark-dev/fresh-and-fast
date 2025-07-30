import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 경로 설정
const inputDir = path.join(__dirname, '../public/images/products');
const outputDir = path.join(__dirname, '../public/images/products/webp');

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// JPG → WebP 변환
fs.readdirSync(inputDir).forEach((file) => {
  if (path.extname(file).toLowerCase() === '.jpg') {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.jpg', '.webp'));

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`✅ Converted: ${file} → ${path.basename(outputPath)}`))
      .catch((err) => console.error(`❌ Error converting ${file}:`, err));
  }
});
