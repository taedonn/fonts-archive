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
                    <div style="width:100%; font-size:16px; font-weight:400; line-height:1.25; color:#000; background-color:#F3F5F7; font-family:'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                        <div style="width:100%; max-width:600px; background-color:#FFF; margin:0 auto; padding:80px 20px; box-sizing:border-box; font-size:16px; font-weight:400; line-height:1.25; color:#000;">
                            <div style="width:100%; max-width:400px; margin:0 auto;">
                                <div style="width:32px; height:32px; background-color:#000; color:#FFF; font-size:12px; font-weight:400; line-height:1; border-radius:6px; margin:0 auto; text-align:center; line-height:30px;">Aa</div>
                                <h2 style="font-size:20px; font-weight:500; margin:0; margin-top:20px; text-align:center;">
                                    임시 비밀번호가 발급되었습니다.
                                </h2>
                                <p style="width:100%; font-size:14px; font-weight:400; line-height:2; color:#3A3A3A; margin:0; margin-top:48px;">
                                    안녕하세요 ${user.user_name}님, <br/>
                                    이제 아래 <span style="font-weight:500; color:#000;">임시 비밀번호를 통해</span> 로그인 하실 수 있습니다.
                                </p>
                                <div style="width:100%; padding:16px 20px; box-sizing:border-box; margin-top:28px; background-color:#EEE; font-size:12px; font-weight:500; color:#3A3A3A; text-decoration:none; border-radius:6px;">
                                    ${randomPw}
                                </div>
                                <p style="width:100%; font-size:14px; font-weight:400; line-height:2; color:#3A3A3A; margin:0; margin-top:28px;">
                                    로그인이 되지 않을 경우, <br/>
                                    아래 링크에 접속하여 <span style="font-weight:500; color:#000;">임시 비밀번호를 다시 발급</span>받아 주세요. <br/>
                                    <a style="text-decoration:none; color:#067DF7;" href="https://fonts.taedonn.com/user/findpw">https://fonts.taedonn.com/user/findpw</a>
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