import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

const limit = 10;

// SSR 댓글 목록 페이지 수
export async function FetchCommentsLength() {
    const comments = await prisma.fontsComment.findMany({
        select: { comment_id: true },
    });
    const count = Number(comments.length) % limit > 0 ? Math.floor(Number(comments.length)/limit) + 1 : Math.floor(Number(comments.length)/limit);

    return count;
}

// SSR 첫 댓글 목록 불러오기
export async function FetchComments(lastId: number | undefined) {
    const comments = await prisma.fontsComment.findMany({
        orderBy: [{comment_id: 'desc'}], // 정렬순
        take: limit, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {comment_id: lastId} })
    });

    return comments;
}

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query.action === "list") {
            try {
                // const filter = req.query.filter === 'all' 
                //        ? [{depth: 0}, {depth: 1}] 
                //        : req.query.filter === 'comment'
                //             ? [{depth: 0}]
                //             : [{depth: 1}];

                // 댓글 페이지 수 가져오기
                const length = await prisma.fontsComment.findMany({
                    where: {
                        is_deleted: false,
                        is_deleted_with_reply: false,
                        is_deleted_by_reports: false,
                        comment: {contains: req.query.text as string},
                        // OR: filter
                    }
                });
                const count = Number(length.length) % 10 > 0 ? Math.floor(Number(length.length)/10) + 1 : Math.floor(Number(length.length)/10);

                // 댓글 가져오기
                const comments = await prisma.fontsComment.findMany({
                    where: {
                        is_deleted: false,
                        is_deleted_with_reply: false,
                        is_deleted_by_reports: false,
                        comment: {contains: req.query.text as string},
                        // OR: filter
                    },
                    orderBy: [{created_at: 'desc'}, {comment_id: 'desc'}], // 정렬순
                    take: 10, // 가져오는 데이터 수
                    skip: Number(req.query.page) === 1 ? 0 : (Number(req.query.page) - 1) * 10
                });

                /* 
                    폰트 정보
                    ------------------------------
                */

                // 중복 체크
                const commentsNoRepeat = comments.reduce((acc: any, current: any) => {
                    const x = acc.find((item: any) => item.font_id === current.font_id);
                    if (!x) { return acc.concat([current]); }
                    else { return acc; }
                }, []);

                // 중복 체크 후 배열에 저장
                let commentsArr: any = [];
                for (let i = 0; i < commentsNoRepeat.length; i++) {
                    commentsArr.push({code: commentsNoRepeat[i].font_id});
                }

                // 배열에 저장된 폰트 ID로 폰트 이름 가져오기
                const fonts = await prisma.fonts.findMany({
                    select: {
                        code: true,
                        name: true
                    },
                    where: { OR: commentsArr }
                });

                // 폰트 이름을 댓글 배열에 저장
                for (let i = 0; i < comments.length; i++) {
                    for (let o = 0; o < fonts.length; o++) {
                        if (comments[i].font_id === fonts[o].code) { Object.assign(comments[i], fonts[o]) }
                    }
                }

                /* 
                    유저 정보
                    ------------------------------
                */

                // 중복 체크
                const userNameNoRepeat = comments.reduce((acc: any, current: any) => {
                    const x = acc.find((item: any) => item.user_id === current.user_id);
                    if (!x) { return acc.concat([current]); }
                    else { return acc; }
                }, []);

                // 중복 체크 후 배열에 저장
                let userNameArr: any = [];
                for (let i = 0; i < userNameNoRepeat.length; i++) {
                    userNameArr.push({code: userNameNoRepeat[i].font_id});
                }

                // 배열에 저장된 유저 번호로 유저 이름 가져오기
                const users = await prisma.fontsUser.findMany({
                    select: {
                        user_no: true,
                        user_name: true
                    },
                    where: { OR: userNameArr }
                });

                // 유저 이름을 댓글 배열에 저장
                for (let i = 0; i < comments.length; i++) {
                    for (let o = 0; o < users.length; o++) {
                        if (comments[i].user_id === users[o].user_no) { Object.assign(comments[i], fonts[o]) }
                    }
                }

                return res.status(200).json({
                    message: "댓글 가져오기 성공",
                    comments: comments,
                    count: count
                });
            } catch (err) {
                res.status(500).json({
                    message: "댓글 가져오기 실패",
                    err: err
                });
            }
        }
    }
}