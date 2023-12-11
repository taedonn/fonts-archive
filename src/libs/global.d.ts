export type fonts = {
    code: number
    name: string
    lang: string
    date: string
    view: number
    like: number
    font_family: string
    font_type: string
    font_weight: string
    source: string
    source_link: string
    github_link: string
    cdn_css: string
    cdn_link: string
    cdn_import: string
    cdn_font_face: string
    cdn_url: string
    license_print: string
    license_web: string
    license_video: string
    license_package: string
    license_embed: string
    license_bici: string
    license_ofl: string
    license_purpose: string
    license_source: string
    license: string
    created_at:string
    updated_at:string
    show_type: boolean
}

export type users = {
    user_no: number
    user_name: string
    user_id: string
    user_pw: string
    auth: string
    user_email_token: string
    user_email_confirm: boolean
    refresh_token: string
    profile_img: string
    nickname_reported: number
    created_at:string
    updated_at:string
}

export type likes = {
    font_id: number
    user_id: number
    user_email: string
    user_auth: string
}

export type comments = {
    font_id: number
    font_name: string
    font_family: string
    user_id: number
    user_name: string
    user_email: string
    user_auth: string
    comment: string
    depth: number
    bundle_id: number
    bundle_order: number
    reported_politics: number
    reported_swearing: number
    reported_etc: number
    is_deleted: true
    created_at:string
    updated_at:string
    comment_id: number
    deleted_at:string
    is_deleted_with_reply: boolean
    is_deleted_by_reports: boolean
}

export type reports = {
    report_id: number
    report_font_code: number
    report_user_id: number
    report_user_email: string
    report_user_auth: string
    comment_id: number
    report_nickname: boolean
    report_politics: boolean
    report_swearing: boolean
    report_etc: boolean
    report_text: string
    created_at:string
    updated_at:string
}

export type issues = {
    issue_id: number
    issue_title: string
    issue_email: string
    issue_content: string
    issue_reply: string
    issue_img_length: number
    issue_img_1: string
    issue_img_2: string
    issue_img_3: string
    issue_img_4: string
    issue_img_5: string
    issue_closed: boolean
    issue_closed_type: string
    issue_closed_at:string
    issue_created_at:string
}

export type bugs = {
    issue_id: number
    issue_title: string
    issue_email: string
    issue_content: string
    issue_reply: string
    issue_img_length: number
    issue_img_1: string
    issue_img_2: string
    issue_img_3: string
    issue_img_4: string
    issue_img_5: string
    issue_closed: boolean
    issue_closed_type: string
    issue_closed_at:string
    issue_created_at:string
}

export type notices = {
    notice_id: number
    notice_type: string
    notice_title: string
    notice_content: string
    notice_show_type: boolean
    notice_created_at: string
    notice_updated_at: string
}