import sharp from "sharp";

const hero = "public/hero-leaves.jpg";
const logo = "public/logo.png";
const output = "public/social-card.jpg";

const overlay = `
  <svg width="1200" height="630">
    <defs>
      <linearGradient id="fade" x1="0" x2="1">
        <stop offset="0" stop-color="#143019" stop-opacity="0.98"/>
        <stop offset="0.58" stop-color="#143019" stop-opacity="0.94"/>
        <stop offset="1" stop-color="#143019" stop-opacity="0.18"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#fade)"/>
    <rect x="70" y="64" width="660" height="502" rx="18" fill="#fffcf3" opacity="0.96"/>
    <text x="110" y="190" fill="#143019" font-family="Arial, sans-serif" font-size="74" font-weight="800" letter-spacing="-2">MATOSHREE</text>
    <text x="110" y="270" fill="#2f6b30" font-family="Arial, sans-serif" font-size="74" font-weight="800" letter-spacing="-2">FRUITS</text>
    <line x1="110" y1="310" x2="660" y2="310" stroke="#d5dfc9" stroke-width="3"/>
    <text x="110" y="370" fill="#263a27" font-family="Arial, sans-serif" font-size="31" font-weight="600">Wholesale bananas</text>
    <text x="110" y="410" fill="#263a27" font-family="Arial, sans-serif" font-size="31" font-weight="600">direct from farmers</text>
    <text x="110" y="480" fill="#2f6b30" font-family="Arial, sans-serif" font-size="24" font-weight="700">Burhanpur, Madhya Pradesh</text>
    <text x="110" y="525" fill="#52614f" font-family="Arial, sans-serif" font-size="21">Fresh arrivals | Trusted quality | WhatsApp</text>
  </svg>
`;

const background = await sharp(hero)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .modulate({ saturation: 0.72, brightness: 0.72 })
  .composite([{ input: Buffer.from(overlay), left: 0, top: 0 }])
  .png()
  .toBuffer();

const logoBuffer = await sharp(logo)
  .resize(220, 220, { fit: "contain" })
  .png()
  .toBuffer();

await sharp(background)
  .composite([{ input: logoBuffer, left: 920, top: 360 }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(output);

console.log(`Generated ${output}`);
