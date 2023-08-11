import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// .env에서 aws 정보 읽어오기
const awsAccessKey = process.env.MY_AWS_ACCESS_KEY as string;
const awsSecretKey = process.env.MY_AWS_SECRET_KEY as string;
const awsS3Bucket = process.env.MY_AWS_S3_BUCKET as string;
const awsS3BucketRegion = process.env.MY_AWS_S3_BUCKET_REGION as string;

// s3 클라이언트
const s3 = new S3Client({
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey
    },
    region: awsS3BucketRegion
});

// file signedUrl 가져오기
export async function getSignedFileUrl(data: any) {
    const params = {
        Bucket: awsS3Bucket,
        Key: data.name,
    }

    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3000 });
    return url;
}

// 파일 업로드
export async function uploadFile(fileBuffer: string, fileName: string, fileType: string) {
    const uploadParams = {
        Bucket: awsS3Bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: fileType,
    }

    const res = await s3.send(new PutObjectCommand(uploadParams));
    return res.$metadata.httpStatusCode;
}