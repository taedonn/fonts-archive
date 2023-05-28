// 훅
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { debounce } from "lodash";

export default function SideMenu({fonts}:{fonts:any}) {
    /** 펼치기 버튼 클릭 */
    const expandChk = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            document.body.classList.add("shrink");
            document.body.classList.remove("expand");
        }
        else {
            document.body.classList.remove("shrink");
            document.body.classList.remove("shrink");
            document.body.classList.add("expand");
        }
    }

    /** lodash/debounce 적용한 서치 훅 */
    const [filter, setFilter] = useState(fonts.length);
    const searchChange = (e:ChangeEvent<HTMLInputElement>) => { debouncedSearchChange(e); }

    /** lodash/debounce 적용한 서치 기능 */
    const debouncedSearchChange = debounce((e) => {
        let fontList:any = document.getElementsByClassName('fonts-list');
        let filteredNum:number = 0;
        for (let i = 0; i < fontList.length; i++) {
            if (fontList[i].innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) { fontList[i].style.display = 'none'; }
            else { fontList[i].style.display = 'block'; filteredNum++; }
        }
        setFilter(filteredNum);
    },200);

    return (
        <>
            <div className='side-menu w-[280px] h-[100%] min-h-screen p-[20px] pb-[40px] border-r border-theme-4 fixed z-20 left-0 top-0 overflow-y-scroll scrollbar-hide '>
                <div className='flex flex-col justify-start items-center'>
                    <div className='side-menu-btn w-[36px] h-[36px] border border-transparent rounded-full absolute z-30 right-[12px] top-[12px] bg-theme-2  hover:bg-theme-3'>
                        <input type='checkbox' id='expand_btn' className="hidden" onChange={expandChk}/>
                        <label htmlFor='expand_btn' className="w-[100%] h-[100%] flex flex-row justify-center items-center cursor-pointer">
                            <svg className="w-[18px] h-[18px]  fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                        </label>
                    </div>
                    <Link href="/" className="w-[120px] h-[120px] flex flex-row justify-center items-center rounded-[8px] mb-[20px] bg-theme-3">
                        <svg className="w-[60px] h-[60px] fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                    </Link>
                    <div className='w-[100%] relative'>
                        <input onChange={searchChange} type='text' placeholder='폰트 검색하기' className="w-[100%] text-[14px] font-normal leading-[1] px-[20px] py-[14px] pl-[44px] rounded-full border border-theme-4 bg-theme-2 text-theme-8  hover:bg-theme-3/40 focus:bg-theme-3/40"/>
                        <svg className="w-[16px] h-[16px] absolute left-[16px] top-[50%] translate-y-[-50%] fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                    </div>
                    <div className='w-[100%] mt-[20px]'>
                        <div className="text-[16px] font-medium text-theme-8 px-[5%] py-[6px]">{filter} <span>of</span> {fonts.length}</div>
                    </div>
                    {
                        fonts.map((font:any) => (
                            <Link key={font.code} href={`/DetailPage/${font.code}`} className="fonts-list w-[100%] block text-[14px] text-left text-theme-8 px-[5%] py-[6px] rounded-[8px]  hover:bg-theme-3/60">{font.name}</Link>
                        ))
                    }
                </div>
            </div>
        </>
    );
}