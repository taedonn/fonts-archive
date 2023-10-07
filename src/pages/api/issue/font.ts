import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const s3 = new S3Client({
        credentials: {
            accessKeyId: process.env.MY_AWS_ACCESS_KEY as string,
            secretAccessKey: process.env.MY_AWS_SECRET_KEY as string,
        },
        region: process.env.MY_AWS_S3_REGION as string,
    });
    const s3Bucket = process.env.MY_AWS_S3_ISSUE_FONT_BUCKET;
    const fileName = req.body.file_name;
    const fileType = req.body.file_type;

    if (req.method === 'POST') {
        if (req.body.action === "upload-img") {
            try {
                const putParams = {
                    Bucket: s3Bucket,
                    Key: fileName,
                    ContentType: fileType,
                }
                
                // getSignedUrl의 PutObjectCommand로 이미지를 업로드할 URL 경로 받기
                const url = await getSignedUrl(s3, new PutObjectCommand(putParams), {expiresIn: 3600});
                
                return res.status(200).json({
                    url: url,
                    msg: "이미지 업로드 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이미지 업로드 실패"
                });
            }
        }
        else if (req.body.action === "delete-img") {
            try {
                const deleteParams = {
                    Bucket: s3Bucket,
                    Key: fileName,
                }

                // getSignedUrl의 DeleteObjectCommand로 이미지를 삭제할 URL 경로 받기
                const url = await getSignedUrl(s3, new DeleteObjectCommand(deleteParams), { expiresIn: 3600 });
                
                return res.status(200).json({
                    url: url,
                    msg: "이미지 삭제 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이미지 삭제 실패"
                });
            }
        }
    }
    else if (req.method === "GET") {
        try {
            // 변수 저장
            const fileName = req.query.fileName as string;
            const getParams = {
                Bucket: s3Bucket,
                Key: fileName,
            }
            
            // getSignedUrl의 GetObjectCommand로 이미지의 URL 경로 받기
            const url = await getSignedUrl(s3, new GetObjectCommand(getParams), {expiresIn: 3600})
            
            res.status(200).json({
                url: url,
                msg: "GET 요청 성공"
            });
        } catch (err) {
            return res.status(500).json({
                msg: "GET 요청 실패"
            });
        }
    }
}