import type { NextApiRequest, NextApiResponse } from 'next';
const nodemailer = require('nodemailer');
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // 쿼리에서 뽑은 이메일
        const email = req.query.email === undefined ? '' : req.query.email;

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
            to: email,
            subject: '[폰트 아카이브] 회원가입 인증 메일입니다.',
            html: `
                <div style="width:100%; display:flex; flex-direction:column; justify-content:flex-start; align-items:center;">
                    <script>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/SpoqaHanSansNeo/SpoqaHanSansNeo.css" type="text/css"/>
                    </script>
                    <div style="width:600px; font-family:'Spoqa Han Sans Neo'; font-size:16px; line-height:1.25;">
                        아래 링크를 클릭해서 인증을 완료해 주세요.
                    </div>
                </div>
            `
        });

        return res.send(true);
    }
}