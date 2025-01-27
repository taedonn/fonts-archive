// next
import { useRouter } from "next/router";

// react
import { useEffect, useRef } from "react";

// components
import Button from "@/components/button";

// common
import { onMouseDown, onMouseOut, onMouseUp } from "@/libs/common";

const defaultDeleteCommentModal = {
  admin: false,
};

interface DeleteCommentModal {
  display: boolean;
  close: () => void;
  font_id: number;
  comment_id: number;
  bundle_id: number;
  admin?: boolean;
}

export default function DeleteCommentModal({
  display,
  close,
  font_id,
  comment_id,
  bundle_id,
  admin = defaultDeleteCommentModal.admin,
}: DeleteCommentModal) {
  // refs
  const thisModal = useRef<HTMLDivElement>(null);

  // router
  const router = useRouter();

  // 모달창 외 영역 클릭 시 모달창 닫기
  useEffect(() => {
    function handleSearchOutside(e: Event) {
      if (thisModal?.current && !thisModal.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mouseup", handleSearchOutside);
    return () => document.removeEventListener("mouseup", handleSearchOutside);
  }, [close, thisModal]);

  // ESC키 입력 시 모달창 닫기 & Enter키 입력 시 댓글 삭제
  useEffect(() => {
    const keys: any = [];
    const handleKeydown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (display === true && keys["Escape"]) {
        close();
      }
      if (display === true && keys["Enter"]) {
        deleteComment();
      }
    };
    const handleKeyup = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeydown, false);
    window.addEventListener("keyup", handleKeyup, false);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    };
  });

  /** 댓글 삭제 */
  const deleteComment = async () => {
    if (admin) {
      const adminUrl = "/api/post/comments";
      const adminOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-comment-by-admin",
          font_id: font_id,
          comment_id: comment_id,
          bundle_id: bundle_id,
        }),
      };

      await fetch(adminUrl, adminOptions)
        .then((res) => res.json())
        .then(async (data) => {
          router.reload();
          console.log(data.msg);
        })
        .catch((err) => console.log(err));
    } else {
      const url = "/api/post/comments";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-comment",
          font_id: font_id,
          comment_id: comment_id,
          bundle_id: bundle_id,
        }),
      };

      await fetch(url, options)
        .then((res) => res.json())
        .then(async (data) => {
          router.reload();
          console.log(data.msg);
        })
        .catch((err) => console.log(err));
    }

    // 모달창 닫기
    close();
  };

  // 팝업 보일 시 스크롤 막기
  useEffect(() => {
    const body = document.body;
    if (display) body.style.overflow = "hidden";
    else body.style.overflow = "auto";
  }, [display]);

  return (
    <>
      {display && (
        <div className="w-full h-full fixed left-0 top-0 z-40 pt-16 lg:pt-24 tlg:px-4 flex flex-col items-center backdrop-blur text-l-2 dark:text-white">
          <div
            ref={thisModal}
            className="w-full sm:w-96 p-6 relative rounded-lg animate-zoom-in drop-shadow-default dark:drop-shadow-dark bg-l-e dark:bg-d-3"
          >
            <div className="w-full flex flex-col">
              <div className="font-medium">댓글 삭제</div>
              <button
                onClick={close}
                onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className="w-8 h-8 absolute right-3 top-3 rounded-full text-l-2 dark:text-white hover:bg-l-d hover:dark:bg-d-6"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="w-full mt-5 px-5 py-4 rounded-lg bg-l-d dark:bg-d-4">
                <h2 className="font-medium mb-2">댓글을 삭제하시겠습니까?</h2>
                <div className="w-full text-sm flex gap-1.5 items-center text-l-5 dark:text-d-c">
                  <div className="w-1 h-1 rounded-full bg-l-5 dark:bg-d-c"></div>
                  <div>삭제된 댓글은 복구되지 않습니다.</div>
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <div className="w-1/2">
                  <Button color="gray">
                    <button onClick={close} className="w-full h-full">
                      취소
                    </button>
                  </Button>
                </div>
                <div className="w-1/2">
                  <Button>
                    <button onClick={deleteComment} className="w-full h-full">
                      확인
                    </button>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
