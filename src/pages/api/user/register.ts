import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
const nodemailer = require('nodemailer');
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.action === "check-id") {
            try {
                const user = await prisma.fontsUser.findUnique({
                    select: { user_id: true },
                    where: { user_id: req.query.id as string }
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
                const userSessionId = crypto.randomUUID();
                const userEmailToken = crypto.randomUUID();
    
                // 유저 정보 생성
                await prisma.fontsUser.create({
                    data: {
                        user_name: req.body.name,
                        user_id: req.body.id,
                        user_pw: req.body.pw,
                        user_session_id: userSessionId,
                        user_email_token: userEmailToken,
                        user_email_confirm: false,
                        profile_img: "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg"
                    }
                });
    
                return res.status(200).json({
                    msg: "유저 정보 생성 성공",
                    id: req.body.id,
                    name: req.body.name,
                    session_id: userSessionId,
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
                // transporter 설정
                const transporter = nodemailer.createTransport({
                    host: 'smtp.daum.net',
                    post: 465,
                    secure: true, // 465 포트일 때 true, 아니면 false
                    auth: {
                        user: process.env.EMAIL_ID, // 다음 스마트워크 메일 계정
                        pass: process.env.EMAIL_PASSWORD, // 다음 스마트워크 메일 비밀번호
                    }
                });

                // transporter에 정의된 계정 정보를 사용해 이메일 전송
                await transporter.sendMail({
                    from: '"폰트 아카이브" <taedonn@taedonn.com>',
                    to: req.body.id,
                    subject: '[폰트 아카이브] 회원가입 인증 메일입니다.',
                    html: `
                        <div style="width:100%; background-color:#F3F5F7;">
                            <div style="width:100%; max-width:520px; background-color:#FFF; margin:0 auto; padding:80px 20px; box-sizing:border-box; font-size:16px; font-weight:400; line-height:1.25; color:#000; font-family:'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                                <div style="width:100%; max-width:400px; margin:0 auto;">
                                    <div style="width: 100%; margin: 0 auto;">
                                        <div style="margin: 0 auto; width:24px; height:24px; background-color:#000; color:#FFF; font-size:10px; font-weight:400; text-align:center; line-height:22px; border-radius:4px;">Aa</div>
                                        <div style="margin: 0 auto; margin-top: 16px; font-size: 14px; text-align: center; color: #3A3A3A;">폰트 아카이브</div>
                                    </div>
                                    <h2 style="font-size:20px; font-weight:500; text-align: center; color: #3A3A3A; margin-top:8px;">
                                        회원가입 <span style="color: #000; font-weight: 700;">인증 메일</span>입니다.
                                    </h2>
                                    <p style="text-align: center; margin-top: 40px;">
                                        <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/mail.png" alt="메일 아이콘" style="width: 160px;"/>
                                    </p>
                                    <p style="width:100%; font-size:14px; font-weight:400; text-align: center; line-height:1.8; color:#3A3A3A; margin:0; margin-top:40px;">
                                        안녕하세요 ${req.body.name}님, <br/>
                                        아래 버튼을 클릭해서 <span style="font-weight:700; color:#000;">회원가입을 완료</span>해 주세요.
                                    </p>
                                    <a style="width:200px; display:block; padding:16px 20px; box-sizing:border-box; margin: 0 auto; margin-top:20px; background-color:#000; font-size:14px; font-weight:700; text-align:center; color:#FFF; text-decoration:none; border-radius:6px;" href="https://fonts.taedonn.com/confirm?session=${req.body.session_id}">
                                        회원가입 완료하기
                                    </a>
                                    <div style="width:100%; height:1px; background-color:#EEE; margin-top:48px;"></div>
                                    <p style="width:100%; font-size:12px; font-weight:400; line-height:2.5; color:#97989C; margin:0; margin-top:28px;">
                                        버튼이 클릭되지 않을 시, <br/>
                                        아래 링크를 복사해서 <span style="font-weight:700;">주소창에 입력</span>해 주세요. <br/>
                                        <a style="text-decoration:none; color:#067DF7;" href="https://fonts.taedonn.com/confirm?session=${req.body.session_id}">https://fonts.taedonn.com/confirm?session=${req.body.session_id}</a>
                                    </p>
                                    <div style="width: 20px; height: 2px; background-color: #CDCED2; margin-top: 20px;"></div>
                                    <p style="width:100%; font-size:12px; font-weight:400; line-height:2.5; color:#97989C; margin:0; margin-top:24px;">
                                        <a style="text-decoration:none; color:#067DF7;" href="https://fonts.taedonn.com">홈페이지</a> · 
                                        <a style="text-decoration:none; color:#067DF7;" href="https://fonts.taedonn.com/user/terms">서비스 이용약관</a> · 
                                        <a style="text-decoration:none; color:#067DF7;" href="https://fonts.taedonn.com/user/privacy">개인정보 처리방침</a>
                                        <br/>© 2023 taedonn, all rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `
                });

                return res.status(200).json({
                    msg: "이메일 전송 성공",
                    email_token: req.body.email_token,
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