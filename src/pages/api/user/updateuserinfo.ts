import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
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
                const { id, auth } = req.query;
                
                const user = await prisma.fontsUser.findFirst({
                    select: {
                        user_id: true,
                        user_pw: true,
                        auth: true,
                    },
                    where: {
                        user_id: id as string,
                        auth: auth as string,
                    }
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
                const { id, pw, auth } = req.body;

                await prisma.fontsUser.updateMany({
                    where: {
                        user_id: id,
                        auth: auth,
                    },
                    data: { user_pw: pw }
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
                const { id, name, auth } = req.body;

                await prisma.fontsUser.updateMany({
                    where: {
                        user_id: id,
                        auth: auth,
                    },
                    data: { user_name: name }
                });

                await prisma.fontsComment.updateMany({
                    where: {
                        user_email: id,
                        user_auth: auth,
                    },
                    data: { user_name: name }
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
                const { id, auth } = req.body;
                const randomProfileImg = "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg";

                // 프로필 이미지 삭제 후 기본 프로필 이미지로 변경
                await prisma.fontsUser.updateMany({
                    where: {
                        user_id: id,
                        auth: auth,
                    },
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
        } else if (req.body.action === "change-img") {
            try {
                // s3 업로드를 위한 변수
                const putParams = {
                    Bucket: s3Bucket,
                    Key: fileName,
                    ContentType: fileType,
                }

                // s3 업로드
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
        } else if (req.body.action === "upload-img-on-prisma") {
            try {
                // prisma 업로드를 위한 변수
                const { id, no, auth, img_type } = req.body;
                const url = `https://fonts-archive.s3.ap-northeast-2.amazonaws.com/fonts-archive-user-${no}-profile-img.${img_type}`;
                
                // prisma 업로드
                await prisma.fontsUser.updateMany({
                    where: {
                        user_id: id,
                        auth: auth,
                    },
                    data: { profile_img: url }
                });

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
        } else if (req.body.action === "delete-user") {
            try {
                const { file_name, user_no } = req.body;

                // s3 이미지 삭제
                const deleteParams = {
                    Bucket: s3Bucket,
                    Delete: {
                        Objects: [
                            { Key: file_name + "apng" },
                            { Key: file_name + "avif" },
                            { Key: file_name + "gif" },
                            { Key: file_name + "jpg" },
                            { Key: file_name + "jpeg" },
                            { Key: file_name + "jfif" },
                            { Key: file_name + "pjpeg" },
                            { Key: file_name + "pjp" },
                            { Key: file_name + "png" },
                            { Key: file_name + "svg" },
                            { Key: file_name + "webp" },
                        ],
                    },
                }
                await s3.send(new DeleteObjectsCommand(deleteParams));

                // 좋아요한 폰트 삭제
                await prisma.fontsLiked.deleteMany({
                    where: { user_id: Number(user_no) }
                });

                // 댓글 신고 삭제
                await prisma.fontsUserReport.deleteMany({
                    where: { report_user_id: Number(user_no) }
                });

                // 댓글 조회
                const comments = await prisma.fontsComment.findMany({
                    where: { user_id: Number(user_no) }
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
                    where: { user_no: Number(user_no) }
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