import prisma from '@/libs/client-prisma';
  
export async function FetchNumberOfLikes(font_id: string) {
    const like: any = await prisma.fontsLiked.findMany({
        where: { font_id: Number(font_id) }
    });

    return like === undefined ? null : like;
}