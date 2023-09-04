import prisma from '@/libs/client-prisma';
  
export async function FetchComments(id: string) {
    // 댓글 가져오기
    const comments = await prisma.fontsComment.findMany({
        where: {
            font_id: Number(id),
            is_deleted: false
        },
        orderBy: [
            { bundle_id: 'desc' },
            { bundle_order: 'asc' },
            { comment_id: 'desc' }
        ]
    });

    // 프로필 이미지 가져오기 위해 중복된 ID 필터링
    const userArr = comments.reduce((acc: any, current: any) => {
        const x = acc.find((item: any) => item.user_id === current.user_id);
        if (!x) { return acc.concat([current]); }
        else { return acc; }
    }, []);

    // ID 필터링된 객체를 Prisma에서 사용할 수 있게 변환
    let userIdArr: any[] = [];
    userArr.forEach((user: any) => {
        userIdArr.push({user_no: user.user_id});
    });

    // 변환된 객체로 유저 정보 가져오기
    const users = await prisma.fontsUser.findMany({
        select: {
            user_no: true,
            user_name: true,
            profile_img: true
        },
        where: { OR: userIdArr }
    });

    // 유저의 프로필 이미지와 댓글 합치기
    comments.forEach((comment) => {
        users.forEach((user) => {
            if (user.user_no === comment.user_id) { Object.assign(comment, user); }
        });
    });

    return comments;
}