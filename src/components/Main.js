import { useRef, useEffect, useState } from 'react';
import '../css/App.css';
import FontBox from './FontBox';
import SideMenu from './SideMenu';

function Main(props) {
    const defaultList = props.data;
    const defaultFontWeight = "400"
    const defaultSortby = "latest";
    const [list, setList] = useState(defaultList);
    const [fontWeight, setFontWeight] = useState(defaultFontWeight);
    const [sortby, setSortby] = useState(defaultSortby);
    const [txt, setTxt] = useState("");
    const [fontWeightBox, setFontWeightBox] = useState("400");
    const [sortbyBox, setSortbyBox] = useState("최신순");


    useEffect(() => { setList(defaultList); },[defaultList]);
    useEffect(() => { setFontWeight(defaultFontWeight); },[defaultFontWeight]);
    useEffect(() => { setSortby(defaultSortby); },[defaultSortby]);

    /* 
        셀렉트박스 외 영역 클릭 시 셀렉트박스 클릭 해제 끝
        ----------------------------------------------
    */
    const searchRef1_1 = useRef(null);
    const searchRef1_2 = useRef(null);
    const searchRef2_1 = useRef(null);
    const searchRef2_2 = useRef(null);
    const searchRef3_1 = useRef(null);
    const searchRef3_2 = useRef(null);
    const searchRef4_1 = useRef(null);
    const searchRef4_2 = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (searchRef1_1.current && !searchRef1_1.current.contains(e.target) && !searchRef1_2.current.contains(e.target)) {
                document.getElementById('category_1_select').checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside);
        return () => { document.removeEventListener("mouseup", handleOutside); };
    }, [searchRef1_1]);

    useEffect(() => {
        function handleOutside2(e) {
            if (searchRef2_1.current && !searchRef2_1.current.contains(e.target) && !searchRef2_2.current.contains(e.target)) {
                document.getElementById('category_2_select').checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside2);
        return () => { document.removeEventListener("mouseup", handleOutside2); };
    }, [searchRef2_1]);

    useEffect(() => {
        function handleOutside2(e) {
            if (searchRef3_1.current && !searchRef3_1.current.contains(e.target) && !searchRef3_2.current.contains(e.target)) {
                document.getElementById('category_3_select').checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside2);
        return () => { document.removeEventListener("mouseup", handleOutside2); };
    }, [searchRef3_1]);

    useEffect(() => {
        function handleOutside3(e) {
            if (searchRef3_1.current && !searchRef3_1.current.contains(e.target) && !searchRef3_2.current.contains(e.target)) {
                document.getElementById('category_3_select').checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside3);
        return () => { document.removeEventListener("mouseup", handleOutside3); };
    }, [searchRef3_1]);

    useEffect(() => {
        function handleOutside4(e) {
            if (searchRef4_1.current && !searchRef4_1.current.contains(e.target) && !searchRef4_2.current.contains(e.target)) {
                document.getElementById('category_4_select').checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside4);
        return () => { document.removeEventListener("mouseup", handleOutside4); };
    }, [searchRef4_1]);

    const handleChange = (e) => {
        if (e.target.checked) {
            document.getElementsByClassName('category_option_1')[0].classList.add('fade_in');
            setTimeout(function() { document.getElementsByClassName('category_option_1')[0].classList.remove('fade_in'); },600);
        }
    }

    const handleChange2 = (e) => {
        if (e.target.checked) {
            document.getElementsByClassName('category_option_2')[0].classList.add('fade_in');
            setTimeout(function() { document.getElementsByClassName('category_option_2')[0].classList.remove('fade_in'); },600);
        }
    }

    const handleChange3 = (e) => {
        if (e.target.checked) {
            document.getElementsByClassName('category_option_3')[0].classList.add('fade_in');
            setTimeout(function() { document.getElementsByClassName('category_option_3')[0].classList.remove('fade_in'); },600);
        }
    }

    const handleChange4 = (e) => {
        if (e.target.checked) {
            document.getElementsByClassName('category_option_4')[0].classList.add('fade_in');
            setTimeout(function() { document.getElementsByClassName('category_option_4')[0].classList.remove('fade_in'); },600);
        }
    }
    /* 
        셀렉트박스 외 영역 클릭 시 셀렉트박스 클릭 해제 끝
        ----------------------------------------------
    */

    const textChange = (e) => {
        if (e.target.value === "") { setTxt("원하는 문구를 적어보세요"); }
        else { setTxt(e.target.value); }
        let textArea = document.getElementsByClassName('font_text');
        for (let i = 0; i < textArea.length; i++) {
            if (e.target.value === "") {
                if (textArea[i].id === "KR") { textArea[i].innerText = "원하는 문구를 적어보세요"; }
                else { textArea[i].innerText = "Type something."; }
            }
            else { textArea[i].innerText = e.target.value; }
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
        filterData(defaultList, typeFaceChk, sortby);
    }

    const filterData = (data, checkedValue, sort) => {
        let filteredData = data.filter((item) => checkedValue.includes(item.c[3].v) );
        if (sort === "name") { 
            let dataSortedByName = filteredData.sort(function(a,b) {
                return a.c[1].v.localeCompare(b.c[1].v);
            });
            setList(dataSortedByName);
        }
        else if (sort === "latest") {
            let dataSortedByLatest = filteredData.sort(function(a,b) {
                return b.c[0].v - a.c[0].v;
            });
            setList(dataSortedByLatest);
        }
    }

    const langChange = () => {
        let lang = document.getElementsByClassName('handle_lang');
        let langChk = [];

        // 어떤 언어가 체크되어 있는지 체크
        for (let i = 0; i < lang.length; i++) {
            if (lang[i].checked) { langChk.push(lang[i].value); }
        }

        // 스크롤 맨 위로
        window.scrollTo(0,0);

        // 데이터 필터링
        filterLangData(defaultList, langChk, sortby);
    }

    const filterLangData = (data, checkedValue, sort) => {
        let filteredData = data.filter((item) => checkedValue.includes(item.c[22].v) );
        if (sort === "name") { 
            let dataSortedByName = filteredData.sort(function(a,b) {
                return a.c[1].v.localeCompare(b.c[1].v);
            });
            setList(dataSortedByName);
        }
        else if (sort === "latest") {
            let dataSortedByLatest = filteredData.sort(function(a,b) {
                return b.c[0].v - a.c[0].v;
            });
            setList(dataSortedByLatest);
        }
    }

    const fontWeightChange = (e) => {
        // 어떤 Font Weight가 체크되어 있는지 체크
        if (e.target.checked) { setFontWeight(e.target.value); setFontWeightBox(e.target.value); }
    }

    const sortbyChange = (e) => {
        // 어떤 Sortby가 체크되어 있는지 체크
        if (e.target.checked) {
            setSortby(e.target.value);
            if (e.target.value === "name") {
                let sortbyName = list.sort(function(a,b) {
                    return a.c[1].v.localeCompare(b.c[1].v);
                });
                setList(sortbyName);
                setSortbyBox("이름순");
            }
            else if (e.target.value === "latest") {
                let sortbyLatest = list.sort(function(a,b) {
                    return b.c[0].v - a.c[0].v;
                });
                setList(sortbyLatest);
                setSortbyBox("최신순");
            }
        }

        // 스크롤 맨 위로
        window.scrollTo(0,0);
    }

    return (
        <>
            <SideMenu data={props.fixedDataByName}/>
            <div className='main_menu'>
                <div className='main_menu_fixed'>
                    <div className='search_bar'>
                        <input type='text' placeholder='원하는 문구를 적어보세요' onChange={textChange}/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/>
                        </svg>
                    </div>
                    <div className='category'>
                        <div className='category_box category_1'>
                            <input type='checkbox' id='category_1_select' onChange={handleChange}/>
                            <label className='category_1_select' ref={searchRef1_2} htmlFor='category_1_select'>
                                언어 선택
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                            </label>
                            <div className='category_option category_option_1' ref={searchRef1_1}>
                                <input className='handle_lang' type='checkbox' id='KR' value='KR' onChange={langChange} defaultChecked/>
                                <div className='chk_box'>
                                    <label htmlFor='KR'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>한국어</span>
                                </div>
                                <input className='handle_lang' type='checkbox' id='EN' value='EN' onChange={langChange} defaultChecked/>
                                <div className='chk_box'>
                                    <label htmlFor='EN'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>영어</span>
                                </div>
                            </div>
                        </div>
                        <div className='category_box category_2'>
                            <input type='checkbox' id='category_2_select' onChange={handleChange2}/>
                            <label className='category_2_select' ref={searchRef2_2} htmlFor='category_2_select'>
                                폰트 형태
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                            </label>
                            <div className='category_option category_option_2' ref={searchRef2_1}>
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
                        <div className='category_box category_3'>
                            <input type='checkbox' id='category_3_select' onChange={handleChange3}/>
                            <label className='category_3_select' ref={searchRef3_2} htmlFor='category_3_select'>
                                {sortbyBox}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                            </label>
                            <div className='category_option category_option_3' ref={searchRef3_1}>
                                <input className='handle_sortby' type='radio' id='latest' value='latest' name='sortby' onChange={sortbyChange} defaultChecked/>
                                <div className='chk_box'>
                                    <label htmlFor='latest'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>최신순</span>
                                </div>
                                <input className='handle_sortby' type='radio' id='name' value='name' name='sortby' onChange={sortbyChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='name'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>이름순</span>
                                </div>
                            </div>
                        </div>
                        <div className='category_box category_4'>
                            <input type='checkbox' id='category_4_select' onChange={handleChange4}/>
                            <label className='category_4_select' ref={searchRef4_2} htmlFor='category_4_select'>
                                폰트 두께 ({fontWeightBox})
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
                            </label>
                            <div className='category_option category_option_4' ref={searchRef4_1}>
                                <input className='handle_font_weight' type='radio' id='100' value='100' name='font_weight' onChange={fontWeightChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='100'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>100 Thin</span>
                                </div>
                                <input className='handle_font_weight' type='radio' id='200' value='200' name='font_weight' onChange={fontWeightChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='200'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>200 ExtraLight</span>
                                </div>
                                <input className='handle_font_weight' type='radio' id='300' value='300' name='font_weight' onChange={fontWeightChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='300'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>300 Light</span>
                                </div>
                                <input className='handle_font_weight' type='radio' id='400' value='400' name='font_weight' onChange={fontWeightChange} defaultChecked/>
                                <div className='chk_box'>
                                    <label htmlFor='400'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>400 Regular</span>
                                </div>
                                <input className='handle_font_weight' type='radio' id='500' value='500' name='font_weight' onChange={fontWeightChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='500'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>500 Medium</span>
                                </div>
                                <input className='handle_font_weight' type='radio' id='600' value='600' name='font_weight' onChange={fontWeightChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='600'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>600 Bold</span>
                                </div>
                                <input className='handle_font_weight' type='radio' id='700' value='700' name='font_weight' onChange={fontWeightChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='700'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>700 ExtraBold</span>
                                </div>
                                <input className='handle_font_weight' type='radio' id='800' value='800' name='font_weight' onChange={fontWeightChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='800'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>800 Heavy</span>
                                </div>
                                <input className='handle_font_weight' type='radio' id='900' value='900' name='font_weight' onChange={fontWeightChange}/>
                                <div className='chk_box'>
                                    <label htmlFor='900'>
                                        <svg className='chk_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='chk_fill_btn' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <span>900 Black</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FontBox data={list} text={txt} fontWeight={fontWeight} sortby={sortby}/>
            </div>
        </>
    );
}

export default Main;