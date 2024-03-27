import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
import { SMTPClient } from "emailjs";
const bcrypt = require('bcrypt');
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.action === "check-id") {
            try {
                const user = await prisma.fontsUser.findFirst({
                    select: {
                        user_id: true,
                        auth: true,
                    },
                    where: {
                        user_id: req.query.id as string,
                        auth: "credentials",
                    }
                });

                return res.status(200).json({
                    msg: "ID 조회 성공",
                    check: user === null ? false : true,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "ID 조회 실패",
                    err: err,
                });
            }
        }
    } else if (req.method === 'POST') {
        if (req.body.action === "register") {
            try {
                const { id, pw, name } = req.body;
                const salt = bcrypt.genSaltSync(5);
                const hash = bcrypt.hashSync(pw, salt);
                const userEmailToken = crypto.randomUUID();
    
                // 유저 정보 생성
                await prisma.fontsUser.create({
                    data: {
                        user_name: name,
                        user_id: id,
                        user_pw: hash,
                        auth: "credentials",
                        user_email_token: userEmailToken,
                        user_email_confirm: false,
                        profile_img: "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg"
                    }
                });
    
                return res.status(200).json({
                    msg: "유저 정보 생성 성공",
                    id: id,
                    name: name,
                    email_token: userEmailToken,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "유저 정보 생성 실패",
                    err: err,
                });
            }
        } else if (req.body.action === "send-email") {
            try {
                const { id, name, email_token } = req.body;

                // transporter 설정
                const client = new SMTPClient({
                    user: process.env.EMAIL_ID,
                    password: process.env.EMAIL_PASSWORD,
                    host: 'smtp.daum.net',
                    port: 465,
                    ssl: true,
                });

                // transporter에 정의된 계정 정보를 사용해 이메일 전송
                await client.sendAsync({
                    from: "폰트 아카이브 <taedonn@taedonn.com>",
                    to: id,
                    subject: "[폰트 아카이브] 회원가입 인증 메일입니다",
                    text: "",
                    attachment: [
                        { data: `
                            <div style="width: 100%;">
                                <div style="width: 100%; max-width: 520px; margin: 0 auto; padding: 80px 28px; box-sizing: border-box; background-color: #FFF; font-size: 16px; font-weight: 400; line-height: 1.25; color: #000; font-family: 'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                                    <div style="width: 100%; margin: 0 auto;">
                                        <div style="display: table; height: 24px; margin: 0 auto;">
                                            <span style="display: table-cell; vertical-align: middle;"><img style="height: 18px; margin-right: 8px;" src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/logo.png"/></span>
                                            <span style="display: table-cell; font-size: 16px; font-weight: bold;">폰트 아카이브</div>
                                        </div>
                                        <h2 style="font-size:20px; font-weight:500; text-align: center; color: #3A3A3A; margin-top:32px;">
                                            회원가입 <span style="color: #000; font-weight: 700;">인증 메일</span>입니다.
                                        </h2>
                                        <p style="text-align: center; margin: 40px 0;">
                                            <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/3d_high_five.png" alt="메일 아이콘" style="width: 160px;"/>
                                        </p>
                                        <p style="width: 100%; font-size: 14px; text-align: center; line-height: 1.8; color: #3A3A3A;">
                                            안녕하세요 <span style="font-weight: bold; color: #000;">${name}</span>님, <br/>
                                            아래 버튼을 클릭해서 회원가입을 완료해 주세요.
                                        </p>
                                        <a style="width: 280px; max-width: 100%; display: block; padding: 16px 20px; box-sizing: border-box; margin: 0 auto; margin-top: 20px; box-sizing: border-box; background-color: #1B73E7; font-size: 14px; font-weight: bold; text-align: center; color: #FFF; text-decoration: none; border-radius: 6px;" href="https://fonts.taedonn.com/confirm?token=${email_token}">
                                            회원가입 완료하기
                                        </a>
                                        <div style="width: 100%; height: 1px; background-color: #D2D4DC; margin-top: 48px;"></div>
                                        <p style="width: 100%; font-size: 12px; font-weight: 400; line-height: 2.5; color: #5F6368; margin: 0; margin-top: 28px;">
                                            버튼이 클릭되지 않을 시, <br/>
                                            아래 링크를 복사해서 <span style="font-weight: 700;">주소창에 입력</span>해 주세요. <br/>
                                            <a style="color: #067DF7;" href="https://fonts.taedonn.com/confirm?token=${email_token}">https://fonts.taedonn.com/confirm?token=${email_token}</a>
                                        </p>
                                        <div style="width: 20px; height: 2px; background-color: #D2D4DC; margin: 20px 0;"></div>
                                        <p style="width: 100%; font-size: 12px; font-weight: 400; line-height: 2.5; color: #5F6368;">
                                            <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com">홈페이지</a> · 
                                            <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com/terms">서비스 이용약관</a> · 
                                            <a style="color: #067DF7;" target="_blank" href="https://fonts.taedonn.com/privacy">개인정보 처리방침</a>
                                            <br/>© 2023 - ${new Date().getFullYear()} taedonn, all rights reserved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        `, alternative: true }
                    ]
                });

                return res.status(200).json({
                    msg: "이메일 전송 성공",
                    email_token: email_token,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이메일 전송 실패",
                    err: err,
                });
            }
        }
    }
}