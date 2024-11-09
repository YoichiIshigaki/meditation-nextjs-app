import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      [
        {
          name: "Mike",
        },
        {
          name: "John",
        },
        {
          name: "Taro",
        },
      ],
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error",
      },
      { status: 500 }
    );
  }
}
