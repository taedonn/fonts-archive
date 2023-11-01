import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

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
        }
    }
}