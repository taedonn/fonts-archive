import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const config = {
    api: {
        externalResolver: true,
    },
};
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const s3 = new S3Client({
        credentials: {
            accessKeyId: process.env.MY_AWS_ACCESS_KEY as string,
            secretAccessKey: process.env.MY_AWS_SECRET_KEY as string,
        },
        region: process.env.MY_AWS_S3_REGION as string,
    });
    const s3Bucket = process.env.MY_AWS_S3_BUCKET;
    const fileName = req.body.file_name;
    const fileType = req.body.file_type;
    
    if (req.method === 'GET') {
        if (req.query.action === "get-current-pw") {
            try {
                const user = await prisma.fontsUser.findUnique({
                    select: {
                        user_id: true,
                        user_pw: true,
                    },
                    where: { user_id: req.query.id as string }
                });

                return res.status(200).json({
                    msg: "비밀번호 조회 성공",
                    user: user,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "비밀번호 조회 실패",
                    err: err,
                });
            }
        }
    } else if (req.method === "POST") {
        if (req.body.action === "change-pw") {
            try {
                await prisma.fontsUser.update({
                    where: { user_id: req.body.id },
                    data: { user_pw: req.body.pw }
                });

                return res.status(200).json({
                    msg: "비밀번호 변경 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "비밀번호 변경 실패",
                    err: err,
                });
            }
        } else if (req.body.action === "change-name") {
            try {
                await prisma.fontsUser.update({
                    where: { user_id: req.body.id },
                    data: { user_name: req.body.name }
                });

                return res.status(200).json({
                    msg: "이름 변경 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이름 변경 실패",
                    err: err,
                })
            }
        } else if (req.body.action === "delete-profile-img") {
            try {
                const randomProfileImg = "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg";

                // 프로필 이미지 삭제 후 기본 프로필 이미지로 변경
                await prisma.fontsUser.update({
                    where: { user_id: req.body.id },
                    data: { profile_img: randomProfileImg }
                });

                return res.status(200).json({
                    msg: "이미지 삭제 성공",
                    img: randomProfileImg,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이미지 삭제 실패",
                    err: err,
                });
            }
        } else if (req.body.action === "delete-s3-img") {
            try {
                const deleteParams = {
                    Bucket: s3Bucket,
                    Key: fileName,
                }
                const url = await getSignedUrl(s3, new DeleteObjectCommand(deleteParams), { expiresIn: 3600 });

                return res.status(200).json({
                    msg: "S3 이미지 삭제 성공",
                    url: url,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "S3 이미지 삭제 실패",
                    err: err,
                })
            }
        } else if (req.body.action === "upload-s3-img") {
            try {
                const putParams = {
                    Bucket: s3Bucket,
                    Key: fileName,
                    ContentType: fileType,
                }
                const url = await getSignedUrl(s3, new PutObjectCommand(putParams), { expiresIn: 3600 });

                return res.status(200).json({
                    msg: "S3 이미지 업로드 성공",
                    url: url,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "S3 이미지 업로드 실패",
                    err: err,
                });
            }
        } else if (req.body.action === "upload-s3-img-to-prisma") {
            try {
                const url = `https://fonts-archive.s3.ap-northeast-2.amazonaws.com/fonts-archive-user-${req.body.user_no}-profile-img.${req.body.img_type}`;
                await prisma.fontsUser.updateMany({
                    where: { user_id: req.body.user_id },
                    data: { profile_img: url }
                });

                return res.status(200).json({
                    msg: "이미지 업로드 성공",
                    url: url,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이미지 업로드 실패",
                    err: err,
                })
            }
        } else if (req.body.action === "delete-user") {
            try {
                // 좋아요한 폰트 삭제
                await prisma.fontsLiked.deleteMany({
                    where: { user_id: Number(req.body.user_no) }
                });

                // 댓글 신고 삭제
                await prisma.fontsUserReport.deleteMany({
                    where: { report_user_id: Number(req.body.user_no) }
                });

                // 댓글 조회
                const comments = await prisma.fontsComment.findMany({
                    where: { user_id: Number(req.body.user_no) }
                });

                // 댓글의 bundle_id 조회
                let commentsArr = [];
                if (comments && comments.length > 0) {
                    for (let i = 0; i < comments.length; i++) {
                        commentsArr.push({
                            font_id: Number(comments[i].font_id),
                            bundle_id: Number(comments[i].bundle_id)
                        });
                    }
                }

                // 댓글, 답글, 다른 유저의 답글까지 모두 삭제
                comments && comments.length > 0 && await prisma.fontsComment.deleteMany({
                    where: { OR: commentsArr }
                });

                // 유저 정보 삭제
                await prisma.fontsUser.delete({
                    where: { user_no: Number(req.body.user_no) }
                });

                return res.status(200).json({
                    msg: "유저 삭제 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "유저 삭제 실패",
                    err: err,
                });
            }
        }
    }
}