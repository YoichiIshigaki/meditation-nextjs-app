import { NextRequest, NextResponse } from "next/server";
import { list, create } from "@/models/category";
import { categorySchema } from "@/schema/category";
import { checkAdminSession } from "@/lib/adminAuth";

// GET: カテゴリー一覧取得
export async function GET(request: NextRequest) {
  return checkAdminSession(async () => {
    try {
      const categories = await list({});

      return NextResponse.json({ success: true, data: categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch categories" },
        { status: 500 }
      );
    }
  });
}

// POST: カテゴリー作成
export async function POST(request: NextRequest) {
  return checkAdminSession(async () => {
    try {
      const body = await request.json();
      const validationResult = categorySchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { success: false, error: "Validation failed", details: validationResult.error.errors },
          { status: 400 }
        );
      }

      const id = await create(validationResult.data);

      return NextResponse.json(
        { success: true, data: { id } },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating category:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create category" },
        { status: 500 }
      );
    }
  });
}
