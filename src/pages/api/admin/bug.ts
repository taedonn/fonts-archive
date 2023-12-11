import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

const limit = 10;

// SSR 버그 제보 페이지 수
export async function FetchBugsLength() {
    const issues = await prisma.fontsBugReport.findMany({
        select: { issue_id: true },
    });
    const count = Number(issues.length) % limit > 0 ? Math.floor(Number(issues.length)/limit) + 1 : Math.floor(Number(issues.length)/limit);

    return count;
}

// SSR 첫 버그 제보 목록 불러오기
export async function FetchBugs(lastId: number | undefined) {
    const issues = await prisma.fontsBugReport.findMany({
        orderBy: [{issue_id: 'desc'}], // 정렬순
        take: limit, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {issue_id: lastId} })
    });

    return issues;
}

// 특정 버그 정보 불러오기
export async function FetchBug(issueId: number) {
    const issue = await prisma.fontsBugReport.findUnique({
        where: { issue_id: Number(issueId) }
    });

    return issue;
}

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        if (req.body.action === "list") {
            try {
                const { page, filter, text } = req.body;

                const texts = [
                    {issue_title: {contains: text}},
                    {issue_email: {contains: text}},
                ];

                const filters = filter === 'issue_opened'
                ? [{issue_closed: false}]
                : [];

                // 유저 목록 페이지 수
                const length = await prisma.fontsBugReport.findMany({
                    select: { issue_id: true },
                    where: {
                        OR: texts,
                        AND: filters,
                    }
                });
                const count = Number(length.length) % limit > 0 ? Math.floor(Number(length.length)/limit) + 1 : Math.floor(Number(length.length)/limit);

                // 유저 목록 불러오기
                const list = await prisma.fontsBugReport.findMany({
                    where: {
                        OR: texts,
                        AND: filters,
                    },
                    orderBy: [{issue_id: 'desc'}],
                    take: limit, // 가져오는 데이터 수
                    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * limit
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
        } else if (req.body.action === "issue_saved") {
            try {
                const { issue_id, issue_closed, issue_closed_type } = req.body;

                await prisma.fontsBugReport.update({
                    where: { issue_id: Number(issue_id) },
                    data: {
                        issue_closed: issue_closed,
                        issue_closed_type: issue_closed_type,
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