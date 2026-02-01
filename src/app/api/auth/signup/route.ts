import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { create as createUser } from "@/models/user/create";
import { signUpSchema, SignUpSchema } from "@/schema/signup";
import { createUserWithEmailAndPassword } from "@/lib/auth";
export async function POST(request: NextRequest) {
  try {
    const body: SignUpSchema = await request.json();

    // バリデーション
    const validation = signUpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Firebase Admin SDKでユーザーを作成
    const adminAuth = await getAdminAuth();
    const userAuth = await createUserWithEmailAndPassword(
      adminAuth,
      body.email,
      body.password
    )
    if (!userAuth) {
      return NextResponse.json(
        { success: false, error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Firestoreにユーザードキュメントを作成
    await createUser({
      id: userAuth.id,
      first_name: body.first_name,
      last_name: body.last_name,
      thumbnail_url: "",
      language: body.language,
      status: "active",
      last_logged_in: new Date(),
    });

    return NextResponse.json({
      success: true,
      userId: userAuth.id,
    });
  } catch (error: unknown) {
    console.error("Signup API error:", error);

    const firebaseError = error as { code?: string; message?: string };

    if (firebaseError.code === "auth/email-already-exists") {
      return NextResponse.json(
        {
          success: false,
          error: "Email already in use",
          code: "auth/email-already-in-use",
        },
        { status: 400 }
      );
    }

    if (firebaseError.code === "auth/weak-password") {
      return NextResponse.json(
        {
          success: false,
          error: "Password is too weak",
          code: "auth/weak-password",
        },
        { status: 400 }
      );
    }

    if (firebaseError.code === "auth/invalid-email") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
          code: "auth/invalid-email",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
