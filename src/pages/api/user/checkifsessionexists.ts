import client from '@/libs/client-prisma';
  
export async function CheckIfSessionExists(session: string) {
    const exists: any = !!await client.fontsUser.findFirst({
        select: { user_session_id: true },
        where: { user_session_id: session }
    });

    return exists;
}