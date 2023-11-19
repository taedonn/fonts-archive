import prisma from '@/libs/client-prisma';
  
export async function FetchUserLike(user_no: number) {
    const like = await prisma.fontsLiked.findMany({
        where: { user_id: user_no }
    });

    return like;
}