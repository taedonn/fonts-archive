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

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
}