import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SMTPClient } from "emailjs";

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const s3 = new S3Client({
        credentials: {
            accessKeyId: process.env.MY_AWS_ACCESS_KEY as string,
            secretAccessKey: process.env.MY_AWS_SECRET_KEY as string,
        },
        region: process.env.MY_AWS_S3_REGION as string,
    });
    const s3Bucket = process.env.MY_AWS_S3_ISSUE_BUCKET as string;

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
        } else if (req.body.action === "upload-issue") {
            try {
                const {
                    title,
                    email,
                    content,
                    type,
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
                        issue_type: type,
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

                const client = new SMTPClient({
                    user: process.env.EMAIL_ID,
                    password: process.env.EMAIL_PASSWORD,
                    host: 'smtp.daum.net',
                    port: 465,
                    ssl: true,
                });

                client.send(
                    {
                        from: "폰트 아카이브 <taedonn@taedonn.com>",
                        to: email,
                        subject: "[폰트 아카이브] 문의해주셔서 감사합니다",
                        text: "",
                        attachment: [
                            { data: `
                                <div style="width: 100%; font-size: 16px; font-weight: 400; line-height: 1.25; color: #000; font-family: 'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                                    <div style="width: 100%; max-width: 520px; background-color: #FFF; margin: 0 auto; padding: 80px 28px; box-sizing: border-box;">
                                        <div style="width: 100%; margin: 0 auto;">
                                            <div style="display: table; height: 24px; margin: 0 auto;">
                                                <span style="display: table-cell; vertical-align: middle;"><img style="height: 18px; margin-right: 8px;" src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/logo.png"/></span>
                                                <span style="display: table-cell; font-size: 16px; font-weight: bold;">폰트 아카이브</div>
                                            </div>
                                            <h2 style="font-size: 20px; font-weight: 500; margin-top: 32px; text-align: center;">
                                                문의해 주셔서 <span style="color: #000; font-weight: 700;">감사합니다.</span>
                                            </h2>
                                            <p style="text-align: center; margin: 40px 0;">
                                                <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/3d_love_sign.png" alt="아이콘" style="width: 140px;"/>
                                            </p>
                                            <p style="width: 320px; max-width: 100%; font-size: 14px; font-weight: 400; line-height: 2; color: #3A3A3A; word-break: keep-all; margin: 0 auto;">
                                                폰트 아카이브를 이용해 주셔서 감사합니다! 문의해주신 내용 검토 후 최대한 빠른 시일 내에 답변드리겠습니다. <br/><br/>
                                                부득이하게 문의해주신 내용을 반영하기 어려울 경우, 관련 내용 첨부해서 답변 드리겠습니다. 감사합니다! <br/><br/>
                                                - 태돈
                                            </p>
                                            <div style="width: 100%; height: 1px; background-color: #D2D4DC; margin: 0 auto; margin-top: 48px;"></div>
                                            <p style="width: 100%; font-size: 12px; font-weight: 400; line-height: 2.5; margin: 0 auto; margin-top: 28px; color: #5F6368;">
                                                <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com">홈페이지</a> · 
                                                <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com/terms">서비스 이용약관</a> · 
                                                <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com/privacy">개인정보 처리방침</a>
                                                <br/>© 2023 - ${new Date().getFullYear()} taedonn, all rights reserved.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            `, alternative: true },
                        ],
                    },
                    (err) => {
                        if (err) console.log(err);
                    }
                );

                client.send(
                    {
                        from: "폰트 아카이브 <taedonn@taedonn.com>",
                        to: "taedonn@taedonn.com",
                        subject: "[폰트 아카이브] 고객 문의 내용",
                        text: "",
                        attachment: [
                            { data: `
                                <div style="width: 100%; font-size: 16px; font-weight: 400; line-height: 1.25; color: #000; font-family: 'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                                    <div style="width: 100%; max-width: 520px; background-color: #FFF; margin: 0 auto; padding: 80px 28px; box-sizing: border-box;">
                                        <div style="width:100%; max-width:400px; margin:0 auto;">
                                            <div style="display: table; height: 24px; margin: 0 auto;">
                                                <span style="display: table-cell; vertical-align: middle;"><img style="height: 18px; margin-right: 8px;" src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/logo.png"/></span>
                                                <span style="display: table-cell; font-size: 16px; font-weight: bold;">폰트 아카이브</div>
                                            </div>
                                            <h2 style="font-size: 20px; font-weight: 500; margin-top: 32px; text-align: center;">
                                                고객 문의 내용
                                            </h2>
                                            <p style="text-align: center; margin: 40px 0;">
                                                <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/3d_gun_sign.png" alt="아이콘" style="width: 140px;"/>
                                            </p>
                                            <p style="width: 320px; max-width: 100%; font-size: 14px; font-weight: bold; line-height: 2; margin: 0 auto;">
                                                제목
                                            </p>
                                            <div style="width: 320px; max-width: 100%; padding: 16px 20px; box-sizing: border-box; margin: 0 auto; margin-top: 8px; box-sizing: border-box; font-size: 14px; background-color: #E9F0FE; border-radius: 6px;">
                                                ${title}
                                            </div>
                                            <p style="width: 320px; max-width: 100%; font-size: 14px; font-weight: bold; line-height: 2; margin: 0 auto; margin-top: 40px;">
                                                이메일
                                            </p>
                                            <div style="width: 320px; max-width: 100%; padding: 16px 20px; box-sizing: border-box; margin: 0 auto; margin-top: 8px; box-sizing: border-box; font-size: 14px; background-color: #E9F0FE; border-radius: 6px;">
                                                ${email}
                                            </div>
                                            <p style="width: 320px; max-width: 100%; font-size: 14px; font-weight: bold; line-height: 2; margin: 0 auto; margin-top: 40px;">
                                                문의 유형
                                            </p>
                                            <div style="width: 320px; max-width: 100%; padding: 16px 20px; box-sizing: border-box; margin: 0 auto; margin-top: 8px; box-sizing: border-box; font-size: 14px; background-color: #E9F0FE; border-radius: 6px;">
                                                ${
                                                    type === "font"
                                                        ? "폰트 관련 제보"
                                                        : type === "bug"
                                                            ? "버그 관련 제보"
                                                            : "기타 문의 사항"
                                                }
                                            </div>
                                            <p style="width: 320px; max-width: 100%; font-size: 14px; font-weight: bold; line-height: 2; margin: 0 auto; margin-top: 40px;">
                                                문의 내용
                                            </p>
                                            <pre style="width: 320px; max-width: 100%; min-height: 120px; white-space: pre-wrap; word-break: break-all; padding: 16px 20px; box-sizing: border-box; margin: 0 auto; margin-top: 8px; box-sizing: border-box; font-size: 14px; background-color: #E9F0FE; border-radius: 6px; font-family: 'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">${content}</pre>
                                            <div style="width: 100%; height: 1px; background-color: #D2D4DC; margin: 0 auto; margin-top: 48px;"></div>
                                            <p style="width: 100%; font-size: 12px; font-weight: 400; line-height: 2.5; margin: 0 auto; margin-top: 28px; color: #5F6368;">
                                                <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com">홈페이지</a> · 
                                                <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com/terms">서비스 이용약관</a> · 
                                                <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com/privacy">개인정보 처리방침</a>
                                                <br/>© 2023 - ${new Date().getFullYear()} taedonn, all rights reserved.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            `, alternative: true },
                        ],
                    },
                    (err) => {
                        if (err) console.log(err);
                    }
                );

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