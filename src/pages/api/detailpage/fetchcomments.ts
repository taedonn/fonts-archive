import prisma from '@/libs/client-prisma';
  
export async function FetchComments(id: string) {
    const comments = await prisma.fontsComment.findMany({
        where: { font_id: Number(id) },
    });

    return comments;
}