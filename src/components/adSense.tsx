import React, { useEffect, useRef } from 'react';

const defaultAdSense = {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0
}

interface AdData {
    style: string,
    client: string,
    slot: string
}

interface AdSense {
    pc: AdData,
    mobile: AdData,
    marginTop?: number,
    marginBottom?: number,
    marginLeft?: number,
    marginRight?: number
}

function AdSense({
    pc,
    mobile,
    marginTop=defaultAdSense.marginTop,
    marginBottom=defaultAdSense.marginBottom,
    marginLeft=defaultAdSense.marginLeft,
    marginRight=defaultAdSense.marginRight
}: AdSense) {
    // 최초 1회만 광고를 불러오기 위한 변수
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        const width = window.innerWidth;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.appendChild(document.createTextNode('(adsbygoogle = window.adsbygoogle || []).push({});'));

        if (width < 1024) {
            adRef.current!.setAttribute('style', `margin-top: ${marginTop}rem; margin-bottom: ${marginBottom}rem; margin-left: ${marginLeft}; margin-right: ${marginRight}; ${mobile.style}`);
            adRef.current!.setAttribute('data-ad-client', mobile.client);
            adRef.current!.setAttribute('data-ad-slot', mobile.slot);
        } else {
            adRef.current!.setAttribute('style', `margin-top: ${marginTop}rem; margin-bottom: ${marginBottom}rem; margin-left: ${marginLeft}; margin-right: ${marginRight}; ${pc.style}`);
            adRef.current!.setAttribute('data-ad-client', pc.client);
            adRef.current!.setAttribute('data-ad-slot', pc.slot);
        }
        adRef.current!.append(script);
    }, [pc.style, pc.client, pc.slot, mobile.style, mobile.client, mobile.slot, marginTop, marginBottom, marginLeft, marginRight]);

    return <ins ref={adRef} className='adsbygoogle'></ins>
}

export default React.memo(AdSense);