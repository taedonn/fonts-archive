import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
const nodemailer = require('nodemailer');
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // 쿼리에서 뽑은 토큰
        const token = req.query.token === undefined ? '' : req.query.token as string;

        // DB에서 토큰으로 유저 정보 검색
        const user: any = await client.fontsUser.findFirst({
            select: {
                user_name: true,
                user_id: true,
                user_session_id: true,
                user_email_token: true
            },
            where: { user_email_token: token }
        });

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
            to: user.user_id,
            subject: '[폰트 아카이브] 회원가입 인증 메일입니다.',
            html: `
                <div style="width:100%;">
                    <div style="width:100%; max-width:600px; padding:40px 20px; border:1px solid #EEE; font-family:'Roboto', 'Noto Sans KR'; font-size:16px; font-weight:400; line-height:1.25; color:#000;">
                        <div style="width:100%; max-width:400px; margin:0 auto;">
                            <div style="width:32px; height:32px; background-color:#000; color:#FFF; font-size:12px; font-weight:400; text-align:center; line-height:32px; border-radius:6px; margin:0 auto;">Aa</div>
                            <h2 style="font-size:20px; font-weight:500; text-align:center; margin-top:20px;">
                                회원가입 인증 메일입니다.
                            </h2>
                            <p style="width:100%; font-size:14px; font-weight:400; line-height:2; color:#3A3A3A; margin:0; margin-top:48px;">
                                안녕하세요 ${user.user_name}님, <br/>
                                아래 버튼을 클릭해서 <span style="font-weight:500; color:#000;">회원가입을 완료</span>해 주세요.
                            </p>
                            <a style="width:200px; display:block; padding:16px 20px; margin:0 auto; margin-top:28px; box-sizing:border-box; background-color:#000; font-size:12px; font-weight:500; text-align:center; color:#FFF; text-decoration:none; border-radius:6px;" href="https://fonts.taedonn.com?session=${user.user_session_id}">
                                회원가입 완료하기
                            </a>
                            <p style="width:100%; font-size:14px; font-weight:400; line-height:2; color:#3A3A3A; margin:0; margin-top:28px;">
                                버튼이 클릭되지 않을 시, <br/>
                                아래 링크를 복사해서 <span style="font-weight:500; color:#000;">주소창에 입력</span>해 주세요. <br/>
                                <a style="text-decoration:none; color:#067DF7;" href="https://fonts.taedonn.com?session=${user.user_session_id}">https://fonts.taedonn.com?session=${user.user_session_id}</a>
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

        return res.send(true);
    }
}