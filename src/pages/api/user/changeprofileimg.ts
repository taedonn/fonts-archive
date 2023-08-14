import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client-prisma';
import aws from 'aws-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // 쿼리 가져오기
        const userNo = req.query.userNo === undefined ? '' : req.query.userNo as string;
    
        // 디폴트 프로필 이미지 정보
        const randomProfileImg = "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg";

        if (req.query.action === 'Delete Original') { // 사진 삭제 버튼 클릭 시
            try {
                const userInfo = !!await client.fontsUser.updateMany({
                    where: { user_no: Number(userNo) },
                    data: { profile_img: randomProfileImg }
                });
    
                return res.status(200).send(userInfo ? 'Profile image deleted successfully.' : 'Profile image did not get deleted due to an error.');
            } catch (err) {
                return res.status(500).send(err);
            }
        } else if (req.query.action === 'Get Original') { // 프로필 사진 변경 클릭 시 기존 프로필 사진 정보 가져오기
            try {
                const userInfo = await client.fontsUser.findUnique({
                    where: { user_no: Number(userNo) },
                });
    
                return res.status(200).send(userInfo);
            } catch (err) {
                return res.status(500).send(err);
            }
        }
    } else if (req.method === "POST") {
        aws.config.update({
            accessKeyId: process.env.MY_AWS_ACCESS_KEY,
            secretAccessKey: process.env.MY_AWS_SECRET_KEY,
            region: process.env.MY_AWS_S3_REGION,
        });

        const s3 = new aws.S3();
        const s3Bucket = process.env.MY_AWS_S3_BUCKET;
        const fileName = req.body.fileName;
        const fileType = req.body.fileType;

        if (req.body.action === 'Put Signed URL') {
            const putParams = {
                Bucket: s3Bucket,
                Key: fileName,
                ContentType: fileType,
            }

            try {
                s3.getSignedUrl("putObject", putParams, async(err, url) => {
                    if (err) {
                        return res.json({
                            error: err,
                            message: "PutObject presigned URL generation failed with a status of 200."
                        });
                    }
                    
                    const returnedData = {
                        url: url,
                        message: 'PutObject presigned URL generation succeeded.'
                    }
    
                    return res.status(200).json(returnedData);
                });
            } catch (err) {
                return res.status(500).json({
                    error: err,
                    message: "PutObject presigned URL generation failed with a status of 500."
                });
            }
        } else if (req.body.action === 'Delete Signed URL') {
            const deleteParams = {
                Bucket: s3Bucket,
                Key: fileName,
            }

            try {
                s3.getSignedUrl("deleteObject", deleteParams, async(err, url) => {
                    if (err) {
                        return res.json({
                            error: err,
                            message: "DeleteObject presigned URL generation failed with a status of 200."
                        });
                    }
                    
                    const returnedData = {
                        url: url,
                        message: 'DeleteObject presigned URL generation succeeded.'
                    }
    
                    return res.status(200).json(returnedData);
                });
            } catch (err) {
                return res.status(500).json({
                    error: err,
                    message: "DeleteObject presigned URL generation failed with a status of 500."
                });
            }
        } else if (req.body.action === 'Get Signed URL') {
            const getParams = {
                Bucket: s3Bucket,
                Key: fileName,
            }

            try {
                s3.getSignedUrl("getObject", getParams, async(err, url) => {
                    if (err) {
                        return res.json({
                            error: err,
                            message: "GetObject presigned URL generation failed with a status of 200."
                        });
                    }
                    
                    const returnedData = {
                        url: url,
                        message: 'GetObject presigned URL generation succeeded.'
                    }
    
                    return res.status(200).json(returnedData);
                });
            } catch (err) {
                return res.status(500).json({
                    error: err,
                    message: "GetObject presigned URL generation failed with a status of 500."
                });
            }
        }
    }
}