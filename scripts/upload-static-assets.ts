/**
 * Upload all static assets from public/ to Cloudinary
 *
 * Run: npm run upload-assets
 */
import { v2 as cloudinary } from "cloudinary";
import { readdirSync, writeFileSync, unlinkSync, existsSync } from "fs";
import { join, relative, extname } from "path";
import "dotenv/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ CLOUDINARY_CLOUD_NAME not set in .env");
  process.exit(1);
}

const PUBLIC_DIR = join(__dirname, "..", "public");
const CLOUDINARY_FOLDER = "scs-public";
const CONCURRENCY = 5; // Upload 5 files at a time
const IMAGE_EXTENSIONS = [".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico"];

function getAllImages(dir: string, baseDir: string = dir): { fullPath: string; relativePath: string }[] {
  const results: { fullPath: string; relativePath: string }[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllImages(fullPath, baseDir));
    } else if (IMAGE_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
      const relativePath = relative(baseDir, fullPath).replace(/\\/g, "/");
      results.push({ fullPath, relativePath });
    }
  }
  return results;
}

async function uploadFile(image: { fullPath: string; relativePath: string }): Promise<{
  localPath: string;
  cloudinaryUrl: string;
  publicId: string;
  format: string;
} | null> {
  // public_id without folder prefix (folder param handles the folder)
  const publicId = image.relativePath.replace(/\.[^.]+$/, "");

  try {
    console.log(`⬆️  Uploading: ${image.relativePath}`);
    const result = await cloudinary.uploader.upload(image.fullPath, {
      public_id: publicId,
      folder: CLOUDINARY_FOLDER,
      resource_type: "image",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      // For SVGs, keep as SVG; for raster images, auto-optimize
      transformation: image.relativePath.endsWith(".svg")
        ? [{ fetch_format: "svg" }]
        : [{ quality: "auto", fetch_format: "auto" }],
    });

    console.log(`   ✅ ${image.relativePath} → ${result.secure_url}`);
    return {
      localPath: `/${image.relativePath}`,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    };
  } catch (error: any) {
    console.error(`   ❌ Failed: ${image.relativePath} - ${error.message}`);
    return null;
  }
}

async function uploadAll() {
  console.log("📁 Scanning public/ for images...");
  const images = getAllImages(PUBLIC_DIR);
  console.log(`📊 Found ${images.length} images to upload (concurrency: ${CONCURRENCY})\n`);

  // Upload with limited concurrency
  const results: ({ localPath: string; cloudinaryUrl: string; publicId: string; format: string } | null)[] = [];

  for (let i = 0; i < images.length; i += CONCURRENCY) {
    const batch = images.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(uploadFile));
    results.push(...batchResults);
  }

  const successful = results.filter((r): r is NonNullable<typeof r> => r !== null);
  const failed = results.length - successful.length;

  // Generate JSON mapping: localPath → Cloudinary URL
  const mapping: Record<string, string> = {};
  for (const r of successful) {
    mapping[r.localPath] = r.cloudinaryUrl;
  }

  const mappingPath = join(__dirname, "..", "src", "lib", "cloudinary-assets.json");
  writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\n📝 Mapping saved: src/lib/cloudinary-assets.json (${successful.length} entries)`);
  console.log(`🎉 Done! ${successful.length} uploaded, ${failed} failed`);
}

uploadAll().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
