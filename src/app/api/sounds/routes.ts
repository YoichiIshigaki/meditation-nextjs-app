import { NextResponse } from "next/server";
// import { GetObjectCommand } from "@aws-sdk/client-s3";
// import { localS3, BUCKET_NAME } from "@/infra/s3";

// curl http://localhost:3000/api/sounds
export async function GET() {
  try {
    // const getCommand = new GetObjectCommand({
    //   Bucket: BUCKET_NAME,
    //   Key: fileName,
    // });
    // localS3.send();
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error",
      },
      { status: 500 },
    );
  }
}
