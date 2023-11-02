import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
const nodemailer = require('nodemailer');

const limit = 10;

// SSR 제보 목록 페이지 수
export async function FetchIssuesLength() {
    const issues = await prisma.fontsIssue.findMany({
        select: { issue_id: true },
    });
    const count = Number(issues.length) % limit > 0 ? Math.floor(Number(issues.length)/limit) + 1 : Math.floor(Number(issues.length)/limit);

    return count;
}

// SSR 첫 제보 목록 불러오기
export async function FetchIssues(lastId: number | undefined) {
    const issues = await prisma.fontsIssue.findMany({
        orderBy: [{issue_id: 'desc'}], // 정렬순
        take: limit, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {issue_id: lastId} })
    });

    return issues;
}

// 특정 제보 정보 불러오기
export async function FetchIssue(issueId: number) {
    const issue = await prisma.fontsIssue.findUnique({
        where: { issue_id: Number(issueId) }
    });

    return issue;
}

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        if (req.body.action === "list") {
            try {
                const filter: any = req.body.filter === 'issue_opened'
                ? [{issue_closed: false}]
                : [];

                const text = [
                    {issue_title: {contains: req.body.text as string}},
                    {issue_email: {contains: req.body.text as string}},
                ]

                // 유저 목록 페이지 수
                const length = await prisma.fontsIssue.findMany({
                    select: { issue_id: true },
                    where: {
                        OR: text,
                        AND: filter,
                    }
                });
                const count = Number(length.length) % limit > 0 ? Math.floor(Number(length.length)/limit) + 1 : Math.floor(Number(length.length)/limit);

                // 유저 목록 불러오기
                const list = await prisma.fontsIssue.findMany({
                    where: {
                        OR: text,
                        AND: filter,
                    },
                    orderBy: [{issue_id: 'desc'}],
                    take: limit, // 가져오는 데이터 수
                    skip: Number(req.body.page) === 1 ? 0 : (Number(req.body.page) - 1) * limit
                });

                return res.status(200).json({
                    message: "유저 목록 불러오기 성공",
                    list: list,
                    count: count
                });
            } catch (err) {
                return res.status(500).json({
                    message: "유저 목록 불러오기 실패",
                    err: err
                });
            }
        } else if (req.body.action === "issue_id") {
            try {
                const email = req.body.email as string;
                const content = req.body.content as string;
                const reply = req.body.reply as string;

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
                    subject: '[폰트 아카이브] 제보해주신 내용에 대한 답변입니다.',
                    html: `
                        <div style="width:100%; font-size:16px; font-weight:400; line-height:1.25; color:#000; font-family:'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                            <div style="width:100%; max-width:520px; background-color:#FFF; margin:0 auto; padding:80px 20px; box-sizing:border-box; font-size:16px; font-weight:400; line-height:1.25; color:#000;">
                                <div style="width:100%; max-width:400px; margin:0 auto;">
                                    <div style="width: 100%; margin: 0 auto;">
                                        <div style="margin: 0 auto; width:24px; height:24px; background-color:#000; color:#FFF; font-size:10px; font-weight:400; text-align:center; line-height:22px; border-radius:4px;">Aa</div>
                                        <div style="margin: 0 auto; margin-top: 16px; font-size: 14px; text-align: center; color: #3A3A3A;">폰트 아카이브</div>
                                    </div>
                                    <h2 style="font-size:20px; font-weight:500; text-align: center; color: #3A3A3A; margin-top:8px;">
                                        제보해주신 내용에 대한 <span style="color: #000; font-weight: 700;">답변입니다.</span>
                                    </h2>
                                    <p style="width:100%; font-size:14px; font-weight:500; line-height:2; color:#3A3A3A; text-decoration:underline; margin:0; margin-top:40px;">
                                        제보
                                    </p>
                                    <div style="width:100%; padding:16px 20px; box-sizing:border-box; margin-top:8px; box-sizing:border-box; background-color:#EEE; font-size:12px; font-weight:500; color:#3A3A3A; text-decoration:none; border-radius:6px;">
                                        ${content}
                                    </div>
                                    <p style="width:100%; font-size:14px; font-weight:500; line-height:2; color:#3A3A3A; text-decoration:underline; margin:0; margin-top:28px;">
                                        답변
                                    </p>
                                    <div style="width:100%; padding:16px 20px; box-sizing:border-box; margin-top:8px; box-sizing:border-box; background-color:#EEE; font-size:12px; font-weight:500; color:#3A3A3A; text-decoration:none; border-radius:6px;">
                                        ${reply}
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
                    msg: "이메일 보내기 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이메일 보내기 실패",
                    err: err
                });
            }
        } else if (req.body.action === "issue_closed") {
            try {
                await prisma.fontsIssue.update({
                    where: { issue_id: Number(req.body.issue_id) },
                    data: {
                        issue_reply: req.body.issue_reply,
                        issue_closed: req.body.issue_closed,
                    }
                });

                return res.status(200).json({
                    msg: "DB 저장 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "DB 저장 실패",
                    err: err
                });
            }
        } else if (req.body.action === "issue_saved") {
            try {
                await prisma.fontsIssue.update({
                    where: { issue_id: Number(req.body.issue_id) },
                    data: {
                        issue_reply: req.body.issue_reply,
                    }
                });

                return res.status(200).json({
                    msg: "DB 저장 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "DB 저장 실패",
                    err: err
                });
            }
        }
    }
}