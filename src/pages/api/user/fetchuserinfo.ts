import client from '@/libs/client';
  
export async function FetchUserInfo(session: string) {
    const user: any = await client.fontsUser.findFirst({
        where: { user_session_id: session }
    });

    return user;
}