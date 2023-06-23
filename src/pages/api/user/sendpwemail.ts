import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
import { random } from 'lodash';
const nodemailer = require('nodemailer');
  
interface data {
    exists: string,
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'POST') {
        // 쿼리에서 뽑은 아이디
        const name = req.query.name === undefined ? '' : req.query.name as string;
        const id = req.query.id === undefined ? '' : req.query.id as string;
        
        // 임시 비밀번호
        const randomPw = Math.random().toString(36).slice(2);

        // 이름 조회
        const nameExists: boolean = !!await client.fontsUser.findFirst({
            select: {
                user_name: true,
            },
            where: {
                user_name: name
            }
        });
        
        // 이름 조회 성공 시, 아이디 조회
        const idExists: boolean = !nameExists ? false : !!await client.fontsUser.findFirst({
            select: {
                user_name: true,
                user_id: true,
            },
            where: {
                AND: [
                    { user_name: name },
                    { user_id: id },
                ]
            }
        });

        const exists: string = !nameExists 
            ? 'wrong-name'
            : ( !idExists
                ? 'wrong-id'
                : 'success'
            )

        // 아이디 조회 성공 시 유저 정보 가져오기
        const user: any = exists ? await client.fontsUser.findFirst({
            select: {
                user_name: true,
                user_id: true,
                user_session_id: true
            },
            where: {
                user_id: id
            }
        }) : null;

        // 임시 비밀번호 업데이트
        exists ? await client.fontsUser.updateMany({
            where: {
                user_id: id
            },
            data: {
                user_pw: randomPw
            }
        }) : null

        // 아이디 조회 성공 시 메일 보내기
        const transporter = exists ? nodemailer.createTransport({
            host: 'smtp.daum.net',
            post: 465,
            secure: true, // 465 포트일 때 true, 아니면 false
            auth: {
                user: process.env.EMAIL_ID, // 다음 스마트워크 메일 계정
                pass: process.env.EMAIL_PASSWORD, // 다음 스마트워크 메일 비밀번호
            }
        }) : null;

        // transporter에 정의된 계정 정보를 사용해 이메일 전송
        user === null ? null : ( transporter === null ? null
            : await transporter.sendMail({
                from: '"폰트 아카이브" <taedonn@taedonn.com>',
                to: user.user_id,
                subject: '[폰트 아카이브] 임시 비밀번호가 발급되었습니다.',
                html: `
                    <div style="width:100%; display:flex; flex-direction:column; justify-content:flex-start; align-items:center;">
                        <div style="width:100%; max-width:600px; padding:40px 20px; border:1px solid #EEE; font-family:'Roboto', 'Noto Sans KR'; font-size:16px; font-weight:400; line-height:1.25; color:#000; display:flex; flex-direction:column; justify-content:flex-start; align-items:center;">
                            <div style="width:100%; max-width:400px; display:flex; flex-direction:column; justify-content:flex-start; align-items:center;">
                                <div style="width:32px; height:32px; background-color:#000; color:#FFF; font-size:12px; font-weight:400; line-height:1; border-radius:6px; display:flex; flex-direction:row; justify-content:center; align-items:center;">Aa</div>
                                <h2 style="font-size:20px; font-weight:500; margin:0; margin-top:20px;">
                                    임시 비밀번호가 발급되었습니다.
                                </h2>
                                <p style="width:100%; font-size:14px; font-weight:400; line-height:2; color:#3A3A3A; margin:0; margin-top:48px;">
                                    안녕하세요 ${user.user_name}님, <br/>
                                    이제 아래 <span style="font-weight:500; color:#000;">임시 비밀번호를 통해</span> 로그인 하실 수 있습니다.
                                </p>
                                <div style="width:100%; padding:16px 20px; margin-top:28px; box-sizing:border-box; background-color:#EEE; font-size:12px; font-weight:500; color:#3A3A3A; text-decoration:none; border-radius:6px; display:flex; flex-direction:row; justify-content:flex-start; align-items:center;">
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
            })
        )

        return res.status(200).send({ exists: exists }, );
    }
}