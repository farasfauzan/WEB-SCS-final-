import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary-server";

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({
        error: "Cloudinary belum dikonfigurasi. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET di file .env.local"
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP, SVG, GIF" }, { status: 400 });
    }

    // Validate file size (max 10MB for Cloudinary upload)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size: 10MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine folder and public_id
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const folder = "scs-website";
    const publicId = `${folder}/${timestamp}-${randomStr}`;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: folder,
          resource_type: "image",
          transformation: [
            { quality: "auto", fetch_format: "auto", dpr: "auto" },
          ],
          // Eager transformations — pre-generate ALL sizes used on the website
          // so the first visitor never hits a cold cache.
          // These match IMAGE_SIZES in @/lib/cloudinary:
          //   hero: 1920x800, card: 400x300, preview: 600x400, full: 1200x800, avatar: 150x150
          eager: [
            { width: 1920, height: 800, crop: "fill", quality: "auto", dpr: "auto" },
            { width: 1200, height: 800, crop: "fill", quality: "auto", dpr: "auto" },
            { width: 600,  height: 400, crop: "fill", quality: "auto", dpr: "auto" },
            { width: 400,  height: 300, crop: "fill", quality: "auto", dpr: "auto" },
            { width: 150,  height: 150, crop: "fill", quality: "auto", dpr: "auto" },
          ],
          eager_async: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Failed to upload file to Cloudinary" }, { status: 500 });
  }
}
