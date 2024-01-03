import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

const limit = 10;

// SSR 공지 목록 페이지 수
export async function FetchNoticesLength() {
    const notices = await prisma.fontsNotice.findMany({
        select: { notice_id: true },
    });
    const count = Number(notices.length) % limit > 0 ? Math.floor(Number(notices.length)/limit) + 1 : Math.floor(Number(notices.length)/limit);

    return count;
}

// SSR 첫 공지 목록 불러오기
export async function FetchNotices(lastId: number | undefined) {
    const list = await prisma.fontsNotice.findMany({
        orderBy: [{notice_id: 'desc'}], // 정렬순
        take: limit, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {notice_id: lastId} })
    });

    return list;
}

// 특정 공지 불러오기
export async function FetchNotice(noticeId: number) {
    const notice = await prisma.fontsNotice.findUnique({
        where: { notice_id: Number(noticeId) }
    });

    return notice;
}

// 공지 전체 불러오기
export async function FetchAllNotices() {
    const notices = await prisma.fontsNotice.findMany({
        where: { notice_show_type: true },
        orderBy: { notice_id: "desc" },
        cacheStrategy: {
            ttl: 30,
            swr: 60,
        },
    });

    return notices;
}

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        if (req.body.action === "add") {
            try {
                await prisma.fontsNotice.create({
                    data: {
                        notice_type: req.body.notice_type,
                        notice_title: req.body.notice_title,
                        notice_content: req.body.notice_content,
                    }
                });

                return res.status(200).json({
                    msg: "공지 추가 성공",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "공지 추가 실패",
                    err: err
                });
            }
        } else if (req.body.action === "edit") {
            try {
                await prisma.fontsNotice.update({
                    where: { notice_id: Number(req.body.id) },
                    data: {
                        notice_show_type: req.body.show_type,
                        notice_created_at: req.body.created_date,
                        notice_updated_at: req.body.updated_date,
                        notice_title: req.body.title,
                        notice_content: req.body.content,
                    }
                });

                return res.status(200).json({
                    msg: "공지 수정 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "공지 수정 실패",
                    err: err,
                });
            }
        }
    } else if (req.method === "GET") {
        if (req.query.action === "list") {
            try {
                const filter = req.query.filter as string;

                const text = [
                    {notice_title: {contains: req.query.text as string}},
                    {notice_content: {contains: req.query.text as string}},
                ]

                // 공지 목록 페이지 수
                const length = await prisma.fontsNotice.findMany({
                    select: { notice_id: true },
                    where: {
                        OR: text,
                        notice_type: filter === "all" ? {} : filter,
                    }
                });
                const count = Number(length.length) % limit > 0 ? Math.floor(Number(length.length)/limit) + 1 : Math.floor(Number(length.length)/limit);

                // 공지 목록 불러오기
                const list = await prisma.fontsNotice.findMany({
                    where: {
                        OR: text,
                        notice_type: filter === "all" ? {} : filter,
                    },
                    orderBy: [{notice_id: 'desc'}],
                    take: limit, // 가져오는 데이터 수
                    skip: Number(req.query.page) === 1 ? 0 : (Number(req.query.page) - 1) * limit
                });

                return res.status(200).json({
                    message: "공지 목록 불러오기 성공",
                    list: list,
                    count: count
                });
            } catch (err) {
                return res.status(500).json({
                    message: "공지 목록 불러오기 실패",
                    err: err
                });
            }
        } else if (req.query.action === "search") {
            try {
                const notices = await prisma.fontsNotice.findMany({
                    where: {
                        OR: [
                            { notice_title: {contains: req.query.text as string} },
                            { notice_content: {contains: req.query.text as string} },
                        ]
                    },
                    orderBy: { notice_id: "desc" }
                });

                return res.status(200).json({
                    msg: "공지 찾기 성공",
                    notices: notices,
                })
            } catch (err) {
                return res.status(500).json({
                    msg: '공지 찾기 실패',
                    err: err,
                })
            }
        }
    }
}