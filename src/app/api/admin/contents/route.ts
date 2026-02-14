import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { meditationContentSchema } from "@/schema/meditationContent";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebaseAdmin";
import { FIRESTORE_COLLECTION_NAME_PREFIX } from "@/lib/firebase";
import { toMeditationContent, type MeditationContentDoc, type MeditationContent } from "@/models/meditation_content";

const COLLECTION_NAME = `${FIRESTORE_COLLECTION_NAME_PREFIX}_meditation_contents`;

// GET: コンテンツ一覧取得
export async function GET(request: NextRequest) {
  return checkAdminSession(async () => {
    try {
      const { searchParams } = new URL(request.url);
      const limitCount = parseInt(searchParams.get("limit") || "50", 10);
      const orderByField = searchParams.get("orderBy") || "created_at";
      const orderDir = (searchParams.get("orderDir") || "desc") as "asc" | "desc";

      const firestore = await getAdminFirestore();
      let query: FirebaseFirestore.Query = firestore.collection(COLLECTION_NAME);

      query = query.orderBy(orderByField, orderDir);
      query = query.limit(limitCount);

      const querySnapshot = await query.get();

      const contents: MeditationContent[] = [];
      querySnapshot.forEach((docSnap) => {
        if (docSnap.exists) {
          contents.push(toMeditationContent(docSnap.id, docSnap.data() as MeditationContentDoc));
        }
      });

      return NextResponse.json({ success: true, data: contents });
    } catch (error) {
      console.error("Error fetching contents:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch contents" },
        { status: 500 }
      );
    }
  });
}

// POST: コンテンツ作成
export async function POST(request: NextRequest) {
  return checkAdminSession(async () => {
    try {
      const body = await request.json();
      const validationResult = meditationContentSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { success: false, error: "Validation failed", details: validationResult.error.errors },
          { status: 400 }
        );
      }

      const firestore = await getAdminFirestore();
      const collectionRef = firestore.collection(COLLECTION_NAME);

      const docData = {
        ...validationResult.data,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
      };

      const docRef = await collectionRef.add(docData);

      return NextResponse.json(
        { success: true, data: { id: docRef.id } },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating content:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create content" },
        { status: 500 }
      );
    }
  });
}