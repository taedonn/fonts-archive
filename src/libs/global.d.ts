declare global {
    interface Comments {
        font_id: number
        user_id: number
        comment: string
        depth: number
        bundle_id: number
        bundle_order: number
        reported_politics: number
        reported_swearing: number
        reported_etc: number
        is_deleted: true
        created_at: Date
        updated_at: Date
        comment_id: number
        deleted_at: Date
        is_deleted_with_reply: boolean
        is_deleted_by_reports: boolean
    }
}