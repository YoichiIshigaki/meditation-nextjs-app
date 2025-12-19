import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// S3 バッケット名
export const BUCKET_NAME = "meditation-app";

// ローカルの認証の設定
export const localS3 = new S3Client({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: "user",
    secretAccessKey: "password",
  },
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
});

const uploadLocalFileToS3 = async (
  srcPath: string,
  fileName: string,
  bucketName: string,
) => {
  //ストリームを開ける
  const readStream = fs.createReadStream(srcPath);
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: readStream,
    });
    await localS3.send(command);
  } catch (error) {
    console.log(error);
  } finally {
    //ストリームを閉める
    readStream.close();
  }
};

// ./node_modules/.bin/tsx src/infra/s3.ts

// --eval コードを実行できる。
// --print コードの結果。
// ./node_modules/.bin/tsx -e -p "const str = 'test'; console.log(str);"
(async () => {
  console.log("script start");
  if (require.main === module) {
    const soundDir = path.join(__dirname, "../../", "public/sounds");
    const videoDir = path.join(__dirname, "../../", "public/videos");
    const soundFiles = fs.readdirSync(soundDir);
    const videoFiles = fs.readdirSync(videoDir);
    for (const sound of soundFiles) {
      const srcPath = path.join(soundDir, sound);
      await uploadLocalFileToS3(srcPath, `sounds/${sound}`, BUCKET_NAME);
    }
    for (const video of videoFiles) {
      const srcPath = path.join(videoDir, video);
      await uploadLocalFileToS3(srcPath, `videos/${video}`, BUCKET_NAME);
    }
  }
})();
