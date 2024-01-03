import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

const limit = 10;

// SSR 유저 목록 페이지 수
export async function FetchUsersLength() {
    const users = await prisma.fontsUser.findMany({
        select: { user_no: true },
    });
    const count = Number(users.length) % limit > 0 ? Math.floor(Number(users.length)/limit) + 1 : Math.floor(Number(users.length)/limit);

    return count;
}

// SSR 첫 유저 목록 불러오기
export async function FetchUsers(lastId: number | undefined) {
    const users = await prisma.fontsUser.findMany({
        orderBy: [{user_no: 'desc'}], // 정렬순
        take: limit, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {user_no: lastId} })
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
        if (req.body.action === "list") {
            try {
                const { page, filter, text } = req.body;

                const filters: any = filter === 'email-confirmed'
                ? [{user_email_confirm: true}]
                : [];

                const texts = [
                    {user_name: {contains: text as string}},
                    {user_id: {contains: text as string}},
                ]

                // 유저 목록 페이지 수
                const length = await prisma.fontsUser.findMany({
                    select: { user_no: true },
                    where: {
                        OR: texts,
                        AND: filters,
                    }
                });
                const count = Number(length.length) % limit > 0 ? Math.floor(Number(length.length)/limit) + 1 : Math.floor(Number(length.length)/limit);

                // 유저 목록 불러오기
                const list = await prisma.fontsUser.findMany({
                    where: {
                        OR: texts,
                        AND: filters,
                    },
                    orderBy: filter === 'nickname-reported' ? [{nickname_reported: 'desc'}, {user_no: 'desc'}] : [{user_no: 'desc'}], // 정렬순
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
        }
        else if (req.body.action === "save-user-info") {
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