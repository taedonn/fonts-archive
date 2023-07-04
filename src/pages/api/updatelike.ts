import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const code: string = req.query.code === undefined || req.query.code === '' ? '' : req.query.code as string;
        const checked: boolean =  req.query.checked === 'true' ? true : false;

        await client.fonts.update({
            where: { code: Number(code) },
            data: { like: checked ? { increment: 1 } : { decrement: 1 } }
        });

        return res.send(checked);
    }
}

// model fonts {
//     code            Int    @id @default(autoincrement())
//     name            String
//     lang            String
//     date            String
//     view            Int
//     like            Int
//     font_family     String
//     font_type       String
//     font_weight     String
//     source          String
//     source_link     String
//     github_link     String
//     cdn_css         String
//     cdn_link        String
//     cdn_import      String
//     cdn_font_face   String @db.Text
//     cdn_url         String
//     license_print   String
//     license_web     String
//     license_video   String
//     license_package String
//     license_embed   String
//     license_bici    String
//     license_ofl     String
//     license_purpose String
//     license_source  String
//     license         String @db.Text
//     liked_user      fontsLiked[]
//   }
  
//   model fontsUser {
//     user_no            Int     @id @default(autoincrement())
//     user_name          String
//     user_id            String  @unique
//     user_pw            String
//     user_session_id    String
//     user_email_token   String
//     user_email_confirm Boolean
//     liked_fonts        fontsLiked[]
//   }
  
//   model fontsLiked {
//     font    fonts     @relation(fields: [font_id], references: [code])
//     font_id Int 
//     user    fontsUser @relation(fields: [user_id], references: [user_no])
//     user_id Int
  
//     @@id([font_id, user_id])
//     @@index([font_id])
//     @@index([user_id])
//   }