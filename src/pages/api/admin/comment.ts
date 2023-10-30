import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

const limit = 10;

// SSR 댓글 목록 페이지 수
export async function FetchCommentsLength() {
    const comments = await prisma.fontsComment.findMany({
        select: { comment_id: true },
        where: {
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false,
        },
    });
    const count = Number(comments.length) % limit > 0 ? Math.floor(Number(comments.length)/limit) + 1 : Math.floor(Number(comments.length)/limit);

    return count;
}

// SSR 첫 댓글 목록 불러오기
export async function FetchComments(lastId: number | undefined) {
    const comments = await prisma.fontsComment.findMany({
        where: {
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false,
        },
        orderBy: [{comment_id: 'desc'}], // 정렬순
        take: limit, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {comment_id: lastId} })
    });

    /*
        폰트 정보
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

    // 폰트 정보 불러오기
    const fonts = await prisma.fonts.findMany({
        select: {
            code: true,
            name: true,
            font_family: true,
        },
        where: { OR: commentsArr }
    });

    // 폰트 정보 배열에 저장
    for (let i = 0; i < comments.length; i++) {
        for (let o = 0; o < fonts.length; o++) {
            if (comments[i].font_id === fonts[o].code) { Object.assign(comments[i], fonts[o]) }
        }
    }

    /*
        유저 정보
    */

    // 중복 체크
    const usersNoRepeat = comments.reduce((acc: any, current: any) => {
        const x = acc.find((item: any) => item.user_id === current.user_id);
        if (!x) { return acc.concat([current]); }
        else { return acc; }
    }, []);

    // 중복 체크 후 배열에 저장
    let usersArr: any = [];
    for (let i = 0; i < usersNoRepeat.length; i++) {
        usersArr.push({user_no: usersNoRepeat[i].user_id});
    }

    // 유저 정보 불러오기
    const users = await prisma.fontsUser.findMany({
        select: {
            user_no: true,
            user_name: true,
        },
        where: { OR: usersArr }
    });

    // 유저 정보 배열에 저장
    for (let i = 0; i < comments.length; i++) {
        for (let o = 0; o < users.length; o++) {
            if (comments[i].user_id === users[o].user_no) { Object.assign(comments[i], users[o]) }
        }
    }

    return comments;
}

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query.action === "list") {
            try {
                // text에 폰트 이름이 포함되어 있는지 체크
                const textWithFonts = req.query.text !== ''
                ? req.query.filter === 'all' || req.query.filter === 'font'
                    ? await prisma.fonts.findMany({
                        select: {
                            code: true,
                            name: true,
                            font_family: true,
                        },
                        where: { name: {contains: req.query.text as string} }
                    }) 
                    : []
                : [];

                // text에 유저 이름이 포함되어 있는지 체크
                const textWithUsers = req.query.text !== '' 
                ? req.query.filter ==='all' || req.query.filter === 'user'
                    ? await prisma.fontsUser.findMany({
                        select: {
                            user_no: true,
                            user_name: true,
                        },
                        where: { user_name: {contains: req.query.text as string} }
                    }) 
                    : []
                : [];

                // 폰트/유저 이름 배열에 저장
                let textArr: any = [];
                if (req.query.filter === 'font') { // 필터링: 폰트 선택 시
                    if (textWithFonts.length > 0) { for (let i = 0; i < textWithFonts.length; i++) { textArr.push({font_id: textWithFonts[i].code}); } }
                }
                else if (req.query.filter === 'user') { // 필터링: 작성자 선택 시
                    if (textWithUsers.length > 0) { for (let i = 0; i < textWithUsers.length; i++) { textArr.push({user_id: textWithUsers[i].user_no}); } }
                }
                else if (req.query.filter === 'comment') { // 필터링: 댓글 선택 시
                    textArr.push({comment: {contains: req.query.text as string}});
                } else { // 필터링: 전체 선택 시
                    if (textWithFonts.length > 0) { for (let i = 0; i < textWithFonts.length; i++) { textArr.push({font_id: textWithFonts[i].code}); } }
                    if (textWithUsers.length > 0) { for (let i = 0; i < textWithUsers.length; i++) { textArr.push({user_id: textWithUsers[i].user_no}); } }
                    textArr.push({comment: {contains: req.query.text as string}});
                }

                // 댓글 페이지 수 가져오기
                const length = await prisma.fontsComment.findMany({
                    where: {
                        is_deleted: false,
                        is_deleted_with_reply: false,
                        is_deleted_by_reports: false,
                        OR: textArr
                    }
                });
                const count = Number(length.length) % limit > 0 ? Math.floor(Number(length.length)/limit) + 1 : Math.floor(Number(length.length)/limit);

                // 댓글 가져오기
                const comments = await prisma.fontsComment.findMany({
                    where: {
                        is_deleted: false,
                        is_deleted_with_reply: false,
                        is_deleted_by_reports: false,
                        OR: textArr
                    },
                    orderBy: [{created_at: 'desc'}, {comment_id: 'desc'}], // 정렬순
                    take: 10, // 가져오는 데이터 수
                    skip: Number(req.query.page) === 1 ? 0 : (Number(req.query.page) - 1) * 10
                });

                /*
                    폰트 정보
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

                // 폰트 정보 불러오기
                const fonts = await prisma.fonts.findMany({
                    select: {
                        code: true,
                        name: true,
                        font_family: true,
                    },
                    where: { OR: commentsArr }
                });

                // 폰트 정보 배열에 저장
                for (let i = 0; i < comments.length; i++) {
                    for (let o = 0; o < fonts.length; o++) {
                        if (comments[i].font_id === fonts[o].code) { Object.assign(comments[i], fonts[o]) }
                    }
                }

                /*
                    유저 정보
                */

                // 중복 체크
                const usersNoRepeat = comments.reduce((acc: any, current: any) => {
                    const x = acc.find((item: any) => item.user_id === current.user_id);
                    if (!x) { return acc.concat([current]); }
                    else { return acc; }
                }, []);

                // 중복 체크 후 배열에 저장
                let usersArr: any = [];
                for (let i = 0; i < usersNoRepeat.length; i++) {
                    usersArr.push({user_no: usersNoRepeat[i].user_id});
                }

                // 유저 정보 불러오기
                const users = await prisma.fontsUser.findMany({
                    select: {
                        user_no: true,
                        user_name: true,
                    },
                    where: { OR: usersArr }
                });

                // 유저 정보 배열에 저장
                for (let i = 0; i < comments.length; i++) {
                    for (let o = 0; o < users.length; o++) {
                        if (comments[i].user_id === users[o].user_no) { Object.assign(comments[i], users[o]) }
                    }
                }

                return res.status(200).json({
                    message: "댓글 가져오기 성공",
                    comments: comments,
                    count: count,
                    test: textArr,
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