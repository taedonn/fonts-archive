import '../css/App.css';
import FontBox from './FontBox';
import SideMenu from './SideMenu';

function Main(props) {
    const textChange = (e) => {
        let textArea = document.getElementsByClassName('font_text');
        for (let i = 0; i < textArea.length; i++) { textArea[i].innerText = e.target.value; }
    }

    const fontWeightChange = (e) => {
        let textArea = document.getElementsByClassName('font_box');
        for (let i = 0; i < textArea.length; i++) {
            textArea[i].getElementsByClassName('font_name')[0].style.fontWeight = e.target.value;
            textArea[i].getElementsByClassName('type_face')[0].style.fontWeight = e.target.value;
            textArea[i].getElementsByClassName('font_text')[0].style.fontWeight = e.target.value;
        }
    }

    const typeFaceChange = (e) => {
        let fontBox = document.getElementsByClassName('font_box');
        if (e.target.checked) {
            for (let i = 0; i < fontBox.length; i++) {
                fontBox[i].classList.add('fade_in'); 
                setTimeout(function() { fontBox[i].classList.remove('fade_in'); },600);
                if (props.data[i].c[3].v === e.target.value) { fontBox[i].style.display = 'block'; }
            }
        }
        else {
            for (let i = 0; i < fontBox.length; i++) {
                fontBox[i].classList.add('fade_in');
                setTimeout(function() { fontBox[i].classList.remove('fade_in'); },600);
                if (props.data[i].c[3].v === e.target.value) { fontBox[i].style.display = 'none'; } }
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
            </div>
        </>
    );
}

export default Main;