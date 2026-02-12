import { NextRequest, NextResponse } from "next/server";
import { get, update, remove } from "@/models/category";
import { categoryUpdateSchema } from "@/schema/category";
import { checkAdminSession } from "@/lib/adminAuth";


type Params = { params: Promise<{ id: string }> };

// GET: カテゴリー詳細取得
export async function GET(request: NextRequest, { params }: Params) {
  return checkAdminSession(async () => {
    try {
      const { id } = await params;
      const category = await get(id);

      return NextResponse.json({ success: true, data: category });
    } catch (error) {
      console.error("Error fetching category:", error);
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
  });
};

// PUT: カテゴリー更新
export async function PUT(request: NextRequest, { params }: Params) {
  return checkAdminSession(async () => {
    try {
      const { id } = await params;
      const body = await request.json();
      const validationResult = categoryUpdateSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { success: false, error: "Validation failed", details: validationResult.error.errors },
          { status: 400 }
        );
      }

      await update(id, validationResult.data);

      return NextResponse.json({ success: true, data: { id } });
    } catch (error) {
      console.error("Error updating category:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update category" },
        { status: 500 }
      );
    }
  });
};

// DELETE: カテゴリー削除
export async function DELETE(request: NextRequest, { params }: Params) {
  return checkAdminSession(async () => {
    try {
      const { id } = await params;
      await remove(id);

      return NextResponse.json({ success: true, data: { id } });
    } catch (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete category" },
        { status: 500 }
      );
    }
  });
};