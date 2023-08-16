import prisma from '@/libs/client-prisma';
  
export async function CheckIfSessionExists(session: string) {
    const exists: any = !!await prisma.fontsUser.findFirst({
        select: { user_session_id: true },
        where: { user_session_id: session }
    });

    return exists;
}