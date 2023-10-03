import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

// SSR 유저 목록 페이지 수
export async function FetchUsersLength() {
    const users = await prisma.fontsUser.findMany({
        select: { user_no: true },
    });

    return users.length;
}

// SSR 첫 유저 목록 가져오기
export async function FetchUsers(lastId: number | undefined) {
    const users = await prisma.fontsUser.findMany({
        orderBy: [{user_no: 'desc'}], // 정렬순
        take: 10, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {user_no: lastId} })
    });

    return users;
}