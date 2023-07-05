import client from '@/libs/client';
  
export async function FetchUserLike(session: string) {
    const user: any = await client.fontsUser.findFirst({
        where: { user_session_id: session }
    });

    const like: any = await client.fontsLiked.findMany({
        where: { user_id: user.user_no }
    });

    return like === undefined ? null : like;
}