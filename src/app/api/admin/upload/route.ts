import { NextRequest, NextResponse } from "next/server";
import { getAdminStorage } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { checkAdminSession } from "@/lib/adminAuth";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// POST: ファイルアップロード
export async function POST(request: NextRequest) {
  return checkAdminSession(async () => {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const type = formData.get("type") as string | null; // "image" or "audio"

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: "File size exceeds 50MB limit" },
          { status: 400 }
        );
      }

      const allowedTypes = type === "audio" ? ALLOWED_AUDIO_TYPES : ALLOWED_IMAGE_TYPES;
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` },
          { status: 400 }
        );
      }

      const storage = await getAdminStorage();
      const bucket = storage.bucket();

      const fileExtension = file.name.split(".").pop() || "";
      const fileName = `meditation/${type}/${uuidv4()}.${fileExtension}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileRef = bucket.file(fileName);

      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type,
        },
      });

      await fileRef.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return NextResponse.json({
        success: true,
        data: {
          url: publicUrl,
          fileName: fileName,
          contentType: file.type,
          size: file.size,
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json(
        { success: false, error: "Failed to upload file" },
        { status: 500 }
      );
    }
  });
};
