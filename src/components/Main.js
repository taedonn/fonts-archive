import { useRef, useEffect, useState } from 'react';
import '../css/App.css';
import FontBox from './FontBox';
import SideMenu from './SideMenu';

function Main(props) {
    const defaultList = props.data;
    const [list, setList] = useState(defaultList);
    const [txt, setTxt] = useState("");

    useEffect(() => {
        setList(defaultList);
    },[defaultList]);

    // 셀렉트박스 외 영역 클릭 시 셀렉트박스 클릭 해제
    const searchRef = useRef(null);
    const searchRef2 = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (searchRef.current && !searchRef.current.contains(e.target) && !searchRef2.current.contains(e.target)) {
                document.getElementById('category_1_select').checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside);
        return () => { document.removeEventListener("mouseup", handleOutside); };
    }, [searchRef]);

    const textChange = (e) => {
        setTxt(e.target.value);
        let textArea = document.getElementsByClassName('font_text');
        for (let i = 0; i < textArea.length; i++) { textArea[i].innerText = e.target.value; }
    }

    const fontWeightChange = (e) => {
        let textArea = document.getElementsByClassName('font_box');
        for (let i = 0; i < textArea.length; i++) {
            textArea[i].getElementsByClassName('font_name')[0].style.fontWeight = e.target.value;
            textArea[i].getElementsByClassName('font_source')[0].style.fontWeight = e.target.value;
            textArea[i].getElementsByClassName('font_text')[0].style.fontWeight = e.target.value;
        }
    }

    const typeFaceChange = () => {
        let typeFace = document.getElementsByClassName('handle_type_face');
        let typeFaceChk = [];

        // 어떤 Type Face가 체크되어 있는지 체크
        for (let i = 0; i < typeFace.length; i++) {
            if (typeFace[i].checked) { typeFaceChk.push(typeFace[i].value); }
        }

        // 스크롤 맨 위로
        window.scrollTo(0,0);

        // 데이터 필터링
        filterData(defaultList, typeFaceChk);
    }

    const filterData = (data, checkedValue) => {
        const filteredData = data.filter((item) => checkedValue.includes(item.c[3].v) );
        setList(filteredData);
    }

    const handleChange = (e) => {
        if (e.target.checked) {
            document.getElementsByClassName('category_1_option')[0].classList.add('fade_in');
            setTimeout(function() { document.getElementsByClassName('category_1_option')[0].classList.remove('fade_in'); },600);
        }
    }

    return (
        <>
            <SideMenu data={props.data}/>
            <div className='main_menu'>
                <div className='main_menu_fixed'>
                    <div className='search_bar'>
                        <input type='text' placeholder='원하는 문구를 적어보세요' onChange={textChange}/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/>
                        </svg>
                    </div>
                    <div className='category'>
                        <div className='category_1'>
                            <input type='checkbox' id='category_1_select' onChange={handleChange}/>
                            <label className='category_1_select' ref={searchRef2} htmlFor='category_1_select'>
                                폰트 형태
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                            </label>
                            <div className='category_1_option' ref={searchRef}>
                                <input className='handle_type_face' type='checkbox' id='sansSerif' onChange={typeFaceChange} value='Sans Serif' defaultChecked/>
                                <div className='chk_box'>
                                    <label htmlFor='sansSerif'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>고딕</span>
                                </div>
                                <input className='handle_type_face' type='checkbox' id='serif' onChange={typeFaceChange} value='Serif' defaultChecked/>
                                <div className='chk_box'>
                                    <label htmlFor='serif'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>명조</span>
                                </div>
                                <input className='handle_type_face' type='checkbox' id='handWriting' onChange={typeFaceChange} value='Hand Writing' defaultChecked/>
                                <div className='chk_box'>
                                    <label htmlFor='handWriting'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>손글씨</span>
                                </div>
                                <input className='handle_type_face' type='checkbox' id='display' onChange={typeFaceChange} value='Display' defaultChecked/>
                                <div className='chk_box'>
                                    <label htmlFor='display'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>장식체</span>
                                </div>
                            </div>
                        </div>
                        <div className='divider'></div>
                        <div className='category_2'>
                            <input type='radio' onChange={fontWeightChange} name='fontWeight' id='light' value='300'/>
                            <label htmlFor='light'>Light</label>
                            <input type='radio' onChange={fontWeightChange} name='fontWeight' id='regular' value='400' defaultChecked/>
                            <label htmlFor='regular'>Regular</label>
                            <input type='radio' onChange={fontWeightChange} name='fontWeight' id='medium' value='500'/>
                            <label htmlFor='medium'>Medium</label>
                            <input type='radio' onChange={fontWeightChange} name='fontWeight' id='bold' value='700'/>
                            <label htmlFor='bold'>Bold</label>
                            <input type='radio' onChange={fontWeightChange} name='fontWeight' id='black' value='900'/>
                            <label htmlFor='black'>Black</label>
                        </div>
                    </div>
                </div>
                <FontBox data={list} text={txt}/>
            </div>
        </>
    );
}

export default Main;