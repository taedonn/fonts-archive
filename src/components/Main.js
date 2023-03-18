import { useEffect } from 'react';
import '../css/Main.css';

// 더미 텍스트
const dummyText = '모든 국민은 성별·종교 또는 사회적 신분에 의하여 정치적, 경제적, 사회적, 문화적 생활의 모든 영역에 있어서 차별을 받지 아니한다.';

function Main() {
  useEffect(() => {
    // 브라잇 모드 / 나잇 모드
    document.body.classList.add('bright_mode');

    // 데이터 연동
    const base = 'https://docs.google.com/spreadsheets/d/1ryt-0PI5_hWA3AnP0gcyTRyKh8kqAooApts_cI0yhQ0/gviz/tq?';
    const sheetName = 'fonts';
    const query = 'Select A,B,C,D,E,F,G,H,I,J,K,L,M';
    const url = base + '&sheet=' + sheetName + '&tq=' + query;

    fetch(url)
        .then(res => res.text())
        .then(rep => {
          // JSON만 추출
          let data = JSON.parse(rep.substring(47).slice(0, -2));
          let item = data.table.rows;

          // 헤더에 폰트 링크 삽입
          for (let i = 1; i < item.length; i++) { document.head.innerHTML += '<link rel="stylesheet" href="'+item[i].c[9].v+'"/>' }

          // 메인에 폰트 박스 삽입
          document.getElementsByClassName('font_area_wrap')[0].innerHTML = '';
          for (let i = 1; i < item.length; i++) {
              document.getElementsByClassName('font_area_wrap')[0].innerHTML += 
              '<div class="font_box" data-num="'+(i+1)+'">'
                +'<div class="font_name">'+item[i].c[1].v+'</div>'
                +'<div class="type_face">'+item[i].c[4].v+'</div>'
                +'<div class="font_text" style="font-family:'+item[i].c[2].v+';">'+dummyText+'</div>'
                +'<svg class="close_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>'
                +'<div class="font_detail_page_divider"></div>'
                +'<div class="font_detail_page_wrap">'
                  +'<div class="font_detail_page">'
                    +'<div class="download_btn_wrap">'
                      +'<a class="source_btn" style="background-color:'+item[i].c[6].v+'; color:'+item[i].c[7].v+'" href="'+item[i].c[8].v+'" target="_blank">'+item[i].c[5].v+'에서 다운받기</a>'
                    +'</div>'
                    +'<div class="cdn_wrap">'
                      +'<input type="radio" id="cdn_css_'+i+'" name="cdn_'+i+'" checked/>'
                      +'<label for="cdn_css_'+i+'">CSS 설정하기</label>'
                      +'<input type="radio" id="cdn_link_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_link_'+i+'">link 방식</label>'
                      +'<input type="radio" id="cdn_import_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_import_'+i+'">import 방식</label>'
                      +'<input type="radio" id="cdn_url_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_url_'+i+'">URL 방식</label>'
                      +'<div class="cdn_code_divider"></div>'
                      +'<div class="cdn_code_wrap">'
                        +'<div class="cdn_code cdn_code_css"><div>'+item[i].c[10].v+'</div></div>'
                        +'<div class="cdn_code cdn_code_link"><div>'+item[i].c[11].v+'</div></div>'
                        +'<div class="cdn_code cdn_code_import"><div>'+item[i].c[12].v+'</div></div>'
                        +'<div class="cdn_code cdn_code_url"><div>'+item[i].c[9].v+'</div></div>'
                      +'</div>'
                    +'</div>'
                  +'</div>'
                +'</div>'
              +'</div>'
          }
          document.getElementsByClassName('font_area_wrap')[0].innerHTML += '<div class="font_box_empty">';

          // 사이드에 폰트 리스트 삽입
          document.getElementsByClassName('font_list')[0].innerHTML = '';
          for (let i = 1; i < item.length; i++) { document.getElementsByClassName('font_list')[0].innerHTML += '<div class="font_name">'+item[i].c[1].v+'</div>' }
      })
      .then(() => {
          let fontBox = document.getElementsByClassName('font_box');
          for (let i = 0; i < fontBox.length; i++) {
            fontBox[i].addEventListener('click', () => {
              for (let o = 0; o < fontBox.length; o++) { fontBox[o].classList.remove('clicked'); }
              fontBox[i].classList.add('clicked');
            })
          }

          let closeBtn = document.getElementsByClassName('close_btn');
          for (let i = 0; i < closeBtn.length; i++) {
            closeBtn[i].addEventListener('click', () => { for (let o = 0; o < fontBox.length; o++) { if (fontBox[o].classList.contains('clicked')) { setTimeout(function(){fontBox[o].classList.remove('clicked')},0); } } })
          }
      });
  })

  const textChange = (e) => {
    let textArea = document.getElementsByClassName('font_text');
    for (let i = 0; i < textArea.length; i++) {
      textArea[i].innerText = e.target.value;
    }
  }

  const fontWeightChange = (e) => {
    let textArea = document.getElementsByClassName('font_text');
    for (let i = 0; i < textArea.length; i++) {
      textArea[i].style.fontWeight = e.target.value;
    }
  }

  const typeFaceChange = (e) => {
    let fontBox = document.getElementsByClassName('font_box');
    if (e.target.checked) {
      for (let i = 0; i < fontBox.length; i++) { fontBox[i].classList.remove('clicked'); if (fontBox[i].getElementsByClassName('type_face')[0].innerText === e.target.value) { fontBox[i].style.display = 'block'; } }
    }
    else {
      for (let i = 0; i < fontBox.length; i++) { fontBox[i].classList.remove('clicked'); if (fontBox[i].getElementsByClassName('type_face')[0].innerText === e.target.value) { fontBox[i].style.display = 'none'; } }
    }
  }

  const searchChange = (e) => {
    let fontList = document.getElementsByClassName('font_list')[0].getElementsByClassName('font_name');
    let fontBox = document.getElementsByClassName('font_box');
    let typeFace = document.getElementsByClassName('category_1')[0].getElementsByTagName('input');

    for (let i = 0; i < fontList.length; i++) {
      if (fontList[i].innerText.indexOf(e.target.value) === -1) { fontList[i].style.display = 'none'; fontBox[i].style.display = 'none'; fontBox[i].classList.remove('clicked'); for(let o = 0; o < typeFace.length; o++) { typeFace[o].checked = true; } }
      else { fontList[i].style.display = 'block'; fontBox[i].style.display = 'block'; }
    }
  }

  return (
    <>
        <div className='wrap'>
            <div className='side_menu'>
              <div className='title'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/>
                </svg>
              </div>
              <div className='search_bar'>
                <input type='text' placeholder='Search Fonts' onChange={searchChange}/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </div>
              <div className='font_list'></div>
            </div>
            <div className='main_menu'>
              <div className='search_bar'>
                <input type='text' placeholder='Type Something' onChange={textChange} defaultValue={dummyText}/>
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
              <div className='font_area_wrap'></div>
              <div className='font_detail_page'></div>
            </div>
        </div>
    </>
  );
}

export default Main;