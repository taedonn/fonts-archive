import client from '@/libs/client';
  
export async function FetchUserInfo(session: string) {
    const user: any = await client.fontsUser.findFirst({
        select: {
            user_name: true,
            user_session_id: true
        },
        where: {
            user_session_id: session
        }
    });

    return user;
}