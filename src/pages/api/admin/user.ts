import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

const limit = 1;

// 페이지 수
export async function FetchUsersLength(page: number, search: string) {
    const users = await prisma.fontsUser.findMany({
        select: { user_no: true },
        where: {
            OR: [
                {user_id: { contains: search }},
                {user_name: { contains: search }},
            ]
        },
    });
    const count = Number(users.length) % limit > 0 ? Math.floor(Number(users.length)/limit) + 1 : Math.floor(Number(users.length)/limit);

    return count;
}

// 목록
export async function FetchUsers(page: number, filter: string, search: string) {
    const users = await prisma.fontsUser.findMany({
        where: {
            OR: [
                {user_id: { contains: search }},
                {user_name: { contains: search }},
            ]
        },
        orderBy: filter === "date"
            ? [{user_no: "desc"}]
            : filter === "name"
                ? [{user_name: "asc"}, {user_id: "desc"}]
                : [{nickname_reported: "desc"}, {user_id: "asc"}],
        skip: (Number(page) - 1) * limit,
        take: limit, // 가져오는 데이터 수
    });

    return users;
}

// 특정 유저 정보 불러오기
export async function FetchUser(userNo: number) {
    const user = await prisma.fontsUser.findUnique({
        where: { user_no: Number(userNo) }
    });

    return user;
}

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        if (req.body.action === "save-user-info") {
            try {
                const {
                    user_no,
                    user_name,
                    user_pw,
                    user_email_confirm,
                    user_email_token,
                    profile_img,
                    nickname_reported,
                } = req.body;

                await prisma.fontsUser.update({
                    where: { user_no: Number(user_no) },
                    data: {
                        profile_img: profile_img,
                        user_name: user_name,
                        nickname_reported: Number(nickname_reported),
                        user_pw: user_pw,
                        user_email_confirm: user_email_confirm,
                        user_email_token: user_email_token,
                    }
                })

                return res.status(200).json({
                    msg: "유저 정보 수정 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "유저 정보 수정 실패",
                    err: err
                });
            }
        }
    }
}