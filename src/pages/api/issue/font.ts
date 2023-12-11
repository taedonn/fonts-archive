import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const nodemailer = require('nodemailer');

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
        } else if (req.body.action === "upload-font-report") {
            try {
                const {
                    title,
                    email,
                    content,
                    img_length,
                    img_1,
                    img_2,
                    img_3,
                    img_4,
                    img_5,
                    issue_closed_type,
                } = req.body;

                await prisma.fontsIssue.create({
                    data: {
                        issue_title: title,
                        issue_email: email,
                        issue_content: content,
                        issue_reply: "",
                        issue_img_length: Number(img_length),
                        issue_img_1: img_1,
                        issue_img_2: img_2,
                        issue_img_3: img_3,
                        issue_img_4: img_4,
                        issue_img_5: img_5,
                        issue_closed_type: issue_closed_type,
                    }
                });

                // transporter 설정
                const transporter =  nodemailer.createTransport({
                    host: 'smtp.daum.net',
                    post: 465,
                    secure: true, // 465 포트일 때 true, 아니면 false
                    auth: {
                        user: process.env.EMAIL_ID, // 다음 스마트워크 메일 계정
                        pass: process.env.EMAIL_PASSWORD, // 다음 스마트워크 메일 비밀번호
                    }
                });

                // transporter에 정의된 계정 정보를 사용해 이메일 전송
                transporter === await transporter.sendMail({
                    from: '"폰트 아카이브" <taedonn@taedonn.com>',
                    to: email,
                    subject: '[폰트 아카이브] 폰트를 제보해주셔서 감사합니다.',
                    html: `
                        <div style="width:100%; font-size:16px; font-weight:400; line-height:1.25; color:#000; background-color:#F3F5F7; font-family:'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                                <div style="width:100%; max-width:520px; background-color:#FFF; margin:0 auto; padding:80px 20px; box-sizing:border-box; font-size:16px; font-weight:400; line-height:1.25; color:#000;">
                                <div style="width:100%; max-width:400px; margin:0 auto;">
                                    <div style="width: 100%; margin: 0 auto;">
                                        <div style="margin: 0 auto; width:24px; height:24px; background-color:#000; color:#FFF; font-size:10px; font-weight:400; text-align:center; line-height:22px; border-radius:4px;">Aa</div>
                                        <div style="margin: 0 auto; margin-top: 16px; font-size: 14px; text-align: center; color: #3A3A3A;">폰트 아카이브</div>
                                    </div>
                                    <h2 style="font-size:20px; font-weight:500; text-align: center; color: #3A3A3A; margin-top:8px;">
                                        폰트를 제보해주셔서 <span style="color: #000; font-weight: 700;">감사합니다.</span>
                                    </h2>
                                    <p style="text-align: center; margin-top: 40px;">
                                        <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/mail.png" alt="메일 아이콘" style="width: 160px;"/>
                                    </p>
                                    <p style="width:100%; font-size:14px; font-weight:400; line-height:2; color:#3A3A3A; margin:0; margin-top:40px;">
                                        폰트 아카이브를 이용해 주셔서 감사합니다! 제보해주신 내용 검토 후 최대한 빠른 시일 내에 <span style="font-weight:500; color:#000;">답변</span>드리겠습니다. <br/><br/>
                                        부득이하게 제보해주신 내용을 웹사이트에 반영하기 어려울 경우, 관련 내용 첨부해서 답변 드리겠습니다. 감사합니다! <br/><br/>
                                        - 태돈
                                    </p>
                                    <div style="width:100%; height:1px; background-color:#EEE; margin-top:48px;"></div>
                                    <p style="width:100%; font-size:12px; font-weight:400; line-height:2.5; color:#97989C; margin:0; margin-top:24px;">
                                        taedonn - <a style="text-decoration:none; color:#067DF7;" href="https://fonts.taedonn.com">fonts.taedonn.com</a> <br/>
                                        check our GitHub repository @<a style="text-decoration:none; color:#97989C;" href="https://github.com/taedonn/fonts-archive">github.com/taedonn/fonts-archive</a> <br/>
                                        © 2023. taedonn, all rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `
                });

                // 관리자 메일로 보내기
                transporter === await transporter.sendMail({
                    from: '"폰트 아카이브" <taedonn@taedonn.com>',
                    to: "taedonn@taedonn.com",
                    subject: '[폰트 아카이브] 폰트 제보',
                    html: `
                        <div style="width:100%; font-size:16px; font-weight:400; line-height:1.25; color:#000; font-family:'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                            <div style="width:100%; max-width:520px; background-color:#FFF; margin:0 auto; padding:80px 20px; box-sizing:border-box; font-size:16px; font-weight:400; line-height:1.25; color:#000;">
                                <div style="width:100%; max-width:400px; margin:0 auto;">
                                    <div style="width: 100%; margin: 0 auto;">
                                        <div style="margin: 0 auto; width:24px; height:24px; background-color:#000; color:#FFF; font-size:10px; font-weight:400; text-align:center; line-height:22px; border-radius:4px;">Aa</div>
                                        <div style="margin: 0 auto; margin-top: 16px; font-size: 14px; text-align: center; color: #3A3A3A;">폰트 아카이브</div>
                                    </div>
                                    <h2 style="font-size:20px; font-weight:500; text-align: center; color: #3A3A3A; margin-top:8px;">
                                        <span style="color: #000; font-weight: 700;">폰트 제보</span> 관련 내용입니다.
                                    </h2>
                                    <p style="width:100%; font-size:14px; font-weight:500; line-height:2; color:#3A3A3A; text-decoration:underline; margin:0; margin-top:40px;">
                                        제목
                                    </p>
                                    <div style="width:100%; padding:16px 20px; box-sizing:border-box; margin-top:8px; box-sizing:border-box; background-color:#EEE; font-size:12px; font-weight:500; color:#3A3A3A; text-decoration:none; border-radius:6px;">
                                        ${title}
                                    </div>
                                    <p style="width:100%; font-size:14px; font-weight:500; line-height:2; color:#3A3A3A; text-decoration:underline; margin:0; margin-top:28px;">
                                        이메일
                                    </p>
                                    <div style="width:100%; padding:16px 20px; box-sizing:border-box; margin-top:8px; box-sizing:border-box; background-color:#EEE; font-size:12px; font-weight:500; color:#3A3A3A; text-decoration:none; border-radius:6px;">
                                        ${email}
                                    </div>
                                    <p style="width:100%; font-size:14px; font-weight:500; line-height:2; color:#3A3A3A; text-decoration:underline; margin:0; margin-top:28px;">
                                        내용
                                    </p>
                                    <div style="width:100%; padding:16px 20px; box-sizing:border-box; margin-top:8px; box-sizing:border-box; background-color:#EEE; font-size:12px; font-weight:500; color:#3A3A3A; text-decoration:none; border-radius:6px;">
                                        ${content}
                                    </div>
                                    <div style="width:100%; height:1px; background-color:#EEE; margin-top:48px;"></div>
                                    <p style="width:100%; font-size:12px; font-weight:400; line-height:2.5; color:#97989C; margin:0; margin-top:24px;">
                                        taedonn - <a style="text-decoration:none; color:#067DF7;" href="https://fonts.taedonn.com">fonts.taedonn.com</a> <br/>
                                        check our GitHub repository @<a style="text-decoration:none; color:#97989C;" href="https://github.com/taedonn/fonts-archive">github.com/taedonn/fonts-archive</a> <br/>
                                        © 2023. taedonn, all rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `
                });

                return res.status(200).json({
                    msg: "이메일 발송 및 DB 저장 성공"
                })
            } catch (err) {
                return res.status(500).json({
                    msg: "이메일 발송 및 DB 저장 실패",
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