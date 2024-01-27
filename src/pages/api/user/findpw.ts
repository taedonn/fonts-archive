import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { id, name } = req.body;
            const randomPw = Math.random().toString(36).slice(2);
            const salt = bcrypt.genSaltSync(5);
            const hash = bcrypt.hashSync(randomPw, salt);

            // 유저 정보 조회
            const user = await prisma.fontsUser.findFirst({
                select: {
                    user_id: true,
                    user_name: true,
                    auth: true,
                },
                where: {
                    user_id: id,
                    auth: "credentials",
                }
            });

            // 유효성 검사
            const valid = user === null
                ? "wrong-id"
                : user.user_name !== name
                    ? "wrong-name"
                    : "success";

            // 임시 비밀번호 발급
            user && valid === "success" && await prisma.fontsUser.updateMany({
                where: {
                    user_id: id,
                    auth: "credentials",
                },
                data: { user_pw: hash }
            });

            // 아이디 조회 성공 시 메일 보내기
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
            user && valid === "success" && await transporter.sendMail({
                from: '"폰트 아카이브" <taedonn@taedonn.com>',
                to: user.user_id,
                subject: '[폰트 아카이브] 임시 비밀번호가 발급되었습니다.',
                html: `
                    <div style="width: 100%; font-size: 16px; font-weight: 400; line-height: 1.25; color: #000; font-family: 'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                        <div style="width: 100%; max-width: 520px; background-color: #FFF; margin: 0 auto; padding: 80px 28px; box-sizing: border-box;">
                            <div style="width: 100%; margin: 0 auto;">
                                <div style="display: table; height: 24px; margin: 0 auto;">
                                    <span style="display: table-cell; vertical-align: middle;"><img style="height: 18px; margin-right: 8px;" src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/logo.png"/></span>
                                    <span style="display: table-cell; font-size: 16px; font-weight: bold;">폰트 아카이브</div>
                                </div>
                                <h2 style="font-size: 20px; font-weight: 500; margin-top: 32px; text-align: center;">
                                    <span style="font-weight: bold;">임시 비밀번호</span>가 발급되었습니다.
                                </h2>
                                <p style="text-align: center; margin: 40px 0;">
                                    <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/3d_lock.png" alt="아이콘" style="width: 140px;"/>
                                </p>
                                <p style="width: 100%; font-size: 14px; font-weight: 400; line-height: 2; text-align: center; color: #3A3A3A; margin: 0;">
                                    안녕하세요 <span style="font-weight: bold; color: #000;">${user.user_name}</span>님, <br/>
                                    아래 임시 비밀번호를 통해 로그인 하실 수 있습니다.
                                </p>
                                <div style="width: 320px; max-width: 100%; padding: 16px 20px; box-sizing: border-box; margin: 0 auto; margin-top: 20px; box-sizing: border-box; background-color: #E9F0FE; font-size: 14px; text-decoration: none; border-radius: 6px;">
                                    ${randomPw}
                                </div>
                                <div style="width: 100%; height: 1px; background-color: #D2D4DC; margin-top: 48px;"></div>
                                <p style="width: 100%; font-size: 12px; font-weight: 400; line-height: 2.5; color: #5F6368; margin: 0; margin-top: 28px;">
                                    로그인이 되지 않을 경우, <br/>
                                    아래 링크에 접속하여 <span style="font-weight: bold;">임시 비밀번호</span>를 다시 발급받아 주세요. <br/>
                                    <a style="color: #067DF7;" href="https://fonts.taedonn.com/user/findpw">https://fonts.taedonn.com/user/findpw</a>
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
                `
            });

            return res.status(200).json({
                msg: "이메일 발송 성공",
                valid: valid,
            });
        } catch (err) {
            return res.status(500).json({
                msg: "이메일 발송 실패",
                err: err,
            });
        }
    }
}