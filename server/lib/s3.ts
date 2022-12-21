import { S3 } from "aws-sdk";
import fs from "fs";
require("dotenv").config();

const bucket_region = process.env.BUCKET_REGION!;
const bucket_name = process.env.BUCKET_NAME!;
const bucket_access_key = process.env.ACCESS_KEY!;
const bucket_secret_key = process.env.SECRET_KEY!;
const client = new S3({
  region: bucket_region,
  credentials: {
    accessKeyId: bucket_access_key,
    secretAccessKey: bucket_secret_key,
  },
});

export async function uploadFile(file: Express.Multer.File) {
  try {
    const newFile = fs.createReadStream(file.path);

    const response = await client
      .upload({
        Bucket: bucket_name,
        Key: file.filename,
        Body: newFile,
      })
      .promise();

    return response;
  } catch (error) {
    throw error;
  }
}

export async function getFile(key: string) {
  try {
    const result = await client.getObject({ Bucket: bucket_name, Key: key });

    return result.createReadStream();
  } catch (error) {
    throw error;
  }
}
