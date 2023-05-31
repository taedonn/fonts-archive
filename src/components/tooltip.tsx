export default function Tooltip() {
    // 깃허브 저장소 바로가기 클릭 이벤트
    const goGitHub = () => { window.open('https://github.com/taedonn/fonts-archive','_blank'); }

    // 맨 위로 버튼 클릭 이벤트
    const goUp = () => { window.scrollTo({top:0,behavior:'smooth'}); }

    return (
        <>
            <div className="fixed z-10 right-[16px] bottom-[16px] flex flex-col justify-start items-start">
                <div onClick={goUp} className="w-[40px] h-[40px] rounded-full relative flex flex-row justify-center items-center mt-[8px] tlg:mt-[6px] cursor-pointer dark:bg-theme-1 drop-default-tooltip">
                    <svg className="w-[18px] fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>
                </div>
            </div>
        </>
    )
}