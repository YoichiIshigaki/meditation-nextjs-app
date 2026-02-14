import { NextRequest, NextResponse } from "next/server";
import { meditationContentUpdateSchema } from "@/schema/meditationContent";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebaseAdmin";
import { FIRESTORE_COLLECTION_NAME_PREFIX } from "@/lib/firebase";
import {
  toMeditationContent,
  type MeditationContentDoc,
} from "@/models/meditation_content";
import { checkAdminSession } from "@/lib/adminAuth";

const COLLECTION_NAME = `${FIRESTORE_COLLECTION_NAME_PREFIX}_meditation_contents`;

type Params = { params: Promise<{ id: string }> };

// GET: コンテンツ詳細取得
export async function GET(request: NextRequest, { params }: Params) {
  return checkAdminSession(async () => {
    try {
      const { id } = await params;
      const firestore = await getAdminFirestore();
      const docRef = firestore.collection(COLLECTION_NAME).doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json(
          { success: false, error: "Content not found" },
          { status: 404 },
        );
      }

      const content = toMeditationContent(
        docSnap.id,
        docSnap.data() as MeditationContentDoc,
      );
      return NextResponse.json({ success: true, data: content });
    } catch (error) {
      console.error("Error fetching content:", error);
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 },
      );
    }
  });
}

// PUT: コンテンツ更新
export async function PUT(request: NextRequest, { params }: Params) {
  return checkAdminSession(async () => {
    try {
      const { id } = await params;
      const body = await request.json();
      const validationResult = meditationContentUpdateSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: validationResult.error.errors,
          },
          { status: 400 },
        );
      }

      const firestore = await getAdminFirestore();
      const docRef = firestore.collection(COLLECTION_NAME).doc(id);

      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return NextResponse.json(
          { success: false, error: "Content not found" },
          { status: 404 },
        );
      }

      const updateData = {
        ...validationResult.data,
        updated_at: FieldValue.serverTimestamp(),
      };

      await docRef.update(updateData);

      return NextResponse.json({ success: true, data: { id } });
    } catch (error) {
      console.error("Error updating content:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update content" },
        { status: 500 },
      );
    }
  });
}

// DELETE: コンテンツ削除
export async function DELETE(request: NextRequest, { params }: Params) {
  return checkAdminSession(async () => {
    try {
      const { id } = await params;
      const firestore = await getAdminFirestore();
      const docRef = firestore.collection(COLLECTION_NAME).doc(id);

      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return NextResponse.json(
          { success: false, error: "Content not found" },
          { status: 404 },
        );
      }

      await docRef.delete();

      return NextResponse.json({ success: true, data: { id } });
    } catch (error) {
      console.error("Error deleting content:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete content" },
        { status: 500 },
      );
    }
  });
}
