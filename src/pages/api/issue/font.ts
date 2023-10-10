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
    const s3Bucket = process.env.MY_AWS_S3_ISSUE_FONT_BUCKET as string;

    if (req.method === 'POST') {
        const fileName = req.body.file_name as string;
        const fileType = req.body.file_type as string;

        if (req.body.action === 'upload-img') {
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
        } else if (req.body.action === "upload-to-prisma") {
            try {
                await prisma.fontsIssue.create({
                    data: {
                        issue_title: req.body.title as string,
                        issue_email: req.body.email as string,
                        issue_content: req.body.content as string,
                        issue_img_length: Number(req.body.img_length),
                        issue_img_1: req.body.img_1 as string,
                        issue_img_2: req.body.img_2 as string,
                        issue_img_3: req.body.img_3 as string,
                        issue_img_4: req.body.img_4 as string,
                        issue_img_5: req.body.img_5 as string,
                        issue_closed_type: req.body.issue_closed_type as string,
                    }
                });

                return res.status(200).json({
                    msg: "Prisma에 저장 성공"
                })
            } catch (err) {
                return res.status(500).json({
                    msg: "Prisma에 저장 실패",
                    err: err,
                });
            }
        }
    }
    else if (req.method === "GET") {
        if (req.query.action === "get-issue-id") {
            try {
                const issue = await prisma.fontsIssue.findFirst({
                    orderBy: [{issue_id: "desc"}]
                });

                return res.status(200).json({
                    issue: issue,
                    msg: "GET 요청 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "GET 요청 실패"
                });
            }
        }
    }
}