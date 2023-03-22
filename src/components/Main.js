import '../css/App.css';
import FontBox from './FontBox';
import SideMenu from './SideMenu';

function Main(props) {
    const textChange = (e) => {
        let textArea = document.getElementsByClassName('font_text');
        for (let i = 0; i < textArea.length; i++) { textArea[i].innerText = e.target.value; }
    }

    const fontWeightChange = (e) => {
        let textArea = document.getElementsByClassName('font_text');
        for (let i = 0; i < textArea.length; i++) { textArea[i].style.fontWeight = e.target.value; }
    }

    const typeFaceChange = (e) => {
        let fontBox = document.getElementsByClassName('font_box');
        if (e.target.checked) {
            for (let i = 0; i < fontBox.length; i++) { fontBox[i].classList.remove('clicked'); fontBox[i].classList.add('fade_in'); setTimeout(function(){fontBox[i].classList.remove('fade_in');},600);; if (fontBox[i].getElementsByClassName('type_face')[0].innerText === e.target.value) { fontBox[i].style.display = 'block'; } }
        }
        else {
            for (let i = 0; i < fontBox.length; i++) { fontBox[i].classList.remove('clicked'); fontBox[i].classList.add('fade_in'); setTimeout(function(){fontBox[i].classList.remove('fade_in');},600); if (fontBox[i].getElementsByClassName('type_face')[0].innerText === e.target.value) { fontBox[i].style.display = 'none'; } }
        }
    }

    const goUp = () => { window.scrollTo({top:0,behavior:'smooth'}); }

    const goGitHub = () => { window.open('https://github.com/taedonn/fonts-archive','_blank'); }

    const goNightMode = () => {
        if(document.body.classList.contains('bright_mode')) {
            document.body.classList.remove('bright_mode');
            document.body.classList.add('night_mode');
        }
        else {
            document.body.classList.remove('night_mode');
            document.body.classList.add('bright_mode');
        }
    }

    return (
        <>
            <SideMenu data={props.data}/>
            <div className='main_menu'>
                <div className='main_menu_fixed'>
                    <div className='search_bar'>
                        <input type='text' placeholder='Type Something' onChange={textChange}/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/>
                        </svg>
                    </div>
                    <div className='category'>
                        <div className='category_1'>
                            <input type='checkbox' id='serif' onChange={typeFaceChange} value='Serif' defaultChecked/>
                            <label htmlFor='serif'>Serif</label>
                            <input type='checkbox' id='sansSerif' onChange={typeFaceChange} value='Sans Serif' defaultChecked/>
                            <label htmlFor='sansSerif'>Sans Serif</label>
                            <input type='checkbox' id='handWriting' onChange={typeFaceChange} value='Hand Writing' defaultChecked/>
                            <label htmlFor='handWriting'>Hand Writing</label>
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
                <FontBox data={props.data}/>
                <div className='profile_fixed'>
                    <div className='profile_star' onClick={goGitHub}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                    </div>
                    <div className='profile_color_mode' onClick={goNightMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>
                    </div>
                    <div className='profile_up' onClick={goUp}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;