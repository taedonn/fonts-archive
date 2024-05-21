-- CreateTable
CREATE TABLE "fonts" (
    "code" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "view" INTEGER NOT NULL DEFAULT 0,
    "font_family" TEXT NOT NULL,
    "font_type" TEXT NOT NULL,
    "font_weight" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "source_link" TEXT NOT NULL,
    "github_link" TEXT NOT NULL,
    "cdn_css" TEXT NOT NULL,
    "cdn_link" TEXT NOT NULL,
    "cdn_import" TEXT NOT NULL,
    "cdn_font_face" TEXT NOT NULL,
    "cdn_url" TEXT NOT NULL,
    "license_print" TEXT NOT NULL,
    "license_web" TEXT NOT NULL,
    "license_video" TEXT NOT NULL,
    "license_package" TEXT NOT NULL,
    "license_embed" TEXT NOT NULL,
    "license_bici" TEXT NOT NULL,
    "license_ofl" TEXT NOT NULL,
    "license_purpose" TEXT NOT NULL,
    "license_source" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "like" INTEGER NOT NULL DEFAULT 0,
    "show_type" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fonts_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "fontsUser" (
    "user_no" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_pw" TEXT NOT NULL,
    "user_email_token" TEXT NOT NULL,
    "user_email_confirm" BOOLEAN NOT NULL,
    "auth" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nickname_reported" INTEGER NOT NULL DEFAULT 0,
    "profile_img" TEXT NOT NULL,
    "protected" BOOLEAN NOT NULL DEFAULT true,
    "public_img" TEXT NOT NULL DEFAULT '',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fontsUser_pkey" PRIMARY KEY ("user_no")
);

-- CreateTable
CREATE TABLE "fontsLiked" (
    "font_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_email" TEXT NOT NULL DEFAULT '',
    "user_auth" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "fontsLiked_pkey" PRIMARY KEY ("font_id","user_id")
);

-- CreateTable
CREATE TABLE "fontsComment" (
    "font_id" INTEGER NOT NULL,
    "font_name" TEXT NOT NULL DEFAULT '',
    "font_family" TEXT NOT NULL DEFAULT '',
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL DEFAULT '',
    "user_email" TEXT NOT NULL DEFAULT '',
    "user_auth" TEXT NOT NULL DEFAULT '',
    "user_image" TEXT NOT NULL DEFAULT '',
    "user_privacy" BOOLEAN NOT NULL DEFAULT true,
    "comment" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "bundle_id" INTEGER NOT NULL,
    "bundle_order" INTEGER NOT NULL,
    "reported_politics" INTEGER NOT NULL DEFAULT 0,
    "reported_swearing" INTEGER NOT NULL DEFAULT 0,
    "reported_etc" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "comment_id" SERIAL NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted_with_reply" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted_by_reports" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "fontsComment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "fontsUserReport" (
    "report_id" SERIAL NOT NULL,
    "report_font_code" INTEGER NOT NULL DEFAULT 0,
    "report_user_id" INTEGER NOT NULL,
    "reported_user_id" INTEGER NOT NULL DEFAULT 0,
    "comment_id" INTEGER NOT NULL,
    "report_nickname" BOOLEAN NOT NULL DEFAULT false,
    "report_politics" BOOLEAN NOT NULL DEFAULT false,
    "report_swearing" BOOLEAN NOT NULL DEFAULT false,
    "report_etc" BOOLEAN NOT NULL DEFAULT false,
    "report_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fontsUserReport_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "fontsIssue" (
    "issue_id" SERIAL NOT NULL,
    "issue_title" TEXT NOT NULL,
    "issue_email" TEXT NOT NULL,
    "issue_content" TEXT NOT NULL,
    "issue_reply" TEXT NOT NULL,
    "issue_type" TEXT NOT NULL DEFAULT '',
    "issue_img_length" INTEGER NOT NULL DEFAULT 0,
    "issue_img_1" TEXT NOT NULL,
    "issue_img_2" TEXT NOT NULL,
    "issue_img_3" TEXT NOT NULL,
    "issue_img_4" TEXT NOT NULL,
    "issue_img_5" TEXT NOT NULL,
    "issue_closed" BOOLEAN NOT NULL DEFAULT false,
    "issue_closed_type" TEXT NOT NULL,
    "issue_closed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issue_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fontsIssue_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "fontsNotice" (
    "notice_id" SERIAL NOT NULL,
    "notice_type" TEXT NOT NULL,
    "notice_title" TEXT NOT NULL,
    "notice_content" TEXT NOT NULL,
    "notice_show_type" BOOLEAN NOT NULL DEFAULT false,
    "notice_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notice_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fontsNotice_pkey" PRIMARY KEY ("notice_id")
);

-- CreateTable
CREATE TABLE "fontsAlert" (
    "alert_id" SERIAL NOT NULL,
    "alert_type" TEXT NOT NULL DEFAULT '',
    "alert_read" BOOLEAN NOT NULL DEFAULT false,
    "alert_page" TEXT NOT NULL DEFAULT '',
    "alert_link" TEXT NOT NULL DEFAULT '',
    "sender_name" TEXT NOT NULL DEFAULT '',
    "sender_img" TEXT NOT NULL DEFAULT '',
    "sender_content" TEXT NOT NULL DEFAULT '',
    "recipent_email" TEXT NOT NULL DEFAULT '',
    "recipent_auth" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment_id" INTEGER NOT NULL,
    "user_no" INTEGER NOT NULL,

    CONSTRAINT "fontsAlert_pkey" PRIMARY KEY ("alert_id")
);

-- CreateIndex
CREATE INDEX "fonts_code_idx" ON "fonts"("code");

-- CreateIndex
CREATE INDEX "fontsUser_user_no_idx" ON "fontsUser"("user_no");

-- CreateIndex
CREATE INDEX "fontsUser_user_id_idx" ON "fontsUser"("user_id");

-- CreateIndex
CREATE INDEX "fontsLiked_font_id_idx" ON "fontsLiked"("font_id");

-- CreateIndex
CREATE INDEX "fontsLiked_user_id_idx" ON "fontsLiked"("user_id");

-- CreateIndex
CREATE INDEX "fontsComment_font_id_idx" ON "fontsComment"("font_id");

-- CreateIndex
CREATE INDEX "fontsComment_user_id_idx" ON "fontsComment"("user_id");

-- CreateIndex
CREATE INDEX "fontsComment_comment_id_idx" ON "fontsComment"("comment_id");

-- CreateIndex
CREATE INDEX "fontsUserReport_report_id_idx" ON "fontsUserReport"("report_id");

-- CreateIndex
CREATE INDEX "fontsUserReport_report_user_id_idx" ON "fontsUserReport"("report_user_id");

-- CreateIndex
CREATE INDEX "fontsUserReport_comment_id_idx" ON "fontsUserReport"("comment_id");

-- CreateIndex
CREATE INDEX "fontsIssue_issue_id_idx" ON "fontsIssue"("issue_id");

-- CreateIndex
CREATE INDEX "fontsNotice_notice_id_idx" ON "fontsNotice"("notice_id");

-- CreateIndex
CREATE INDEX "fontsAlert_alert_id_idx" ON "fontsAlert"("alert_id");

-- CreateIndex
CREATE INDEX "fontsAlert_comment_id_idx" ON "fontsAlert"("comment_id");

-- CreateIndex
CREATE INDEX "fontsAlert_user_no_idx" ON "fontsAlert"("user_no");
