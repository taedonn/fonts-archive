import { Link } from "react-router-dom";

function SideMenu({data}) {
    // 서치 기능
    const searchChange = (e) => {
        let fontList = document.getElementsByClassName('font_list')[0].getElementsByClassName('font_name');

        for (let i = 0; i < fontList.length; i++) {
            if (fontList[i].innerText.indexOf(e.target.value) === -1) { fontList[i].style.display = 'none'; }
            else { fontList[i].style.display = 'block'; }
        }
    }

    // 사이드 메뉴 접기 / 펼치기
    const expandChk = (e) => {
        if(e.target.checked) {
            document.getElementsByClassName('wrap')[0].classList.remove('expand');
            document.getElementsByClassName('wrap')[0].classList.add('shrink');
        }
        else {
            document.getElementsByClassName('wrap')[0].classList.remove('shrink');
            document.getElementsByClassName('wrap')[0].classList.add('expand');
        }
    }

    // 사이드 메뉴 마우스오버 시 스크롤 막기
    const sideOnMouseOver = () => { document.body.classList.add('fixed'); }
    const sideOnMouseOut = () => { document.body.classList.remove('fixed'); }

    return (
        <>
            <div className='side_menu' onMouseOver={sideOnMouseOver} onMouseOut={sideOnMouseOut}>
                <div className='expand_btn_wrap'>
                    <input type='checkbox' id='expand_btn' onClick={expandChk} defaultChecked={window.innerWidth > 1080 ? false : true}/>
                    <label htmlFor='expand_btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                    </label>
                </div>
                <div className='title'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                </div>
                <div className='search_bar'>
                    <input type='text' placeholder='Search Fonts' onChange={searchChange}/>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                </div>
                <div className='font_list'>
                    {
                        data.map((dataEach) => 
                            <Link className="font_name" to={`/fonts-archive/DetailPage/${dataEach.c[0].v}`} key={dataEach.c[0].v}>{dataEach.c[1].v}</Link>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default SideMenu;