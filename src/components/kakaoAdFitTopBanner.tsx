import React, { useEffect, useRef } from 'react';

function KakaoAdFitTopBanner() {
    // 최초 1회만 광고를 불러오기 위한 변수
    const adRef = useRef<boolean>(false);

    useEffect(() => {
        // 로딩된 광고가 있으면, 추가 로딩 X
        if (adRef.current) return;

        const ins = document.createElement('ins');
        const script = document.createElement('script');

        ins.className = 'kakao_ad_area';
        ins.style.display = 'none;';
        ins.setAttribute('data-ad-width', '320');
        ins.setAttribute('data-ad-height', '100');
        ins.setAttribute('data-ad-unit', 'DAN-S69UuSbs9M89VlPg');

        script.async = true;
        script.type = 'text/javascript';
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

        document.querySelector('.aside__kakaoAdFit_top')?.appendChild(ins);
        document.querySelector('.aside__kakaoAdFit_top')?.appendChild(script);
        
        // 광고 로딩 여부 상태 변경
        adRef.current = true;
    }, []);

    return (
        <aside className="aside__kakaoAdFit_top flex w-[100%] h-[100px] relative">
            <div className='w-[100%] h-[100%] absolute left-0 top-0 flex justify-center items-center border border-theme-7 dark:border-theme-5'>
                <svg className='w-[40px] fill-theme-7 dark:fill-theme-5' xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="m3.7 11 .47-1.542h2.004L6.644 11h1.261L5.901 5.001H4.513L2.5 11zm1.503-4.852.734 2.426H4.416l.734-2.426zm4.759.128c-1.059 0-1.753.765-1.753 2.043v.695c0 1.279.685 2.043 1.74 2.043.677 0 1.222-.33 1.367-.804h.057V11h1.138V4.685h-1.16v2.36h-.053c-.18-.475-.68-.77-1.336-.77zm.387.923c.58 0 1.002.44 1.002 1.138v.602c0 .76-.396 1.2-.984 1.2-.598 0-.972-.449-.972-1.248v-.453c0-.795.37-1.24.954-1.24z"/>
                    <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                </svg>
            </div>
        </aside>
    );
}

export default React.memo(KakaoAdFitTopBanner);