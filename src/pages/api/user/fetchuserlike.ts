import prisma from '@/libs/client-prisma';
  
export async function FetchUserLike(session: string) {
    const user: any = await prisma.fontsUser.findFirst({
        where: { user_session_id: session }
    });

    const like: any = await prisma.fontsLiked.findMany({
        where: { user_id: user.user_no }
    });

    return like === undefined ? null : like;
}