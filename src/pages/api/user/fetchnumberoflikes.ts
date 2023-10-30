import prisma from '@/libs/client-prisma';
  
export async function FetchNumberOfLikes(font_family: string) {
    // 폰트 정보 불러오기
    const font = await prisma.fonts.findMany({
        where: { font_family: font_family }
    });

    const like: any = await prisma.fontsLiked.findMany({
        where: { font_id: font[0].code, }
    });

    return like === undefined ? null : like;
}