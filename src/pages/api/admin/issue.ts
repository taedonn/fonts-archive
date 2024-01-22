import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
const nodemailer = require('nodemailer');

const limit = 10;

// 페이지 수
export async function FetchIssuesLength(search: string) {
    const issues = await prisma.fontsIssue.findMany({
        select: { issue_id: true },
        where: {
            OR: [
                {issue_title: { contains: search }},
                {issue_content: { contains: search }},
            ]
        },
    });
    const count = Number(issues.length) % limit > 0 ? Math.floor(Number(issues.length)/limit) + 1 : Math.floor(Number(issues.length)/limit);

    return count;
}

// 목록
export async function FetchIssues(page: number, filter: string, search: string) {
    const issues = await prisma.fontsIssue.findMany({
        where: {
            issue_type: filter === "all"
                ? { contains: "" }
                : filter,
            OR: [
                {issue_title: { contains: search }},
                {issue_content: { contains: search }},
            ]
        },
        orderBy: [{issue_closed: "asc"}, {issue_id: "desc"}],
        skip: (Number(page) - 1) * limit,
        take: limit,
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
        if (req.body.action === "issue_id") {
            try {
                const {
                    email,
                    content,
                    reply,
                    issue_id,
                    issue_reply,
                    issue_closed,
                    issue_closed_type,
                } = req.body;

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
                    subject: '[폰트 아카이브] 문의해주신 내용에 대한 답변입니다.',
                    html: `
                        <div style="width: 100%; font-size: 16px; font-weight: 400; line-height: 1.25; color: #000; font-family: 'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">
                            <div style="width: 100%; max-width: 520px; background-color: #FFF; margin: 0 auto; padding: 80px 28px; box-sizing: border-box;">
                                <div style="width: 100%; margin: 0 auto;">
                                    <div style="display: table; height: 24px; margin: 0 auto;">
                                        <span style="display: table-cell; vertical-align: middle;"><img style="height: 18px; margin-right: 8px;" src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/logo.png"/></span>
                                        <span style="display: table-cell; font-size: 16px; font-weight: bold;">폰트 아카이브</div>
                                    </div>
                                    <h2 style="font-size: 20px; font-weight: 500; margin-top: 32px; text-align: center;">
                                        문의해주신 내용에 대한 <span style="color: #000; font-weight: 700;">답변입니다.</span>
                                    </h2>
                                    <p style="text-align: center; margin: 40px 0;">
                                        <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/3d_namaste_sign.png" alt="아이콘" style="width: 140px;"/>
                                    </p>
                                    <p style="width: 320px; font-size: 14px; font-weight: bold; line-height: 2; margin: 0 auto;">
                                        문의 내용
                                    </p>
                                    <pre style="width: 320px; min-height: 120px; white-space: pre-wrap; word-break: break-all; padding: 16px 20px; box-sizing: border-box; margin: 0 auto; margin-top: 8px; box-sizing: border-box; font-size: 14px; background-color: #E9F0FE; border-radius: 6px; font-size: 14px; background-color: #E9F0FE; border-radius: 6px; font-family: 'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">${content}</pre>
                                    <p style="width: 320px; font-size: 14px; font-weight: bold; line-height:2; margin: 0 auto; margin-top: 40px;">
                                        답변
                                    </p>
                                    <pre style="width: 320px; min-height: 120px; white-space: pre-wrap; word-break: break-all; padding: 16px 20px; box-sizing: border-box; margin: 0 auto; margin-top: 8px; box-sizing: border-box; background-color: #E9F0FE; border-radius: 6px; font-size: 14px; background-color: #E9F0FE; border-radius: 6px; font-size: 14px; background-color: #E9F0FE; border-radius: 6px; font-family: 'Roboto', 'Noto Sans KR', '맑은고딕', Malgun Gothic, '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;">${reply}</pre>
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
                    `
                });

                // DB 업데이트
                await prisma.fontsIssue.update({
                    where: { issue_id: Number(issue_id) },
                    data: {
                        issue_reply: issue_reply,
                        issue_closed: issue_closed,
                        issue_closed_type: issue_closed_type,
                        issue_closed_at: new Date(),
                    }
                });

                return res.status(200).json({
                    msg: "이메일 보내고 DB 업데이트 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "이메일 보내고 DB 업데이트 실패",
                    err: err
                });
            }
        } else if (req.body.action === "issue_saved") {
            try {
                const { issue_id, issue_reply } = req.body;

                await prisma.fontsIssue.update({
                    where: { issue_id: Number(issue_id) },
                    data: {
                        issue_reply: issue_reply,
                        issue_closed_at: new Date,
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