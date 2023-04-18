import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import DummyText from "./DummyText";

function FontBox(props) {
    const [num, setNum] = useState(12);

    useEffect(() => {
        // 스크롤 이벤트
        const timer = setInterval(() => {
            window.addEventListener('scroll', () => { handleScroll(); });
            document.addEventListener('touchmove', () => { handleScrollMobile(); })
        },200);
        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', () => { handleScroll(); });
            document.removeEventListener('touchmove', () => { handleScrollMobile(); });
        }
    });

    // 스크롤 이벤트
    const handleScroll = () => {
        if ((window.scrollY + window.innerHeight) >= document.body.offsetHeight) { handleTypeFace(); }
    }

    const handleScrollMobile = () => {
        if ((window.scrollY + window.innerHeight) >= document.body.offsetHeight - (window.innerHeight * 0.1)) { handleTypeFace(); }
    }

    // 데이터 연동
    const handleTypeFace = () => { setNum(num + 12); }

    // 폰트 박스 클릭 시 윈도우 맨위로 이동
    const boxOnClick = () => { window.scrollTo(0,0); }

    return (
        <>
            <div className="font_area_wrap">
                {
                    props.sortby === "latest"
                    ? props.data.sort(function(a,b) { if (a.c[5].v > b.c[5].v) return -1; else if (b.c[5].v > a.c[5].v) return 1; else return 0; }).slice(0,num).map((dataEach) => (
                        <Link className="font_box fade_in" onClick={boxOnClick} to={`/DetailPage/${dataEach.c[0].v}`} key={dataEach.c[0].v}>
                            <div className="font_name" style={{fontFamily:dataEach.c[2].v,fontWeight:props.fontWeight}}>{dataEach.c[1].v}</div>
                            <div className='font_info_wrap'>
                                <div className="font_source" style={{fontFamily:dataEach.c[2].v,fontWeight:props.fontWeight}}><span>by</span> {dataEach.c[4].v}</div>
                            </div>
                            <div className="font_text" style={{fontFamily:dataEach.c[2].v,fontWeight:props.fontWeight}}><DummyText lang={dataEach.c[22].v} text={props.text}/></div>
                            <link href={dataEach.c[12].v} rel="stylesheet" type="text/css" itemProp="url"/>
                        </Link>
                    ))
                    : props.data.sort(function(a,b) { return b.c[1].v.localeCompare(a.c[1].v); }).reverse().slice(0,num).map((dataEach) => (
                        <Link className="font_box fade_in" onClick={boxOnClick} to={`/DetailPage/${dataEach.c[0].v}`} key={dataEach.c[0].v}>
                            <div className="font_name" style={{fontFamily:dataEach.c[2].v,fontWeight:props.fontWeight}}>{dataEach.c[1].v}</div>
                            <div className='font_info_wrap'>
                                <div className="font_source" style={{fontFamily:dataEach.c[2].v,fontWeight:props.fontWeight}}><span>by</span> {dataEach.c[4].v}</div>
                            </div>
                            <div className="font_text" style={{fontFamily:dataEach.c[2].v,fontWeight:props.fontWeight}}><DummyText lang={dataEach.c[22].v} text={props.text}/></div>
                            <link href={dataEach.c[12].v} rel="stylesheet" type="text/css" itemProp="url"/>
                        </Link>
                    ))
                }
                <div className="font_box_empty"></div>
            </div>
        </>
    )
}

export default FontBox;