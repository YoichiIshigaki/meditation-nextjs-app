import { NextResponse } from "next/server";
import { getMockUsers } from "@/models/user";
// curl http://localhost:3000/api/users
export async function GET() {
  try {
    // local 起動だとdevelopment
    console.log("process.env.NODE_ENV : ", process.env.NODE_ENV);
    return NextResponse.json(getMockUsers(5), { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error",
        errorCode: 500,
      },
      { status: 500 },
    );
  }
}
