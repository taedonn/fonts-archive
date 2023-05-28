export default function Tooltip() {
    // 깃허브 저장소 바로가기 클릭 이벤트
    const goGitHub = () => { window.open('https://github.com/taedonn/fonts-archive','_blank'); }

    // 맨 위로 버튼 클릭 이벤트
    const goUp = () => { window.scrollTo({top:0,behavior:'smooth'}); }

    return (
        <>
            <div className="fixed z-10 right-[16px] bottom-[16px] flex flex-col justify-start items-start">
                <div onClick={goGitHub} className="w-[40px] h-[40px] rounded-full relative flex flex-row justify-center items-center cursor-pointer bg-theme-1 drop-shadow-default group">
                    <svg className="w-[18px] fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                    <div className='w-content h-[40px] rounded-[12px] absolute right-[56px] top-[50%] translate-y-[-50%] hidden flex-row justify-center items-center text-[14px] font-medium leading-[1] px-[20px] bg-theme-1 text-theme-8 opacity-0 duration-200 drop-shadow-default before:w-[12px] before:h-[12px] before:absolute before:right-0 before:top-[50%] before:translate-x-[50%] before:translate-y-[-50%] before:bg-theme-1 before:rotate-45 group-hover:flex tlg:group-hover:hidden group-hover:animate-tooltip-fade-in'>깃허브 레포지토리 바로가기</div>
                </div>
                <div onClick={goUp} className="w-[40px] h-[40px] rounded-full relative flex flex-row justify-center items-center mt-[8px] tlg:mt-[6px] cursor-pointer bg-theme-1 drop-default-tooltip">
                    <svg className="w-[18px] fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>
                </div>
            </div>
        </>
    )
}